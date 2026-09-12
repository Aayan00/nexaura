import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Target, Plus, Trash2, Skull, Sparkles } from 'lucide-react'
import { GlassPanel } from '../GlassPanel'
import { NeonButton } from '../NeonButton'
import type { AttributeType, MissionCategory, MissionRank, MissionPriority, Mission } from '../../types/rpg'

export interface MissionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (missionData: Partial<Mission>) => void
  onCreate?: (missionData: Partial<Mission>) => void
  initialData?: Mission | null
}

export const MissionModal: React.FC<MissionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onCreate,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [category, setCategory] = useState<MissionCategory>(initialData?.category || 'Coding')
  const [attribute, setAttribute] = useState<AttributeType>(initialData?.attribute || 'INT')
  const [rank, setRank] = useState<MissionRank>(initialData?.rank || 'B')
  const [priority, setPriority] = useState<MissionPriority>(initialData?.priority || 'medium')
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '23:59 TODAY')
  const [estimatedDuration, setEstimatedDuration] = useState(initialData?.estimatedDuration || 30)
  const [isBoss, setIsBoss] = useState(Boolean(initialData?.isBoss))
  const [subtasks, setSubtasks] = useState<string[]>([])
  const [newSubtaskInput, setNewSubtaskInput] = useState('')

  if (!isOpen) return null

  const handleAddSubtask = () => {
    if (!newSubtaskInput.trim()) return
    setSubtasks([...subtasks, newSubtaskInput.trim()])
    setNewSubtaskInput('')
  }

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const rankRewards = {
      S: { xp: 850, credits: 450, stat: 6, label: 'S-Rank Priority Directive' },
      A: { xp: 500, credits: 280, stat: 4, label: 'A-Rank High Complexity' },
      B: { xp: 320, credits: 160, stat: 2, label: 'B-Rank Moderate Test' },
      C: { xp: 200, credits: 100, stat: 1, label: 'C-Rank Standard Habit' },
      D: { xp: 120, credits: 60, stat: 1, label: 'D-Rank Minor Task' },
    }

    const reward = rankRewards[rank]
    const handler = onSubmit || onCreate

    if (handler) {
      handler({
        title: title.trim(),
        description: description.trim() || 'Tactical directive.',
        category,
        attribute,
        rank,
        priority,
        dueDate,
        estimatedDuration: Number(estimatedDuration) || 30,
        xpReward: isBoss ? reward.xp * 2 : reward.xp,
        creditReward: isBoss ? reward.credits * 2 : reward.credits,
        statPoints: isBoss ? reward.stat * 2 : reward.stat,
        isBoss,
        difficultyLabel: isBoss ? 'Epic Boss Battle' : reward.label,
        subtasks: subtasks.map((stTitle, idx) => ({ id: idx + 1, title: stTitle, completed: 0 })),
      })
    }

    onClose()
  }

  const applyTemplate = (tpl: { title: string; category: MissionCategory; attr: AttributeType; rank: MissionRank; duration: number }) => {
    setTitle(tpl.title)
    setCategory(tpl.category)
    setAttribute(tpl.attr)
    setRank(tpl.rank)
    setEstimatedDuration(tpl.duration)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl my-8"
      >
        <GlassPanel variant={isBoss ? 'magenta' : 'cyan'} glow className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              <h3 className="font-orbitron text-sm font-bold tracking-wider text-slate-100">
                {initialData ? '// MODIFY MISSION DIRECTIVE' : '// INITIALIZE NEW DIRECTIVE'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Preset Templates */}
          {!initialData && (
            <div className="mb-4">
              <span className="text-[10px] font-mono text-slate-400 block mb-1.5 uppercase">
                // QUICK DIRECTIVE TEMPLATES:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { title: '90m Hyperfocus Coding Sprint', category: 'Coding' as const, attr: 'INT' as const, rank: 'A' as const, duration: 90 },
                  { title: '500-Rep Hypertrophy Workout', category: 'Fitness' as const, attr: 'STR' as const, rank: 'B' as const, duration: 45 },
                  { title: '3.5L Pure Hydration Matrix', category: 'Health' as const, attr: 'VIT' as const, rank: 'C' as const, duration: 15 },
                  { title: 'Digital Distraction Blackout (3h)', category: 'Habits' as const, attr: 'DIS' as const, rank: 'A' as const, duration: 180 },
                ].map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => applyTemplate(tpl)}
                    className="px-2.5 py-1 rounded bg-[#080e1c] border border-cyan-500/30 text-cyan-300 text-[11px] font-mono hover:bg-cyan-500/20 transition-all cursor-pointer"
                  >
                    + {tpl.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                Directive Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master React Three Fiber Shaders"
                className="w-full px-3.5 py-2.5 bg-[#080d1a] border border-cyan-500/30 rounded text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                Objective Parameters / Rules
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe success criteria and constraints..."
                className="w-full px-3.5 py-2 bg-[#080d1a] border border-cyan-500/30 rounded text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            {/* Grid selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MissionCategory)}
                  className="w-full px-2.5 py-2 bg-[#080d1a] border border-cyan-500/30 rounded text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value="Coding">Coding</option>
                  <option value="Study">Study</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Health">Health</option>
                  <option value="Project">Project</option>
                  <option value="Habits">Habits</option>
                  <option value="Creative">Creative</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                  Attribute
                </label>
                <select
                  value={attribute}
                  onChange={(e) => setAttribute(e.target.value as AttributeType)}
                  className="w-full px-2.5 py-2 bg-[#080d1a] border border-cyan-500/30 rounded text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
                >
                  <option value="INT">INT (Intellect)</option>
                  <option value="STR">STR (Strength)</option>
                  <option value="DEX">DEX (Dexterity)</option>
                  <option value="VIT">VIT (Vitality)</option>
                  <option value="DIS">DIS (Discipline)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                  Rank Tier
                </label>
                <select
                  value={rank}
                  onChange={(e) => setRank(e.target.value as MissionRank)}
                  className="w-full px-2.5 py-2 bg-[#080d1a] border border-cyan-500/30 rounded text-xs font-mono text-amber-300 focus:outline-none focus:border-cyan-400"
                >
                  <option value="S">S-Rank (High Boss)</option>
                  <option value="A">A-Rank (Hard)</option>
                  <option value="B">B-Rank (Medium)</option>
                  <option value="C">C-Rank (Easy)</option>
                  <option value="D">D-Rank (Minor)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as MissionPriority)}
                  className="w-full px-2.5 py-2 bg-[#080d1a] border border-cyan-500/30 rounded text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            {/* Boss Battle Toggle & Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                  Due Schedule / Target
                </label>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="e.g. 23:59 TODAY or WEEKLY BOSS"
                  className="w-full px-3 py-2 bg-[#080d1a] border border-slate-800 rounded text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsBoss(!isBoss)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-orbitron font-bold transition-all cursor-pointer ${
                    isBoss
                      ? 'bg-pink-500/20 border-pink-400 text-pink-300 shadow-[0_0_15px_rgba(255,0,127,0.5)]'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  <Skull className="w-4 h-4" />
                  <span>{isBoss ? 'BOSS BATTLE ACTIVE (+2X REWARDS)' : 'SET AS BOSS BATTLE'}</span>
                </button>
              </div>
            </div>

            {/* Subtask additions */}
            <div className="pt-2">
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">
                Nested Objectives / Subtasks
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSubtaskInput}
                  onChange={(e) => setNewSubtaskInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                  placeholder="Add objective step..."
                  className="flex-1 px-3 py-1.5 bg-[#080d1a] border border-slate-800 rounded text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="px-3 py-1.5 rounded bg-cyan-500/20 hover:bg-cyan-400 hover:text-black border border-cyan-400 text-cyan-300 text-xs font-mono font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {subtasks.length > 0 && (
                <div className="space-y-1.5 max-h-32 overflow-y-auto p-2 bg-[#060a14] rounded border border-slate-800">
                  {subtasks.map((st, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-mono text-slate-300 p-1 rounded bg-slate-900/60">
                      <span>• {st}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(i)}
                        className="text-slate-600 hover:text-red-400 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-800">
              <NeonButton type="button" variant="ghost" size="sm" onClick={onClose}>
                CANCEL
              </NeonButton>
              <NeonButton
                type="submit"
                variant={isBoss ? 'magenta' : 'cyan'}
                size="md"
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                {initialData ? 'SAVE MODIFICATIONS' : 'INITIALIZE DIRECTIVE'}
              </NeonButton>
            </div>
          </form>
        </GlassPanel>
      </motion.div>
    </div>
  )
}
