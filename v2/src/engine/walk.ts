// Walk mode — the camera stands on the ground instead of flying over it.
//
//   MapLibre's camera is normally defined by a centre clamped to the terrain, which is exactly
//   wrong for a person: the eye has to be a fixed height above the ground and the look-at point has
//   to be wherever that eye is pointing, which is usually well below or above the surface. v5 gives
//   us the two pieces needed - setCenterClampedToGround(false) and setCenterElevation() - so the
//   whole thing can be done in the same engine, in the same coordinate pipeline, with no second
//   renderer and no duplicate scene.
//
//   The walker is the source of truth: a position, a bearing, a pitch and an eye height. Every
//   frame the camera is derived from it:
//
//     ground = terrain under the walker
//     eye    = ground + eyeHeight
//     focus  = a point LOOK_M in front of the eye, along the bearing and down the pitch
//
//   and then MapLibre's own calculateCameraOptionsFromTo turns that eye-and-focus pair into the
//   centre, zoom and elevation it wants. Deriving the zoom by hand means re-deriving the engine's
//   field of view and viewport maths, which is how a camera ends up a metre or two out of place;
//   asking the engine costs nothing and is right by construction. The ground is re-sampled every
//   frame, so you follow the hillside rather than a horizontal plane.
import maplibregl from 'maplibre-gl';
import type { Engine } from './map';
import { TERRAIN_EXAG } from './map';

const R = 6378137;
const D2R = Math.PI / 180;
export const EYE_M = 1.7;          // a person's eye, not the top of their head
const WALK_MS = 1.5;               // metres per second, an unhurried walk
const RUN_MS = 5.0;                // shift
const LOOK_M = 70;                 // how far ahead the camera focuses - also what sets the zoom
const WALK_PITCH = 87;             // near-horizontal; 90 would put the horizon on the vanishing line
const LOOK_SENS = 0.12;            // degrees per pixel of mouse movement
const MIN_PITCH = 55, MAX_PITCH = 89;   // 55 is looking 35\u00b0 down at your feet, 89 is the horizon
const MOVE = new Set(['w', 'a', 's', 'd', 'q', 'e', 'shift']);
const GROUND_WAIT = 3000;          // ms to wait for the terrain to answer before standing anyway

export interface WalkState { on: boolean; lng: number; lat: number; bearing: number; pitch: number; groundM: number | null; }

export class Walk {
  on = false;
  private lng = 0; private lat = 0;
  private bearing = 0; private pitch = WALK_PITCH;
  private ground: number | null = null;
  private keys = new Set<string>();
  private raf: number | null = null;
  private last = 0;
  private began = 0;
  private wasMaxZoom = 21;
  private restore: { center: maplibregl.LngLat; zoom: number; bearing: number; pitch: number; maxPitch: number; terrain: boolean } | null = null;
  private onKeyDown = (e: KeyboardEvent) => this.key(e, true);
  private onKeyUp = (e: KeyboardEvent) => this.key(e, false);
  private onMouseMove = (e: MouseEvent) => this.look(e);
  private onLockChange = () => { if (this.on && document.pointerLockElement !== this.eng.map.getCanvas()) this.locked = false; };
  private locked = false;
  /** told when walk mode starts or stops, so the HUD can get out of the way */
  onChange: (s: WalkState) => void = () => {};

  constructor(private eng: Engine) {}

  state(): WalkState { return { on: this.on, lng: this.lng, lat: this.lat, bearing: this.bearing, pitch: this.pitch, groundM: this.ground }; }

  private groundAt(lng: number, lat: number): number | null {
    const v = this.eng.groundElevation({ lng, lat });
    return v == null ? this.ground : v;
  }

  enter(at?: { lng: number; lat: number; bearing?: number }) {
    if (this.on) return;
    const m = this.eng.map, c = m.getCenter();
    this.restore = { center: c, zoom: m.getZoom(), bearing: m.getBearing(), pitch: m.getPitch(), maxPitch: m.getMaxPitch(), terrain: this.eng.terrain };
    this.wasMaxZoom = m.getMaxZoom();
    if (this.wasMaxZoom < 22) m.setMaxZoom(22);   // an eye-height camera sits closer than the map ever does
    this.lng = at?.lng ?? c.lng; this.lat = at?.lat ?? c.lat;
    this.bearing = at?.bearing ?? m.getBearing();
    this.pitch = WALK_PITCH;
    this.ground = null;
    if (!this.eng.terrain) this.eng.setTerrain(true);
    m.setMaxPitch(MAX_PITCH);
    m.setCenterClampedToGround(false);
    this.on = true;
    this.began = performance.now();
    this.ground = this.groundAt(this.lng, this.lat);
    this.apply();
    window.addEventListener('keydown', this.onKeyDown, true);
    window.addEventListener('keyup', this.onKeyUp, true);
    window.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('pointerlockchange', this.onLockChange);
    this.last = performance.now();
    this.raf = requestAnimationFrame(() => this.tick());
    this.onChange(this.state());
  }

  exit() {
    if (!this.on) return;
    this.on = false; this.locked = false;
    if (this.raf != null) cancelAnimationFrame(this.raf);
    this.raf = null;
    window.removeEventListener('keydown', this.onKeyDown, true);
    window.removeEventListener('keyup', this.onKeyUp, true);
    window.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('pointerlockchange', this.onLockChange);
    try { if (document.pointerLockElement) document.exitPointerLock(); } catch { /* fine */ }
    const m = this.eng.map, r = this.restore;
    m.setCenterClampedToGround(true);
    m.setMaxZoom(this.wasMaxZoom);
    if (r) {
      m.setMaxPitch(r.maxPitch);
      m.jumpTo({ center: r.center, zoom: r.zoom, bearing: r.bearing, pitch: Math.min(r.pitch, r.maxPitch) });
      if (!r.terrain) this.eng.setTerrain(false);
    }
    this.keys.clear();
    this.onChange(this.state());
  }

  toggle(at?: { lng: number; lat: number; bearing?: number }) { this.on ? this.exit() : this.enter(at); }

  /** click the canvas to capture the mouse; Esc releases it, a second Esc leaves walk mode */
  grabMouse() {
    if (!this.on) return;
    try { void this.eng.map.getCanvas().requestPointerLock(); this.locked = true; } catch { /* unsupported */ }
  }

  /** press or release a movement key without a keyboard event - for on-screen controls, and for
   *  driving the walk deterministically in a test rather than at the mercy of the frame rate */
  keyFor(k: string, down: boolean) { const key = k.toLowerCase(); if (!MOVE.has(key)) return; if (down) this.keys.add(key); else this.keys.delete(key); }
  /** point the walker somewhere, in compass degrees */
  setBearing(deg: number) { this.bearing = ((deg % 360) + 360) % 360; this.apply(); }

  private key(e: KeyboardEvent, down: boolean) {
    if (!this.on) return;
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')) return;
    const k = e.key.toLowerCase();
    if (k === 'escape') { if (down) this.locked ? this.locked = false : this.exit(); return; }
    if (!MOVE.has(k)) return;
    e.preventDefault(); e.stopPropagation();
    if (down) this.keys.add(k); else this.keys.delete(k);
  }

  private look(e: MouseEvent) {
    if (!this.on || !this.locked) return;
    this.bearing = (this.bearing + e.movementX * LOOK_SENS + 360) % 360;
    this.pitch = Math.max(MIN_PITCH, Math.min(MAX_PITCH, this.pitch - e.movementY * LOOK_SENS));
  }

  private tick() {
    if (!this.on) return;
    const now = performance.now();
    // a slow client still walks at a walking pace; the clamp only stops a long stall from
    // teleporting the walker across the hillside in one frame
    this.advance(Math.min(0.25, (now - this.last) / 1000));
    this.last = now;
    this.raf = requestAnimationFrame(() => this.tick());
  }

  /** one step of the walk, dt seconds long. Separated from the frame loop so it can be reasoned
   *  about - and tested - without depending on how fast the machine happens to be drawing. */
  advance(dt: number) {
    const speed = (this.keys.has('shift') ? RUN_MS : WALK_MS) * dt;
    let fwd = 0, side = 0;
    if (this.keys.has('w')) fwd += 1;
    if (this.keys.has('s')) fwd -= 1;
    if (this.keys.has('d')) side += 1;
    if (this.keys.has('a')) side -= 1;
    if (this.keys.has('q')) this.bearing = (this.bearing - 60 * dt + 360) % 360;
    if (this.keys.has('e')) this.bearing = (this.bearing + 60 * dt) % 360;
    if (fwd || side) {
      const b = this.bearing * D2R;
      const dn = (Math.cos(b) * fwd - Math.sin(b) * side) * speed;   // north
      const de = (Math.sin(b) * fwd + Math.cos(b) * side) * speed;   // east
      this.lat += (dn / R) / D2R;
      this.lng += (de / (R * Math.cos(this.lat * D2R))) / D2R;
    }
    this.apply();
  }

  /** derive the camera from the walker (the maths in the header comment) */
  private apply() {
    const m = this.eng.map;
    const g = this.groundAt(this.lng, this.lat);
    if (g != null) this.ground = g;
    // terrain tiles can still be in flight when walk mode starts. Standing on ground we have not
    // measured would drop the eye to sea level and bury the camera, so the camera is left where it
    // is until the ground answers - and after GROUND_WAIT it is seated anyway rather than hanging.
    if (this.ground == null) { if (performance.now() - this.began < GROUND_WAIT) return; this.ground = 0; }
    // elevations here live in the terrain's own (exaggerated) units, as queryTerrainElevation
    // does - so the ground is scaled but the 1.7 m of the person is not.
    const eye = (this.ground ?? 0) * TERRAIN_EXAG + EYE_M;
    const p = this.pitch * D2R, b = this.bearing * D2R;
    const ahead = LOOK_M * Math.sin(p);
    const lat2 = this.lat + ((Math.cos(b) * ahead) / R) / D2R;
    const lng2 = this.lng + ((Math.sin(b) * ahead) / (R * Math.cos(this.lat * D2R))) / D2R;
    const focusZ = eye - LOOK_M * Math.cos(p);
    const opts = m.calculateCameraOptionsFromTo(new maplibregl.LngLat(this.lng, this.lat), eye, new maplibregl.LngLat(lng2, lat2), focusZ);
    opts.elevation = focusZ;
    opts.bearing = this.bearing;
    opts.pitch = this.pitch;
    m.jumpTo(opts);
  }
}
