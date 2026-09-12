import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Eye,
  RotateCw,
  Play,
  Pause,
  Shuffle,
  Gauge,
  Sparkles,
  Layers,
  Palette,
  Camera,
  CheckCircle2,
  Award,
  Zap,
  Info,
  Clock,
  ShieldCheck,
  LogIn,
  Sliders,
} from 'lucide-react'
import { AmbiguousSphere3D, type AmbiguousSphere3DHandle, type ColorMode, type DensityMode } from '../3d/AmbiguousSphere3D'
import { GlassPanel } from '../GlassPanel'
import { useRPG } from '../../context/RPGContext'
import { sound } from '../../lib/sound'
import { cn } from '../../lib/utils'
import { Link } from 'react-router-dom'

export const NeuralVisionLab: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isAuthenticated, awardVisionReward, claimedVisionRewards } = useRPG()

  // Accessibility: prefers-reduced-motion initialized cleanly
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
    return false
  })

  const [speed, setSpeed] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 0.4
    }
    return 1.0
  })

  // 3D Sphere Controls State
  const [direction, setDirection] = useState<number>(1)
  const [autoReverse, setAutoReverse] = useState<boolean>(false)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [density, setDensity] = useState<DensityMode>('med')
  const [colorMode, setColorMode] = useState<ColorMode>('cyan')
  const [userPerception, setUserPerception] = useState<'cw' | 'ccw' | 'bistable'>('cw')

  // Session & Telemetry State
  const [sessionSeconds, setSessionSeconds] = useState<number>(0)
  const [manualReversalsCount, setManualReversalsCount] = useState<number>(0)
  const [lastAutoReverseIn, setLastAutoReverseIn] = useState<number>(0)

  // 3D Handle ref for camera reset
  const sphere3DRef = useRef<AmbiguousSphere3DHandle>(null)

  // Listen for prefers-reduced-motion dynamic changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const listener = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
      if (e.matches) {
        setAutoReverse(false)
        setSpeed(0.4)
      }
    }
    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])

  // Auto-reverse effect with safe random intervals between 5 and 12 seconds
  useEffect(() => {
    if (!autoReverse || isPaused) return

    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const scheduleNextReverse = () => {
      const delay = Math.floor(Math.random() * 7000) + 5000 // 5,000 to 12,000 ms
      setLastAutoReverseIn(Math.round(delay / 1000))

      timeoutId = setTimeout(() => {
        setDirection((prev) => (prev === 1 ? -1 : 1))
        scheduleNextReverse()
      }, delay)
    }

    scheduleNextReverse()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [autoReverse, isPaused])

  // Session Timer for Gamification & Neural Telemetry
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [isPaused])

  // Gamification: One-time session rewards
  // 1. VISION EXPERIMENT COMPLETED (+25 XP)
  useEffect(() => {
    if (sessionSeconds >= 3) {
      awardVisionReward(
        'vision_experiment_completed',
        25,
        'VISION EXPERIMENT COMPLETED',
        'Calibrated neural visual cortex on ambiguous rotation kinetics.'
      )
    }
  }, [sessionSeconds, awardVisionReward])

  // 2. NEURAL OBSERVER (30 seconds) (+15 XP)
  useEffect(() => {
    if (sessionSeconds >= 30) {
      awardVisionReward(
        'neural_observer_30s',
        15,
        'NEURAL OBSERVER',
        'Observed bistable motion cues for 30 consecutive seconds.'
      )
    }
  }, [sessionSeconds, awardVisionReward])

  // 3. DEEP FOCUS (120 seconds / 2 minutes) (+35 XP)
  useEffect(() => {
    if (sessionSeconds >= 120) {
      awardVisionReward(
        'deep_focus_2m',
        35,
        'DEEP FOCUS',
        'Maintained unbroken visual concentration on structure-from-motion experiment for 2 minutes.'
      )
    }
  }, [sessionSeconds, awardVisionReward])

  // Manual Direction Reversal Handler
  const handleManualReverse = useCallback(() => {
    sound.playClick()
    setDirection((prev) => (prev === 1 ? -1 : 1))
    setManualReversalsCount((prev) => {
      const next = prev + 1
      if (next >= 1) {
        awardVisionReward(
          'perception_shift_manual',
          20,
          'PERCEPTION SHIFT',
          'Triggered a manual kinetic direction reversal in the neural vision chamber.'
        )
      }
      return next
    })
  }, [awardVisionReward])

  // Pause / Resume Handler
  const handleTogglePause = () => {
    sound.playClick()
    setIsPaused((prev) => !prev)
  }

  // Auto-reverse Toggle Handler
  const handleToggleAutoReverse = () => {
    sound.playClick()
    setAutoReverse((prev) => !prev)
  }

  // Reset Camera Handler
  const handleResetCamera = () => {
    sound.playClick()
    if (sphere3DRef.current) {
      sphere3DRef.current.resetCamera()
    }
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const achievementsList = [
    {
      id: 'vision_experiment_completed',
      title: 'VISION EXPERIMENT COMPLETED',
      requirement: 'Synchronize with the neural vision chamber',
      xp: 25,
      isEarned: claimedVisionRewards.includes('vision_experiment_completed') || sessionSeconds >= 3,
      progress: Math.min(100, (sessionSeconds / 3) * 100),
    },
    {
      id: 'perception_shift_manual',
      title: 'PERCEPTION SHIFT',
      requirement: 'Trigger manual perception reversal',
      xp: 20,
      isEarned: claimedVisionRewards.includes('perception_shift_manual') || manualReversalsCount >= 1,
      progress: manualReversalsCount >= 1 ? 100 : 0,
    },
    {
      id: 'neural_observer_30s',
      title: 'NEURAL OBSERVER',
      requirement: 'View illusion for 30 seconds',
      xp: 15,
      isEarned: claimedVisionRewards.includes('neural_observer_30s') || sessionSeconds >= 30,
      progress: Math.min(100, Math.round((sessionSeconds / 30) * 100)),
    },
    {
      id: 'deep_focus_2m',
      title: 'DEEP FOCUS',
      requirement: 'Use the experiment for 2 minutes',
      xp: 35,
      isEarned: claimedVisionRewards.includes('deep_focus_2m') || sessionSeconds >= 120,
      progress: Math.min(100, Math.round((sessionSeconds / 120) * 100)),
    },
  ]

  return (
    <section
      id="vision-lab"
      className={cn(
        'relative w-full rounded-2xl bg-[#030713]/90 border border-cyan-500/30 backdrop-blur-xl p-6 sm:p-8 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]',
        className
      )}
      aria-label="Neural Vision Lab Ambiguous Rotation Experiment"
    >
      {/* Cyberpunk Ambient Background Lighting */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full cyber-dots-bg opacity-20 pointer-events-none" />

      {/* Top Protocol Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-cyan-500/20 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Eye className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400">
              <span className="text-slate-600">//</span>
              <span className="font-bold tracking-widest uppercase">PERCEPTION EXPERIMENT // 07</span>
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <h2 className="font-orbitron text-2xl sm:text-3xl font-black text-slate-100 tracking-wide">
              NEURAL VISION LAB
            </h2>
            <div className="font-mono text-xs text-pink-400 tracking-wider font-semibold uppercase">
              AMBIGUOUS ROTATION EXPERIMENT
            </div>
          </div>
        </div>

        {/* Live Session Telemetry Capsule */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#060b18] border border-cyan-500/30 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>SESSION:</span>
            <span className="font-bold text-cyan-300 font-orbitron">{formatTime(sessionSeconds)}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-bold uppercase">
              {isPaused ? 'FROZEN' : 'ACTIVE'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Dual-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8 relative z-10">
        {/* =========================================================================
            LEFT COLUMN: Description, Interactive Controls, Telemetry & Rewards
        ========================================================================= */}
        <div className="lg:col-span-6 space-y-6">
          {/* Scientific Experiment Overview */}
          <div className="p-4 rounded-xl bg-[#060b18]/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>STRUCTURE-FROM-MOTION / KINETIC DEPTH EFFECT</span>
            </div>
            <p className="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed">
              A visual perception experiment where your brain interprets motion as three-dimensional depth.
              This experience is inspired by the <strong className="text-cyan-300">Rotating Sphere Illusion</strong>,
              also known as an <strong className="text-purple-300">Ambiguous Rotation Illusion</strong> or
              Kinetic Depth Effect. A moving field of dots can be perceived as a 3D sphere rotating in either
              direction, and the perceived direction may suddenly reverse. This is a visual perception effect,
              not an actual change in the physical object.
            </p>
          </div>

          {/* Core Interactive Perception Controls */}
          <GlassPanel variant="cyan" className="p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
              <h3 className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                // NEURAL CONTROLS
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                VECTOR: {direction === 1 ? 'POLAR CW' : 'POLAR CCW'}
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 1. REVERSE PERCEPTION */}
              <button
                onClick={handleManualReverse}
                className="px-3.5 py-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/80 hover:border-cyan-300 text-cyan-200 font-mono text-xs font-bold tracking-wider uppercase transition-all duration-200 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer flex items-center justify-center gap-2 group"
                title="Smoothly reverses rotation vector without reloading or destroying points"
              >
                <RotateCw className="w-4 h-4 text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
                <span>REVERSE PERCEPTION</span>
              </button>

              {/* 2. AUTO REVERSE TOGGLE */}
              <button
                onClick={handleToggleAutoReverse}
                className={cn(
                  'px-3.5 py-3 rounded-xl border font-mono text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-2',
                  autoReverse
                    ? 'bg-pink-500/20 border-pink-500 text-pink-200 shadow-[0_0_15px_rgba(255,0,127,0.4)]'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                )}
                title="Randomly reverses perceived rotation every 5 to 12 seconds"
              >
                <Shuffle className={cn('w-4 h-4', autoReverse ? 'text-pink-400 animate-spin' : 'text-slate-500')} />
                <span>
                  AUTO REVERSE {autoReverse ? `[${lastAutoReverseIn}s]` : '[OFF]'}
                </span>
              </button>

              {/* 3. PAUSE / RESUME */}
              <button
                onClick={handleTogglePause}
                className={cn(
                  'px-3.5 py-3 rounded-xl border font-mono text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-2',
                  isPaused
                    ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40'
                )}
                title="Freeze continuous animation"
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4 text-amber-400" />
                    <span>RESUME</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 text-slate-400" />
                    <span>PAUSE</span>
                  </>
                )}
              </button>
            </div>

            {/* Slider: Rotation Speed */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                  ANGULAR VELOCITY
                </span>
                <span className="font-orbitron font-bold text-cyan-300">
                  {speed.toFixed(1)}x {reducedMotion && '(REDUCED)'}
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                aria-label="Angular Velocity Speed Slider"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-600">
                <span>0.2x (Subtle)</span>
                <span>1.0x (Standard)</span>
                <span>3.0x (Hyper)</span>
              </div>
            </div>

            {/* Particle Density Selector */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  PARTICLE DENSITY
                </span>
                <span className="font-mono text-[11px] text-purple-300 uppercase font-bold">
                  {density === 'low' ? '3,000 PTS' : density === 'med' ? '5,500 PTS' : '8,000 PTS'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'med', 'high'] as DensityMode[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      sound.playClick()
                      setDensity(d)
                    }}
                    className={cn(
                      'py-1.5 rounded-lg font-mono text-xs font-bold uppercase transition-all cursor-pointer border',
                      density === d
                        ? 'bg-purple-500/20 border-purple-400 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Colour Mode Selector */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-pink-400" />
                  SPECTRAL PALETTE
                </span>
                <span className="text-[11px] font-mono text-pink-300 font-bold uppercase">
                  {colorMode.replace('_', ' ')}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'cyan', label: 'CYAN VOID', border: 'border-cyan-400', glow: 'shadow-[0_0_10px_#00f0ff]' },
                  { id: 'neotokyo', label: 'NEO-TOKYO', border: 'border-pink-500', glow: 'shadow-[0_0_10px_#ff007f]' },
                  { id: 'emerald', label: 'MATRIX', border: 'border-emerald-400', glow: 'shadow-[0_0_10px_#10b981]' },
                  { id: 'amber', label: 'AMBER TERM', border: 'border-amber-400', glow: 'shadow-[0_0_10px_#f59e0b]' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      sound.playClick()
                      setColorMode(c.id as ColorMode)
                    }}
                    className={cn(
                      'py-1.5 px-2 rounded-lg font-mono text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border text-center',
                      colorMode === c.id
                        ? `bg-white/10 ${c.border} text-white ${c.glow}`
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Camera Button */}
            <div className="pt-1 flex items-center justify-between">
              <button
                onClick={handleResetCamera}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span>RESET 3D CAMERA</span>
              </button>
              <span className="text-[10px] font-mono text-slate-500">
                Orbit controls active: drag / scroll
              </span>
            </div>
          </GlassPanel>

          {/* Interactive User Perception Logger */}
          <GlassPanel variant="purple" className="p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-purple-300 font-bold flex items-center gap-1.5 uppercase">
                <Eye className="w-4 h-4 text-purple-400" />
                WHICH WAY DOES IT APPEAR TO SPIN TO YOU?
              </span>
              <span className="text-[10px] text-slate-500 font-mono">LIVE VOTING FEED</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cw', label: 'CLOCKWISE ↻' },
                { id: 'ccw', label: 'COUNTER-CW ↺' },
                { id: 'bistable', label: 'FLIPPING / BOTH ⇄' },
              ].map((vote) => (
                <button
                  key={vote.id}
                  onClick={() => {
                    sound.playClick()
                    setUserPerception(vote.id as typeof userPerception)
                  }}
                  className={cn(
                    'py-2 px-2 rounded-lg font-mono text-xs font-bold uppercase transition-all cursor-pointer border text-center',
                    userPerception === vote.id
                      ? 'bg-purple-500/25 border-purple-400 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                      : 'bg-[#090618] border-slate-800 text-slate-400 hover:text-slate-200'
                  )}
                >
                  {vote.label}
                </button>
              ))}
            </div>
            <div className="text-[11px] font-mono text-slate-400 leading-snug">
              Tip: Fixate on the center and blink quickly, or focus on either the left or right edges. You can trigger
              a spontaneous direction flip in your own visual cortex!
            </div>
          </GlassPanel>

          {/* Gamification & XP Reward System */}
          <GlassPanel variant="default" className="p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <h4 className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider">
                  // NEXAURA GAMIFICATION DIRECTIVES
                </h4>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">SESSION ACHIEVEMENTS</span>
            </div>

            {/* Unauthenticated Guest Warning Banner */}
            {!isAuthenticated && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs font-mono text-amber-300">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Login to save XP and achievements to your operative character profile.</span>
                </div>
                <Link
                  to="/login"
                  className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold uppercase shrink-0 transition-colors flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>LOGIN</span>
                </Link>
              </div>
            )}

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {achievementsList.map((ach) => (
                <div
                  key={ach.id}
                  className={cn(
                    'p-3 rounded-xl border transition-all relative overflow-hidden',
                    ach.isEarned
                      ? 'bg-cyan-950/30 border-cyan-500/40 text-slate-100 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                      : 'bg-[#060a14] border-slate-800/80 text-slate-400'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="font-mono text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        {ach.isEarned ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />
                        )}
                        <span>{ach.title}</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">{ach.requirement}</div>
                    </div>
                    <div className="font-mono text-xs font-bold text-cyan-300 shrink-0 flex items-center gap-0.5">
                      <Zap className="w-3 h-3 text-cyan-400" />+{ach.xp} XP
                    </div>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="mt-2.5 h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all duration-300',
                        ach.isEarned
                          ? 'bg-cyan-400 shadow-[0_0_8px_#00f0ff]'
                          : 'bg-purple-600/60'
                      )}
                      style={{ width: `${ach.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: 3D Ambiguous Rotating Sphere Illusion & Holographic Frame
        ========================================================================= */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full relative">
            {/* Holographic Circular Frame Overlay */}
            <div className="relative w-full rounded-2xl bg-[#02050e]/95 border border-cyan-500/40 p-4 sm:p-6 overflow-hidden shadow-[0_0_40px_rgba(0,240,255,0.15)] cyber-clip-corner">
              {/* Corner Sci-Fi Tech Brackets */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

              {/* Background Grid Pattern */}
              <div className="absolute inset-0 cyber-dots-bg opacity-25 pointer-events-none" />

              {/* Top Viewport Telemetry Tags */}
              <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-400 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-cyan-300 font-bold">DEPTH MODEL: AMBIGUOUS</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-pink-400 font-bold">ROTATION: UNRESOLVED</span>
                </div>
              </div>

              {/* 3D R3F Rotating Particle Cloud Sphere Illusion */}
              <AmbiguousSphere3D
                ref={sphere3DRef}
                speed={speed}
                direction={direction}
                isPaused={isPaused}
                colorMode={colorMode}
                density={density}
                reducedMotion={reducedMotion}
                className="h-80 sm:h-96 md:h-[440px] w-full"
              />

              {/* Bottom Holographic HUD Telemetry Grid */}
              <div className="relative z-10 grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-[9px] sm:text-[10px] font-mono text-slate-400 text-center">
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <div className="text-slate-500">PERCEPTION STATUS</div>
                  <div className="font-bold text-emerald-400 uppercase">ACTIVE</div>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <div className="text-slate-500">NEURAL SYNC</div>
                  <div className="font-bold text-cyan-300">100% NOMINAL</div>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <div className="text-slate-500">KINETIC PHENOMENON</div>
                  <div className="font-bold text-purple-300">BISTABILITY</div>
                </div>
              </div>

              {/* Interactive Help Hint Overlay */}
              <div className="mt-3 text-center font-mono text-[10px] text-slate-500">
                Drag to orbit 3D view • Pinch / scroll to zoom • Click &quot;Reverse Perception&quot; to invert motion
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM FULL-WIDTH EDUCATIONAL PANEL: HOW YOUR BRAIN SEES IT
      ========================================================================= */}
      <div className="mt-8 pt-6 border-t border-cyan-500/20 relative z-10">
        <GlassPanel variant="cyan" className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-400 text-cyan-400">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-orbitron text-sm sm:text-base font-black text-slate-100 uppercase tracking-wide">
                  HOW YOUR BRAIN SEES IT
                </h3>
                <div className="font-mono text-[10px] text-cyan-400 uppercase">
                  COGNITIVE NEUROSCIENCE &bull; VISUAL PERCEPTION LAB
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>PERCEPTUAL BISTABILITY RESEARCH PROTOCOL</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-xs sm:text-sm font-mono text-slate-300 leading-relaxed">
            <div className="space-y-3">
              <p>
                &ldquo;Your eyes receive two-dimensional motion cues. Your brain interprets those cues as three-dimensional depth. Because the depth information is ambiguous, the sphere may appear to rotate in either direction.&rdquo;
              </p>
              <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/30 text-cyan-200 text-xs">
                <strong className="font-bold text-cyan-300 uppercase tracking-wider block mb-1">
                  OBSERVATION:
                </strong>
                The perceived rotation may reverse even when the visual stimulus remains similar. Your brain alternates between competing 3D hypotheses when parallax occlusion cues are absent.
              </div>
            </div>

            <div className="space-y-3 text-slate-400 text-xs">
              <p>
                In standard vision, retinal motion cues combine with stereopsis and occlusions to disambiguate front from back. In this point-cloud simulation, all points have equal luminance and optical weight, leaving the directional vector mathematically unresolved.
              </p>
              <div className="p-3 rounded-lg bg-[#040814] border border-slate-800 text-[11px] text-slate-400">
                <strong className="text-slate-300 uppercase block mb-0.5">SCIENTIFIC DISCLAIMER:</strong>
                This experiment demonstrates perceptual bistability and the Kinetic Depth Effect in human visual cortex processing. It is designed purely as an interactive perception experiment and optical illusion, and is not a medical diagnosis or cognitive assessment test.
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>
    </section>
  )
}

export default NeuralVisionLab
