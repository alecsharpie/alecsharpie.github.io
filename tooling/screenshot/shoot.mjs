// Simple Playwright screenshot loop for visual iteration.
// Usage:  node shoot.mjs [path]    (path defaults to the silhouette prototype)
// Env:    URL=...   full origin+path override
//         PORT=8011 port the local static server is on
//         HOST=...  host (default 127.0.0.1)
//
// Captures a few framings (desktop hero, desktop full-page, mobile full-page)
// into ./shots/ so the agent can Read them and iterate against pixels.

import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, 'shots');
mkdirSync(outDir, { recursive: true });

const PORT = process.env.PORT || '8011';
const HOST = process.env.HOST || '127.0.0.1';
const path = process.argv[2] || '/prototypes/silhouette.html';
const url = process.env.URL || `http://${HOST}:${PORT}${path}`;

// This page uses a position:fixed diorama frame, so a fullPage shot would only
// paint the frame once at the top. Instead we capture viewport shots at several
// scroll fractions to see how the frame holds around the content the whole way down.
const shots = [
  { name: 'desktop-top',    w: 1440, h: 900, scroll: 0.0 },
  { name: 'desktop-mid',    w: 1440, h: 900, scroll: 0.5 },
  { name: 'desktop-bottom', w: 1440, h: 900, scroll: 1.0 },
  { name: 'mobile-top',     w: 390,  h: 844, scroll: 0.0 },
  // close-ups to judge the cut-paper edge quality of the margin foliage
  { name: 'detail-left',    w: 1440, h: 900, scroll: 0.0, clip: { x: 0,    y: 30, width: 380, height: 820 } },
  { name: 'detail-right',   w: 1440, h: 900, scroll: 0.0, clip: { x: 1060, y: 30, width: 380, height: 820 } },
];

const browser = await chromium.launch();
console.log(`shooting ${url}`);
for (const s of shots) {
  const ctx = await browser.newContext({
    viewport: { width: s.w, height: s.h },
    deviceScaleFactor: 2,
    reducedMotion: 'no-preference',
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate((f) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, Math.round(max * f));
  }, s.scroll);
  await page.waitForTimeout(800); // let eased parallax settle
  const file = resolve(outDir, `${s.name}.png`);
  await page.screenshot({ path: file, ...(s.clip ? { clip: s.clip } : {}) });
  console.log(`  -> ${s.name}.png`);
  await ctx.close();
}
await browser.close();
console.log('done');
