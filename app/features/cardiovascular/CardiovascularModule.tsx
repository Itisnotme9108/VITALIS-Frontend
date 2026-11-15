import React from 'react';
import { Heart, Activity, Waves, Gauge, ArrowRight } from 'lucide-react';
import { TechnicalPanel, MetricTile, ProvenanceBadge } from '@/app/components/common/CommonUI';
import { Oscilloscope } from '@/app/components/common/Oscilloscope';
import { VitalisButton } from '@/app/components/common/VitalisButton';
import type { PhysiologicalSnapshot } from '@/app/types/telemetry';

export interface CardiovascularModuleProps {
  snapshot: PhysiologicalSnapshot;
  onFocusHeartAnatomy: () => void;
}

export const CardiovascularModule: React.FC<CardiovascularModuleProps> = ({
  snapshot,
  onFocusHeartAnatomy
}) => {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 font-mono select-none bg-[#050813]">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-100 tracking-wider uppercase flex items-center gap-2">
            <Heart className="text-cyan-400" size={16} />
            CARDIOVASCULAR & HEMODYNAMIC SURVEILLANCE
          </h2>
          <p className="text-[10px] text-slate-400">
            Cardiac electrophysiology, stroke volume kinetics, and arterial compliance in microgravity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ProvenanceBadge provenance={snapshot.provenance} />
          <VitalisButton size="sm" variant="cyan" onClick={onFocusHeartAnatomy}>
            INSPECT HEART IN 3D
          </VitalisButton>
        </div>
      </div>

      {/* Main Oscilloscope */}
      <Oscilloscope type="ECG" height={130} label="LEAD II DIAGNOSTIC ECG · BANDPASS 0.05 - 150 Hz" color="#00f0ff" />

      {/* Primary Hemodynamic Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <MetricTile
          label="HEART RATE"
          value={snapshot.heartRate.value}
          unit="bpm"
          status={snapshot.heartRate.status}
          provenance={snapshot.heartRate.provenance}
          nominalRange={snapshot.heartRate.nominalRange}
        />
        <MetricTile
          label="CARDIAC OUTPUT"
          value={snapshot.cardiacOutput.value}
          unit="L/min"
          status={snapshot.cardiacOutput.status}
          provenance={snapshot.cardiacOutput.provenance}
          nominalRange={snapshot.cardiacOutput.nominalRange}
        />
        <MetricTile
          label="STROKE VOLUME"
          value={snapshot.strokeVolume.value}
          unit="mL"
          status={snapshot.strokeVolume.status}
          provenance={snapshot.strokeVolume.provenance}
          nominalRange={snapshot.strokeVolume.nominalRange}
        />
        <MetricTile
          label="VASCULAR RESISTANCE"
          value={snapshot.systemicVascularResistance.value}
          unit="dyn·s/cm⁵"
          status={snapshot.systemicVascularResistance.status}
          provenance={snapshot.systemicVascularResistance.provenance}
          nominalRange={snapshot.systemicVascularResistance.nominalRange}
        />
      </div>

      {/* Detailed Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TechnicalPanel title="HEART RATE VARIABILITY (HRV)" subtitle="AUTONOMIC TONE">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">SDNN (Overall HRV):</span>
              <span className="text-cyan-300 font-bold tabular-nums">48.2 ms [NOMINAL]</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">RMSSD (Parasympathetic):</span>
              <span className="text-emerald-400 font-bold tabular-nums">39.6 ms</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">LF / HF Ratio:</span>
              <span className="text-slate-200 font-bold tabular-nums">1.38 (Sympathovagal Balance)</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Arrhythmia Detection:</span>
              <span className="text-emerald-400 font-bold">ZERO EVENTS (SINUS RHYTHM)</span>
            </div>
          </div>
        </TechnicalPanel>

        <TechnicalPanel title="MICROGRAVITY FLUID SHIFT ADAPTATION" subtitle="SPACE MEDICINE">
          <div className="space-y-2 text-xs text-slate-300">
            <p className="text-[11px] leading-relaxed text-slate-400">
              Cephalad fluid redistribution status: Central venous pressure compensatory response
              stabilized. Left ventricular mass index preserved with daily resistive cycle ergometry.
            </p>
            <div className="p-2 bg-slate-900 border border-slate-800 flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Jugular Venous Distension Index:</span>
              <span className="text-cyan-300 font-bold">GRADE 1 (EXPECTED ORBITAL)</span>
            </div>
            <div className="p-2 bg-slate-900 border border-slate-800 flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Lower Body Negative Pressure Tolerance:</span>
              <span className="text-emerald-400 font-bold">-35 mmHg [PASSED]</span>
            </div>
          </div>
        </TechnicalPanel>
      </div>
    </div>
  );
};
