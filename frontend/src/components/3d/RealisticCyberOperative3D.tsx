import React from 'react'
import {
  AnimeShonenHero3D,
  type AnimePose,
  type AuraPowerMode,
  type AnimeTheme,
  type CameraPreset,
} from './AnimeShonenHero3D'

export type OperativePose = AnimePose | 'walk' | 'combat' | 'custom'
export type OperativeTheme = AnimeTheme

export interface RealisticCyberOperativeProps {
  pose?: OperativePose
  powerMode?: AuraPowerMode
  theme?: OperativeTheme
  cameraPreset?: CameraPreset
  autoRotate?: boolean
  wireframe?: boolean
  resetTrigger?: number
  zoomLevel?: number
  modelUrl?: string
  showVisor?: boolean
  onMissingModelClick?: () => void
}

export const RealisticCyberOperative3D: React.FC<RealisticCyberOperativeProps> = ({
  pose = 'idle',
  powerMode = 'normal',
  theme = 'default',
  cameraPreset = 'full',
  autoRotate = false,
  resetTrigger = 0,
  zoomLevel = 0,
  modelUrl,
  showVisor = true,
}) => {
  // Map legacy pose names to anime shonen poses
  const mappedPose: AnimePose =
    pose === 'combat' ? 'ready' :
    pose === 'walk' ? 'ready' :
    pose === 'custom' ? 'meditation' :
    (pose as AnimePose)

  return (
    <AnimeShonenHero3D
      pose={mappedPose}
      powerMode={powerMode}
      theme={theme}
      cameraPreset={cameraPreset}
      autoRotate={autoRotate}
      resetTrigger={resetTrigger}
      zoomLevel={zoomLevel}
      modelUrl={modelUrl}
      showVisor={showVisor}
    />
  )
}

export default RealisticCyberOperative3D
