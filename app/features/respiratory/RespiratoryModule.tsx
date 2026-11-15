import React from 'react';
import { Wind, Activity, Gauge } from 'lucide-react';
import { TechnicalPanel, MetricTile, ProvenanceBadge } from '@/app/components/common/CommonUI';
import { Oscilloscope } from '@/app/components/common/Oscilloscope';
import { VitalisButton } from '@/app/components/common/VitalisButton';
import type { PhysiologicalSnapshot } from '@/app/types/telemetry';

export interface RespiratoryModuleProps {
  snapshot: PhysiologicalSnapshot;
  onFocusLungsAnatomy: () => void;
}

export const RespiratoryModule: React.FC<RespiratoryModuleProps> = ({
  snapshot,
  onFocusLungsAnatomy
}) => {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 font-mono select-none bg-[#050813]">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-100 tracking-wider uppercase flex items-center gap-2">
            <Wind className="text-cyan-400" size={16} />
            RESPIRATORY SURVEILLANCE & PULMONARY MECHANICS
          </h2>
          <p className="text-[10px] text-slate-400">
            End-tidal capnography, ventilation-perfusion kinetics, and alveolar gas exchange
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ProvenanceBadge provenance={snapshot.provenance} />
          <VitalisButton size="sm" variant="cyan" onClick={onFocusLungsAnatomy}>
            INSPECT LUNGS IN 3D
          </VitalisButton>
        </div>
      </div>

      <Oscilloscope type="PPG" height={120} label="END-TIDAL CAPNOGRAPHY WAVEFORM · CO2 INFRARED" color="#00e5bc" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <MetricTile
          label="RESPIRATORY RATE"
          value={snapshot.respiratoryRate.value}
          unit="br/min"
          status={snapshot.respiratoryRate.status}
          provenance={snapshot.respiratoryRate.provenance}
          nominalRange={snapshot.respiratoryRate.nominalRange}
        />
        <MetricTile
          label="END-TIDAL CO2"
          value={snapshot.endTidalCO2.value}
          unit="mmHg"
          status={snapshot.endTidalCO2.status}
          provenance={snapshot.endTidalCO2.provenance}
          nominalRange={snapshot.endTidalCO2.nominalRange}
        />
        <MetricTile
          label="TIDAL VOLUME"
          value={snapshot.tidalVolume.value}
          unit="mL"
          status={snapshot.tidalVolume.status}
          provenance={snapshot.tidalVolume.provenance}
          nominalRange={snapshot.tidalVolume.nominalRange}
        />
        <MetricTile
          label="MINUTE VENTILATION"
          value={snapshot.minuteVentilation.value}
          unit="L/min"
          status={snapshot.minuteVentilation.status}
          provenance={snapshot.minuteVentilation.provenance}
          nominalRange={snapshot.minuteVentilation.nominalRange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TechnicalPanel title="ALVEOLAR GAS EXCHANGE KINETICS" subtitle="SURVEILLANCE">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Ventilation / Perfusion (V/Q):</span>
              <span className="text-cyan-300 font-bold">0.88 [MATCHED]</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Alveolar-Arterial O2 Gradient:</span>
              <span className="text-emerald-400 font-bold">9.2 mmHg [NORMAL]</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Dynamic Lung Compliance:</span>
              <span className="text-slate-200 font-bold">62 mL/cmH2O</span>
            </div>
          </div>
        </TechnicalPanel>

        <TechnicalPanel title="AIRWAY RESISTANCE IN MICROGRAVITY" subtitle="RESEARCH NOTES">
          <div className="space-y-2 text-xs text-slate-300">
            <p className="text-[11px] leading-relaxed text-slate-400">
              Absence of hydrostatic gradient eliminates gravitational ventilation inhomogeneity.
              Minor cephalad shift of diaphragm at rest does not compromise inspiratory capacity.
            </p>
            <div className="p-2 bg-slate-900 border border-slate-800 flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Peak Expiratory Flow (PEF):</span>
              <span className="text-cyan-300 font-bold">580 L/min</span>
            </div>
          </div>
        </TechnicalPanel>
      </div>
    </div>
  );
};
