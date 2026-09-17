#!/usr/bin/env node
// scripts/make-og.mjs — render the social preview card to public/og.jpg.
//
//   node scripts/make-og.mjs
//
//   scripts/og-card.html is entirely self-contained (no fonts, images or scripts are
//   fetched) so the render is deterministic: re-running this produces the same bytes on
//   any machine with the same Chromium. Run it after editing the card, and commit the image.
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const card = resolve(here, 'og-card.html');
const out = resolve(here, '..', 'public', 'og.jpg');

const sys = ['/opt/pw-browsers/chromium', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find(existsSync);
const opts = {};
if (process.env.CHROMIUM_PATH) opts.executablePath = process.env.CHROMIUM_PATH;
else if (!existsSync(chromium.executablePath()) && sys) opts.executablePath = sys;

const browser = await chromium.launch(opts);
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto('file://' + card, { waitUntil: 'load' });
await page.waitForTimeout(250);          // let the gradients settle
// JPEG at 90: visually identical to the PNG on this card (flat fields, a soft gradient and
// large type) at a third of the bytes, so the scrapers that refetch it every share pay less.
await page.screenshot({ path: out, type: 'jpeg', quality: 90 });
await browser.close();
console.log('wrote ' + out);
