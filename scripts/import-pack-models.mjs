#!/usr/bin/env node
// Bring a community pack's models into the registry.
//
//   A pack publishes models.json — what it built, where it sits, how big it is. The registry says
//   what the world draws. Those are two different jobs held by two different people, and this is the
//   seam between them. Before this script the seam was hand-edited JSON, which works exactly once
//   and then rots: a model gets rebuilt, its bytes change, and the registry quietly describes a file
//   that no longer exists.
//
//   THE SPLIT, and everything here follows from it:
//
//     The PACK owns geometry and provenance — where the model is, which way it faces, how far off
//     the ground, what ground it covers, and the file itself. Those are facts about the thing that
//     was built, and the pack is the only one who knows them. This script overwrites them every run.
//
//     The REGISTRY owns curation — whether it is drawn at all, whether you can walk into it, what it
//     clears, what it is called, what the map says about it. Those are decisions, not facts. This
//     script writes them once when a model first appears and NEVER touches them again, so a rebuild
//     upstream cannot undo a judgement made here.
//
//   That is why a re-run after a pack ships a new version of a model is safe, and why it is the
//   normal way to use this rather than an exceptional one.
//
//   Note the footprint is the ground the model CLEARS, not everything the model touches. Walkable
//   ground outside it is deliberate — stepping stones threading between oaks that must not be
//   cleared. See scripts/check-placement.mjs for what that means for planting.
//
// Usage:
//   node scripts/import-pack-models.mjs --pid sulphur-mountain --dry
//   node scripts/import-pack-models.mjs --pid sulphur-mountain

import { readFile, writeFile } from 'node:fs/promises';

const PACKS = {
  'sulphur-mountain': 'https://raw.githubusercontent.com/SacredRebel/sulphur-mountain-world/main/'
};

const REGISTRY = new URL('../data/structures.json', import.meta.url);

/**
 * Registry rows that were named before the pack existed, and whose names did not converge.
 *
 *   The pack calls the house `oak-leaf-massing`; the registry has called it `sulphur-oak-house`
 *   since before there was a pack. Without this map an import creates a SECOND row for the same
 *   building — two houses on one knoll, both real as far as the world is concerned.
 */
const ALIASES = { 'oak-leaf-massing': 'sulphur-oak-house' };

/**
 * The only field the pack OWNS.
 *
 *   The first version of this script also overwrote position, altitude, rotation and outline on
 *   every run, on the reasoning that those are facts about the built thing. That was wrong, and
 *   the Oak Leaf proved it: the pack proposed a 4-point bounding box of 2,767 m2 where the
 *   registry held a deliberately shaped 56-point outline of 1,064 m2. Importing it would have
 *   cleared 1,700 m2 more ground — including the recorded oaks that the oak lounge and the sacred
 *   garden exist to stand under. The registry's own note says not to clear them.
 *
 *   An outline is two things at once: where a building sits, and WHICH TREES DIE. The second is a
 *   judgement, and judgements are the registry's. Placement is the same — the pack knows where its
 *   model's origin is, the registry decides where on the earth that origin goes. The manifest's
 *   own header agrees: "Agent C never writes the registry."
 *
 *   So the pack owns the FILE, and proposes everything else. A proposal that differs from what is
 *   recorded is REPORTED, not applied.
 */
const FROM_PACK = ['model'];

/** the pack proposes these; the registry sets them once and a human changes them after that */
const PROPOSED = ['position', 'altitudeM', 'rotationDeg', 'outline'];

/** a proposal further than this from the record is worth a human's attention, in metres */
const DIVERGENCE_M = 1.0;

const args = process.argv.slice(2);
const pid = args[args.indexOf('--pid') + 1];
const dry = args.includes('--dry');
if (!pid || !PACKS[pid]) {
  console.error(`unknown pack '${pid}'. known: ${Object.keys(PACKS).join(', ')}`);
  process.exit(2);
}
const base = PACKS[pid];

const title = id => id.split('-').map(w => (w === 'the' ? 'The' : w[0].toUpperCase() + w.slice(1))).join(' ');

const manifest = await (await fetch(base + 'models.json')).json();
if (manifest.schema !== 1) throw new Error(`models.json schema ${manifest.schema}, expected 1`);

const doc = JSON.parse(await readFile(REGISTRY, 'utf8'));
const byId = new Map(doc.structures.map(r => [r.id, r]));

const created = [], updated = [], unchanged = [], problems = [], proposals = [];

for (const m of manifest.models) {
  // the manifest says how big the file is; if the file disagrees, the manifest has drifted from what
  // was actually published and every number in it is now suspect, including the ones we are about to
  // write into the registry
  const head = await fetch(m.url, { method: 'HEAD' });
  if (!head.ok) { problems.push(`${m.id}: model URL returned ${head.status}`); continue; }
  const served = Number(head.headers.get('content-length'));
  if (m.bytes && served && served !== m.bytes) {
    problems.push(`${m.id}: manifest says ${m.bytes} B, the URL serves ${served} B — manifest is stale`);
    continue;
  }

  const fresh = {
    model: m.url,
    position: m.origin,
    altitudeM: m.altitudeM ?? 0,
    rotationDeg: m.rotationDeg ?? 0,
    outline: m.footprint
  };

  const rowId = ALIASES[m.id] || m.id;
  const row = byId.get(rowId);
  if (!row) {
    doc.structures.push({
      id: rowId, pid, mode: 'vision', status: 'model',
      name: m.name || `${title(m.id)} — massing`,
      note: m.note || '',
      outline: fresh.outline, model: fresh.model, position: fresh.position,
      altitudeM: fresh.altitudeM, rotationDeg: fresh.rotationDeg,
      scale: 1, enter: true, clears: []
    });
    created.push(rowId);
    continue;
  }

  // what the pack owns, applied
  const moved = FROM_PACK.filter(k => JSON.stringify(row[k]) !== JSON.stringify(fresh[k]));
  for (const k of moved) row[k] = fresh[k];

  // what the pack proposes, reported — never applied over a decision already made
  const area = (ring) => {
    let s = 0;
    for (let i = 0; i < ring.length; i++) {
      const [x1, y1] = ring[i], [x2, y2] = ring[(i + 1) % ring.length];
      s += x1 * y2 - x2 * y1;
    }
    return Math.abs(s) / 2 * 91818.2 * 110540;
  };
  for (const k of PROPOSED) {
    if (JSON.stringify(row[k]) === JSON.stringify(fresh[k])) continue;
    if (k === 'position') {
      const d = Math.hypot((fresh.position[0] - row.position[0]) * 91818.2,
                           (fresh.position[1] - row.position[1]) * 110540);
      if (d >= DIVERGENCE_M) proposals.push(`${rowId}: pack would move it ${d.toFixed(1)} m`);
    } else if (k === 'altitudeM') {
      const d = Math.abs(fresh.altitudeM - row.altitudeM);
      if (d >= 0.05) proposals.push(`${rowId}: pack would change altitude by ${d.toFixed(2)} m`);
    } else if (k === 'outline') {
      const was = area(row.outline), now = area(fresh.outline);
      if (Math.abs(now - was) >= 1) proposals.push(`${rowId}: pack proposes a ${fresh.outline.length}-point `
        + `outline of ${Math.round(now).toLocaleString()} m2 over the recorded ${row.outline.length}-point `
        + `${Math.round(was).toLocaleString()} m2 (${now > was ? '+' : ''}${Math.round(now - was).toLocaleString()} m2 CLEARED)`);
    } else {
      proposals.push(`${rowId}: pack proposes ${k} ${JSON.stringify(fresh[k])}, recorded ${JSON.stringify(row[k])}`);
    }
  }

  if (!moved.length) { unchanged.push(rowId); continue; }
  updated.push(`${rowId} (${moved.join(', ')})`);
}

doc.updatedAt = new Date().toISOString().slice(0, 10);

const report = [
  created.length   ? `created:   ${created.join(', ')}` : null,
  updated.length   ? `updated:   ${updated.join('; ')}` : null,
  unchanged.length ? `unchanged: ${unchanged.join(', ')}` : null,
  problems.length  ? `PROBLEMS:\n  ${problems.join('\n  ')}` : null,
  proposals.length ? `\nTHE PACK PROPOSES CHANGES THAT WERE NOT APPLIED — a human decides these:\n  `
    + proposals.join('\n  ') : null
].filter(Boolean).join('\n');
console.log(report || 'nothing in the manifest');
console.log(`\nregistry: ${doc.structures.length} rows` + (dry ? ' (dry run — nothing written)' : ''));
// A curated field is never overwritten, so this script cannot fix a bad one. That is the trade:
// re-running is always safe, and correcting a name or a `clears` means editing the registry by hand.
if ((created.length || updated.length) && !dry) {
  await writeFile(REGISTRY, JSON.stringify(doc, null, 1) + '\n');
}
if (problems.length) process.exitCode = 1;
