// Headless solvability prover. Imports the real physics module (no browser), so
// "solvable" here means exactly what the game means by it.
//
//   node solve.mjs          prove every room
//   node solve.mjs 3        prove room 3 only
//
// Strategy per room: the pod is thrown from start to exit, so every useful post
// sits near that line or off it by one cell. Search singles, then pairs, then
// triples, with a wall-clock budget per room. Prints the winning placement so it
// can be pasted into rooms.js as that room's `solution`.

import { ROOMS } from './game/src/rooms.js';
import { createRun, advance, placeAnchor, clearAnchors } from './game/src/physics.js';

const H = 1 / 120;

function simulate(room, posts) {
  const run = createRun(room, 0);
  clearAnchors(run);
  for (const p of posts) placeAnchor(run, p.x, p.y);
  const budget = room.time ?? 34;
  const steps = Math.round(budget / H);
  for (let i = 0; i < steps; i++) {
    const ev = advance(run, H);
    if (ev === 'won') return { won: true, run };
    if (ev === 'lost') return { won: false, run };
  }
  return { won: false, run };
}

/** Candidate posts: along the start->exit line, and one cell off it either way. */
function pool(room) {
  const { start, exit } = room;
  const pts = [];
  const push = (x, y) => {
    if (x > 10 && x < 838 && y > 10 && y < 542) pts.push({ x: Math.round(x), y: Math.round(y) });
  };
  for (let t = 0; t <= 1.0001; t += 1 / 6) {
    const bx = start.x + (exit.x - start.x) * t;
    const by = start.y + (exit.y - start.y) * t;
    push(bx, by);
    push(bx + 95, by);
    push(bx - 95, by);
    push(bx, by + 95);
    push(bx, by - 95);
  }
  // Just past the exit on the approach side: the classic "fall into the well" post.
  const ux = (start.x - exit.x);
  const uy = (start.y - exit.y);
  const m = Math.hypot(ux, uy) || 1;
  push(exit.x + (ux / m) * 80, exit.y + (uy / m) * 80);
  push(exit.x + (ux / m) * 150, exit.y + (uy / m) * 150);
  // Dedupe on a coarse grid.
  const seen = new Set();
  return pts.filter((p) => {
    const k = `${Math.round(p.x / 20)}:${Math.round(p.y / 20)}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function solve(room, deadline) {
  const p = pool(room);
  const far = (a, b) => Math.hypot(a.x - b.x, a.y - b.y) >= 45;

  for (const a of p) {
    if (Date.now() > deadline) return null;
    if (simulate(room, [a]).won) return [a];
  }
  for (const a of p) {
    for (const b of p) {
      if (Date.now() > deadline) return null;
      if (!far(a, b)) continue;
      if (simulate(room, [a, b]).won) return [a, b];
    }
  }
  for (const a of p) {
    for (const b of p) {
      if (!far(a, b)) continue;
      for (const c of p) {
        if (Date.now() > deadline) return null;
        if (!far(a, c) || !far(b, c)) continue;
        if (simulate(room, [a, b, c]).won) return [a, b, c];
      }
    }
  }
  return null;
}

const only = process.argv[2] ? Number(process.argv[2]) - 1 : null;
const budgetMs = Number(process.env.BUDGET_MS ?? 25000);

let ok = 0;
let total = 0;
for (let i = 0; i < ROOMS.length; i++) {
  if (only !== null && i !== only) continue;
  total++;
  const room = ROOMS[i];
  const sol = solve(room, Date.now() + budgetMs);
  if (sol) ok++;
  const label = sol ? 'OK  ' : 'FAIL';
  console.log(`room ${String(i + 1).padStart(2)} ${label} ${String(room.name).padEnd(14)} ${sol ? JSON.stringify(sol) : `(no placement in ${budgetMs}ms)`}`);
}
console.log(`\n${ok}/${total} solvable`);
process.exit(ok === total ? 0 : 1);
