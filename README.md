# GRAVWELL — twelve rooms of bent light

A gravity-routing puzzle game that runs offline in a desktop browser from its own
static files. You do not steer the pod. You place posts, and the pod falls toward
them. Three posts a room, twelve rooms, three pods.

**Play:** `node serve.ts` then open <http://localhost:8080>.

## The loop

Each room drops a pod into a field of walls and spikes with a glowing exit well.
The pod drifts and is pulled by the posts you place; there is no thrust and no
brake. You get three posts, and a fourth click moves the oldest one, so placement
stays a live decision rather than a one-time guess. Reach the well before the
clock runs out. Hitting a wall, touching a spike or leaving the field costs a pod.

## Layout

- `game/index.html` — the page, 15 lines, one canvas and one module script.
- `game/src/config.js` — every tunable: palette, physics constants, rules, fonts.
- `game/src/physics.js` — the whole simulation. Fixed-step gravity, wall and spike
  collision, the clock, win detection. No DOM, no drawing.
- `game/src/rooms.js` — the twelve rooms, authored as data: walls, spikes, start,
  exit, time, and the hint the header shows.
- `game/src/render.js` — the play field: grid, walls, spikes, spikes' teeth, the
  exit well's inward rings, posts with their field lines, the pod's trail.
- `game/src/hud.js` — the right-hand panel and every overlay: title, room cleared,
  pod lost, out of pods, victory.
- `game/src/input.js` — pointer and keyboard, and nothing else.
- `game/src/audio.js` — every sound synthesised from an oscillator; no audio files.
- `game/src/main.js` — the state machine and the loop, and the debug handle the
  screenshot harness drives.
- `game/src/math.js` — clamp, lerp, distance, a seeded RNG for the starfield, the clock formatter.

## Screenshots

`screenshots/` holds four real renders of this game's own code, captured by
`shots.mjs` driving the running game in headless Chrome through its debug handle
(`window.__gravwell`). Nothing is composited or edited. Re-capture with:

```sh
node shots.mjs
```

The harness fails on any page error or console error, so a screenshot cannot be
older than the code that produced it.

## Hand-in

`main.ts` copies `game/` and `screenshots/` into the output directory and writes
`dossier.json` with the vendored `buildDossier`, so the bytes match what the gate
rebuilds. Outside the grader:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Licence

MIT. See `LICENSE`.
