import React from 'react'
import { motion } from 'framer-motion'
import { Target, TrendingUp, Trophy, Users, Globe2, Sparkles, Terminal } from 'lucide-react'
import { GlassPanel } from '../GlassPanel'

interface FeatureItem {
  id: string
  title: string
  subtitle: string
  description: string
  icon: React.ReactNode
  color: string
  tag: string
}

export const FeatureCards: React.FC = () => {
  const features: FeatureItem[] = [
    {
      id: 'f1',
      title: 'COMPLETE MISSIONS',
      subtitle: 'Turn real tasks into epic quests.',
      description: 'Transform daily routines, deep work, and workouts into high-stakes gamified directives with difficulty ranks from D to S-Tier.',
      icon: <Target className="w-6 h-6 text-cyan-400" />,
      color: 'border-cyan-500/40 hover:border-cyan-400',
      tag: '01 // QUEST ENGINE',
    },
    {
      id: 'f2',
      title: 'LEVEL UP',
      subtitle: 'Build the best version of yourself.',
      description: 'Gain real XP and allocate permanent attribute points into 5 core human pillars: Intellect, Strength, Dexterity, Vitality, and Discipline.',
      icon: <TrendingUp className="w-6 h-6 text-pink-400" />,
      color: 'border-pink-500/40 hover:border-pink-400',
      tag: '02 // RPG ATTRIBUTES',
    },
    {
      id: 'f3',
      title: 'UNLOCK REWARDS',
      subtitle: 'Earn XP, credits, gear, and achievements.',
      description: 'Bounty rewards directly payout Credits for the Black Market. Acquire cyberware implants, tactical armor, holographic HUD themes, and titles.',
      icon: <Trophy className="w-6 h-6 text-amber-400" />,
      color: 'border-amber-500/40 hover:border-amber-400',
      tag: '03 // BLACK MARKET',
    },
    {
      id: 'f4',
      title: 'JOIN A COMMUNITY',
      subtitle: 'Connect with like-minded operators.',
      description: 'Synchronize telemetry, compete on operative leaderboards, conquer community raid bosses, and reinforce unbreakable discipline streaks.',
      icon: <Users className="w-6 h-6 text-purple-400" />,
      color: 'border-purple-500/40 hover:border-purple-400',
      tag: '04 // OPERATIVE NETWORK',
    },
    {
      id: 'f5',
      title: 'EXPLORE A NEW WORLD',
      subtitle: 'Where productivity feels alive.',
      description: 'Immerse yourself in a full 3D interactive cyberpunk dashboard with custom character rigs, audio synthesizers, and procedural cityscapes.',
      icon: <Globe2 className="w-6 h-6 text-emerald-400" />,
      color: 'border-emerald-500/40 hover:border-emerald-400',
      tag: '05 // 3D METAVERSE',
    },
  ]

  return (
    <section id="features" className="relative py-24 bg-[#030611] text-slate-100 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a1224] border border-cyan-500/30 text-xs font-mono text-cyan-300 uppercase tracking-widest mb-4">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>// ARCHITECTURE SPECIFICATIONS</span>
          </div>

          <h2 className="font-orbitron text-3xl sm:text-4xl lg:text-5xl font-black tracking-wider text-slate-100 uppercase">
            POWERED BY <span className="text-cyan-400">CYBERNETIC</span> PROTOCOLS
          </h2>

          <p className="mt-4 text-sm sm:text-base font-mono text-slate-400 leading-relaxed">
            Standard task managers are boring checkboxes. Nexaura turns your daily discipline into an immersive RPG operating system.
          </p>
        </div>

        {/* 5 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`h-full ${index === 3 ? 'md:col-span-1 lg:col-span-1' : ''}`}
            >
              <GlassPanel
                variant="cyan"
                className={`p-6 sm:p-7 h-full flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] ${item.color} group shadow-[0_4px_20px_rgba(0,0,0,0.5)]`}
              >
                <div>
                  {/* Top Bar with Tag and Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] font-mono tracking-widest text-slate-500 group-hover:text-cyan-400 transition-colors">
                      {item.tag}
                    </span>
                    <div className="p-2.5 rounded-lg bg-[#070e22] border border-slate-800 group-hover:border-cyan-400/60 shadow-sm transition-colors">
                      {item.icon}
                    </div>
                  </div>

                  {/* Main Title */}
                  <h3 className="font-orbitron text-xl font-bold tracking-wide text-slate-100 uppercase group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="font-mono text-xs font-semibold text-pink-400 uppercase tracking-wider mt-1 mb-3">
                    “{item.subtitle}”
                  </p>

                  {/* Description */}
                  <p className="text-xs font-mono text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Tech Status Accent */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    ONLINE
                  </span>
                  <span className="text-cyan-500/80 group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                    EXPLORE <Sparkles className="w-3 h-3" />
                  </span>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeatureCards
