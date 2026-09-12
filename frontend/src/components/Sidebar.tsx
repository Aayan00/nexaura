import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Crosshair,
  Timer,
  BarChart3,
  User,
  ShoppingBag,
  Trophy,
  Sliders,
  Volume2,
  VolumeX,
  LogOut,
  Flame,
  Coins,
  Radio,
} from 'lucide-react'
import { useRPG } from '../context/RPGContext'
import { sound } from '../lib/sound'
import { cn } from '../lib/utils'

export const Sidebar: React.FC = () => {
  const { user, missions, achievements, toggleSound, logout } = useRPG()
  const navigate = useNavigate()

  const activeMissionsCount = missions.filter((m) => !m.completed).length
  const claimableAchievementsCount = achievements.filter((a) => a.unlocked && !a.claimed).length

  const navLinks = [
    {
      to: '/missions',
      label: 'MISSIONS & BOSSES',
      sublabel: 'Quest Matrix',
      icon: Crosshair,
      badge: activeMissionsCount > 0 ? activeMissionsCount : 4,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400',
    },
    {
      to: '/focus',
      label: 'FOCUS REACTOR',
      sublabel: '3D Deep Work Mode',
      icon: Timer,
      badge: '3D',
      badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-400',
    },
    {
      to: '/analytics',
      label: 'TELEMETRY & XP',
      sublabel: '52-Week Heatmap',
      icon: BarChart3,
    },
    {
      to: '/character',
      label: 'CHARACTER 3D RIG',
      sublabel: 'Neural Attributes',
      icon: User,
      badge: user.unassignedPoints > 0 ? `+${user.unassignedPoints}` : '+1',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400 animate-pulse',
    },
    {
      to: '/shop',
      label: 'BLACK MARKET',
      sublabel: 'Cyberware & Themes',
      icon: ShoppingBag,
    },
    {
      to: '/achievements',
      label: 'ACHIEVEMENTS',
      sublabel: 'Operative Accolades',
      icon: Trophy,
      badge: claimableAchievementsCount > 0 ? claimableAchievementsCount : 2,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400 animate-bounce',
    },
    {
      to: '/settings',
      label: 'SETTINGS & SFX',
      sublabel: 'Graphics & Engine',
      icon: Sliders,
    },
  ]

  const handleNavClick = () => {
    sound.playClick()
  }

  const handleLogout = () => {
    sound.playAlert()
    logout()
    navigate('/login')
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-cyan-500/20 bg-[#070b16]/95 backdrop-blur-xl select-none z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <svg
              className="w-6 h-6 animate-pulse"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
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
              <span className="font-mono text-lg font-black tracking-widest text-slate-100">
                NEXAURA<span className="text-cyan-400">.EXE</span>
              </span>
            </div>
            <p className="text-[10px] font-mono tracking-widest text-pink-400 uppercase font-semibold">
              Upgrade Your Reality.
            </p>
          </div>
        </div>

        {/* System Online Status */}
        <div className="mt-3 flex items-center justify-between px-2.5 py-1 rounded bg-[#0a1124] border border-cyan-500/30 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>[SYS: ONLINE]</span>
          </div>
          <span className="text-slate-500">v4.2.0_3D</span>
        </div>

        {/* Demo Account Badge */}
        {user.is_demo && (
          <div className="mt-2 flex items-center justify-center gap-1.5 px-2 py-1 rounded bg-amber-500/15 border border-amber-400/60 text-amber-300 text-[10px] font-mono font-black tracking-widest uppercase shadow-[0_0_10px_rgba(245,158,11,0.25)] animate-pulse">
            <span>⚡ DEMO ACCOUNT</span>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1 text-[10px] font-mono text-slate-500 tracking-wider">
          // PRIMARY HUD ROUTES
        </div>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={handleNavClick}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-mono font-semibold tracking-wide transition-all duration-200',
                isActive
                  ? 'border-cyan-400 bg-cyan-500/15 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                  : 'border-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900/60 hover:text-slate-200'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <link.icon
                    className={cn(
                      'w-4 h-4 transition-colors',
                      isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                    )}
                  />
                  <div>
                    <div className={isActive ? 'text-slate-100 font-bold' : ''}>
                      {link.label}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 font-normal">
                      {link.sublabel}
                    </div>
                  </div>
                </div>

                {link.badge !== undefined && (
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded text-[10px] font-mono border font-bold',
                      link.badgeColor
                    )}
                  >
                    {link.badge}
                  </span>
                )}

                {/* Active link indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-cyan-400 rounded-r shadow-[0_0_12px_#00E5FF]"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Telemetry & Footer */}
      <div className="p-4 border-t border-cyan-500/20 bg-[#050914] space-y-3">
        {/* Quick user stat block */}
        <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-amber-300">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>{user.credits.toLocaleString()} G</span>
          </div>
          <div className="flex items-center gap-1.5 text-pink-400">
            <Flame className="w-3.5 h-3.5 text-pink-500 fill-pink-500/30" />
            <span>{user.streakDays}D STREAK</span>
          </div>
        </div>

        {/* Audio switch & logout */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={toggleSound}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded border text-xs font-mono transition-colors cursor-pointer',
              user.soundEnabled
                ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                : 'border-slate-800 bg-slate-900 text-slate-500'
            )}
            title="Toggle Synthesizer Sound FX"
          >
            {user.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>SFX {user.soundEnabled ? 'ON' : 'MUTED'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-1.5 rounded border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
            title="Sever Neural Link (Logout)"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
