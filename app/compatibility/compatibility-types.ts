/**
 * VITALIS - Device Compatibility Types & Interfaces
 *
 * Defines diagnostic metrics, restriction reasons, and structured assessment
 * results for the Device Compatibility Gate.
 */

export type DeviceEnvironmentType =
  | 'desktop'
  | 'laptop'
  | 'workstation'
  | 'tablet'
  | 'mobile_phone'
  | 'unknown';

export type CompatibilityStatus = 'supported' | 'restricted' | 'warning';

export type RestrictionReasonCode =
  | 'INSUFFICIENT_VIEWPORT_WIDTH'
  | 'INSUFFICIENT_VIEWPORT_HEIGHT'
  | 'MOBILE_DEVICE_DETECTED'
  | 'MOBILE_DESKTOP_MODE_DETECTED'
  | 'PORTRAIT_ORIENTATION_UNSUITABLE'
  | 'TOUCH_WORKSPACE_INSUFFICIENT';

export interface DeviceDiagnostics {
  viewportWidth: number;
  viewportHeight: number;
  screenWidth: number;
  screenHeight: number;
  minScreenDimension: number;
  devicePixelRatio: number;
  isTouchCapable: boolean;
  maxTouchPoints: number;
  hasFinePointer: boolean;
  hasCoarsePointer: boolean;
  hasHoverCapability: boolean;
  orientation: 'portrait' | 'landscape';
  userAgentSnippet: string;
}

export interface CompatibilityAssessmentResult {
  isCompatible: boolean;
  status: CompatibilityStatus;
  environmentType: DeviceEnvironmentType;
  reasons: RestrictionReasonCode[];
  diagnostics: DeviceDiagnostics;
  evaluatedAt: number;
  minRequiredWidth: number;
  minRequiredHeight: number;
}
