import React from 'react'
import { motion } from 'framer-motion'
import { Skull, Sparkles, Coins, Gift, Check, ShieldAlert } from 'lucide-react'
import type { Mission } from '../../types/rpg'
import { SubtaskList } from './SubtaskList'
import { cn } from '../../lib/utils'

interface BossMissionCardProps {
  mission: Mission
  onComplete: (id: string | number) => void
  onToggleSubtask: (taskId: string | number, subtaskId: number) => void
  onAddSubtask?: (taskId: string | number, title: string) => void
  className?: string
}

export const BossMissionCard: React.FC<BossMissionCardProps> = ({
  mission,
  onComplete,
  onToggleSubtask,
  onAddSubtask,
  className,
}) => {
  const subtasks = mission.subtasks || []
  const completedSubtasks = subtasks.filter((s) => s.completed).length
  const completionPercentage = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0
  const isBossDefeated = mission.completed || (subtasks.length > 0 && completedSubtasks === subtasks.length)

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className={cn(
        'relative rounded-xl border-2 p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.6)]',
        isBossDefeated
          ? 'border-emerald-500/40 bg-[#061510]/80'
          : 'border-pink-500/60 bg-gradient-to-br from-[#180918]/90 via-[#0d0a1a]/90 to-[#070b14]/90 shadow-[0_0_30px_rgba(255,0,127,0.25)]',
        className
      )}
    >
      {/* Top Warning Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-pink-500/20 border border-pink-400 text-pink-300 font-orbitron text-xs font-black tracking-wider shadow-[0_0_12px_rgba(255,0,127,0.5)]">
          <Skull className="w-4 h-4 text-pink-400 animate-pulse" />
          <span>BOSS PROTOCOL // LEVEL BOSS</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-pink-300">
          <ShieldAlert className="w-4 h-4 text-pink-400" />
          <span>STATUS: {isBossDefeated ? 'BOSS DEFEATED' : 'ACTIVE THREAT'}</span>
        </div>
      </div>

      {/* Main Title & Lore */}
      <div className="mb-4">
        <h3 className="font-orbitron text-xl font-black text-slate-100 tracking-wide">
          {mission.title}
        </h3>
        <p className="mt-1 text-xs font-sans text-slate-300 leading-relaxed">
          {mission.description}
        </p>
      </div>

      {/* Boss Health Bar */}
      <div className="space-y-1.5 mb-4 p-3 rounded-lg bg-[#0a0715] border border-pink-500/30">
        <div className="flex justify-between text-xs font-mono text-slate-300">
          <span className="text-pink-400 font-bold">BOSS HP / OBJECTIVE SYNCHRONIZATION</span>
          <span className="font-bold">{completionPercentage}% CLEARED</span>
        </div>

        <div className="h-3 w-full bg-slate-900 rounded overflow-hidden border border-pink-900/60">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-amber-400 shadow-[0_0_15px_rgba(255,0,127,0.8)]"
          />
        </div>
      </div>

      {/* Subtasks Objectives List */}
      <div className="mb-4">
        <SubtaskList
          subtasks={subtasks}
          onToggle={(stId) => onToggleSubtask(mission.id, stId)}
          onAdd={(title) => onAddSubtask && onAddSubtask(mission.id, title)}
        />
      </div>

      {/* Footer: Grand Rewards & Defeat Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-pink-500/15 border border-pink-500/40 text-pink-300 font-bold">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>+{mission.xpReward} XP</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>+{mission.creditReward} ₢</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-amber-400">
            <Gift className="w-4 h-4" />
            <span>+EPIC REWARD CHEST</span>
          </div>
        </div>

        <button
          onClick={() => onComplete(mission.id)}
          disabled={mission.completed}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-orbitron text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer',
            mission.completed
              ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
              : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(255,0,127,0.6)]'
          )}
        >
          <Check className="w-4 h-4" />
          <span>{mission.completed ? 'BOSS CLEARED' : 'FINALIZE BOSS MISSION'}</span>
        </button>
      </div>
    </motion.div>
  )
}
