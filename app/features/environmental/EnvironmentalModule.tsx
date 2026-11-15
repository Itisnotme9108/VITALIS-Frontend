import React from 'react';
import { Compass, Wind, ShieldCheck, Thermometer, Volume2 } from 'lucide-react';
import { TechnicalPanel, MetricTile, ProvenanceBadge } from '@/app/components/common/CommonUI';
import { VitalisButton } from '@/app/components/common/VitalisButton';
import type { PhysiologicalSnapshot } from '@/app/types/telemetry';

export interface EnvironmentalModuleProps {
  snapshot: PhysiologicalSnapshot;
}

export const EnvironmentalModule: React.FC<EnvironmentalModuleProps> = ({ snapshot }) => {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 font-mono select-none bg-[#050813]">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-100 tracking-wider uppercase flex items-center gap-2">
            <Compass className="text-cyan-400" size={16} />
            HABITAT ENVIRONMENTAL CONDITIONS & LIFE SUPPORT
          </h2>
          <p className="text-[10px] text-slate-400">
            Atmospheric composition, trace contaminant monitoring, and life support cabin pressure
          </p>
        </div>
        <ProvenanceBadge provenance={snapshot.cabinPressureKPa.provenance} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <MetricTile
          label="CABIN PRESSURE"
          value={snapshot.cabinPressureKPa.value}
          unit="kPa"
          status={snapshot.cabinPressureKPa.status}
          provenance={snapshot.cabinPressureKPa.provenance}
          nominalRange={snapshot.cabinPressureKPa.nominalRange}
        />
        <MetricTile
          label="O2 PARTIAL PRES"
          value={snapshot.oxygenPartialPressureKPa.value}
          unit="kPa"
          status={snapshot.oxygenPartialPressureKPa.status}
          provenance={snapshot.oxygenPartialPressureKPa.provenance}
          nominalRange={snapshot.oxygenPartialPressureKPa.nominalRange}
        />
        <MetricTile
          label="CO2 LEVEL"
          value={snapshot.carbonDioxidePpm.value}
          unit="ppm"
          status={snapshot.carbonDioxidePpm.status}
          provenance={snapshot.carbonDioxidePpm.provenance}
          nominalRange={snapshot.carbonDioxidePpm.nominalRange}
        />
        <MetricTile
          label="CABIN AMBIENT TEMP"
          value={snapshot.ambientTemperatureCelsius.value}
          unit="°C"
          status={snapshot.ambientTemperatureCelsius.status}
          provenance={snapshot.ambientTemperatureCelsius.provenance}
          nominalRange={snapshot.ambientTemperatureCelsius.nominalRange}
        />
        <MetricTile
          label="HUMIDITY"
          value={snapshot.relativeHumidityPercent.value}
          unit="%"
          status={snapshot.relativeHumidityPercent.status}
          provenance={snapshot.relativeHumidityPercent.provenance}
          nominalRange={snapshot.relativeHumidityPercent.nominalRange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TechnicalPanel title="ATMOSPHERIC SCRUBBING EFFICIENCY" subtitle="CDRA & OGS SUBSYSTEMS">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">CO2 Scrubber Desiccant Bed:</span>
              <span className="text-emerald-400 font-bold">CYCLE B ACTIVE [DESORBING]</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Oxygen Generation Assembly (OGA):</span>
              <span className="text-cyan-300 font-bold">RATE 5.2 kg/day [NOMINAL]</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Volatile Organic Compounds (VOC):</span>
              <span className="text-slate-200 font-bold">&lt; 0.05 mg/m³ [TRACE CLEAR]</span>
            </div>
          </div>
        </TechnicalPanel>

        <TechnicalPanel title="ACOUSTIC ENVIRONMENT & NOISE DOSIMETRY" subtitle="HABITATION MODULE">
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Continuous Ambient Sound:</span>
              <span className="text-cyan-300 font-bold">54.2 dBA (NC-50 Compliant)</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Hearing Protection Protocol:</span>
              <span className="text-slate-200 font-bold">NOT REQUIRED IN CURRENT SLEEP/CREW ZONE</span>
            </div>
          </div>
        </TechnicalPanel>
      </div>
    </div>
  );
};
