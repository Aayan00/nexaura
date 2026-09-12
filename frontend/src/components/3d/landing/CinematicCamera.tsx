import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

export type CameraMode = 'chase' | 'hood' | 'skyline'

interface CinematicCameraProps {
  mode?: CameraMode
  steeringOffset?: number
}

export const CinematicCamera: React.FC<CinematicCameraProps> = ({
  mode = 'chase',
  steeringOffset = 0,
}) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const currentLookAt = useRef(new THREE.Vector3(0, 1.2, -15))
  const { mouse } = useThree()

  useFrame(({ clock }, delta) => {
    if (!cameraRef.current) return
    const time = clock.getElapsedTime()

    let targetPos: THREE.Vector3
    let targetLook: THREE.Vector3

    if (mode === 'hood') {
      // Low intense speed cam
      const bob = Math.sin(time * 24) * 0.015
      targetPos = new THREE.Vector3(
        steeringOffset * 0.4 + mouse.x * 0.3,
        1.15 + bob,
        3.6
      )
      targetLook = new THREE.Vector3(
        steeringOffset * 1.2,
        0.8,
        -30
      )
    } else if (mode === 'skyline') {
      // Wide panoramic skyline reveal angle
      targetPos = new THREE.Vector3(
        -11.5 + Math.sin(time * 0.3) * 1.5,
        7.8 + Math.cos(time * 0.2) * 0.8,
        10.5
      )
      targetLook = new THREE.Vector3(
        8 + mouse.x * 3,
        14 + mouse.y * 2,
        -45
      )
    } else {
      // Default 'chase' cam: smooth cinematic follow with subtle cursor tracking
      const lateralSway = Math.sin(time * 0.7) * 0.35 + steeringOffset * 0.8 + mouse.x * 0.6
      const verticalFloat = 3.2 + Math.sin(time * 1.2) * 0.12 - mouse.y * 0.4
      targetPos = new THREE.Vector3(
        lateralSway,
        verticalFloat,
        7.4
      )
      targetLook = new THREE.Vector3(
        steeringOffset * 1.0 + mouse.x * 1.2,
        1.4,
        -18
      )
    }

    // Smooth Lerp Position
    cameraRef.current.position.lerp(targetPos, delta * 4)

    // Smooth Lerp Look Target
    currentLookAt.current.lerp(targetLook, delta * 4)
    cameraRef.current.lookAt(currentLookAt.current)
  })

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={62}
      near={0.1}
      far={300}
      position={[0, 3.2, 7.4]}
    />
  )
}

export default CinematicCamera
