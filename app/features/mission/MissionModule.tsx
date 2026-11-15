import React from 'react';
import { Radio, Satellite, Globe2, ShieldCheck, Clock, Wifi } from 'lucide-react';
import { TechnicalPanel, ProvenanceBadge } from '@/app/components/common/CommonUI';
import { VitalisButton } from '@/app/components/common/VitalisButton';

export interface MissionModuleProps {
  missionElapsedTime: string;
}

export const MissionModule: React.FC<MissionModuleProps> = ({ missionElapsedTime }) => {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 font-mono select-none bg-[#050813]">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-100 tracking-wider uppercase flex items-center gap-2">
            <Radio className="text-cyan-400" size={16} />
            MISSION MONITORING & ORBITAL TELEMETRY LINK
          </h2>
          <p className="text-[10px] text-slate-400">
            Ground station pass tracking, communication link latency, and EVA suit telemetry
          </p>
        </div>
        <ProvenanceBadge provenance="SAMPLE" />
      </div>

      {/* Mission Clock Card */}
      <div className="p-4 bg-slate-900 border border-cyan-500/50 relative overflow-hidden">
        <span className="absolute -top-[1px] -left-[1px] w-2 h-2 bg-cyan-400" />
        <span className="absolute -top-[1px] -right-[1px] w-2 h-2 bg-cyan-400" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-cyan-400 tracking-widest font-bold uppercase block mb-1">
              MISSION ELAPSED TIME (MET)
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-100 tracking-wider tabular-nums">
              {missionElapsedTime}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              EXPEDITION BIO-IV · TRANSIT SIMULATION L-4 · CREW SURVEILLANCE NOMINAL
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-950 border border-slate-800 text-center">
              <span className="text-[9px] text-slate-400 block">ORBITS COMPLETED</span>
              <span className="text-base font-bold text-cyan-400">672</span>
            </div>
            <div className="p-2 bg-slate-950 border border-slate-800 text-center">
              <span className="text-[9px] text-slate-400 block">STATION ALTITUDE</span>
              <span className="text-base font-bold text-emerald-400">408.4 km</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TechnicalPanel title="GROUND STATION TRACKING PASSES" subtitle="TDRS NETWORK">
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800 items-center">
              <div>
                <span className="text-slate-100 font-bold block">TDRS-East (Ku-Band)</span>
                <span className="text-[10px] text-slate-400">Elevation 48° · Azimuth 122°</span>
              </div>
              <span className="text-emerald-400 font-bold text-[11px]">LOCKED [100% QUALITY]</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800 items-center">
              <div>
                <span className="text-slate-100 font-bold block">White Sands Ground Complex</span>
                <span className="text-[10px] text-slate-400">Next Acquisition of Signal (AOS): 18 min</span>
              </div>
              <span className="text-cyan-400 font-bold text-[11px]">STANDBY</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800 items-center">
              <div>
                <span className="text-slate-100 font-bold block">Madrid Deep Space Relay</span>
                <span className="text-[10px] text-slate-400">Loss of Signal (LOS): +44 min</span>
              </div>
              <span className="text-slate-400 text-[11px]">SCHEDULED</span>
            </div>
          </div>
        </TechnicalPanel>

        <TechnicalPanel title="EVA BIO-SUIT TELEMETRY SUBSYSTEM" subtitle="EMU SUIT 04">
          <div className="space-y-2 text-xs text-slate-300">
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Suit Pressure:</span>
                <span className="text-cyan-300 font-bold">29.6 kPa (4.3 psi)</span>
              </div>
              <div className="p-2 bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Primary O2 Tank:</span>
                <span className="text-emerald-400 font-bold">5,840 kPa [92%]</span>
              </div>
              <div className="p-2 bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Liquid Cooling Loop:</span>
                <span className="text-cyan-300 font-bold">14.8°C Inlet Temp</span>
              </div>
              <div className="p-2 bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Battery Autonomy:</span>
                <span className="text-slate-100 font-bold">6.8 hrs remaining</span>
              </div>
            </div>
            <div className="p-2 bg-slate-950 border border-slate-800 text-[10px] text-slate-400">
              Biometric telemetry from suit patch: HR, SpO2, and skin temperature streams active.
            </div>
          </div>
        </TechnicalPanel>
      </div>
    </div>
  );
};
