/**
 * generate-lottie.js
 * Builds the Lottie animation files used by the app (src/assets/lottie/*.json).
 *
 * Lottie is a JSON format for vector animations (the same format you download
 * from lottiefiles.com). Each file has layers; each layer has shapes and a
 * transform (position, rotation, scale, opacity) whose values can change over
 * time using keyframes. The `lottie-react-native` package plays these files.
 *
 * Run:  node scripts/generate-lottie.js
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'src', 'assets', 'lottie');
const FPS = 60;

// ---------- small helpers ----------------------------------------------------

const hex = h => {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, 1];
};
const still = k => ({ a: 0, k });
const ease = { i: { x: [0.25], y: [1] }, o: { x: [0.4], y: [0] } };
/** Animated value: frames = [[time, value], ...] */
const anim = frames => ({
  a: 1,
  k: frames.map(([t, s], idx) =>
    idx < frames.length - 1 ? { t, s: [].concat(s), ...ease } : { t, s: [].concat(s) },
  ),
});

const transform = ({ p, r = still(0), s = still([100, 100, 100]), o = still(100), a = still([0, 0, 0]) }) => ({
  o,
  r,
  p,
  a,
  s,
});

const rect = (w, h, radius, color, stroke) => ({
  ty: 'gr',
  it: [
    { ty: 'rc', d: 1, s: still([w, h]), p: still([0, 0]), r: still(radius) },
    { ty: 'fl', c: still(hex(color)), o: still(100), r: 1 },
    ...(stroke
      ? [{ ty: 'st', c: still(hex(stroke)), o: still(100), w: still(4), lc: 2, lj: 2 }]
      : []),
    { ty: 'tr', p: still([0, 0]), a: still([0, 0]), s: still([100, 100]), r: still(0), o: still(100) },
  ],
});

const ellipse = (size, color, strokeOnly) => ({
  ty: 'gr',
  it: [
    { ty: 'el', d: 1, s: still([size, size]), p: still([0, 0]) },
    strokeOnly
      ? { ty: 'st', c: still(hex(color)), o: still(100), w: still(8), lc: 2, lj: 2 }
      : { ty: 'fl', c: still(hex(color)), o: still(100), r: 1 },
    { ty: 'tr', p: still([0, 0]), a: still([0, 0]), s: still([100, 100]), r: still(0), o: still(100) },
  ],
});

let layerIndex = 0;
const layer = (name, ks, shapes, op) => ({
  ddd: 0,
  ind: ++layerIndex,
  ty: 4,
  nm: name,
  sr: 1,
  ks,
  ao: 0,
  shapes,
  ip: 0,
  op,
  st: 0,
  bm: 0,
});

const animation = (name, seconds, layers, size = 400) => ({
  v: '5.7.4',
  fr: FPS,
  ip: 0,
  op: seconds * FPS,
  w: size,
  h: size,
  nm: name,
  ddd: 0,
  assets: [],
  layers,
});

// Theme colours (same as src/theme.ts)
const COLORS = ['#2DD4BF', '#F59E0B', '#F43F5E', '#A78BFA', '#38BDF8', '#FACC15'];

// Repeatable pseudo-random numbers so the files are identical every run.
let seed = 502;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

// ---------- 1. confetti: burst from the centre, then fall and fade -----------

function confetti() {
  layerIndex = 0;
  const op = 150;
  const layers = [];
  for (let i = 0; i < 46; i++) {
    const angle = rand() * Math.PI * 2;
    const dist = 90 + rand() * 120;
    const midX = 200 + Math.cos(angle) * dist;
    const midY = 200 + Math.sin(angle) * dist - 40;
    const endY = midY + 120 + rand() * 80;
    const delay = Math.floor(rand() * 10);
    const color = COLORS[i % COLORS.length];
    const shape = i % 3 === 0 ? ellipse(10, color) : rect(8, 16, 2, color);
    layers.push(
      layer(
        `piece${i}`,
        transform({
          p: anim([
            [delay, [200, 200, 0]],
            [delay + 35, [midX, midY, 0]],
            [op, [midX + (rand() - 0.5) * 40, endY, 0]],
          ]),
          r: anim([
            [0, 0],
            [op, (rand() > 0.5 ? 1 : -1) * (360 + rand() * 360)],
          ]),
          o: anim([
            [0, 0],
            [delay + 2, 100],
            [100, 100],
            [op, 0],
          ]),
        }),
        [shape],
        op,
      ),
    );
  }
  return animation('confetti', op / FPS, layers);
}

// ---------- 2. logo: a fan of four cards opening and closing ------------------

function cardFan() {
  layerIndex = 0;
  const op = 180;
  const fills = ['#F8F5EE', '#F8F5EE', '#F8F5EE', '#F8F5EE'];
  const borders = ['#2DD4BF', '#F59E0B', '#F43F5E', '#A78BFA'];
  const angles = [-30, -10, 10, 30];
  const layers = [];

  // Glow ring pulsing behind the cards (drawn first = at the bottom)
  const cards = angles.map((angle, i) =>
    layer(
      `card${i}`,
      transform({
        p: still([200, 290, 0]),
        a: still([0, 90, 0]), // rotate around the bottom centre of the card
        r: anim([
          [0, 0],
          [50, angle],
          [130, angle],
          [op, 0],
        ]),
        s: anim([
          [0, [92, 92, 100]],
          [50, [100, 100, 100]],
          [130, [100, 100, 100]],
          [op, [92, 92, 100]],
        ]),
      }),
      [rect(110, 160, 14, fills[i], borders[i]), ellipse(26, borders[i])],
      op,
    ),
  );
  // Lottie draws the FIRST layer on top, so reverse to put the right-hand card on top.
  layers.push(...cards.reverse());
  layers.push(
    layer(
      'glow',
      transform({
        p: still([200, 210, 0]),
        s: anim([
          [0, [80, 80, 100]],
          [90, [110, 110, 100]],
          [op, [80, 80, 100]],
        ]),
        o: anim([
          [0, 35],
          [90, 10],
          [op, 35],
        ]),
      }),
      [ellipse(300, '#2DD4BF', true)],
      op,
    ),
  );
  return animation('card-fan', op / FPS, layers);
}

// ---------- 3. eliminated: red ring pulse with a cross popping in ------------

function eliminated() {
  layerIndex = 0;
  const op = 90;
  const bar = rot =>
    layer(
      `bar${rot}`,
      transform({
        p: still([200, 200, 0]),
        r: still(rot),
        s: anim([
          [10, [0, 0, 100]],
          [35, [115, 115, 100]],
          [50, [100, 100, 100]],
        ]),
      }),
      [rect(170, 30, 15, '#F43F5E')],
      op,
    );
  const ring = (delay, name) =>
    layer(
      name,
      transform({
        p: still([200, 200, 0]),
        s: anim([
          [delay, [40, 40, 100]],
          [delay + 50, [130, 130, 100]],
        ]),
        o: anim([
          [delay, 90],
          [delay + 50, 0],
        ]),
      }),
      [ellipse(260, '#F43F5E', true)],
      op,
    );
  return animation('eliminated', op / FPS, [bar(45), bar(-45), ring(0, 'ring1'), ring(25, 'ring2')]);
}

// ---------- write files -------------------------------------------------------

fs.mkdirSync(OUT, { recursive: true });
for (const [file, data] of [
  ['confetti.json', confetti()],
  ['card-fan.json', cardFan()],
  ['eliminated.json', eliminated()],
]) {
  fs.writeFileSync(path.join(OUT, file), JSON.stringify(data));
  console.log('wrote', file);
}
