import React from 'react'
import { Check, Plus, Trash2 } from 'lucide-react'
import type { Subtask } from '../../types/rpg'
import { soundFx } from '../../lib/sound'
import { cn } from '../../lib/utils'

interface SubtaskListProps {
  subtasks: Subtask[]
  onToggle: (subtaskId: number) => void
  onAdd?: (title: string) => void
  onDelete?: (subtaskId: number) => void
  readOnly?: boolean
  className?: string
}

export const SubtaskList: React.FC<SubtaskListProps> = ({
  subtasks,
  onToggle,
  onAdd,
  onDelete,
  readOnly = false,
  className,
}) => {
  const [newTitle, setNewTitle] = React.useState('')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !onAdd) return
    onAdd(newTitle.trim())
    setNewTitle('')
    soundFx.playClick()
  }

  const completedCount = subtasks.filter((s) => s.completed).length

  return (
    <div className={cn('space-y-2 p-3 rounded-lg bg-[#060a14] border border-slate-800/80', className)}>
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-1 border-b border-slate-800">
        <span className="font-semibold uppercase text-cyan-400">// SUB-OBJECTIVES</span>
        <span>
          {completedCount}/{subtasks.length} SYNCED ({subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : 0}%)
        </span>
      </div>

      <div className="space-y-1.5 pt-1">
        {subtasks.map((st) => (
          <div
            key={st.id}
            onClick={() => !readOnly && onToggle(st.id)}
            className={cn(
              'flex items-center justify-between p-2 rounded text-xs font-mono transition-all cursor-pointer select-none',
              st.completed
                ? 'bg-emerald-950/20 text-emerald-300 line-through border border-emerald-500/20'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800'
            )}
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-4 h-4 rounded flex items-center justify-center border transition-colors',
                  st.completed
                    ? 'bg-emerald-500 border-emerald-400 text-black'
                    : 'border-slate-600 bg-slate-950'
                )}
              >
                {st.completed && <Check className="w-3 h-3" />}
              </div>
              <span>{st.title}</span>
            </div>

            {!readOnly && onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(st.id)
                }}
                className="text-slate-600 hover:text-red-400 p-0.5 rounded transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {!readOnly && onAdd && (
        <form onSubmit={handleAdd} className="flex gap-1.5 pt-1">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add sub-objective..."
            className="flex-1 px-2.5 py-1 bg-[#080d1a] border border-slate-800 rounded text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-400 hover:text-black border border-cyan-400 text-cyan-300 rounded text-xs font-mono font-bold transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </form>
      )}
    </div>
  )
}
