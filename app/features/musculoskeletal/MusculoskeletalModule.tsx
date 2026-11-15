import React from 'react';
import { Bone, Activity, Dumbbell, ShieldCheck, Layers } from 'lucide-react';
import { TechnicalPanel, MetricTile, ProvenanceBadge } from '@/app/components/common/CommonUI';
import { VitalisButton } from '@/app/components/common/VitalisButton';
import type { PhysiologicalSnapshot } from '@/app/types/telemetry';

export interface MusculoskeletalModuleProps {
  snapshot: PhysiologicalSnapshot;
  onFocusSkeletonAnatomy: () => void;
}

export const MusculoskeletalModule: React.FC<MusculoskeletalModuleProps> = ({
  snapshot,
  onFocusSkeletonAnatomy
}) => {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 font-mono select-none bg-[#050813]">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-100 tracking-wider uppercase flex items-center gap-2">
            <Bone className="text-cyan-400" size={16} />
            MUSCULOSKELETAL INTEGRITY & COUNTERMEASURES
          </h2>
          <p className="text-[10px] text-slate-400">
            Microgravity osteopenia mitigation, postural muscle atrophy surveillance, and spinal elongation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ProvenanceBadge provenance={snapshot.provenance} />
          <VitalisButton size="sm" variant="cyan" onClick={onFocusSkeletonAnatomy}>
            INSPECT SKELETON IN 3D
          </VitalisButton>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <MetricTile
          label="BONE DENSITY INDEX"
          value={snapshot.boneMineralDensityIndex.value}
          unit="T-eq"
          status={snapshot.boneMineralDensityIndex.status}
          provenance={snapshot.boneMineralDensityIndex.provenance}
        />
        <MetricTile
          label="MUSCLE TONE"
          value={snapshot.muscleToneIndex.value}
          unit="% baseline"
          status={snapshot.muscleToneIndex.status}
          provenance={snapshot.muscleToneIndex.provenance}
        />
        <MetricTile
          label="EMG RMS ACTIVATION"
          value={snapshot.emgActivityLevel.value}
          unit="µV"
          status={snapshot.emgActivityLevel.status}
          provenance={snapshot.emgActivityLevel.provenance}
        />
        <MetricTile
          label="JOINT STRESS SCORE"
          value={snapshot.jointStressScore.value}
          unit="/100"
          status={snapshot.jointStressScore.status}
          provenance={snapshot.jointStressScore.provenance}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TechnicalPanel title="MICROGRAVITY SPINAL DECOMPRESSION" subtitle="SPINE KINEMATICS">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Intervertebral Disc Hydration:</span>
              <span className="text-cyan-300 font-bold">+18% ABOVE TERRESTRIAL</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Stature Elongation:</span>
              <span className="text-slate-200 font-bold">+4.2 cm (STABLE)</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Paraspinal Muscle Tone:</span>
              <span className="text-emerald-400 font-bold">NOMINAL (DAILY ARED PROTOCOL)</span>
            </div>
          </div>
        </TechnicalPanel>

        <TechnicalPanel title="EXERCISE PROTOCOL ADHERENCE" subtitle="ARED & T2 TREADMILL">
          <div className="space-y-2 text-xs text-slate-300">
            <div className="p-2 bg-slate-900 border border-slate-800">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Target Loading Completed:</span>
                <span className="text-cyan-400 font-bold">96% (2.5 hrs/day)</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 overflow-hidden">
                <div className="h-full bg-cyan-400 w-[96%]" />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              High-intensity resistance squats and deadlifts successfully maintaining femoral neck
              and lumbar L1-L4 bone mineral density within protocol limits.
            </p>
          </div>
        </TechnicalPanel>
      </div>
    </div>
  );
};
