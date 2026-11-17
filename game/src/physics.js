// The simulation: one pod, up to three anchors, fixed-step gravity. Pure state,
// no drawing and no DOM, so the same code runs headless in the shot harness and
// in the browser. Every step is deterministic: same anchors, same room, same
// result, which is what lets a screenshot be a real render rather than a mock.

import { PHYSICS, FIELD, RULES } from './config.js';
import { clamp } from './math.js';

/** A fresh run of one room. */
export function createRun(room, index) {
  return {
    index,
    room,
    pod: { x: room.start.x, y: room.start.y, vx: 0, vy: 0 },
    anchors: [],
    trail: [],
    time: room.time ?? RULES.secondsPerRoom,
    lost: false,
    won: false,
    reason: '',
    // Drama for the HUD: how close the pod came to a wall, and how fast it is going.
    tension: 0,
    peakSpeed: 0,
    placed: 0,
  };
}

/** Gravity at a point: the sum of every anchor's pull plus the constant drift. */
export function fieldAt(run, x, y) {
  let ax = 0;
  let ay = PHYSICS.drift;
  for (const a of run.anchors) {
    const dx = a.x - x;
    const dy = a.y - y;
    const d2 = dx * dx + dy * dy + PHYSICS.soften * PHYSICS.soften;
    const d = Math.sqrt(d2);
    if (d > PHYSICS.reach) continue;
    // Falloff: strong up close, nothing past reach, smooth at the edge.
    const fall = 1 - d / PHYSICS.reach;
    const strength = (PHYSICS.pull * fall * fall) / d2;
    ax += (dx / d) * strength;
    ay += (dy / d) * strength;
  }
  return { ax, ay };
}

/** Place (or move) an anchor. Returns false when the room is out of anchors. */
export function placeAnchor(run, x, y) {
  if (run.won || run.lost) return false;
  const clamped = {
    x: clamp(x, 0, FIELD.w),
    y: clamp(y, 0, FIELD.h),
  };
  if (run.anchors.length < RULES.maxAnchors) {
    run.anchors.push(clamped);
    run.placed += 1;
    return true;
  }
  // Full hand: the oldest post moves, so placement stays a live decision.
  run.anchors.shift();
  run.anchors.push(clamped);
  run.placed += 1;
  return true;
}

export function clearAnchors(run) {
  run.anchors.length = 0;
}

function hitsWall(run, x, y) {
  const r = PHYSICS.pod;
  for (const w of run.room.walls) {
    if (x + r > w.x && x - r < w.x + w.w && y + r > w.y && y - r < w.y + w.h) return true;
  }
  return false;
}

function hitsSpike(run, x, y) {
  const r = PHYSICS.pod;
  for (const s of run.room.spikes) {
    if (x + r > s.x && x - r < s.x + s.w && y + r > s.y && y - r < s.y + s.h) return true;
  }
  return false;
}

/**
 * Advance the run by dt seconds of wall clock, in fixed sub-steps. Returns an
 * event when something happened the HUD or the audio should react to.
 */
export function advance(run, dt) {
  if (run.won || run.lost) return null;
  let event = null;
  let remaining = Math.min(dt, 0.1);

  while (remaining > 0) {
    const h = Math.min(PHYSICS.step, remaining);
    remaining -= h;

    const g = fieldAt(run, run.pod.x, run.pod.y);
    run.pod.vx += g.ax * h;
    run.pod.vy += g.ay * h;

    const speed = Math.sqrt(run.pod.vx * run.pod.vx + run.pod.vy * run.pod.vy);
    if (speed > PHYSICS.maxSpeed) {
      const k = PHYSICS.maxSpeed / speed;
      run.pod.vx *= k;
      run.pod.vy *= k;
    }

    run.pod.x += run.pod.vx * h;
    run.pod.y += run.pod.vy * h;
    run.peakSpeed = Math.max(run.peakSpeed, speed);

    // Leaving the field is a loss: the walls of the world are the last wall.
    if (run.pod.x < 0 || run.pod.x > FIELD.w || run.pod.y < 0 || run.pod.y > FIELD.h) {
      run.lost = true;
      run.reason = 'you fell out of the field';
      return 'lost';
    }
    if (hitsWall(run, run.pod.x, run.pod.y)) {
      run.lost = true;
      run.reason = 'you hit a wall';
      return 'lost';
    }
    if (hitsSpike(run, run.pod.x, run.pod.y)) {
      run.lost = true;
      run.reason = 'you touched a spike';
      return 'lost';
    }
  }

  // Tension: the inverse of the nearest hazard, used for the HUD's danger bar.
  let near = Infinity;
  for (const w of run.room.walls) {
    const dx = Math.max(w.x - run.pod.x, 0, run.pod.x - (w.x + w.w));
    const dy = Math.max(w.y - run.pod.y, 0, run.pod.y - (w.y + w.h));
    near = Math.min(near, Math.sqrt(dx * dx + dy * dy));
  }
  run.tension = clamp(1 - near / 70, 0, 1);

  run.trail.push({ x: run.pod.x, y: run.pod.y });
  if (run.trail.length > 96) run.trail.shift();

  const ex = run.pod.x - run.room.exit.x;
  const ey = run.pod.y - run.room.exit.y;
  if (Math.sqrt(ex * ex + ey * ey) < run.room.exit.r - 4) {
    run.won = true;
    return 'won';
  }

  run.time -= dt;
  if (run.time <= 0) {
    run.time = 0;
    run.lost = true;
    run.reason = 'the clock ran out';
    return 'lost';
  }

  return event;
}

/** How much of the room's clock is left, 0..1, for the HUD ring. */
export function timeFraction(run) {
  const total = run.room.time ?? RULES.secondsPerRoom;
  return total <= 0 ? 0 : clamp(run.time / total, 0, 1);
}
