import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Check,
  Clock,
  Coins,
  Sparkles,
  Trash2,
  Brain,
  Dumbbell,
  Zap,
  Heart,
  Shield,
  Play,
  Pause,
  Timer,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import type { Mission, AttributeType, MissionRank, MissionPriority } from '../../types/rpg'
import { SubtaskList } from './SubtaskList'
import { sound } from '../../lib/sound'
import { cn } from '../../lib/utils'

export interface MissionCard3DProps {
  mission: Mission
  onComplete: (id: string | number) => void
  onDelete?: (id: string | number) => void
  onStatusChange?: (id: string | number, status: 'pending' | 'in_progress' | 'paused' | 'failed') => void
  onToggleSubtask?: (taskId: string | number, subtaskId: number) => void
  onAddSubtask?: (taskId: string | number, title: string) => void
  className?: string
}

export const MissionCard3D: React.FC<MissionCard3DProps> = ({
  mission,
  onComplete,
  onDelete,
  onStatusChange,
  onToggleSubtask,
  onAddSubtask,
  className,
}) => {
  const navigate = useNavigate()
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [showSubtasks, setShowSubtasks] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setRotateX(-y / 18)
    setRotateY(x / 18)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  const getRankBadge = (rank: MissionRank) => {
    switch (rank) {
      case 'S':
        return 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(250,204,21,0.5)]'
      case 'A':
        return 'bg-pink-500/20 border-pink-400 text-pink-300 shadow-[0_0_12px_rgba(255,0,127,0.5)]'
      case 'B':
        return 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.5)]'
      case 'C':
        return 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.5)]'
      case 'D':
      default:
        return 'bg-slate-700/40 border-slate-600 text-slate-300'
    }
  }

  const getPriorityBadge = (priority?: MissionPriority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/20 border-red-400 text-red-400 animate-pulse'
      case 'high':
        return 'bg-amber-500/20 border-amber-400 text-amber-300'
      case 'medium':
        return 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
      case 'low':
      default:
        return 'bg-slate-800 border-slate-700 text-slate-400'
    }
  }

  const getAttrIcon = (attr: AttributeType) => {
    switch (attr) {
      case 'INT':
        return <Brain className="w-3.5 h-3.5 text-cyan-400" />
      case 'STR':
        return <Dumbbell className="w-3.5 h-3.5 text-red-400" />
      case 'DEX':
        return <Zap className="w-3.5 h-3.5 text-emerald-400" />
      case 'VIT':
        return <Heart className="w-3.5 h-3.5 text-pink-400" />
      case 'DIS':
        return <Shield className="w-3.5 h-3.5 text-purple-400" />
    }
  }

  const subtasks = mission.subtasks || []
  const completedSubtasks = subtasks.filter((s) => s.completed).length

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: 'spring', damping: 20, stiffness: 250 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={cn(
        'group relative rounded-xl border p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 select-none shadow-[0_8px_30px_rgba(0,0,0,0.5)]',
        mission.completed
          ? 'border-emerald-500/30 bg-[#06140e]/70 opacity-75'
          : mission.status === 'in_progress'
          ? 'border-cyan-400/80 bg-[#0a1226]/90 shadow-[0_0_25px_rgba(0,240,255,0.25)]'
          : 'border-slate-800 bg-[#080d1e]/85 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]',
        className
      )}
    >
      {/* 3D Corner HUD Highlights */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400 rounded-tl-sm pointer-events-none" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400 rounded-tr-sm pointer-events-none" />

      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {/* Rank Badge */}
          <span
            className={cn(
              'flex items-center justify-center w-6 h-6 rounded border font-mono text-xs font-black',
              getRankBadge(mission.rank)
            )}
          >
            {mission.rank}
          </span>

          {/* Priority Badge */}
          {mission.priority && (
            <span
              className={cn(
                'text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border font-bold',
                getPriorityBadge(mission.priority)
              )}
            >
              {mission.priority}
            </span>
          )}

          {/* Category Tag */}
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-slate-700 bg-slate-900 text-slate-300">
            {mission.category}
          </span>

          {/* Attribute Reward */}
          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border border-cyan-500/40 text-cyan-300 bg-cyan-500/10">
            {getAttrIcon(mission.attribute)}
            <span>+{mission.statPoints} {mission.attribute}</span>
          </span>
        </div>

        {/* Due Date & Status */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{mission.completed ? `DONE: ${mission.completedAt || 'TODAY'}` : mission.dueDate || 'ACTIVE'}</span>
        </div>
      </div>

      {/* Title & Description */}
      <div className="mb-3">
        <h4
          className={cn(
            'font-mono text-lg font-bold tracking-wide transition-colors',
            mission.completed
              ? 'text-emerald-400/80 line-through'
              : 'text-slate-100 group-hover:text-cyan-300'
          )}
        >
          {mission.title}
        </h4>
        <p className="mt-1 text-xs text-slate-400 leading-relaxed">
          {mission.description}
        </p>
      </div>

      {/* Subtasks Progress / Toggle if present */}
      {subtasks.length > 0 && (
        <div className="mb-3">
          <button
            onClick={() => setShowSubtasks(!showSubtasks)}
            className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer"
          >
            <span>
              {completedSubtasks}/{subtasks.length} Sub-Objectives
            </span>
            {showSubtasks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showSubtasks && (
            <div className="mt-2">
              <SubtaskList
                subtasks={subtasks}
                onToggle={(stId) => onToggleSubtask && onToggleSubtask(mission.id, stId)}
                onAdd={(title) => onAddSubtask && onAddSubtask(mission.id, title)}
              />
            </div>
          )}
        </div>
      )}

      {/* Rewards & Interactive Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
        {/* Rewards Pills */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>+{mission.xpReward} XP</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>+{mission.creditReward} ₢</span>
          </div>
        </div>

        {/* Lifecycle Buttons */}
        <div className="flex items-center gap-2">
          {!mission.completed && (
            <>
              {/* Focus Timer Launch */}
              <button
                onClick={() => {
                  sound.playClick()
                  navigate(`/focus?taskId=${mission.id}`)
                }}
                className="p-1.5 rounded bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/40 text-purple-300 transition-colors cursor-pointer"
                title="Launch Deep Work Focus Session"
              >
                <Timer className="w-4 h-4" />
              </button>

              {/* Start / Pause Toggle */}
              {onStatusChange && (
                <button
                  onClick={() => {
                    sound.playClick()
                    onStatusChange(mission.id, mission.status === 'in_progress' ? 'paused' : 'in_progress')
                  }}
                  className={cn(
                    'p-1.5 rounded border transition-colors cursor-pointer',
                    mission.status === 'in_progress'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-cyan-300'
                  )}
                  title={mission.status === 'in_progress' ? 'Pause Mission' : 'Start Mission'}
                >
                  {mission.status === 'in_progress' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              )}
            </>
          )}

          {onDelete && !mission.completed && (
            <button
              onClick={() => onDelete(mission.id)}
              className="p-1.5 text-slate-500 hover:text-red-400 rounded hover:bg-red-500/10 transition-colors cursor-pointer"
              title="Purge Directive"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* Complete Button */}
          <button
            onClick={() => onComplete(mission.id)}
            disabled={mission.completed}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer',
              mission.completed
                ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 cursor-default'
                : 'bg-cyan-500/15 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_15px_rgba(0,240,255,0.6)]'
            )}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{mission.completed ? 'COMPLETED' : 'COMPLETE PROTOCOL'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
