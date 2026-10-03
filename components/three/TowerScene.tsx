"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import type { MotionValue } from "framer-motion";
import { LazyCanvas } from "@/components/three/LazyCanvas";
import { useDevice } from "@/hooks/useDevice";
import { BRAND, mulberry32 } from "@/components/three/utils";

const FLOORS = 40;
const FLOOR_H = 0.36;

function useWindowTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 32;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 256, 32);
    const rand = mulberry32(11);
    const palette = ["#7be8ff", "#ffd89a", "#b9a4ff", "#ffffff"];
    for (let i = 0; i < 16; i++) {
      if (rand() > 0.32) {
        ctx.fillStyle = palette[Math.floor(rand() * palette.length)];
        ctx.globalAlpha = 0.5 + rand() * 0.5;
        ctx.fillRect(i * 16 + 3, 6, 10, 20);
      }
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    return tex;
  }, []);
}

function Tower({ animate }: { animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const slabs = useRef<THREE.InstancedMesh>(null);
  const bands = useRef<THREE.InstancedMesh>(null);
  const strips = useRef<THREE.InstancedMesh>(null);
  const windowTex = useWindowTexture();

  const floors = useMemo(
    () =>
      Array.from({ length: FLOORS }, (_, i) => {
        const t = i / (FLOORS - 1);
        const w = 2.5 * (1 - 0.42 * Math.pow(t, 1.7)) + Math.sin(i * 0.38) * 0.14;
        return { y: i * FLOOR_H, w, rot: i * 0.085 };
      }),
    []
  );

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();
    const yAxis = new THREE.Vector3(0, 1, 0);
    const corner = new THREE.Vector3();
    floors.forEach((f, i) => {
      q.setFromAxisAngle(yAxis, f.rot);
      bands.current?.setMatrixAt(i, m.compose(p.set(0, f.y + 0.18, 0), q, s.set(f.w * 0.93, FLOOR_H - 0.08, f.w * 0.93)));
      slabs.current?.setMatrixAt(i, m.compose(p.set(0, f.y, 0), q, s.set(f.w, 0.055, f.w)));
      for (let c = 0; c < 4; c++) {
        const cx = c < 2 ? 1 : -1;
        const cz = c % 2 === 0 ? 1 : -1;
        corner.set((cx * f.w) / 2, f.y + 0.18, (cz * f.w) / 2).applyAxisAngle(yAxis, f.rot);
        strips.current?.setMatrixAt(i * 4 + c, m.compose(p.copy(corner), q, s.set(0.07, FLOOR_H, 0.07)));
      }
    });
    [slabs, bands, strips].forEach((r) => {
      if (r.current) r.current.instanceMatrix.needsUpdate = true;
    });
  }, [floors]);

  const dim = useMemo(() => new THREE.Color("#18265a"), []);
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame((state, dt) => {
    const t = animate ? state.clock.elapsedTime : 0;
    if (group.current && animate) group.current.rotation.y += dt * 0.22;

    const sl = slabs.current;
    const st = strips.current;
    if (sl) {
      for (let i = 0; i < FLOORS; i++) {
        const v = Math.pow(0.5 + 0.5 * Math.sin(t * 2.2 - i * 0.32), 3);
        sl.setColorAt(i, tmp.copy(dim).lerp(BRAND.cyan, v).multiplyScalar(1 + v * 3.4));
      }
      if (sl.instanceColor) sl.instanceColor.needsUpdate = true;
    }
    if (st) {
      for (let i = 0; i < FLOORS; i++) {
        const v = Math.pow(0.5 + 0.5 * Math.sin(t * 1.6 + i * 0.28), 2);
        for (let c = 0; c < 4; c++) {
          const base = c % 2 === 0 ? BRAND.violet : BRAND.gold;
          st.setColorAt(i * 4 + c, tmp.copy(base).multiplyScalar(0.6 + v * 3.2));
        }
      }
      if (st.instanceColor) st.instanceColor.needsUpdate = true;
    }
  });

  const topY = (FLOORS - 1) * FLOOR_H;

  return (
    <group ref={group} position={[0, -(topY / 2) + 0.2, 0]}>
      <instancedMesh ref={bands} args={[undefined, undefined, FLOORS]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#0a1230" metalness={0.9} roughness={0.18} emissive="#ffffff" emissiveMap={windowTex} emissiveIntensity={1.5} />
      </instancedMesh>
      <instancedMesh ref={slabs} args={[undefined, undefined, FLOORS]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={strips} args={[undefined, undefined, FLOORS * 4]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* crown */}
      <mesh position={[0, topY + 1.4, 0]}>
        <cylinderGeometry args={[0.025, 0.06, 2.6, 8]} />
        <meshStandardMaterial color="#9fb4ff" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0, topY + 2.8, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={[6, 2.2, 1]} toneMapped={false} />
      </mesh>
      <mesh position={[0, topY / 2 + 2, 0]}>
        <cylinderGeometry args={[0.02, 0.4, topY + 8, 16, 1, true]} />
        <meshBasicMaterial color={BRAND.cyan} transparent opacity={0.05} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Podium({ animate }: { animate: boolean }) {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!animate) return;
    if (ring1.current) ring1.current.rotation.z += dt * 0.5;
    if (ring2.current) ring2.current.rotation.z -= dt * 0.3;
  });
  const y = -(FLOORS * FLOOR_H) / 2 - 0.2;
  return (
    <group position={[0, y, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[6, 64]} />
        <meshStandardMaterial color="#050a1f" metalness={1} roughness={0.25} />
      </mesh>
      <mesh ref={ring1} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <torusGeometry args={[3.6, 0.02, 8, 120]} />
        <meshBasicMaterial color={[0.3, 2.4, 3.2]} toneMapped={false} />
      </mesh>
      <mesh ref={ring2} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <torusGeometry args={[4.8, 0.012, 8, 160]} />
        <meshBasicMaterial color={[2.2, 1.2, 0.3]} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Rig({ progress, animate }: { progress?: MotionValue<number>; animate: boolean }) {
  useFrame((state, dt) => {
    const p = animate && progress ? progress.get() : 0.3;
    const angle = 0.5 + p * 1.6 + state.pointer.x * 0.35;
    const radius = 27 - p * 3;
    const targetY = 2 + p * 5.5 + state.pointer.y * 0.8;
    const cam = state.camera;
    const k = 1 - Math.exp(-dt * 3);
    cam.position.x += (Math.sin(angle) * radius - cam.position.x) * k;
    cam.position.z += (Math.cos(angle) * radius - cam.position.z) * k;
    cam.position.y += (targetY - cam.position.y) * k;
    cam.lookAt(0, 0.4 + p * 1.2, 0);
  });
  return null;
}

export default function TowerScene({ progress }: { progress?: MotionValue<number> }) {
  const { tier, reducedMotion } = useDevice();
  const high = tier === "high";

  return (
    <LazyCanvas className="absolute inset-0" camera={{ fov: 38, near: 0.1, far: 120, position: [12, 3, 24] }}>
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 10, 4]} intensity={1.6} color="#a5e9ff" />
      <pointLight position={[-6, 3, -4]} intensity={40} color="#8b5cf6" distance={30} />
      <pointLight position={[5, -2, 6]} intensity={30} color="#f5be5a" distance={24} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={4} position={[0, 6, -6]} scale={[14, 4, 1]} color="#6ee7ff" />
        <Lightformer form="rect" intensity={3} position={[-8, 1, 2]} scale={[2, 10, 1]} color="#8b5cf6" />
        <Lightformer form="rect" intensity={3} position={[8, 1, 2]} scale={[2, 10, 1]} color="#f5be5a" />
      </Environment>
      <Tower animate={!reducedMotion} />
      <Podium animate={!reducedMotion} />
      <Sparkles count={high ? 90 : 30} scale={[12, 12, 12]} size={3} speed={reducedMotion ? 0 : 0.4} color="#8be9ff" opacity={0.8} />
      <Rig progress={progress} animate={!reducedMotion} />
      {high && (
        <EffectComposer multisampling={4}>
          <Bloom intensity={1.1} luminanceThreshold={0.7} luminanceSmoothing={0.3} mipmapBlur radius={0.7} />
        </EffectComposer>
      )}
    </LazyCanvas>
  );
}
