"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html, QuadraticBezierLine } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import type { MotionValue } from "framer-motion";
import { LazyCanvas } from "@/components/three/LazyCanvas";
import { useDevice } from "@/hooks/useDevice";
import { INDIA_OUTLINE, mapLocations, type MapLocation } from "@/data/content";
import { projectCountByCity } from "@/data/properties";
import { mulberry32 } from "@/components/three/utils";

const SCALE = 0.34;
const project = (lon: number, lat: number): [number, number] => [(lon - 82.5) * SCALE, (lat - 22) * SCALE];

function pointInPolygon(x: number, y: number, poly: [number, number][]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function nodePosition(loc: MapLocation): [number, number] {
  const [x, y] = project(loc.lon, loc.lat);
  const [ox, oy] = loc.offset ?? [0, 0];
  return [x + ox * SCALE, y + oy * SCALE];
}

/* ---------------------------- dotted landmass ---------------------------- */
const dotVertex = /* glsl */ `
  attribute float aRand;
  uniform float uTime;
  uniform float uScale;
  uniform vec3 uActive;
  varying float vRand;
  varying float vBoost;
  void main() {
    vec3 p = position;
    float d = distance(p.xy, uActive.xy);
    float boost = uActive.z * smoothstep(1.5, 0.0, d);
    p.z += sin(uTime * 1.1 + aRand * 20.0 + p.x * 1.6) * 0.035 + boost * 0.28;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (0.115 + aRand * 0.04 + boost * 0.09) * uScale / -mv.z;
    vRand = aRand;
    vBoost = boost;
  }
`;
const dotFragment = /* glsl */ `
  varying float vRand;
  varying float vBoost;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, r);
    vec3 cyan = vec3(0.13, 0.83, 0.93);
    vec3 violet = vec3(0.55, 0.36, 0.96);
    vec3 gold = vec3(0.96, 0.75, 0.35);
    vec3 col = mix(cyan, violet, vRand * 0.7);
    col = mix(col, gold, clamp(vBoost * 1.2, 0.0, 1.0));
    gl_FragColor = vec4(col * (1.0 + vBoost * 2.2), a * (0.85 + vBoost * 0.15));
  }
`;

function Landmass({ activePos, activeStrength }: { activePos: React.MutableRefObject<THREE.Vector2>; activeStrength: React.MutableRefObject<number> }) {
  const { positions, rands } = useMemo(() => {
    const rand = mulberry32(31);
    const pos: number[] = [];
    const rs: number[] = [];
    const step = 0.42;
    for (let lon = 67.5; lon <= 98; lon += step) {
      for (let lat = 7.5; lat <= 36; lat += step) {
        if (pointInPolygon(lon, lat, INDIA_OUTLINE)) {
          const [x, y] = project(lon + (rand() - 0.5) * 0.15, lat + (rand() - 0.5) * 0.15);
          pos.push(x, y, 0);
          rs.push(rand());
        }
      }
    }
    return { positions: new Float32Array(pos), rands: new Float32Array(rs) };
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: dotVertex,
        fragmentShader: dotFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uScale: { value: 500 }, uActive: { value: new THREE.Vector3(99, 99, 0) } },
      }),
    []
  );

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uScale.value = state.size.height * state.viewport.dpr * 0.5;
    const u = material.uniforms.uActive.value as THREE.Vector3;
    u.x = activePos.current.x;
    u.y = activePos.current.y;
    u.z += (activeStrength.current - u.z) * 0.1;
  });

  return (
    <points frustumCulled={false} material={material}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRand" args={[rands, 1]} />
      </bufferGeometry>
    </points>
  );
}

/* --------------------------------- nodes --------------------------------- */
interface NodeProps {
  loc: MapLocation;
  active: boolean;
  onActive: (city: string | null) => void;
  onSelect: (city: string) => void;
}

function CityNode({ loc, active, onActive, onSelect }: NodeProps) {
  const [x, y] = nodePosition(loc);
  const count = projectCountByCity(loc.city);
  const beamH = 0.55 + count * 0.1;
  const core = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const coreMat = useRef<THREE.MeshBasicMaterial>(null);
  const phase = useMemo(() => Math.random() * 3, []);
  const cyan = useMemo(() => new THREE.Color(0.3, 2.6, 3.4), []);
  const gold = useMemo(() => new THREE.Color(4, 2.6, 0.6), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime + phase;
    if (core.current) {
      const s = THREE.MathUtils.lerp(core.current.scale.x, active ? 1.7 : 1, 0.15);
      core.current.scale.setScalar(s);
    }
    coreMat.current?.color.lerp(active ? gold : cyan, 0.15);
    if (ring.current) {
      const k = (t * 0.7) % 1;
      ring.current.scale.setScalar(1 + k * (active ? 3.4 : 2.4));
      (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - k) * (active ? 0.9 : 0.55);
    }
  });

  return (
    <group position={[x, y, 0.04]}>
      <mesh ref={core}>
        <sphereGeometry args={[0.085, 20, 20]} />
        <meshBasicMaterial ref={coreMat} color={[0.3, 2.6, 3.4]} toneMapped={false} />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[0.12, 0.14, 48]} />
        <meshBasicMaterial color={[0.4, 2.4, 3]} toneMapped={false} transparent opacity={0.5} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, beamH / 2]}>
        <cylinderGeometry args={[0.012, 0.012, beamH, 6]} />
        <meshBasicMaterial color={active ? [4, 2.6, 0.6] : [0.3, 2.2, 3]} toneMapped={false} transparent opacity={0.85} />
      </mesh>

      {/* generous invisible hit target */}
      <mesh
        position={[0, 0, 0.1]}
        onPointerOver={(e) => {
          e.stopPropagation();
          onActive(loc.city);
        }}
        onPointerOut={() => onActive(null)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(loc.city);
        }}
      >
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <Html position={[0, 0, beamH + 0.05]} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
        {active ? (
          <div className="glass glow-border pointer-events-none w-56 -translate-y-[calc(100%+0.4rem)] rounded-2xl p-4 text-left shadow-2xl">
            <p className="font-display text-lg font-semibold text-fg">{loc.city}</p>
            <p className="mt-0.5 text-xs text-muted">{loc.blurb}</p>
            <p className="mt-3 flex items-baseline gap-1.5">
              <span className="text-gradient font-display text-3xl font-semibold">{count}</span>
              <span className="text-xs uppercase tracking-widest text-muted">{count === 1 ? "project" : "projects"}</span>
            </p>
            <p className="mt-2 text-[11px] text-cyan">Click to view properties →</p>
          </div>
        ) : (
          <span className="pointer-events-none -translate-y-2 whitespace-nowrap rounded-full border border-white/10 bg-[rgb(4_7_18)]/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/80 backdrop-blur">
            {loc.city}
          </span>
        )}
      </Html>
    </group>
  );
}

/* --------------------------------- arcs --------------------------------- */
const ARCS: [string, string][] = [
  ["Delhi", "Mumbai"],
  ["Delhi", "Hyderabad"],
  ["Delhi", "Bengaluru"],
  ["Mumbai", "Pune"],
  ["Mumbai", "Bengaluru"],
  ["Hyderabad", "Bengaluru"],
];

function Arc({ from, to, animate }: { from: MapLocation; to: MapLocation; animate: boolean }) {
  const ref = useRef<React.ElementRef<typeof QuadraticBezierLine>>(null);
  const [ax, ay] = nodePosition(from);
  const [bx, by] = nodePosition(to);
  const dist = Math.hypot(bx - ax, by - ay);
  useFrame((_, dt) => {
    if (ref.current && animate) (ref.current.material as THREE.Material & { dashOffset: number }).dashOffset -= dt * 0.6;
  });
  return (
    <QuadraticBezierLine
      ref={ref}
      start={[ax, ay, 0.05]}
      end={[bx, by, 0.05]}
      mid={[(ax + bx) / 2, (ay + by) / 2, 0.15 + dist * 0.35]}
      color={new THREE.Color(0.3, 1.6, 2.2)}
      lineWidth={1.1}
      dashed
      dashScale={14}
      dashSize={0.6}
      gapSize={0.5}
      transparent
      opacity={0.7}
    />
  );
}

/* --------------------------------- scene --------------------------------- */
interface SceneProps {
  active: string | null;
  onActive: (city: string | null) => void;
  onSelect: (city: string) => void;
  progress?: MotionValue<number>;
}

function MapGroup({ active, onActive, onSelect, progress, animate }: SceneProps & { animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const activePos = useRef(new THREE.Vector2(99, 99));
  const activeStrength = useRef(0);

  useLayoutEffect(() => {
    const loc = mapLocations.find((l) => l.city === active);
    if (loc) {
      const [x, y] = nodePosition(loc);
      activePos.current.set(x, y);
      activeStrength.current = 1;
    } else {
      activeStrength.current = 0;
    }
  }, [active]);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const p = animate && progress ? progress.get() : 0.5;
    const targetX = -0.5 - p * 0.35 + (animate ? -state.pointer.y * 0.08 : 0);
    const targetY = (animate ? state.pointer.x * 0.18 : 0) + (p - 0.5) * 0.25;
    const k = 1 - Math.exp(-dt * 3);
    g.rotation.x += (targetX - g.rotation.x) * k;
    g.rotation.y += (targetY - g.rotation.y) * k;
    g.position.y += (-0.2 - g.position.y) * k;
  });

  return (
    <group ref={group} position={[0, -0.2, 0]}>
      <Landmass activePos={activePos} activeStrength={activeStrength} />
      {mapLocations.map((loc) => (
        <CityNode key={loc.city} loc={loc} active={active === loc.city} onActive={onActive} onSelect={onSelect} />
      ))}
      {ARCS.map(([a, b]) => {
        const from = mapLocations.find((l) => l.city === a)!;
        const to = mapLocations.find((l) => l.city === b)!;
        return <Arc key={a + b} from={from} to={to} animate={animate} />;
      })}
    </group>
  );
}

export default function IndiaMapScene(props: SceneProps) {
  const { tier, reducedMotion } = useDevice();
  return (
    <LazyCanvas className="absolute inset-0" camera={{ fov: 38, near: 0.1, far: 100, position: [0, 0, 13.2] }} margin="100px">
      <MapGroup {...props} animate={!reducedMotion} />
      {tier === "high" && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.9} luminanceThreshold={0.6} luminanceSmoothing={0.3} mipmapBlur radius={0.65} />
        </EffectComposer>
      )}
    </LazyCanvas>
  );
}
