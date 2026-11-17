// The twelve rooms of GRAVWELL. Each room is authored, not generated: a start,
// an exit, the walls that make the route interesting, the spikes that punish a
// lazy line, and how many anchors the player gets to place. Coordinates are in
// field space (0..FIELD.w, 0..FIELD.h); the renderer offsets them.
//
// A room is solvable when some placement of `anchors` posts bends the pod from
// start to exit without touching a wall. The route is never the only one: the
// anchors are the player's, so the room only fixes the furniture.

export const ROOMS = [
  {
    name: 'FIRST FALL',
    hint: 'One post below the pod swings it right, into the mouth.',
    start: { x: 120, y: 90 },
    exit: { x: 700, y: 430, r: 40 },
    anchors: 3,
    time: 40,
    walls: [
      { x: 250, y: 0, w: 26, h: 300 },
      { x: 500, y: 250, w: 26, h: 320 },
      { x: 0, y: 470, w: 300, h: 26 },
    ],
    spikes: [],
  },
  {
    name: 'THE NARROWS',
    hint: 'Thread the gap: a post up high pulls the pod through, then let it fall.',
    start: { x: 90, y: 470 },
    exit: { x: 760, y: 120, r: 34 },
    anchors: 3,
    time: 38,
    walls: [
      { x: 260, y: 150, w: 24, h: 300 },
      { x: 260, y: 0, w: 24, h: 90 },
      { x: 470, y: 300, w: 24, h: 250 },
      { x: 470, y: 0, w: 24, h: 220 },
      { x: 660, y: 200, w: 24, h: 350 },
    ],
    spikes: [
      { x: 300, y: 470, w: 60, h: 18 },
    ],
  },
  {
    name: 'TWO WELLS',
    hint: 'Two posts make a pocket; the pod can rest in it while you re-plan.',
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
    start: { x: 424, y: 500 },
    exit: { x: 424, y: 60, r: 34 },
    anchors: 3,
    time: 42,
    walls: [
      { x: 330, y: 250, w: 188, h: 22 },
      { x: 330, y: 250, w: 22, h: 120 },
      { x: 496, y: 250, w: 22, h: 120 },
    ],
    spikes: [
      { x: 120, y: 250, w: 90, h: 22 },
      { x: 640, y: 250, w: 90, h: 22 },
    ],
  },
  {
    name: 'CROSSWIND',
    hint: 'Falling and pulling cancel in a narrow band; find the band.',
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
    start: { x: 760, y: 90 },
    exit: { x: 400, y: 470, r: 30 },
    anchors: 3,
    time: 42,
    walls: [
      { x: 300, y: 400, w: 22, h: 150 },
      { x: 480, y: 400, w: 22, h: 150 },
      { x: 300, y: 400, w: 202, h: 20 },
      { x: 590, y: 0, w: 22, h: 220 },
    ],
    spikes: [
      { x: 330, y: 380, w: 140, h: 16 },
    ],
  },
  {
    name: 'SIEVE',
    hint: 'The shelf has a hole. Slow beats fast through it.',
    start: { x: 90, y: 520 },
    exit: { x: 780, y: 90, r: 32 },
    anchors: 3,
    time: 44,
    walls: [
      { x: 0, y: 300, w: 330, h: 20 },
      { x: 420, y: 300, w: 430, h: 20 },
      { x: 600, y: 320, w: 20, h: 230 },
    ],
    spikes: [
      { x: 340, y: 320, w: 70, h: 18 },
    ],
  },
  {
    name: 'REBOUND',
    hint: 'Aim past the exit and let the corner throw you back.',
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
    start: { x: 640, y: 100 },
    exit: { x: 424, y: 300, r: 46 },
    anchors: 3,
    time: 48,
    walls: [
      { x: 340, y: 180, w: 20, h: 240 },
      { x: 490, y: 180, w: 20, h: 240 },
      { x: 340, y: 180, w: 170, h: 20 },
      { x: 340, y: 400, w: 170, h: 20 },
      { x: 120, y: 60, w: 20, h: 300 },
    ],
    spikes: [
      { x: 240, y: 470, w: 130, h: 20 },
    ],
  },
];

/** Field size, re-exported so a room can be validated without importing config. */
export const ROOM_FIELD = { w: 848, h: 552 };
