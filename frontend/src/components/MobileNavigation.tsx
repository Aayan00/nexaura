import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Crosshair, Timer, User, ShoppingBag, Trophy, Sliders } from 'lucide-react'
import { useRPG } from '../context/RPGContext'
import { sound } from '../lib/sound'
import { cn } from '../lib/utils'

export const MobileNavigation: React.FC = () => {
  const { missions, achievements, user } = useRPG()

  const activeMissionsCount = missions.filter((m) => !m.completed).length
  const claimableCount = achievements.filter((a) => a.unlocked && !a.claimed).length

  const navItems = [
    { to: '/dashboard', label: 'HUD', icon: LayoutDashboard },
    { to: '/missions', label: 'Quests', icon: Crosshair, badge: activeMissionsCount || undefined },
    { to: '/focus', label: 'Focus', icon: Timer },
    { to: '/character', label: 'Rig 3D', icon: User, badge: user.unassignedPoints ? `+${user.unassignedPoints}` : undefined },
    { to: '/shop', label: 'Market', icon: ShoppingBag },
    { to: '/achievements', label: 'Badges', icon: Trophy, badge: claimableCount || undefined },
    { to: '/settings', label: 'Config', icon: Sliders },
  ]

  const handleTap = () => {
    sound.playClick()
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070b16]/95 border-t border-cyan-500/25 backdrop-blur-xl px-2 py-1.5">
      <div className="flex items-center justify-around overflow-x-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={handleTap}
            className={({ isActive }) =>
              cn(
                'relative flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-colors',
                isActive
                  ? 'text-cyan-400'
                  : 'text-slate-400 hover:text-slate-200'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <item.icon className="w-4 h-4 mb-0.5" />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2.5 px-1 py-0.2 rounded-full text-[9px] font-mono bg-pink-500 text-white font-bold border border-pink-400">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
                {isActive && (
                  <div className="absolute -bottom-0.5 w-5 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_6px_#00f0ff]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
