// Input: mouse and keyboard, and nothing else. The pointer places posts; the
// keyboard owns the verbs a player reaches for when a room goes wrong.

import { FIELD } from './config.js';

export function createInput(canvas) {
  const api = {
    /** Latest pointer position in field space, or null when the pointer is off the field. */
    ghost: null,
    /** One-frame flags, consumed by the game loop. */
    pending: { place: false, clear: false, retry: false, next: false, start: false, mute: false },
  };

  function toField(ev) {
    const rect = canvas.getBoundingClientRect();
    const sx = ((ev.clientX - rect.left) / rect.width) * 1280;
    const sy = ((ev.clientY - rect.top) / rect.height) * 720;
    const fx = sx - FIELD.x;
    const fy = sy - FIELD.y;
    if (fx < 0 || fy < 0 || fx > FIELD.w || fy > FIELD.h) return null;
    return { x: fx, y: fy };
  }

  canvas.addEventListener('pointermove', (ev) => {
    api.ghost = toField(ev);
  });

  canvas.addEventListener('pointerleave', () => {
    api.ghost = null;
  });

  canvas.addEventListener('pointerdown', (ev) => {
    const p = toField(ev);
    // A click anywhere is also the "advance" gesture on an overlay, so the
    // title, defeat and victory screens respond to the same button.
    api.pending.start = true;
    if (p !== null) {
      api.ghost = p;
      api.pending.place = true;
    }
  });

  window.addEventListener('keydown', (ev) => {
    const k = ev.key.toLowerCase();
    if (k === ' ' || k === 'enter') {
      api.pending.start = true;
      ev.preventDefault();
    } else if (k === 'c') {
      api.pending.clear = true;
    } else if (k === 'r') {
      api.pending.retry = true;
    } else if (k === 'n') {
      api.pending.next = true;
    } else if (k === 'm') {
      api.pending.mute = true;
    }
  });

  /** Read and reset the one-frame flags. */
  api.take = function take() {
    const out = { ...api.pending };
    for (const key of Object.keys(api.pending)) api.pending[key] = false;
    return out;
  };

  return api;
}
