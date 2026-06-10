"use client";
// src/components/landing/MedicalScene.tsx
import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import * as THREE from "three";

function GlassRibbon() {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const targetRotation = React.useRef({ x: 0, y: 0 });

  // Mouse hover coordinate tracking pipeline
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRotation.current.y = (e.clientX / window.innerWidth - 0.5) * 0.4;
      targetRotation.current.x = (e.clientY / window.innerHeight - 0.5) * 0.3;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Smooth, relaxing idle oscillation loop
    const elapsedTime = state.clock.getElapsedTime();
    meshRef.current.rotation.y = elapsedTime * 0.1 + targetRotation.current.y;
    meshRef.current.rotation.x =
      Math.sin(elapsedTime * 0.2) * 0.05 + targetRotation.current.x;
    meshRef.current.position.y = Math.sin(elapsedTime * 0.5) * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      {/* Complex interlocking path simulated via TorusKnot Topology */}
      <torusKnotGeometry args={[1.5, 0.22, 180, 16, 2, 3]} />
      <meshPhysicalMaterial
        color="#14b8a6" // Healthcare Teal
        roughness={0.1}
        metalness={0.1}
        transmission={0.6} // Glass transparency transparency ratio
        ior={1.5} // Index of refraction matching crystal glass
        thickness={1.2} // Refraction depth
        specularIntensity={1.5}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
}

export default function MedicalScene() {
  return (
    <div className="w-full h-full opacity-90">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 50 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.8} />
        {/* Dual studio layout point lighting setup to maximize glass highlights */}
        <pointLight position={[10, 10, 10]} intensity={2.0} color="#ffffff" />
        <pointLight
          position={[-10, -10, -10]}
          intensity={1.2}
          color="#0d9488"
        />
        <directionalLight position={[0, 5, 2]} intensity={1.5} />
        <Center>
          <GlassRibbon />
        </Center>
      </Canvas>
    </div>
  );
}
