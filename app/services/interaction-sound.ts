/**
 * VITALIS - Mechanical Button Sound System
 *
 * Uses the Web Audio API to synthesize a short, two-stage tactile switch sound.
 * Audio is unlocked on the first trusted user gesture, but is played only when
 * a real button activation occurs. Canvas gestures and ordinary input changes
 * never produce a click sound.
 */

const STORAGE_KEY_ENABLED = 'vitalis_audio_sound_enabled';
const STORAGE_KEY_VOLUME = 'vitalis_audio_sound_volume';

let audioCtx: AudioContext | null = null;
let resumePromise: Promise<void> | null = null;
let isEnabled = true;
let volume = 0.45;
const listeners = new Set<(enabled: boolean) => void>();

type WindowWithWebkitAudioContext = Window & {
  webkitAudioContext?: typeof AudioContext;
};

// Load preferences once, without making browser storage a requirement.
if (typeof window !== 'undefined') {
  try {
    const savedEnabled = localStorage.getItem(STORAGE_KEY_ENABLED);
    if (savedEnabled !== null) isEnabled = savedEnabled === 'true';

    const savedVolume = localStorage.getItem(STORAGE_KEY_VOLUME);
    if (savedVolume !== null) {
      const parsed = Number.parseFloat(savedVolume);
      if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 1) {
        volume = parsed;
      }
    }
  } catch {
    // Storage may be unavailable in private or restricted browsing contexts.
  }
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (audioCtx?.state === 'closed') {
    audioCtx = null;
    resumePromise = null;
  }

  if (!audioCtx) {
    try {
      const AudioContextConstructor =
        window.AudioContext ??
        (window as WindowWithWebkitAudioContext).webkitAudioContext;

      if (!AudioContextConstructor) return null;
      audioCtx = new AudioContextConstructor();
    } catch {
      return null;
    }
  }

  return audioCtx;
}

function resumeAudioContext(context: AudioContext): Promise<void> {
  if (context.state === 'running') return Promise.resolve();

  if (!resumePromise) {
    resumePromise = context
      .resume()
      .then(() => undefined)
      .catch(() => undefined)
      .finally(() => {
        resumePromise = null;
      });
  }

  return resumePromise;
}

/**
 * Unlock audio during a trusted gesture. This does not itself play a sound.
 * Calling resume from pointerdown/keydown avoids relying on a later React
 * callback to satisfy browser autoplay policies.
 */
function unlockAudioFromGesture(event: Event): void {
  if (!event.isTrusted || !isEnabled || volume <= 0) return;

  const context = getAudioContext();
  if (context && context.state !== 'running') {
    void resumeAudioContext(context);
  }
}

/**
 * Plays the synthesized mechanical switch sound. The caller must invoke this
 * from a user gesture; the delegated button listener below does so for all
 * native and custom button controls in the application.
 */
export function playButtonClick(customVolumeScale = 1): void {
  if (!isEnabled || volume <= 0) return;

  const context = getAudioContext();
  if (!context) return;

  const renderClick = () => {
    if (context.state !== 'running' || !isEnabled || volume <= 0) return;

    const scale = Number.isFinite(customVolumeScale)
      ? Math.max(0, customVolumeScale)
      : 1;
    const effectiveVolume = Math.min(1, volume * scale);
    if (effectiveVolume <= 0) return;

    const now = context.currentTime;
    const pitchJitter = 1 + (Math.random() - 0.5) * 0.06;
    const masterGain = context.createGain();
    masterGain.gain.setValueAtTime(effectiveVolume, now);
    masterGain.connect(context.destination);

    const ownedNodes: AudioNode[] = [masterGain];
    let activeSources = 0;

    const trackSource = (source: AudioScheduledSourceNode) => {
      activeSources += 1;
      ownedNodes.push(source);
      source.onended = () => {
        source.disconnect();
        activeSources -= 1;
        if (activeSources === 0) {
          for (const node of ownedNodes) {
            try {
              node.disconnect();
            } catch {
              // A node may already have been disconnected by the browser.
            }
          }
        }
      };
    };

    try {
      // Stage 1: sharp high-frequency contact transient.
      const clickOscillator = context.createOscillator();
      const clickGain = context.createGain();
      const clickFilter = context.createBiquadFilter();

      clickOscillator.type = 'triangle';
      clickOscillator.frequency.setValueAtTime(2600 * pitchJitter, now);
      clickOscillator.frequency.exponentialRampToValueAtTime(
        800 * pitchJitter,
        now + 0.005
      );

      clickFilter.type = 'bandpass';
      clickFilter.frequency.setValueAtTime(2400, now);
      clickFilter.Q.setValueAtTime(3.5, now);

      clickGain.gain.setValueAtTime(0.7, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.006);

      clickOscillator.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(masterGain);

      ownedNodes.push(clickFilter, clickGain);
      trackSource(clickOscillator);
      clickOscillator.start(now);
      clickOscillator.stop(now + 0.007);

      // Stage 2: low-frequency mechanical latch.
      const bodyOscillator = context.createOscillator();
      const bodyGain = context.createGain();

      bodyOscillator.type = 'sine';
      bodyOscillator.frequency.setValueAtTime(190 * pitchJitter, now + 0.001);
      bodyOscillator.frequency.exponentialRampToValueAtTime(
        55 * pitchJitter,
        now + 0.016
      );

      bodyGain.gain.setValueAtTime(0, now);
      bodyGain.gain.setValueAtTime(0.65, now + 0.001);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

      bodyOscillator.connect(bodyGain);
      bodyGain.connect(masterGain);

      ownedNodes.push(bodyGain);
      trackSource(bodyOscillator);
      bodyOscillator.start(now + 0.001);
      bodyOscillator.stop(now + 0.02);

      // A very short noise burst adds a subtle mechanical texture.
      const noiseLength = Math.max(1, Math.floor(context.sampleRate * 0.004));
      const noiseBuffer = context.createBuffer(1, noiseLength, context.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);

      for (let index = 0; index < noiseLength; index += 1) {
        noiseData[index] =
          (Math.random() * 2 - 1) *
          Math.exp(-index / (noiseLength * 0.3));
      }

      const noiseSource = context.createBufferSource();
      const noiseGain = context.createGain();
      noiseSource.buffer = noiseBuffer;
      noiseGain.gain.setValueAtTime(0.25, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.004);
      noiseSource.connect(noiseGain);
      noiseGain.connect(masterGain);

      ownedNodes.push(noiseGain);
      trackSource(noiseSource);
      noiseSource.start(now);
      noiseSource.stop(now + 0.005);
    } catch {
      for (const node of ownedNodes) {
        try {
          node.disconnect();
        } catch {
          // Ignore partial graph cleanup failures.
        }
      }
    }
  };

  if (context.state === 'running') {
    renderClick();
  } else {
    // Schedule only after resume succeeds; do not queue audio against a
    // suspended context whose clock is not advancing.
    void resumeAudioContext(context).then(renderClick);
  }
}

/**
 * Installs one delegated listener so native buttons and VitalisButton share
 * the same sound path. The capture phase runs during the browser's trusted
 * click event and before React handles the activation.
 */
export function installInteractionSound(): () => void {
  if (typeof document === 'undefined') return () => undefined;

  const handleClick = (event: MouseEvent) => {
    if (!event.isTrusted) return;

    const target = event.target;
    if (!(target instanceof Element)) return;

    const control = target.closest(
      'button, input[type="button"], input[type="submit"], input[type="reset"], [role="button"]'
    );

    if (
      !control ||
      control.matches(':disabled') ||
      control.getAttribute('aria-disabled') === 'true' ||
      control.getAttribute('data-sound') === 'off'
    ) {
      return;
    }

    playButtonClick();
  };

  document.addEventListener('pointerdown', unlockAudioFromGesture, true);
  document.addEventListener('keydown', unlockAudioFromGesture, true);
  document.addEventListener('click', handleClick, true);

  return () => {
    document.removeEventListener('pointerdown', unlockAudioFromGesture, true);
    document.removeEventListener('keydown', unlockAudioFromGesture, true);
    document.removeEventListener('click', handleClick, true);
  };
}

/** Enable or disable button feedback audio. */
export function setSoundEnabled(enabled: boolean): void {
  isEnabled = enabled;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_ENABLED, String(enabled));
    } catch {
      // Ignore unavailable storage.
    }
  }
  listeners.forEach((listener) => listener(isEnabled));
}

/** Check whether button feedback audio is enabled. */
export function isSoundEnabled(): boolean {
  return isEnabled;
}

/** Get the current volume level (0.0 to 1.0). */
export function getSoundVolume(): number {
  return volume;
}

/** Set and persist the volume level (0.0 to 1.0). */
export function setSoundVolume(nextVolume: number): void {
  if (!Number.isFinite(nextVolume)) return;
  volume = Math.max(0, Math.min(1, nextVolume));

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_VOLUME, String(volume));
    } catch {
      // Ignore unavailable storage.
    }
  }
}

/** Subscribe to sound enabled-state changes. */
export function subscribeSoundChange(
  listener: (enabled: boolean) => void
): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
