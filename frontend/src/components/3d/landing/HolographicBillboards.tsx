import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface BillboardData {
  id: string
  text: string
  subtext: string
  position: [number, number, number]
  rotation: [number, number, number]
  color: string
  glowColor: string
}

const BILLBOARDS: BillboardData[] = [
  {
    id: 'b1',
    text: 'LEVEL UP YOUR LIFE',
    subtext: '// NEXAURA RPG DIRECTIVE',
    position: [-16, 9, -25],
    rotation: [0, 0.35, 0],
    color: '#00f0ff',
    glowColor: '#00f0ff',
  },
  {
    id: 'b2',
    text: 'COMPLETE MISSIONS',
    subtext: '// PROTOCOL 0x89: FOCUS',
    position: [16, 11, -45],
    rotation: [0, -0.35, 0],
    color: '#ff007f',
    glowColor: '#ec4899',
  },
  {
    id: 'b3',
    text: 'DISCIPLINE BUILDS FREEDOM',
    subtext: '// TITANIUM STREAK MATRIX',
    position: [-18, 14, -70],
    rotation: [0, 0.3, 0],
    color: '#a855f7',
    glowColor: '#9333ea',
  },
  {
    id: 'b4',
    text: 'UNLOCK YOUR POTENTIAL',
    subtext: '// 5 HUMAN ATTRIBUTES',
    position: [18, 13, -95],
    rotation: [0, -0.28, 0],
    color: '#00f0ff',
    glowColor: '#06b6d4',
  },
  {
    id: 'b5',
    text: 'YOUR NEXT LEVEL AWAITS',
    subtext: '// UPGRADE YOUR REALITY',
    position: [-15, 12, -120],
    rotation: [0, 0.25, 0],
    color: '#38bdf8',
    glowColor: '#0ea5e9',
  },
]

const BillboardItem: React.FC<{ data: BillboardData; offset: number }> = ({ data, offset }) => {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime() + offset
      groupRef.current.position.y = data.position[1] + Math.sin(t * 1.5) * 0.35
    }
  })

  return (
    <group ref={groupRef} position={data.position} rotation={data.rotation}>
      {/* Supporting Truss Gantry / Stems */}
      <mesh position={[0, -5, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 10, 8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Holographic Frame Outer Border */}
      <mesh>
        <boxGeometry args={[11.2, 3.8, 0.1]} />
        <meshStandardMaterial
          color="#030712"
          metalness={0.95}
          roughness={0.2}
          emissive={data.color}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Glowing Neon Outline Border */}
      <mesh position={[0, 0, 0.06]}>
        <ringGeometry args={[5.3, 5.5, 4]} />
        <meshBasicMaterial
          color={data.glowColor}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Holographic Glass Display Face */}
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[10.8, 3.4]} />
        <meshBasicMaterial
          color={data.color}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Scanline Accents */}
      <mesh position={[0, 0, 0.09]}>
        <planeGeometry args={[10.6, 3.2]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.05}
        />
      </mesh>

      {/* Main Slogan Text */}
      <Text
        position={[0, 0.35, 0.14]}
        fontSize={0.65}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
      >
        {data.text}
      </Text>

      {/* Subtext Slogan */}
      <Text
        position={[0, -0.65, 0.14]}
        fontSize={0.28}
        color={data.color}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        {data.subtext}
      </Text>

      {/* Corner Bracket Tech Accents */}
      <mesh position={[-5.3, 1.6, 0.12]}>
        <boxGeometry args={[0.6, 0.1, 0.05]} />
        <meshBasicMaterial color={data.color} />
      </mesh>
      <mesh position={[5.3, 1.6, 0.12]}>
        <boxGeometry args={[0.6, 0.1, 0.05]} />
        <meshBasicMaterial color={data.color} />
      </mesh>
      <mesh position={[-5.3, -1.6, 0.12]}>
        <boxGeometry args={[0.6, 0.1, 0.05]} />
        <meshBasicMaterial color={data.color} />
      </mesh>
      <mesh position={[5.3, -1.6, 0.12]}>
        <boxGeometry args={[0.6, 0.1, 0.05]} />
        <meshBasicMaterial color={data.color} />
      </mesh>

      {/* Local Ambient Glow Light */}
      <pointLight color={data.color} intensity={1.2} distance={12} decay={2} />
    </group>
  )
}

export const HolographicBillboards: React.FC = () => {
  return (
    <group>
      {BILLBOARDS.map((b, idx) => (
        <BillboardItem key={b.id} data={b} offset={idx * 1.2} />
      ))}
    </group>
  )
}

export default HolographicBillboards
