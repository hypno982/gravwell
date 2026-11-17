// The twelve rooms of GRAVWELL. Each room is authored, not generated: a start,
// an exit, the walls that make the route interesting, the spikes that punish a
// lazy line, and how many anchors the player gets to place. Coordinates are in
// field space (0..FIELD.w, 0..FIELD.h); the renderer offsets them.
//
// Every room carries a `solution`: a placement that provably wins it, found by
// the headless prover (solve.mjs) against the real physics module. The prover is
// the contract: change geometry, re-run `node solve.mjs`, and it must still say
// 12/12. The route is never the only one, but one route always exists.

export const ROOMS = [
  {
    name: 'FIRST FALL',
    hint: 'One post below the pod swings it right, into the mouth.',
    // Proven solvable by solve.mjs; do not change the geometry without re-running it.
    solution: [{ x: 698, y: 373 }],
    start: { x: 120, y: 90 },
    exit: { x: 700, y: 430, r: 40 },
    anchors: 3,
    time: 40,
    walls: [
      { x: 250, y: 0, w: 26, h: 140 },
      { x: 500, y: 390, w: 26, h: 162 },
      { x: 0, y: 470, w: 210, h: 26 },
    ],
    spikes: [],
  },
  {
    name: 'THE NARROWS',
    hint: 'Thread the gap: a post up high pulls the pod through, then let it fall.',
    // Proven solvable by solve.mjs; do not change the geometry without re-running it.
    solution: [{ x: 665, y: 120 }],
    start: { x: 90, y: 470 },
    exit: { x: 760, y: 120, r: 34 },
    anchors: 3,
    time: 38,
    walls: [
      { x: 260, y: 190, w: 24, h: 145 },
      { x: 480, y: 0, w: 24, h: 235 },
      { x: 660, y: 250, w: 24, h: 302 },
    ],
    spikes: [
      { x: 300, y: 470, w: 60, h: 18 },
    ],
  },
  {
    name: 'TWO WELLS',
    hint: 'Two posts make a pocket; the pod can rest in it while you re-plan.',
    // Proven solvable by solve.mjs; do not change the geometry without re-running it.
    solution: [{ x: 207, y: 77 }],
    start: { x: 640, y: 480 },
    exit: { x: 120, y: 110, r: 34 },
    anchors: 3,
    time: 40,
    walls: [
      { x: 0, y: 300, w: 260, h: 22 },
      { x: 590, y: 300, w: 260, h: 22 },
      { x: 380, y: 0, w: 22, h: 180 },
    ],
    spikes: [
      { x: 330, y: 540, w: 190, h: 20 },
    ],
  },
  {
    name: 'THE COMB',
    hint: 'Every tooth costs a moment. Post early, keep the arc wide.',
    // Proven solvable by solve.mjs; do not change the geometry without re-running it.
    solution: [{ x: 780, y: 205 }],
    start: { x: 80, y: 300 },
    exit: { x: 780, y: 300, r: 32 },
    anchors: 3,
    time: 42,
    walls: [
      { x: 210, y: 0, w: 20, h: 240 },
      { x: 210, y: 330, w: 20, h: 230 },
      { x: 360, y: 0, w: 20, h: 240 },
      { x: 360, y: 330, w: 20, h: 230 },
      { x: 510, y: 0, w: 20, h: 240 },
      { x: 510, y: 330, w: 20, h: 230 },
      { x: 660, y: 0, w: 20, h: 240 },
      { x: 660, y: 330, w: 20, h: 230 },
    ],
    spikes: [],
  },
  {
    name: 'DRIFT LINE',
    hint: 'A long diagonal. One post near the middle beats three at the ends.',
    // Proven solvable by solve.mjs; do not change the geometry without re-running it.
    solution: [{ x: 327, y: 332 }, { x: 543, y: 448 }, { x: 760, y: 470 }],
    start: { x: 110, y: 120 },
    exit: { x: 760, y: 470, r: 36 },
    anchors: 3,
    time: 40,
    walls: [
      { x: 300, y: 200, w: 190, h: 20 },
      { x: 420, y: 380, w: 220, h: 20 },
    ],
    spikes: [
      { x: 150, y: 300, w: 20, h: 200 },
    ],
  },
  {
    name: 'SPINDLE',
    hint: 'The centre post is tempting and wrong. Go around the rim.',
    // Proven solvable by solve.mjs; do not change the geometry without re-running it.
    solution: [{ x: 424, y: 112 }],
    start: { x: 424, y: 500 },
    exit: { x: 424, y: 60, r: 34 },
    anchors: 3,
    time: 42,
    walls: [
      { x: 120, y: 250, w: 250, h: 18 },
      { x: 490, y: 250, w: 238, h: 18 },
      { x: 120, y: 100, w: 190, h: 18 },
      { x: 560, y: 100, w: 170, h: 18 },
    ],
    spikes: [
      { x: 370, y: 380, w: 22, h: 120 },
      { x: 470, y: 380, w: 22, h: 120 },
    ],
  },
  {
    name: 'CROSSWIND',
    hint: 'Falling and pulling cancel in a narrow band; find the band.',
    // Proven solvable by solve.mjs; do not change the geometry without re-running it.
    solution: [{ x: 93, y: 132 }],
    start: { x: 100, y: 500 },
    exit: { x: 90, y: 90, r: 32 },
    anchors: 3,
    time: 40,
    walls: [
      { x: 240, y: 100, w: 22, h: 380 },
      { x: 400, y: 0, w: 22, h: 380 },
      { x: 560, y: 140, w: 22, h: 400 },
      { x: 720, y: 0, w: 22, h: 420 },
    ],
    spikes: [
      { x: 620, y: 560, w: 200, h: 20 },
    ],
  },
  {
    name: 'THE CUP',
    hint: 'Drop into the cup from the left. Approaching from above is fatal.',
    // Proven solvable by solve.mjs; do not change the geometry without re-running it.
    solution: [{ x: 425, y: 343 }, { x: 400, y: 470 }],
    start: { x: 760, y: 90 },
    exit: { x: 400, y: 470, r: 30 },
    anchors: 3,
    time: 42,
    walls: [
      { x: 300, y: 400, w: 22, h: 152 },
      { x: 480, y: 400, w: 22, h: 152 },
      { x: 590, y: 0, w: 22, h: 200 },
    ],
    spikes: [
      { x: 240, y: 470, w: 60, h: 18 },
    ],
  },
  {
    name: 'SIEVE',
    hint: 'The shelf has a hole. Slow beats fast through it.',
    // Proven solvable by solve.mjs; do not change the geometry without re-running it.
    solution: [{ x: 435, y: 210 }, { x: 712, y: 132 }],
    start: { x: 90, y: 520 },
    exit: { x: 780, y: 90, r: 32 },
    anchors: 3,
    time: 44,
    walls: [
      { x: 0, y: 300, w: 290, h: 20 },
      { x: 430, y: 300, w: 418, h: 20 },
      { x: 620, y: 320, w: 20, h: 200 },
    ],
    spikes: [
      { x: 100, y: 380, w: 70, h: 16 },
    ],
  },
  {
    name: 'REBOUND',
    hint: 'Aim past the exit and let the corner throw you back.',
    // Proven solvable by solve.mjs; do not change the geometry without re-running it.
    solution: [{ x: 519, y: 360 }, { x: 424, y: 525 }],
    start: { x: 424, y: 80 },
    exit: { x: 424, y: 500, r: 30 },
    anchors: 3,
    time: 42,
    walls: [
      { x: 200, y: 260, w: 140, h: 20 },
      { x: 510, y: 260, w: 140, h: 20 },
      { x: 380, y: 380, w: 90, h: 18 },
    ],
    spikes: [
      { x: 60, y: 380, w: 20, h: 180 },
      { x: 770, y: 380, w: 20, h: 180 },
    ],
  },
  {
    name: 'LAST LIGHT',
    hint: 'Everything you have learned, in one room.',
    // Proven solvable by solve.mjs; do not change the geometry without re-running it.
    solution: [{ x: 195, y: 90 }, { x: 380, y: 295 }, { x: 470, y: 500 }],
    start: { x: 100, y: 90 },
    exit: { x: 470, y: 500, r: 28 },
    anchors: 3,
    time: 46,
    walls: [
      { x: 250, y: 180, w: 20, h: 300 },
      { x: 400, y: 0, w: 20, h: 300 },
      { x: 550, y: 160, w: 20, h: 320 },
      { x: 700, y: 0, w: 20, h: 260 },
      { x: 250, y: 480, w: 150, h: 20 },
    ],
    spikes: [
      { x: 400, y: 330, w: 60, h: 16 },
      { x: 620, y: 520, w: 180, h: 20 },
    ],
  },
  {
    name: 'THE WELL',
    hint: 'The exit is the well. Fall in and the twelve rooms are done.',
    // Proven solvable by solve.mjs; do not change the geometry without re-running it.
    solution: [{ x: 545, y: 100 }, { x: 401, y: 233 }],
    start: { x: 640, y: 100 },
    exit: { x: 424, y: 300, r: 46 },
    anchors: 3,
    time: 48,
    walls: [
      { x: 340, y: 150, w: 20, h: 300 },
      { x: 490, y: 150, w: 20, h: 300 },
      { x: 120, y: 60, w: 20, h: 280 },
    ],
    spikes: [
      { x: 240, y: 470, w: 130, h: 20 },
    ],
  },
];

/** Field size, re-exported so a room can be validated without importing config. */
export const ROOM_FIELD = { w: 848, h: 552 };
