import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface NeonHighwayProps {
  speed?: number
}

export const NeonHighway: React.FC<NeonHighwayProps> = ({ speed = 35 }) => {
  const roadDashGroup = useRef<THREE.Group>(null)

  // Segment spacing for moving road dashes
  const DASH_COUNT = 24
  const DASH_SPACING = 7.5
  const TOTAL_LENGTH = DASH_COUNT * DASH_SPACING

  useFrame((_, delta) => {
    if (roadDashGroup.current) {
      // Shift dashed markings along Z towards camera
      const children = roadDashGroup.current.children
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        child.position.z += speed * delta
        if (child.position.z > 20) {
          child.position.z -= TOTAL_LENGTH
        }
      }
    }
  })

  return (
    <group position={[0, -0.6, 0]}>
      {/* 1. Main Asphalt Highway Deck (Reflective Dark Tarmac) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -60]}>
        <planeGeometry args={[14, 200]} />
        <meshStandardMaterial
          color="#060913"
          roughness={0.25}
          metalness={0.8}
        />
      </mesh>

      {/* 2. Elevated Highway Concrete/Steel Structure Deck Beneath */}
      <mesh position={[0, -0.4, -60]}>
        <boxGeometry args={[15, 0.6, 200]} />
        <meshStandardMaterial color="#020617" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* 3. Left Outer Guard Rail Barrier */}
      <group position={[-7.2, 0.4, -60]}>
        <mesh>
          <boxGeometry args={[0.3, 0.8, 200]} />
          <meshStandardMaterial color="#0b1329" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Neon Cyan Strip Running Along Left Rail */}
        <mesh position={[0.16, 0.25, 0]}>
          <boxGeometry args={[0.06, 0.12, 200]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
      </group>

      {/* 4. Right Outer Guard Rail Barrier */}
      <group position={[7.2, 0.4, -60]}>
        <mesh>
          <boxGeometry args={[0.3, 0.8, 200]} />
          <meshStandardMaterial color="#0b1329" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Neon Magenta Strip Running Along Right Rail */}
        <mesh position={[-0.16, 0.25, 0]}>
          <boxGeometry args={[0.06, 0.12, 200]} />
          <meshBasicMaterial color="#ff007f" />
        </mesh>
      </group>

      {/* 5. Left & Right Continuous Shoulder Solid Glow Lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5.8, 0.02, -60]}>
        <planeGeometry args={[0.15, 200]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5.8, 0.02, -60]}>
        <planeGeometry args={[0.15, 200]} />
        <meshBasicMaterial color="#ff007f" />
      </mesh>

      {/* 6. Animated Center Dashed Markings */}
      <group ref={roadDashGroup}>
        {Array.from({ length: DASH_COUNT }).map((_, i) => (
          <group key={i} position={[0, 0.03, -150 + i * DASH_SPACING]}>
            {/* Center Lane Divider Dashes */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
              <planeGeometry args={[0.25, 3.2]} />
              <meshBasicMaterial color="#00f0ff" />
            </mesh>
            {/* Left Lane Inner Dashes */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.9, 0, 0]}>
              <planeGeometry args={[0.15, 2.8]} />
              <meshBasicMaterial color="#06b6d4" />
            </mesh>
            {/* Right Lane Inner Dashes */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.9, 0, 0]}>
              <planeGeometry args={[0.15, 2.8]} />
              <meshBasicMaterial color="#a855f7" />
            </mesh>
          </group>
        ))}
      </group>

      {/* 7. Massive Highway Support Pylons Under Deck */}
      {[-10, -45, -80, -115, -150].map((z, idx) => (
        <group key={idx} position={[0, -12, z]}>
          <mesh>
            <cylinderGeometry args={[1.6, 2.4, 24, 8]} />
            <meshStandardMaterial color="#050a18" roughness={0.8} metalness={0.3} />
          </mesh>
          {/* Neon Ring Collar on Column */}
          <mesh position={[0, 8, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.0, 0.1, 8, 24]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
        </group>
      ))}

      {/* 8. Overhead Gantry Arches Spanning Road */}
      {[-35, -95, -155].map((z, idx) => (
        <group key={idx} position={[0, 5, z]}>
          {/* Top Span Beam */}
          <mesh>
            <boxGeometry args={[16.5, 0.5, 0.6]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.3} />
          </mesh>
          {/* Vertical Pillars */}
          <mesh position={[-7.8, -2.5, 0]}>
            <boxGeometry args={[0.6, 5, 0.6]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={[7.8, -2.5, 0]}>
            <boxGeometry args={[0.6, 5, 0.6]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.3} />
          </mesh>
          {/* Cyan Warning Strip */}
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[14, 0.1, 0.65]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
          {/* Overhead Scanner Blinker */}
          <pointLight position={[0, -0.8, 0]} color="#00f0ff" intensity={0.6} distance={8} />
        </group>
      ))}
    </group>
  )
}

export default NeonHighway
