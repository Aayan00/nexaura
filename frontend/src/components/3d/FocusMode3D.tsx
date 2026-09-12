import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function PulsingCore({ isActive = true }: { isActive?: boolean }) {
  const coreRef = useRef<THREE.Mesh>(null)
  const outerRing1 = useRef<THREE.Mesh>(null)
  const outerRing2 = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    if (coreRef.current) {
      const pulseSpeed = isActive ? 2.5 : 0.8
      const scale = 1 + Math.sin(t * pulseSpeed) * 0.12
      coreRef.current.scale.set(scale, scale, scale)
      const mat = coreRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 1.8 + Math.sin(t * pulseSpeed) * 0.8
    }

    if (outerRing1.current) {
      outerRing1.current.rotation.x += delta * 0.6
      outerRing1.current.rotation.y += delta * 0.8
    }

    if (outerRing2.current) {
      outerRing2.current.rotation.y -= delta * 0.7
      outerRing2.current.rotation.z += delta * 0.5
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Central 3D Reactor Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.1, 2]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={2.2}
          roughness={0.1}
          metalness={0.9}
          wireframe
        />
      </mesh>

      {/* Orbiting Plasma Ring 1 */}
      <mesh ref={outerRing1}>
        <torusGeometry args={[1.7, 0.03, 16, 64]} />
        <meshStandardMaterial
          color="#ff007f"
          emissive="#ff007f"
          emissiveIntensity={1.8}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Orbiting Plasma Ring 2 */}
      <mesh ref={outerRing2}>
        <torusGeometry args={[2.1, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={1.5}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  )
}

export const FocusMode3D: React.FC<{
  isActive?: boolean
  className?: string
}> = ({ isActive = true, className = 'h-72 w-full' }) => {
  return (
    <div className={`relative ${className}`}>
      <Canvas camera={{ position: [0, 0, 4.8], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#00f0ff" />
        <pointLight position={[-5, -5, -3]} intensity={2.0} color="#ff007f" />
        <PulsingCore isActive={isActive} />
      </Canvas>
    </div>
  )
}
