import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

export interface BillboardData {
  id: string
  text: string
  subtext: string
  position: [number, number, number]
  rotation: [number, number, number]
  color: string
  glowColor: string
}

const BILLBOARD_CONFIGS: BillboardData[] = [
  {
    id: 'bb1',
    text: 'LEVEL UP YOUR LIFE',
    subtext: '// NEXAURA DIRECTIVE 01',
    position: [-16, 9.5, -28],
    rotation: [0, 0.36, 0],
    color: '#00f0ff',
    glowColor: '#00f0ff',
  },
  {
    id: 'bb2',
    text: 'COMPLETE MISSIONS',
    subtext: '// SYSTEM OVERDRIVE',
    position: [16, 10.5, -48],
    rotation: [0, -0.36, 0],
    color: '#ff007f',
    glowColor: '#ec4899',
  },
  {
    id: 'bb3',
    text: 'DISCIPLINE BUILDS FREEDOM',
    subtext: '// PROTOCOL 0x77',
    position: [-18, 12, -76],
    rotation: [0, 0.3, 0],
    color: '#a855f7',
    glowColor: '#9333ea',
  },
  {
    id: 'bb4',
    text: 'NEXT LEVEL AHEAD →',
    subtext: '// UNLOCK ATTRIBUTES',
    position: [18, 12.5, -102],
    rotation: [0, -0.28, 0],
    color: '#00f0ff',
    glowColor: '#06b6d4',
  },
  {
    id: 'bb5',
    text: 'MORE THAN PRODUCTIVITY',
    subtext: '// REAL-WORLD RPG MATRIX',
    position: [-16, 13, -128],
    rotation: [0, 0.25, 0],
    color: '#38bdf8',
    glowColor: '#0284c7',
  },
  {
    id: 'bb6',
    text: 'NEXAURA',
    subtext: '// UPGRADE YOUR REALITY',
    position: [17, 13.5, -150],
    rotation: [0, -0.22, 0],
    color: '#00f0ff',
    glowColor: '#00f0ff',
  },
]

export const HolographicBillboardItem: React.FC<{
  data: BillboardData
  offset: number
}> = ({ data, offset }) => {
  const groupRef = useRef<THREE.Group>(null)

  // Subtle floating oscillation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime() + offset
      groupRef.current.position.y = data.position[1] + Math.sin(t * 1.6) * 0.35
    }
  })

  return (
    <group ref={groupRef} position={data.position} rotation={data.rotation}>
      {/* Structural Support Gantry Stems */}
      <mesh position={[0, -5, 0]}>
        <cylinderGeometry args={[0.08, 0.14, 10, 8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Holographic Frame Outer Bezel */}
      <mesh>
        <boxGeometry args={[11.5, 4.0, 0.12]} />
        <meshStandardMaterial
          color="#030712"
          metalness={0.95}
          roughness={0.2}
          emissive={data.color}
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Glowing Thin Neon Outline Ring */}
      <mesh position={[0, 0, 0.07]}>
        <ringGeometry args={[5.4, 5.65, 4]} />
        <meshBasicMaterial
          color={data.glowColor}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Holographic Glass Face */}
      <mesh position={[0, 0, 0.09]}>
        <planeGeometry args={[11.1, 3.6]} />
        <meshBasicMaterial
          color={data.color}
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Scanline Wireframe Accents */}
      <mesh position={[0, 0, 0.1]}>
        <planeGeometry args={[10.9, 3.4]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>

      {/* Main Bold Billboard Text */}
      <Text
        position={[0, 0.38, 0.15]}
        fontSize={0.68}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
      >
        {data.text}
      </Text>

      {/* Subtext Tagline */}
      <Text
        position={[0, -0.68, 0.15]}
        fontSize={0.28}
        color={data.color}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.16}
      >
        {data.subtext}
      </Text>

      {/* Tech Corner Brackets */}
      {[-5.4, 5.4].map((x, xi) =>
        [-1.7, 1.7].map((y, yi) => (
          <mesh key={`${xi}-${yi}`} position={[x, y, 0.12]}>
            <boxGeometry args={[0.65, 0.1, 0.06]} />
            <meshBasicMaterial color={data.color} />
          </mesh>
        ))
      )}

      {/* Local Holographic Glow Light */}
      <pointLight color={data.color} intensity={1.4} distance={14} decay={2} />
    </group>
  )
}

export const HolographicBillboard: React.FC = () => {
  return (
    <group>
      {BILLBOARD_CONFIGS.map((b, idx) => (
        <HolographicBillboardItem key={b.id} data={b} offset={idx * 1.3} />
      ))}
    </group>
  )
}

export default HolographicBillboard
