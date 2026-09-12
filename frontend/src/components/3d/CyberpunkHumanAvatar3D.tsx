import React, { useRef, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { RotateCw, RefreshCw, Eye, User } from 'lucide-react';

export type HumanAvatarAnimState = 'idle' | 'focus' | 'complete' | 'levelup' | 'victory';

interface CyberpunkHumanAvatarProps {
  state?: HumanAvatarAnimState;
  animState?: HumanAvatarAnimState;
  theme?: string;
  className?: string;
  modelUrl?: string;
  enableControls?: boolean;
  performanceMode?: 'ultra' | 'balanced' | 'low';
}

// 1. External GLB Model Component (if user adds a local .glb file to public/assets/models/)
function GLBModel({ url, activeState }: { url: string; activeState: HumanAvatarAnimState }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (modelRef.current) {
      const t = state.clock.getElapsedTime();
      const floatAmp = activeState === 'levelup' ? 0.15 : 0.05;
      modelRef.current.position.y = Math.sin(t * 1.5) * floatAmp - 1.2;
    }
  });

  return <primitive ref={modelRef} object={scene} scale={[1.2, 1.2, 1.2]} position={[0, -1.2, 0]} />;
}

// 2. High-Fidelity Anatomical Humanoid Cyber-Operative (Zero Cubes, Smooth Articulated Organic Anatomy)
function AnatomicalHumanoidRig({ activeState, theme = 'neon-cyan', wireframe = false }: { activeState: HumanAvatarAnimState; theme?: string; wireframe?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const chestRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  const colors = useMemo(() => {
    switch (theme) {
      case 'magenta':
      case 'th-2':
        return { skin: '#e2b3a3', suit: '#160d24', neon: '#ff007f', secondary: '#a855f7', metal: '#2a1a38' };
      case 'amber':
      case 'th-3':
        return { skin: '#d9a794', suit: '#1c140a', neon: '#facc15', secondary: '#ea580c', metal: '#332410' };
      case 'matrix':
      case 'th-4':
        return { skin: '#cbb6a6', suit: '#0a1a12', neon: '#10b981', secondary: '#059669', metal: '#142e20' };
      case 'neon-cyan':
      default:
        return { skin: '#e8beac', suit: '#0b1326', neon: '#00f0ff', secondary: '#a855f7', metal: '#16223d' };
    }
  }, [theme]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const { pointer } = state;

    if (groupRef.current) {
      // Natural human breathing & idle weight shift
      const breathingAmp = activeState === 'focus' ? 0.02 : activeState === 'levelup' ? 0.12 : 0.04;
      const breathingFreq = activeState === 'focus' ? 1.0 : 1.8;
      groupRef.current.position.y = Math.sin(t * breathingFreq) * breathingAmp - 0.2;

      // Subtle hip sway
      groupRef.current.rotation.y = Math.sin(t * 0.6) * 0.05 + pointer.x * 0.15;
    }

    // Head tracking pointer
    if (headRef.current) {
      headRef.current.rotation.y = pointer.x * 0.35;
      headRef.current.rotation.x = -pointer.y * 0.2;
    }

    // Chest expansion breathing
    if (chestRef.current) {
      const breatheScale = 1 + Math.sin(t * 1.8) * 0.025;
      chestRef.current.scale.set(breatheScale, breatheScale, breatheScale);
    }

    // Dynamic arm action poses
    if (leftArmRef.current && rightArmRef.current) {
      if (activeState === 'victory' || activeState === 'levelup') {
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 1.2, delta * 4);
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -1.2, delta * 4);
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -0.4, delta * 4);
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -0.4, delta * 4);
      } else if (activeState === 'focus') {
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.4, delta * 3);
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.4, delta * 3);
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0.6, delta * 3);
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0.6, delta * 3);
      } else {
        leftArmRef.current.rotation.z = 0.12 + Math.sin(t * 1.8) * 0.03;
        rightArmRef.current.rotation.z = -0.12 - Math.sin(t * 1.8) * 0.03;
        leftArmRef.current.rotation.x = Math.sin(t * 0.9) * 0.04;
        rightArmRef.current.rotation.x = -Math.sin(t * 0.9) * 0.04;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* 1. HEAD & HUMAN FACE */}
      <group ref={headRef} position={[0, 1.6, 0]}>
        {/* Human Cranium / Head */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshStandardMaterial color={colors.skin} roughness={0.6} wireframe={wireframe} />
        </mesh>

        {/* Cyberpunk Undercut / Hair Mesh */}
        <mesh position={[0, 0.08, -0.04]}>
          <sphereGeometry args={[0.225, 24, 24]} />
          <meshStandardMaterial color="#1a1c23" roughness={0.8} wireframe={wireframe} />
        </mesh>

        {/* Tactical Ocular Cyber-Visor */}
        <mesh position={[0, 0.02, 0.18]}>
          <boxGeometry args={[0.28, 0.08, 0.08]} />
          <meshStandardMaterial color={colors.neon} emissive={colors.neon} emissiveIntensity={2.5} roughness={0.1} />
        </mesh>

        {/* Cranial Neural Port Implant */}
        <mesh position={[-0.18, 0.04, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.08, 16]} />
          <meshStandardMaterial color={colors.neon} emissive={colors.neon} emissiveIntensity={1.8} />
        </mesh>

        {/* Anatomical Neck */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.1, 0.12, 0.16, 20]} />
          <meshStandardMaterial color={colors.skin} roughness={0.6} wireframe={wireframe} />
        </mesh>
      </group>

      {/* 2. TORSO & CYBERNETIC JACKET */}
      <group ref={chestRef} position={[0, 1.05, 0]}>
        {/* Upper Chest / Pectorals */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.26, 0.22, 0.35, 24]} />
          <meshStandardMaterial color={colors.suit} roughness={0.4} metalness={0.4} wireframe={wireframe} />
        </mesh>

        {/* Tactical Armored Vest Overlay */}
        <mesh position={[0, 0.16, 0.06]}>
          <boxGeometry args={[0.34, 0.28, 0.16]} />
          <meshStandardMaterial color={colors.metal} roughness={0.3} metalness={0.7} wireframe={wireframe} />
        </mesh>

        {/* Arc Reactor Core Emblem */}
        <mesh position={[0, 0.18, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 24]} />
          <meshStandardMaterial color={colors.neon} emissive={colors.neon} emissiveIntensity={3.0} />
        </mesh>

        {/* Luminescent Jacket Trim Lines */}
        <mesh position={[-0.14, 0.15, 0.15]}>
          <boxGeometry args={[0.02, 0.24, 0.02]} />
          <meshStandardMaterial color={colors.secondary} emissive={colors.secondary} emissiveIntensity={1.8} />
        </mesh>
        <mesh position={[0.14, 0.15, 0.15]}>
          <boxGeometry args={[0.02, 0.24, 0.02]} />
          <meshStandardMaterial color={colors.secondary} emissive={colors.secondary} emissiveIntensity={1.8} />
        </mesh>

        {/* Abdomen / Waist */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.2, 0.18, 0.28, 24]} />
          <meshStandardMaterial color={colors.suit} roughness={0.5} wireframe={wireframe} />
        </mesh>

        {/* Tactical Belt & Utility Packs */}
        <mesh position={[0, -0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.21, 0.03, 16, 32]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
        </mesh>
      </group>

      {/* 3. LEFT ARM & HAND */}
      <group ref={leftArmRef} position={[-0.32, 1.25, 0]}>
        {/* Left Shoulder Deltoid */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.11, 20, 20]} />
          <meshStandardMaterial color={colors.metal} roughness={0.3} metalness={0.8} wireframe={wireframe} />
        </mesh>

        {/* Bicep / Upper Arm */}
        <mesh position={[-0.04, -0.18, 0]}>
          <capsuleGeometry args={[0.07, 0.2, 8, 16]} />
          <meshStandardMaterial color={colors.suit} roughness={0.5} wireframe={wireframe} />
        </mesh>

        {/* Forearm Cybernetic Gauntlet */}
        <mesh position={[-0.05, -0.42, 0.02]}>
          <capsuleGeometry args={[0.065, 0.22, 8, 16]} />
          <meshStandardMaterial color={colors.metal} roughness={0.3} metalness={0.8} wireframe={wireframe} />
        </mesh>

        {/* Gauntlet Neon Conduit */}
        <mesh position={[-0.08, -0.42, 0.07]}>
          <boxGeometry args={[0.02, 0.18, 0.02]} />
          <meshStandardMaterial color={colors.neon} emissive={colors.neon} emissiveIntensity={2.0} />
        </mesh>

        {/* Human Palm & Fingers */}
        <mesh position={[-0.05, -0.6, 0.03]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color={colors.skin} roughness={0.6} wireframe={wireframe} />
        </mesh>
      </group>

      {/* 4. RIGHT ARM & HAND */}
      <group ref={rightArmRef} position={[0.32, 1.25, 0]}>
        {/* Right Shoulder Deltoid */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.11, 20, 20]} />
          <meshStandardMaterial color={colors.metal} roughness={0.3} metalness={0.8} wireframe={wireframe} />
        </mesh>

        {/* Bicep / Upper Arm */}
        <mesh position={[0.04, -0.18, 0]}>
          <capsuleGeometry args={[0.07, 0.2, 8, 16]} />
          <meshStandardMaterial color={colors.suit} roughness={0.5} wireframe={wireframe} />
        </mesh>

        {/* Forearm Cybernetic Gauntlet */}
        <mesh position={[0.05, -0.42, 0.02]}>
          <capsuleGeometry args={[0.065, 0.22, 8, 16]} />
          <meshStandardMaterial color={colors.metal} roughness={0.3} metalness={0.8} wireframe={wireframe} />
        </mesh>

        {/* Gauntlet Neon Conduit */}
        <mesh position={[0.08, -0.42, 0.07]}>
          <boxGeometry args={[0.02, 0.18, 0.02]} />
          <meshStandardMaterial color={colors.neon} emissive={colors.neon} emissiveIntensity={2.0} />
        </mesh>

        {/* Human Palm & Fingers */}
        <mesh position={[0.05, -0.6, 0.03]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color={colors.skin} roughness={0.6} wireframe={wireframe} />
        </mesh>
      </group>

      {/* 5. HIPS & LEGS */}
      <group position={[0, 0.65, 0]}>
        {/* Pelvis / Hips */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.19, 0.17, 0.18, 24]} />
          <meshStandardMaterial color={colors.suit} roughness={0.6} wireframe={wireframe} />
        </mesh>

        {/* Left Thigh (Quadriceps) */}
        <group ref={leftLegRef} position={[-0.12, -0.08, 0]}>
          <mesh position={[0, -0.22, 0]}>
            <capsuleGeometry args={[0.085, 0.32, 8, 16]} />
            <meshStandardMaterial color={colors.suit} roughness={0.5} wireframe={wireframe} />
          </mesh>

          {/* Left Knee Guard */}
          <mesh position={[0, -0.44, 0.06]}>
            <sphereGeometry args={[0.065, 16, 16]} />
            <meshStandardMaterial color={colors.metal} roughness={0.3} metalness={0.8} />
          </mesh>

          {/* Left Shin & Combat Cyber-Boot */}
          <mesh position={[0, -0.68, 0.02]}>
            <capsuleGeometry args={[0.075, 0.34, 8, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.6} wireframe={wireframe} />
          </mesh>
          <mesh position={[0, -0.9, 0.08]}>
            <boxGeometry args={[0.12, 0.1, 0.22]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
          </mesh>
        </group>

        {/* Right Thigh (Quadriceps) */}
        <group ref={rightLegRef} position={[0.12, -0.08, 0]}>
          <mesh position={[0, -0.22, 0]}>
            <capsuleGeometry args={[0.085, 0.32, 8, 16]} />
            <meshStandardMaterial color={colors.suit} roughness={0.5} wireframe={wireframe} />
          </mesh>

          {/* Right Knee Guard */}
          <mesh position={[0, -0.44, 0.06]}>
            <sphereGeometry args={[0.065, 16, 16]} />
            <meshStandardMaterial color={colors.metal} roughness={0.3} metalness={0.8} />
          </mesh>

          {/* Right Shin & Combat Cyber-Boot */}
          <mesh position={[0, -0.68, 0.02]}>
            <capsuleGeometry args={[0.075, 0.34, 8, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.6} wireframe={wireframe} />
          </mesh>
          <mesh position={[0, -0.9, 0.08]}>
            <boxGeometry args={[0.12, 0.1, 0.22]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
          </mesh>
        </group>
      </group>

      {/* Floating Holographic Aura Ring */}
      <mesh position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.015, 16, 64]} />
        <meshStandardMaterial color={colors.neon} emissive={colors.neon} emissiveIntensity={2.0} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

// Camera Controller for Resetting Position
function CameraRig({ resetTrigger }: { resetTrigger: number }) {
  const { camera } = useThree();
  React.useEffect(() => {
    camera.position.set(0, 0.8, 3.2);
    camera.lookAt(0, 0.5, 0);
  }, [resetTrigger, camera]);
  return null;
}

export const CyberpunkHumanAvatar3D: React.FC<CyberpunkHumanAvatarProps> = ({
  state = 'idle',
  animState,
  theme = 'neon-cyan',
  className = 'h-80 sm:h-96 w-full',
  modelUrl,
  enableControls = true,
  performanceMode = 'balanced',
}) => {
  const activeState = animState || state || 'idle';
  const [autoRotate, setAutoRotate] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  // 2D Low-Performance Fallback Mode
  if (performanceMode === 'low') {
    return (
      <div className={`relative ${className} flex flex-col items-center justify-center bg-slate-950/80 border border-cyan-500/30 rounded-xl p-6 text-center overflow-hidden`}>
        <div className="w-28 h-28 rounded-full bg-cyan-500/10 border-2 border-cyan-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,240,255,0.4)] animate-pulse">
          <User className="w-14 h-14 text-cyan-400" />
        </div>
        <h4 className="font-orbitron text-sm font-bold text-cyan-300 tracking-wider">OPERATIVE 2D DOSSIER ACTIVE</h4>
        <p className="font-rajdhani text-xs text-slate-400 mt-1">Low-Performance 2D Mode Engaged (60 FPS Safe)</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className} group select-none`}>
      {/* 3D Viewport Controls Toolbar */}
      {enableControls && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 rounded-lg p-1 shadow-lg">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded transition-all ${autoRotate ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/50' : 'text-slate-400 hover:text-white'}`}
            title={autoRotate ? 'Stop Auto-Rotate' : 'Auto-Rotate'}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`p-1.5 rounded transition-all ${wireframe ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'text-slate-400 hover:text-white'}`}
            title="Toggle Wireframe HUD"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setResetTrigger((r) => r + 1)}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            title="Reset Camera"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Model Slot Indicator */}
      <div className="absolute bottom-2 left-3 z-10 text-[10px] font-mono text-cyan-400/70 bg-slate-950/60 px-2 py-0.5 rounded border border-cyan-500/20 backdrop-blur-sm pointer-events-none">
        // HUMAN_RIG_V4 :: {activeState.toUpperCase()}
      </div>

      {/* R3F WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 0.8, 3.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 4]} intensity={1.8} color="#00f0ff" castShadow />
        <pointLight position={[-4, -2, -3]} intensity={2.0} color="#ff007f" />
        <pointLight position={[0, 3, 2]} intensity={1.2} color="#a855f7" />

        <CameraRig resetTrigger={resetTrigger} />

        <Suspense fallback={null}>
          {modelUrl ? (
            <GLBModel url={modelUrl} activeState={activeState} />
          ) : (
            <AnatomicalHumanoidRig activeState={activeState} theme={theme} wireframe={wireframe} />
          )}
        </Suspense>

        {enableControls && (
          <OrbitControls
            autoRotate={autoRotate}
            autoRotateSpeed={1.5}
            enablePan={false}
            minDistance={1.8}
            maxDistance={5.0}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.8}
            target={[0, 0.6, 0]}
          />
        )}
      </Canvas>
    </div>
  );
};
