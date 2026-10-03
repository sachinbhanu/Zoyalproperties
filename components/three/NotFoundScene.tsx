"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { LazyCanvas } from "@/components/three/LazyCanvas";
import { useDevice } from "@/hooks/useDevice";

function Orb({ animate }: { animate: boolean }) {
  const wire = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  useFrame((state, dt) => {
    if (!animate) return;
    if (wire.current) {
      wire.current.rotation.y += dt * 0.3;
      wire.current.rotation.x += dt * 0.12;
    }
    if (ring.current) {
      ring.current.rotation.z += dt * 0.5;
      ring.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.5 + 1;
    }
  });
  return (
    <Float speed={animate ? 1.6 : 0} floatIntensity={1.2} rotationIntensity={0.6}>
      <mesh>
        <sphereGeometry args={[1.25, 64, 64]} />
        <MeshDistortMaterial color="#1b2a6b" emissive="#22d3ee" emissiveIntensity={0.35} metalness={0.9} roughness={0.15} distort={animate ? 0.45 : 0} speed={2} />
      </mesh>
      <mesh ref={wire} scale={1.55}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.55} />
      </mesh>
      <mesh ref={ring} scale={2.1}>
        <torusGeometry args={[1, 0.012, 8, 128]} />
        <meshBasicMaterial color={[0.4, 2.4, 3.2]} toneMapped={false} />
      </mesh>
    </Float>
  );
}

export default function NotFoundScene() {
  const { reducedMotion } = useDevice();
  return (
    <LazyCanvas className="absolute inset-0" camera={{ fov: 42, position: [0, 0, 10.5] }} margin="0px">
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={2} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={5} position={[0, 4, -5]} scale={[12, 3, 1]} color="#6ee7ff" />
        <Lightformer form="rect" intensity={4} position={[-6, 0, 3]} scale={[2, 8, 1]} color="#8b5cf6" />
        <Lightformer form="rect" intensity={4} position={[6, 0, 3]} scale={[2, 8, 1]} color="#f5be5a" />
      </Environment>
      <Orb animate={!reducedMotion} />
      <Sparkles count={70} scale={[10, 8, 6]} size={3} speed={reducedMotion ? 0 : 0.5} color="#8be9ff" />
    </LazyCanvas>
  );
}
