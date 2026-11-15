import React from 'react';
import type { DataProvenance } from '@/app/types/telemetry';

export interface TechnicalPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  badge?: string;
  provenance?: DataProvenance;
  actions?: React.ReactNode;
  borderGlow?: boolean;
}

export const TechnicalPanel: React.FC<TechnicalPanelProps> = ({
  title,
  subtitle,
  badge,
  provenance,
  actions,
  children,
  className = '',
  borderGlow = false,
  ...props
}) => {
  return (
    <div
      className={`relative bg-[#070c18]/90 border ${
        borderGlow ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(0,240,255,0.08)]' : 'border-slate-800'
      } rounded-none flex flex-col ${className}`}
      {...props}
    >
      {/* Precision corner brackets */}
      <span className="absolute -top-[1px] -left-[1px] w-1.5 h-1.5 border-t border-l border-cyan-400 pointer-events-none" />
      <span className="absolute -top-[1px] -right-[1px] w-1.5 h-1.5 border-t border-r border-cyan-400 pointer-events-none" />
      <span className="absolute -bottom-[1px] -left-[1px] w-1.5 h-1.5 border-b border-l border-cyan-400 pointer-events-none" />
      <span className="absolute -bottom-[1px] -right-[1px] w-1.5 h-1.5 border-b border-r border-cyan-400 pointer-events-none" />

      {(title || actions || provenance) && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/80 bg-slate-900/60 select-none">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-none shrink-0" />
            {title && (
              <h3 className="font-mono text-xs font-semibold tracking-wider text-slate-200 uppercase truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <span className="font-mono text-[10px] text-slate-400 tracking-wide truncate">
                [{subtitle}]
              </span>
            )}
            {badge && (
              <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-300">
                {badge}
              </span>
            )}
            {provenance && <ProvenanceBadge provenance={provenance} size="xs" />}
          </div>
          {actions && <div className="flex items-center gap-1.5 shrink-0">{actions}</div>}
        </div>
      )}
      <div className="p-3 flex-1 overflow-auto">{children}</div>
    </div>
  );
};

export interface ProvenanceBadgeProps {
  provenance: DataProvenance;
  size?: 'xs' | 'sm';
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({ provenance, size = 'sm' }) => {
  const styles = {
    LIVE: 'bg-emerald-950/70 border-emerald-500/70 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.25)]',
    SIMULATED: 'bg-cyan-950/70 border-cyan-500/70 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.25)]',
    SAMPLE: 'bg-blue-950/70 border-blue-500/70 text-blue-300',
    UNAVAILABLE: 'bg-slate-900 border-slate-700 text-slate-400'
  }[provenance];

  const sizeStyle = size === 'xs' ? 'text-[8px] px-1 py-0' : 'text-[9px] px-1.5 py-0.5';

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono uppercase tracking-widest border rounded-none font-semibold ${styles} ${sizeStyle}`}
      title={`Data Provenance: ${provenance}`}
    >
      <span
        className={`w-1 h-1 rounded-none ${
          provenance === 'LIVE'
            ? 'bg-emerald-400 animate-pulse'
            : provenance === 'SIMULATED'
            ? 'bg-cyan-400'
            : provenance === 'SAMPLE'
            ? 'bg-blue-400'
            : 'bg-slate-500'
        }`}
      />
      {provenance}
    </span>
  );
};

export interface MetricTileProps {
  label: string;
  value: string | number;
  unit?: string;
  provenance?: DataProvenance;
  status?: 'NOMINAL' | 'WARNING' | 'CRITICAL' | 'STABLE' | 'UNAVAILABLE';
  trend?: 'UP' | 'DOWN' | 'STABLE';
  nominalRange?: [number, number];
  onClick?: () => void;
  className?: string;
}

export const MetricTile: React.FC<MetricTileProps> = ({
  label,
  value,
  unit,
  provenance,
  status = 'NOMINAL',
  trend,
  nominalRange,
  onClick,
  className = ''
}) => {
  const statusColor = {
    NOMINAL: 'text-cyan-400 border-slate-800 hover:border-cyan-500/50',
    STABLE: 'text-emerald-400 border-slate-800 hover:border-emerald-500/50',
    WARNING: 'text-amber-400 border-amber-600/50 bg-amber-950/20',
    CRITICAL: 'text-rose-400 border-rose-600 bg-rose-950/30 animate-pulse',
    UNAVAILABLE: 'text-slate-500 border-slate-800'
  }[status];

  return (
    <div
      onClick={onClick}
      className={`relative p-2.5 bg-slate-900/80 border rounded-none font-mono transition-colors select-none ${
        onClick ? 'cursor-pointer hover:bg-slate-800/80' : ''
      } ${statusColor} ${className}`}
    >
      <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider mb-1">
        <span className="truncate pr-1">{label}</span>
        {provenance && <ProvenanceBadge provenance={provenance} size="xs" />}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-xl font-bold tracking-tight text-slate-100 tabular-nums">
          {value}
        </span>
        {unit && <span className="text-xs text-slate-400 font-normal">{unit}</span>}
        {trend && (
          <span className="text-[10px] ml-auto text-slate-400">
            {trend === 'UP' ? '▲' : trend === 'DOWN' ? '▼' : '▬'}
          </span>
        )}
      </div>
      {nominalRange && (
        <div className="mt-1 text-[9px] text-slate-400 tracking-tight">
          REF: {nominalRange[0]}–{nominalRange[1]} {unit}
        </div>
      )}
    </div>
  );
};
