import React, { useState, useEffect } from 'react'
import { Outlet, Link } from 'react-router-dom'
import {
  Flame,
  Coins,
  Volume2,
  VolumeX,
  Radio,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Sidebar } from './Sidebar'
import { MobileNavigation } from './MobileNavigation'
import { ToastNotification } from './ToastNotification'
import { CyberCityBackground } from './3d/CyberCityBackground'
import { useRPG } from '../context/RPGContext'
import { sound } from '../lib/sound'

export const AppShell: React.FC = () => {
  const { user, toast, dismissToast, toggleSound } = useRPG()
  const [timeStr, setTimeStr] = useState<string>('')

  // Live cyberpunk digital clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      {/* Dynamic 3D Environment Background / Skybox */}
      <CyberCityBackground environment={user.environment || 'city'} />

      {/* Dynamic Background Grids & Ambient Lights */}
      <div className="fixed inset-0 cyber-grid-bg pointer-events-none opacity-30 z-0" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-10 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Global Toast Alerts */}
      <ToastNotification toast={toast} onDismiss={dismissToast} />

      <div className="relative flex flex-1 w-full min-h-screen z-10">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
          {/* Top HUD Status Bar */}
          <header className="sticky top-0 z-20 h-14 border-b border-cyan-500/20 bg-[#070b16]/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between gap-4">
            {/* Left: Mobile branding or desktop status */}
            <div className="flex items-center gap-3">
              <div className="lg:hidden flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 rounded bg-cyan-500/10 border border-cyan-400 text-cyan-400 shadow-[0_0_8px_#00f0ff]">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="font-mono text-sm font-black tracking-wider text-slate-100">
                  NEXAURA<span className="text-cyan-400">.EXE</span>
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                  <Radio className="w-3 h-3 animate-pulse" />
                  ONLINE
                </span>
                <span className="text-slate-600">|</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  {timeStr || '00:00:00'} UTC
                </span>
              </div>
            </div>

            {/* Right: User Quick HUD stats */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              {/* Streak */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-pink-500/10 border border-pink-500/30 text-pink-300 font-mono text-xs font-bold"
                title="Current Unbroken Habit Streak"
              >
                <Flame className="w-3.5 h-3.5 text-pink-500 fill-pink-500/40" />
                <span>{user.streakDays}D</span>
              </div>

              {/* Credits */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold"
                title="Active Black Market Credits"
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>{user.credits.toLocaleString()} ₢</span>
              </div>

              {/* Audio Toggle (Mobile / Topbar) */}
              <button
                onClick={toggleSound}
                className="lg:hidden p-1.5 rounded border border-slate-700 bg-slate-900 text-slate-300 hover:text-cyan-400 transition-colors"
                title="Toggle SFX"
              >
                {user.soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              </button>

              {/* Profile Avatar Pill */}
              <Link
                to="/character"
                onClick={() => sound.playClick()}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400 transition-all group"
              >
                <div className="hidden md:block text-right">
                  <div className="text-xs font-mono font-bold text-slate-200 group-hover:text-cyan-300">
                    {user.username}
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400/80">
                    LVL {user.level} {user.title}
                  </div>
                </div>
                <div className="relative w-7 h-7 rounded-full overflow-hidden border border-cyan-400 bg-cyan-950 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                </div>
              </Link>
            </div>
          </header>

          {/* Main Viewport Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Navigation Dock */}
      <MobileNavigation />
    </div>
  )
}
