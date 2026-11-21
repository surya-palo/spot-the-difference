// Tiny WebAudio sound effects for Mira's Cottage: no audio files, every sound is
// synthesised with oscillators, so the game loads nothing over the network.
let audioContext = null;
let muted = false;

/** Lazily create the shared AudioContext on the first user gesture. */
function context() {
  if (audioContext === null) {
    const Ctor = window.AudioContext ?? window.webkitAudioContext;
    if (!Ctor) return null;
    audioContext = new Ctor();
  }
  if (audioContext.state === 'suspended') void audioContext.resume();
  return audioContext;
}

/** Play one short oscillator note. */
export function playTone(frequency, durationSeconds, type = 'sine', volume = 0.12, delaySeconds = 0) {
  if (muted) return;
  const ctx = context();
  if (ctx === null) return;
  const start = ctx.currentTime + delaySeconds;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + durationSeconds);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + durationSeconds + 0.05);
}

/** A bright two-note chime when a difference is found. */
export function playFound() {
  playTone(659.25, 0.14, 'sine', 0.14);
  playTone(987.77, 0.22, 'sine', 0.12, 0.09);
}

/** A low buzz for a wrong click. */
export function playWrong() {
  playTone(160, 0.18, 'sawtooth', 0.06);
  playTone(110, 0.22, 'sawtooth', 0.05, 0.08);
}

/** A soft sparkle when a hint is spent. */
export function playHint() {
  playTone(1174.66, 0.12, 'triangle', 0.08);
  playTone(1567.98, 0.16, 'triangle', 0.07, 0.07);
}

/** A rising arpeggio when a level is cleared. */
export function playWin() {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((frequency, index) => playTone(frequency, 0.22, 'triangle', 0.12, index * 0.11));
}

/** A gentle descending phrase for game over. */
export function playLose() {
  const notes = [392, 329.63, 261.63];
  notes.forEach((frequency, index) => playTone(frequency, 0.28, 'sine', 0.1, index * 0.14));
}

/** A soft tick in the last ten seconds. */
export function playTick() {
  playTone(880, 0.05, 'square', 0.03);
}

/** Mute or unmute all effects; returns the new muted state. */
export function toggleMute() {
  muted = !muted;
  return muted;
}
