import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Filter,
  Brain,
  Dumbbell,
  Zap,
  Heart,
  Shield,
  Skull,
} from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { MissionCard3D } from '../components/missions/MissionCard3D'
import { BossMissionCard } from '../components/missions/BossMissionCard'
import { MissionModal } from '../components/missions/MissionModal'
import { NeonButton } from '../components/NeonButton'
import { EmptyState } from '../components/EmptyState'
import { GlassPanel } from '../components/GlassPanel'
import { useRPG } from '../context/RPGContext'
import { sound } from '../lib/sound'
import type { AttributeType, MissionCategory } from '../types/rpg'
import { cn } from '../lib/utils'

export const MissionsPage: React.FC = () => {
  const {
    missions,
    completeMission,
    toggleSubtask,
    addCustomMission,
    deleteMission,
  } = useRPG()

  const [categoryFilter, setCategoryFilter] = useState<'all' | MissionCategory | 'boss'>('all')
  const [attributeFilter, setAttributeFilter] = useState<'all' | AttributeType>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('active')
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredMissions = missions.filter((m) => {
    if (categoryFilter === 'boss' && !m.isBoss) return false
    if (categoryFilter !== 'all' && categoryFilter !== 'boss' && m.category !== categoryFilter) return false
    if (attributeFilter !== 'all' && m.attribute !== attributeFilter) return false
    if (statusFilter === 'active' && m.completed) return false
    if (statusFilter === 'completed' && !m.completed) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchTitle = m.title.toLowerCase().includes(q)
      const matchDesc = m.description.toLowerCase().includes(q)
      const matchAttr = m.attribute.toLowerCase().includes(q)
      if (!matchTitle && !matchDesc && !matchAttr) return false
    }
    return true
  })

  const bossCount = missions.filter((m) => m.isBoss && !m.completed).length
  const activeCount = missions.filter((m) => !m.completed).length
  const completedCount = missions.filter((m) => m.completed).length

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        sectionCode="SEC_02_TACTICAL_MATRIX"
        title="TACTICAL QUEST &amp; BOSS MATRIX"
        subtitle="Convert daily habits, deep learning, and epic challenges into high-stakes cyberpunk directives with nested subtasks."
        actions={
          <NeonButton
            variant="cyan"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              sound.playClick()
              setIsModalOpen(true)
            }}
          >
            INITIALIZE DIRECTIVE
          </NeonButton>
        }
      />

      {/* Filter and Search Controls Bar */}
      <GlassPanel variant="default" className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH PROTOCOLS..."
              className="w-full pl-9 pr-4 py-2 bg-black/60 border border-cyan-500/30 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 uppercase"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-black/80 border border-slate-800 rounded-lg w-full md:w-auto overflow-x-auto">
            {[
              { id: 'active', label: `ACTIVE (${activeCount})` },
              { id: 'completed', label: `RESOLVED (${completedCount})` },
              { id: 'all', label: `ALL (${missions.length})` },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => {
                  sound.playClick()
                  setStatusFilter(id as any)
                }}
                className={cn(
                  'flex-1 md:flex-initial px-3 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer',
                  statusFilter === id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories, Boss & Attributes Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="font-mono text-slate-500 text-[11px] mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" /> TYPE:
            </span>
            {[
              { id: 'all', label: 'ALL' },
              { id: 'boss', label: `BOSS BATTLES (${bossCount})`, icon: Skull },
              { id: 'daily', label: 'DAILY' },
              { id: 'main', label: 'MAIN QUESTS' },
              { id: 'bounty', label: 'BOUNTIES' },
              { id: 'Coding', label: 'CODING' },
              { id: 'Study', label: 'STUDY' },
              { id: 'Fitness', label: 'FITNESS' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playClick()
                  setCategoryFilter(cat.id as any)
                }}
                className={cn(
                  'px-2.5 py-1 rounded font-mono text-[11px] border transition-colors cursor-pointer flex items-center gap-1',
                  categoryFilter === cat.id
                    ? 'border-cyan-400 bg-cyan-500/15 text-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                    : 'border-slate-800 text-slate-400 hover:text-slate-200'
                )}
              >
                {cat.icon && <cat.icon className="w-3 h-3 text-pink-400" />}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Attribute Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="font-mono text-slate-500 text-[11px] mr-1">ATTR:</span>
            <button
              onClick={() => {
                sound.playClick()
                setAttributeFilter('all')
              }}
              className={cn(
                'px-2 py-0.5 rounded font-mono text-[11px] border cursor-pointer',
                attributeFilter === 'all'
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                  : 'border-slate-800 text-slate-400 hover:text-slate-200'
              )}
            >
              ALL
            </button>
            {[
              { code: 'INT', icon: Brain, color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10' },
              { code: 'STR', icon: Dumbbell, color: 'text-red-400 border-red-500/40 bg-red-500/10' },
              { code: 'DEX', icon: Zap, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
              { code: 'VIT', icon: Heart, color: 'text-pink-400 border-pink-500/40 bg-pink-500/10' },
              { code: 'DIS', icon: Shield, color: 'text-purple-400 border-purple-500/40 bg-purple-500/10' },
            ].map((attr) => (
              <button
                key={attr.code}
                onClick={() => {
                  sound.playClick()
                  setAttributeFilter(attr.code as AttributeType)
                }}
                className={cn(
                  'flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[11px] border transition-all cursor-pointer',
                  attributeFilter === attr.code
                    ? `${attr.color} ring-1 ring-white/30 font-bold`
                    : 'border-slate-800 text-slate-400 hover:text-slate-200'
                )}
              >
                <attr.icon className="w-3 h-3" />
                <span>{attr.code}</span>
              </button>
            ))}
          </div>
        </div>
      </GlassPanel>

      {/* Mission Cards Grid */}
      {filteredMissions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence>
            {filteredMissions.map((mission) =>
              mission.isBoss ? (
                <div key={mission.id} className="md:col-span-2">
                  <BossMissionCard
                    mission={mission}
                    onComplete={completeMission}
                    onToggleSubtask={toggleSubtask}
                  />
                </div>
              ) : (
                <MissionCard3D
                  key={mission.id}
                  mission={mission}
                  onComplete={completeMission}
                  onToggleSubtask={toggleSubtask}
                  onDelete={deleteMission}
                />
              )
            )}
          </AnimatePresence>
        </div>
      ) : (
        <EmptyState
          title="ZERO DIRECTIVES MATCH QUERY"
          description="Adjust your filters or initialize a custom mission directive below."
          actionLabel="INITIALIZE DIRECTIVE"
          onAction={() => setIsModalOpen(true)}
        />
      )}

      {/* Create Mission Modal */}
      <MissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => addCustomMission(data as any)}
      />
    </div>
  )
}
