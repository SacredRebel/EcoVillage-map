// The Placement Studio — where a designed building meets the ground.
//
//   A structure in data/structures.json is a row: an id, the property it belongs to, and either a
//   ground outline or a .glb with a position, a heading, a size and a height above the ground.
//   Editing that by hand is a miserable way to decide where a house should stand, so this panel
//   does it on the map: pick a structure, drag its handle, turn it with a dial, sink or raise it a
//   few centimetres at a time, and watch the real 1 m terrain accept it. Nothing here invents
//   geometry — it only moves what the designer drew.
//
//   Every change is kept in memory until it is saved, and saving goes through the same PIN and the
//   same GitHub commit the position editor uses, so the map is never edited by a stranger and
//   every placement is a reviewable diff rather than a mystery.
import maplibregl from 'maplibre-gl';
import type { Engine } from '../engine/map';
import type { ModelLayer, Structure } from '../data/models';
import type { PropertyLayer } from '../data/properties';

const esc = (s: unknown) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
const el = (h: string) => { const d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstElementChild as HTMLElement; };
const R = 6378137, D2R = Math.PI / 180;
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'structure';
const round6 = (n: number) => Number(n.toFixed(6));

export interface Asset { path: string; name: string; bytes: number }

/** a ring's centre of gravity, good enough to hang a drag handle on */
function centroid(ring: [number, number][]): [number, number] {
  let x = 0, y = 0;
  for (const c of ring) { x += c[0]; y += c[1]; }
  return [x / ring.length, y / ring.length];
}

/** turn a ring about its own centre, in metres rather than degrees, so it does not shear */
function rotateRing(ring: [number, number][], deg: number): [number, number][] {
  const [cx, cy] = centroid(ring), a = deg * D2R, cos = Math.cos(a), sin = Math.sin(a);
  const mx = R * Math.cos(cy * D2R) * D2R;
  return ring.map(([lng, lat]) => {
    const dx = (lng - cx) * mx, dy = (lat - cy) * R * D2R;
    return [cx + (dx * cos - dy * sin) / mx, cy + (dx * sin + dy * cos) / (R * D2R)] as [number, number];
  });
}

export class Placer {
  root: HTMLElement;
  open = false;
  private sid: string | null = null;
  private marker: maplibregl.Marker | null = null;
  private assets: Asset[] = [];
  private dirty = new Set<string>();
  private removed: string[] = [];

  constructor(container: HTMLElement, private eng: Engine, private models: ModelLayer, private props: PropertyLayer, private toast: (s: string) => void) {
    this.root = document.createElement('aside');
    this.root.className = 'placer';
    this.root.hidden = true;
    container.appendChild(this.root);
    this.render();
  }

  toggle(force?: boolean) {
    this.open = force ?? !this.open;
    this.root.hidden = !this.open;
    if (!this.open) this.clearHandle();
    else { void this.loadAssets(); this.render(); }
  }

  /** the .glb files sitting in public/models, so a new asset is a drop-in rather than a code change */
  private async loadAssets() {
    try {
      const r = await fetch('/api/models');
      if (r.ok) { const j = await r.json(); this.assets = Array.isArray(j?.models) ? j.models : []; }
    } catch { this.assets = []; }
    if (this.open) this.render();
  }

  private get current(): Structure | null { return this.models.structures.find(s => s.id === this.sid) || null; }

  select(id: string | null) {
    this.sid = id;
    this.render();
    this.placeHandle();
    const s = this.current;
    if (s) {
      const at = this.anchor(s);
      if (at) this.eng.map.easeTo({ center: at, zoom: Math.max(this.eng.map.getZoom(), 17.5), duration: 700 });
    }
  }

  /** where the drag handle belongs: a model's own origin, or the middle of a drawn outline */
  private anchor(s: Structure): [number, number] | null {
    if (s.position) return [s.position[0], s.position[1]];
    if (s.outline && s.outline.length >= 3) return centroid(s.outline);
    return null;
  }

  private clearHandle() { this.marker?.remove(); this.marker = null; }

  private placeHandle() {
    this.clearHandle();
    const s = this.current; if (!s) return;
    const at = this.anchor(s); if (!at) return;
    const pin = el('<div class="place-handle" title="drag to move"><span>✥</span></div>');
    this.marker = new maplibregl.Marker({ element: pin, draggable: true, anchor: 'center' }).setLngLat(at).addTo(this.eng.map);
    this.marker.on('drag', () => { const l = this.marker!.getLngLat(); this.moveTo(l.lng, l.lat, false); });
    this.marker.on('dragend', () => { const l = this.marker!.getLngLat(); this.moveTo(l.lng, l.lat, true); });
  }

  /** move the whole structure — a model by its origin, an outline by every one of its points */
  private moveTo(lng: number, lat: number, final: boolean) {
    const s = this.current; if (!s) return;
    const at = this.anchor(s); if (!at) return;
    const dLng = lng - at[0], dLat = lat - at[1];
    if (s.position) s.position = [round6(lng), round6(lat)];
    if (s.outline) s.outline = s.outline.map(([x, y]) => [round6(x + dLng), round6(y + dLat)] as [number, number]);
    this.touch(s);
    if (final) this.render();
  }

  /** anything changed about a structure: redraw it, and remember that it needs saving */
  private touch(s: Structure) {
    this.dirty.add(s.id);
    this.models.refresh();
    if (s.status === 'model') this.models.updatePlacement(s);
    const bar = this.root.querySelector('[data-pl="dirty"]');
    if (bar) bar.textContent = this.dirtyLine();
    const save = this.root.querySelector('[data-pl="save"]') as HTMLButtonElement | null;
    if (save) save.disabled = !this.dirty.size && !this.removed.length;
  }

  private dirtyLine() {
    const n = this.dirty.size, r = this.removed.length;
    if (!n && !r) return 'Saved — nothing waiting.';
    return `${n} structure${n === 1 ? '' : 's'} moved${r ? `, ${r} removed` : ''} — not saved yet.`;
  }

  // ---- the panel -------------------------------------------------------------------------------
  private render() {
    const s = this.current;
    const list = this.models.structures.map(x =>
      `<button class="pl-row${x.id === this.sid ? ' on' : ''}" data-pl="pick" data-id="${esc(x.id)}">
        <b>${esc(x.name || x.id)}</b><span>${esc(x.status)} · ${esc(x.pid)}</span></button>`).join('') ||
      '<div class="pl-empty">No designed structures yet. Add one and drag it onto the ground.</div>';

    const propOpts = this.props.props.map(p => `<option value="${esc(p.id)}"${s && s.pid === p.id ? ' selected' : ''}>${esc(p.shortLabel || p.name)}</option>`).join('');
    const assetOpts = ['<option value="">— no model file —</option>']
      .concat(this.assets.map(a => `<option value="${esc(a.path)}"${s && s.model === a.path ? ' selected' : ''}>${esc(a.name)} (${(a.bytes / 1048576).toFixed(1)} MB)</option>`)).join('');

    const edit = s ? `
      <div class="pl-edit">
        <label class="pl-f">Name <input data-pl="name" value="${esc(s.name || '')}" maxlength="80"></label>
        <div class="pl-2">
          <label class="pl-f">Property <select data-pl="pid">${propOpts}</select></label>
          <label class="pl-f">Shows in <select data-pl="mode">
            ${['vision', 'current', 'both'].map(m => `<option value="${m}"${s.mode === m ? ' selected' : ''}>${m === 'vision' ? 'Vision' : m === 'current' ? 'Today' : 'both'}</option>`).join('')}
          </select></label>
        </div>
        <label class="pl-f">Drawn as <select data-pl="status">
          ${[['site', 'reserved ground'], ['massing', 'massing block'], ['model', '3D model (.glb)']].map(([v, l]) => `<option value="${v}"${s.status === v ? ' selected' : ''}>${esc(l)}</option>`).join('')}
        </select></label>
        ${s.status === 'model' ? `<label class="pl-f">Model file <select data-pl="model">${assetOpts}</select></label>` : ''}
        ${s.status === 'massing' ? this.slider('height', 'Height', s.heightFt ?? 20, 6, 120, 1, 'ft') : ''}
        ${s.status === 'model' ? `
          ${this.slider('rot', 'Heading', s.rotationDeg ?? 0, 0, 359, 1, '°')}
          ${this.slider('scale', 'Size', s.scale ?? 1, 0.05, 4, 0.01, '×')}
          ${this.slider('alt', 'Height over ground', s.altitudeM ?? 0, -10, 10, 0.1, 'm')}
        ` : s.outline ? this.slider('orient', 'Turn the outline', 0, -180, 180, 1, '°') : ''}
        <label class="pl-f">Note <textarea data-pl="note" rows="2" maxlength="600">${esc(s.note || '')}</textarea></label>
        <div class="pl-where">${this.whereLine(s)}</div>
        <div class="pl-acts">
          <button class="mini" data-pl="centre">Put it under the crosshair</button>
          <button class="mini" data-pl="dup">Duplicate</button>
          <button class="mini warn" data-pl="del">Remove</button>
        </div>
      </div>` : '<div class="pl-empty">Pick a structure above, or add one.</div>';

    this.root.innerHTML = `<div class="pl-head"><span>🏗 PLACEMENT STUDIO</span><button class="icon-btn" data-pl="close" title="close (B)">✕</button></div>
      <div class="pl-body">
        <div class="pl-list">${list}</div>
        <div class="pl-add"><button class="mini gold" data-pl="add">+ Add a structure here</button></div>
        ${edit}
        <div class="pl-dirty" data-pl="dirty">${this.dirtyLine()}</div>
        <div class="pl-save">
          <button class="mini" data-pl="capture">Capture JSON</button>
          <button class="mini gold" data-pl="save"${this.dirty.size || this.removed.length ? '' : ' disabled'}>🔒 Save to repo</button>
        </div>
        <textarea class="pl-out" hidden readonly></textarea>
        <div class="pl-note">Assets live in <code>public/models/</code>. A .glb wants metres, Y up, and its origin at the centre of the ground floor — then <b>Height over ground</b> is 0 and it rests on the hillside wherever you drag it.</div>
      </div>`;
    this.wire();
  }

  private slider(key: string, label: string, val: number, min: number, max: number, step: number, unit: string) {
    return `<label class="pl-f pl-slider">${esc(label)} <span class="pl-val" data-val="${key}">${val}${unit}</span>
      <input type="range" data-pl="${key}" min="${min}" max="${max}" step="${step}" value="${val}"></label>`;
  }

  private whereLine(s: Structure) {
    const at = this.anchor(s);
    if (!at) return 'No position yet — press “Put it under the crosshair”.';
    const g = this.eng.groundElevation({ lng: at[0], lat: at[1] });
    return `${at[1].toFixed(6)}, ${at[0].toFixed(6)}${g == null ? '' : ` · ground ${Math.round(g)} m (${Math.round(g * 3.28084)} ft)`}`;
  }

  private wire() {
    const q = (sel: string) => this.root.querySelector(sel) as HTMLElement | null;
    this.root.querySelectorAll('[data-pl="pick"]').forEach(b => b.addEventListener('click', () => this.select((b as HTMLElement).dataset.id!)));
    q('[data-pl="close"]')?.addEventListener('click', () => this.toggle(false));
    q('[data-pl="add"]')?.addEventListener('click', () => this.add());
    q('[data-pl="capture"]')?.addEventListener('click', () => this.capture());
    q('[data-pl="save"]')?.addEventListener('click', () => void this.save());
    q('[data-pl="centre"]')?.addEventListener('click', () => { const c = this.eng.map.getCenter(); this.moveTo(c.lng, c.lat, true); this.placeHandle(); });
    q('[data-pl="dup"]')?.addEventListener('click', () => this.duplicate());
    q('[data-pl="del"]')?.addEventListener('click', () => this.remove());

    const s = this.current; if (!s) return;
    const on = (sel: string, ev: string, fn: (v: string) => void) => q(sel)?.addEventListener(ev, e => fn((e.target as HTMLInputElement).value));
    on('[data-pl="name"]', 'input', v => { s.name = v; this.touch(s); });
    on('[data-pl="note"]', 'input', v => { s.note = v; this.touch(s); });
    on('[data-pl="pid"]', 'change', v => { s.pid = v; this.touch(s); });
    on('[data-pl="mode"]', 'change', v => { s.mode = v as Structure['mode']; this.touch(s); this.models.applyMode(this.eng.map.getPitch() >= 0 && document.querySelector('.hud')?.classList.contains('vision') ? 'vision' : 'today'); });
    on('[data-pl="status"]', 'change', v => {
      const was = s.status;
      s.status = v as Structure['status'];
      if (s.status === 'model' && !s.position) { const a = this.anchor(s) || [this.eng.map.getCenter().lng, this.eng.map.getCenter().lat]; s.position = [round6(a[0]), round6(a[1])]; }
      if (s.status === 'massing' && !s.heightFt) s.heightFt = 20;
      if (was === 'model' && s.status !== 'model') this.models.forget(s.id);
      this.touch(s); this.render(); this.placeHandle();
    });
    on('[data-pl="model"]', 'change', v => { s.model = v || null; this.models.forget(s.id); this.touch(s); });
    const live = (sel: string, key: string, fn: (n: number) => void, unit: string) => {
      const inp = q(sel) as HTMLInputElement | null; if (!inp) return;
      inp.addEventListener('input', () => {
        const n = Number(inp.value);
        const out = this.root.querySelector(`[data-val="${key}"]`); if (out) out.textContent = n + unit;
        fn(n); this.touch(s);
      });
    };
    live('[data-pl="rot"]', 'rot', n => { s.rotationDeg = n; }, '°');
    live('[data-pl="scale"]', 'scale', n => { s.scale = n; }, '×');
    live('[data-pl="alt"]', 'alt', n => { s.altitudeM = n; }, 'm');
    live('[data-pl="height"]', 'height', n => { s.heightFt = n; }, 'ft');
    // turning an outline is relative: the slider says how far from where it started, not an absolute
    const orient = q('[data-pl="orient"]') as HTMLInputElement | null;
    if (orient && s.outline) {
      const base = s.outline.map(c => [c[0], c[1]] as [number, number]);
      orient.addEventListener('input', () => {
        const n = Number(orient.value);
        const out = this.root.querySelector('[data-val="orient"]'); if (out) out.textContent = n + '°';
        s.outline = rotateRing(base, n).map(([x, y]) => [round6(x), round6(y)] as [number, number]);
        this.touch(s);
      });
    }
  }

  // ---- adding, copying, removing ---------------------------------------------------------------
  private uniqueId(base: string) {
    let id = slug(base), n = 2;
    while (this.models.structures.some(s => s.id === id)) id = slug(base) + '-' + n++;
    return id;
  }

  /** a new structure starts as a 12 x 9 m rectangle under the crosshair — something to drag */
  private add() {
    const c = this.eng.map.getCenter();
    const pid = this.props.props.find(p => p.id === (this.current?.pid || 'sulphur-mountain'))?.id || this.props.props[0]?.id || 'sulphur-mountain';
    const mx = R * Math.cos(c.lat * D2R) * D2R, my = R * D2R;
    const w = 6 / mx, h = 4.5 / my;
    const s: Structure = {
      id: this.uniqueId('new-structure'), pid, mode: 'vision', name: 'New structure', status: 'site',
      outline: [[c.lng - w, c.lat - h], [c.lng + w, c.lat - h], [c.lng + w, c.lat + h], [c.lng - w, c.lat + h], [c.lng - w, c.lat - h]].map(([x, y]) => [round6(x), round6(y)] as [number, number]),
      note: 'Added in the placement studio.'
    };
    this.models.structures.push(s);
    this.dirty.add(s.id);
    this.models.refresh();
    this.select(s.id);
  }

  private duplicate() {
    const s = this.current; if (!s) return;
    const copy: Structure = JSON.parse(JSON.stringify(s));
    copy.id = this.uniqueId(s.id + '-copy');
    copy.name = (s.name || s.id) + ' (copy)';
    this.models.structures.push(copy);
    this.dirty.add(copy.id);
    this.models.refresh();
    this.select(copy.id);
  }

  private remove() {
    const s = this.current; if (!s) return;
    if (!window.confirm(`Remove “${s.name || s.id}” from the map?`)) return;
    this.models.structures = this.models.structures.filter(x => x.id !== s.id);
    this.models.forget(s.id);
    this.dirty.delete(s.id);
    this.removed.push(s.id);
    this.sid = null;
    this.models.refresh();
    this.clearHandle();
    this.render();
  }

  // ---- getting it out --------------------------------------------------------------------------
  private payload() { return { structures: this.models.structures }; }

  private capture() {
    const ta = this.root.querySelector('.pl-out') as HTMLTextAreaElement;
    ta.hidden = false;
    ta.value = JSON.stringify(this.payload(), null, 2);
    ta.select();
    try { void navigator.clipboard?.writeText(ta.value); this.toast('The whole registry is on the clipboard — paste it into data/structures.json.'); } catch { /* fine */ }
  }

  private async save() {
    let pin = ''; try { pin = localStorage.getItem('ojaiMapEditPin') || ''; } catch { /* private mode */ }
    if (!pin) { pin = window.prompt('Edit PIN') || ''; if (!pin) return; }
    let r: Response;
    try { r = await fetch('/api/save-structures', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pin, structures: this.models.structures }) }); }
    catch { this.toast('Save failed — no answer from the server.'); return; }
    if (r.status === 401) { try { localStorage.removeItem('ojaiMapEditPin'); } catch { /* fine */ } this.toast('Wrong PIN.'); return; }
    if (r.status === 501) { this.toast('Saving is not configured on this deployment — use Capture JSON and paste it back.'); return; }
    if (r.status === 400) { const j = await r.json().catch(() => ({})); this.toast('Rejected: ' + (j.detail || j.error || 'the registry did not validate.')); return; }
    if (!r.ok) { this.toast('Save failed (' + r.status + ').'); return; }
    try { localStorage.setItem('ojaiMapEditPin', pin); } catch { /* fine */ }
    this.dirty.clear(); this.removed = [];
    this.render();
    this.toast('Saved — the placements are committed to the repo and live on the next deploy.');
  }
}
