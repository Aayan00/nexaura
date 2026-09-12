import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class SceneErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Nexaura 3D Scene Error Boundary caught error:', error, errorInfo)
  }

  public handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 w-full h-full bg-[#030612] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden z-0">
          {/* Cyberpunk Fallback Background Gradients */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#13113b]/60 via-[#050818]/90 to-[#02040b]" />
          <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

          {/* Minimal Fallback Tech Notice */}
          <div className="relative z-10 max-w-md p-6 rounded-xl border border-cyan-500/30 bg-[#080d1e]/80 backdrop-blur-md shadow-[0_0_30px_rgba(0,240,255,0.15)]">
            <div className="inline-flex p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-orbitron text-lg font-bold text-slate-100 tracking-wider uppercase mb-2">
              GPU ACCELERATION LIMITED
            </h3>
            <p className="text-xs font-mono text-slate-300 mb-6 leading-relaxed">
              3D render pipeline switched to static telemetry mode. Full operative controls and missions remain online.
            </p>
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded border border-cyan-400/50 bg-cyan-500/20 hover:bg-cyan-500/30 text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>REINITIALIZE SCENE</span>
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default SceneErrorBoundary
