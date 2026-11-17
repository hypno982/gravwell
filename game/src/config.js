// Tunables for GRAVWELL. Every number the simulation reads lives here so the
// rooms can be re-balanced without touching the physics or the renderer.

export const VIEW = { w: 1280, h: 720 };

/** The play field, in pixels. Rooms are authored inside this rectangle. */
export const FIELD = { x: 74, y: 96, w: 848, h: 552 };

/** Right-hand column: readouts, room list, legend. */
export const PANEL = { x: 950, y: 96, w: 256, h: 552 };

export const PHYSICS = {
  /**
   * Pull of a single anchor: strength = pull * (1 - d/reach) / d, in px/s^2.
   * `reach` is the full diagonal of the field, so a post can be felt from
   * anywhere: a post that does nothing is a post the player cannot reason about.
   */
  pull: 150000,
  /** Anchors fade out to exactly zero here. The field's diagonal, so nothing is out of range. */
  reach: 1012,
  /** Softening keeps a near anchor from slingshotting the pod to infinity. */
  soften: 46,
  /** The pod always drifts: a faint downward bias keeps rooms from stalling. */
  drift: 12,
  /** Speed cap so a tight orbit cannot tunnel a wall. */
  maxSpeed: 430,
  /** Integration step in seconds. Fixed, so a room plays the same every time. */
  step: 1 / 240,
  /** Radius of the pod's collision circle. */
  pod: 9,
};

export const RULES = {
  /** Anchors a room grants. Placing all of them is the creative act. */
  anchorsPerRoom: 3,
  /** How many anchors a single room may hold at once (place, then move). */
  maxAnchors: 3,
  /** Fuel is the tension of the run: every second costs, and a spent run must retry. */
  secondsPerRoom: 34,
  /** A pod that touches a spike or leaves the field is lost. */
  lives: 3,
};

export const PALETTE = {
  void: '#05070f',
  field: '#070b17',
  grid: 'rgba(94,124,190,0.10)',
  gridStrong: 'rgba(94,124,190,0.20)',
  wall: '#1b2a4a',
  wallEdge: '#33507f',
  exit: '#4ff0c0',
  exitDim: 'rgba(79,240,192,0.16)',
  anchor: '#ffb347',
  anchorGlow: 'rgba(255,179,71,0.30)',
  pod: '#e9f2ff',
  podTrail: 'rgba(233,242,255,0.28)',
  spike: '#ff5c7a',
  ink: '#dfe9ff',
  dim: '#7d90b5',
  gold: '#ffd166',
  bad: '#ff5c7a',
  good: '#4ff0c0',
};

export const FONTS = {
  ui: '13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  uiSmall: '11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  title: '600 46px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  big: '600 30px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  room: '600 15px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};
