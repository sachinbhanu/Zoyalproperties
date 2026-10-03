"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from "@react-three/postprocessing";
import { LazyCanvas } from "@/components/three/LazyCanvas";
import { useDevice } from "@/hooks/useDevice";
import { heroState } from "@/lib/sceneState";
import { BRAND, getGlowTexture, mulberry32, smooth } from "@/components/three/utils";

const FOG_COLOR = new THREE.Color("#060a1c");
const FOG_DENSITY = 0.0095;
const AVENUE_HALF_WIDTH = 11;

/* ------------------------------------------------------------------ */
/* City data                                                          */
/* ------------------------------------------------------------------ */
interface Building {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  seed: number;
}

function buildCity(density: number): Building[] {
  const rand = mulberry32(2026);
  const cell = 5.4;
  const out: Building[] = [];
  for (let gx = -16; gx <= 16; gx++) {
    for (let gz = -34; gz <= 4; gz++) {
      const x = gx * cell + (rand() - 0.5) * 1.4;
      const z = gz * cell + (rand() - 0.5) * 1.4;
      if (Math.abs(x) < AVENUE_HALF_WIDTH) continue;
      if (rand() > density) continue;
      const centerBias = 1 - Math.min(1, Math.abs(x) / 90);
      const farBias = smooth(Math.min(1, Math.max(0, -z / 150)));
      let h = 4 + Math.pow(rand(), 2.3) * 32 * (0.55 + centerBias) + farBias * 12 * rand();
      if (rand() < 0.07) h += 24 + rand() * 38;
      out.push({ x, z, w: 2.3 + rand() * 2.3, d: 2.3 + rand() * 2.3, h, seed: rand() });
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Shaders                                                            */
/* ------------------------------------------------------------------ */
const buildingVertex = /* glsl */ `
  attribute float aSeed;
  varying vec3 vLocal;
  varying vec3 vSize;
  varying vec3 vNormalL;
  varying float vSeed;
  varying float vDist;
  void main() {
    vec3 size = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
    vec4 worldPos = modelMatrix * instanceMatrix * vec4(position, 1.0);
    vec4 mv = viewMatrix * worldPos;
    vLocal = position;
    vSize = size;
    vNormalL = normal;
    vSeed = aSeed;
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const buildingFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  uniform vec3 uCyan;
  uniform vec3 uViolet;
  uniform vec3 uGold;
  varying vec3 vLocal;
  varying vec3 vSize;
  varying vec3 vNormalL;
  varying float vSeed;
  varying float vDist;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

  void main() {
    vec3 n = normalize(vNormalL);
    float side = step(abs(n.y), 0.5);
    float top = step(0.5, n.y);

    float u = abs(n.x) > 0.5 ? vLocal.z * vSize.z : vLocal.x * vSize.x;
    float v = vLocal.y * vSize.y;

    // facade light
    float light = 0.28 + 0.72 * max(dot(n, normalize(vec3(-0.45, 0.8, 0.55))), 0.0);
    vec3 base = mix(vec3(0.018, 0.026, 0.07), vec3(0.07, 0.09, 0.2), clamp(vLocal.y * 0.9, 0.0, 1.0));
    base *= light;
    base += uViolet * 0.04 * smoothstep(0.4, 1.0, vLocal.y) * side;
    base += top * vec3(0.05, 0.1, 0.2);

    // windows
    vec2 cellSize = vec2(0.62, 0.9);
    vec2 cell = floor(vec2(u + 50.0, v) / cellSize);
    vec2 f = fract(vec2(u + 50.0, v) / cellSize);
    float win = step(0.2, f.x) * step(f.x, 0.8) * step(0.25, f.y) * step(f.y, 0.75);
    float faceId = dot(n, vec3(1.7, 3.3, 5.1));
    float h = hash(cell + vSeed * 91.0 + faceId);
    float flick = 0.08 * sin(uTime * 0.6 + h * 60.0);
    float lit = step(0.6, h + flick);
    float groundFloors = step(1.8, v);

    float tintPick = fract(vSeed * 13.7);
    vec3 tint = tintPick < 0.45 ? uGold : (tintPick < 0.85 ? uCyan : uViolet);
    tint = mix(tint, vec3(1.0, 0.95, 0.85), hash(cell + 7.0) * 0.35);
    float intensity = 0.8 + 1.7 * hash(cell + 3.3);

    vec3 col = base + tint * win * lit * side * groundFloors * intensity;

    // fog
    float fog = 1.0 - exp(-uFogDensity * uFogDensity * vDist * vDist);
    col = mix(col, uFogColor, clamp(fog, 0.0, 1.0));
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

const groundVertex = /* glsl */ `
  varying vec3 vWorld;
  varying float vDist;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    vec4 mv = viewMatrix * wp;
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const groundFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  varying vec3 vWorld;
  varying float vDist;
  void main() {
    vec2 p = vWorld.xz;
    vec2 gp = p / 5.4;
    vec2 gv = abs(fract(gp - 0.5) - 0.5) / fwidth(gp);
    float line = 1.0 - min(min(gv.x, gv.y), 1.0);

    vec3 col = vec3(0.010, 0.016, 0.042);
    col += vec3(0.05, 0.5, 0.75) * line * 0.38;

    float av = smoothstep(${AVENUE_HALF_WIDTH.toFixed(1)}, 0.0, abs(p.x));
    col += vec3(0.08, 0.16, 0.45) * av * 0.22;

    float lane = smoothstep(0.18, 0.0, abs(p.x)) * step(0.5, fract(p.y * 0.16 + uTime * 0.45));
    col += vec3(1.0, 0.72, 0.3) * lane * 1.4;

    float edge = smoothstep(0.12, 0.0, abs(abs(p.x) - ${(AVENUE_HALF_WIDTH - 1.1).toFixed(1)}));
    col += vec3(0.1, 0.9, 1.0) * edge * 1.5;

    float fog = 1.0 - exp(-uFogDensity * uFogDensity * vDist * vDist);
    col = mix(col, uFogColor, clamp(fog, 0.0, 1.0));
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

const skyFragment = /* glsl */ `
  varying vec3 vDir;
  void main() {
    float h = clamp(vDir.y, -0.2, 1.0);
    vec3 horizon = vec3(0.22, 0.12, 0.5);
    vec3 mid = vec3(0.04, 0.07, 0.2);
    vec3 zenith = vec3(0.012, 0.018, 0.06);
    vec3 col = mix(horizon, mid, smoothstep(0.0, 0.25, h));
    col = mix(col, zenith, smoothstep(0.2, 0.9, h));
    // low sun / moon glow on the horizon
    vec3 sunDir = normalize(vec3(0.15, 0.1, -1.0));
    float s = max(dot(normalize(vDir), sunDir), 0.0);
    col += vec3(1.0, 0.55, 0.3) * pow(s, 24.0) * 0.55 + vec3(0.2, 0.7, 1.0) * pow(s, 6.0) * 0.18;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

/* ------------------------------------------------------------------ */
/* Scene parts                                                        */
/* ------------------------------------------------------------------ */
function Skyline({ density }: { density: number }) {
  const buildings = useMemo(() => buildCity(density), [density]);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const stripRef = useRef<THREE.InstancedMesh>(null);
  const beaconRef = useRef<THREE.InstancedMesh>(null);

  const geometry = useMemo(() => {
    const g = new THREE.BoxGeometry(1, 1, 1);
    g.translate(0, 0.5, 0);
    g.setAttribute("aSeed", new THREE.InstancedBufferAttribute(new Float32Array(buildings.map((b) => b.seed)), 1));
    return g;
  }, [buildings]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: buildingVertex,
        fragmentShader: buildingFragment,
        uniforms: {
          uTime: { value: 0 },
          uFogColor: { value: FOG_COLOR },
          uFogDensity: { value: FOG_DENSITY },
          uCyan: { value: BRAND.cyan },
          uViolet: { value: BRAND.violet },
          uGold: { value: BRAND.gold },
        },
      }),
    []
  );

  const towers = useMemo(() => [...buildings].sort((a, b) => b.h - a.h).slice(0, 70), [buildings]);
  const unitBox = useMemo(() => {
    const g = new THREE.BoxGeometry(1, 1, 1);
    g.translate(0, 0.5, 0);
    return g;
  }, []);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();
    const mesh = meshRef.current;
    if (mesh) {
      buildings.forEach((b, i) => {
        m.compose(p.set(b.x, 0, b.z), q, s.set(b.w, b.h, b.d));
        mesh.setMatrixAt(i, m);
      });
      mesh.instanceMatrix.needsUpdate = true;
    }

    const strips = stripRef.current;
    const beacons = beaconRef.current;
    const palette = [BRAND.cyan, BRAND.violet, BRAND.gold];
    const c = new THREE.Color();
    towers.forEach((b, i) => {
      if (strips) {
        const corner = i % 2 === 0 ? 1 : -1;
        m.compose(p.set(b.x + (b.w / 2) * corner, 0, b.z + (b.d / 2) * corner), q, s.set(0.12, b.h * 0.97, 0.12));
        strips.setMatrixAt(i, m);
        strips.setColorAt(i, c.copy(palette[i % 3]).multiplyScalar(3.2));
      }
      if (beacons) {
        m.compose(p.set(b.x, b.h + 0.25, b.z), q, s.set(b.w * 0.45, 0.4, b.d * 0.45));
        beacons.setMatrixAt(i, m);
        beacons.setColorAt(i, c.set("#ffe2b0").multiplyScalar(4));
      }
    });
    if (strips) {
      strips.instanceMatrix.needsUpdate = true;
      if (strips.instanceColor) strips.instanceColor.needsUpdate = true;
    }
    if (beacons) {
      beacons.instanceMatrix.needsUpdate = true;
      if (beacons.instanceColor) beacons.instanceColor.needsUpdate = true;
    }
  }, [buildings, towers]);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[geometry, material, buildings.length]} frustumCulled={false} />
      <instancedMesh ref={stripRef} args={[unitBox, undefined, towers.length]} frustumCulled={false}>
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={beaconRef} args={[undefined, undefined, towers.length]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </>
  );
}

function Ground() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: groundVertex,
        fragmentShader: groundFragment,
        uniforms: { uTime: { value: 0 }, uFogColor: { value: FOG_COLOR }, uFogDensity: { value: FOG_DENSITY } },
      }),
    []
  );
  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -90]} material={material}>
      <planeGeometry args={[700, 700]} />
    </mesh>
  );
}

function Traffic({ count, animate }: { count: number; animate: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const cars = useMemo(() => {
    const rand = mulberry32(99);
    const lanes = [-8.8, -6.8, -4.8, 4.8, 6.8, 8.8];
    return Array.from({ length: count }, () => {
      const lane = lanes[Math.floor(rand() * lanes.length)];
      return { x: lane, z0: rand() * 240 - 190, speed: 6 + rand() * 9 };
    });
  }, [count]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const c = new THREE.Color();
    cars.forEach((car, i) => {
      // oncoming lanes (x>0) show warm headlights, outgoing lanes show red/violet tail-lights
      mesh.setColorAt(i, car.x > 0 ? c.set("#ffd9a0").multiplyScalar(4.5) : c.set("#ff4d7d").multiplyScalar(3.8));
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [cars]);

  const m = useMemo(() => new THREE.Matrix4(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);
  const p = useMemo(() => new THREE.Vector3(), []);
  const s = useMemo(() => new THREE.Vector3(0.55, 0.28, 1.6), []);

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = animate ? state.clock.elapsedTime : 0;
    cars.forEach((car, i) => {
      // travel along z; wrap in the range [-190, 50]
      const range = 240;
      let z = car.z0 + (car.x > 0 ? 1 : -1) * car.speed * t;
      z = ((((z + 190) % range) + range) % range) - 190;
      m.compose(p.set(car.x, 0.2, z), q, s);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

function Sky() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        vertexShader: /* glsl */ `
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: skyFragment,
      }),
    []
  );
  return (
    <mesh material={material} renderOrder={-10} frustumCulled={false}>
      <sphereGeometry args={[480, 32, 16]} />
    </mesh>
  );
}

function Particles({ count, animate }: { count: number; animate: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => {
    const rand = mulberry32(5);
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [BRAND.cyan, BRAND.violet, BRAND.gold];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rand() - 0.5) * 120;
      pos[i * 3 + 1] = 2 + rand() * 60;
      pos[i * 3 + 2] = 40 - rand() * 220;
      const c = palette[Math.floor(rand() * 3)];
      col.set([c.r, c.g, c.b], i * 3);
    }
    return { positions: pos, colors: col };
  }, [count]);
  const map = useMemo(() => getGlowTexture(), []);

  useFrame((state, dt) => {
    if (!ref.current || !animate) return;
    ref.current.rotation.y += dt * 0.004;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.8;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.55} map={map} vertexColors transparent opacity={0.85} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}

function CameraRig({ animate }: { animate: boolean }) {
  const look = useMemo(() => new THREE.Vector3(0, 14, -30), []);
  useFrame((state, dt) => {
    const cam = state.camera as THREE.PerspectiveCamera;
    const p = animate ? heroState.progress : 0;
    const e = smooth(Math.min(1, Math.max(0, p)));
    const t = animate ? state.clock.elapsedTime : 0;
    const mx = animate ? heroState.mouseX : 0;
    const my = animate ? heroState.mouseY : 0;

    const tx = mx * 3.5 + Math.sin(t * 0.22) * 1.3 + Math.sin(p * 5) * 2.4;
    const ty = 14 - e * 8 + my * 1.6 + Math.sin(t * 0.3) * 0.3;
    const tz = 46 - e * 150;
    const k = 1 - Math.exp(-dt * 2.6);
    cam.position.x += (tx - cam.position.x) * k;
    cam.position.y += (ty - cam.position.y) * k;
    cam.position.z += (tz - cam.position.z) * k;

    const lx = mx * 9 + Math.sin(p * 5) * 4;
    const ly = 19 + e * 6 - my * 3.5;
    look.x += (lx - look.x) * k;
    look.y += (ly - look.y) * k;
    look.z = cam.position.z - 60;
    cam.lookAt(look);
    cam.rotateZ(-mx * 0.025);

    const fov = 55 + e * 14;
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
  });
  return null;
}

/* ------------------------------------------------------------------ */
/* Public component                                                   */
/* ------------------------------------------------------------------ */
export default function HeroScene() {
  const { tier, reducedMotion } = useDevice();
  const high = tier === "high";
  const chroma = useMemo(() => new THREE.Vector2(0.0007, 0.0007), []);

  return (
    <LazyCanvas className="absolute inset-0" camera={{ fov: 55, near: 0.1, far: 520, position: [0, 14, 46] }} margin="0px" alpha={false}>
      <color attach="background" args={["#060a1c"]} />
      <fogExp2 attach="fog" args={[FOG_COLOR, FOG_DENSITY]} />
      <Sky />
      <Skyline density={high ? 0.92 : 0.5} />
      <Ground />
      <Traffic count={high ? 110 : 36} animate={!reducedMotion} />
      <Particles count={high ? 1400 : 380} animate={!reducedMotion} />
      <CameraRig animate={!reducedMotion} />
      {high && (
        <EffectComposer multisampling={4}>
          <Bloom intensity={1.15} luminanceThreshold={0.55} luminanceSmoothing={0.25} mipmapBlur radius={0.75} />
          <ChromaticAberration offset={chroma} radialModulation={false} modulationOffset={0} />
          <Vignette eskil={false} offset={0.25} darkness={0.75} />
        </EffectComposer>
      )}
    </LazyCanvas>
  );
}
