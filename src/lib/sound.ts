// Web Audio API micro-sounds para interacciones sutiles superdeportivos
let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const CKey = window.AudioContext || window.webkitAudioContext;
    if (CKey) {
      audioCtx = new CKey();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playPaddleShiftSound(direction = 'next') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(direction === 'next' ? 480 : 400, now);
    filter.Q.setValueAtTime(2.5, now);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(direction === 'next' ? 260 : 210, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.045);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    const bufferSize = Math.floor(ctx.sampleRate * 0.025);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.1;
    }
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(1000, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.035, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.055);
    whiteNoise.start(now);
    whiteNoise.stop(now + 0.025);
  } catch (err) {}
}

export function playSoftTickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.025);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  } catch (err) {}
}
