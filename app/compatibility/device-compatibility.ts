/**
 * VITALIS - Device Compatibility Assessment Engine
 *
 * Implements a multi-signal heuristic evaluation to determine whether the client's
 * browsing environment provides sufficient workspace and input precision for the
 * desktop-oriented VITALIS biomedical monitoring dashboard.
 */

import type {
  CompatibilityAssessmentResult,
  DeviceDiagnostics,
  DeviceEnvironmentType,
  RestrictionReasonCode
} from './compatibility-types';

export const MIN_VIEWPORT_WIDTH = 1024;
export const MIN_VIEWPORT_HEIGHT = 640;
export const MIN_PHYSICAL_SCREEN_DIMENSION = 540;

export interface EvaluationContext {
  innerWidth?: number;
  innerHeight?: number;
  screenWidth?: number;
  screenHeight?: number;
  devicePixelRatio?: number;
  maxTouchPoints?: number;
  userAgent?: string;
  hasFinePointer?: boolean;
  hasCoarsePointer?: boolean;
  hasHoverCapability?: boolean;
}

/**
 * Extracts raw diagnostics from the window and navigator objects or an explicit context.
 */
export function extractDeviceDiagnostics(ctx?: EvaluationContext): DeviceDiagnostics {
  const hasWindow = typeof window !== 'undefined';
  const hasNavigator = typeof navigator !== 'undefined';
  const hasScreen = hasWindow && typeof window.screen !== 'undefined';

  const viewportWidth =
    ctx?.innerWidth ?? (hasWindow ? window.innerWidth || document.documentElement.clientWidth || 0 : 0);
  const viewportHeight =
    ctx?.innerHeight ?? (hasWindow ? window.innerHeight || document.documentElement.clientHeight || 0 : 0);

  const screenWidth = ctx?.screenWidth ?? (hasScreen ? window.screen.width : viewportWidth);
  const screenHeight = ctx?.screenHeight ?? (hasScreen ? window.screen.height : viewportHeight);
  const minScreenDimension = Math.min(screenWidth, screenHeight);

  const devicePixelRatio = ctx?.devicePixelRatio ?? (hasWindow ? window.devicePixelRatio || 1 : 1);
  const maxTouchPoints =
    ctx?.maxTouchPoints ?? (hasNavigator ? navigator.maxTouchPoints || 0 : 0);

  const isTouchCapable = maxTouchPoints > 0;

  let hasFinePointer = ctx?.hasFinePointer ?? false;
  let hasCoarsePointer = ctx?.hasCoarsePointer ?? false;
  let hasHoverCapability = ctx?.hasHoverCapability ?? false;

  if (hasWindow && window.matchMedia) {
    if (ctx?.hasFinePointer === undefined) {
      hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    }
    if (ctx?.hasCoarsePointer === undefined) {
      hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    }
    if (ctx?.hasHoverCapability === undefined) {
      hasHoverCapability = window.matchMedia('(hover: hover)').matches;
    }
  }

  const orientation: 'portrait' | 'landscape' =
    viewportWidth >= viewportHeight ? 'landscape' : 'portrait';

  const userAgentSnippet = ctx?.userAgent ?? (hasNavigator ? navigator.userAgent : 'Unknown');

  return {
    viewportWidth,
    viewportHeight,
    screenWidth,
    screenHeight,
    minScreenDimension,
    devicePixelRatio,
    isTouchCapable,
    maxTouchPoints,
    hasFinePointer,
    hasCoarsePointer,
    hasHoverCapability,
    orientation,
    userAgentSnippet
  };
}

/**
 * Evaluates the current browsing environment using multiple combined signals.
 *
 * Rules:
 * 1. Viewport width must be >= MIN_VIEWPORT_WIDTH (1024px).
 * 2. Viewport height must be >= MIN_VIEWPORT_HEIGHT (640px).
 * 3. Mobile phone hardware (screen physical dimension < 540px or mobile UA) is restricted.
 * 4. Mobile desktop-site mode is detected through physical screen dimensions and coarse input constraints.
 * 5. Touch capability ALONE never rejects a device (touchscreen laptops and desktops are fully supported).
 * 6. Tablets in landscape orientation are supported if they meet the 1024x640 workspace minimum.
 */
export function evaluateDeviceCompatibility(ctx?: EvaluationContext): CompatibilityAssessmentResult {
  const diagnostics = extractDeviceDiagnostics(ctx);
  const reasons: RestrictionReasonCode[] = [];

  const {
    viewportWidth,
    viewportHeight,
    minScreenDimension,
    userAgentSnippet,
    isTouchCapable,
    maxTouchPoints,
    hasFinePointer,
    orientation
  } = diagnostics;

  const ua = userAgentSnippet.toLowerCase();

  // Signal 1: Conventional mobile user agent check
  const isExplicitMobileUA =
    /android.*mobile|iphone|ipod|iemobile|opera mini|blackberry|windows phone/i.test(ua);

  // Signal 2: iPad / Tablet check (including iPadOS desktop Safari that reports 'Macintosh')
  const isIPadOS = /macintosh/i.test(ua) && maxTouchPoints > 1;
  const isExplicitTablet = /ipad|android(?!.*mobile)/i.test(ua) || isIPadOS;

  // Signal 3: Physical smartphone dimension heuristic (even in "Desktop Site" mode)
  // Conventional smartphones have a physical shortest side < 540 CSS pixels.
  const isPhysicalPhoneDimension = minScreenDimension > 0 && minScreenDimension < MIN_PHYSICAL_SCREEN_DIMENSION;

  // Signal 4: Desktop-mode phone detection
  // Phone spoofing desktop site: viewport may report 980-1024px, but physical screen dimension is < 540px
  // and touch points exist with coarse pointer
  const isMobileDesktopMode =
    isPhysicalPhoneDimension &&
    isTouchCapable &&
    !isExplicitTablet &&
    viewportWidth >= 900;

  // Classify environment type
  let environmentType: DeviceEnvironmentType = 'unknown';

  if (isExplicitMobileUA || (isPhysicalPhoneDimension && isTouchCapable && !isExplicitTablet)) {
    environmentType = 'mobile_phone';
  } else if (isExplicitTablet) {
    environmentType = 'tablet';
  } else if (viewportWidth >= 1600 && hasFinePointer) {
    environmentType = 'workstation';
  } else if (viewportWidth >= 1200) {
    environmentType = 'desktop';
  } else if (viewportWidth >= 1024) {
    environmentType = 'laptop';
  } else {
    environmentType = isTouchCapable ? 'tablet' : 'desktop';
  }

  // --- RESTRICTION ASSESSMENTS ---

  // Check A: Mobile phone device
  if (environmentType === 'mobile_phone' || isExplicitMobileUA) {
    reasons.push('MOBILE_DEVICE_DETECTED');
  }

  // Check B: Mobile device using desktop-site mode
  if (isMobileDesktopMode && !reasons.includes('MOBILE_DEVICE_DETECTED')) {
    reasons.push('MOBILE_DESKTOP_MODE_DETECTED');
  }

  // Check C: Horizontal workspace requirement
  if (viewportWidth < MIN_VIEWPORT_WIDTH) {
    reasons.push('INSUFFICIENT_VIEWPORT_WIDTH');
  }

  // Check D: Vertical workspace requirement
  if (viewportHeight < MIN_VIEWPORT_HEIGHT) {
    reasons.push('INSUFFICIENT_VIEWPORT_HEIGHT');
  }

  // Check E: Orientation suitability
  // In portrait mode with touch, width is almost always severely constrained for multi-column dashboards
  if (orientation === 'portrait' && viewportWidth < MIN_VIEWPORT_WIDTH) {
    reasons.push('PORTRAIT_ORIENTATION_UNSUITABLE');
  }

  // Check F: Touch-only device with marginal dimensions
  if (isTouchCapable && !hasFinePointer && viewportWidth < MIN_VIEWPORT_WIDTH) {
    if (!reasons.includes('TOUCH_WORKSPACE_INSUFFICIENT')) {
      reasons.push('TOUCH_WORKSPACE_INSUFFICIENT');
    }
  }

  const isCompatible = reasons.length === 0;
  const status = isCompatible ? 'supported' : 'restricted';

  return {
    isCompatible,
    status,
    environmentType,
    reasons,
    diagnostics,
    evaluatedAt: Date.now(),
    minRequiredWidth: MIN_VIEWPORT_WIDTH,
    minRequiredHeight: MIN_VIEWPORT_HEIGHT
  };
}
