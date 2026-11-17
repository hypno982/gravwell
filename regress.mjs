// Regression gate: every room's recorded `solution` must still win, from the
// real physics, right now. Cheap enough to run before every commit.
import { ROOMS } from './game/src/rooms.js';
import { createRun, advance, placeAnchor, clearAnchors } from './game/src/physics.js';
const H = 1/120;
let bad = 0;
for (let i = 0; i < ROOMS.length; i++) {
  const room = ROOMS[i];
  const run = createRun(room, i);
  clearAnchors(run);
  for (const p of room.solution) placeAnchor(run, p.x, p.y);
  let ev = null;
  for (let k = 0; k < Math.round((room.time ?? 34)/H); k++) {
    ev = advance(run, H);
    if (ev) break;
  }
  const ok = ev === 'won';
  if (!ok) bad++;
  console.log(`room ${String(i+1).padStart(2)} ${ok ? 'OK  ' : 'FAIL'} ${room.name.padEnd(13)} ${ok ? '' : `ev=${ev} reason=${run.reason}`}`);
}
console.log(bad === 0 ? '\nPASS: all 12 recorded solutions still win' : `\nFAIL: ${bad} room(s) regressed`);
process.exit(bad === 0 ? 0 : 1);
