import React from 'react';
import {
  Monitor,
  AlertTriangle,
  RotateCcw,
  Layers,
  Activity,
  Maximize2,
  MousePointer,
  ShieldAlert,
  Compass
} from 'lucide-react';
import { VitalisButton } from '@/app/components/common/VitalisButton';
import type { CompatibilityAssessmentResult, RestrictionReasonCode } from './compatibility-types';

export interface CompatibilityRestrictedPageProps {
  result: CompatibilityAssessmentResult;
  onRecheck?: () => void;
}

const REASON_DESCRIPTIONS: Record<RestrictionReasonCode, string> = {
  INSUFFICIENT_VIEWPORT_WIDTH:
    'Available viewport width is below the 1024px minimum required for multi-column telemetry.',
  INSUFFICIENT_VIEWPORT_HEIGHT:
    'Available viewport height is below the 640px minimum required for anatomical visualization.',
  MOBILE_DEVICE_DETECTED:
    'A mobile smartphone environment was detected. VITALIS requires workstation display space.',
  MOBILE_DESKTOP_MODE_DETECTED:
    'Mobile browser desktop-mode detected. Physical display area is insufficient for dashboard operation.',
  PORTRAIT_ORIENTATION_UNSUITABLE:
    'Portrait display aspect ratio cannot accommodate simultaneous sidebar and 3D anatomy workspaces.',
  TOUCH_WORKSPACE_INSUFFICIENT:
    'Touch-only environment with insufficient workspace. Precision workstation pointer recommended.'
};

export const CompatibilityRestrictedPage: React.FC<CompatibilityRestrictedPageProps> = ({
  result,
  onRecheck
}) => {
  const { diagnostics, minRequiredWidth, minRequiredHeight, reasons } = result;

  return (
    <div className="min-h-screen w-full bg-[#040711] text-slate-100 font-mono select-none flex flex-col justify-between p-4 sm:p-6 md:p-10 relative vitalis-grid-bg">
      {/* Precision corner brackets on entire screen */}
      <span className="fixed top-3 left-3 w-4 h-4 border-t border-l border-cyan-400/50 pointer-events-none" />
      <span className="fixed top-3 right-3 w-4 h-4 border-t border-r border-cyan-400/50 pointer-events-none" />
      <span className="fixed bottom-3 left-3 w-4 h-4 border-b border-l border-cyan-400/50 pointer-events-none" />
      <span className="fixed bottom-3 right-3 w-4 h-4 border-b border-r border-cyan-400/50 pointer-events-none" />

      {/* Top Banner / System Identification */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-950/80 border border-cyan-400 flex items-center justify-center text-cyan-300 font-black text-sm tracking-tighter shadow-[0_0_10px_rgba(0,240,255,0.2)]">
            V
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold tracking-widest text-slate-100 uppercase">
                PROJECT VITALIS
              </span>
              <span className="text-[9px] px-1.5 py-0.2 bg-slate-900 border border-slate-700 text-slate-300 uppercase">
                GATE // BIO-OS
              </span>
            </div>
            <p className="text-[9px] text-slate-400 tracking-wider uppercase">
              Astronaut Physiological Surveillance & Human Atlas Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-950/60 border border-amber-500/70 text-amber-300 text-[10px] font-bold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 bg-amber-400 animate-pulse rounded-none" />
            ACCESS RESTRICTED
          </span>
          <span className="text-[10px] text-slate-400 hidden sm:inline">
            [ERR_ENV_COMPAT_GATE]
          </span>
        </div>
      </header>

      {/* Main Restriction Card */}
      <main className="my-auto py-8 max-w-4xl mx-auto w-full">
        <div className="bg-[#070c18]/95 border border-slate-800 relative p-6 sm:p-8 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          {/* Accent corner notches */}
          <span className="absolute -top-[1px] -left-[1px] w-2 h-2 bg-cyan-400" />
          <span className="absolute -top-[1px] -right-[1px] w-2 h-2 bg-cyan-400" />
          <span className="absolute -bottom-[1px] -left-[1px] w-2 h-2 bg-cyan-400" />
          <span className="absolute -bottom-[1px] -right-[1px] w-2 h-2 bg-cyan-400" />

          {/* Heading Section */}
          <div className="mb-6 pb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-1.5">
              <Monitor size={15} />
              DEVICE COMPATIBILITY ASSESSMENT
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 uppercase mb-3">
              WORKSTATION REQUIRED
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              The current VITALIS interface is engineered for desktop-class display environments.
              Your current browsing environment does not meet the recommended compatibility
              requirements for real-time astronaut physiological monitoring and 3D anatomical
              surveillance.
            </p>
          </div>

          {/* Technical Restriction Reasons Grid */}
          <div className="mb-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
              <ShieldAlert size={12} className="text-cyan-400" />
              ARCHITECTURAL COMPATIBILITY REQUIREMENTS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-900/80 border border-slate-800/80 flex gap-3">
                <Maximize2 size={18} className="text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-200 text-xs uppercase mb-1">
                    1. Display Workspace
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    The interface requires sufficient screen space for dense dual-sidebar navigation,
                    14 functional telemetry modules, and active clinical alert bands.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-800/80 flex gap-3">
                <Layers size={18} className="text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-200 text-xs uppercase mb-1">
                    2. Anatomical Visualization
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Human Atlas WebGL rendering of 2,234 indexed anatomical meshes, shader buffers,
                    and exploded inventory layouts requires an unconstrained spatial canvas.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-800/80 flex gap-3">
                <Activity size={18} className="text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-200 text-xs uppercase mb-1">
                    3. Monitoring Interface
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Simultaneous multi-lead ECG oscilloscopes, qEEG band powers, and respiratory
                    kinetics require adequate horizontal width to avoid data clipping.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-800/80 flex gap-3">
                <MousePointer size={18} className="text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-200 text-xs uppercase mb-1">
                    4. Interaction Precision
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Sub-millimeter organ picking, tactile control-panel switches, and 3D camera
                    orbit controls are optimized around a workstation pointer interaction model.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Environment Diagnostics Summary Card */}
          <div className="p-4 bg-slate-950 border border-slate-800/90 mb-6 text-xs font-mono">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400 uppercase">
              <span className="font-bold text-slate-300">DETECTED ENVIRONMENT DIAGNOSTICS</span>
              <span className="text-cyan-400">TELEMETRY PRE-FLIGHT CHECK</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-[11px] mb-3">
              <div>
                <span className="text-[9px] text-slate-400 block uppercase">CURRENT VIEWPORT</span>
                <span
                  className={`font-bold tabular-nums ${diagnostics.viewportWidth < minRequiredWidth ||
                    diagnostics.viewportHeight < minRequiredHeight
                    ? 'text-rose-400'
                    : 'text-emerald-400'
                    }`}
                >
                  {diagnostics.viewportWidth} × {diagnostics.viewportHeight} px
                </span>
              </div>

              <div>
                <span className="text-[9px] text-slate-400 block uppercase">MINIMUM REQUIRED</span>
                <span className="font-bold text-slate-200 tabular-nums">
                  {minRequiredWidth} × {minRequiredHeight} px
                </span>
              </div>

              <div>
                <span className="text-[9px] text-slate-400 block uppercase">PHYSICAL SCREEN</span>
                <span className="font-bold text-slate-300 tabular-nums">
                  {diagnostics.screenWidth} × {diagnostics.screenHeight} px (DPR {diagnostics.devicePixelRatio})
                </span>
              </div>

              <div>
                <span className="text-[9px] text-slate-400 block uppercase">INPUT INTERFACE</span>
                <span className="font-bold text-slate-300">
                  {diagnostics.hasFinePointer
                    ? 'Fine Pointer (Mouse)'
                    : diagnostics.isTouchCapable
                      ? 'Touch / Coarse'
                      : 'Standard'}
                </span>
              </div>
            </div>

            {/* Identified Reason Tags */}
            {reasons.length > 0 && (
              <div className="pt-2 border-t border-slate-800/60 space-y-1">
                <span className="text-[9px] text-slate-400 uppercase block font-semibold">
                  ASSESSMENT RESTRICTION CODES:
                </span>
                <div className="space-y-1">
                  {reasons.map((code) => (
                    <div
                      key={code}
                      className="flex items-start gap-2 text-[10px] text-amber-300/90 leading-tight"
                    >
                      <span className="text-amber-400 font-bold shrink-0">[{code}]:</span>
                      <span>{REASON_DESCRIPTIONS[code]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recommendation and Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div>
              <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider block mb-0.5">
                RECOMMENDED ACTION
              </span>
              <p className="text-xs text-slate-300">
                Please access Project VITALIS using a compatible desktop computer, laptop, or widescreen
                workstation display.
              </p>
            </div>

            {onRecheck && (
              <VitalisButton
                variant="primary"
                size="md"
                onClick={onRecheck}
                className="shrink-0 text-xs px-4"
              >
                <RotateCcw size={13} />
                RE-EVALUATE ENVIRONMENT
              </VitalisButton>
            )}
          </div>
        </div>
      </main>

      {/* Footer / Attribution */}
      <footer className="pt-4 border-t border-slate-800 text-[10px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Compass size={12} className="text-cyan-400" />
          <span>PROJECT VITALIS // EXPEDITION BIO-TELEMETRY & REFERENCE HUMAN ATLAS</span>
        </div>
        <div className="flex items-center gap-3">
          <span>MINIMUM WORKSPACE: 1024 × 640 PX</span>
          <span>·</span>
          <span>BODYPARTS3D 4.0 INTEGRATION</span>
        </div>
      </footer>
    </div>
  );
};
