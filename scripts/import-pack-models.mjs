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

/** the pack sets these — a rebuild upstream must reach the world */
const FROM_PACK = ['model', 'position', 'altitudeM', 'rotationDeg', 'outline'];

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

const created = [], updated = [], unchanged = [], problems = [];

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

  const row = byId.get(m.id);
  if (!row) {
    doc.structures.push({
      id: m.id, pid, mode: 'vision', status: 'model',
      name: m.name || `${title(m.id)} — massing`,
      note: m.note || '',
      outline: fresh.outline, model: fresh.model, position: fresh.position,
      altitudeM: fresh.altitudeM, rotationDeg: fresh.rotationDeg,
      scale: 1, enter: true, clears: []
    });
    created.push(m.id);
    continue;
  }

  const moved = FROM_PACK.filter(k => JSON.stringify(row[k]) !== JSON.stringify(fresh[k]));
  if (!moved.length) { unchanged.push(m.id); continue; }
  for (const k of moved) row[k] = fresh[k];
  updated.push(`${m.id} (${moved.join(', ')})`);
}

doc.updatedAt = new Date().toISOString().slice(0, 10);

const report = [
  created.length   ? `created:   ${created.join(', ')}` : null,
  updated.length   ? `updated:   ${updated.join('; ')}` : null,
  unchanged.length ? `unchanged: ${unchanged.join(', ')}` : null,
  problems.length  ? `PROBLEMS:\n  ${problems.join('\n  ')}` : null
].filter(Boolean).join('\n');
console.log(report || 'nothing in the manifest');
console.log(`\nregistry: ${doc.structures.length} rows` + (dry ? ' (dry run — nothing written)' : ''));
// A curated field is never overwritten, so this script cannot fix a bad one. That is the trade:
// re-running is always safe, and correcting a name or a `clears` means editing the registry by hand.
if ((created.length || updated.length) && !dry) {
  await writeFile(REGISTRY, JSON.stringify(doc, null, 1) + '\n');
}
if (problems.length) process.exitCode = 1;
