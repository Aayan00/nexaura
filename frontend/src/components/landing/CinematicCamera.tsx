import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

export type CameraMode = 'chase' | 'hood' | 'skyline'

interface CinematicCameraProps {
  mode?: CameraMode
  steeringOffset?: number
  nitro?: boolean
}

export const CinematicCamera: React.FC<CinematicCameraProps> = ({
  mode = 'chase',
  steeringOffset = 0,
  nitro = false,
}) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const currentLookAt = useRef(new THREE.Vector3(0, 1.35, -20))
  const { pointer } = useThree()

  useFrame(({ clock }, delta) => {
    if (!cameraRef.current) return
    const time = clock.getElapsedTime()

    let targetPos: THREE.Vector3
    let targetLook: THREE.Vector3

    if (mode === 'hood') {
      // 1. Low Ground/Hood Cam
      const microShake = nitro ? Math.sin(time * 40) * 0.025 : Math.sin(time * 24) * 0.012
      targetPos = new THREE.Vector3(
        steeringOffset * 0.4 + pointer.x * 0.35,
        1.18 + microShake,
        3.5
      )
      targetLook = new THREE.Vector3(
        steeringOffset * 1.1,
        0.75,
        -32
      )
    } else if (mode === 'skyline') {
      // 2. Wide Panoramic City & Planet Reveal Angle
      targetPos = new THREE.Vector3(
        -12.5 + Math.sin(time * 0.3) * 1.6,
        8.2 + Math.cos(time * 0.2) * 0.9,
        11.2
      )
      targetLook = new THREE.Vector3(
        8 + pointer.x * 3.5,
        15 + pointer.y * 2.5,
        -48
      )
    } else {
      // 3. Default CHASE Cam: Cinematic rear view framed near bottom-center
      const speedShake = nitro ? Math.sin(time * 36) * 0.022 : 0
      const lateralSway = Math.sin(time * 0.7) * 0.3 + steeringOffset * 0.75 + pointer.x * 0.5
      const verticalFloat = 3.25 + Math.sin(time * 1.2) * 0.1 - pointer.y * 0.35 + speedShake
      const zOffset = nitro ? 6.8 : 7.6

      targetPos = new THREE.Vector3(
        lateralSway,
        verticalFloat,
        zOffset
      )
      targetLook = new THREE.Vector3(
        steeringOffset * 0.9 + pointer.x * 1.0,
        1.35,
        -20
      )
    }

    // Smooth Lerp Position & LookAt with delta time
    cameraRef.current.position.lerp(targetPos, delta * 3.8)
    currentLookAt.current.lerp(targetLook, delta * 3.8)
    cameraRef.current.lookAt(currentLookAt.current)
  })

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={nitro ? 68 : 62}
      near={0.1}
      far={350}
      position={[0, 3.25, 7.6]}
    />
  )
}

export default CinematicCamera
