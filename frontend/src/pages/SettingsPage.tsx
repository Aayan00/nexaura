import React, { useState } from 'react'
import {
  Sliders,
  Volume2,
  VolumeX,
  Cpu,
  Database,
  Terminal,
  Palette,
  RefreshCw,
  User,
  CheckCircle,
} from 'lucide-react'
import { useRPG } from '../context/RPGContext'
import { sound } from '../lib/sound'

export const SettingsPage: React.FC = () => {
  const {
    user,
    setPerformanceMode,
    setEnvironmentTheme,
    updateUserProfile,
    toggleSound,
    showToast,
  } = useRPG()

  const [username, setUsername] = useState(user.username)
  const [operativeClass, setOperativeClass] = useState(user.operativeClass || 'Cyberdeck Netrunner')
  const [vol, setVol] = useState(75)

  const environments = [
    { id: 'city', name: 'Neo-Tokyo Sprawl', desc: 'Cyberpunk Metropolis with neon high-rises and laser fog', color: '#00f0ff', glow: 'rgba(0,240,255,0.4)' },
    { id: 'space', name: 'Orbital Void', desc: 'Deep space satellite deck with distant nebula clusters', color: '#38bdf8', glow: 'rgba(56,189,248,0.4)' },
    { id: 'matrix', name: 'Digital Matrix Rain', desc: 'Cascading green hexadecimal stream buffer', color: '#10b981', glow: 'rgba(168,85,129,0.4)' },
    { id: 'amber', name: 'Industrial Sector 7', desc: 'Amber warning beacons and molten refinery smoke', color: '#f59e0b', glow: 'rgba(245,158,11,0.4)' },
    { id: 'void', name: 'Obsidian Singularity', desc: 'Pure dark matter minimalist cyber deck', color: '#a855f7', glow: 'rgba(168,85,247,0.4)' },
  ] as const

  const performanceModes = [
    { id: 'ultra', name: 'ULTRA 3D ENGINE', badge: 'MAX IMMERSION', desc: 'Full procedural 3D Armored Avatar, dynamic holographic platforms, 3D stat crystals & instanced particle fields at 60 FPS.' },
    { id: 'balanced', name: 'BALANCED PROTOCOL', badge: 'OPTIMIZED', desc: 'Render essential 3D assets with smoothed bloom and reduced particle count for laptops and tablets.' },
    { id: 'low', name: '2D LOW-LATENCY HUD', badge: 'MAX PERFORMANCE', desc: 'Lightweight GPU pipeline using fast vector graphics and minimal canvas strain.' },
  ] as const

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    sound.playComplete()
    updateUserProfile({
      username: username.toUpperCase(),
      operativeClass,
    })
    showToast({
      title: '[OPERATIVE PROFILE UPDATED]',
      message: `Callsign set to ${username.toUpperCase()} // ${operativeClass}`,
      type: 'success',
    })
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setVol(val)
    sound.setVolume(val / 100)
    sound.playClick()
  }

  const handleExportData = () => {
    sound.playClick()
    const dataStr = JSON.stringify(localStorage, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `nexaura_save_${user.username}_${Date.now()}.json`
    link.click()
    showToast({
      title: '[DATA ARCHIVE EXPORTED]',
      message: 'Neural profile saved to local filesystem.',
      type: 'reward',
    })
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 tracking-widest uppercase mb-1">
            <Sliders className="w-4 h-4 animate-spin text-cyan-400" />
            <span>// SYSTEM CONFIGURATION & HARDWARE LINK</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-wider text-white font-mono flex items-center gap-3">
            CYBERNETIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400">SETTINGS</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Calibrate render pipeline, environment skyboxes, audio harmonics, and operative credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded bg-black/60 border border-cyan-500/30 font-mono text-xs text-cyan-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>NEURAL KERNEL v2.4.0 ONLINE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Graphics, Environment & Audio */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: 3D Graphics & Performance */}
          <div className="p-6 rounded-xl bg-black/50 border border-cyan-500/30 relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-mono">RENDER PIPELINE & 3D ENGINE</h2>
                <p className="text-xs text-slate-400">Control Three.js WebGL procedural shaders, particle density and post-processing.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {performanceModes.map((mode) => {
                const isSelected = (user.performanceMode || 'ultra') === mode.id
                return (
                  <button
                    key={mode.id}
                    onClick={() => {
                      sound.playClick()
                      setPerformanceMode(mode.id as any)
                    }}
                    className={`p-4 rounded-lg text-left transition-all border relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                        : 'bg-black/40 border-slate-800 hover:border-cyan-500/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          isSelected ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {mode.badge}
                        </span>
                        {isSelected && <CheckCircle className="w-4 h-4 text-cyan-400" />}
                      </div>
                      <h3 className="font-mono font-bold text-sm text-white">{mode.name}</h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{mode.desc}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-mono text-cyan-400">
                      <span>FPS Target:</span>
                      <span className="font-bold text-white">{mode.id === 'ultra' ? '60 FPS Ultra' : mode.id === 'balanced' ? '60 FPS Eco' : '120+ FPS Max'}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section 2: Environment Atmosphere Selection */}
          <div className="p-6 rounded-xl bg-black/50 border border-pink-500/30 relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-400">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-mono">SIMULATION ATMOSPHERE & SKYBOX</h2>
                <p className="text-xs text-slate-400">Select active background neural hologram projection.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {environments.map((env) => {
                const isSelected = (user.environment || 'city') === env.id
                return (
                  <button
                    key={env.id}
                    onClick={() => {
                      sound.playClick()
                      setEnvironmentTheme(env.id as any)
                    }}
                    className={`p-3.5 rounded-lg text-left transition-all border relative ${
                      isSelected
                        ? 'bg-pink-950/30 border-pink-400 shadow-[0_0_15px_rgba(255,0,127,0.25)]'
                        : 'bg-black/40 border-slate-800 hover:border-pink-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: env.color, boxShadow: `0 0 8px ${env.color}` }} />
                      <h4 className="font-mono text-xs font-bold text-white truncate">{env.name}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{env.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section 3: Cyber Audio & Sound Harmonics */}
          <div className="p-6 rounded-xl bg-black/50 border border-yellow-500/30 relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-mono">AUDIO SYNTHESIZER & SFX</h2>
                <p className="text-xs text-slate-400">Web Audio API procedural sound feedback and level-up chimes.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-black/40 border border-slate-800">
                <div className="flex items-center gap-3">
                  {user.soundEnabled ? <Volume2 className="w-5 h-5 text-yellow-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
                  <div>
                    <div className="font-mono text-sm font-bold text-white">Master Sound FX</div>
                    <div className="text-xs text-slate-400">Enable synthesized click, reward ping, and level up alerts.</div>
                  </div>
                </div>
                <button
                  onClick={toggleSound}
                  className={`px-4 py-2 rounded font-mono text-xs font-bold transition-all ${
                    user.soundEnabled
                      ? 'bg-yellow-500 text-black shadow-[0_0_12px_rgba(250,204,21,0.4)]'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {user.soundEnabled ? 'ENABLED' : 'MUTED'}
                </button>
              </div>

              {user.soundEnabled && (
                <div className="p-4 rounded-lg bg-black/40 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-300">SFX Master Gain Volume</span>
                    <span className="text-yellow-400 font-bold">{vol}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={vol}
                    onChange={handleVolumeChange}
                    className="w-full accent-yellow-400 cursor-pointer"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => sound.playClick()}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300"
                    >
                      Test Click
                    </button>
                    <button
                      onClick={() => sound.playComplete()}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300"
                    >
                      Test Mission Complete
                    </button>
                    <button
                      onClick={() => sound.playLevelUp()}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300"
                    >
                      Test Level Up
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Operative Profile & System Diagnostics */}
        <div className="space-y-8">
          {/* Operative Profile Editor */}
          <div className="p-6 rounded-xl bg-black/50 border border-cyan-500/30 relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-mono">OPERATIVE IDENTITY</h2>
                <p className="text-xs text-slate-400">Update callsing credentials.</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-cyan-400 uppercase mb-1.5">Callsign / Handle</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-cyan-500/40 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-400 uppercase mb-1.5">Operative Archetype</label>
                <select
                  value={operativeClass}
                  onChange={(e) => setOperativeClass(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/80 border border-cyan-500/40 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                >
                  <option value="Cyberdeck Netrunner">Cyberdeck Netrunner (INT / Focus)</option>
                  <option value="Subdermal Enforcer">Subdermal Enforcer (STR / Physical)</option>
                  <option value="Ghost Specialist">Ghost Specialist (DEX / Speed)</option>
                  <option value="Synthblade Duelist">Synthblade Duelist (VIT / Combat)</option>
                  <option value="Neural Architect">Neural Architect (DIS / Habits)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono font-bold text-sm tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
              >
                SYNC PROFILE TO CORE
              </button>
            </form>
          </div>

          {/* System Kernel Diagnostics */}
          <div className="p-6 rounded-xl bg-black/50 border border-slate-800 relative overflow-hidden backdrop-blur-md space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded bg-slate-800 text-slate-300">
                <Terminal className="w-4 h-4" />
              </div>
              <h3 className="font-mono font-bold text-sm text-white">SYSTEM DIAGNOSTICS</h3>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Database Driver:</span>
                <span className="text-emerald-400">MySQL 8.0 / Memory Fallback Active</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">API Protocol:</span>
                <span className="text-cyan-400">Express REST (Port 5000)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">WebGL 3D Engine:</span>
                <span className="text-purple-400">Three.js + R3F v9</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Client Memory Cache:</span>
                <span className="text-yellow-400">LocalStorage v2 Verified</span>
              </div>
            </div>

            <div className="pt-3 flex flex-col gap-2">
              <button
                onClick={handleExportData}
                className="w-full py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-cyan-500/20 flex items-center justify-center gap-2"
              >
                <Database className="w-3.5 h-3.5" />
                <span>EXPORT NEURAL PROFILE (JSON)</span>
              </button>
              <button
                onClick={() => {
                  sound.playAlert()
                  if (window.confirm('Reset local cache to factory defaults?')) {
                    localStorage.clear()
                    window.location.reload()
                  }
                }}
                className="w-full py-2 rounded bg-red-950/30 hover:bg-red-900/40 text-xs font-mono text-red-400 border border-red-500/30 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>PURGE CLIENT CACHE & REBOOT</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
