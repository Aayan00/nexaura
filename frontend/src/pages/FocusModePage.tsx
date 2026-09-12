import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Coins,
  Target,
  ArrowLeft,
  Flame,
} from 'lucide-react'
import { FocusMode3D } from '../components/3d/FocusMode3D'
import { GlassPanel } from '../components/GlassPanel'
import { NeonButton } from '../components/NeonButton'
import { useRPG } from '../context/RPGContext'
import { sound } from '../lib/sound'
import { cn } from '../lib/utils'

export const FocusModePage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const taskIdParam = searchParams.get('taskId')
  const { missions, completeFocusSession } = useRPG()

  const [mode, setMode] = useState<'pomodoro' | 'deep' | 'break'>('pomodoro')
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | number | ''>(taskIdParam || '')

  const totalTime = mode === 'pomodoro' ? 25 * 60 : mode === 'deep' ? 50 * 60 : 5 * 60
  const progressPercent = Math.round(((totalTime - timeLeft) / totalTime) * 100)

  const selectedMission = missions.find((m) => String(m.id) === String(selectedTaskId))

  // Timer interval effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false)
      sound.playLevelUp()
      const duration = mode === 'pomodoro' ? 25 : mode === 'deep' ? 50 : 5
      completeFocusSession(duration, selectedTaskId ? selectedTaskId : undefined)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, mode, selectedTaskId, completeFocusSession])

  const handleModeChange = (newMode: 'pomodoro' | 'deep' | 'break') => {
    sound.playClick()
    setMode(newMode)
    setIsActive(false)
    if (newMode === 'pomodoro') setTimeLeft(25 * 60)
    else if (newMode === 'deep') setTimeLeft(50 * 60)
    else setTimeLeft(5 * 60)
  }

  const togglePlay = () => {
    sound.playClick()
    setIsActive(!isActive)
  }

  const handleReset = () => {
    sound.playClick()
    setIsActive(false)
    if (mode === 'pomodoro') setTimeLeft(25 * 60)
    else if (mode === 'deep') setTimeLeft(50 * 60)
    else setTimeLeft(5 * 60)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="text-slate-600">//</span>
              <span className="font-semibold uppercase tracking-widest">SEC_06_FOCUS_CORE</span>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <h1 className="font-mono text-2xl font-black text-slate-100 tracking-wide">
              DEEP WORK NEURAL REACTOR
            </h1>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#080d1a] border border-slate-800">
          {[
            { id: 'pomodoro', label: '25M FOCUS' },
            { id: 'deep', label: '50M DEEP OVERCLOCK' },
            { id: 'break', label: '5M BIO-REGEN' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => handleModeChange(m.id as typeof mode)}
              className={cn(
                'px-3 py-1.5 rounded font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer',
                mode === m.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Focus Core Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* 3D Visualizer & Circular HUD */}
        <div className="lg:col-span-7">
          <GlassPanel variant="cyan" glow={isActive} className="p-6 text-center relative overflow-hidden">
            {/* Background scanline */}
            <div className="absolute inset-0 cyber-dots-bg opacity-30 pointer-events-none" />

            {/* 3D Focus Core Model */}
            <FocusMode3D isActive={isActive} className="h-64 sm:h-72 w-full" />

            {/* Digital Countdown HUD */}
            <div className="relative z-10 -mt-8">
              <div className="font-mono text-5xl sm:text-6xl font-black tracking-widest text-cyan-300 text-glow-cyan">
                {formattedTime}
              </div>
              <div className="font-mono text-xs text-slate-400 tracking-widest mt-1">
                [REACTOR STATUS: {isActive ? 'ACTIVE HYPERFOCUS' : 'STBY // READY'}]
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 max-w-md mx-auto space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>Core Sync Progress</span>
                <span className="text-cyan-400 font-bold">{progressPercent}%</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <motion.div
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 shadow-[0_0_12px_rgba(0,240,255,0.8)]"
                />
              </div>
            </div>

            {/* Action Controls */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <NeonButton
                variant={isActive ? 'amber' : 'cyan'}
                size="lg"
                onClick={togglePlay}
                leftIcon={isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              >
                {isActive ? 'PAUSE PROTOCOL' : 'ENGAGE FOCUS'}
              </NeonButton>

              <button
                onClick={handleReset}
                className="p-3.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </GlassPanel>
        </div>

        {/* Right Info: Linked Mission, Rewards, and Stats */}
        <div className="lg:col-span-5 space-y-5">
          {/* Target Mission Linker */}
          <GlassPanel variant="purple" className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/20 mb-3">
              <h4 className="font-mono text-xs font-bold text-purple-300 flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                // LINK TARGET DIRECTIVE
              </h4>
              <span className="text-[10px] font-mono text-slate-500">OPTIONAL</span>
            </div>

            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full px-3 py-2 bg-[#090615] border border-purple-500/30 rounded text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-400"
            >
              <option value="">No Directive Linked (General Focus)</option>
              {missions
                .filter((m) => !m.completed)
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    [{m.attribute}] {m.title}
                  </option>
                ))}
            </select>

            {selectedMission && (
              <div className="mt-3 p-3 rounded bg-[#0b071a] border border-purple-500/20 text-xs">
                <div className="font-mono font-bold text-slate-200">
                  {selectedMission.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {selectedMission.description}
                </div>
              </div>
            )}
          </GlassPanel>

          {/* Session Yield Rewards */}
          <GlassPanel variant="default" className="p-5 space-y-3">
            <h4 className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider pb-2 border-b border-slate-800">
              // SESSION COMPLETION YIELD
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[#060a14] border border-cyan-500/30">
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-1">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>XP BOOST</span>
                </div>
                <div className="font-mono text-lg font-bold text-cyan-300">
                  +{mode === 'pomodoro' ? 100 : mode === 'deep' ? 200 : 20} XP
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#060a14] border border-amber-500/30">
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-1">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>CREDITS</span>
                </div>
                <div className="font-mono text-lg font-bold text-amber-300">
                  +{mode === 'pomodoro' ? 50 : mode === 'deep' ? 100 : 10} ₢
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#070b16] border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-2">
              <Flame className="w-4 h-4 text-pink-500 shrink-0" />
              <span>Streak Bonus multiplier applies on completion.</span>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  )
}
