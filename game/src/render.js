// Drawing the play field: grid, walls, spikes, the exit well, the anchors and
// their field lines, the pod and its trail. Everything here reads run state and
// paints; it never mutates it.

import { PALETTE, FIELD, PHYSICS } from './config.js';
import { seeded } from './math.js';

const STARS = buildStars();

function buildStars() {
  const rand = seeded(0x9e3779b9);
  const stars = [];
  for (let i = 0; i < 150; i += 1) {
    stars.push({
      x: rand() * FIELD.w,
      y: rand() * FIELD.h,
      r: 0.4 + rand() * 1.1,
      a: 0.05 + rand() * 0.22,
    });
  }
  return stars;
}

export function drawField(ctx, run, t) {
  // The field itself: a darker plate than the void, so the play area reads.
  ctx.save();
  ctx.translate(FIELD.x, FIELD.y);
  ctx.fillStyle = PALETTE.field;
  ctx.fillRect(0, 0, FIELD.w, FIELD.h);

  // Stars drift very slowly; the field is deep space, not a table.
  for (const s of STARS) {
    const y = (s.y + t * 3) % FIELD.h;
    ctx.globalAlpha = s.a;
    ctx.fillStyle = '#9db8f0';
    ctx.fillRect(s.x, y, s.r, s.r);
  }
  ctx.globalAlpha = 1;

  // Grid.
  ctx.strokeStyle = PALETTE.grid;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= FIELD.w; x += 53) {
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, FIELD.h);
  }
  for (let y = 0; y <= FIELD.h; y += 53) {
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(FIELD.w, y + 0.5);
  }
  ctx.stroke();

  // Border.
  ctx.strokeStyle = PALETTE.gridStrong;
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, FIELD.w - 2, FIELD.h - 2);

  drawExit(ctx, run, t);
  drawWalls(ctx, run);
  drawSpikes(ctx, run);
  drawAnchors(ctx, run, t);
  drawTrail(ctx, run);
  drawPod(ctx, run, t);

  ctx.restore();
}

function drawExit(ctx, run, t) {
  const { exit } = run.room;
  const pulse = 0.5 + 0.5 * Math.sin(t * 2.2);

  // The well: concentric rings that pull inward, so it reads as a drain.
  const glow = ctx.createRadialGradient(exit.x, exit.y, 2, exit.x, exit.y, exit.r * 1.8);
  glow.addColorStop(0, 'rgba(79,240,192,0.30)');
  glow.addColorStop(0.5, 'rgba(79,240,192,0.10)');
  glow.addColorStop(1, 'rgba(79,240,192,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(exit.x, exit.y, exit.r * 1.8, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 3; i += 1) {
    const k = ((t * 0.45 + i / 3) % 1);
    const r = exit.r * (1 - k * 0.72);
    ctx.globalAlpha = 0.55 * (1 - k) * (0.6 + 0.4 * pulse);
    ctx.strokeStyle = PALETTE.exit;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(exit.x, exit.y, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  ctx.strokeStyle = PALETTE.exit;
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.arc(exit.x, exit.y, exit.r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // The drain's mouth.
  ctx.fillStyle = PALETTE.exitDim;
  ctx.beginPath();
  ctx.arc(exit.x, exit.y, exit.r * 0.55, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = PALETTE.exit;
  ctx.font = '600 10px ui-monospace, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('EXIT', exit.x, exit.y + exit.r + 16);
  ctx.textAlign = 'left';
}

function drawWalls(ctx, run) {
  for (const w of run.room.walls) {
    ctx.fillStyle = PALETTE.wall;
    ctx.fillRect(w.x, w.y, w.w, w.h);
    ctx.strokeStyle = PALETTE.wallEdge;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(w.x + 0.75, w.y + 0.75, w.w - 1.5, w.h - 1.5);
    // A hatch on the long axis so walls read as solid, not as holes.
    ctx.strokeStyle = 'rgba(51,80,127,0.35)';
    ctx.beginPath();
    if (w.h > w.w) {
      for (let y = w.y + 6; y < w.y + w.h - 4; y += 10) {
        ctx.moveTo(w.x + 3, y);
        ctx.lineTo(w.x + w.w - 3, y);
      }
    } else {
      for (let x = w.x + 6; x < w.x + w.w - 4; x += 10) {
        ctx.moveTo(x, w.y + 3);
        ctx.lineTo(x, w.y + w.h - 3);
      }
    }
    ctx.stroke();
  }
}

function drawSpikes(ctx, run) {
  for (const s of run.room.spikes) {
    ctx.fillStyle = 'rgba(255,92,122,0.14)';
    ctx.fillRect(s.x, s.y, s.w, s.h);
    ctx.strokeStyle = PALETTE.spike;
    ctx.lineWidth = 1.4;
    ctx.strokeRect(s.x + 0.7, s.y + 0.7, s.w - 1.4, s.h - 1.4);
    // Teeth along the long axis.
    ctx.fillStyle = PALETTE.spike;
    ctx.beginPath();
    const step = 12;
    if (s.w >= s.h) {
      for (let x = s.x + 3; x < s.x + s.w - 3; x += step) {
        ctx.moveTo(x, s.y + s.h - 2);
        ctx.lineTo(x + step / 2, s.y + 2);
        ctx.lineTo(x + step, s.y + s.h - 2);
      }
    } else {
      for (let y = s.y + 3; y < s.y + s.h - 3; y += step) {
        ctx.moveTo(s.x + s.w - 2, y);
        ctx.lineTo(s.x + 2, y + step / 2);
        ctx.lineTo(s.x + s.w - 2, y + step);
      }
    }
    ctx.fill();
  }
}

function drawAnchors(ctx, run, t) {
  for (let i = 0; i < run.anchors.length; i += 1) {
    const a = run.anchors[i];
    const halo = ctx.createRadialGradient(a.x, a.y, 1, a.x, a.y, PHYSICS.reach * 0.55);
    halo.addColorStop(0, PALETTE.anchorGlow);
    halo.addColorStop(1, 'rgba(255,179,71,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(a.x, a.y, PHYSICS.reach * 0.55, 0, Math.PI * 2);
    ctx.fill();

    // Field lines: rings showing where the post still has authority.
    for (let ring = 1; ring <= 3; ring += 1) {
      const r = (PHYSICS.reach / 3) * ring;
      ctx.globalAlpha = 0.10 + 0.04 * Math.sin(t * 1.8 + i);
      ctx.strokeStyle = PALETTE.anchor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(a.x, a.y, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // The post itself: a diamond, so it never reads as the pod or the exit.
    ctx.fillStyle = PALETTE.anchor;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y - 8);
    ctx.lineTo(a.x + 7, a.y);
    ctx.lineTo(a.x, a.y + 8);
    ctx.lineTo(a.x - 7, a.y);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawTrail(ctx, run) {
  const trail = run.trail;
  if (trail.length < 2) return;
  for (let i = 1; i < trail.length; i += 1) {
    const k = i / trail.length;
    ctx.globalAlpha = k * 0.5;
    ctx.strokeStyle = PALETTE.podTrail;
    ctx.lineWidth = 1 + k * 3.2;
    ctx.beginPath();
    ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
    ctx.lineTo(trail[i].x, trail[i].y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function drawPod(ctx, run, t) {
  const { x, y } = run.pod;
  const glow = ctx.createRadialGradient(x, y, 1, x, y, 26);
  glow.addColorStop(0, 'rgba(233,242,255,0.55)');
  glow.addColorStop(1, 'rgba(233,242,255,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, 26, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = PALETTE.pod;
  ctx.beginPath();
  ctx.arc(x, y, PHYSICS.pod, 0, Math.PI * 2);
  ctx.fill();

  // A tail that points along the velocity, so the pod's heading is obvious.
  const speed = Math.sqrt(run.pod.vx * run.pod.vx + run.pod.vy * run.pod.vy);
  if (speed > 6) {
    const ux = run.pod.vx / speed;
    const uy = run.pod.vy / speed;
    ctx.strokeStyle = 'rgba(233,242,255,0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - ux * 10, y - uy * 10);
    ctx.lineTo(x - ux * 22, y - uy * 22);
    ctx.stroke();
  }

  // A slow ring so the pod reads even when it is nearly still.
  ctx.globalAlpha = 0.3 + 0.15 * Math.sin(t * 4);
  ctx.strokeStyle = PALETTE.pod;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y, PHYSICS.pod + 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/** Where a click would put an anchor: a preview ring the player sees before committing. */
export function drawGhost(ctx, ghost) {
  if (ghost === null) return;
  ctx.save();
  ctx.translate(FIELD.x, FIELD.y);
  ctx.globalAlpha = 0.45;
  ctx.strokeStyle = PALETTE.anchor;
  ctx.setLineDash([4, 5]);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(ghost.x, ghost.y, PHYSICS.reach * 0.35, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(ghost.x - 7, ghost.y);
  ctx.lineTo(ghost.x + 7, ghost.y);
  ctx.moveTo(ghost.x, ghost.y - 7);
  ctx.lineTo(ghost.x, ghost.y + 7);
  ctx.stroke();
  ctx.restore();
}
