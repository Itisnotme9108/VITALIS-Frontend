import assert from 'node:assert/strict';
import {
  evaluateDeviceCompatibility,
  MIN_VIEWPORT_WIDTH,
  MIN_VIEWPORT_HEIGHT
} from '../app/compatibility/device-compatibility.ts';

console.log('Running VITALIS Device Compatibility Gate validation suite...\n');

// Test Case 1: Standard Desktop Workstation (Full HD)
{
  const result = evaluateDeviceCompatibility({
    innerWidth: 1920,
    innerHeight: 1080,
    screenWidth: 1920,
    screenHeight: 1080,
    maxTouchPoints: 0,
    hasFinePointer: true,
    hasCoarsePointer: false,
    hasHoverCapability: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36'
  });
  assert.equal(result.isCompatible, true, 'Desktop workstation must be compatible');
  assert.equal(result.status, 'supported');
  assert.equal(result.reasons.length, 0);
  console.log('✓ Test 1: Standard 1080p Desktop Workstation -> Supported');
}

// Test Case 2: Standard Laptop (1440x900)
{
  const result = evaluateDeviceCompatibility({
    innerWidth: 1440,
    innerHeight: 900,
    screenWidth: 1440,
    screenHeight: 900,
    maxTouchPoints: 0,
    hasFinePointer: true,
    hasHoverCapability: true,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Safari/537.36'
  });
  assert.equal(result.isCompatible, true, 'Standard laptop must be compatible');
  assert.equal(result.status, 'supported');
  console.log('✓ Test 2: Standard 1440x900 Laptop -> Supported');
}

// Test Case 3: Touchscreen Laptop (Windows Surface / ThinkPad Touch)
// MUST NOT be rejected merely because maxTouchPoints > 0!
{
  const result = evaluateDeviceCompatibility({
    innerWidth: 1920,
    innerHeight: 1080,
    screenWidth: 1920,
    screenHeight: 1080,
    maxTouchPoints: 10,
    hasFinePointer: true, // Has trackpad/mouse
    hasHoverCapability: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36'
  });
  assert.equal(result.isCompatible, true, 'Touchscreen laptop must be compatible');
  assert.equal(result.status, 'supported');
  assert.equal(result.reasons.length, 0);
  console.log('✓ Test 3: Touchscreen Laptop (maxTouchPoints=10) -> Supported (Not rejected for touch)');
}

// Test Case 4: Conventional Smartphone (Portrait - iPhone 14 Pro 393x852)
{
  const result = evaluateDeviceCompatibility({
    innerWidth: 393,
    innerHeight: 852,
    screenWidth: 393,
    screenHeight: 852,
    maxTouchPoints: 5,
    hasFinePointer: false,
    hasCoarsePointer: true,
    hasHoverCapability: false,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1'
  });
  assert.equal(result.isCompatible, false, 'Mobile phone portrait must be restricted');
  assert.equal(result.status, 'restricted');
  assert.ok(result.reasons.includes('MOBILE_DEVICE_DETECTED'));
  assert.ok(result.reasons.includes('INSUFFICIENT_VIEWPORT_WIDTH'));
  console.log('✓ Test 4: Smartphone Portrait (393x852) -> Restricted');
}

// Test Case 5: Conventional Smartphone (Landscape - 852x393)
{
  const result = evaluateDeviceCompatibility({
    innerWidth: 852,
    innerHeight: 393,
    screenWidth: 852,
    screenHeight: 393,
    maxTouchPoints: 5,
    hasFinePointer: false,
    hasCoarsePointer: true,
    hasHoverCapability: false,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1'
  });
  assert.equal(result.isCompatible, false, 'Mobile phone landscape must be restricted');
  assert.equal(result.status, 'restricted');
  assert.ok(result.reasons.includes('MOBILE_DEVICE_DETECTED'));
  assert.ok(result.reasons.includes('INSUFFICIENT_VIEWPORT_HEIGHT'));
  console.log('✓ Test 5: Smartphone Landscape (852x393) -> Restricted (Insufficient Height)');
}

// Test Case 6: Mobile Phone requesting "Desktop Site" Mode
// Browser sends desktop UA and expands innerWidth to 980 or 1024, but physical screen dimension is 390px!
{
  const result = evaluateDeviceCompatibility({
    innerWidth: 1024,
    innerHeight: 420, // Phone in landscape desktop mode
    screenWidth: 844,
    screenHeight: 390, // Physical screen height is only 390px
    maxTouchPoints: 5,
    hasFinePointer: false,
    hasCoarsePointer: true,
    hasHoverCapability: false,
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36'
  });
  assert.equal(result.isCompatible, false, 'Mobile phone in desktop mode must be restricted');
  assert.equal(result.status, 'restricted');
  assert.ok(
    result.reasons.includes('MOBILE_DESKTOP_MODE_DETECTED') ||
    result.reasons.includes('INSUFFICIENT_VIEWPORT_HEIGHT'),
    'Must identify desktop-mode mobile device'
  );
  console.log('✓ Test 6: Mobile Phone in Desktop Site Mode -> Restricted');
}

// Test Case 7: Tablet in Portrait (iPad 768x1024)
{
  const result = evaluateDeviceCompatibility({
    innerWidth: 768,
    innerHeight: 1024,
    screenWidth: 768,
    screenHeight: 1024,
    maxTouchPoints: 5,
    hasFinePointer: false,
    hasCoarsePointer: true,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148'
  });
  assert.equal(result.isCompatible, false, 'Tablet in portrait (768px width) must be restricted');
  assert.ok(result.reasons.includes('INSUFFICIENT_VIEWPORT_WIDTH'));
  assert.ok(result.reasons.includes('PORTRAIT_ORIENTATION_UNSUITABLE'));
  console.log('✓ Test 7: Tablet Portrait (768x1024) -> Restricted (Width < 1024)');
}

// Test Case 8: Large Tablet in Landscape (iPad Pro / Surface Pro 1280x800)
{
  const result = evaluateDeviceCompatibility({
    innerWidth: 1280,
    innerHeight: 800,
    screenWidth: 1280,
    screenHeight: 800,
    maxTouchPoints: 5,
    hasFinePointer: false,
    hasCoarsePointer: true,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15' // iPadOS reports Mac
  });
  assert.equal(result.isCompatible, true, 'Large tablet in landscape meeting workspace must be supported');
  assert.equal(result.status, 'supported');
  console.log('✓ Test 8: Large Tablet in Landscape (1280x800) -> Supported');
}

// Test Case 9: Desktop Window Resized Narrow (800x750)
{
  const result = evaluateDeviceCompatibility({
    innerWidth: 800,
    innerHeight: 750,
    screenWidth: 1920,
    screenHeight: 1080,
    maxTouchPoints: 0,
    hasFinePointer: true,
    hasHoverCapability: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36'
  });
  assert.equal(result.isCompatible, false, 'Resized narrow desktop window must be restricted');
  assert.ok(result.reasons.includes('INSUFFICIENT_VIEWPORT_WIDTH'));
  console.log('✓ Test 9: Resized Narrow Desktop Window (800x750) -> Restricted');
}

// Test Case 10: Desktop Window Resized Short (1280x500)
{
  const result = evaluateDeviceCompatibility({
    innerWidth: 1280,
    innerHeight: 500,
    screenWidth: 1920,
    screenHeight: 1080,
    maxTouchPoints: 0,
    hasFinePointer: true,
    hasHoverCapability: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36'
  });
  assert.equal(result.isCompatible, false, 'Resized short desktop window must be restricted');
  assert.ok(result.reasons.includes('INSUFFICIENT_VIEWPORT_HEIGHT'));
  console.log('✓ Test 10: Resized Short Desktop Window (1280x500) -> Restricted');
}

console.log('\nAll 10 device compatibility test scenarios passed successfully!');
