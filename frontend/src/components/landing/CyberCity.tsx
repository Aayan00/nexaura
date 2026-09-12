import React, { useMemo } from 'react'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface BuildingProps {
  position: [number, number, number]
  width: number
  height: number
  depth: number
  color: string
  accentColor: string
  windowColor: string
  hasAntenna?: boolean
  antennaHeight?: number
  neonSignText?: string
  neonSignVertical?: boolean
}

// 1. Reusable BuildingWindows Component
export const BuildingWindows: React.FC<{
  width: number
  height: number
  depth: number
  color: string
}> = ({ width, height, depth, color }) => {
  const windowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.85,
      }),
    [color]
  )

  // Grid of glowing window clusters
  const rows = Math.min(Math.floor(height / 4.5), 14)
  const cols = Math.min(Math.floor(width / 2.2), 6)

  return (
    <group>
      {/* Front Face Windows */}
      {Array.from({ length: rows }).map((_, r) => {
        const y = -height / 2 + 4 + r * 4.2
        return (
          <group key={r} position={[0, y, depth / 2 + 0.05]}>
            {Array.from({ length: cols }).map((_, c) => {
              const x = -width / 2 + 1.2 + c * 2.0
              // Skip some windows deterministically for a lived-in look
              if ((r * 3 + c * 7) % 5 === 0) return null
              return (
                <mesh key={c} position={[x, 0, 0]}>
                  <planeGeometry args={[1.0, 1.6]} />
                  <primitive object={windowMaterial} attach="material" />
                </mesh>
              )
            })}
          </group>
        )
      })}
    </group>
  )
}

// 2. Reusable NeonSign Component
export const NeonSign: React.FC<{
  text: string
  color: string
  position: [number, number, number]
  rotation?: [number, number, number]
  vertical?: boolean
}> = ({ text, color, position, rotation = [0, 0, 0], vertical = false }) => {
  const formattedText = vertical ? text.split('').join('\n') : text
  const fontSize = vertical ? 0.75 : 0.85

  return (
    <group position={position} rotation={rotation}>
      {/* Neon Backing Plaque */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[vertical ? 1.6 : text.length * 0.6 + 1.2, vertical ? text.length * 1.1 + 1 : 1.8, 0.1]} />
        <meshStandardMaterial color="#030712" metalness={0.95} roughness={0.3} />
      </mesh>

      {/* Neon Border Outline */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[vertical ? 1.5 : text.length * 0.6 + 1.0, vertical ? text.length * 1.1 + 0.8 : 1.6, 0.05]} />
        <meshBasicMaterial color={color} wireframe />
      </mesh>

      {/* Glowing Sign Text */}
      <Text
        position={[0, 0, 0.06]}
        fontSize={fontSize}
        color={color}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
        lineHeight={1.1}
      >
        {formattedText}
      </Text>

      {/* Local Ambient Glow Light */}
      <pointLight color={color} intensity={1.0} distance={10} decay={2} />
    </group>
  )
}

// 3. Reusable FuturisticBuilding Component
export const FuturisticBuilding: React.FC<BuildingProps> = ({
  position,
  width,
  height,
  depth,
  color,
  accentColor,
  windowColor,
  hasAntenna = true,
  antennaHeight = 8,
  neonSignText,
  neonSignVertical = false,
}) => {
  const buildingMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.22,
        metalness: 0.88,
      }),
    [color]
  )

  const accentMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: accentColor,
      }),
    [accentColor]
  )

  const beaconMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: accentColor,
      }),
    [accentColor]
  )

  const setbackHeight = height * 0.25
  const setbackWidth = width * 0.75
  const setbackDepth = depth * 0.75

  return (
    <group position={position}>
      {/* 1. Main Skyscraper Base Tower */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <primitive object={buildingMaterial} attach="material" />
      </mesh>

      {/* 2. Top Setback Crown Tier */}
      <mesh position={[0, height + setbackHeight / 2, 0]}>
        <boxGeometry args={[setbackWidth, setbackHeight, setbackDepth]} />
        <primitive object={buildingMaterial} attach="material" />
      </mesh>

      {/* Crown Glowing Edge Ring */}
      <mesh position={[0, height + setbackHeight, 0]}>
        <boxGeometry args={[setbackWidth + 0.2, 0.2, setbackDepth + 0.2]} />
        <primitive object={accentMaterial} attach="material" />
      </mesh>

      {/* 3. Vertical Corner Neon Light Strips */}
      <mesh position={[-width / 2 - 0.05, height / 2, depth / 2 + 0.05]}>
        <boxGeometry args={[0.15, height * 0.95, 0.15]} />
        <primitive object={accentMaterial} attach="material" />
      </mesh>
      <mesh position={[width / 2 + 0.05, height / 2, depth / 2 + 0.05]}>
        <boxGeometry args={[0.15, height * 0.95, 0.15]} />
        <primitive object={accentMaterial} attach="material" />
      </mesh>

      {/* 4. Windows Pattern */}
      <group position={[0, height / 2, 0]}>
        <BuildingWindows
          width={width}
          height={height}
          depth={depth}
          color={windowColor}
        />
      </group>

      {/* 5. Rooftop Spire / Antenna with Blinking Warning Beacon */}
      {hasAntenna && (
        <group position={[0, height + setbackHeight, 0]}>
          <mesh position={[0, antennaHeight / 2, 0]}>
            <cylinderGeometry args={[0.08, 0.3, antennaHeight, 8]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Top Beacon Orb */}
          <mesh position={[0, antennaHeight, 0]}>
            <sphereGeometry args={[0.35, 12, 12]} />
            <primitive object={beaconMaterial} attach="material" />
          </mesh>
        </group>
      )}

      {/* 6. Neon Cyber Sign (if specified) */}
      {neonSignText && (
        <NeonSign
          text={neonSignText}
          color={accentColor}
          position={[0, height * 0.65, depth / 2 + 0.2]}
          vertical={neonSignVertical}
        />
      )}
    </group>
  )
}

// 4. Main CyberCity Component
export const CyberCity: React.FC = () => {
  // Deterministic Skyscraper Configuration flanking the highway
  const buildingsConfig = useMemo(() => {
    const list: BuildingProps[] = []

    // Left Flank Skyscraper Strip (Near and Mid)
    const leftTowers: BuildingProps[] = [
      {
        position: [-16, 0, -20],
        width: 11,
        height: 48,
        depth: 12,
        color: '#050814',
        accentColor: '#00f0ff',
        windowColor: '#00f0ff',
        hasAntenna: true,
        antennaHeight: 12,
        neonSignText: 'NEXAURA',
        neonSignVertical: true,
      },
      {
        position: [-28, 0, -42],
        width: 14,
        height: 68,
        depth: 14,
        color: '#040610',
        accentColor: '#ff007f',
        windowColor: '#ec4899',
        hasAntenna: true,
        antennaHeight: 16,
        neonSignText: 'LEVEL UP YOUR LIFE',
        neonSignVertical: false,
      },
      {
        position: [-18, 0, -70],
        width: 10,
        height: 52,
        depth: 11,
        color: '#060a18',
        accentColor: '#a855f7',
        windowColor: '#a855f7',
        hasAntenna: true,
        antennaHeight: 10,
        neonSignText: 'DISCIPLINE BUILDS FREEDOM',
        neonSignVertical: true,
      },
      {
        position: [-32, 0, -96],
        width: 16,
        height: 78,
        depth: 16,
        color: '#03050d',
        accentColor: '#00f0ff',
        windowColor: '#38bdf8',
        hasAntenna: true,
        antennaHeight: 18,
      },
      {
        position: [-22, 0, -125],
        width: 12,
        height: 56,
        depth: 12,
        color: '#050816',
        accentColor: '#ec4899',
        windowColor: '#f43f5e',
        hasAntenna: true,
        antennaHeight: 14,
        neonSignText: 'NEXT LEVEL AHEAD',
        neonSignVertical: false,
      },
      {
        position: [-38, 0, -155],
        width: 18,
        height: 85,
        depth: 18,
        color: '#02040b',
        accentColor: '#3b82f6',
        windowColor: '#60a5fa',
        hasAntenna: true,
        antennaHeight: 20,
      },
    ]

    // Right Flank Skyscraper Strip (Near and Mid)
    const rightTowers: BuildingProps[] = [
      {
        position: [16, 0, -25],
        width: 10,
        height: 46,
        depth: 11,
        color: '#050814',
        accentColor: '#ff007f',
        windowColor: '#ff007f',
        hasAntenna: true,
        antennaHeight: 10,
        neonSignText: 'COMPLETE MISSIONS',
        neonSignVertical: true,
      },
      {
        position: [28, 0, -48],
        width: 13,
        height: 64,
        depth: 13,
        color: '#040610',
        accentColor: '#00f0ff',
        windowColor: '#00f0ff',
        hasAntenna: true,
        antennaHeight: 15,
        neonSignText: 'MORE THAN PRODUCTIVITY',
        neonSignVertical: false,
      },
      {
        position: [18, 0, -78],
        width: 11,
        height: 54,
        depth: 11,
        color: '#060a18',
        accentColor: '#06b6d4',
        windowColor: '#22d3ee',
        hasAntenna: true,
        antennaHeight: 12,
      },
      {
        position: [34, 0, -105],
        width: 15,
        height: 80,
        depth: 15,
        color: '#03050e',
        accentColor: '#a855f7',
        windowColor: '#c084fc',
        hasAntenna: true,
        antennaHeight: 19,
        neonSignText: 'NEXAURA',
        neonSignVertical: true,
      },
      {
        position: [22, 0, -135],
        width: 12,
        height: 58,
        depth: 12,
        color: '#050816',
        accentColor: '#00f0ff',
        windowColor: '#38bdf8',
        hasAntenna: true,
        antennaHeight: 14,
      },
      {
        position: [40, 0, -165],
        width: 20,
        height: 92,
        depth: 20,
        color: '#02040c',
        accentColor: '#ff007f',
        windowColor: '#f43f5e',
        hasAntenna: true,
        antennaHeight: 22,
      },
    ]

    // Far Background Silhouette Towers (Adding immense city depth)
    const farTowers: BuildingProps[] = []
    for (let i = 0; i < 14; i++) {
      const isLeft = i % 2 === 0
      const x = isLeft ? -45 - (i * 3) : 45 + (i * 3)
      const z = -140 - (i * 7)
      const height = 70 + (i * 6)
      const width = 14 + (i % 4) * 3
      const depth = 14 + (i % 3) * 3
      const accentColor = i % 3 === 0 ? '#00f0ff' : i % 3 === 1 ? '#a855f7' : '#ff007f'
      const windowColor = i % 2 === 0 ? '#38bdf8' : '#e879f9'

      farTowers.push({
        position: [x, 0, z],
        width,
        height,
        depth,
        color: '#020308',
        accentColor,
        windowColor,
        hasAntenna: true,
        antennaHeight: 12 + (i % 5) * 3,
      })
    }

    list.push(...leftTowers, ...rightTowers, ...farTowers)
    return list
  }, [])

  return (
    <group>
      {/* 1. Layered Skyscraper Buildings */}
      {buildingsConfig.map((b, idx) => (
        <FuturisticBuilding key={idx} {...b} />
      ))}

      {/* 2. Elevated High-Rise Skybridges Connecting Key Towers */}
      {[
        { z: -35, y: 26, leftX: -22, rightX: 22, color: '#00f0ff' },
        { z: -85, y: 34, leftX: -25, rightX: 26, color: '#ff007f' },
        { z: -140, y: 42, leftX: -28, rightX: 30, color: '#a855f7' },
      ].map((bridge, idx) => (
        <group key={idx} position={[0, bridge.y, bridge.z]}>
          {/* Left Bridge Tube */}
          <mesh position={[bridge.leftX / 1.7, 0, 0]}>
            <boxGeometry args={[12, 2.0, 3.2]} />
            <meshStandardMaterial color="#091124" metalness={0.92} roughness={0.2} />
          </mesh>
          {/* Left Glowing Floor/Ceiling Stripe */}
          <mesh position={[bridge.leftX / 1.7, 1.05, 0]}>
            <boxGeometry args={[11.8, 0.1, 3.0]} />
            <meshBasicMaterial color={bridge.color} />
          </mesh>

          {/* Right Bridge Tube */}
          <mesh position={[bridge.rightX / 1.7, 0, 0]}>
            <boxGeometry args={[12, 2.0, 3.2]} />
            <meshStandardMaterial color="#091124" metalness={0.92} roughness={0.2} />
          </mesh>
          {/* Right Glowing Floor/Ceiling Stripe */}
          <mesh position={[bridge.rightX / 1.7, 1.05, 0]}>
            <boxGeometry args={[11.8, 0.1, 3.0]} />
            <meshBasicMaterial color={bridge.color} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default CyberCity
