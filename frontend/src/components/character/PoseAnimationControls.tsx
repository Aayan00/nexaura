import React from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCw, Zap, Camera } from 'lucide-react'
import type { AnimePose, AuraPowerMode, CameraPreset } from '../3d/AnimeShonenHero3D'
import { sound } from '../../lib/sound'

interface PoseAnimationControlsProps {
  activePose: AnimePose
  onSelectPose: (pose: AnimePose) => void
  powerMode: AuraPowerMode
  onSelectPowerMode: (mode: AuraPowerMode) => void
  cameraPreset: CameraPreset
  onSelectCameraPreset: (preset: CameraPreset) => void
  autoRotate: boolean
  onToggleAutoRotate: () => void
}

const HERO_POSES: { id: AnimePose; label: string }[] = [
  { id: 'idle', label: 'IDLE' },
  { id: 'ready', label: 'READY' },
  { id: 'focus', label: 'FOCUS' },
  { id: 'victory', label: 'VICTORY' },
  { id: 'meditation', label: 'MEDITATION' },
]

const POWER_MODES: { id: AuraPowerMode; label: string; color: string }[] = [
  { id: 'normal', label: 'NORMAL', color: 'text-cyan-300 border-cyan-400' },
  { id: 'focus', label: 'FOCUS', color: 'text-purple-300 border-purple-400' },
  { id: 'overdrive', label: 'OVERDRIVE', color: 'text-pink-300 border-pink-500' },
]

const CAMERA_PRESETS: { id: CameraPreset; label: string }[] = [
  { id: 'full', label: 'FULL' },
  { id: 'portrait', label: 'FACE' },
  { id: 'action', label: 'ACTION' },
]

export const PoseAnimationControls: React.FC<PoseAnimationControlsProps> = ({
  activePose,
  onSelectPose,
  powerMode,
  onSelectPowerMode,
  cameraPreset,
  onSelectCameraPreset,
  autoRotate,
  onToggleAutoRotate,
}) => {
  return (
    <div className="p-3 bg-[#050816]/95 backdrop-blur-md border-t border-cyan-500/25 z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Poses Section */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
        <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold flex items-center gap-1 mr-1.5 shrink-0">
          <Play className="w-3 h-3 text-cyan-400 fill-cyan-400/30" />
          <span>HERO POSE:</span>
        </div>
        {HERO_POSES.map((st) => {
          const isActive = activePose === st.id
          return (
            <motion.button
              key={st.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                sound.playClick()
                onSelectPose(st.id)
              }}
              className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_12px_#00E5FF]'
                  : 'bg-[#050816]/80 text-slate-400 border-slate-800 hover:border-cyan-500/40 hover:text-cyan-300'
              }`}
            >
              {st.label}
            </motion.button>
          )
        })}
      </div>

      {/* Aura Power Mode & Camera Views */}
      <div className="flex items-center gap-3 justify-between sm:justify-end">
        {/* Aura Power Mode */}
        <div className="flex items-center gap-1 bg-[#030612] p-1 rounded-lg border border-slate-800">
          <div className="text-[9px] font-mono text-pink-400 uppercase font-bold flex items-center gap-1 px-1">
            <Zap className="w-3 h-3 text-pink-400" />
            <span className="hidden md:inline">AURA:</span>
          </div>
          {POWER_MODES.map((m) => {
            const isSelected = powerMode === m.id
            return (
              <button
                key={m.id}
                onClick={() => {
                  sound.playStatUpgrade()
                  onSelectPowerMode(m.id)
                }}
                className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase transition-all cursor-pointer border ${
                  isSelected
                    ? `bg-white/10 ${m.color} shadow-[0_0_8px_currentColor]`
                    : 'text-slate-500 border-transparent hover:text-slate-300'
                }`}
              >
                {m.label}
              </button>
            )
          })}
        </div>

        {/* Camera Preset Switcher */}
        <div className="flex items-center gap-1 bg-[#030612] p-1 rounded-lg border border-slate-800">
          <div className="text-[9px] font-mono text-cyan-400 uppercase font-bold flex items-center gap-1 px-1">
            <Camera className="w-3 h-3 text-cyan-400" />
          </div>
          {CAMERA_PRESETS.map((cam) => {
            const isCam = cameraPreset === cam.id
            return (
              <button
                key={cam.id}
                onClick={() => {
                  sound.playClick()
                  onSelectCameraPreset(cam.id)
                }}
                className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase transition-all cursor-pointer border ${
                  isCam
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                    : 'text-slate-500 border-transparent hover:text-slate-300'
                }`}
              >
                {cam.label}
              </button>
            )
          })}

          {/* Auto Rotate Button */}
          <button
            onClick={() => {
              sound.playClick()
              onToggleAutoRotate()
            }}
            className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer border ml-0.5 ${
              autoRotate
                ? 'bg-purple-500/20 text-purple-300 border-purple-400 shadow-[0_0_8px_rgba(139,92,246,0.4)]'
                : 'bg-transparent text-slate-500 border-transparent hover:text-slate-300'
            }`}
            title="Toggle Auto Rotation"
          >
            <RotateCw className={`w-2.5 h-2.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>ROT</span>
          </button>
        </div>
      </div>
    </div>
  )
}
