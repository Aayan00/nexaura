import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Trophy,
  CheckCircle2,
  Sparkles,
  Coins,
  Flame,
  Brain,
  Dumbbell,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { GlassPanel } from '../components/GlassPanel'
import { ProgressBar } from '../components/ProgressBar'
import { NeonButton } from '../components/NeonButton'
import { useRPG } from '../context/RPGContext'
import type { AchievementCategory } from '../types/rpg'
import { cn } from '../lib/utils'

export const AchievementsPage: React.FC = () => {
  const { achievements, claimAchievement } = useRPG()
  const [categoryFilter, setCategoryFilter] = useState<'all' | AchievementCategory>('all')

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalCount = achievements.length
  const totalClaimed = achievements.filter((a) => a.claimed).length

  const filteredAchievements = achievements.filter((a) => {
    if (categoryFilter === 'all') return true
    return a.category === categoryFilter
  })

  const getCategoryIcon = (cat: AchievementCategory) => {
    switch (cat) {
      case 'combat':
        return <Dumbbell className="w-5 h-5 text-red-400" />
      case 'neural':
        return <Brain className="w-5 h-5 text-cyan-400" />
      case 'protocol':
        return <ShieldCheck className="w-5 h-5 text-purple-400" />
      case 'market':
        return <Coins className="w-5 h-5 text-amber-400" />
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        sectionCode="SEC_05_ACCOLADES"
        title="OPERATIVE MILESTONES &amp; TROPHIES"
        subtitle="Permanent commendations awarded for real-life habit consistency, high-tier attribute scaling, and streak persistence."
      />

      {/* Progress Overview Banner */}
      <GlassPanel variant="purple" glow className="p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-400 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              <Trophy className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h3 className="font-orbitron text-lg font-black tracking-wider text-slate-100 uppercase">
                ACCOLADE SYNCHRONIZATION
              </h3>
              <p className="text-xs font-mono text-purple-300">
                {unlockedCount} of {totalCount} MILESTONES UNLOCKED ({totalClaimed} CLAIMED)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-lg bg-[#070b16] border border-purple-500/30 text-center font-mono text-xs">
              <span className="text-slate-500 block text-[10px]">REWARD STATUS</span>
              <span className="text-pink-400 font-bold">
                {achievements.filter((a) => a.unlocked && !a.claimed).length} CLAIMABLE NOW
              </span>
            </div>
          </div>
        </div>

        <ProgressBar
          current={unlockedCount}
          max={totalCount}
          color="purple"
          height="md"
          showPercent
        />
      </GlassPanel>

      {/* Category Tabs */}
      <GlassPanel variant="default" className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'ALL MILESTONES', icon: Trophy },
            { id: 'protocol', label: 'STREAK & PROTOCOL', icon: Flame },
            { id: 'neural', label: 'NEURAL INTELLECT', icon: Brain },
            { id: 'combat', label: 'COMBAT & FITNESS', icon: Dumbbell },
            { id: 'market', label: 'BLACK MARKET', icon: Coins },
          ].map((tab) => {
            const isSelected = categoryFilter === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id as typeof categoryFilter)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-md font-rajdhani text-xs font-bold uppercase tracking-wider transition-all cursor-pointer',
                  isSelected
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent hover:border-slate-800'
                )}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </GlassPanel>

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map((ach) => {
          const isClaimable = ach.unlocked && !ach.claimed
          return (
            <motion.div
              key={ach.id}
              whileHover={{ scale: 1.01 }}
              className="relative"
            >
              <GlassPanel
                variant={isClaimable ? 'magenta' : ach.claimed ? 'purple' : 'default'}
                glow={isClaimable}
                className={cn(
                  'p-5 transition-all space-y-4',
                  !ach.unlocked && 'opacity-60'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'p-3 rounded-lg border shrink-0',
                        isClaimable
                          ? 'bg-pink-500/20 border-pink-400 shadow-[0_0_15px_rgba(255,0,127,0.5)]'
                          : ach.claimed
                          ? 'bg-purple-500/10 border-purple-500/30'
                          : 'bg-slate-900 border-slate-800'
                      )}
                    >
                      {getCategoryIcon(ach.category)}
                    </div>

                    <div>
                      <h4 className="font-orbitron text-sm font-bold tracking-wide text-slate-100">
                        {ach.title}
                      </h4>
                      <p className="text-xs font-sans text-slate-400 mt-0.5 leading-relaxed">
                        {ach.description}
                      </p>
                    </div>
                  </div>

                  {ach.claimed && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                      CLAIMED
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>PROGRESS</span>
                    <span className={ach.unlocked ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                      {ach.current} / {ach.max}
                    </span>
                  </div>
                  <ProgressBar
                    current={ach.current}
                    max={ach.max}
                    color={ach.unlocked ? 'green' : 'purple'}
                    height="sm"
                  />
                </div>

                {/* Footer Rewards & Claim Button */}
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold">
                      <Zap className="w-3 h-3 text-cyan-400" />
                      +{ach.xpReward} XP
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
                      <Coins className="w-3 h-3 text-amber-400" />
                      +{ach.creditReward} ₢
                    </span>
                  </div>

                  {isClaimable ? (
                    <NeonButton
                      variant="magenta"
                      size="sm"
                      onClick={() => claimAchievement(ach.id)}
                      leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                    >
                      CLAIM REWARD
                    </NeonButton>
                  ) : !ach.unlocked ? (
                    <span className="text-[11px] font-mono text-slate-500">
                      [INCOMPLETE PROTOCOL]
                    </span>
                  ) : null}
                </div>
              </GlassPanel>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
