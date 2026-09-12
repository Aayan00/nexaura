import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { CinematicCamera } from './CinematicCamera'
import type { CameraMode } from './CinematicCamera'
import { PlanetMoon } from './PlanetMoon'
import { CyberCity } from './CyberCity'
import { NeonHighway } from './NeonHighway'
import { HolographicBillboards } from './HolographicBillboards'
import { FuturisticCar } from './FuturisticCar'
import { AtmosphericParticles } from './AtmosphericParticles'

interface LandingScene3DProps {
  cameraMode?: CameraMode
  speedMultiplier?: number
}

const LoadingFallback: React.FC = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#040712] text-cyan-400 font-mono text-xs z-10">
    <div className="relative w-12 h-12 mb-4 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
    <span className="tracking-widest uppercase animate-pulse">
      INITIALIZING NEXAURA WORLD…
    </span>
  </div>
)

export const LandingScene3D: React.FC<LandingScene3DProps> = ({
  cameraMode = 'chase',
  speedMultiplier = 1,
}) => {
  const currentSpeed = 38 * speedMultiplier

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto select-none overflow-hidden">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          className="w-full h-full"
        >
          {/* Deep Cyberpunk Atmospheric Fog */}
          <fog attach="fog" args={['#040714', 30, 190]} />

          {/* Cinematic Camera Controller */}
          <CinematicCamera mode={cameraMode} />

          {/* Master Cyberpunk Lighting */}
          {/* 1. Ambient Navy Sky Fill */}
          <ambientLight color="#0c1329" intensity={0.75} />

          {/* 2. Moonlight Directional Key Light */}
          <directionalLight
            position={[30, 45, -40]}
            color="#818cf8"
            intensity={2.4}
          />

          {/* 3. Neon Highway Key Fill Lights */}
          <pointLight position={[0, 12, -20]} color="#00f0ff" intensity={1.5} distance={50} />
          <pointLight position={[0, 15, -70]} color="#ec4899" intensity={1.8} distance={60} />
          <pointLight position={[0, 18, -120]} color="#a855f7" intensity={2.0} distance={70} />

          {/* Celestial Planet Moon */}
          <PlanetMoon />

          {/* Procedural Cyber City Skyline */}
          <CyberCity />

          {/* Elevated Neon Highway */}
          <NeonHighway speed={currentSpeed} />

          {/* Floating Holographic Productivity Billboards */}
          <HolographicBillboards />

          {/* Futuristic Cyber Supercar */}
          <FuturisticCar speed={currentSpeed} />

          {/* High-Speed Streaks & Ambient Cyber Dust */}
          <AtmosphericParticles speedMultiplier={speedMultiplier} />
        </Canvas>
      </Suspense>
    </div>
  )
}

export default LandingScene3D
