// The atlas (/): boots the real bundle against stub tiles and a stubbed county record, then drives
// every part of the HUD — layers, flights, historic topo, 3D, cards, galleries, the dive, the editor,
// territories, the ground readout, lot cards, orbit, the record, search, research, compare, the
// shared list and the editor gate — asserting on each step. Software GL, so the scene is kept light.
import { launch, check, done, PNG, DEM, BASE, EXT, OUT } from './lib.mjs';
import { join } from 'path';

const IMG64 = PNG.toString('base64');
const b = await launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
const pg = await ctx.newPage();
const errs = []; pg.on('pageerror', e => errs.push('PAGE ' + e.message)); pg.on('console', m => { if (['warning', 'error'].includes(m.type())) errs.push('CONSOLE ' + m.text().slice(0, 220)); });
const seen = {}; const bad = []; pg.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url().slice(0, 120)); });

// ---- stubs: the county record, the parcel anchor, USGS elevation, the shared research list, every raster host ----
const SHARED = [{ apn: '011-0-040-135', county: '06111', situs: '1006 DAYTONA DR', acreage: 5.1, center: [34.44, -119.25], bbox: null, rings: null, savedAt: '2026-09-01T00:00:00.000Z' }];
await pg.route('**/*', r => {
  const u = r.request().url();
  if (/3DEPElevation\/ImageServer\/identify/.test(u)) return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ value: '412.7' }) });
  if (u.includes('/api/research') && r.request().method() === 'GET') return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ items: SHARED, synced: true }) });
  if (u.includes('/api/dossier')) {
    const part = /part=deep/.test(u) ? 'deep' : 'core'; const pt = /lat=/.test(u);
    const core = { part: 'core', apn: pt ? '035-0-030-285' : '037-0-012-125', apn10: '0370012125', situs: pt ? null : '11962 SULPHUR MOUNTAIN RD', acreage: 9.47, center: [34.4326, -119.1564], bbox: { xmin: -119.159, ymin: 34.4316, xmax: -119.1546, ymax: 34.4337 }, geometry: { rings: [[[-119.159, 34.4316], [-119.1546, 34.4316], [-119.1546, 34.4337], [-119.159, 34.4337], [-119.159, 34.4316]]] }, county: { fips: '06111', name: 'Ventura County', state: 'CA', stateName: 'California', adapter: 'ventura', authority: 'Ventura County GIS · Assessor' },
      flags: [{ level: 'watch', key: 'fire', text: 'Very High fire severity — check insurability early.' }, { level: 'good', key: 'records', text: '10 recorded maps cover this parcel, back to 1872.' }],
      sections: [{ id: 'identity', label: 'Identity & location', rows: [['APN', '037-0-012-125', 'apn'], ['Situs address', '11962 SULPHUR MOUNTAIN RD', 'situs'], ['County', 'Ventura County, California', 'county']] }, { id: 'valuation', label: 'Assessor · valuation & transfer', rows: [['Assessed land value', '$961,860', 'land_value'], ['Total assessed value', '$1,078,140', 'total_value'], ['Assessed land per acre', '$101,569', 'value_per_ac']] }, { id: 'title', label: 'Ownership & title', rows: [['Owner on the 2018 assessor roll', 'Dolan Rebecca Trust · mailing address in Paso Robles, CA', 'owner_2018'], ['Owner of record today', 'Changed or re-titled after the 2018 snapshot: the roll’s last document is a deed (D) 2024000052341 of August 2, 2024', 'owner_now'], ['Last recorded document (live roll)', 'deed (D) · 2024000052341 · August 2, 2024', 'doc_nr'], ['Sale price on the roll', 'None carried on the live roll; the last arm’s-length sale on the 2018 snapshot was November 29, 1978 at ≈$117,500', 'sale_price'], ['Title timeline (public roll)', 'November 29, 1978 — sale · ≈$117,500', 'chain0'], ['', 'August 2, 2024 — deed (D) · 2024000052341 · change in ownership', 'chain1'], ['Assessed value, 2018 roll → today', '$233,853 → $1,078,140 (+361 %)', 'value_change']] }, { id: 'landuse', label: 'Land use & entitlement', rows: [['Zoning', 'RA-5 ac/HCWC', 'zoning'], ['Base zone', 'Rural Agricultural (RA)', 'zone_def'], ['General Plan', 'Rural', 'genplan'], ['Williamson Act', 'Not under a Williamson Act (Land Conservation Act) contract', 'williamson']] }, { id: 'fire', label: 'Wildfire', rows: [['Fire hazard severity', 'Very High · State Responsibility Area', 'fire_sev'], ['Wildfires on record over this ground', '1 — Sulpher Mountain (1929)', 'fires']] }, { id: 'hazards', label: 'Hazards · flood, slope, ground', rows: [['FEMA flood zone (county copy)', 'Zone A touches the parcel — 1.0% Annual Chance', 'flood100'], ['Mapped landslide', 'A mapped landslide touches this parcel', 'landslide'], ['County slope classes on the parcel', '0–5 % · 5–10 %', 'slope_classes']] }, { id: 'water', label: 'Water · surface, groundwater, utilities', rows: [['Groundwater basin', 'UPPER OJAI VALLEY · DWR basin 4-001', 'gw_basin'], ['Streams within 400 m', '2 mapped channels — Summit Valley Creek', 'streams'], ['Public water line', 'No public water line mapped within 600 m — private well or hauled water', 'waterline'], ['Public sewer', 'No public sewer line mapped within 600 m — onsite septic', 'sewer']] }, { id: 'access', label: 'Access, roads & lines', rows: [['Nearest public road', 'E Big Canyon Rd · Local · Unincorporated · ~20 m away', 'road']] }, { id: 'districts', label: 'Districts & representation', rows: [['County supervisor', '1st District — Matthew Lavere', 'supervisor']] }],
      records: [{ label: '14-PM-15', type: 'PM', url: 'https://maps.ventura.org/recordmaps/pm/014/014pm015.pdf', year: '1973', surveyor: 'Heathcote, Kenneth S' }, { label: '1A-MR-17', type: 'MR', url: 'https://maps.ventura.org/recordmaps/mr/001/001Amr017.pdf', year: '1872', surveyor: 'Thompson, George H' }],
      raw: [['APN10', '0370012125'], ['SITUS', '11962 SULPHUR MOUNTAIN RD'], ['L_V', '961860']],
      portals: [{ group: 'county', label: 'Assessor · property search', url: 'https://assessor.venturacounty.gov/assessor-data/property-search/', method: 'post', fields: { apn: '0370012125' }, note: 'Owner of record, use code' }, { group: 'county', label: 'Clerk-Recorder · official records', url: 'https://clerkrecorderselfservice.venturacounty.gov/web/user/disclaimer', note: 'Deeds, easements, liens' }, { group: 'federal', label: 'FEMA Flood Map Service Center', url: 'https://msc.fema.gov/portal/home', note: 'FIRM panel' }],
      evidence: { provider: 'PropertyChecker', preparedOn: '2025-03-16', importedAt: '2026-09-16T00:00:00.000Z', path: 'data/title/0370012125.json' },
      sourcesQueried: 103, sourcesAnswered: 101, sourcesLate: 0, partial: false, resolvedAt: new Date().toISOString(), ms: 8800 };
    const deep = { part: 'deep', apn: '037-0-012-125', center: [34.4326, -119.1564], county: core.county, flags: [{ level: 'watch', key: 'steep', text: '42 % of the parcel is steeper than 30 %' }], sections: [{ id: 'seismic', label: 'Faults & earthquakes', rows: [['Peak ground acceleration, 10 % in 50 yr (475-yr)', '0.66 g — CGS Map Sheet 48', 'pga475'], ['Nearest Alquist-Priolo trace', 'San Cayetano Fault · inferred · ~1.4 km away', 'ap_trace']] }, { id: 'terrain', label: 'Terrain · elevation, slope, buildable ground', rows: [['Elevation range', '1,369–1,495 ft · mean 1,402 ft', 'elev'], ['Slope', 'mean 26.9 % · median 22 %', 'slope'], ['Ground under 20 % slope', '3.19 ac of 9.45', 'buildable']] }, { id: 'ground', label: 'Ground · soils & geology', rows: [['Septic tank absorption fields', 'Very limited', 'sda_septic']] }, { id: 'water', label: 'Water · surface, groundwater, utilities', rows: [['Wells on this parcel (DWR well completion reports)', 'No report is filed against this APN', 'wells_on'], ['Well reports within 800 m (3)', 'WCR2021-011297 · irrigation - landscape · 260 ft deep · water at 44 ft · 55 gpm · 2021 · ~630 m away', 'wells_near']] }, { id: 'access', label: 'Access, roads & lines', rows: [['Electric utility (CEC service territory)', 'Southern California Edison (SCE) · investor-owned · (818) 302-1212 · www.sce.com', 'electric']] }, { id: 'hazards', label: 'Hazards · flood, slope, ground', rows: [['FEMA National Flood Hazard Layer', 'Zone X · Zone A — part of the parcel is a Special Flood Hazard Area', 'nfhl']] }],
      records: [{ label: 'WCR2021-011297', type: 'WCR', url: 'https://cadwr.app.box.com/v/WellCompletionReports/file/899273414917', year: '2021', surveyor: 'Sierra Exploration Drilling Co Inc', note: '10650 Ojai-Santa Paula RD · 260 ft · 55 gpm' }], terrain: { samples: 887, spacingM: 5.6, lowFt: 1369, highFt: 1495, meanFt: 1402, reliefFt: 126, meanSlope: 26.9, medianSlope: 22, classes: [{ label: 'gentle (0–10 %)', acres: 2.18, share: 33 }, { label: 'moderate (10–20 %)', acres: 1.01, share: 15 }, { label: 'steep (20–30 %)', acres: 0.72, share: 11 }, { label: 'very steep (over 30 %)', acres: 2.8, share: 42 }], aspect: 'N', aspectShare: 49, gentleAcres: 2.18, buildableAcres: 3.19, areaAcres: 9.45 }, sourcesQueried: 25, sourcesAnswered: 25, sourcesLate: 0, partial: false, resolvedAt: new Date().toISOString(), ms: 4800 };
    return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(part === 'deep' ? deep : core) });
  }
  if (u.includes('/api/parcel')) {
    if (/apn=999/.test(u)) return r.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ error: 'APN 999 is not in the Ventura County parcel layer' }) });
    return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ apn: '032-0-010-090', apn10: '0320010090', situs: '1320 BALDWIN RD', acreage: 43.92, center: [34.4243, -119.3196], bbox: { xmin: -119.3235, ymin: 34.4215, xmax: -119.3155, ymax: 34.4272 }, geometry: { rings: [[[-119.3235, 34.4215], [-119.3155, 34.4215], [-119.3155, 34.4272], [-119.3235, 34.4272], [-119.3235, 34.4215]]] }, county: { fips: '06111', name: 'Ventura County', state: 'CA', stateName: 'California', adapter: 'ventura' }, ms: 400 }) });
  }
  // the 1 m surface (V0.42): a stub index over Sulphur and the flat 500 m terrarium tile, so the
  // camera maths is checked against a ground whose height is known exactly, baked or not
  if (/\/terrain\/index\.json$/.test(u)) return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ areas: [{ pid: 'sulphur-mountain', bbox: [-119.2, 34.41, -119.12, 34.46], tiles: 4 }] }) });
  if (/\/terrain\/\d+\/\d+\/\d+\.png$/.test(u)) return r.fulfill({ status: 200, contentType: 'image/png', body: DEM });
  if (EXT.test(u)) {
    const key = u.split('?')[0].replace(/\/\d+\/\d+\/\d+(\.png)?$/, '/{z}/{y}/{x}'); if (!seen[key]) seen[key] = u;
    if (/legend\?f=json/.test(u)) return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ layers: [{ layerId: 0, layerName: 'Alpha', legend: [{ label: 'first thing', imageData: IMG64, contentType: 'image/png' }] }] }) });
    if (/MapServer\?f=json$/.test(u)) return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ layers: [{ id: 0, name: 'Alpha', defaultVisibility: true, parentLayerId: -1, subLayerIds: null }] }) });
    if (/demotiles/.test(u)) return r.fulfill({ status: 404, body: '' });
    if (/terrarium/.test(u)) return r.fulfill({ status: 200, contentType: 'image/png', body: DEM });
    return r.fulfill({ status: 200, contentType: 'image/png', body: PNG });
  }
  return r.continue();
});
const ev = (fn, arg) => pg.evaluate(fn, arg);
const wait = ms => pg.waitForTimeout(ms);

// ---- boot ----
await pg.goto(BASE + '/#34.43273/-119.15615/13.5/0/0?3d=0', { waitUntil: 'domcontentloaded', timeout: 30000 });
await pg.waitForFunction(() => window.atlas && window.atlas.ready && window.atlas.eng.map.areTilesLoaded(), { timeout: 40000 });
await wait(1500);
const boot = await ev(() => { const s = window.atlas.state(); return { props: window.atlas.props.props.length, base: s.base, terrain: s.terrain, hasProps: s.layers.includes('prop-line'), hasZones: s.layers.includes('zones'), chips: document.querySelectorAll('.chip').length, dockRows: document.querySelectorAll('.dock .row[data-id]').length, secs: document.querySelectorAll('.dock details.sec').length, timeline: !!document.getElementById('tl-aerial-in'), proj: (window.atlas.eng.map.getProjection() || {}).type, editBtnHidden: document.getElementById('ctl-edit').hidden }; });
check('boot: six properties, prop + zone layers, chips, 36 dock rows in the groups, timeline, not the globe', boot.props === 6 && boot.hasProps && boot.hasZones && boot.chips === 6 && boot.dockRows === 36 && boot.secs >= 7 && boot.timeline && boot.proj !== 'globe', boot);
check('boot: the editor button is hidden for visitors (V0.31 gate)', boot.editBtnHidden === true);

// ---- every overlay on, z-order, legend, opacity ----
await ev(() => { window.atlas.eng.map.jumpTo({ center: [-119.15615, 34.43273], zoom: 14 }); return true; }); await wait(600);
const ids = await ev(() => window.atlas.catalog().overlays.map(o => o.id));
for (const id of ids) { await ev(i => window.atlas.eng.setOverlay(i, true), id); await wait(90); }
await wait(2500);
const on = await ev(() => { const s = window.atlas.state(); const ov = s.layers.filter(l => l.startsWith('ov-')); return { active: s.overlays.length, ovLayers: ov.length, lsinvParts: ['ov-lsinv-p0', 'ov-lsinv-p3'].every(i => ov.includes(i)), surveyVec: ['ov-survey-line', 'ov-survey-ease', 'ov-survey-mon'].every(i => ov.includes(i)), legendBlocks: document.querySelectorAll('#insp-legend .lgb').length }; });
check('overlays: all 36 on, landslide parts and survey vectors present, a legend block per layer', on.active === 36 && on.ovLayers >= 40 && on.lsinvParts && on.surveyVec && on.legendBlocks === 36, on);
const zo = await ev(() => { const m = window.atlas.eng.map; const ls = m.getStyle().layers.map(l => l.id); const cat = window.atlas.catalog().overlays; const zOf = id => { const base = id.replace(/^ov-/, '').replace(/(~)?(-p\d+|-line|-ease|-mon)?$/, ''); const c = cat.find(o => o.id === base); return c ? c.z : -1; }; const ov = ls.filter(l => l.startsWith('ov-') && l !== 'ov-anchor'); let sorted = true; for (let i = 1; i < ov.length; i++) if (zOf(ov[i]) < zOf(ov[i - 1])) sorted = false; return { sorted, anchorAfter: ls.indexOf('ov-anchor') > ls.indexOf(ov[ov.length - 1]), propsAbove: ls.indexOf('prop-line') > ls.indexOf('ov-anchor') }; });
check('overlays: drawn in registry z order, under the anchor, under the property vectors', zo.sorted && zo.anchorAfter && zo.propsAbove, zo);
const lg = await ev(() => { const g = document.querySelector('.lgb[data-lg="geology"]'); return { imgs: g ? g.querySelectorAll('.lg img').length : -1, src: g ? !!g.querySelector('.src a') : null }; });
check('legend: the geology block carries the fetched swatch and a source link', lg.imgs === 1 && lg.src, lg);
await ev(() => window.atlas.eng.setOpacity('geology', 0.3));
check('opacity: setOpacity drives raster-opacity', (await ev(() => window.atlas.eng.map.getPaintProperty('ov-geology', 'raster-opacity'))) === 0.3);

// ---- flights + crossfade, historic topo, scale-limited fly-out ----
await ev(() => window.atlas.eng.setFlight(0, true)); await wait(400);
const mid = await ev(() => window.atlas.state().layers.filter(l => l.startsWith('base-')));
await ev(() => window.atlas.eng.setFlight(31, true)); await wait(4200);
const bases = await ev(() => ({ after: window.atlas.state().layers.filter(l => l.startsWith('base-')), base: window.atlas.state().base, pill: document.getElementById('year-big').textContent, tlLive: document.getElementById('tl-aerial').classList.contains('live') }));
check('flights: crossfade keeps two bases mid-swap and settles on one; the year pill follows', mid.length === 2 && bases.after.length === 1 && bases.pill === '2025' && bases.tlLive, { mid, ...bases });
await ev(() => window.atlas.eng.setHistYear(1903, true)); await wait(300);
const hist = await ev(() => ({ y: window.atlas.state().histYear, big: document.getElementById('tl-hist-year').textContent, url: (() => { const s = window.atlas.eng.map.getSource('src-ov-histtopo~') || window.atlas.eng.map.getSource('src-ov-histtopo'); return s && decodeURIComponent(s.tiles[0]); })() }));
check('historic topo: 1903 edition rebuilds the mosaic rule', hist.y === 1903 && hist.big === '1903' && /DateCurrent <= 1903/.test(hist.url || ''), hist);
await ev(() => { window.atlas.eng.setOverlay('faults', false); window.atlas.eng.map.jumpTo({ zoom: 16 }); return true; }); await wait(200);
await ev(() => window.atlas.eng.setOverlay('faults', true));
// the fly-out is a 1.1 s eased camera move; wait for the camera to settle rather than for a clock
await pg.waitForFunction(() => !window.atlas.eng.map.isMoving() && window.atlas.eng.map.getZoom() <= 12.6, { timeout: 8000 }).catch(() => {});
const fo = await ev(() => ({ zoom: window.atlas.eng.map.getZoom(), srcMax: window.atlas.eng.map.getSource('src-ov-faults').maxzoom, tileSize: window.atlas.eng.map.getSource('src-ov-faults').tileSize }));
check('scale-limited sheet: turning faults on at z16 flies out to its range (256-px source, maxzoom 12)', fo.zoom <= 12.6 && fo.srcMax === 12 && fo.tileSize === 256, fo);

// ---- 3D + hotkeys ----
await pg.keyboard.press('e'); await wait(600);
await pg.keyboard.press('t'); await pg.waitForFunction(() => window.atlas.eng.map.getPitch() > 60, { timeout: 20000 }).catch(() => {}); await wait(300);
const d3 = await ev(() => ({ pitch: Math.round(window.atlas.eng.map.getPitch()), bearing: Math.round(window.atlas.eng.map.getBearing()), terrain: !!window.atlas.eng.map.getTerrain(), hill: window.atlas.eng.map.getLayoutProperty('hillshade', 'visibility'), btn3d: document.getElementById('ctl-3d').classList.contains('on') }));
check('3D: T tilts to 62° with terrain + hillshade, E rotated the bearing', d3.pitch >= 60 && d3.terrain && d3.hill === 'visible' && d3.btn3d && d3.bearing !== 0, d3);

// ---- property card + record ----
await ev(() => { const p = window.atlas.props.props.find(x => x.id === 'sulphur-mountain'); window.atlas.props.onSelect('property', p); return true; }); await pg.waitForSelector('#rec-body .rec-head', { timeout: 20000 }).catch(() => {});
const ins = await ev(() => ({ open: document.getElementById('inspector').classList.contains('open'), tab: document.querySelector('.insp-tabs .on').textContent, title: document.querySelector('#insp-parcel .card-head b')?.textContent, flags: document.querySelectorAll('#insp-parcel .ds-flag').length, records: document.querySelectorAll('#rec-body .doc').length }));
check('property card: inspector opens on Parcel with the record (3 flags, 3 records incl. the well report)', ins.open && /Parcel/i.test(ins.tab) && /Sulphur/.test(ins.title || '') && ins.flags === 3 && ins.records === 3, ins);
check('hash: camera state is shareable', /^#34\.\d+\/-119\.\d+\/\d/.test(await ev(() => location.hash)));
const chipToday = await ev(() => document.querySelector('.chip[data-pid="sulphur-mountain"]').textContent);
await pg.keyboard.press(' '); await wait(200);
const mode = await ev(() => ({ mode: window.atlas.state().mode, pill: document.getElementById('mode-pill').dataset.mode, chip: document.querySelector('.chip[data-pid="sulphur-mountain"]').textContent }));
check('mode: Space flips to Vision; the chip swaps to the vision label', mode.mode === 'vision' && mode.pill === 'vision' && mode.chip !== chipToday && mode.chip.length > 3, { chipToday, ...mode });

// ---- galleries, lightbox, zone card, dive (lighter scene first: software GL) ----
await ev(() => { for (const id of [...window.atlas.eng.active]) window.atlas.eng.setOverlay(id, false); window.atlas.eng.set3D(false); window.atlas.eng.setTerrain(false); return true; }); await wait(1500);
await pg.keyboard.press(' '); await wait(150);
await ev(() => { const p = window.atlas.props.props.find(x => x.id === 'sulphur-mountain'); window.atlas.props.onSelect('property', p); return true; });
await pg.waitForSelector('#insp-parcel .gal-th', { timeout: 15000 }).catch(() => {});
const gal = await ev(() => ({ thumbs: document.querySelectorAll('#insp-parcel .gal-th').length, strip: document.querySelector('#insp-parcel .strip')?.textContent, folds: document.querySelectorAll('#insp-parcel details.fold').length, classicRows: document.querySelectorAll('#insp-parcel .classic .property-detail-row').length, cta: !!document.querySelector('#insp-parcel .cta'), dive: !!document.querySelector('#insp-parcel [data-dive]'), upBtns: document.querySelectorAll('#insp-parcel [data-up]').length }));
check('property card: gallery thumbs, TODAY strip, folds, classic details, CTA, portal', gal.thumbs > 4 && /TODAY/.test(gal.strip || '') && gal.folds >= 3 && gal.classicRows > 0 && gal.cta && gal.dive, gal);
check('property card: no upload buttons for visitors (V0.31 gate)', gal.upBtns === 0);
await pg.click('#insp-parcel .gal-th').catch(() => {}); await wait(300);
const lb1 = await ev(() => ({ open: !!document.querySelector('.lightbox') && !document.querySelector('.lightbox').hidden, n: document.querySelector('.lb-n')?.textContent }));
await pg.keyboard.press('ArrowRight'); await wait(100);
const lb2 = await ev(() => document.querySelector('.lb-n')?.textContent);
await pg.keyboard.press('Escape'); await wait(100);
const lb3 = await ev(() => ({ closed: document.querySelector('.lightbox')?.hidden, inspOpen: document.getElementById('inspector').classList.contains('open') }));
check('lightbox: opens on a thumb, → steps, Esc closes without closing the inspector', lb1.open && lb1.n !== lb2 && lb3.closed && lb3.inspOpen, { lb1, lb2, lb3 });
await ev(() => { const p = window.atlas.props.props.find(x => x.id === 'sulphur-mountain'); window.atlas.props.onSelect('zone', { property: p, zone: p.zones[0] }); return true; }); await wait(1200);
const zc = await ev(() => ({ title: document.querySelector('#insp-parcel .card-head b')?.textContent, strip: document.querySelector('#insp-parcel .strip')?.textContent }));
check('zone card: renders with the mode strip', !!zc.title && /TODAY/.test(zc.strip || ''), zc);
await ev(() => { const p = window.atlas.props.props.find(x => x.id === 'howard'); window.atlas.props.onSelect('property', p); return true; }); await wait(400);
await ev(() => document.querySelector('#insp-parcel [data-dive]').click()); await wait(600);
const mid3 = await ev(() => ({ moving: window.atlas.eng.map.isMoving(), mode: window.atlas.state().mode, terrain: window.atlas.state().terrain }));
await pg.waitForFunction(() => !window.atlas.eng.map.isMoving(), { timeout: 15000 }).catch(() => {}); await wait(500);
const dive = await ev(() => ({ pitch: Math.round(window.atlas.eng.map.getPitch()), mode: window.atlas.state().mode, cardOpen: document.getElementById('inspector').classList.contains('open'), strip: document.querySelector('#insp-parcel .strip')?.textContent }));
check('portal dive: Vision mode + terrain, a cinematic flight, the card reopens on arrival', mid3.moving && mid3.mode === 'vision' && mid3.terrain && dive.pitch >= 55 && dive.cardOpen && /VISION/.test(dive.strip || ''), { mid3, dive });

// ---- editor gate: P does nothing for visitors ----
await pg.keyboard.press('Escape'); await wait(100);
await pg.keyboard.press('p'); await wait(200);
check('editor gate: P is inert without ?edit=1', (await ev(() => { const e = document.querySelector('.editor'); return !e || e.hidden; })) === true);

// ---- territories, rainbow, reveal thresholds, chips ----
await ev(() => { window.atlas.eng.set3D(false); window.atlas.eng.setTerrain(false); return true; }); await wait(800);
const v28 = await ev(() => { const m = window.atlas.eng.map; const ls = m.getStyle().layers.map(l => l.id); const src = m.getSource('propline'); const feats = m.getSource('terr').serialize().data.features || []; return { terr: ['terr-fill', 'terr-line', 'lot-sel'].every(l => ls.includes(l)), rainbow: !!m.getPaintProperty('prop-line', 'line-gradient'), lineMetrics: !!(src && src._options && src._options.lineMetrics), terrCount: feats.length, polys: feats.filter(f => f.properties.kind === 'poly').length, stars: (document.getElementById('map').style.background || '').slice(0, 30) }; });
check('territories + rainbow: layers present, line-metrics source, 14 polygon territories, starfield', v28.terr && v28.rainbow && v28.lineMetrics && v28.terrCount > 40 && v28.polys === 14 && /url\(/.test(v28.stars), v28);
const g1 = await ev(() => JSON.stringify(window.atlas.eng.map.getPaintProperty('prop-line', 'line-gradient'))); await wait(400);
check('rainbow animates while the map rests', g1 !== await ev(() => JSON.stringify(window.atlas.eng.map.getPaintProperty('prop-line', 'line-gradient'))));
await ev(() => { window.atlas.eng.map.jumpTo({ center: [-119.19, 34.4327], zoom: 12, pitch: 0 }); return true; }); await wait(4000);
const r12 = await ev(() => { const m = window.atlas.eng.map; const zs = m.queryRenderedFeatures({ layers: ['zones'] }); const byPid = {}; for (const f of zs) byPid[f.properties.pid] = (byPid[f.properties.pid] || 0) + 1; const chips = Object.fromEntries([...document.querySelectorAll('.chip')].map(c => [c.dataset.pid, !c.classList.contains('off')])); return { byPid, chips }; });
check('reveal @z12: the ranch zones are rendered and its chip tucked, Sulphur chip still shown', (r12.byPid['black-mountain-ranch'] || 0) > 0 && r12.chips['black-mountain-ranch'] === false && r12.chips['sulphur-mountain'] === true, r12);
await ev(() => { window.atlas.eng.map.jumpTo({ center: [-119.1553, 34.4331], zoom: 15 }); return true; }); await wait(3500);
const r15 = await ev(() => ({ sulphurChip: !document.querySelector('.chip[data-pid="sulphur-mountain"]').classList.contains('off'), sulphurZones: window.atlas.eng.map.queryRenderedFeatures({ layers: ['zones'] }).some(f => f.properties.pid === 'sulphur-mountain') }));
check('reveal @z15: Sulphur zones show and its chip tucks away', r15.sulphurChip === false && r15.sulphurZones, r15);

// ---- ground readout → ground card ----
await pg.keyboard.press('Escape'); await wait(150);
const pt = await ev(() => { const m = window.atlas.eng.map; m.jumpTo({ center: [-119.20, 34.47], zoom: 13 }); const p = m.project([-119.20, 34.47]); return { x: p.x, y: p.y, own: window.atlas.props.hitsOwn(p) }; }); await wait(1500);
for (let k = 0; k < 4; k++) { await pg.mouse.click(pt.x, pt.y); await wait(1000); if (await ev(() => !!document.querySelector('.ground .gp'))) break; await pg.keyboard.press('Escape'); await wait(400); }
const gr = await ev(() => ({ popup: !!document.querySelector('.ground .gp'), ll: document.querySelector('.gp-ll')?.textContent, el: document.querySelector('#gp-el')?.textContent }));
check('ground readout: click on open ground → popup with coordinates and the USGS elevation', !pt.own && gr.popup && /34\.47/.test(gr.ll || '') && /1,354|412/.test(gr.el || ''), { own: pt.own, ...gr });
await pg.click('#gp-ds').catch(() => {}); await pg.waitForSelector('#rec-body .rec-head', { timeout: 15000 }).catch(() => {});
const gc = await ev(() => ({ title: document.querySelector('#insp-parcel .card-head b')?.textContent, ds: !!document.querySelector('#rec-body .rec-head') }));
check('ground card: the county record resolves for the parcel under the point', !!gc.title && gc.ds, gc);

// ---- lot card, fly, orbit ----
await ev(() => { const p = window.atlas.props.props.find(x => x.id === 'black-mountain-ranch'); const lot = p.lots[0]; window.atlas.props.selectLot(lot.id); window.atlas.props.onSelect('lot', { pid: p.id, lid: lot.id, apn: lot.apn, name: lot.name, acreage: lot.acreage }); return true; }); await wait(700);
const lc = await ev(() => ({ title: document.querySelector('#insp-parcel .card-head b')?.textContent, rows: [...document.querySelectorAll('#insp-parcel .rows .k')].map(k => k.textContent).join('|'), acts: document.querySelectorAll('#insp-parcel .acts .mini').length, sel: JSON.stringify(window.atlas.eng.map.getFilter('lot-sel')) }));
check('lot card: APN rows, actions, the cyan selection filter', !!lc.title && /APN/.test(lc.rows) && lc.acts >= 3 && /lid|id/.test(lc.sel), lc);

// ---- the county's buildings, extruded (V0.41) ----
const bld = await ev(() => {
  const m = window.atlas.eng.map;
  const src = m.getStyle().sources.bldg;
  const n = src && src.data && src.data.features ? src.data.features.length : 0;
  const h = m.getLayer('bldg-3d') ? m.getPaintProperty('bldg-3d', 'fill-extrusion-height') : null;
  const kinds = window.atlas.props.structures.map(f => f.properties.pid);
  return { n, layer: !!m.getLayer('bldg-3d'), line: !!m.getLayer('bldg-line'), type: m.getLayer('bldg-3d')?.type, h: JSON.stringify(h), pids: [...new Set(kinds)].sort().join(',') };
});
check('buildings: the county footprints load and extrude, height in feet converted to metres',
  bld.n >= 5 && bld.layer && bld.line && bld.type === 'fill-extrusion' && /0\.3048/.test(bld.h) && /sulphur-mountain/.test(bld.pids), bld);
const bcard = await ev(() => {
  const f = window.atlas.props.structures.find(x => x.properties.pid === 'chers-property') || window.atlas.props.structures[0];
  window.atlas.props.onSelect('structure', Object.assign({ oid: String(f.id || '') }, f.properties));
  return true;
});
await wait(500);
const bc = await ev(() => ({
  title: document.querySelector('#insp-parcel .card-head b')?.textContent,
  rows: [...document.querySelectorAll('#insp-parcel .rows .r .k')].map(e => e.textContent).join('|'),
  note: document.querySelector('#insp-parcel .note-p')?.textContent || '',
  height: [...document.querySelectorAll('#insp-parcel .rows .r')].map(e => e.textContent).find(t => /Drawn height/.test(t)) || ''
}));
check('buildings: the card names the structure and says the height is a class default, not a measurement',
  !!bcard && /Dwelling|Structure|Outbuilding/.test(bc.title || '') && /On parcel/.test(bc.rows) && /default for this building class/.test(bc.height) && /massing/.test(bc.note), bc);

// ---- the Vision half: proposed structures, and the county's own kept to Today (V0.41) ----
const vis = await ev(() => {
  const m = window.atlas.eng.map, src = m.getStyle().sources.vis;
  return {
    n: src && src.data && src.data.features ? src.data.features.length : 0,
    site: !!m.getLayer('vis-site'), line: !!m.getLayer('vis-site-line'), ext: !!m.getLayer('vis-3d'),
    extType: m.getLayer('vis-3d')?.type,
    registry: window.atlas.models.structures.map(s => s.id + ':' + s.status + ':' + s.mode).join(','),
    threeLoaded: !!document.querySelector('script[src*="three"]')
  };
});
check('vision: the designed-structure registry loads — 17 placed rows, the Oak Leaf as a model — with the site/massing layers standing by',
  vis.n >= 17 && vis.site && vis.line && vis.ext && vis.extType === 'fill-extrusion' && /sulphur-oak-house:model:vision/.test(vis.registry), vis);
// Today shows what stands, Vision shows what is proposed - never both at once
await ev(() => { window.atlas.hud.setMode ? window.atlas.hud.setMode('vision') : (window.atlas.props.applyMode('vision'), window.atlas.models.applyMode('vision')); });
await wait(400);
const modes = await ev(() => {
  const m = window.atlas.eng.map;
  const visv = JSON.stringify(m.getFilter('vis-site'));
  const bldgv = m.getLayoutProperty('bldg-3d', 'visibility');
  window.atlas.props.applyMode('today'); window.atlas.models.applyMode('today');
  return { visionSiteFilter: visv, bldgInVision: bldgv, bldgInToday: m.getLayoutProperty('bldg-3d', 'visibility'), visTodayFilter: JSON.stringify(m.getFilter('vis-site')) };
});
check('vision: the county buildings belong to Today and the proposed site to Vision',
  /vision/.test(modes.visionSiteFilter) && modes.bldgInVision === 'none' && modes.bldgInToday !== 'none' && /current/.test(modes.visTodayFilter), modes);
await ev(() => { const s = window.atlas.models.structures[0]; window.atlas.models.onSelect(s); });
await wait(400);
const vc = await ev(() => ({
  title: document.querySelector('#insp-parcel .card-head b')?.textContent,
  strip: document.querySelector('#insp-parcel .strip')?.textContent,
  state: [...document.querySelectorAll('#insp-parcel .rows .r')].map(e => e.textContent).find(t => /State/.test(t)) || '',
  note: document.querySelector('#insp-parcel .note-p')?.textContent || ''
}));
check('vision: the card says a model of the Oak Leaf is placed here',
  /Oak/.test(vc.title || '') && /VISION/.test(vc.strip || '') && /model is placed/i.test(vc.state), vc);
// three.js is a capability, not a cost: it arrives as its own lazy chunk, pulled in only
// because the registry actually places models — never rolled into the first bundle
const chunks = await ev(() => performance.getEntriesByType('resource').map(r => r.name).filter(n => /three|GLTFLoader/i.test(n)).length);
check('vision: three.js and the glTF loader load lazily as their own chunks for the placed models', chunks >= 1, { chunks });
// the two cards above replaced the inspector's contents; put the lot card back for the fly test
await ev(() => { const p = window.atlas.props.props.find(x => x.id === 'black-mountain-ranch'); const lot = p.lots[0]; window.atlas.props.selectLot(lot.id); window.atlas.props.onSelect('lot', { pid: p.id, lid: lot.id, apn: lot.apn, name: lot.name, acreage: lot.acreage }); return true; }); await wait(700);
const zBefore = await ev(() => window.atlas.eng.map.getZoom()); const cBefore = await ev(() => window.atlas.eng.map.getCenter().lng);
await ev(() => document.querySelector('#insp-parcel [data-lot]').click()); await wait(500);
await pg.waitForFunction(() => !window.atlas.eng.map.isMoving(), { timeout: 10000 }).catch(() => {}); await wait(300);
const zAfter = await ev(() => window.atlas.eng.map.getZoom()); const cAfter = await ev(() => window.atlas.eng.map.getCenter().lng);
check('lot fly: flies to the lot (closer, elsewhere)', zAfter > zBefore + 0.5 && Math.abs(cAfter - cBefore) > 0.002, { zBefore, zAfter, cBefore, cAfter });
const b0 = await ev(() => { window.atlas.eng.map.jumpTo({ pitch: 30 }); return window.atlas.eng.map.getBearing(); }); await wait(200);
await pg.mouse.move(700, 450); await pg.mouse.down({ button: 'middle' }); await pg.mouse.move(760, 430, { steps: 6 }); await pg.mouse.move(820, 410, { steps: 6 }); await pg.mouse.up({ button: 'middle' }); await wait(900);
const orb = await ev(b0 => ({ from: b0, bearing: window.atlas.eng.map.getBearing(), pitch: window.atlas.eng.map.getPitch() }), b0);
check('orbit: middle-drag right turns right, dragging up tilts further', orb.bearing > orb.from + 10 && orb.pitch > 31, orb);

// ---- proxy shape, manifest, memory, service worker ----
const px = await ev(async () => { window.atlas.eng.setOverlay('topo', true); await new Promise(r => setTimeout(r, 300)); const s = window.atlas.eng.map.getSource('src-ov-topo'); const t = s && s.tiles[0]; const man = await (await fetch('/v2/tiles.json')).json(); window.atlas.eng.setOverlay('topo', false); return { topo: t || '', overlays: man.overlays.length, flights: man.flights.length, last: JSON.parse(localStorage.getItem('atlasLast') || '{}') }; });
check('tile proxy: county exports route through /api/tile; the manifest lists every template; memory persists', /\/api\/tile\?u=/.test(px.topo) && px.overlays >= 36 && px.flights === 32 && typeof px.last.mode === 'string', px);

// ---- the County Record in full ----
await ev(() => { const p = window.atlas.props.props.find(x => x.id === 'sulphur-mountain'); window.atlas.props.onSelect('property', p); return true; });
await pg.waitForFunction(() => document.querySelectorAll('#rec-body details.rec-sec').length > 8, { timeout: 15000 }).catch(() => {}); await wait(600);
const rec = await ev(() => { const b = document.querySelector('#rec-body'); const secs = [...b.querySelectorAll('details.rec-sec')]; return { apn: b.querySelector('.rec-apn')?.textContent, flags: b.querySelectorAll('.ds-flag').length, read: b.querySelectorAll('.read .rd').length, secs: secs.map(d => d.dataset.sec), allOpen: secs.filter(d => d.dataset.sec !== 'raw').every(d => d.open), rawOpen: !!secs.find(d => d.dataset.sec === 'raw')?.open, rows: b.querySelectorAll('.rec-sec .r').length, titleRows: b.querySelectorAll('[data-sec="title"] .r').length, docs: b.querySelectorAll('.doc').length, wcr: [...b.querySelectorAll('.doc')].some(d => /WCR2021/.test(d.textContent)), postForms: b.querySelectorAll('form.pf input[name="apn"]').length, portalLinks: b.querySelectorAll('a.pl').length, raw: b.querySelectorAll('[data-sec="raw"] .r').length, acts: [...b.querySelectorAll('[data-rec]')].map(x => x.dataset.rec) }; });
check('record: APN, 3 flags, the seven-dimension read, every section open (raw folded) incl. Ownership & title, records + well report, portals with the POST bridge, raw, actions', rec.apn === '037-0-012-125' && rec.flags === 3 && rec.read === 7 && rec.secs.includes('title') && rec.allOpen && rec.rows > 30 && rec.titleRows === 7 && rec.docs === 3 && rec.wcr && rec.postForms === 1 && rec.portalLinks >= 2 && rec.raw === 3 && !rec.rawOpen && ['expand', 'refresh', 'print', 'json', 'save'].every(a => rec.acts.includes(a)), rec);
const idx = await ev(() => { const s = [...document.querySelectorAll('#rec-body details.rec-sec')].map(d => d.dataset.sec); return { title: s.indexOf('title'), valuation: s.indexOf('valuation'), landuse: s.indexOf('landuse') }; });
check('record: Ownership & title sits between valuation and land use', idx.valuation < idx.title && idx.title < idx.landuse, idx);
check('record: no report-import button for visitors (V0.32 gate)', (await ev(() => document.querySelectorAll('#rec-body [data-rec="import"]').length)) === 0);
await ev(() => document.querySelector('#rec-body [data-rec="expand"]').click()); await wait(100);
const col = await ev(() => ({ openNow: [...document.querySelectorAll('#rec-body details.rec-sec')].filter(d => d.open).length, label: document.querySelector('#rec-body [data-rec="expand"]').textContent }));
check('record: collapse all closes every section and relabels the button', col.openNow === 0 && /expand/i.test(col.label), col);

// ---- search, research, shared list, compare ----
await ev(() => { document.querySelector('#apn-in').value = '032-0-010-090'; document.querySelector('#apn-form').dispatchEvent(new Event('submit', { cancelable: true })); return true; });
await pg.waitForFunction(() => document.querySelector('#insp-parcel .card-head b')?.textContent?.includes('BALDWIN'), { timeout: 15000 }).catch(() => {}); await wait(2600);
const se = await ev(() => { const m = window.atlas.eng.map; return { title: document.querySelector('#insp-parcel .card-head b')?.textContent, cand: m.querySourceFeatures('cand').length, candLayer: !!m.getLayer('cand-line'), lng: m.getCenter().lng, saveBtn: document.querySelector('#insp-parcel [data-rs="save"]')?.textContent, rec: !!document.querySelector('#rec-body .rec-head') }; });
check('search: an APN draws the candidate outline, flies there, opens a search card with the record', /BALDWIN/.test(se.title || '') && se.cand > 0 && se.candLayer && Math.abs(se.lng + 119.3196) < 0.01 && /save/i.test(se.saveBtn || '') && se.rec, se);
await ev(() => document.querySelector('#insp-parcel [data-rs="save"]').click()); await wait(300);
const sv = await ev(() => ({ list: JSON.parse(localStorage.getItem('atlasResearch') || '[]').map(i => i.apn), btn: document.querySelector('#insp-parcel [data-rs="remove"]')?.textContent }));
check('research: ☆ save stores the parcel; the shared parcel from the repository joined the list at boot', sv.list.includes('032-0-010-090') && sv.list.includes('011-0-040-135') && /remove|saved/i.test(sv.btn || ''), sv);
await ev(() => { document.querySelector('#apn-in').value = '999'; document.querySelector('#apn-form').dispatchEvent(new Event('submit', { cancelable: true })); return true; });
await pg.waitForFunction(() => !/Looking up/.test(document.getElementById('toast').textContent), { timeout: 6000 }).catch(() => {});
const bad1 = await ev(() => ({ toast: document.getElementById('toast').textContent, hidden: document.getElementById('toast').hidden }));
check('search: an unknown APN shows the county’s answer as a toast, no crash', /not in the Ventura/.test(bad1.toast) && !bad1.hidden, bad1);
await ev(() => document.querySelector('.insp-tabs [data-tab="research"]').click()); await wait(300);
const rs = await ev(() => ({ items: document.querySelectorAll('#insp-research .rs').length, cloud: document.querySelector('#insp-research .cloud')?.textContent, compareBtn: !!document.querySelector('#insp-research [data-rs="compare"]'), syncBtn: !!document.querySelector('#insp-research [data-rs="sync"]') }));
check('research tab: two items, the shared-list pill (synced, no PIN → "enter the PIN" button), compare', rs.items === 2 && /shared list · 1/.test(rs.cloud || '') && rs.syncBtn && rs.compareBtn, rs);
await ev(() => document.querySelector('#insp-research [data-rs="compare"]').click());
await pg.waitForFunction(() => document.querySelectorAll('#cmp-body .cmp tbody tr').length > 10 && !document.querySelector('#cmp-body .rec-sub .wait'), { timeout: 20000 }).catch(() => {});
const cmp = await ev(() => ({ cols: document.querySelectorAll('#cmp-body .cmp thead th').length - 1, rows: document.querySelectorAll('#cmp-body .cmp tbody tr').length, bars: document.querySelectorAll('#cmp-body .rd-bar').length, still: !!document.querySelector('#cmp-body .rec-sub .wait') }));
check('compare: six properties + two saved parcels, a bar per scored dimension, nothing still waiting', cmp.cols === 8 && cmp.rows > 10 && cmp.bars >= 5 * 8 && !cmp.still, cmp);
await pg.focus('#apn-in'); const t0 = await ev(() => ({ zoom: window.atlas.eng.map.getZoom(), pitch: window.atlas.eng.map.getPitch() })); await pg.keyboard.type('t+-'); await wait(300);
const ts = await ev(() => ({ zoom: window.atlas.eng.map.getZoom(), pitch: window.atlas.eng.map.getPitch() }));
check('hotkeys are inert while typing in the search box', Math.abs(ts.zoom - t0.zoom) < 0.01 && Math.abs(ts.pitch - t0.pitch) < 0.01, { t0, ts });
await ev(() => { document.querySelector('#apn-in').value = ''; document.querySelector('#apn-in').blur(); document.querySelector('.insp-tabs [data-tab="parcel"]').click(); });
await pg.screenshot({ path: join(OUT, 'v2-desktop.png') });

// ---- phone width ----
await pg.setViewportSize({ width: 400, height: 820 }); await wait(800);
await ev(() => { const p = window.atlas.props.props.find(x => x.id === 'sulphur-mountain'); window.atlas.props.onSelect('property', p); return true; }); await wait(900);
const mob = await ev(() => { const r = el => { const b = document.querySelector(el)?.getBoundingClientRect(); return b ? [Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)] : null; }; return { vw: innerWidth, insp: r('#inspector'), top: r('#topbar'), overflowX: document.documentElement.scrollWidth > innerWidth, inspOpen: document.getElementById('inspector').classList.contains('open') }; });
check('phone: no horizontal overflow, the inspector fits the width', !mob.overflowX && mob.inspOpen && mob.insp && mob.insp[2] <= 400 && mob.insp[0] >= 0, mob);
// every control in the top bar has to sit between the two edges of a 400 px phone (V0.39)
const bar = await ev(() => {
  const vw = innerWidth;
  const kids = [...document.querySelectorAll('.hud-top > *, .hud-top .top-right > *')].filter(e => e.offsetParent !== null);
  const out = kids.map(e => ({ cls: e.className.split(' ')[0] || e.tagName.toLowerCase(), l: Math.round(e.getBoundingClientRect().left), r: Math.round(e.getBoundingClientRect().right) }));
  return { vw, out, over: out.filter(k => k.r > vw + 0.5 || k.l < -0.5) };
});
check('phone: nothing in the top bar runs off the edge — the mode pill and ? both fit', bar.over.length === 0, { vw: bar.vw, over: bar.over, right: bar.out[bar.out.length - 1] });
// the map attribution has to stay visible, not hide behind an open dock
await ev(() => { document.getElementById('ctl-layers').click(); }); await wait(500);
const att = await ev(() => {
  const a = document.querySelector('.maplibregl-ctrl-bottom-left'), d = document.getElementById('dock');
  if (!a || !d) return null;
  const A = a.getBoundingClientRect(), D = d.getBoundingClientRect();
  const hit = !(A.right <= D.left || A.left >= D.right || A.bottom <= D.top || A.top >= D.bottom);
  return { dockOpen: d.classList.contains('open'), behindDock: hit, onScreen: A.left >= 0 && A.right <= innerWidth + 0.5, w: Math.round(A.width) };
});
check('phone: the map attribution stays clear of the open dock and on screen', att && att.dockOpen && !att.behindDock && att.onScreen, att);
await ev(() => { document.getElementById('ctl-layers').click(); }); await wait(400);
await pg.screenshot({ path: join(OUT, 'v2-phone.png') });

// ---- the editor, behind ?edit=1 ----
await pg.setViewportSize({ width: 1440, height: 900 });
await pg.goto(BASE + '/?edit=1#34.4326/-119.1564/15/0/0?3d=0', { waitUntil: 'domcontentloaded', timeout: 30000 });
await pg.waitForFunction(() => window.atlas && window.atlas.ready && window.atlas.eng.map.areTilesLoaded(), { timeout: 40000 }); await wait(1200);
check('editor gate: ?edit=1 shows the ⚙ button and remembers it', (await ev(() => ({ btn: !document.getElementById('ctl-edit').hidden, ls: localStorage.getItem('atlasEditor') }))).btn === true);
await ev(() => { const p = window.atlas.props.props.find(x => x.id === 'sulphur-mountain'); window.atlas.props.onSelect('property', p); return true; }); await wait(800);
check('editor mode: the property card offers photo + PDF uploads', (await ev(() => document.querySelectorAll('#insp-parcel [data-up]').length)) === 2);
await pg.waitForSelector('#rec-body [data-sec="title"]', { timeout: 15000 }).catch(() => {});
const imp = await ev(() => ({ btn: document.querySelectorAll('#rec-body [data-sec="title"] [data-rec="import"]').length, hint: document.querySelector('#rec-body [data-sec="title"] .acts.up .hint')?.textContent }));
check('editor mode: the Ownership & title section offers the report import and names the report on file', imp.btn === 1 && /PropertyChecker report of 2025-03-16 on file/.test(imp.hint || ''), imp);
await pg.keyboard.press('Escape'); await wait(100);
await pg.keyboard.press('p'); await wait(200);
await pg.selectOption('.editor [data-ed="prop"]', 'sulphur-mountain').catch(() => {});
await pg.click('.editor [data-ed="start"]').catch(() => {}); await wait(600);
const ed1 = await ev(() => ({ open: !document.querySelector('.editor').hidden, badges: document.querySelectorAll('.ed-badge').length, filter: JSON.stringify(window.atlas.eng.map.getFilter('zones')) }));
const bb = await pg.locator('.ed-badge').first().boundingBox();
if (bb) { await pg.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await pg.mouse.down(); await pg.mouse.move(bb.x + bb.width / 2 + 30, bb.y + bb.height / 2 + 10, { steps: 5 }); await pg.mouse.move(bb.x + bb.width / 2 + 60, bb.y + bb.height / 2 + 20, { steps: 5 }); await pg.mouse.up(); }
await wait(300);
await pg.click('.editor [data-ed="capture"]').catch(() => {}); await wait(200);
const ed2 = await ev(() => ({ moved: document.querySelectorAll('.ed-m').length, out: (document.querySelector('.ed-out')?.value || '').replace(/\s+/g, ' ') }));
await pg.click('.editor [data-ed="reset"]'); await wait(300);
await pg.click('.editor [data-ed="stop"]'); await wait(300);
const ed3 = await ev(() => ({ badges: document.querySelectorAll('.ed-badge').length }));
check('editor: P opens it, Start shows 18 draggable badges and hides that property’s symbols, a drag lands in the moved list + capture JSON, Stop restores', ed1.open && ed1.badges === 18 && /sulphur-mountain/.test(ed1.filter) && ed2.moved === 1 && /"sulphur-mountain"/.test(ed2.out) && ed3.badges === 0, { ed1, ed2, ed3 });
// ---- the placement studio (V0.51): pick, nudge to the inch, turn with the footprint, save ----
await pg.keyboard.press('b'); await wait(400);
const pl1 = await ev(() => { const p = document.querySelector('.placer'); window.atlas.hud.placer.select('sulphur-oak-house'); return { open: !!p && !p.hidden, rows: document.querySelectorAll('.pl-row').length }; });
await wait(500);
const pl2 = await ev(() => {
  const st = window.atlas.models.structures.find(x => x.id === 'sulphur-oak-house');
  return { handle: document.querySelectorAll('.place-handle').length, lng: st.position[0], lat: st.position[1], o0: st.outline[0].slice() };
});
await pg.keyboard.down('Alt'); await pg.keyboard.press('ArrowRight'); await pg.keyboard.up('Alt'); await wait(150);
const pl3 = await ev(() => {
  const st = window.atlas.models.structures.find(x => x.id === 'sulphur-oak-house');
  return { lng: st.position[0], lat: st.position[1] };
});
const inchDeg = Math.abs(pl3.lng - pl2.lng);
await wait(500);   // let the nudge re-render settle before touching the panel again
const pl4 = await ev(() => {
  const st = window.atlas.models.structures.find(x => x.id === 'sulphur-oak-house');
  const before = st.outline[0].slice();
  const inp = document.querySelector('.placer [data-pl="rot"]');
  inp.value = '90'; inp.dispatchEvent(new Event('input', { bubbles: true }));
  return { rot: st.rotationDeg, before, o0: st.outline[0].slice(), dirty: (document.querySelector('[data-pl="dirty"]')?.textContent || '') };
});
let savedBody = null;
await pg.route('**/api/save-structures', async r => { savedBody = JSON.parse(r.request().postData() || '{}'); await r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true,"count":17}' }); });
await ev(() => { localStorage.setItem('ojaiMapEditPin', 'test-pin'); return true; });
await ev(() => { (document.querySelector('.placer [data-pl="save"]')).click(); return true; }); await wait(500);
const pl5 = await ev(() => (document.querySelector('[data-pl="dirty"]')?.textContent || ''));
await pg.unroute('**/api/save-structures');
check('placement studio: B opens it over the 17 rows, picking shows the drag handle, Alt-arrow nudges about an inch, turning turns the footprint with the model, and Save posts the whole registry with the PIN',
  pl1.open && pl1.rows >= 17 && pl2.handle === 1
  && inchDeg > 5e-8 && inchDeg < 6e-7
  && pl4.rot === 90 && (pl4.o0[0] !== pl4.before[0] || pl4.o0[1] !== pl4.before[1]) && /not saved yet/.test(pl4.dirty)
  && savedBody && savedBody.pin === 'test-pin' && Array.isArray(savedBody.structures) && savedBody.structures.length >= 17
  && /nothing waiting/.test(pl5),
  { pl1, pl2, pl3, inchDeg, pl4: { rot: pl4.rot, o0: pl4.o0, dirty: pl4.dirty }, pl5, saved: savedBody ? { pin: savedBody.pin, n: savedBody.structures.length } : null });

await pg.goto(BASE + '/?edit=0', { waitUntil: 'domcontentloaded', timeout: 30000 });
await pg.waitForFunction(() => window.atlas && window.atlas.ready, { timeout: 40000 });
check('editor gate: ?edit=0 turns it off again', (await ev(() => localStorage.getItem('atlasEditor'))) === null);
await pg.waitForFunction(() => window.atlas.eng.map.areTilesLoaded(), { timeout: 20000 }).catch(() => {}); await wait(900);   // let this page finish before the next goto, or its glyph fetch is aborted

// ---- the first visit: the tour, once, and only for someone who arrived without intent (V0.39) ----
await ev(() => { try { localStorage.removeItem('atlasIntro'); } catch {} });
await pg.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 30000 });
await pg.waitForFunction(() => window.atlas && window.atlas.ready && window.atlas.eng.map.areTilesLoaded(), { timeout: 40000 }); await wait(900);
const intro1 = await ev(() => ({
  open: !document.getElementById('intro').hidden,
  rows: document.querySelectorAll('.intro-row').length,
  head: document.querySelector('.intro-head b')?.textContent,
  keys: Object.values(document.querySelectorAll('[data-intro]')).map(b => b.dataset.intro).join()
}));
check('intro: a first visit with no view in the URL opens the tour, four doors', intro1.open && intro1.rows === 4 && intro1.head === 'Ojai Atlas' && intro1.keys === 'years,layers,record,vision', intro1);
// a row does the thing it describes
await pg.click('[data-intro="layers"]'); await wait(400);
const intro2 = await ev(() => ({ open: !document.getElementById('intro').hidden, dock: document.getElementById('dock').classList.contains('open'), ls: localStorage.getItem('atlasIntro') }));
check('intro: a row closes the tour and does what it says (layers opens the dock), and the visit is remembered', !intro2.open && intro2.dock && intro2.ls === '1', intro2);
await pg.waitForFunction(() => window.atlas.eng.map.areTilesLoaded(), { timeout: 20000 }).catch(() => {}); await wait(400);
// hotkeys are inert behind it, and it never comes back on its own
await pg.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 30000 });
await pg.waitForFunction(() => window.atlas && window.atlas.ready && window.atlas.eng.map.areTilesLoaded(), { timeout: 40000 }); await wait(900);
const intro3 = await ev(() => !document.getElementById('intro').hidden);
await ev(() => window.atlas.hud.showIntro());
const z0 = await ev(() => window.atlas.eng.map.getZoom());
await pg.keyboard.press('KeyW'); await wait(250);
const intro4 = await ev(() => ({ open: !document.getElementById('intro').hidden, zoom: window.atlas.eng.map.getZoom() }));
await pg.keyboard.press('Escape'); await wait(300);
const intro5 = await ev(() => !document.getElementById('intro').hidden);
check('intro: never shown twice, reopened from the brand, hotkeys inert behind it, Esc closes it', intro3 === false && intro4.open && Math.abs(intro4.zoom - z0) < 0.001 && intro5 === false, { intro3, intro4, z0, intro5 });
// a shared link that already carries a view skips it entirely
await ev(() => { try { localStorage.removeItem('atlasIntro'); } catch {} });
await pg.goto(BASE + '/#34.4326/-119.1564/14/0/0?3d=0', { waitUntil: 'domcontentloaded', timeout: 30000 });
await pg.waitForFunction(() => window.atlas && window.atlas.ready && window.atlas.eng.map.areTilesLoaded(), { timeout: 40000 }); await wait(900);
check('intro: a shared link with a view in it never shows the tour', (await ev(() => document.getElementById('intro').hidden)) === true);

// ---- the real API behind the stubs ----
const health = await (await fetch(BASE + '/api/health')).json();
check('api: /api/health reports zones, lines, the writes state', health.status === 'healthy' && health.zones >= 50 && health.propertyLines > 0 && ['configured', 'not_configured'].includes(health.writes), health);
const research = await (await fetch(BASE + '/api/research')).json();
check('api: GET /api/research answers { items, synced }', Array.isArray(research.items) && typeof research.synced === 'boolean', research);
const post = await fetch(BASE + '/api/research', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pin: 'x', op: 'add', item: { apn: '1', center: [0, 0] } }) });
check('api: POST /api/research without the env is 501 not_configured (401 bad_pin when configured)', post.status === 501 || post.status === 401, post.status);
const up = await fetch(BASE + '/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pin: 'x', propertyId: 'howard', zoneId: 'property', type: 'image/png', data: 'AAAA', name: 'x.png' }) });
check('api: POST /api/upload is gated the same way', up.status === 501 || up.status === 401, up.status);
const props = await (await fetch(BASE + '/api/properties')).json();
check('api: /api/properties carries county on every property and an APN on every single-parcel one', props.length === 6 && props.every(p => p.county) && props.filter(p => !p.lots).every(p => p.apn), props.map(p => p.id + ':' + p.apn));

// ---- the social card: one image, both pages (V0.39) ----
const cardMeta = (html) => {
  const g = (re) => (html.match(re) || [, null])[1];
  return {
    img: g(/<meta property="og:image" content="([^"]+)"/),
    card: g(/<meta name="twitter:card" content="([^"]+)"/),
    title: g(/<meta property="og:title" content="([^"]+)"/),
    url: g(/<meta property="og:url" content="([^"]+)"/),
    w: g(/<meta property="og:image:width" content="([^"]+)"/),
    h: g(/<meta property="og:image:height" content="([^"]+)"/),
    alt: g(/<meta property="og:image:alt" content="([^"]+)"/),
    icon: /<link rel="icon"/.test(html),
    canon: g(/<link rel="canonical" href="([^"]+)"/)
  };
};
const ogAtlas = cardMeta(await (await fetch(BASE + '/')).text());
const ogClassic = cardMeta(await (await fetch(BASE + '/classic')).text());
const wellFormed = (m, path) =>
  /^https:\/\/eco-village-map\.vercel\.app\/og\.jpg$/.test(m.img) &&
  m.card === 'summary_large_image' && m.w === '1200' && m.h === '630' &&
  !!m.title && !!m.alt && m.icon &&
  m.url === 'https://eco-village-map.vercel.app' + path && m.canon === m.url;
check('social card: both pages carry og:image, the twitter card, the size, the alt text and their own canonical URL',
  wellFormed(ogAtlas, '/') && wellFormed(ogClassic, '/classic'), { atlas: ogAtlas.url, classic: ogClassic.url, img: ogAtlas.img });
// ---- V0.42: the 1 m surface and walking it -------------------------------------------------
await ev(() => window.atlas.eng.map.jumpTo({ center: [-119.15615, 34.43273], zoom: 17, pitch: 0, bearing: 0 }));
await wait(1400);
const hi = await ev(() => ({ areas: window.atlas.eng.hiAreas.length, src: window.atlas.eng.demSource, over: window.atlas.eng.overHiArea(), terrain: !!window.atlas.eng.map.getTerrain() }));
check('terrain: the baked index loads and the engine swaps to the 1 m surface over a property', hi.areas === 1 && hi.src === 'demhi' && hi.over === true, hi);
await ev(() => window.atlas.eng.map.jumpTo({ center: [-118.2, 34.05] })); await wait(900);
const off = await ev(() => ({ src: window.atlas.eng.demSource, over: window.atlas.eng.overHiArea() }));
check('terrain: off the baked ground it falls back to the global set rather than showing holes', off.src === 'dem' && off.over === false, off);

// walk mode refuses where there is no metre-accurate ground to stand on
await pg.keyboard.press('v'); await wait(500);
const refused = await ev(() => ({ on: window.atlas.walk.on, toast: (document.getElementById('toast').textContent || '').slice(0, 30) }));
check('walk: it refuses to stand on ground that has not been baked, and says so', refused.on === false && /Walk mode wants/.test(refused.toast), refused);

// the ground: queryTerrainElevation reads the DEM the engine decoded, and that decode does not
// complete under software GL with stubbed tiles - so the reading itself is checked as a unit, and
// the camera below is then checked against a ground of a known height rather than a guessed one.
const GROUND = 500, EXAG = 1.5, EYE = 1.7;
const gq = await ev(() => { const e = window.atlas.eng, m = e.map;
  e.setTerrain(true);                                  // no terrain, no ground: the guard comes first
  const orig = m.queryTerrainElevation.bind(m);
  m.queryTerrainElevation = () => 500 * 1.5;          // what the engine sees: exaggerated metres
  const v = e.groundElevation(m.getCenter());
  m.queryTerrainElevation = orig;
  return v; });
check('terrain: the engine reads the ground in real metres, with the exaggeration divided back out', Math.abs(gq - GROUND) < 0.001, { ground: gq });

await ev(() => { const e = window.atlas.eng; e.setTerrain(true); e.groundElevation = () => 500; e.map.jumpTo({ center: [-119.15615, 34.43273], zoom: 17, pitch: 0, bearing: 0 }); });
await wait(800);
await pg.keyboard.press('v'); await wait(1200);
const w = await ev(() => { const m = window.atlas.eng.map, st = window.atlas.walk.state();
  return { on: st.on, ground: st.groundM, alt: m.transform.getCameraAltitude(), pitch: m.getPitch(), maxPitch: m.getMaxPitch(),
    walking: document.querySelector('.hud').classList.contains('walking'), hint: !document.getElementById('walk-hint').hidden, btn: document.getElementById('ctl-walk').classList.contains('on') }; });
check('walk: the eye stands exactly 1.7 m above the ground, whatever the pitch or the viewport',
  w.on === true && w.ground === GROUND && Math.abs(w.alt - (GROUND * EXAG + EYE)) < 0.1 && w.pitch > 80 && w.maxPitch === 89, { ...w, want: GROUND * EXAG + EYE });
check('walk: the HUD gets out of the way — panels fade, the hint shows, the button lights', w.walking && w.hint && w.btn, { walking: w.walking, hint: w.hint, btn: w.btn });

// the key wiring: a real key press has to reach the walker and move it. How far depends on how
// fast this machine draws, so the step itself is measured separately, without the frame loop.
const k0 = await ev(() => window.atlas.walk.state());
await pg.keyboard.down('w'); await wait(1200); await pg.keyboard.up('w'); await wait(200);
const k1 = await ev(() => window.atlas.walk.state());
const kd = Math.hypot((k1.lat - k0.lat) * 111320, (k1.lng - k0.lng) * 111320 * Math.cos(k0.lat * Math.PI / 180));
check('walk: a W keypress reaches the walker and moves it forward', kd > 0.05 && kd < 8, { moved: +kd.toFixed(2) });

// the step itself: one second of walking, one second of running, both along the bearing
const step = await ev(() => { const w = window.atlas.walk, m = window.atlas.eng.map;
  m.jumpTo({ bearing: 0 }); w.setBearing?.(0);
  const a = w.state();
  w.keyFor('w', true); w.advance(1); w.keyFor('w', false);
  const b = w.state();
  w.keyFor('w', true); w.keyFor('shift', true); w.advance(1); w.keyFor('w', false); w.keyFor('shift', false);
  const c = w.state();
  const mN = (x, y) => (y.lat - x.lat) * 111320, mE = (x, y) => (y.lng - x.lng) * 111320 * Math.cos(x.lat * Math.PI / 180);
  return { bearing: a.bearing, walkN: mN(a, b), walkE: mE(a, b), runN: mN(b, c), runE: mE(b, c) }; });
check('walk: one second of W covers 1.5 m, one second of Shift-W covers 5 m, both along the bearing',
  Math.abs(step.walkN - 1.5) < 0.05 && Math.abs(step.walkE) < 0.05 && Math.abs(step.runN - 5) < 0.1 && Math.abs(step.runE) < 0.05,
  { walk: +step.walkN.toFixed(2), run: +step.runN.toFixed(2), drift: +step.walkE.toFixed(3), bearing: step.bearing });

const alt1 = await ev(() => window.atlas.eng.map.transform.getCameraAltitude());
check('walk: the eye stays at eye height as you move — the walker follows the ground, not a plane', Math.abs(alt1 - (GROUND * EXAG + EYE)) < 0.1, { alt: +alt1.toFixed(2) });

await pg.keyboard.press('Escape'); await wait(900);
const ex = await ev(() => { const m = window.atlas.eng.map; return { on: window.atlas.walk.on, maxPitch: m.getMaxPitch(), maxZoom: m.getMaxZoom(), zoom: m.getZoom(), pitch: m.getPitch(), walking: document.querySelector('.hud').classList.contains('walking'), hint: document.getElementById('walk-hint').hidden }; });
check('walk: Esc stands back up — the view, the pitch and zoom ceilings and the HUD all come back',
  ex.on === false && ex.maxPitch === 80 && ex.maxZoom === 21 && Math.abs(ex.zoom - 17) < 0.02 && ex.pitch < 1 && !ex.walking && ex.hint, ex);

// the routes themselves, straight from the server rather than through the page's stubs
const tIdxRes = await fetch(BASE + '/terrain/index.json');
const tIdx = await tIdxRes.json();
const baked = tIdxRes.status === 200 && Array.isArray(tIdx.areas) && tIdx.areas.length > 0;
check('terrain route: the index is served where tiles are baked, and an empty index where they are not',
  (baked && tIdx.areas.every(a => a.pid && Array.isArray(a.bbox) && a.bbox.length === 4)) || (tIdxRes.status === 404 && Array.isArray(tIdx.areas) && tIdx.areas.length === 0),
  { status: tIdxRes.status, areas: (tIdx.areas || []).length });
// The walkable world (SacredRebel/spatial-map) is a separate app on a separate host and reads its
// ground and its buildings from here rather than carrying a copy. The server has allowed any origin
// since it was written (app.use(cors())); this pins that, because the day it silently stops, the
// world stops loading its terrain and the failure looks like a bug in the world rather than here.
const corsIdx = await fetch(BASE + '/terrain/index.json', { headers: { Origin: 'https://spatial-map.example' } });
const corsStruct = await fetch(BASE + '/api/structures', { headers: { Origin: 'https://spatial-map.example' } });
check('cross-origin: another host can read the baked ground and the designed structures',
  corsIdx.headers.get('access-control-allow-origin') === '*' && corsStruct.headers.get('access-control-allow-origin') === '*',
  { terrain: corsIdx.headers.get('access-control-allow-origin'), structures: corsStruct.headers.get('access-control-allow-origin') });

const badZ = await fetch(BASE + '/terrain/abc/1/1.png');
const miss = await fetch(BASE + '/terrain/15/1/1.png');
check('terrain route: a malformed tile path is rejected and an unbaked tile is a cached 404, never an error',
  badZ.status === 400 && miss.status === 404 && /max-age=600/.test(miss.headers.get('cache-control') || ''),
  { badZ: badZ.status, miss: miss.status, cache: miss.headers.get('cache-control') });
if (baked) {
  const a = tIdx.areas[0], z = 15;
  const lng = (a.bbox[0] + a.bbox[2]) / 2, lat = (a.bbox[1] + a.bbox[3]) / 2, n = Math.pow(2, z);
  const tx = Math.floor((lng + 180) / 360 * n);
  const ty = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * n);
  const tRes = await fetch(`${BASE}/terrain/${z}/${tx}/${ty}.png`);
  const tBuf = Buffer.from(await tRes.arrayBuffer());
  check('terrain route: a baked tile is a real PNG under the property, cached for good',
    tRes.status === 200 && /image\/png/.test(tRes.headers.get('content-type') || '') && tBuf.length > 2000 && tBuf[1] === 0x50 && /immutable/.test(tRes.headers.get('cache-control') || ''),
    { pid: a.pid, tile: `${z}/${tx}/${ty}`, bytes: tBuf.length, cache: tRes.headers.get('cache-control') });
} else console.log('SKIP  terrain route: no tiles baked in this checkout — bake with scripts/bake-terrain.py');

const ogRes = await fetch(BASE + '/og.jpg');
const ogBuf = Buffer.from(await ogRes.arrayBuffer());
// JPEG: walk the markers to the SOF frame header — height then width, big-endian, at +5 and +7
const jpegSize = (b) => {
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1], len = b.readUInt16BE(i + 2);
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
    i += 2 + len;
  }
  return null;
};
const ogSize = jpegSize(ogBuf);
check('social card: /og.jpg is served as a real 1200x630 JPEG, cached for scrapers',
  ogRes.status === 200 && /image\/jpeg/.test(ogRes.headers.get('content-type') || '') &&
  ogSize && ogSize[0] === 1200 && ogSize[1] === 630 &&
  /max-age=\d{5,}/.test(ogRes.headers.get('cache-control') || ''),
  { status: ogRes.status, size: ogSize, bytes: ogBuf.length, cache: ogRes.headers.get('cache-control') });

const real = errs.filter(e => !/WebGL|GL_INVALID|calculateFogMatrix|hillshade layer and for 3D terrain|swiftshader|GPU stall|Service Worker registration blocked|Failed to load resource/i.test(e));
check('no page errors (GL warnings from software rendering excluded)', real.length === 0, real.slice(0, 5));
const badReal = bad.filter(x => !/demotiles|apn=999/.test(x));
check('no failed requests', badReal.length === 0, badReal.slice(0, 6));
await b.close();
done('v2');
