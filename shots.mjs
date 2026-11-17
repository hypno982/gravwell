// The screenshot harness. Serves game/, drives the real game in a real Chrome
// through its own debug handle, and captures 1280x480 frames. Every shot is the
// game's own rendering, never a mock-up, and no page error is tolerated.
//
//   node shots.mjs            capture all shots
//   node shots.mjs --check    boot the game and assert zero page errors only

import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync, statSync } from 'node:fs';

const ROOT = resolve(fileURLToPath(new URL('./game', import.meta.url)));
const OUT = resolve(fileURLToPath(new URL('./screenshots', import.meta.url)));
const W = 1280;
const H = 480;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

function serve() {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let path = decodeURIComponent(url.pathname);
    if (path === '/') path = '/index.html';
    const full = join(ROOT, path);
    if (!full.startsWith(ROOT)) {
      res.writeHead(403).end('no');
      return;
    }
    try {
      const body = await readFile(full);
      res.writeHead(200, { 'Content-Type': MIME[extname(full)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('no');
    }
  });
  return new Promise((ok) => server.listen(0, () => ok(server)));
}

const SHOTS = [
  {
    name: '01-title.jpg',
    // The start: the game's own title screen, untouched.
    async drive(page) {
      await page.evaluate(() => window.__gravwell.jump(window.__gravwell.PHASE.TITLE));
      await page.waitForTimeout(600);
    },
  },
  {
    name: '02-play.jpg',
    // Play in progress: a real mid-run state from the proven solution, so the
    // shot shows the game's own physics doing the work.
    async drive(page) {
      await page.evaluate(() => {
        const g = window.__gravwell;
        // Room 5 (DRIFT LINE) uses all three posts and wins at 2.93 s, so parking
        // the sim at 1.5 s shows three posts, a curved trail, and the room still
        // in play -- the whole mechanic in one honest frame.
        g.setRoom(4, { lives: 3, cleared: 4, time: 38.5 });
        const sol = g.state.run.room.solution;
        g.solve(sol, 1.5);
        g.setClock(38.5);
      });
      await page.waitForTimeout(420);
    },
  },
  {
    name: '03-clear.jpg',
    // A room cleared: proves the win state and the restart-forward verb.
    async drive(page) {
      await page.evaluate(() => {
        const g = window.__gravwell;
        g.setRoom(3, { lives: 2, cleared: 3, time: 6.2 });
        g.state.roomsCleared = 4;
        g.jump(g.PHASE.CLEARED);
      });
      await page.waitForTimeout(520);
    },
  },
  {
    name: '04-victory.jpg',
    // The end: all twelve rooms, the run's numbers, the restart.
    async drive(page) {
      await page.evaluate(() => {
        const g = window.__gravwell;
        g.setRoom(11, { lives: 2, cleared: 12, time: 8.1 });
        g.state.roomsCleared = 12;
        g.state.totalPlaced = 31;
        g.state.timeSpent = 402;
        g.jump(g.PHASE.VICTORY);
      });
      await page.waitForTimeout(520);
    },
  },
];

const checkOnly = process.argv.includes('--check');

const server = await serve();
const port = server.address().port;
const base = `http://127.0.0.1:${port}/index.html`;

const browser = await chromium.launch({ args: ['--force-device-scale-factor=1', '--hide-scrollbars'] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });

const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`console.error: ${m.text()}`);
});

await page.goto(base, { waitUntil: 'load' });
await page.waitForFunction(() => !!window.__gravwell, null, { timeout: 15000 });
await page.waitForTimeout(400);

if (checkOnly) {
  await browser.close();
  server.close();
  if (errors.length > 0) {
    console.error(`FAIL: ${errors.length} page error(s)`);
    for (const e of errors) console.error('  ' + e);
    process.exit(1);
  }
  console.log('OK: game boots with zero page errors');
  process.exit(0);
}

mkdirSync(OUT, { recursive: true });
console.log(`capturing ${SHOTS.length} shots at ${W}x${H}`);

for (const shot of SHOTS) {
  await shot.drive(page);
  const path = join(OUT, shot.name);
  await page.screenshot({ path, type: 'jpeg', quality: 91 });
  console.log(`  ${shot.name}  ${statSync(path).size} bytes`);
}

await browser.close();
server.close();

if (errors.length > 0) {
  console.error(`\nFAIL: ${errors.length} page error(s) during capture`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}

console.log('OK: all shots captured with zero page errors');
