import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { evaluateDeviceCompatibility } from './device-compatibility';
import { CompatibilityRestrictedPage } from './CompatibilityRestrictedPage';
import type { CompatibilityAssessmentResult } from './compatibility-types';

// Lazy load VitalisApp so that heavy Three.js scene dependencies,
// binary 3D model loaders, and telemetry engines are NOT imported or initialized
// until the environment passes the device compatibility assessment!
const VitalisApp = lazy(() => import('@/app/page'));

export interface CompatibilityGateProps {
  children?: React.ReactNode;
}

export const CompatibilityGate: React.FC<CompatibilityGateProps> = () => {
  // Synchronously compute initial assessment to avoid any layout flash
  const [assessment, setAssessment] = useState<CompatibilityAssessmentResult>(() =>
    evaluateDeviceCompatibility()
  );

  const performEvaluation = useCallback(() => {
    const nextResult = evaluateDeviceCompatibility();
    setAssessment((prev) => {
      // Only trigger state update if status or dimensions have changed
      if (
        prev.isCompatible === nextResult.isCompatible &&
        prev.status === nextResult.status &&
        prev.diagnostics.viewportWidth === nextResult.diagnostics.viewportWidth &&
        prev.diagnostics.viewportHeight === nextResult.diagnostics.viewportHeight &&
        prev.reasons.length === nextResult.reasons.length
      ) {
        return prev;
      }
      return nextResult;
    });
  }, []);

  useEffect(() => {
    let timeoutId: number | null = null;

    const handleResize = () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      // 150ms debounce for resize and orientation change
      timeoutId = window.setTimeout(() => {
        performEvaluation();
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Initial check verification in case orientation or dimensions shifted during load
    performEvaluation();

    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [performEvaluation]);

  // If the browsing environment does not satisfy workstation requirements,
  // render the dedicated restricted page and NEVER initialize or expose VitalisApp.
  if (!assessment.isCompatible) {
    return (
      <CompatibilityRestrictedPage
        result={assessment}
        onRecheck={performEvaluation}
      />
    );
  }

  // When compatible, mount the full VITALIS research platform
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#040711] text-cyan-400 font-mono flex items-center justify-center p-4">
          <div className="flex items-center gap-3 p-4 bg-slate-950 border border-slate-800">
            <span className="w-2 h-2 bg-cyan-400 animate-ping rounded-none" />
            <span className="text-xs font-bold tracking-widest uppercase">
              INITIALIZING VITALIS WORKSPACE...
            </span>
          </div>
        </div>
      }
    >
      <VitalisApp />
    </Suspense>
  );
};
