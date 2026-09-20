#!/usr/bin/env node
// Carry what a project costs, and when it happens, onto the structures that represent it.
//
//   The money already exists — every project zone in properties/<pid>.js carries a budget and a
//   timeline written by the owner. What it did not have was a way to reach the map, so a structure
//   standing on the ground said nothing about what building it would take.
//
//   THE RULE THAT SHAPES THIS FILE: never invent a figure, and never raise one's standing.
//
//   A budget string is carried across VERBATIM in `costSource`, and the parsed numbers beside it
//   exist only so things can be sorted and summed. If a string cannot be read as one honest range
//   — "P1: $70K-$80K | P2: $20K+ (flexible)" cannot — then `costUSD` is null and the basis is
//   `placeholder`. A compound or open-ended figure flattened into a single number is a number
//   nobody wrote, and on screen it would be indistinguishable from one somebody did.
//
//   `costBasis` defaults to `estimate` and is only ever raised by a human editing the row. An
//   estimate labelled as a quote is the failure that matters here: under-claiming costs a little
//   credibility, over-claiming costs much more than that in front of someone deciding whether to
//   put money in.
//
//   What is deliberately NOT carried: ROI and revenue projections. They live on the zone cards
//   where there is room to source and qualify them. A return figure as a bare attribute on a map
//   pin has nowhere to put its assumptions, and a return figure without its assumptions is a
//   claim rather than a number.
//
// Usage: node scripts/import-zone-costs.mjs --pid sulphur-mountain [--dry]

import { readFile, writeFile } from 'node:fs/promises';

const REGISTRY = new URL('../data/structures.json', import.meta.url);

/** landscape, not a programme line — these carry no budget of their own */
const NO_COST = new Set(['site-grounds', 'creek']);

const args = process.argv.slice(2);
const pid = args[args.indexOf('--pid') + 1];
const dry = args.includes('--dry');
if (!pid) { console.error('--pid required'); process.exit(2); }

const mod = await import(`../properties/${pid}.js`);
const property = Object.values(mod).find(v => v && typeof v === 'object' && Array.isArray(v.zones));
if (!property) throw new Error(`no property export with zones in properties/${pid}.js`);
const zones = new Map(property.zones.map(z => [z.id, z]));

/**
 * "Phase 1-3 (16 months)" -> { phase: 1, span: [1, 3] } ; "Phase 2" -> { phase: 2, span: [2, 2] }
 *
 *   The start alone turned out to be a poor key — every zone here begins in Phase 1, so `phase` on
 *   its own distinguishes nothing. What separates them is how far they RUN: the barn is Phase 1
 *   and finished, the house is Phase 1 through 3. The span is the useful number.
 */
function phaseOf(timeline) {
  const m = /Phase\s*(\d+)\s*(?:[-–—]\s*(\d+))?/i.exec(timeline || '');
  if (!m) return { phase: null, span: null };
  const lo = Number(m[1]);
  return { phase: lo, span: [lo, m[2] ? Number(m[2]) : lo] };
}

/**
 * One honest range, or nothing.
 *
 *   Accepts a single figure or a single range. Refuses anything carrying a second phase, a
 *   trailing `+`, or a `|` — those describe more than one commitment and cannot honestly become
 *   one number.
 */
function costOf(budget) {
  if (!budget) return null;
  const body = budget.replace(/\([^)]*\)/g, '').trim();          // drop the parenthetical
  if (/\||P\d\s*:|\+/.test(body)) return null;                   // compound or open-ended
  const nums = [...body.matchAll(/\$\s*([\d,]+(?:\.\d+)?)\s*([KkMm])?/g)].map(m => {
    const n = Number(m[1].replace(/,/g, ''));
    return m[2] ? n * (m[2].toLowerCase() === 'k' ? 1e3 : 1e6) : n;
  });
  if (!nums.length || nums.length > 2) return null;
  return { low: Math.min(...nums), high: Math.max(...nums) };
}

/** only ever downgrades; a human raises it */
function basisOf(budget, cost) {
  if (!cost) return 'placeholder';
  const s = (budget || '').toLowerCase();
  if (s.includes('takeoff')) return 'takeoff';
  if (s.includes('quote')) return 'quoted';
  return 'estimate';
}

const doc = JSON.parse(await readFile(REGISTRY, 'utf8'));
const set = [], skipped = [], unmatched = [];

for (const row of doc.structures) {
  if (row.pid !== pid) continue;
  if (NO_COST.has(row.id)) { skipped.push(row.id); continue; }
  const zone = zones.get(row.zone) || zones.get(row.id);
  if (!zone) { unmatched.push(row.id); continue; }

  const cost = costOf(zone.budget);
  const { phase, span } = phaseOf(zone.timeline);
  row.phase = phase;
  row.phaseSpan = span;
  row.costUSD = cost;
  row.costBasis = basisOf(zone.budget, cost);
  row.costSource = zone.budget || null;     // verbatim, always — this is what a reader should see
  row.timeline = zone.timeline || null;     // verbatim
  set.push(`${row.id}: phase ${span ? (span[0] === span[1] ? span[0] : span.join('–')) : '?'}`
    + ` · ${row.costBasis} · ${row.costSource}`);
}

console.log(set.length ? 'set:\n  ' + set.join('\n  ') : 'nothing set');
if (skipped.length) console.log(`\nno budget of their own (landscape): ${skipped.join(', ')}`);
if (unmatched.length) console.log(`\nNO ZONE FOUND — these carry no cost: ${unmatched.join(', ')}`);

const withCost = doc.structures.filter(r => r.costUSD);
const low = withCost.reduce((s, r) => s + r.costUSD.low, 0);
const high = withCost.reduce((s, r) => s + r.costUSD.high, 0);
console.log(`\n${withCost.length} of ${doc.structures.length} rows carry a parsable range; they sum to `
  + `$${low.toLocaleString()}–$${high.toLocaleString()}.`);
console.log('That sum is PARTIAL by construction — it omits every placeholder, all land and soft costs,\n'
  + 'and anything with no structure on the map. It is not a project cost and must never be shown as one.');

doc.updatedAt = new Date().toISOString().slice(0, 10);
if (!dry) await writeFile(REGISTRY, JSON.stringify(doc, null, 1) + '\n');
else console.log('\n(dry run — nothing written)');
