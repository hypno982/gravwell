// Audio: every sound is synthesised from an oscillator, so the entry ships no
// audio files and the game still speaks. Small, tasteful, and easily muted.

export function createAudio() {
  let ctx = null;
  let enabled = true;

  function ensure() {
    if (!enabled) return null;
    if (ctx === null) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) {
        enabled = false;
        return null;
      }
      ctx = new Ctor();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone({ freq = 440, to = null, type = 'sine', dur = 0.15, gain = 0.05, delay = 0 }) {
    const c = ensure();
    if (c === null) return;
    const t0 = c.currentTime + delay;
    const osc = c.createOscillator();
    const env = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (to !== null) osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), t0 + dur);
    env.gain.setValueAtTime(0.0001, t0);
    env.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(env).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  function noise({ dur = 0.2, gain = 0.06, delay = 0 }) {
    const c = ensure();
    if (c === null) return;
    const frames = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, frames, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < frames; i += 1) {
      const envelope = 1 - i / frames;
      data[i] = (Math.random() * 2 - 1) * envelope * envelope;
    }
    const src = c.createBufferSource();
    src.buffer = buf;
    const env = c.createGain();
    env.gain.value = gain;
    src.connect(env).connect(c.destination);
    src.start(c.currentTime + delay);
  }

  return {
    get muted() {
      return !enabled;
    },
    toggle() {
      enabled = !enabled;
      if (!enabled && ctx !== null) ctx.suspend();
      if (enabled && ctx !== null) ctx.resume();
      return enabled;
    },
    /** A post goes in: a short, warm pluck. */
    place() {
      tone({ freq: 520, to: 660, type: 'triangle', dur: 0.1, gain: 0.045 });
    },
    /** The post is pulled: a lower, softer version, so a move sounds like a move. */
    move() {
      tone({ freq: 300, to: 380, type: 'triangle', dur: 0.09, gain: 0.035 });
    },
    /** The pod got closer to a hazard than it should have: a tick that rises with danger. */
    tension(level) {
      tone({ freq: 180 + level * 420, type: 'square', dur: 0.04, gain: 0.008 + level * 0.014 });
    },
    /** Room cleared. */
    win() {
      tone({ freq: 523, type: 'sine', dur: 0.16, gain: 0.06 });
      tone({ freq: 659, type: 'sine', dur: 0.16, gain: 0.05, delay: 0.09 });
      tone({ freq: 784, type: 'sine', dur: 0.22, gain: 0.05, delay: 0.18 });
      tone({ freq: 1046, type: 'triangle', dur: 0.4, gain: 0.04, delay: 0.27 });
    },
    /** Pod lost. */
    lose() {
      noise({ dur: 0.22, gain: 0.05 });
      tone({ freq: 220, to: 70, type: 'sawtooth', dur: 0.42, gain: 0.05 });
    },
    /** The whole run finished. */
    finish() {
      tone({ freq: 392, type: 'sine', dur: 0.5, gain: 0.05 });
      tone({ freq: 523, type: 'sine', dur: 0.5, gain: 0.05, delay: 0.12 });
      tone({ freq: 784, type: 'sine', dur: 0.8, gain: 0.05, delay: 0.24 });
      tone({ freq: 1046, type: 'triangle', dur: 1.2, gain: 0.04, delay: 0.36 });
    },
    /** UI movement. */
    ui() {
      tone({ freq: 700, type: 'sine', dur: 0.05, gain: 0.025 });
    },
  };
}
