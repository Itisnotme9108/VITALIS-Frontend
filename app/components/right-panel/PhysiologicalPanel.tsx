import React from 'react';
import {
  Heart,
  Activity,
  Wind,
  Thermometer,
  Focus,
  Maximize2,
  X,
  ExternalLink,
  ShieldCheck,
  Info,
  Clock
} from 'lucide-react';
import { VitalisButton } from '@/app/components/common/VitalisButton';
import { TechnicalPanel, MetricTile, ProvenanceBadge } from '@/app/components/common/CommonUI';
import { Oscilloscope } from '@/app/components/common/Oscilloscope';
import type { PhysiologicalSnapshot } from '@/app/types/telemetry';
import { SYSTEMS, explanation, type Concept, type Part, type SystemId } from '@/app/anatomy';

export interface PhysiologicalPanelProps {
  snapshot: PhysiologicalSnapshot;
  selectedConcept: Concept | null;
  selectedPart: Part | null;
  selectedPartsCount: number;
  isIsolated: boolean;
  onToggleIsolate: () => void;
  onClearSelection: () => void;
  onSelectOrganPreset?: (name: string) => void;
}

export const PhysiologicalPanel: React.FC<PhysiologicalPanelProps> = ({
  snapshot,
  selectedConcept,
  selectedPart,
  selectedPartsCount,
  isIsolated,
  onToggleIsolate,
  onClearSelection,
  onSelectOrganPreset
}) => {
  const currentSystem = selectedPart
    ? SYSTEMS.find((s) => s.id === selectedPart.system)
    : null;

  // Match selected structure to organ-specific telemetry if available
  const organKey = selectedConcept
    ? Object.keys(snapshot.organMetrics).find((key) =>
        selectedConcept.name.toLowerCase().includes(key)
      )
    : null;

  const organData = organKey ? snapshot.organMetrics[organKey] : null;

  return (
    <aside
      className="w-80 md:w-88 h-full bg-[#050813] border-l border-slate-800 flex flex-col select-none shrink-0 overflow-hidden"
      aria-label="Physiological Surveillance Data"
    >
      {/* Panel Top Header */}
      <div className="h-10 border-b border-slate-800/80 px-3 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-cyan-400" />
          <span className="font-mono text-xs font-bold tracking-widest text-slate-200 uppercase">
            {selectedConcept ? 'ANATOMICAL LOCUS' : 'BIO-TELEMETRY STREAM'}
          </span>
        </div>
        <ProvenanceBadge provenance={snapshot.provenance} size="xs" />
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {/* Context A: Structure Selected in 3D Anatomy */}
        {selectedConcept ? (
          <div className="space-y-3 animate-fadeIn">
            {/* Structure Identification Card */}
            <div className="p-3 bg-slate-900/90 border border-cyan-500/40 rounded-none relative">
              <span className="absolute -top-[1px] -left-[1px] w-1.5 h-1.5 bg-cyan-400" />
              <span className="absolute -top-[1px] -right-[1px] w-1.5 h-1.5 bg-cyan-400" />

              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="font-mono text-[9px] uppercase px-1.5 py-0.5 border"
                  style={{
                    borderColor: currentSystem?.color || '#00f0ff',
                    color: currentSystem?.color || '#00f0ff',
                    backgroundColor: `${currentSystem?.color || '#00f0ff'}15`
                  }}
                >
                  SYSTEM: {currentSystem?.name || 'ANATOMY'}
                </span>
                <VitalisButton
                  size="icon"
                  variant="ghost"
                  onClick={onClearSelection}
                  className="h-5 w-5 text-slate-400 hover:text-slate-100"
                  title="Clear Selection"
                >
                  <X size={12} />
                </VitalisButton>
              </div>

              <h2 className="font-mono text-base font-bold text-slate-100 tracking-tight capitalize mb-1">
                {selectedConcept.name}
              </h2>

              <p className="font-mono text-[11px] text-slate-300 leading-relaxed">
                {selectedPart
                  ? explanation(selectedConcept.name, selectedPart.system)
                  : currentSystem?.description}
              </p>

              <div className="mt-2.5 pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 font-mono text-[10px]">
                <div>
                  <span className="text-slate-400 block text-[9px]">FMA CONCEPT:</span>
                  <span className="text-cyan-300 font-bold">{selectedConcept.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">INDEXED MESHES:</span>
                  <span className="text-slate-200 font-bold">
                    {selectedPartsCount.toLocaleString()} {selectedPartsCount === 1 ? 'part' : 'parts'}
                  </span>
                </div>
              </div>

              {/* 3D Action Controls */}
              <div className="mt-3 flex gap-2">
                <VitalisButton
                  variant={isIsolated ? 'cyan' : 'primary'}
                  size="sm"
                  onClick={onToggleIsolate}
                  className="flex-1 text-[10px] h-7"
                >
                  <Focus size={13} />
                  {isIsolated ? 'RESTORE ATLAS' : 'ISOLATE IN 3D'}
                </VitalisButton>
                <VitalisButton
                  variant="secondary"
                  size="sm"
                  onClick={onClearSelection}
                  className="text-[10px] h-7 px-2.5"
                >
                  DESELECT
                </VitalisButton>
              </div>
            </div>

            {/* Organ Specific Physiological Correlate */}
            {organData && (
              <TechnicalPanel
                title="ORGAN FUNCTIONAL CORRELATE"
                subtitle="ACTIVE SENSING"
                borderGlow
              >
                <div className="space-y-2">
                  <div className="p-2 bg-slate-900 border border-slate-800">
                    <span className="font-mono text-[9px] text-slate-400 block">
                      {organData.primaryMetricName.toUpperCase()}
                    </span>
                    <span className="font-mono text-lg font-bold text-cyan-400">
                      {organData.primaryMetricValue}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-900 border border-slate-800">
                    <span className="font-mono text-[9px] text-slate-400 block">
                      {organData.secondaryMetricName.toUpperCase()}
                    </span>
                    <span className="font-mono text-xs font-semibold text-emerald-400">
                      {organData.secondaryMetricValue}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-950/70 border-l-2 border-cyan-400 font-mono text-[10px] text-slate-300 leading-snug">
                    <span className="text-cyan-400 font-bold block mb-0.5">RESEARCH LOG:</span>
                    {organData.researchNote}
                  </div>
                </div>
              </TechnicalPanel>
            )}

            {/* Quick Internal Organ Selector */}
            <div className="p-2.5 bg-slate-900/60 border border-slate-800">
              <span className="font-mono text-[9px] text-slate-400 tracking-wider uppercase block mb-1.5 font-bold">
                PRIORITY CENTRAL ORGANS
              </span>
              <div className="grid grid-cols-3 gap-1">
                {[
                  'Heart',
                  'Liver',
                  'Brain',
                  'Stomach',
                  'Spleen',
                  'Pancreas',
                  'Diaphragm',
                  'Trachea',
                  'Kidney'
                ].map((name) => (
                  <VitalisButton
                    key={name}
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectOrganPreset && onSelectOrganPreset(name)}
                    className="text-[9px] h-6 px-1 truncate"
                  >
                    {name}
                  </VitalisButton>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* Real-time Oscilloscope (Always Active) */}
        <div className="space-y-1">
          <Oscilloscope type="ECG" height={85} label="LEAD II ECG · WAVEFORM" color="#00f0ff" />
        </div>

        {/* Multi-Parameter Vitals Grid */}
        <div className="grid grid-cols-2 gap-2">
          <MetricTile
            label="HEART RATE"
            value={snapshot.heartRate.value}
            unit={snapshot.heartRate.unit}
            status={snapshot.heartRate.status}
            provenance={snapshot.heartRate.provenance}
            nominalRange={snapshot.heartRate.nominalRange}
          />
          <MetricTile
            label="SpO2 SATURATION"
            value={snapshot.bloodOxygenSpO2.value}
            unit={snapshot.bloodOxygenSpO2.unit}
            status={snapshot.bloodOxygenSpO2.status}
            provenance={snapshot.bloodOxygenSpO2.provenance}
            nominalRange={snapshot.bloodOxygenSpO2.nominalRange}
          />
          <MetricTile
            label="RESPIRATION"
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
            label="CORE TEMP"
            value={snapshot.coreTemperature.value}
            unit={snapshot.coreTemperature.unit}
            status={snapshot.coreTemperature.status}
            provenance={snapshot.coreTemperature.provenance}
            nominalRange={snapshot.coreTemperature.nominalRange}
          />
          <MetricTile
            label="CARDIAC OUT"
            value={snapshot.cardiacOutput.value}
            unit={snapshot.cardiacOutput.unit}
            status={snapshot.cardiacOutput.status}
            provenance={snapshot.cardiacOutput.provenance}
            nominalRange={snapshot.cardiacOutput.nominalRange}
          />
        </div>

        {/* Plethysmograph Waveform */}
        <div className="space-y-1">
          <Oscilloscope type="PPG" height={65} label="PULSE OX PLETH · WAVEFORM" color="#00e5bc" />
        </div>

        {/* Clinical Disclaimer & Provenance Notice */}
        <div className="p-2.5 bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Info size={12} />
            <span>DATA PROVENANCE & SAFETY NOTICE</span>
          </div>
          <p className="leading-relaxed">
            Values marked <strong>[SIMULATED]</strong> are derived from deterministic spaceflight
            physiological models for research and UI validation. Not intended for clinical diagnostic
            use.
          </p>
        </div>
      </div>
    </aside>
  );
};
