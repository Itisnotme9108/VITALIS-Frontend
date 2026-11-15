import React from 'react';
import { FileText, UserCheck, ShieldCheck, Clock, Calendar } from 'lucide-react';
import { TechnicalPanel, ProvenanceBadge } from '@/app/components/common/CommonUI';
import { VitalisButton } from '@/app/components/common/VitalisButton';

export const MedicalHistoryModule: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 font-mono select-none bg-[#050813]">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-100 tracking-wider uppercase flex items-center gap-2">
            <FileText className="text-cyan-400" size={16} />
            ASTRONAUT HEALTH RECORDS & MEDICAL DOSSIER
          </h2>
          <p className="text-[10px] text-slate-400">
            Longitudinal baseline records, flight qualification history, and countermeasure compliance
          </p>
        </div>
        <ProvenanceBadge provenance="SAMPLE" />
      </div>

      {/* Subject Bio Card */}
      <div className="p-3 bg-slate-900 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 block">SUBJECT DESIGNATION</span>
          <span className="text-slate-100 font-bold">CDR. AST-8942-J</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block">FLIGHT CERTIFICATION</span>
          <span className="text-emerald-400 font-bold">CLASS 1 LONG-DURATION EXPEDITION</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block">BLOOD TYPE / Rh</span>
          <span className="text-slate-200 font-bold">O-NEGATIVE (UNIVERSAL DONOR)</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block">KNOWN CONTRAINDICATIONS</span>
          <span className="text-slate-200 font-bold">NONE (NKDA)</span>
        </div>
      </div>

      {/* Baseline vs Current Matrix */}
      <TechnicalPanel title="PRE-FLIGHT TERRESTRIAL BASELINE COMPARISON" subtitle="LONGITUDINAL DELTA">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] text-slate-400">
                <th className="py-2 px-3">PARAMETER</th>
                <th className="py-2 px-3">PRE-FLIGHT BASELINE (L-30)</th>
                <th className="py-2 px-3">CURRENT ORBITAL VALUE</th>
                <th className="py-2 px-3">DELTA</th>
                <th className="py-2 px-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              <tr>
                <td className="py-2 px-3 text-slate-100 font-bold">Resting Heart Rate</td>
                <td className="py-2 px-3">64 bpm</td>
                <td className="py-2 px-3">71 bpm</td>
                <td className="py-2 px-3 text-cyan-400">+7 bpm</td>
                <td className="py-2 px-3 text-emerald-400">NOMINAL EXPECTED</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-100 font-bold">Blood Pressure</td>
                <td className="py-2 px-3">116 / 74 mmHg</td>
                <td className="py-2 px-3">118 / 76 mmHg</td>
                <td className="py-2 px-3 text-cyan-400">+2 / +2 mmHg</td>
                <td className="py-2 px-3 text-emerald-400">STABLE</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-100 font-bold">Bone Mineral Density (Femur)</td>
                <td className="py-2 px-3">1.02 T-score</td>
                <td className="py-2 px-3">0.96 T-score</td>
                <td className="py-2 px-3 text-amber-400">-5.8%</td>
                <td className="py-2 px-3 text-amber-400">MITIGATED BY ARED</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-100 font-bold">Stature Height</td>
                <td className="py-2 px-3">181.5 cm</td>
                <td className="py-2 px-3">185.7 cm</td>
                <td className="py-2 px-3 text-cyan-400">+4.2 cm</td>
                <td className="py-2 px-3 text-emerald-400">SPINAL DECOMPRESSION</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-100 font-bold">Red Blood Cell Mass</td>
                <td className="py-2 px-3">2,450 mL</td>
                <td className="py-2 px-3">2,220 mL</td>
                <td className="py-2 px-3 text-slate-400">-9.3%</td>
                <td className="py-2 px-3 text-emerald-400">SPACE PSEUDO-ANEMIA STABLE</td>
              </tr>
            </tbody>
          </table>
        </div>
      </TechnicalPanel>

      {/* Clinical Notes & Countermeasures */}
      <TechnicalPanel title="CHIEF MEDICAL OFFICER CLINICAL LOG" subtitle="EXPEDITION FLIGHT LOG">
        <div className="space-y-2 text-xs">
          <div className="p-2.5 bg-slate-900 border-l-2 border-cyan-400 space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span className="text-cyan-400 font-bold">MET 041:12:00:00 · ROUTINE TELE-MED CHECK</span>
              <span>DR. E. VANCE (CMO)</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Subject demonstrates excellent cardiovascular reserve. Resistance exercise adherence
              at 96%. Intraocular pressure and optic disc fundoscopy normal. No cognitive fatigue or
              sleep fragmentation reported. Countermeasures protocol continued unchanged.
            </p>
          </div>
        </div>
      </TechnicalPanel>
    </div>
  );
};
