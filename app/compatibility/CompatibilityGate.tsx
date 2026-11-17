
import React, {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { evaluateDeviceCompatibility } from './device-compatibility';
import { CompatibilityRestrictedPage } from './CompatibilityRestrictedPage';
import type { CompatibilityAssessmentResult } from './compatibility-types';

// Load the main VITALIS application only after compatibility passes.
// This keeps Three.js, Human Atlas and telemetry modules behind the gate.
const VitalisApp = lazy(() => import('@/app/page'));

export interface CompatibilityGateProps {
  children?: React.ReactNode;
}

/**
 * Check whether the environment assessment has meaningfully changed.
 * evaluatedAt is intentionally excluded because it changes on every check.
 */
function hasAssessmentChanged(
  previous: CompatibilityAssessmentResult,
  next: CompatibilityAssessmentResult,
): boolean {
  return (
    previous.isCompatible !== next.isCompatible ||
    previous.status !== next.status ||
    previous.environmentType !== next.environmentType ||
    previous.diagnostics.viewportWidth !== next.diagnostics.viewportWidth ||
    previous.diagnostics.viewportHeight !== next.diagnostics.viewportHeight ||
    previous.diagnostics.screenWidth !== next.diagnostics.screenWidth ||
    previous.diagnostics.screenHeight !== next.diagnostics.screenHeight ||
    previous.diagnostics.devicePixelRatio !==
    next.diagnostics.devicePixelRatio ||
    previous.diagnostics.isTouchCapable !== next.diagnostics.isTouchCapable ||
    previous.diagnostics.hasFinePointer !== next.diagnostics.hasFinePointer ||
    previous.diagnostics.hasCoarsePointer !==
    next.diagnostics.hasCoarsePointer ||
    previous.diagnostics.hasHoverCapability !==
    next.diagnostics.hasHoverCapability ||
    previous.diagnostics.orientation !== next.diagnostics.orientation ||
    previous.reasons.join('|') !== next.reasons.join('|')
  );
}

export const CompatibilityGate: React.FC<CompatibilityGateProps> = () => {
  // Evaluate synchronously to prevent the main application
  // from briefly appearing before the compatibility check.
  const [assessment, setAssessment] =
    useState<CompatibilityAssessmentResult>(() =>
      evaluateDeviceCompatibility(),
    );

  /**
   * Re-evaluate the current device and browser environment.
   */
  const performEvaluation = useCallback(() => {
    const nextAssessment = evaluateDeviceCompatibility();

    setAssessment((previousAssessment) =>
      hasAssessmentChanged(previousAssessment, nextAssessment)
        ? nextAssessment
        : previousAssessment,
    );
  }, []);

  /**
   * Manage document scrolling.
   *
   * Restricted environment:
   * - Enable vertical document scrolling.
   * - Allow the entire compatibility page to be accessed.
   *
   * Compatible environment:
   * - Remove compatibility-mode.
   * - Preserve the original fixed VITALIS dashboard layout.
   */
  useEffect(() => {
    const rootElement = document.documentElement;

    rootElement.classList.toggle(
      'compatibility-mode',
      !assessment.isCompatible,
    );

    return () => {
      rootElement.classList.remove('compatibility-mode');
    };
  }, [assessment.isCompatible]);

  /**
   * Monitor viewport and orientation changes.
   *
   * No setTimeout is used, avoiding conflicts between
   * browser number and NodeJS.Timeout types.
   */
  useEffect(() => {
    const handleEnvironmentChange = () => {
      performEvaluation();
    };

    window.addEventListener('resize', handleEnvironmentChange);
    window.addEventListener('orientationchange', handleEnvironmentChange);

    // Perform another check after the component mounts.
    performEvaluation();

    return () => {
      window.removeEventListener('resize', handleEnvironmentChange);
      window.removeEventListener(
        'orientationchange',
        handleEnvironmentChange,
      );
    };
  }, [performEvaluation]);

  /**
   * Restricted environment.
   *
   * The main VITALIS application is not rendered here.
   */
  if (!assessment.isCompatible) {
    return (
      <CompatibilityRestrictedPage
        result={assessment}
        onRecheck={performEvaluation}
      />
    );
  }

  /**
   * Compatible environment.
   *
   * Load the complete VITALIS research workspace.
   */
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
