import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Sparkles, Zap } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { MobileNavigation } from './MobileNavigation'
import { ToastNotification } from './ToastNotification'
import { CyberCityBackground } from './3d/CyberCityBackground'
import { useRPG } from '../context/RPGContext'
import { sound } from '../lib/sound'

export const AppShell: React.FC = () => {
  const { user, toast, dismissToast } = useRPG()

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
          <header className="sticky top-0 z-20 h-14 border-b border-cyan-500/25 bg-[#020611]/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between gap-4">
            {/* Left: Nexaura logo and tagline */}
            <div className="flex items-center gap-3">
              <Link to="/character" className="flex items-center gap-2.5 group">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400 text-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.4)] group-hover:border-pink-400 transition-colors">
                  <svg
                    className="w-4.5 h-4.5 text-cyan-300 group-hover:text-pink-300 transition-colors"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-sm font-black tracking-widest text-slate-100">
                      NEXAURA<span className="text-cyan-400">.exe</span>
                    </span>
                  </div>
                  <p className="hidden sm:block text-[9px] font-mono tracking-widest text-pink-400 uppercase font-semibold">
                    UPGRADE YOUR REALITY.
                  </p>
                </div>
              </Link>
            </div>

            {/* Right: Notifications, status, user avatar dossier */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Online status indicator */}
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]" />
                <span className="hidden sm:inline">[ONLINE]</span>
              </div>

              {/* Demo Account Badge (Only for demo user) */}
              {user.is_demo && (
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-500/20 border border-amber-400 text-amber-300 font-mono text-[10px] font-black tracking-widest uppercase shadow-[0_0_12px_rgba(245,158,11,0.35)] animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
                  <span>DEMO ACCOUNT</span>
                </div>
              )}

              {/* Notification icon */}
              <button
                onClick={() => sound.playClick()}
                className="relative p-1.5 rounded-lg border border-slate-800 bg-[#080B18]/80 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all cursor-pointer shadow-sm"
                title="System Notifications"
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_6px_#ff2ba6]" />
              </button>

              {/* Profile Avatar & Role */}
              <Link
                to="/character"
                onClick={() => sound.playClick()}
                className="flex items-center gap-2.5 pl-2.5 pr-2 py-1 rounded-lg bg-[#080B18]/90 border border-cyan-500/30 hover:border-cyan-400/80 transition-all group shadow-[0_0_12px_rgba(0,229,255,0.15)]"
              >
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {user.username || 'Aayan'}
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400/90 font-medium">
                    {user.title || 'Reality Architect'}
                  </div>
                </div>
                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-cyan-400/70 bg-gradient-to-br from-cyan-950 to-purple-950 flex items-center justify-center shadow-[0_0_10px_rgba(0,229,255,0.3)]">
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
