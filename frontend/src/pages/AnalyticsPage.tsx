import React from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  TrendingUp,
  Flame,
  Coins,
  CheckCircle2,
  Clock,
  BarChart3,
} from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { GlassPanel } from '../components/GlassPanel'
import { ProgressBar } from '../components/ProgressBar'
import { useRPG } from '../context/RPGContext'

export const AnalyticsPage: React.FC = () => {
  const { user, missions } = useRPG()

  const completedCount = missions.filter((m) => m.completed).length
  const totalCount = missions.length
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100

  // Category counts
  const categoryCounts = missions.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const weeklyData = [
    { day: 'MON', completed: 5, xp: 950 },
    { day: 'TUE', completed: 6, xp: 1200 },
    { day: 'WED', completed: 4, xp: 820 },
    { day: 'THU', completed: 7, xp: 1450 },
    { day: 'FRI', completed: 5, xp: 1050 },
    { day: 'SAT', completed: 8, xp: 1900 },
    { day: 'SUN', completed: 6, xp: 1300 },
  ]

  const maxXP = Math.max(...weeklyData.map((d) => d.xp))

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        sectionCode="SEC_07_TELEMETRY"
        title="OPERATIVE PRODUCTIVITY ANALYTICS"
        subtitle="Comprehensive biometric performance metrics, weekly output graphs, and attribute growth curves."
      />

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassPanel variant="cyan" className="p-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span>COMPLETION RATE</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-mono text-2xl font-black text-cyan-300">
            {completionRate}%
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
            {completedCount}/{totalCount} DIRECTIVES RESOLVED
          </div>
        </GlassPanel>

        <GlassPanel variant="magenta" className="p-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span>UNBROKEN STREAK</span>
            <Flame className="w-4 h-4 text-pink-500 fill-pink-500/30" />
          </div>
          <div className="font-mono text-2xl font-black text-pink-400">
            {user.streakDays} DAYS
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
            RECORD: {user.longestStreak || 14} DAYS
          </div>
        </GlassPanel>

        <GlassPanel variant="amber" className="p-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span>CREDIT INVENTORY</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono text-2xl font-black text-amber-300">
            {user.credits.toLocaleString()} ₢
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
            READY FOR BLACK MARKET
          </div>
        </GlassPanel>

        <GlassPanel variant="purple" className="p-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span>TOTAL FOCUS TIME</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="font-mono text-2xl font-black text-purple-300">
            18.5 HRS
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
            ACROSS 32 POMODORO SESSIONS
          </div>
        </GlassPanel>
      </div>

      {/* Weekly Output Chart & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Bar Chart */}
        <div className="lg:col-span-7">
          <GlassPanel variant="cyan" className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
              <h3 className="font-mono text-sm font-bold tracking-wider text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                // 7-DAY XP ACCUMULATION SPRINT
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">TOTAL: 8,670 XP</span>
            </div>

            {/* Custom Bar Visualizer */}
            <div className="h-52 flex items-end justify-between gap-2 pt-6 pb-2 px-2">
              {weeklyData.map((d) => {
                const heightPercent = Math.round((d.xp / maxXP) * 100)
                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-cyan-300 mb-1">
                      {d.xp}
                    </div>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="w-full max-w-[36px] rounded-t-md bg-gradient-to-t from-cyan-600 via-purple-600 to-pink-500 shadow-[0_0_12px_rgba(0,240,255,0.4)] group-hover:brightness-125 transition-all"
                    />
                    <span className="font-mono text-xs text-slate-400 font-semibold">{d.day}</span>
                  </div>
                )
              })}
            </div>
          </GlassPanel>
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-5">
          <GlassPanel variant="purple" className="p-5 sm:p-6 space-y-4 h-full">
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
              <h3 className="font-mono text-sm font-bold tracking-wider text-purple-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                // DIRECTIVE CATEGORY MIX
              </h3>
            </div>

            <div className="space-y-3 pt-1">
              {Object.entries(categoryCounts).map(([cat, count]) => {
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono text-slate-300">
                      <span>{cat}</span>
                      <span className="text-cyan-400 font-bold">{count} tasks</span>
                    </div>
                    <ProgressBar current={count} max={totalCount} color="purple" height="sm" />
                  </div>
                )
              })}
            </div>
          </GlassPanel>
        </div>
      </div>

      {/* 52-Week Habit Heatmap Matrix */}
      <GlassPanel variant="default" className="p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="font-mono text-sm font-bold tracking-wider text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            // 52-WEEK PROTOCOL HEATMAP
          </h3>
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span>LESS</span>
            <div className="w-2.5 h-2.5 rounded-sm bg-slate-900 border border-slate-800" />
            <div className="w-2.5 h-2.5 rounded-sm bg-cyan-950 border border-cyan-800" />
            <div className="w-2.5 h-2.5 rounded-sm bg-cyan-600 border border-cyan-400" />
            <div className="w-2.5 h-2.5 rounded-sm bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />
            <span>MORE</span>
          </div>
        </div>

        {/* Generated Grid Cells */}
        <div className="overflow-x-auto py-2">
          <div className="grid grid-rows-7 grid-flow-col gap-1.5 w-max">
            {[...Array(52 * 7)].map((_, i) => {
              const intensity = (i * 13) % 5
              const colorClass =
                intensity === 4
                  ? 'bg-cyan-400 shadow-[0_0_4px_#00f0ff]'
                  : intensity === 3
                  ? 'bg-cyan-600'
                  : intensity === 2
                  ? 'bg-purple-700'
                  : intensity === 1
                  ? 'bg-cyan-950'
                  : 'bg-slate-900/80 border border-slate-800'
              return (
                <div
                  key={i}
                  title={`Day ${i + 1}: ${intensity * 2} Directives Complete`}
                  className={`w-3 h-3 rounded-sm ${colorClass} transition-transform hover:scale-125 cursor-pointer`}
                />
              )
            })}
          </div>
        </div>
      </GlassPanel>
    </div>
  )
}
