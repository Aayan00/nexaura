import React from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, Crosshair, Timer, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react'
import { GlassPanel } from '../GlassPanel'
import { Link } from 'react-router-dom'

export const WorldPreviewSection: React.FC = () => {
  const pillars = [
    {
      title: '3D OPERATIVE RIG & LOADOUT',
      description: 'Equip legendary katanas, titanium exosuits, neural co-processors, and customize dynamic neon HUD themes in full 3D.',
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
      badge: 'RIG 3D ENGINE',
      stat: '5 ATTR // INT • STR • DEX • VIT • DIS',
    },
    {
      title: 'S-TIER BOSS BATTLE QUESTS',
      description: 'Conquer complex multidisciplinary projects as epic raid bosses. Damage enemy health bars by clearing nested subroutines.',
      icon: <ShieldAlert className="w-5 h-5 text-pink-400" />,
      badge: 'EPIC RAID DIRECTIVES',
      stat: 'DYNAMIC HP // DOUBLE BOUNTIES',
    },
    {
      title: '3D FOCUS MODE HYPER-CHAMBER',
      description: 'Enter zero-distraction Pomodoro cycles with ambient cyber city soundscapes, real-time telemetry, and instant XP earnings.',
      icon: <Timer className="w-5 h-5 text-purple-400" />,
      badge: 'DEEP WORK SYNAPSE',
      stat: 'POMODORO // AUDIO SYNTHESIS',
    },
  ]

  return (
    <section id="world" className="relative py-24 bg-[#02050f] text-slate-100 overflow-hidden border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading and Lore Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a1224] border border-pink-500/30 text-xs font-mono text-pink-400 uppercase tracking-widest">
              <Crosshair className="w-3.5 h-3.5 text-pink-400" />
              <span>// THE NEXAURA UNIVERSE</span>
            </div>

            <h2 className="font-orbitron text-3xl sm:text-4xl lg:text-5xl font-black tracking-wider text-slate-100 uppercase leading-tight">
              A LIVING WORLD WHERE <span className="text-cyan-400">DISCIPLINE</span> IS POWER.
            </h2>

            <p className="font-mono text-sm text-slate-400 leading-relaxed">
              Every hour spent coding, training, reading, or building habits directly feeds your operative telemetry. Your character reflects your daily commitment in real life.
            </p>

            <div className="pt-2 space-y-3 font-mono text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Zero fake progression — fueled strictly by your real-world achievements.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Integrated Black Market economy with unlockable cyberware & titles.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Express + MySQL session security with 100% data privacy.</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 tracking-wider uppercase underline underline-offset-4 group"
              >
                <span>COMMENCE YOUR ENROLLMENT PROTOCOL</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Interactive Flagship Systems */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-4"
          >
            {pillars.map((item) => (
              <GlassPanel
                key={item.title}
                variant="cyan"
                className="p-6 transition-all duration-300 hover:border-cyan-400/80 hover:bg-[#081228]/80 group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-[#0a1428] border border-cyan-500/30 group-hover:border-cyan-400 transition-colors shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-mono tracking-widest text-pink-400 font-bold uppercase">
                        {item.badge}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                        {item.stat}
                      </span>
                    </div>
                    <h3 className="font-orbitron text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors uppercase">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs font-mono text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </GlassPanel>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default WorldPreviewSection
