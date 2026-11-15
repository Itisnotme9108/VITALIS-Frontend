import React from 'react';
import { Footprints, Activity, Compass, ShieldAlert, Zap } from 'lucide-react';
import { TechnicalPanel, MetricTile, ProvenanceBadge } from '@/app/components/common/CommonUI';
import { VitalisButton } from '@/app/components/common/VitalisButton';
import type { PhysiologicalSnapshot } from '@/app/types/telemetry';

export interface ActivityModuleProps {
  snapshot: PhysiologicalSnapshot;
  onOpenAnatomy: () => void;
}

export const ActivityModule: React.FC<ActivityModuleProps> = ({ snapshot, onOpenAnatomy }) => {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 font-mono select-none bg-[#050813]">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-100 tracking-wider uppercase flex items-center gap-2">
            <Footprints className="text-cyan-400" size={16} />
            BIOMECHANICAL ACTIVITY & RADIATION SURVEILLANCE
          </h2>
          <p className="text-[10px] text-slate-400">
            3-axis inertial measurement, metabolic expenditure, and cumulative space radiation dosage
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
          label="METABOLIC EXPENDITURE"
          value={snapshot.metabolicEquivalentMETs.value}
          unit="METs"
          status={snapshot.metabolicEquivalentMETs.status}
          provenance={snapshot.metabolicEquivalentMETs.provenance}
        />
        <MetricTile
          label="STATION G-FORCE"
          value={snapshot.effectiveGForce}
          unit="g"
          status="NOMINAL"
          provenance="SAMPLE"
        />
        <MetricTile
          label="RADIATION DOSE"
          value={snapshot.cumulativeRadiationDoseMilliSieverts.value}
          unit="mSv"
          status={snapshot.cumulativeRadiationDoseMilliSieverts.status}
          provenance={snapshot.cumulativeRadiationDoseMilliSieverts.provenance}
          nominalRange={snapshot.cumulativeRadiationDoseMilliSieverts.nominalRange}
        />
        <MetricTile
          label="DAILY CALORIES"
          value="2,640"
          unit="kcal"
          status="NOMINAL"
          provenance="SAMPLE"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TechnicalPanel title="3-AXIS INERTIAL SENSOR TELEMETRY" subtitle="CHEST IMU">
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block mb-1">ACCEL X</span>
              <span className="text-lg font-bold text-cyan-400 tabular-nums">
                {snapshot.accelerationX > 0 ? `+${snapshot.accelerationX}` : snapshot.accelerationX} g
              </span>
            </div>
            <div className="p-2.5 bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block mb-1">ACCEL Y</span>
              <span className="text-lg font-bold text-cyan-400 tabular-nums">
                {snapshot.accelerationY > 0 ? `+${snapshot.accelerationY}` : snapshot.accelerationY} g
              </span>
            </div>
            <div className="p-2.5 bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block mb-1">ACCEL Z</span>
              <span className="text-lg font-bold text-cyan-400 tabular-nums">
                {snapshot.accelerationZ > 0 ? `+${snapshot.accelerationZ}` : snapshot.accelerationZ} g
              </span>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-400">
            Angular velocity: Pitch 0.2°/s · Yaw 0.1°/s · Roll 0.0°/s (Microgravity translation)
          </div>
        </TechnicalPanel>

        <TechnicalPanel title="IONIZING RADIATION ACCUMULATION" subtitle="MISSION DOSIMETRY">
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Current Daily Dose Rate:</span>
              <span className="text-cyan-300 font-bold">0.42 mSv / day</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">South Atlantic Anomaly Passes:</span>
              <span className="text-slate-200 font-bold">4 passes / 24 hrs</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Career Dose Margin Remaining:</span>
              <span className="text-emerald-400 font-bold">88.3% WITHIN NASA/ESA LIMITS</span>
            </div>
          </div>
        </TechnicalPanel>
      </div>
    </div>
  );
};
