import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface InfiniteHighwayProps {
  speed?: number
  nitro?: boolean
}

export const InfiniteHighway: React.FC<InfiniteHighwayProps> = ({
  speed = 35,
  nitro = false,
}) => {
  const segmentsGroupRef = useRef<THREE.Group>(null)

  // 10 modular road segments spanning from +25 to -225
  const SEGMENT_COUNT = 10
  const SEGMENT_LENGTH = 25
  const TOTAL_LENGTH = SEGMENT_COUNT * SEGMENT_LENGTH // 250 units
  const RECYCLE_LIMIT = 25

  // Optimized shared materials with wet specular response
  const asphaltMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#03050c', // Wet deep obsidian asphalt
        roughness: 0.12, // High wet gloss
        metalness: 0.94,
      }),
    []
  )

  const roadSubstructureMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#02040b',
        roughness: 0.65,
        metalness: 0.5,
      }),
    []
  )

  const barrierMetalMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#080e1e',
        roughness: 0.25,
        metalness: 0.94,
      }),
    []
  )

  const cyanGlowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#00f0ff',
      }),
    []
  )

  const violetGlowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#8b5cf6',
      }),
    []
  )

  const magentaGlowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ff007f',
      }),
    []
  )

  const tealDashMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#06b6d4',
      }),
    []
  )

  const purpleDashMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#a855f7',
      }),
    []
  )

  const wetPuddleMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#080e1c',
        roughness: 0.03, // Mirror wet puddle
        metalness: 0.98,
      }),
    []
  )

  // Infinite Driving Loop: Recycles road segments backward towards +Z
  useFrame((_, delta) => {
    if (!segmentsGroupRef.current) return
    const activeSpeed = (nitro ? speed * 1.6 : speed) * delta

    const segments = segmentsGroupRef.current.children
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i]
      seg.position.z += activeSpeed

      // If segment passes behind the camera, wrap it to the far horizon
      if (seg.position.z > RECYCLE_LIMIT) {
        seg.position.z -= TOTAL_LENGTH
      }
    }
  })

  return (
    <group position={[0, -0.6, 0]}>
      {/* Container for moving recycled segments */}
      <group ref={segmentsGroupRef}>
        {Array.from({ length: SEGMENT_COUNT }).map((_, index) => {
          const initialZ = 20 - index * SEGMENT_LENGTH
          const hasGantry = index % 3 === 0
          const hasPylon = index % 2 === 0

          return (
            <group key={index} position={[0, 0, initialZ]}>
              {/* 1. Wet Reflective Asphalt Deck */}
              <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0, -SEGMENT_LENGTH / 2]}
              >
                <planeGeometry args={[14.4, SEGMENT_LENGTH]} />
                <primitive object={asphaltMaterial} attach="material" />
              </mesh>

              {/* Wet Puddle Sheen Inset Patches */}
              <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[index % 2 === 0 ? -1.8 : 1.8, 0.005, -SEGMENT_LENGTH / 2]}
              >
                <planeGeometry args={[2.8, SEGMENT_LENGTH * 0.45]} />
                <primitive object={wetPuddleMaterial} attach="material" />
              </mesh>

              {/* 2. Concrete/Steel Substructure Deck */}
              <mesh position={[0, -0.35, -SEGMENT_LENGTH / 2]}>
                <boxGeometry args={[15.2, 0.6, SEGMENT_LENGTH]} />
                <primitive object={roadSubstructureMaterial} attach="material" />
              </mesh>

              {/* 3. Left Outer Barrier Guardrail */}
              <group position={[-7.4, 0.45, -SEGMENT_LENGTH / 2]}>
                <mesh>
                  <boxGeometry args={[0.32, 0.85, SEGMENT_LENGTH]} />
                  <primitive object={barrierMetalMaterial} attach="material" />
                </mesh>
                {/* Glowing Cyan Neon Strip on Left Rail */}
                <mesh position={[0.18, 0.26, 0]}>
                  <boxGeometry args={[0.06, 0.14, SEGMENT_LENGTH]} />
                  <primitive object={cyanGlowMaterial} attach="material" />
                </mesh>
              </group>

              {/* 4. Right Outer Barrier Guardrail */}
              <group position={[7.4, 0.45, -SEGMENT_LENGTH / 2]}>
                <mesh>
                  <boxGeometry args={[0.32, 0.85, SEGMENT_LENGTH]} />
                  <primitive object={barrierMetalMaterial} attach="material" />
                </mesh>
                {/* Glowing Magenta Neon Strip on Right Rail */}
                <mesh position={[-0.18, 0.26, 0]}>
                  <boxGeometry args={[0.06, 0.14, SEGMENT_LENGTH]} />
                  <primitive object={magentaGlowMaterial} attach="material" />
                </mesh>
              </group>

              {/* 5. Solid Shoulder Glow Lines */}
              <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[-6.2, 0.02, -SEGMENT_LENGTH / 2]}
              >
                <planeGeometry args={[0.18, SEGMENT_LENGTH]} />
                <primitive object={cyanGlowMaterial} attach="material" />
              </mesh>
              <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[6.2, 0.02, -SEGMENT_LENGTH / 2]}
              >
                <planeGeometry args={[0.18, SEGMENT_LENGTH]} />
                <primitive object={violetGlowMaterial} attach="material" />
              </mesh>

              {/* 6. Dashed Lane Markings along this segment */}
              {[1, 2, 3].map((subIdx) => {
                const dashZ = -SEGMENT_LENGTH * (subIdx / 3.5)
                return (
                  <group key={subIdx} position={[0, 0.025, dashZ]}>
                    {/* Center Lane Divider Dashes (Cyan) */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]}>
                      <planeGeometry args={[0.26, 3.4]} />
                      <primitive object={cyanGlowMaterial} attach="material" />
                    </mesh>
                    {/* Left Lane Inner Dashes (Teal) */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.1, 0, 0]}>
                      <planeGeometry args={[0.16, 2.8]} />
                      <primitive object={tealDashMaterial} attach="material" />
                    </mesh>
                    {/* Right Lane Inner Dashes (Purple) */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.1, 0, 0]}>
                      <planeGeometry args={[0.16, 2.8]} />
                      <primitive object={purpleDashMaterial} attach="material" />
                    </mesh>
                  </group>
                )
              })}

              {/* 7. Massive Highway Support Pylon */}
              {hasPylon && (
                <group position={[0, -11, -SEGMENT_LENGTH / 2]}>
                  <mesh>
                    <cylinderGeometry args={[1.8, 2.6, 22, 10]} />
                    <primitive object={roadSubstructureMaterial} attach="material" />
                  </mesh>
                  {/* Glowing collar ring */}
                  <mesh position={[0, 7.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[2.2, 0.12, 8, 24]} />
                    <primitive object={cyanGlowMaterial} attach="material" />
                  </mesh>
                </group>
              )}

              {/* 8. Overhead Tech Gantry Arch */}
              {hasGantry && (
                <group position={[0, 5.2, -SEGMENT_LENGTH / 2]}>
                  {/* Horizontal Crossbeam */}
                  <mesh>
                    <boxGeometry args={[16.8, 0.55, 0.65]} />
                    <primitive object={barrierMetalMaterial} attach="material" />
                  </mesh>
                  {/* Left Upright Support */}
                  <mesh position={[-8.1, -2.6, 0]}>
                    <boxGeometry args={[0.65, 5.2, 0.65]} />
                    <primitive object={barrierMetalMaterial} attach="material" />
                  </mesh>
                  {/* Right Upright Support */}
                  <mesh position={[8.1, -2.6, 0]}>
                    <boxGeometry args={[0.65, 5.2, 0.65]} />
                    <primitive object={barrierMetalMaterial} attach="material" />
                  </mesh>
                  {/* Glowing Cyan Status Strip */}
                  <mesh position={[0, -0.32, 0]}>
                    <boxGeometry args={[14.8, 0.12, 0.7]} />
                    <primitive object={cyanGlowMaterial} attach="material" />
                  </mesh>
                  {/* Overhead Scanner Light */}
                  <pointLight
                    position={[0, -0.8, 0]}
                    color="#00f0ff"
                    intensity={0.6}
                    distance={10}
                    decay={2}
                  />
                </group>
              )}
            </group>
          )
        })}
      </group>
    </group>
  )
}

export default InfiniteHighway
