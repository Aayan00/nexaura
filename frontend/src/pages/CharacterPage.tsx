import React, { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  RefreshCw,
  Eye,
  ZoomIn,
  ZoomOut,
  FolderOpen,
  X,
  Radio,
  Shield,
  Palette,
} from 'lucide-react'
import { AnimeShonenHero3D, type AnimePose, type AuraPowerMode, type AnimeTheme, type CameraPreset } from '../components/3d/AnimeShonenHero3D'
import { StatCrystalResonator3D } from '../components/3d/StatCrystalResonator3D'
import { CharacterEquipmentSlots, type EquipmentSlotId } from '../components/character/CharacterEquipmentSlots'
import { PoseAnimationControls } from '../components/character/PoseAnimationControls'
import { NeuralProgressionHeader } from '../components/character/NeuralProgressionHeader'
import { UnassignedPointsAlert } from '../components/character/UnassignedPointsAlert'
import { NeuralAttributeMatrix } from '../components/character/NeuralAttributeMatrix'
import { useRPG } from '../context/RPGContext'
import { sound } from '../lib/sound'
import type { AttributeType } from '../types/rpg'

export const CharacterPage: React.FC = () => {
  const { user, attributes, allocateStatPoint } = useRPG()

  // Character stage controls state
  const [activePose, setActivePose] = useState<AnimePose>('idle')
  const [activePowerMode, setActivePowerMode] = useState<AuraPowerMode>('normal')
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('full')
  const [activeTheme, setActiveTheme] = useState<AnimeTheme>('default')
  const [showVisor, setShowVisor] = useState(true)
  const [autoRotate, setAutoRotate] = useState(false)
  const [wireframe, setWireframe] = useState(false)
  const [resetTrigger, setResetTrigger] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(0) // -2 to +2
  const [selectedSlot, setSelectedSlot] = useState<EquipmentSlotId | null>('head')

  // 3D Stat Resonator state
  const [activeStatTab, setActiveStatTab] = useState<AttributeType>('INT')

  // Custom GLB Model loader dialog state
  const [showModelModal, setShowModelModal] = useState(false)
  const [customModelUrl, setCustomModelUrl] = useState<string>('')
  const [modelInput, setModelInput] = useState<string>('')

  // Computed Power Rating
  const totalAttributeScore = attributes.reduce((acc, curr) => acc + curr.value, 0)
  const powerRating = totalAttributeScore * 10 + user.level * 250

  const handleZoomIn = () => {
    sound.playClick()
    setZoomLevel((prev) => Math.min(prev + 1, 3))
  }

  const handleZoomOut = () => {
    sound.playClick()
    setZoomLevel((prev) => Math.max(prev - 1, -2))
  }

  const handleResetCamera = () => {
    sound.playClick()
    setResetTrigger((prev) => prev + 1)
    setZoomLevel(0)
  }

  const handleLoadCustomModel = (e: React.FormEvent) => {
    e.preventDefault()
    if (modelInput.trim()) {
      setCustomModelUrl(modelInput.trim())
      setShowModelModal(false)
      sound.playStatUpgrade()
    }
  }

  return (
    <div className="space-y-6 pb-20 relative select-none">
      {/* 1. Cyberpunk Ambient Background Overlays */}
      <div className="fixed inset-0 pointer-events-none opacity-25 z-0 cyber-grid-bg" />
      <div className="fixed top-20 right-1/3 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-10 left-1/4 w-[500px] h-[500px] bg-pink-500/8 rounded-full blur-3xl pointer-events-none z-0" />

      {/* 2. Top Neural Progression Header */}
      <div className="relative z-10">
        <NeuralProgressionHeader
          level={user.level}
          currentXP={user.currentXP}
          maxXP={user.maxXP}
          unassignedPoints={user.unassignedPoints}
        />
      </div>

      {/* 3. Main Operational Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* ========================================================
            LEFT COLUMN: 3D CHARACTER STAGE & CONTROLS (7 Cols)
           ======================================================== */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Main 3D Holographic Chamber Card */}
          <div className="rounded-2xl bg-[#080B18]/90 border border-cyan-500/35 backdrop-blur-xl relative overflow-hidden shadow-[0_0_35px_rgba(0,229,255,0.18)] flex flex-col justify-between min-h-[560px] sm:min-h-[620px]">
            {/* Holographic Chamber Top Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-cyan-500/20 z-20 bg-[#050816]/80 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00E5FF]" />
                <span className="font-mono text-xs sm:text-sm font-black text-cyan-300 uppercase tracking-widest flex items-center gap-1.5">
                  ● NEXAURA // SHADOW ASCENDANT
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono text-pink-400 bg-[#020611] px-2 py-0.5 rounded border border-pink-500/30">
                  SHONEN ANIME HERO
                </span>
              </div>

              {/* Theme Customizer Pills (Section 10) */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                <span className="hidden md:flex items-center gap-1 text-[9px] font-mono text-cyan-400/80 mr-1">
                  <Palette className="w-3 h-3" />
                </span>
                {[
                  { id: 'default', label: 'SHADOW ASCENDANT' },
                  { id: 'cyan_void', label: 'CYAN VOID' },
                  { id: 'neo_tokyo', label: 'NEO-TOKYO' },
                  { id: 'amber_terminal', label: 'AMBER' },
                  { id: 'matrix_emerald', label: 'MATRIX' },
                ].map((thm) => (
                  <button
                    key={thm.id}
                    onClick={() => {
                      sound.playClick()
                      setActiveTheme(thm.id as AnimeTheme)
                    }}
                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase transition-all cursor-pointer border ${
                      activeTheme === thm.id
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                        : 'border-slate-800 bg-[#070c1a]/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {thm.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chamber Viewport Container */}
            <div className="relative w-full flex-1 min-h-[440px] sm:min-h-[500px]">
              {/* Subtle Cyber Grid & Scanlines inside 3D Viewport */}
              <div className="absolute inset-0 cyber-grid-dense opacity-15 pointer-events-none z-0" />
              <div className="absolute inset-0 cyber-scanlines opacity-10 pointer-events-none z-0" />

              {/* Viewport Floating Camera Controls Toolbar (Top Left) */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 bg-[#050816]/90 backdrop-blur-md border border-cyan-500/30 rounded-xl p-1.5 shadow-[0_0_15px_rgba(0,229,255,0.15)]">
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-all cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-all cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetCamera}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-all cursor-pointer"
                  title="Reset Camera View"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    sound.playClick()
                    setWireframe(!wireframe)
                  }}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    wireframe
                      ? 'bg-purple-500/25 text-purple-300 border border-purple-400/60 shadow-[0_0_8px_rgba(139,92,246,0.5)]'
                      : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80'
                  }`}
                  title="Toggle Wireframe HUD"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    sound.playClick()
                    setShowVisor(!showVisor)
                  }}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    showVisor
                      ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/60 shadow-[0_0_8px_rgba(0,229,255,0.5)]'
                      : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80'
                  }`}
                  title="Toggle Tactical Visor (HUD Eyewear)"
                >
                  <Shield className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    sound.playClick()
                    setShowModelModal(true)
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-pink-300 hover:bg-slate-800/80 transition-all cursor-pointer"
                  title="Load Local GLB / GLTF Model"
                >
                  <FolderOpen className="w-4 h-4" />
                </button>
              </div>

              {/* Vertical Character Equipment Slots (Right Edge of 3D Canvas) */}
              <div className="absolute top-4 right-4 z-20">
                <CharacterEquipmentSlots
                  selectedSlot={selectedSlot}
                  onSelectSlot={(slot) => setSelectedSlot(slot)}
                />
              </div>

              {/* Floating Anime Hero HUD Labels (Section 9) */}
              <div className="absolute top-4 left-16 z-20 hidden md:flex flex-col gap-1 text-[9px] font-mono pointer-events-none">
                <div className="px-2 py-0.5 rounded bg-black/60 border border-cyan-500/30 text-cyan-300 font-bold backdrop-blur-md">
                  NEXAURA OPERATIVE // LEVEL 99
                </div>
                <div className="px-2 py-0.5 rounded bg-black/60 border border-purple-500/30 text-purple-300 font-bold backdrop-blur-md">
                  MAXIMUM XP • LEGENDARY STATUS
                </div>
                <div className="px-2 py-0.5 rounded bg-black/60 border border-pink-500/30 text-pink-300 backdrop-blur-md">
                  STR 100 • INT 100 • DIS 100 • VIT 100 • FOC 100
                </div>
              </div>

              {/* Bottom Rig Status Tag */}
              <div className="absolute bottom-3 left-4 z-20 flex items-center gap-2 text-[10px] font-mono text-cyan-400/85 bg-[#020611]/85 px-2.5 py-1 rounded-lg border border-cyan-500/25 backdrop-blur-md pointer-events-none">
                <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>NEXAURA_HERO :: {activePose.toUpperCase()} // AURA: {activePowerMode.toUpperCase()}</span>
              </div>

              {/* Three.js R3F WebGL Canvas */}
              <Canvas
                camera={{ position: [0, 0.85, 3.25], fov: 45 }}
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                className="w-full h-full cursor-grab active:cursor-grabbing"
              >
                <Suspense fallback={null}>
                  <AnimeShonenHero3D
                    pose={activePose}
                    powerMode={activePowerMode}
                    cameraPreset={cameraPreset}
                    autoRotate={autoRotate}
                    wireframe={wireframe}
                    resetTrigger={resetTrigger}
                    zoomLevel={zoomLevel}
                    modelUrl={customModelUrl || undefined}
                    theme={activeTheme}
                    showVisor={showVisor}
                  />
                </Suspense>
              </Canvas>
            </div>

            {/* Pose & Animation Trigger Footer Bar */}
            <PoseAnimationControls
              activePose={activePose}
              onSelectPose={(p) => setActivePose(p)}
              powerMode={activePowerMode}
              onSelectPowerMode={(m) => setActivePowerMode(m)}
              cameraPreset={cameraPreset}
              onSelectCameraPreset={(c) => setCameraPreset(c)}
              autoRotate={autoRotate}
              onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
            />
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN: STAT CRYSTAL & NEURAL ATTRIBUTE MATRIX (5 Cols)
           ======================================================== */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* Unassigned Stat Point Alert Card */}
          <UnassignedPointsAlert unassignedPoints={user.unassignedPoints} />

          {/* 3D Stat Crystal Resonator */}
          <StatCrystalResonator3D
            attributes={attributes}
            activeStat={activeStatTab}
            onSelectStat={(s) => setActiveStatTab(s)}
            onInjectPoint={(s) => allocateStatPoint(s)}
            unassignedPoints={user.unassignedPoints}
            powerRating={powerRating}
          />

          {/* Neural Attribute Matrix */}
          <NeuralAttributeMatrix
            attributes={attributes}
            unassignedPoints={user.unassignedPoints}
            onAllocateStat={(code) => allocateStatPoint(code)}
          />
        </div>
      </div>

      {/* ========================================================
          CUSTOM GLB MODEL MODAL
         ======================================================== */}
      {showModelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-[#080B18] border border-cyan-500/40 p-6 shadow-[0_0_40px_rgba(0,229,255,0.25)] space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h3 className="font-mono text-sm font-bold text-cyan-300 uppercase flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-cyan-400" />
                LOAD CUSTOM 3D OPERATIVE GLB/GLTF
              </h3>
              <button
                onClick={() => setShowModelModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-mono text-slate-300 leading-relaxed">
              Place your licensed 3D model in{' '}
              <code className="px-1.5 py-0.5 rounded bg-black border border-cyan-500/30 text-cyan-300">
                frontend/public/assets/models/
              </code>{' '}
              or enter a local/relative URL path below (e.g.{' '}
              <code className="text-pink-300">/assets/models/cyber_operative.glb</code>).
            </p>

            <form onSubmit={handleLoadCustomModel} className="space-y-3">
              <input
                type="text"
                value={modelInput}
                onChange={(e) => setModelInput(e.target.value)}
                placeholder="/assets/models/cyber_operative.glb"
                className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                {customModelUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomModelUrl('')
                      setModelInput('')
                      setShowModelModal(false)
                      sound.playClick()
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-400 hover:text-white"
                  >
                    Reset to Procedural AAA Operative
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold shadow-[0_0_12px_#00E5FF] cursor-pointer"
                >
                  Apply 3D Model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
