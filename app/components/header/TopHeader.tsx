import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Activity,
  Radio,
  User,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { VitalisButton } from '@/app/components/common/VitalisButton';
import { ProvenanceBadge } from '@/app/components/common/CommonUI';
import {
  isSoundEnabled,
  setSoundEnabled,
  subscribeSoundChange
} from '@/app/services/interaction-sound';
import type { DataProvenance } from '@/app/types/telemetry';

export interface TopHeaderProps {
  provenance: DataProvenance;
  onProvenanceChange: (prov: DataProvenance) => void;
  missionElapsedTime: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  provenance,
  onProvenanceChange,
  missionElapsedTime
}) => {
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    setSoundOn(isSoundEnabled());
    const unsubscribe = subscribeSoundChange((enabled) => setSoundOn(enabled));
    return unsubscribe;
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSound = () => {
    setSoundEnabled(!soundOn);
  };

  return (
    <header className="h-14 bg-[#050914] border-b border-slate-800 text-slate-200 px-4 flex items-center justify-between select-none z-30 shrink-0">
      {/* Left: Branding and Mission Identity */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-cyan-950/80 border border-cyan-400 flex items-center justify-center text-cyan-300 font-mono font-black text-sm tracking-tighter shadow-[0_0_10px_rgba(0,240,255,0.2)]">
            V
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-extrabold tracking-widest text-slate-100 uppercase">
                VITALIS
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-cyan-950 border border-cyan-500/60 text-cyan-400 font-semibold uppercase">
                BIO-OS v2.4
              </span>
            </div>
            <p className="font-mono text-[9px] text-slate-400 tracking-wider uppercase hidden sm:block">
              Physiological Surveillance & Human Atlas Platform
            </p>
          </div>
        </div>

        <div className="h-6 w-[1px] bg-slate-800 hidden md:block" />

        {/* Mission Designation */}
        <div className="hidden lg:flex flex-col font-mono text-[10px]">
          <span className="text-slate-400 tracking-wider">EXPEDITION // ORBIT-ANALOG L4</span>
          <span className="text-cyan-400 font-bold tracking-widest">{missionElapsedTime}</span>
        </div>
      </div>

      {/* Center: System Status and Telemetry Provenance */}
      <div className="flex items-center gap-3">
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 bg-slate-900/90 border border-slate-800 font-mono text-[11px]">
          <ShieldCheck size={13} className="text-emerald-400" />
          <span className="text-slate-400">TELEMETRY LINK:</span>
          <span className="text-emerald-400 font-bold">NOMINAL [BUFFER 100%]</span>
        </div>

        {/* Data Source Provenance Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 p-0.5">
          <span className="font-mono text-[9px] text-slate-400 px-1.5 uppercase hidden sm:inline">
            SOURCE:
          </span>
          <VitalisButton
            size="sm"
            variant={provenance === 'SIMULATED' ? 'primary' : 'ghost'}
            active={provenance === 'SIMULATED'}
            onClick={() => onProvenanceChange('SIMULATED')}
            title="Deterministic Biological Simulation"
            className="text-[9px] h-6 px-2"
          >
            SIM
          </VitalisButton>
          <VitalisButton
            size="sm"
            variant={provenance === 'SAMPLE' ? 'secondary' : 'ghost'}
            active={provenance === 'SAMPLE'}
            onClick={() => onProvenanceChange('SAMPLE')}
            title="Static Clinical Baseline Sample"
            className="text-[9px] h-6 px-2"
          >
            SAMPLE
          </VitalisButton>
          <VitalisButton
            size="sm"
            variant={provenance === 'LIVE' ? 'cyan' : 'ghost'}
            active={provenance === 'LIVE'}
            onClick={() => onProvenanceChange('LIVE')}
            title="Physical Bio-Hardware Link (ESP32 / BLE)"
            className="text-[9px] h-6 px-2"
          >
            LIVE [ESP32]
          </VitalisButton>
        </div>
      </div>

      {/* Right: Sound, Clock, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Timestamp */}
        <div className="hidden md:flex flex-col items-end font-mono text-[10px] tabular-nums">
          <span className="text-slate-400">{currentTime.split(' ')[0]}</span>
          <span className="text-slate-200 font-bold">{currentTime.split(' ')[1]} UTC</span>
        </div>

        {/* Mechanical Switch Audio Feedback Toggle */}
        <VitalisButton
          size="sm"
          variant={soundOn ? 'outline' : 'ghost'}
          onClick={toggleSound}
          title={soundOn ? 'Mechanical Audio Feedback: ENABLED' : 'Mechanical Audio Feedback: MUTED'}
          className={`h-8 px-2.5 font-mono text-[10px] gap-1.5 ${
            soundOn ? 'text-cyan-400 border-cyan-500/50' : 'text-slate-500'
          }`}
        >
          {soundOn ? <Volume2 size={14} className="text-cyan-400" /> : <VolumeX size={14} />}
          <span className="hidden sm:inline">{soundOn ? 'AUDIO' : 'MUTED'}</span>
        </VitalisButton>

        {/* Researcher / CMO Identity */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-7 h-7 bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300">
            <User size={14} />
          </div>
          <div className="hidden sm:flex flex-col font-mono text-[9px] leading-tight">
            <span className="font-bold text-slate-200">DR. E. VANCE</span>
            <span className="text-slate-400">CHIEF MEDICAL OFF.</span>
          </div>
        </div>
      </div>
    </header>
  );
};
