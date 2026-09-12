import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface HolographicStagePlatformProps {
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  radius?: number
}

export const HolographicStagePlatform: React.FC<HolographicStagePlatformProps> = ({
  primaryColor = '#00E5FF',
  secondaryColor = '#8B5CF6',
  accentColor = '#FF2BA6',
  radius = 1.35,
}) => {
  const outerRingRef = useRef<THREE.Mesh>(null)
  const middleRingRef = useRef<THREE.Mesh>(null)
  const innerRingRef = useRef<THREE.Mesh>(null)
  const discRef = useRef<THREE.Mesh>(null)
  const runesRef = useRef<THREE.Group>(null)
  const pillarsRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // Smooth rotational counter-movement of holographic rings
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = t * 0.35
    }
    if (middleRingRef.current) {
      middleRingRef.current.rotation.z = -t * 0.5
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = t * 0.7
    }
    if (runesRef.current) {
      runesRef.current.rotation.z = -t * 0.25
    }

    // Gentle holographic disc pulse
    if (discRef.current) {
      const mat = discRef.current.material as THREE.MeshStandardMaterial
      mat.opacity = 0.4 + Math.sin(t * 2.5) * 0.12
    }

    // Pillar pulse
    if (pillarsRef.current) {
      pillarsRef.current.rotation.y = t * 0.2
    }
  })

  // 8 circular perimeter runes/notches
  const runeNotches = Array.from({ length: 12 }).map((_, i) => {
    const angle = (i / 12) * Math.PI * 2
    const x = Math.cos(angle) * (radius * 1.08)
    const y = Math.sin(angle) * (radius * 1.08)
    return { x, y, angle }
  })

  return (
    <group position={[0, -1.05, 0]}>
      {/* 1. Ground Circular Floor Shadow */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius * 1.5, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.65} />
      </mesh>

      {/* 2. Platform Base Cylinder */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[radius * 1.22, radius * 1.3, 0.08, 48]} />
        <meshStandardMaterial
          color="#060b18"
          metalness={0.85}
          roughness={0.25}
          emissive="#002233"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* 3. Outer Glowing Chamfer Bevel Ring */}
      <mesh position={[0, -0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 1.25, 0.018, 16, 64]} />
        <meshStandardMaterial
          color={primaryColor}
          emissive={primaryColor}
          emissiveIntensity={2.2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 4. Rotating Outer Holographic Ring */}
      <mesh ref={outerRingRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 1.15, radius * 1.22, 48]} />
        <meshStandardMaterial
          color={primaryColor}
          emissive={primaryColor}
          emissiveIntensity={2.5}
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* 5. Rotating Secondary Magenta/Purple Orbit Ring */}
      <mesh ref={middleRingRef} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.96, radius * 1.04, 36]} />
        <meshStandardMaterial
          color={secondaryColor}
          emissive={secondaryColor}
          emissiveIntensity={2.0}
          side={THREE.DoubleSide}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* 6. Rotating Inner Cyan Ring */}
      <mesh ref={innerRingRef} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.72, radius * 0.78, 32]} />
        <meshStandardMaterial
          color={primaryColor}
          emissive={primaryColor}
          emissiveIntensity={2.8}
          side={THREE.DoubleSide}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 7. Holographic Rune Tick Marks */}
      <group ref={runesRef} position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        {runeNotches.map((r, idx) => (
          <mesh key={idx} position={[r.x, r.y, 0]} rotation={[0, 0, r.angle]}>
            <boxGeometry args={[0.08, 0.018, 0.005]} />
            <meshStandardMaterial
              color={idx % 3 === 0 ? accentColor : primaryColor}
              emissive={idx % 3 === 0 ? accentColor : primaryColor}
              emissiveIntensity={3.0}
            />
          </mesh>
        ))}
      </group>

      {/* 8. Center Holographic Grid Disc */}
      <mesh ref={discRef} position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius * 0.7, 36]} />
        <meshStandardMaterial
          color="#040916"
          emissive={primaryColor}
          emissiveIntensity={0.6}
          side={THREE.DoubleSide}
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* 9. 4 Vertical Neon Light Pillars (at 90 degree positions) */}
      <group ref={pillarsRef} position={[0, 0, 0]}>
        {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, idx) => {
          const px = Math.cos(angle) * (radius * 1.2)
          const pz = Math.sin(angle) * (radius * 1.2)
          const pColor = idx % 2 === 0 ? primaryColor : secondaryColor

          return (
            <group key={idx} position={[px, 0, pz]}>
              {/* Pillar Base Emitter Node */}
              <mesh position={[0, 0.02, 0]}>
                <cylinderGeometry args={[0.035, 0.045, 0.05, 12]} />
                <meshStandardMaterial color={pColor} emissive={pColor} emissiveIntensity={3} />
              </mesh>
              {/* Vertical Laser Light Beam */}
              <mesh position={[0, 0.9, 0]}>
                <cylinderGeometry args={[0.008, 0.008, 1.8, 8]} />
                <meshBasicMaterial color={pColor} transparent opacity={0.45} />
              </mesh>
            </group>
          )
        })}
      </group>
    </group>
  )
}
