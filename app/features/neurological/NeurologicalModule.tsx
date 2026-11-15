import React from 'react';
import { Brain, Cpu, Activity, Eye, Zap } from 'lucide-react';
import { TechnicalPanel, MetricTile, ProvenanceBadge } from '@/app/components/common/CommonUI';
import { VitalisButton } from '@/app/components/common/VitalisButton';
import type { PhysiologicalSnapshot } from '@/app/types/telemetry';

export interface NeurologicalModuleProps {
  snapshot: PhysiologicalSnapshot;
  onFocusBrainAnatomy: () => void;
}

export const NeurologicalModule: React.FC<NeurologicalModuleProps> = ({
  snapshot,
  onFocusBrainAnatomy
}) => {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 font-mono select-none bg-[#050813]">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-100 tracking-wider uppercase flex items-center gap-2">
            <Brain className="text-cyan-400" size={16} />
            NEUROLOGICAL MONITORING & CEREBRAL PERFUSION
          </h2>
          <p className="text-[10px] text-slate-400">
            Quantitative EEG spectral power, intracranial pressure dynamics, and SANS risk index
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ProvenanceBadge provenance={snapshot.provenance} />
          <VitalisButton size="sm" variant="cyan" onClick={onFocusBrainAnatomy}>
            INSPECT BRAIN IN 3D
          </VitalisButton>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <MetricTile
          label="INTRACRANIAL PRESSURE"
          value={snapshot.intracranialPressure.value}
          unit="mmHg"
          status={snapshot.intracranialPressure.status}
          provenance={snapshot.intracranialPressure.provenance}
          nominalRange={snapshot.intracranialPressure.nominalRange}
        />
        <MetricTile
          label="CEREBRAL PERFUSION"
          value={snapshot.cerebralPerfusionPressure.value}
          unit="mmHg"
          status={snapshot.cerebralPerfusionPressure.status}
          provenance={snapshot.cerebralPerfusionPressure.provenance}
          nominalRange={snapshot.cerebralPerfusionPressure.nominalRange}
        />
        <MetricTile
          label="COGNITIVE WORKLOAD"
          value={snapshot.cognitiveWorkloadIndex.value}
          unit="%"
          status={snapshot.cognitiveWorkloadIndex.status}
          provenance={snapshot.cognitiveWorkloadIndex.provenance}
          nominalRange={snapshot.cognitiveWorkloadIndex.nominalRange}
        />
        <MetricTile
          label="ALPHA SYNCHRONY"
          value={snapshot.eegAlphaPower.value}
          unit="µV²"
          status={snapshot.eegAlphaPower.status}
          provenance={snapshot.eegAlphaPower.provenance}
          nominalRange={snapshot.eegAlphaPower.nominalRange}
        />
      </div>

      {/* EEG Band Spectrum Analysis */}
      <TechnicalPanel title="QUANTITATIVE EEG SPECTRAL BANDS" subtitle="16-CH SENSOR">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-1">DELTA (0.5 - 4 Hz)</span>
            <span className="text-xl font-bold text-slate-100">{snapshot.eegDeltaPower.value} µV²</span>
            <span className="text-[9px] text-slate-400 block mt-1">Deep sleep / Slow wave</span>
          </div>
          <div className="p-3 bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-1">THETA (4 - 8 Hz)</span>
            <span className="text-xl font-bold text-slate-100">{snapshot.eegThetaPower.value} µV²</span>
            <span className="text-[9px] text-slate-400 block mt-1">Drowsiness / Memory access</span>
          </div>
          <div className="p-3 bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-1">ALPHA (8 - 13 Hz)</span>
            <span className="text-xl font-bold text-cyan-400">{snapshot.eegAlphaPower.value} µV²</span>
            <span className="text-[9px] text-slate-400 block mt-1">Relaxed alertness [ACTIVE]</span>
          </div>
          <div className="p-3 bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-1">BETA (13 - 30 Hz)</span>
            <span className="text-xl font-bold text-emerald-400">{snapshot.eegBetaPower.value} µV²</span>
            <span className="text-[9px] text-slate-400 block mt-1">Active cognitive focus</span>
          </div>
        </div>
      </TechnicalPanel>

      {/* SANS Spaceflight Syndrome Surveillance */}
      <TechnicalPanel
        title="SPACEFLIGHT-ASSOCIATED NEURO-OCULAR SYNDROME (SANS)"
        subtitle="ORBITAL PROTOCOL"
        borderGlow
      >
        <div className="space-y-2 text-xs text-slate-300">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Persistent cephalad fluid shift increases venous pressure in head and neck, potentially
            altering optic disc morphology and retinal nerve fiber layer (RNFL) thickness over
            long-duration space missions.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Optic Nerve Sheath Diam:</span>
              <span className="text-cyan-300 font-bold">5.2 mm (Threshold &lt; 5.8 mm)</span>
            </div>
            <div className="p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Choroidal Folds:</span>
              <span className="text-emerald-400 font-bold">NONE DETECTED</span>
            </div>
            <div className="p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Near Visual Acuity:</span>
              <span className="text-slate-100 font-bold">20/20 UNCORRECTED</span>
            </div>
          </div>
        </div>
      </TechnicalPanel>
    </div>
  );
};
