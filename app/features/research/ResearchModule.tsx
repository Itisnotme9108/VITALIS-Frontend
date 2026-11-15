import React from 'react';
import { FlaskConical, Download, BarChart3, Database, FileSpreadsheet } from 'lucide-react';
import { TechnicalPanel, ProvenanceBadge } from '@/app/components/common/CommonUI';
import { VitalisButton } from '@/app/components/common/VitalisButton';
import type { PhysiologicalSnapshot } from '@/app/types/telemetry';

export interface ResearchModuleProps {
  snapshot: PhysiologicalSnapshot;
}

export const ResearchModule: React.FC<ResearchModuleProps> = ({ snapshot }) => {
  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(snapshot, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `vitalis-telemetry-snapshot-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Value,Unit,Provenance,Status\n' +
      `HeartRate,${snapshot.heartRate.value},${snapshot.heartRate.unit},${snapshot.heartRate.provenance},${snapshot.heartRate.status}\n` +
      `SpO2,${snapshot.bloodOxygenSpO2.value},${snapshot.bloodOxygenSpO2.unit},${snapshot.bloodOxygenSpO2.provenance},${snapshot.bloodOxygenSpO2.status}\n` +
      `RespirationRate,${snapshot.respiratoryRate.value},${snapshot.respiratoryRate.unit},${snapshot.respiratoryRate.provenance},${snapshot.respiratoryRate.status}\n` +
      `BloodPressureSystolic,${snapshot.bloodPressureSystolic.value},mmHg,${snapshot.bloodPressureSystolic.provenance},${snapshot.bloodPressureSystolic.status}\n` +
      `CoreTemperature,${snapshot.coreTemperature.value},${snapshot.coreTemperature.unit},${snapshot.coreTemperature.provenance},${snapshot.coreTemperature.status}\n` +
      `CardiacOutput,${snapshot.cardiacOutput.value},${snapshot.cardiacOutput.unit},${snapshot.cardiacOutput.provenance},${snapshot.cardiacOutput.status}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vitalis-telemetry-metrics-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 font-mono select-none bg-[#050813]">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-100 tracking-wider uppercase flex items-center gap-2">
            <FlaskConical className="text-cyan-400" size={16} />
            PHYSIOLOGICAL RESEARCH & BIO-STATISTICAL ANALYSIS
          </h2>
          <p className="text-[10px] text-slate-400">
            Cohort comparative telemetry, microgravity longitudinal models, and scientific export
          </p>
        </div>
        <div className="flex items-center gap-2">
          <VitalisButton size="sm" variant="outline" onClick={exportCSV}>
            <FileSpreadsheet size={13} />
            EXPORT CSV
          </VitalisButton>
          <VitalisButton size="sm" variant="cyan" onClick={exportJSON}>
            <Download size={13} />
            EXPORT JSON
          </VitalisButton>
        </div>
      </div>

      {/* Active Clinical Protocols */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] text-cyan-400 font-bold uppercase">PROTOCOL 01 // CVD</span>
            <span className="text-[9px] bg-cyan-950 border border-cyan-500/50 text-cyan-300 px-1">ACTIVE</span>
          </div>
          <h4 className="text-xs font-bold text-slate-100 mb-1">Cardiac Remodeling in 0-G</h4>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Evaluates myocardial mass changes and cephalad vascular remodeling during 180-day
            isolation.
          </p>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] text-emerald-400 font-bold uppercase">PROTOCOL 02 // SANS</span>
            <span className="text-[9px] bg-emerald-950 border border-emerald-500/50 text-emerald-300 px-1">ENROLLED</span>
          </div>
          <h4 className="text-xs font-bold text-slate-100 mb-1">Optic Sheath ICP Dynamics</h4>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Correlates non-invasive intracranial pressure metrics with orbital optic fundus OCT scans.
          </p>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] text-purple-400 font-bold uppercase">PROTOCOL 03 // RAD</span>
            <span className="text-[9px] bg-purple-950 border border-purple-500/50 text-purple-300 px-1">ACTIVE</span>
          </div>
          <h4 className="text-xs font-bold text-slate-100 mb-1">Deep Space Cytogenomics</h4>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Measures DNA repair enzyme kinetics and chromosomal stability against GCR particle flux.
          </p>
        </div>
      </div>

      <TechnicalPanel title="BIO-STATISTICAL VARIANCE DISTRIBUTION" subtitle="COHORT MODEL">
        <div className="space-y-3 text-xs">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Subject AST-8942-J physiological variance is tracked against historical astronaut
            cohorts (N=68 ISS long-duration crewmembers). All vital parameters currently sit within
            the 95% confidence interval for nominal microgravity adaptation.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
            <div className="p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block">Z-Score (Heart Rate):</span>
              <span className="text-cyan-300 font-bold">+0.42 σ [NOMINAL]</span>
            </div>
            <div className="p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block">Z-Score (Mean Arterial P):</span>
              <span className="text-cyan-300 font-bold">+0.18 σ [NOMINAL]</span>
            </div>
            <div className="p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block">Z-Score (Bone Turnover):</span>
              <span className="text-amber-400 font-bold">+0.95 σ [WATCHED]</span>
            </div>
            <div className="p-2 bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block">Z-Score (Cognitive Speed):</span>
              <span className="text-emerald-400 font-bold">+0.05 σ [OPTIMAL]</span>
            </div>
          </div>
        </div>
      </TechnicalPanel>
    </div>
  );
};
