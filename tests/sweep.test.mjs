// The sweep (/): a fresh page, then every control on the HUD is clicked and every documented
// hotkey pressed — each one has to do the thing it advertises, and nothing may throw along the
// way. It lives in its own file because driving terrain, 3D, the base crossfade and the mode
// filter back to back is more than one software-GL page survives next to the rest of the suite.
import { launch, check, done, PNG, DEM, BASE, EXT } from './lib.mjs';

const b = await launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
const pg = await ctx.newPage();
const errs = [];
pg.on('pageerror', e => errs.push('PAGE ' + e.message));
pg.on('console', m => { if (['warning', 'error'].includes(m.type())) errs.push('CONSOLE ' + m.text().slice(0, 220)); });
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const ev = (fn, ...a) => pg.evaluate(fn, ...a);

await pg.route('**/*', r => {
  const u = r.request().url();
  if (/3DEPElevation\/ImageServer\/identify/.test(u)) return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ value: '412.7' }) });
  if (u.includes('/api/research') && r.request().method() === 'GET') return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ items: [], synced: false }) });
  if (u.includes('/api/dossier') || u.includes('/api/parcel')) return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ part: 'core', apn: '037-0-012-125', apn10: '0370012125', center: [34.4326, -119.1564], sections: [], flags: [], records: [], portals: [], raw: [] }) });
  if (/\/legend\?/.test(u)) return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ layers: [] }) });
  if (EXT.test(u)) return r.fulfill({ status: 200, contentType: 'image/png', body: /terrarium|elevation-tiles/.test(u) ? DEM : PNG });
  return r.continue();
});

// a hash keeps the first-visit tour out of the way; the tour has its own checks in v2.test.mjs
await pg.goto(BASE + '/#34.4326/-119.1564/14/0/0?3d=0', { waitUntil: 'domcontentloaded', timeout: 30000 });
await pg.waitForFunction(() => window.atlas && window.atlas.ready && window.atlas.eng.map.areTilesLoaded(), { timeout: 40000 });
await wait(1200);

// ---- the sweep: every HUD control clicked, every documented hotkey pressed, and each one has
//      to actually do what it advertises. The editor's own P is covered by the block above. ----
await ev(() => { window.__opened = []; window.open = (u) => { window.__opened.push(u); return null; }; });
const errsBefore = errs.length;
const snap = () => ev(() => { const m = window.atlas.eng.map, c = m.getCenter(), s = window.atlas.state();
  return { lng: +c.lng.toFixed(5), lat: +c.lat.toFixed(5), zoom: +m.getZoom().toFixed(3), bearing: Math.round(m.getBearing()), pitch: Math.round(m.getPitch()),
    terrain: s.terrain, mode: s.mode, overlays: [...s.overlays].sort().join(), base: s.base,
    dock: document.getElementById('dock').classList.contains('open'), insp: document.getElementById('inspector').classList.contains('open'),
    toast: !document.getElementById('toast').hidden, opened: window.__opened.length,
    openSecs: [...document.querySelectorAll('.dock details.sec')].filter(d => d.open).length }; });
const keyFails = [];
// one snapshot per step, not two: every page.evaluate is a round trip into a renderer that is
// busy drawing the map in software, and the pair-per-key version spent minutes doing nothing
let prev = null;
const hotkey = async (press, label, changed, settle = 420) => {
  const a = prev || (prev = await snap());
  await pg.keyboard.press(press); await wait(settle);
  const b = prev = await snap();
  if (!changed(a, b)) keyFails.push(label + ' ' + JSON.stringify({ a, b }).slice(0, 200));
};
await ev(() => {
  const h = window.atlas.hud, e = window.atlas.eng;
  h.dockOpen = false; h.inspectorOpen = false; h.syncPanels();
  for (const id of [...e.active]) e.setOverlay(id, false);
  e.setBase('esri'); e.setTerrain(false);
  e.setQuality('low');   // software GL: every page.evaluate queues behind a frame, so draw less
  e.map.jumpTo({ center: [-119.1564, 34.4326], zoom: 14, bearing: 0, pitch: 0 });
});
await wait(900); prev = null;
await hotkey('KeyW', 'W pans north', (a, b) => b.lat > a.lat);
await hotkey('KeyS', 'S pans south', (a, b) => b.lat < a.lat);
await hotkey('KeyA', 'A pans west', (a, b) => b.lng < a.lng);
await hotkey('KeyD', 'D pans east', (a, b) => b.lng > a.lng);
await hotkey('KeyQ', 'Q rotates left', (a, b) => b.bearing !== a.bearing, 700);
await hotkey('KeyE', 'E rotates right', (a, b) => b.bearing !== a.bearing, 700);
await hotkey('KeyR', 'R tilts up', (a, b) => b.pitch > a.pitch, 700);
await hotkey('KeyF', 'F tilts down', (a, b) => b.pitch < a.pitch, 700);
await hotkey('Equal', '+ zooms in', (a, b) => b.zoom > a.zoom, 520);
await hotkey('Minus', '- zooms out', (a, b) => b.zoom < a.zoom, 520);
await hotkey('KeyN', 'N faces north', (a, b) => b.bearing === 0, 900);
await hotkey('KeyT', 'T goes 3D', (a, b) => b.pitch > a.pitch + 20, 1400);
await hotkey('KeyT', 'T comes back to 2D', (a, b) => b.pitch < a.pitch - 20, 1400);
await hotkey('KeyX', 'X toggles terrain', (a, b) => b.terrain !== a.terrain, 700);
await hotkey('KeyX', 'X toggles terrain back', (a, b) => b.terrain !== a.terrain, 700);
await hotkey('KeyL', 'L toggles the dock', (a, b) => b.dock !== a.dock);
await hotkey('KeyL', 'L toggles it back', (a, b) => b.dock !== a.dock);
await hotkey('KeyI', 'I toggles the inspector', (a, b) => b.insp !== a.insp);
await hotkey('KeyI', 'I toggles it back', (a, b) => b.insp !== a.insp);
await hotkey('KeyH', 'H turns the historic topo on', (a, b) => b.overlays.includes('histtopo') && !a.overlays.includes('histtopo'), 700);
await hotkey('KeyH', 'H turns it off again', (a, b) => !b.overlays.includes('histtopo'), 700);
await hotkey('Digit3', '3 opens the dock on a group', (a, b) => b.dock && b.openSecs !== a.openSecs);
await hotkey('Digit3', '3 folds that group again', (a, b) => b.openSecs !== a.openSecs);
await hotkey('KeyL', 'L closes the dock again', (_a, b) => !b.dock);
await hotkey('BracketRight', '] steps the aerial year forward', (a, b) => b.base !== a.base, 900);
await hotkey('BracketLeft', '[ steps it back', (a, b) => b.base !== a.base, 900);
await hotkey('Space', 'Space flips the mode', (a, b) => b.mode !== a.mode, 600);
await hotkey('Space', 'Space flips it back', (a, b) => b.mode !== a.mode, 600);
await hotkey('Shift+Slash', '? shows the hotkey card', (a, b) => b.toast);
await hotkey('KeyG', 'G hands the camera to Google Earth', (a, b) => b.opened > a.opened);
await ev(() => { document.getElementById('inspector').classList.add('open'); window.atlas.hud.inspectorOpen = true; }); prev = null;
await hotkey('Escape', 'Esc closes the inspector', (_a, b) => !b.insp);
check('hotkeys: every documented key does the thing it advertises', keyFails.length === 0, keyFails.slice(0, 4));
// every control in the HUD, clicked
const ctlFails = [];
// Playwright's own click spends seconds per control waiting for "stable" under software GL, so
// the actionability is asserted directly instead: the control has a box, is interactive, and is
// the element the browser would hit at its own centre — i.e. nothing is covering it — then it is
// clicked for real. Same guarantee, a fraction of the wall clock.
const hitTest = (sel) => ev((s) => {
  const e = document.querySelector(s);
  if (!e) return 'missing from the page';
  const r = e.getBoundingClientRect();
  if (r.width < 4 || r.height < 4) return 'has no box';
  const cs = getComputedStyle(e);
  if (cs.visibility === 'hidden' || cs.display === 'none' || cs.pointerEvents === 'none') return 'not interactive (' + cs.visibility + '/' + cs.display + '/' + cs.pointerEvents + ')';
  if (r.right < 0 || r.bottom < 0 || r.left > innerWidth || r.top > innerHeight) return 'off screen ' + JSON.stringify([Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom), innerWidth, innerHeight]);
  const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
  if (!top || !(top === e || e.contains(top) || top.contains(e))) return 'covered by ' + (top ? (top.id || top.className || top.tagName) : 'nothing');
  e.click();
  return 'ok';
}, sel);
const clickCtl = async (sel, label, changed, settle = 420) => {
  const a = prev || (prev = await snap());
  const hit = await hitTest(sel);
  await wait(settle);
  const b = prev = await snap();
  if (hit !== 'ok') ctlFails.push(label + ' — ' + hit);
  else if (changed && !changed(a, b)) ctlFails.push(label + ' — no effect ' + JSON.stringify({ a, b }).slice(0, 160));
};
await ev(() => { const h = window.atlas.hud; h.dockOpen = false; h.inspectorOpen = false; h.syncPanels(); }); await wait(300); prev = null;
// a panel slides in over 0.22 s; wait for it to actually be on screen before poking inside it
const onScreen = (sel) => pg.waitForFunction((x) => { const e = document.querySelector(x); if (!e) return false; const r = e.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth + 1 && r.width > 4; }, sel, { timeout: 8000 }).catch(() => {});
await clickCtl('#ctl-layers', 'layers button opens the dock', (a, b) => b.dock && !a.dock);
await onScreen('#dock'); prev = null;
await clickCtl('#dock-close', 'the dock’s own ✕ closes it', (a, b) => !b.dock && a.dock);
await clickCtl('#ctl-insp', 'inspector button opens it', (a, b) => b.insp && !a.insp);
await onScreen('#inspector'); prev = null;
await clickCtl('.insp-tabs [data-tab="research"]', 'the Research tab shows', null);
await clickCtl('.insp-tabs [data-tab="parcel"]', 'the Parcel tab shows', null);
await clickCtl('.insp-tabs [data-tab="legend"]', 'the What-you-see tab shows', null);
await clickCtl('#insp-close', 'the inspector’s own ✕ closes it', (a, b) => !b.insp && a.insp);
// the 3D and terrain buttons drive the same engine calls the T and X keys just proved; under
// software GL four more terrain rebuilds crash the renderer, so check the wiring, not the pixels
await ev(() => { const e = window.atlas.eng; window.__spy = [];
  e.__set3D = e.set3D; e.set3D = v => window.__spy.push('3d:' + v);
  e.__setTerrain = e.setTerrain; e.setTerrain = v => window.__spy.push('terrain:' + v); });
const h3 = await hitTest('#ctl-3d'), hT = await hitTest('#ctl-terrain'); await wait(250);
if (h3 !== 'ok') ctlFails.push('the 3D button — ' + h3);
if (hT !== 'ok') ctlFails.push('the terrain button — ' + hT);
prev = null;
const spy = await ev(() => { const e = window.atlas.eng; e.set3D = e.__set3D; e.setTerrain = e.__setTerrain; delete e.__set3D; delete e.__setTerrain; return window.__spy; });
if (!(spy.length === 2 && spy[0].startsWith('3d:') && spy[1].startsWith('terrain:'))) ctlFails.push('the 3D / terrain buttons — not wired to the engine: ' + JSON.stringify(spy));
await ev(() => window.atlas.eng.map.jumpTo({ bearing: 40 })); await wait(200); prev = null;
await clickCtl('#ctl-north', 'the compass faces north', (_a, b) => b.bearing === 0, 900);
await clickCtl('#mode-pill', 'the mode pill flips', (a, b) => b.mode !== a.mode, 600);
await clickCtl('#mode-pill', 'and flips back', (a, b) => b.mode !== a.mode, 600);
await clickCtl('#btn-help', 'the ? button shows the hotkey card', (_a, b) => b.toast);
await clickCtl('#tl-aerial .tl-tag', 'the timeline’s aerial tag switches the base to a flight', (a, b) => b.base !== a.base, 1000);
await clickCtl('#tl-hist .tl-tag', 'the historic-topo tag turns that layer on', (a, b) => b.overlays !== a.overlays, 1000);
const qOk = await ev(() => {
  const sel = document.getElementById('ctl-quality');
  if (!sel || sel.options.length < 2) return false;
  sel.value = 'low'; sel.dispatchEvent(new Event('change', { bubbles: true }));
  const low = window.atlas.eng.map.getPixelRatio ? window.atlas.eng.map.getPixelRatio() : 1;
  sel.value = 'high'; sel.dispatchEvent(new Event('change', { bubbles: true }));
  return low === 1;
});
await wait(300);
if (!qOk) ctlFails.push('the quality selector — low did not drop the pixel ratio to 1');
check('controls: every button in the HUD is reachable and does its job', ctlFails.length === 0, ctlFails.slice(0, 4));
const real = errs.slice(errsBefore).filter(e => !/WebGL|GL_INVALID|calculateFogMatrix|hillshade layer and for 3D terrain|swiftshader|GPU stall|Service Worker registration blocked|Failed to load resource/i.test(e));
check('sweep: nothing on the page threw while every control and key was exercised', real.length === 0, real.slice(0, 3));

await pg.waitForFunction(() => window.atlas.eng.map.areTilesLoaded(), { timeout: 15000 }).catch(() => {});
await wait(500);
await b.close();
done('sweep');
