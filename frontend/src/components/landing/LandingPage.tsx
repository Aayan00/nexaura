import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Terminal,
  Camera,
  Gauge,
  Radio,
  MapPin,
  Clock,
  Flame,
  Users,
  CheckCircle2,
  Star,
  Infinity as InfinityIcon,
} from 'lucide-react'
import { LandingNavbar } from './LandingNavbar'
import { SceneErrorBoundary } from './SceneErrorBoundary'
import { CinematicCamera, type CameraMode } from './CinematicCamera'
import { Planet } from './Planet'
import { CyberCity } from './CyberCity'
import { InfiniteHighway } from './InfiniteHighway'
import { HolographicBillboard } from './HolographicBillboard'
import { FuturisticCar } from './FuturisticCar'
import { FlyingVehicles } from './FlyingVehicles'
import { NeonParticles } from './NeonParticles'
import { FeatureCards } from './FeatureCards'
import { WorldPreviewSection } from './WorldPreviewSection'
import { NeuralVisionLab } from '../focus/NeuralVisionLab'
import { CallToActionSection } from './CallToActionSection'
import { LandingFooter } from './LandingFooter'
import { NeonButton } from '../NeonButton'

export const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const [cameraMode, setCameraMode] = useState<CameraMode>('chase')
  const [isNitro, setIsNitro] = useState(false)
  const [sceneLoaded, setSceneLoaded] = useState(false)

  // Mark scene as loaded smoothly without unmounting canvas
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSceneLoaded(true)
    }, 450)
    return () => window.clearTimeout(timer)
  }, [])

  const baseSpeed = isNitro ? 56 : 36
  const displaySpeed = isNitro ? '360 KM/H' : '248 KM/H'

  return (
    <div className="min-h-screen bg-[#030611] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* 1. Transparent Futuristic Navigation Bar */}
      <LandingNavbar />

      {/* 2. Hero Section with Full-Screen Continuous 3D Cyberpunk Scene */}
      <section
        id="hero"
        className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Full-Screen 3D Canvas Background */}
        <div className="absolute inset-0 w-full h-full pointer-events-auto select-none overflow-hidden z-0">
          <SceneErrorBoundary>
            <Canvas
              dpr={[1, 1.5]}
              gl={{
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance',
              }}
              camera={{ position: [0, 3.25, 7.6], fov: 62 }}
              className="w-full h-full"
            >
              {/* Deep Cyberpunk Atmospheric Fog */}
              <fog attach="fog" args={['#040714', 35, 200]} />

              {/* 3rd Person Cinematic Chase Camera */}
              <CinematicCamera mode={cameraMode} nitro={isNitro} />

              {/* Master Cyberpunk Lighting (Sections 3 & 6: Standard Three.js lights, no postprocessing) */}
              <ambientLight color="#0c142c" intensity={0.85} />
              <directionalLight
                position={[30, 50, -40]}
                color="#818cf8"
                intensity={2.6}
              />
              {/* Neon Highway Key Fill Lights */}
              <pointLight position={[0, 14, -20]} color="#00f0ff" intensity={1.6} distance={60} />
              <pointLight position={[0, 16, -70]} color="#ff007f" intensity={1.9} distance={70} />
              <pointLight position={[0, 18, -125]} color="#a855f7" intensity={2.1} distance={80} />

              {/* Celestial Planet / Moon */}
              <Planet />

              {/* Procedural Dense Cyber City Skyline */}
              <CyberCity />

              {/* Infinite Wet Reflective Highway */}
              <InfiniteHighway speed={baseSpeed} nitro={isNitro} />

              {/* Floating Holographic Billboards */}
              <HolographicBillboard />

              {/* Centered Procedural Futuristic Supercar */}
              <FuturisticCar speed={baseSpeed} nitro={isNitro} />

              {/* Aerial Spinners & Distant Traffic */}
              <FlyingVehicles highwaySpeed={baseSpeed} />

              {/* High-Speed Light Streaks & Cyber Dust Particles */}
              <NeonParticles speedMultiplier={isNitro ? 1.6 : 1.0} nitro={isNitro} />
            </Canvas>
          </SceneErrorBoundary>
        </div>

        {/* Elegant Non-Destructive Initializing Overlay (Section 13 & 15) */}
        {!sceneLoaded && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#030612] text-cyan-400 font-mono text-xs transition-opacity duration-500">
            <div className="relative w-12 h-12 mb-4 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin shadow-[0_0_15px_rgba(0,240,255,0.4)]" />
            <span className="tracking-widest uppercase animate-pulse">
              INITIALIZING NEXAURA WORLD…
            </span>
          </div>
        )}

        {/* Ambient Dark Scrim Gradients (Preserves readability of hero text over 3D city) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#030611]/92 via-[#030611]/65 to-transparent pointer-events-none z-10 w-full lg:w-3/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030611] via-transparent to-[#030611]/40 pointer-events-none z-10" />

        {/* Hero Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-32 relative z-20">
          <div className="max-w-2xl">
            {/* Hero Label Badge (Section 2) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a1428]/90 border border-cyan-500/40 text-xs font-mono text-cyan-300 uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(0,240,255,0.25)] backdrop-blur-md"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>A REAL-WORLD RPG FOR A HIGHER YOU</span>
            </motion.div>

            {/* Main Heading (Section 2) */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-orbitron text-4xl sm:text-6xl lg:text-7xl font-black tracking-wider text-white uppercase leading-[1.08] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]"
            >
              UPGRADE<br />
              YOUR <span className="text-cyan-400 text-glow-cyan">REALITY</span>
            </motion.h1>

            {/* Supporting Text (Section 2) */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-sm sm:text-base lg:text-lg font-mono text-slate-300 leading-relaxed drop-shadow-md max-w-xl"
            >
              Turn your goals into missions. Build your character. Stay consistent. Unlock your potential.
            </motion.p>

            {/* Primary & Secondary Action Buttons (Section 2 & 16) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <NeonButton
                variant="cyan"
                size="lg"
                onClick={() => navigate('/register')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-bold tracking-wider uppercase text-sm sm:text-base justify-center shadow-[0_0_25px_rgba(0,240,255,0.4)]"
              >
                CREATE ACCOUNT →
              </NeonButton>

              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3.5 rounded border border-cyan-500/40 hover:border-cyan-400 bg-[#081329]/80 hover:bg-cyan-500/20 text-xs sm:text-sm font-mono font-bold text-cyan-300 uppercase tracking-wider transition-all cursor-pointer backdrop-blur-md shadow-md text-center flex items-center justify-center gap-2"
              >
                <span>ENTER NEXAURA →</span>
              </button>
            </motion.div>
          </div>
        </div>

        {/* 3. Futuristic HUD: Bottom-Left Statistics Panel (Section 12) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute bottom-6 left-4 sm:left-8 z-20 hidden sm:flex items-center gap-3 md:gap-5 px-5 py-3 rounded-xl bg-[#040816]/85 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_25px_rgba(0,0,0,0.7)] cyber-clip-corner"
        >
          {/* Stat 1 */}
          <div className="flex items-center gap-2.5 pr-4 border-r border-slate-800">
            <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="font-orbitron font-black text-sm text-slate-100">10K+</div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-slate-400">OPERATIVES</div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center gap-2.5 pr-4 border-r border-slate-800">
            <div className="p-2 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-orbitron font-black text-sm text-slate-100">95%</div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-slate-400">GOAL COMPLETION</div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center gap-2.5 pr-4 border-r border-slate-800">
            <div className="p-2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <div className="font-orbitron font-black text-sm text-slate-100">4.9</div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-slate-400">USER RATING</div>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <InfinityIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="font-orbitron font-black text-sm text-slate-100">∞</div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-slate-400">POSSIBILITIES</div>
            </div>
          </div>
        </motion.div>

        {/* 4. Futuristic HUD: Right-Side Telemetry & Camera Controller (Section 11 & 12) */}
        <div className="absolute bottom-6 right-4 sm:right-8 z-20 flex flex-col items-end gap-2.5">
          {/* Live Telemetry Card */}
          <div className="hidden md:flex flex-col gap-1.5 p-3 rounded-xl bg-[#040816]/85 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.6)] text-[10px] font-mono text-slate-300 w-52">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800/80 text-cyan-400 font-bold tracking-widest uppercase">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-pink-400 animate-pulse" />
                TELEMETRY FEED
              </span>
              <span className="text-[9px] text-slate-500">LIVE</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1">
                <Gauge className="w-3 h-3 text-cyan-400" /> SPEED:
              </span>
              <span className="font-bold text-slate-100 font-orbitron">{displaySpeed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-pink-400" /> LOCATION:
              </span>
              <span className="font-bold text-slate-200">NEXUS CITY</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-purple-400" /> TIME:
              </span>
              <span className="font-bold text-cyan-300">LIVE</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">MODE:</span>
              <span className="font-bold text-pink-400">FREE DRIVE</span>
            </div>
          </div>

          {/* Interactive Camera Mode Switcher (Section 11) */}
          <div className="flex flex-col items-end gap-1.5">
            <div className="px-2.5 py-1 rounded bg-[#070e22]/90 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 uppercase tracking-widest backdrop-blur-md flex items-center gap-1.5 shadow-md">
              <Camera className="w-3 h-3 text-cyan-400" />
              <span>3D CAMERA FEED</span>
            </div>

            <div className="flex items-center gap-1 bg-[#050b1a]/90 border border-cyan-500/40 p-1.5 rounded-lg backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)]">
              <button
                onClick={() => setCameraMode('chase')}
                className={`px-3 py-1.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  cameraMode === 'chase'
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_#00f0ff]'
                    : 'text-slate-400 hover:text-cyan-300'
                }`}
              >
                CHASE
              </button>
              <button
                onClick={() => setCameraMode('hood')}
                className={`px-3 py-1.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  cameraMode === 'hood'
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_#00f0ff]'
                    : 'text-slate-400 hover:text-cyan-300'
                }`}
              >
                HOOD
              </button>
              <button
                onClick={() => setCameraMode('skyline')}
                className={`px-3 py-1.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  cameraMode === 'skyline'
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_#00f0ff]'
                    : 'text-slate-400 hover:text-cyan-300'
                }`}
              >
                SKYLINE
              </button>

              {/* Nitro Boost Toggle */}
              <button
                onClick={() => setIsNitro(!isNitro)}
                className={`ml-1 px-3 py-1.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase transition-all cursor-pointer border flex items-center gap-1 ${
                  isNitro
                    ? 'border-pink-500 bg-pink-500/25 text-pink-200 shadow-[0_0_12px_#ff007f]'
                    : 'border-slate-800 text-slate-400 hover:text-pink-300 hover:border-pink-500/40'
                }`}
                title="Toggle Nitro Boost"
              >
                <Flame className={`w-3 h-3 ${isNitro ? 'text-pink-400 animate-bounce' : 'text-slate-500'}`} />
                <span>NITRO {isNitro ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Five Futuristic Feature Cards Section (Section 12) */}
      <FeatureCards />

      {/* 6. World Preview Section */}
      <WorldPreviewSection />

      {/* 7. Neural Vision Lab: Ambiguous Rotation Experiment (Section 07) */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-20">
        <NeuralVisionLab />
      </section>

      {/* 8. Call To Action Section */}
      <CallToActionSection />

      {/* 8. Branded Futuristic Footer */}
      <LandingFooter />
    </div>
  )
}

export default LandingPage
