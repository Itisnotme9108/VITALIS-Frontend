import React from 'react';
import { Activity, Heart, Wind, Thermometer, ShieldAlert, Cpu } from 'lucide-react';
import { TechnicalPanel, MetricTile, ProvenanceBadge } from '@/app/components/common/CommonUI';
import { Oscilloscope } from '@/app/components/common/Oscilloscope';
import { VitalisButton } from '@/app/components/common/VitalisButton';
import type { PhysiologicalSnapshot } from '@/app/types/telemetry';

export interface VitalsModuleProps {
  snapshot: PhysiologicalSnapshot;
  onOpenAnatomy: () => void;
}

export const VitalsModule: React.FC<VitalsModuleProps> = ({ snapshot, onOpenAnatomy }) => {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 font-mono select-none bg-[#050813]">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-100 tracking-wider uppercase flex items-center gap-2">
            <Activity className="text-cyan-400" size={16} />
            MULTI-PARAMETER VITAL SIGNS SURVEILLANCE
          </h2>
          <p className="text-[10px] text-slate-400">
            Real-time streaming telemetry with continuous baseline envelope monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ProvenanceBadge provenance={snapshot.provenance} />
          <VitalisButton size="sm" variant="outline" onClick={onOpenAnatomy}>
            INSPECT 3D ANATOMY
          </VitalisButton>
        </div>
      </div>

      {/* Waveform Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Oscilloscope type="ECG" height={110} label="LEAD II ECG · 500 Hz FILTERED" color="#00f0ff" />
        <Oscilloscope type="PPG" height={110} label="PULSE OX PLETHYSMOGRAM · IR 75 Hz" color="#00e5bc" />
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <MetricTile
          label="HEART RATE"
          value={snapshot.heartRate.value}
          unit={snapshot.heartRate.unit}
          status={snapshot.heartRate.status}
          provenance={snapshot.heartRate.provenance}
          nominalRange={snapshot.heartRate.nominalRange}
        />
        <MetricTile
          label="SpO2 SAT"
          value={snapshot.bloodOxygenSpO2.value}
          unit={snapshot.bloodOxygenSpO2.unit}
          status={snapshot.bloodOxygenSpO2.status}
          provenance={snapshot.bloodOxygenSpO2.provenance}
          nominalRange={snapshot.bloodOxygenSpO2.nominalRange}
        />
        <MetricTile
          label="RESP RATE"
          value={snapshot.respiratoryRate.value}
          unit={snapshot.respiratoryRate.unit}
          status={snapshot.respiratoryRate.status}
          provenance={snapshot.respiratoryRate.provenance}
          nominalRange={snapshot.respiratoryRate.nominalRange}
        />
        <MetricTile
          label="BLOOD PRESSURE"
          value={`${snapshot.bloodPressureSystolic.value}/${snapshot.bloodPressureDiastolic.value}`}
          unit="mmHg"
          status={snapshot.bloodPressureSystolic.status}
          provenance={snapshot.bloodPressureSystolic.provenance}
        />
        <MetricTile
          label="MEAN ARTERIAL"
          value={snapshot.meanArterialPressure.value}
          unit="mmHg"
          status="NOMINAL"
          provenance={snapshot.meanArterialPressure.provenance}
          nominalRange={snapshot.meanArterialPressure.nominalRange}
        />
        <MetricTile
          label="CORE TEMP"
          value={snapshot.coreTemperature.value}
          unit={snapshot.coreTemperature.unit}
          status={snapshot.coreTemperature.status}
          provenance={snapshot.coreTemperature.provenance}
          nominalRange={snapshot.coreTemperature.nominalRange}
        />
      </div>

      {/* Clinical Context and Countermeasure Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TechnicalPanel title="PHYSIOLOGICAL STABILITY REPORT" subtitle="SYSTEMIC EVALUATION">
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between items-center p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Cardiovascular Index:</span>
              <span className="text-emerald-400 font-bold">OPTIMAL (CI 3.2 L/min/m²)</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Arterial Oxygenation:</span>
              <span className="text-cyan-400 font-bold">NORMAL (PaO2 96 mmHg eq.)</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Thermoregulation:</span>
              <span className="text-slate-200 font-bold">CORE-SHELL GRADIENT 3.25°C</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Autonomic Balance:</span>
              <span className="text-cyan-300 font-bold">LF/HF RATIO 1.4 (PARASYMPATHETIC NORMAL)</span>
            </div>
          </div>
        </TechnicalPanel>

        <TechnicalPanel title="SAFETY ENVELOPE CONFIGURATION" subtitle="ALARM THRESHOLDS">
          <div className="space-y-1.5 text-[11px] text-slate-300">
            <div className="flex justify-between p-1.5 bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">Heart Rate Low / High:</span>
              <span className="text-slate-200">50 bpm / 120 bpm</span>
            </div>
            <div className="flex justify-between p-1.5 bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">SpO2 Warning Threshold:</span>
              <span className="text-amber-400 font-bold">&lt; 94%</span>
            </div>
            <div className="flex justify-between p-1.5 bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">Systolic Peak Limit:</span>
              <span className="text-slate-200">&gt; 140 mmHg</span>
            </div>
            <div className="flex justify-between p-1.5 bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">Core Temp Tolerance:</span>
              <span className="text-slate-200">36.0°C – 38.0°C</span>
            </div>
          </div>
        </TechnicalPanel>
      </div>
    </div>
  );
};
