import React from 'react';
import {
  RotateCcw,
  RotateCw,
  Sliders,
  Layers,
  Radio,
  UserCheck,
  Cpu,
  Eye,
  Maximize2
} from 'lucide-react';
import { VitalisButton } from '@/app/components/common/VitalisButton';
import type { View } from '@/app/anatomy';

export interface BottomControlBarProps {
  explode: number;
  onExplodeChange: (val: number) => void;
  currentView: View;
  onViewChange: (view: View) => void;
  onReset: () => void;
  autoRotate: boolean;
  onToggleRotate: () => void;
  activeMode: 'STREAM' | 'SIM' | 'PLAYBACK';
  onModeChange: (mode: 'STREAM' | 'SIM' | 'PLAYBACK') => void;
  onTorsoFocus: () => void;
}

export const BottomControlBar: React.FC<BottomControlBarProps> = ({
  explode,
  onExplodeChange,
  currentView,
  onViewChange,
  onReset,
  autoRotate,
  onToggleRotate,
  activeMode,
  onModeChange,
  onTorsoFocus
}) => {
  return (
    <footer className="h-13 bg-[#050914] border-t border-slate-800 text-slate-200 px-4 flex items-center justify-between select-none z-20 shrink-0 gap-3">
      {/* Left: Subject / Participant and Telemetry Sync */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 px-2 py-1 bg-slate-900 border border-slate-800 font-mono text-[10px]">
          <UserCheck size={13} className="text-cyan-400" />
          <span className="text-slate-400">SUBJECT:</span>
          <span className="text-slate-100 font-bold">CDR. AST-8942-J</span>
          <span className="text-emerald-400 font-bold">[FIT-FOR-DUTY]</span>
        </div>

        {/* Operational Mode Toggle */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800 p-0.5 font-mono text-[10px]">
          <VitalisButton
            size="sm"
            variant={activeMode === 'STREAM' ? 'primary' : 'ghost'}
            active={activeMode === 'STREAM'}
            onClick={() => onModeChange('STREAM')}
            className="h-6 text-[9px] px-2"
          >
            LIVE STREAM
          </VitalisButton>
          <VitalisButton
            size="sm"
            variant={activeMode === 'SIM' ? 'primary' : 'ghost'}
            active={activeMode === 'SIM'}
            onClick={() => onModeChange('SIM')}
            className="h-6 text-[9px] px-2"
          >
            SIMULATION
          </VitalisButton>
          <VitalisButton
            size="sm"
            variant={activeMode === 'PLAYBACK' ? 'primary' : 'ghost'}
            active={activeMode === 'PLAYBACK'}
            onClick={() => onModeChange('PLAYBACK')}
            className="h-6 text-[9px] px-2"
          >
            PLAYBACK
          </VitalisButton>
        </div>
      </div>

      {/* Center: 3D Anatomical Explode Control & Camera Presets */}
      <div className="flex items-center gap-3 max-w-lg flex-1 justify-center">
        {/* Explode anatomy slider */}
        <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 px-3 py-1 font-mono text-xs flex-1 max-w-xs">
          <Sliders size={13} className="text-cyan-400 shrink-0" />
          <span className="text-[10px] text-slate-400 uppercase hidden sm:inline shrink-0">
            EXPLODE:
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={Math.round(explode * 100)}
            onChange={(e) => onExplodeChange(Number(e.target.value) / 100)}
            className="w-full accent-cyan-400 bg-slate-800 h-1.5 cursor-pointer rounded-none"
            aria-label="Explode Anatomy Slider"
          />
          <span className="text-cyan-400 font-bold tabular-nums text-xs w-8 text-right shrink-0">
            {Math.round(explode * 100)}%
          </span>
        </div>

        {/* Camera Angles */}
        <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-0.5">
          <VitalisButton
            size="sm"
            variant={currentView === 'front' ? 'cyan' : 'ghost'}
            active={currentView === 'front'}
            onClick={() => onViewChange('front')}
            title="Anterior (Front) View"
            className="h-6 px-1.5 text-[10px]"
          >
            F
          </VitalisButton>
          <VitalisButton
            size="sm"
            variant={currentView === 'side' ? 'cyan' : 'ghost'}
            active={currentView === 'side'}
            onClick={() => onViewChange('side')}
            title="Lateral (Side) View"
            className="h-6 px-1.5 text-[10px]"
          >
            S
          </VitalisButton>
          <VitalisButton
            size="sm"
            variant={currentView === 'back' ? 'cyan' : 'ghost'}
            active={currentView === 'back'}
            onClick={() => onViewChange('back')}
            title="Posterior (Back) View"
            className="h-6 px-1.5 text-[10px]"
          >
            B
          </VitalisButton>
          <VitalisButton
            size="sm"
            variant={currentView === 'three-quarter' ? 'cyan' : 'ghost'}
            active={currentView === 'three-quarter'}
            onClick={() => onViewChange('three-quarter')}
            title="¾ Perspective View"
            className="h-6 px-1.5 text-[10px]"
          >
            ¾
          </VitalisButton>
          <VitalisButton
            size="sm"
            variant="outline"
            onClick={onTorsoFocus}
            title="Focus Camera on Torso & Central Organs"
            className="h-6 px-2 text-[9px] text-cyan-300 border-cyan-500/50"
          >
            TORSO
          </VitalisButton>
        </div>

        {/* Auto Rotate & Reset */}
        <div className="flex items-center gap-1">
          <VitalisButton
            size="icon"
            variant={autoRotate ? 'cyan' : 'secondary'}
            onClick={onToggleRotate}
            title={autoRotate ? 'Pause Rotation' : 'Auto-Rotate Anatomy'}
            className="h-7 w-7 text-xs"
          >
            <RotateCw size={13} className={autoRotate ? 'animate-spin' : ''} />
          </VitalisButton>
          <VitalisButton
            size="icon"
            variant="secondary"
            onClick={onReset}
            title="Reset Anatomy Camera & View"
            className="h-7 w-7 text-xs"
          >
            <RotateCcw size={13} />
          </VitalisButton>
        </div>
      </div>

      {/* Right: Telemetry Link Health */}
      <div className="hidden md:flex items-center gap-3 font-mono text-[10px]">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Radio size={12} className="text-emerald-400 animate-pulse" />
          <span>SYNC: <strong className="text-slate-200">100%</strong></span>
          <span className="text-slate-400">|</span>
          <span>PKT LOSS: <strong className="text-emerald-400">0.00%</strong></span>
        </div>
      </div>
    </footer>
  );
};
