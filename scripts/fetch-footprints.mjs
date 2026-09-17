#!/usr/bin/env node
// scripts/fetch-footprints.mjs — bake the county's building footprints for every property.
//
//   node scripts/fetch-footprints.mjs [site] [--out data/footprints.json] [--dry]
//
//   Ventura County publishes a Building Footprints layer (DataDownloads/CommonData/0) with real
//   polygons, a real base elevation (z_min, metres) and a HEIGHT THAT IS A CLASS DEFAULT, not a
//   measurement — 20 ft for an occupied dwelling, 17 for agricultural, 8 for an outbuilding. The
//   atlas draws them as massing and says so; nothing here should be read as a measured roofline.
//
//   Baked rather than fetched live because it is a few dozen polygons that change once a year, and
//   because a committed file means the map draws buildings before any network round trip.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const FP = 'https://maps.ventura.org/arcgis/rest/services/DataDownloads/CommonData/MapServer/0/query';
const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const site = (args.find((a) => !a.startsWith('--')) || 'https://eco-village-map.vercel.app').replace(/\/$/, '');
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d; };
const out = resolve(here, '..', opt('out', 'data/footprints.json'));
const dry = args.includes('--dry');

const getJson = async (url) => { const r = await fetch(url, { headers: { Accept: 'application/json' } }); if (!r.ok) throw new Error('http ' + r.status + ' ' + url); return r.json(); };
const postForm = async (url, body) => {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(body) });
  if (!r.ok) throw new Error('http ' + r.status); return r.json();
};
const round = (n) => Math.round(n * 1e6) / 1e6;
const clean = (s) => String(s == null ? '' : s).trim().replace(/\s+/g, ' ');
const num = (v) => { const n = Number(String(v == null ? '' : v).replace(/[^0-9.]/g, '')); return Number.isFinite(n) && n > 0 ? n : null; };

// the ring winding the county returns is fine for GeoJSON fills; only close it if it is open
const toPolygon = (rings) => rings.map((r) => {
  const ring = r.map(([x, y]) => [round(x), round(y)]);
  const [a, b] = [ring[0], ring[ring.length - 1]];
  if (a[0] !== b[0] || a[1] !== b[1]) ring.push([a[0], a[1]]);
  return ring;
});
const centroid = (rings) => { const r = rings[0]; let x = 0, y = 0; for (const p of r) { x += p[0]; y += p[1]; } return [x / r.length, y / r.length]; };
const inRing = (pt, ring) => {   // ray casting
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
};

const query = (geometry) => postForm(FP, {
  geometry: JSON.stringify({ rings: geometry, spatialReference: { wkid: 4326 } }),
  geometryType: 'esriGeometryPolygon', inSR: '4326', outSR: '4326',
  spatialRel: 'esriSpatialRelIntersects', returnGeometry: 'true', outFields: '*', f: 'json'
});

const props = await getJson(site + '/api/properties');
const features = [];
let asked = 0;
for (const p of props) {
  const targets = [];
  if (p.apn) targets.push({ apn: p.apn, lid: null });
  for (const l of p.lots || []) if (l.apn) targets.push({ apn: l.apn, lid: l.id, rings: l.rings ? [l.rings.map(([lat, lng]) => [lng, lat])] : null });
  let found = 0;
  for (const t of targets) {
    let rings = t.rings;
    if (!rings) {
      const par = await getJson(site + '/api/parcel?apn=' + encodeURIComponent(t.apn) + (p.county ? '&county=' + p.county : ''));
      rings = (par.geometry || {}).rings;
    }
    if (!rings) continue;
    asked++;
    let fs = [];
    try { fs = (await query(rings)).features || []; } catch (e) { console.error('  ' + t.apn + ': ' + e.message); continue; }
    for (const f of fs) {
      const g = f.geometry && f.geometry.rings ? toPolygon(f.geometry.rings) : null;
      if (!g) continue;
      const c = centroid(g);
      if (!rings.some((r) => inRing(c, r))) continue;          // touching is not standing on it
      const a = f.attributes || {};
      features.push({ type: 'Feature', id: a.objectid, geometry: { type: 'Polygon', coordinates: g }, properties: {
        pid: p.id, lid: t.lid, apn: t.apn,
        kind: clean(a.buildingty), use: clean(a.building_d),
        heightFt: Number(a.height) || null, baseM: a.z_min == null ? null : Math.round(a.z_min * 100) / 100,
        year: clean(a.yr_blt) || null, sqft: num(a.flr_1a), sqft2: num(a.flr_2a),
        address: clean([a.situs_nr, a.situs_dir, a.situs_stre, a.situs_typ].filter(Boolean).join(' ')) || null
      } });
      found++;
    }
  }
  console.log('%s  %d structure%s', p.id.padEnd(22), found, found === 1 ? '' : 's');
}

const doc = {
  type: 'FeatureCollection',
  note: 'Ventura County building footprints. Geometry and base elevation (baseM, metres) are the county’s; heightFt is the county’s CLASS DEFAULT for the building type, not a measured roofline.',
  source: 'Ventura County GIS · DataDownloads/CommonData/0',
  parcelsAsked: asked, generated: new Date().toISOString().slice(0, 10),
  features
};
console.log('\n%d structures over %d parcels', features.length, asked);
if (dry) process.exit(0);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(doc, null, 1) + '\n');
console.log('wrote ' + out);
