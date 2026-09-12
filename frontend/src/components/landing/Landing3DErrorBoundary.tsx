import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Terminal, AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class Landing3DErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[Nexaura 3D Canvas Fault]:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 bg-[#040714] flex items-center justify-center p-6 overflow-hidden">
          {/* Ambient Cyber Grid & Glow Fallback */}
          <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
          <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Fallback Telemetry Banner */}
          <div className="relative z-10 max-w-md p-4 rounded-lg bg-[#070d1d]/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs flex items-center gap-3 backdrop-blur-md shadow-[0_0_25px_rgba(0,240,255,0.15)]">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
            <div>
              <div className="font-bold uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>3D ASSET UNAVAILABLE — PROCEDURAL MODE</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                WebGL acceleration fallback engaged. All HUD controls & neural pathways remain active.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default Landing3DErrorBoundary
