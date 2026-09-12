import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Radio,
  Flame,
  Coins,
  Sparkles,
  ArrowRight,
  Shield,
  Activity,
  Plus,
  Zap,
  Target,
  Award,
  Timer,
  Skull,
  Eye,
} from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { PageHeader } from '../components/PageHeader'
import { GlassPanel } from '../components/GlassPanel'
import { XPBar } from '../components/XPBar'
import { MissionCard3D } from '../components/missions/MissionCard3D'
import { BossMissionCard } from '../components/missions/BossMissionCard'
import { MissionModal } from '../components/missions/MissionModal'
import { CyberpunkHumanAvatar3D } from '../components/3d/CyberpunkHumanAvatar3D'
import { CrystalMesh } from '../components/3d/StatCrystal3D'
import { NeonButton } from '../components/NeonButton'
import { useRPG } from '../context/RPGContext'
import { sound } from '../lib/sound'
import type { AttributeType } from '../types/rpg'

export const DashboardPage: React.FC = () => {
  const {
    user,
    attributes,
    missions,
    activityLogs,
    avatarState,
    completeMission,
    toggleSubtask,
    allocateStatPoint,
    addCustomMission,
  } = useRPG()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedStat3D, setSelectedStat3D] = useState<AttributeType>('INT')

  const bossMissions = missions.filter((m) => m.isBoss && !m.completed)
  const todayMissions = missions.filter((m) => !m.isBoss).slice(0, 4)
  const completedToday = missions.filter((m) => m.completed).length

  return (
    <div className="space-y-8 pb-16">
      {/* Top Page Header */}
      <PageHeader
        sectionCode="SEC_01_COMMAND_CENTER"
        title="OPERATIVE COMMAND HUD"
        subtitle="Real-time 3D neural telemetry, biometric attributes, and active tactical combat directives."
        actions={
          <div className="flex items-center gap-2">
            <NeonButton
              variant="cyan"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                sound.playClick()
                setIsCreateModalOpen(true)
              }}
            >
              INITIALIZE DIRECTIVE
            </NeonButton>
            <Link to="/focus">
              <NeonButton
                variant="magenta"
                size="sm"
                leftIcon={<Timer className="w-4 h-4" />}
              >
                DEEP WORK REACTOR
              </NeonButton>
            </Link>
          </div>
        }
      />

      {/* Hero 3D Operative Telemetry Chamber */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3D Cybernetic Avatar Viewport */}
        <div className="lg:col-span-5 rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-black border border-cyan-500/40 relative overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col justify-between min-h-[420px]">
          {/* Top telemetry tags */}
          <div className="p-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]" />
              <span className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider">
                3D NEURAL HOLOPROJECTION
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              STATUS: {avatarState.toUpperCase()}
            </span>
          </div>

          {/* 3D Cyberpunk Human Avatar Viewport */}
          <div className="relative w-full h-[360px]">
            <CyberpunkHumanAvatar3D
              state={avatarState}
              theme={user.theme}
              enableControls={true}
              className="h-full w-full"
            />
          </div>

          {/* Bottom Operative Stats Bar */}
          <div className="p-4 bg-black/70 backdrop-blur-md border-t border-cyan-500/30 z-10 flex items-center justify-between">
            <div>
              <div className="font-mono font-bold text-sm text-white flex items-center gap-2">
                <span>{user.username}</span>
                <span className="text-xs text-pink-400 font-semibold">// LVL {user.level}</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">{user.operativeClass}</div>
            </div>
            <Link
              to="/character"
              className="px-3 py-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>INSPECT RIG</span>
            </Link>
          </div>
        </div>

        {/* Operative Vitals, XP Bar, Streaks & Credits */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <GlassPanel variant="cyan" className="p-6 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
                <div>
                  <div className="text-xs font-mono text-cyan-400 font-semibold">{user.title}</div>
                  <h2 className="text-2xl font-black font-mono tracking-wider text-white">
                    BIOMETRIC TELEMETRY OVERVIEW
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>SYNAPSE SYNC 99.8%</span>
                </div>
              </div>

              {/* Quick Stat Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Streak */}
                <div className="p-3.5 rounded-xl bg-black/50 border border-pink-500/30 shadow-[0_0_12px_rgba(255,0,127,0.1)]">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                    <span>NEURAL STREAK</span>
                    <Flame className="w-4 h-4 text-pink-500" />
                  </div>
                  <div className="text-2xl font-black font-mono text-pink-400">
                    {user.streakDays} <span className="text-xs font-sans text-slate-400 font-normal">DAYS</span>
                  </div>
                  <div className="text-[10px] font-mono text-pink-300/80 mt-1">+30% XP Surge Multiplier</div>
                </div>

                {/* Credits */}
                <div className="p-3.5 rounded-xl bg-black/50 border border-amber-500/30 shadow-[0_0_12px_rgba(250,204,21,0.1)]">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                    <span>CREDIT POOL</span>
                    <Coins className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black font-mono text-amber-300">
                    {user.credits.toLocaleString()} <span className="text-xs font-sans text-slate-400 font-normal">₢</span>
                  </div>
                  <div className="text-[10px] font-mono text-amber-300/80 mt-1">Black Market Ready</div>
                </div>

                {/* Directives Completed */}
                <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-black/50 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.1)]">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                    <span>QUEST PROTOCOLS</span>
                    <Activity className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-black font-mono text-cyan-300">
                    {completedToday}/{missions.length}
                  </div>
                  <div className="text-[10px] font-mono text-cyan-300/80 mt-1">
                    {Math.round((completedToday / (missions.length || 1)) * 100)}% Total Progress
                  </div>
                </div>
              </div>

              {/* XP Progression Bar */}
              <div className="pt-2">
                <XPBar
                  level={user.level}
                  currentXP={user.currentXP}
                  maxXP={user.maxXP}
                  unassignedPoints={user.unassignedPoints}
                />
              </div>
            </div>

            {/* Quick deep work focus widget */}
            <div className="mt-5 p-3.5 rounded-xl bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-black border border-pink-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
                  <Zap className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    DEEP WORK REACTOR ONLINE
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Enter 25m immersive 3D Pomodoro focus chamber to earn +100 XP.
                  </div>
                </div>
              </div>
              <Link to="/focus">
                <NeonButton variant="magenta" size="sm">
                  ENGAGE REACTOR
                </NeonButton>
              </Link>
            </div>
          </GlassPanel>
        </div>
      </div>

      {/* Active Boss Quest Encounter (if present) */}
      {bossMissions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-pink-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Skull className="w-4 h-4 animate-bounce text-pink-500" />
            <span>// PRIORITY BOSS THREAT DETECTED</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {bossMissions.map((boss) => (
              <BossMissionCard
                key={boss.id}
                mission={boss}
                onComplete={completeMission}
                onToggleSubtask={toggleSubtask}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Directives & 3D Interactive Stat Crystal Chamber */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Tactical Directives */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <h3 className="font-mono text-base font-bold tracking-wider text-white uppercase">
                TACTICAL MISSION QUEUE
              </h3>
            </div>
            <Link
              to="/missions"
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
            >
              <span>ALL MISSIONS ({missions.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {todayMissions.map((mission) => (
              <MissionCard3D
                key={mission.id}
                mission={mission}
                onComplete={completeMission}
                onToggleSubtask={toggleSubtask}
              />
            ))}
          </div>
        </div>

        {/* Right Column: 3D Stat Crystals & Telemetry Logs */}
        <div className="lg:col-span-5 space-y-6">
          {/* 3D Interactive Stat Crystal Viewer */}
          <div className="p-5 rounded-xl bg-black/60 border border-purple-500/30 relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between mb-3 border-b border-purple-500/20 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h4 className="font-mono text-xs font-bold tracking-wider text-purple-300 uppercase">
                  3D STAT CRYSTAL RESONATOR
                </h4>
              </div>
              <span className="text-[10px] font-mono text-purple-400 font-bold">
                {user.unassignedPoints} POINTS AVAIL
              </span>
            </div>

            {/* Stat Selector Pills */}
            <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
              {(['INT', 'STR', 'DEX', 'VIT', 'DIS'] as AttributeType[]).map((code) => {
                const attr = attributes.find((a) => a.code === code)
                const isSelected = selectedStat3D === code
                return (
                  <button
                    key={code}
                    onClick={() => {
                      sound.playClick()
                      setSelectedStat3D(code)
                    }}
                    className={`px-2.5 py-1 rounded font-mono text-[11px] font-bold transition-all ${
                      isSelected
                        ? 'bg-purple-500/30 text-purple-200 border border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                        : 'bg-black/40 text-slate-400 border border-slate-800 hover:border-purple-500/40'
                    }`}
                  >
                    {code} ({attr?.value || 0})
                  </button>
                )
              })}
            </div>

            {/* 3D Crystal Canvas */}
            <div className="h-44 w-full rounded-lg bg-gradient-to-b from-purple-950/20 to-black relative overflow-hidden border border-purple-500/20">
              <Canvas camera={{ position: [0, 0, 3.2], fov: 45 }}>
                <ambientLight intensity={0.8} />
                <pointLight position={[3, 3, 3]} intensity={2.0} color="#a855f7" />
                <pointLight position={[-3, -3, 2]} intensity={1.5} color="#00f0ff" />
                <CrystalMesh
                  attributeCode={selectedStat3D}
                  points={attributes.find((a) => a.code === selectedStat3D)?.value || 10}
                />
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
              </Canvas>
            </div>

            {/* Allocation CTA */}
            <div className="mt-3 flex items-center justify-between">
              <div>
                <div className="font-mono text-xs font-bold text-white">
                  {attributes.find((a) => a.code === selectedStat3D)?.fullName || selectedStat3D}
                </div>
                <div className="text-[10px] text-slate-400">
                  {attributes.find((a) => a.code === selectedStat3D)?.perk}
                </div>
              </div>
              <button
                disabled={user.unassignedPoints <= 0}
                onClick={() => allocateStatPoint(selectedStat3D)}
                className={`px-3 py-1.5 rounded font-mono text-xs font-bold transition-all ${
                  user.unassignedPoints > 0
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                +2 POINTS INJECT
              </button>
            </div>
          </div>

          {/* Telemetry Activity Feed */}
          <GlassPanel variant="purple" className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/20 mb-4">
              <h4 className="font-mono text-xs font-bold tracking-wider text-purple-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                // LIVE TELEMETRY AUDIT FEED
              </h4>
              <span className="text-[10px] font-mono text-slate-500">REALTIME</span>
            </div>

            <div className="space-y-3">
              {activityLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-2.5 rounded bg-black/40 border border-slate-800/80 text-xs"
                >
                  <div className="mt-0.5 shrink-0">
                    {log.type === 'mission' && <Target className="w-4 h-4 text-cyan-400" />}
                    {log.type === 'level' && <Zap className="w-4 h-4 text-pink-400" />}
                    {log.type === 'stat' && <Shield className="w-4 h-4 text-purple-400" />}
                    {log.type === 'shop' && <Coins className="w-4 h-4 text-amber-400" />}
                    {log.type === 'achievement' && <Award className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-slate-200 truncate">{log.title}</span>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">{log.timestamp || 'RECENT'}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{log.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>

      {/* Create Mission Modal */}
      <MissionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => addCustomMission(data as any)}
      />
    </div>
  )
}
