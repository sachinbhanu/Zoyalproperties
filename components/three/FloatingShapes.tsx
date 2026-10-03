"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import { LazyCanvas } from "@/components/three/LazyCanvas";
import { useDevice } from "@/hooks/useDevice";

type Variant = "a" | "b";

function Glass({ high, color = "#9ae7ff" }: { high: boolean; color?: string }) {
  return high ? (
    <MeshTransmissionMaterial
      backside
      samples={4}
      resolution={384}
      thickness={0.6}
      chromaticAberration={0.1}
      anisotropy={0.2}
      distortion={0.25}
      distortionScale={0.3}
      temporalDistortion={0.1}
      ior={1.35}
      roughness={0.04}
      color={color}
    />
  ) : (
    <meshPhysicalMaterial color={color} transparent opacity={0.55} roughness={0.08} metalness={0.2} clearcoat={1} />
  );
}

function Shapes({ variant, high, animate }: { variant: Variant; high: boolean; animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (!group.current || !animate) return;
    group.current.rotation.y += (state.pointer.x * 0.5 - group.current.rotation.y) * (1 - Math.exp(-dt * 2));
    group.current.rotation.x += (-state.pointer.y * 0.3 - group.current.rotation.x) * (1 - Math.exp(-dt * 2));
  });

  const a = variant === "a";
  const speed = animate ? 1.4 : 0;

  return (
    <group ref={group}>
      <Float speed={speed} rotationIntensity={1.2} floatIntensity={1.4}>
        <mesh position={a ? [-2.6, 0.5, 0] : [2.4, 0.4, 0]} scale={a ? 1.35 : 1.15}>
          <icosahedronGeometry args={[1, 0]} />
          <Glass high={high} />
        </mesh>
      </Float>
      <Float speed={speed} rotationIntensity={1.6} floatIntensity={1.1}>
        <mesh position={a ? [2.5, -0.7, -1] : [-2.5, -0.3, -0.5]} rotation={[0.8, 0.3, 0]} scale={1}>
          <torusGeometry args={[0.9, 0.3, 32, 96]} />
          <meshStandardMaterial color="#f5be5a" metalness={1} roughness={0.15} />
        </mesh>
      </Float>
      <Float speed={speed} rotationIntensity={2} floatIntensity={1.8}>
        <mesh position={a ? [0.4, 1.9, -1.4] : [0.2, -1.8, -1]} scale={0.75}>
          <octahedronGeometry args={[1, 0]} />
          <Glass high={high} color="#c4b0ff" />
        </mesh>
      </Float>
      <Float speed={speed} rotationIntensity={1} floatIntensity={2}>
        <mesh position={a ? [-0.6, -1.9, 0.6] : [1.2, 1.9, 0.4]} scale={0.45}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshStandardMaterial color="#22d3ee" metalness={0.9} roughness={0.12} />
        </mesh>
      </Float>
    </group>
  );
}

/** Decorative glass / metal shapes — drop-in background for sections. */
export default function FloatingShapes({ variant = "a" }: { variant?: Variant }) {
  const { tier, reducedMotion } = useDevice();
  return (
    <LazyCanvas className="absolute inset-0" camera={{ fov: 40, position: [0, 0, 8] }} margin="100px">
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 5, 5]} intensity={2} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={6} position={[0, 4, -5]} scale={[12, 3, 1]} color="#6ee7ff" />
        <Lightformer form="rect" intensity={5} position={[-6, 0, 3]} scale={[2, 8, 1]} color="#8b5cf6" />
        <Lightformer form="rect" intensity={5} position={[6, 0, 3]} scale={[2, 8, 1]} color="#f5be5a" />
        <Lightformer form="ring" intensity={4} position={[0, -3, 4]} scale={4} color="#ffffff" />
      </Environment>
      {/* neon bars behind the glass so refraction has something to bend */}
      <mesh position={[-4.5, 0, -4]}>
        <planeGeometry args={[0.12, 9]} />
        <meshBasicMaterial color={[0.3, 2.2, 3]} toneMapped={false} />
      </mesh>
      <mesh position={[0.3, 0, -5]}>
        <planeGeometry args={[0.12, 9]} />
        <meshBasicMaterial color={[1.8, 0.8, 3]} toneMapped={false} />
      </mesh>
      <mesh position={[4.6, 0, -4]}>
        <planeGeometry args={[0.12, 9]} />
        <meshBasicMaterial color={[3, 2, 0.6]} toneMapped={false} />
      </mesh>
      <Shapes variant={variant} high={tier === "high"} animate={!reducedMotion} />
    </LazyCanvas>
  );
}
