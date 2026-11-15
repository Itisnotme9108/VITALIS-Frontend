/**
 * VITALIS - Mechanical Button Sound System
 * 
 * High-fidelity, two-stage mechanical microswitch click synthesis using Web Audio API.
 * Synthesizes a tactile industrial control switch:
 * - Stage 1: Sharp high-frequency contact impulse (~2.4kHz, ~3ms)
 * - Stage 2: Damped mechanical latch resonance (~160Hz body, ~14ms)
 * 
 * Strict operation rules:
 * 1. Only executed on actual functional button activations.
 * 2. Never triggered by canvas interactions, orbiting, dragging, panning, or zooming.
 * 3. Never triggered by scrolling, rerenders, or programmatic state updates.
 * 4. Debounced to prevent duplicate audio triggers from event bubbling.
 * 5. AudioContext lazily initialized on first user gesture.
 */

const STORAGE_KEY_ENABLED = 'vitalis_audio_sound_enabled';
const STORAGE_KEY_VOLUME = 'vitalis_audio_sound_volume';

let audioCtx: AudioContext | null = null;
let isEnabled: boolean = true;
let volume: number = 0.45;
let lastClickTime: number = 0;
const listeners = new Set<(enabled: boolean) => void>();

// Load preferences from localStorage if available in browser
if (typeof window !== 'undefined') {
  try {
    const savedEnabled = localStorage.getItem(STORAGE_KEY_ENABLED);
    if (savedEnabled !== null) {
      isEnabled = savedEnabled === 'true';
    }
    const savedVol = localStorage.getItem(STORAGE_KEY_VOLUME);
    if (savedVol !== null) {
      const parsed = parseFloat(savedVol);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
        volume = parsed;
      }
    }
  } catch {
    // Graceful fallback if localStorage is restricted
  }
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Triggers the two-stage mechanical switch click sound.
 * Call only on genuine functional button activation.
 */
export function playButtonClick(customVolumeScale: number = 1.0): void {
  if (!isEnabled) return;
  const now = performance.now();
  // Prevent duplicate sounds from event bubbling within 35ms
  if (now - lastClickTime < 35) return;
  lastClickTime = now;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const masterGain = ctx.createGain();
    const effectiveVol = Math.max(0, Math.min(1, volume * customVolumeScale));
    masterGain.gain.setValueAtTime(effectiveVol, t);
    masterGain.connect(ctx.destination);

    // Micro-pitch randomization (±3%) to give tactile switch realism
    const pitchJitter = 1 + (Math.random() - 0.5) * 0.06;

    // --- STAGE 1: High-Frequency Contact Transient (Metal contact closure) ---
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    const clickFilter = ctx.createBiquadFilter();

    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(2600 * pitchJitter, t);
    clickOsc.frequency.exponentialRampToValueAtTime(800 * pitchJitter, t + 0.005);

    clickFilter.type = 'bandpass';
    clickFilter.frequency.setValueAtTime(2400, t);
    clickFilter.Q.setValueAtTime(3.5, t);

    clickGain.gain.setValueAtTime(0.7, t);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.006);

    clickOsc.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(masterGain);

    clickOsc.start(t);
    clickOsc.stop(t + 0.007);

    // --- STAGE 2: Low-Frequency Mechanical Body / Latch Thump ---
    const bodyOsc = ctx.createOscillator();
    const bodyGain = ctx.createGain();

    bodyOsc.type = 'sine';
    bodyOsc.frequency.setValueAtTime(190 * pitchJitter, t + 0.001);
    bodyOsc.frequency.exponentialRampToValueAtTime(55 * pitchJitter, t + 0.016);

    bodyGain.gain.setValueAtTime(0.0, t);
    bodyGain.gain.setValueAtTime(0.65, t + 0.001);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.018);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(masterGain);

    bodyOsc.start(t + 0.001);
    bodyOsc.stop(t + 0.02);

    // --- Subtle Noise Burst (Tactile texture) ---
    const bufferSize = Math.floor(ctx.sampleRate * 0.004);
    if (bufferSize > 0) {
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.004);
      noiseSource.connect(noiseGain);
      noiseGain.connect(masterGain);
      noiseSource.start(t);
      noiseSource.stop(t + 0.005);
    }
  } catch {
    // Gracefully handle browser restrictions or audio failure
  }
}

/**
 * Enable or disable button feedback audio.
 */
export function setSoundEnabled(enabled: boolean): void {
  isEnabled = enabled;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_ENABLED, String(enabled));
    } catch {
      // Ignore
    }
  }
  listeners.forEach((listener) => listener(isEnabled));
}

/**
 * Check if button feedback audio is currently enabled.
 */
export function isSoundEnabled(): boolean {
  return isEnabled;
}

/**
 * Get current volume level (0.0 to 1.0).
 */
export function getSoundVolume(): number {
  return volume;
}

/**
 * Set sound volume level (0.0 to 1.0).
 */
export function setSoundVolume(vol: number): void {
  volume = Math.max(0, Math.min(1, vol));
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_VOLUME, String(volume));
    } catch {
      // Ignore
    }
  }
}

/**
 * Subscribe to sound enabled state changes.
 */
export function subscribeSoundChange(listener: (enabled: boolean) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
