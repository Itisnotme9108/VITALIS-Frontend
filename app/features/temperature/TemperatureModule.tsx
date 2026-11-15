import React from 'react';
import { Thermometer, Sun, Snowflake, Activity } from 'lucide-react';
import { TechnicalPanel, MetricTile, ProvenanceBadge } from '@/app/components/common/CommonUI';
import { VitalisButton } from '@/app/components/common/VitalisButton';
import type { PhysiologicalSnapshot } from '@/app/types/telemetry';

export interface TemperatureModuleProps {
  snapshot: PhysiologicalSnapshot;
  onOpenAnatomy: () => void;
}

export const TemperatureModule: React.FC<TemperatureModuleProps> = ({ snapshot, onOpenAnatomy }) => {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 font-mono select-none bg-[#050813]">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-100 tracking-wider uppercase flex items-center gap-2">
            <Thermometer className="text-cyan-400" size={16} />
            THERMOREGULATORY SURVEILLANCE & CORE TEMPERATURE
          </h2>
          <p className="text-[10px] text-slate-400">
            Ingestible capsule telemetry, core-to-shell thermal gradients, and heat dissipation kinetics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ProvenanceBadge provenance={snapshot.provenance} />
          <VitalisButton size="sm" variant="outline" onClick={onOpenAnatomy}>
            INSPECT 3D ANATOMY
          </VitalisButton>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <MetricTile
          label="CORE BODY TEMP"
          value={snapshot.coreTemperature.value}
          unit="°C"
          status={snapshot.coreTemperature.status}
          provenance={snapshot.coreTemperature.provenance}
          nominalRange={snapshot.coreTemperature.nominalRange}
        />
        <MetricTile
          label="SKIN / SHELL TEMP"
          value={snapshot.skinTemperature.value}
          unit="°C"
          status={snapshot.skinTemperature.status}
          provenance={snapshot.skinTemperature.provenance}
          nominalRange={snapshot.skinTemperature.nominalRange}
        />
        <MetricTile
          label="CORE-SHELL DELTA"
          value={parseFloat((snapshot.coreTemperature.value - snapshot.skinTemperature.value).toFixed(2))}
          unit="°C"
          status="NOMINAL"
          provenance={snapshot.coreTemperature.provenance}
        />
        <MetricTile
          label="HEAT FLUX INDEX"
          value="48.5"
          unit="W/m²"
          status="NOMINAL"
          provenance="SAMPLE"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TechnicalPanel title="CIRCADIAN CORE TEMPERATURE CYCLE" subtitle="24-HOUR RHYTHM">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Circadian Acrophase:</span>
              <span className="text-cyan-300 font-bold">16:45 UTC (NORMAL PEAK)</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Circadian Nadir:</span>
              <span className="text-slate-200 font-bold">04:15 UTC (36.4°C)</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Melatonin Onset Phase:</span>
              <span className="text-emerald-400 font-bold">SYNCHRONIZED (ORBITAL DAY/NIGHT)</span>
            </div>
          </div>
        </TechnicalPanel>

        <TechnicalPanel title="SPACE HABITAT THERMAL BURDEN" subtitle="ENVIRONMENTAL COUPLING">
          <div className="space-y-2 text-xs text-slate-300">
            <p className="text-[11px] leading-relaxed text-slate-400">
              In microgravity, convective heat loss is absent without forced air circulation.
              Crew cabin ventilation velocities are maintained at 0.15 m/s to prevent thermal envelope
              heat accumulation.
            </p>
            <div className="p-2 bg-slate-900 border border-slate-800 flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Thermal Comfort Vote (ISO 7730):</span>
              <span className="text-emerald-400 font-bold">NEUTRAL [PMV +0.1]</span>
            </div>
          </div>
        </TechnicalPanel>
      </div>
    </div>
  );
};
