// Designed structures — the Vision half of the map.
//
//   The county's footprints (properties.ts) are what stands on the land today. This layer is what
//   is proposed for it: a site outline until there is a model, then the model itself. Entries live
//   in data/structures.json and are served by /api/structures, so a new building is a row plus a
//   .glb, never a code change.
//
//   glTF is rendered through a MapLibre custom layer: three.js draws into the map's own GL context
//   with the map's own camera (options.modelViewProjectionMatrix), so a model sits in the same
//   coordinate pipeline as everything else — it tracks pitch, bearing and terrain with no second
//   source of truth about where things are. three.js and the glTF loader are imported only when a
//   model is actually placed, so a map with no models pays nothing for the capability.
import maplibregl from 'maplibre-gl';
import type { Engine } from '../engine/map';
import { PROP_ANCHOR, TERRAIN_EXAG } from '../engine/map';

export interface Structure {
  id: string; pid: string; zid?: string | null;
  mode: 'vision' | 'current' | 'both';
  name: string; note?: string;
  status: 'site' | 'massing' | 'model';
  /** the ground plan: a ring of [lng, lat]. A site or a massing block is drawn from this. */
  outline?: [number, number][] | null;
  /** massing only: how tall to extrude the outline, in feet */
  heightFt?: number | null;
  /** model only: a .glb served from this origin */
  model?: string | null;
  /** model only: where its origin sits, and how it is turned and sized */
  position?: [number, number] | null;
  /**
   * model only: metres ABOVE THE GROUND at its position, not above sea level. The ground is
   * sampled from the terrain and multiplied by the exaggeration the whole map is drawn at, so a
   * model with 0 here rests on the hillside wherever it is dragged; a negative value sinks it
   * into a cut, a positive one lifts it onto a plinth.
   */
  altitudeM?: number | null;
  rotationDeg?: number;
  scale?: number;
}

const FT = 0.3048;
type Three = typeof import('three');

export class ModelLayer {
  structures: Structure[] = [];
  private mode: 'today' | 'vision' = 'today';
  private custom: maplibregl.CustomLayerInterface | null = null;
  private three: Three | null = null;
  private scene: import('three').Scene | null = null;
  private camera: import('three').Camera | null = null;
  private renderer: import('three').WebGLRenderer | null = null;
  private loaded = new Set<string>();

  constructor(private eng: Engine) {}

  async load(): Promise<Structure[]> {
    try {
      const r = await fetch('/api/structures');
      if (r.ok) { const j = await r.json(); this.structures = Array.isArray(j?.structures) ? j.structures : []; }
    } catch { this.structures = []; }
    return this.structures;
  }

  /** a site outline and a massing block are ordinary map layers; only a .glb needs three.js */
  private planFeatures(): GeoJSON.Feature[] {
    const out: GeoJSON.Feature[] = [];
    for (const s of this.structures) {
      if (!s.outline || s.outline.length < 3) continue;
      const ring = s.outline.map(c => [c[0], c[1]] as [number, number]);
      const [a, b] = [ring[0], ring[ring.length - 1]];
      if (a[0] !== b[0] || a[1] !== b[1]) ring.push([a[0], a[1]]);
      out.push({ type: 'Feature', properties: {
        sid: s.id, pid: s.pid, name: s.name, status: s.status, mode: s.mode,
        heightM: s.status === 'massing' && s.heightFt ? s.heightFt * FT : 0
      }, geometry: { type: 'Polygon', coordinates: [ring] } });
    }
    return out;
  }

  /** the rendered height of the ground under a point: real metres times the map's exaggeration */
  private groundZ(lng: number, lat: number): { z: number; known: boolean } {
    const g = this.eng.groundElevation({ lng, lat });
    return { z: (g ?? 0) * TERRAIN_EXAG, known: g != null };
  }

  // MapLibre's world is Mercator: one unit is the whole world, so a metre is tiny and
  // latitude-dependent. A model is placed by its own matrix rather than by scene units.
  /** re-derive a model's matrix inputs - after the editor moves it, or after terrain arrives */
  updatePlacement(s: Structure) {
    const o = this.scene?.children.find(c => ((c.userData || {}).structure as Structure | undefined)?.id === s.id);
    if (!o || !s.position) return;
    const g = this.groundZ(s.position[0], s.position[1]);
    const mc = maplibregl.MercatorCoordinate.fromLngLat({ lng: s.position[0], lat: s.position[1] }, g.z + (s.altitudeM ?? 0));
    o.userData.structure = s;
    o.userData.grounded = g.known;
    o.userData.place = { x: mc.x, y: mc.y, z: mc.z ?? 0, unit: mc.meterInMercatorCoordinateUnits() * (s.scale ?? 1), rot: ((s.rotationDeg ?? 0) * Math.PI) / 180 };
    this.eng.map.triggerRepaint();
  }

  /** terrain tiles arrive late; anything placed before they did is re-seated once they have */
  private reground() {
    if (!this.scene) return;
    for (const o of this.scene.children) {
      const s = (o.userData || {}).structure as Structure | undefined;
      if (s && s.position && !o.userData.grounded) this.updatePlacement(s);
    }
  }

  /** the editor replaced or removed a structure: drop its model so the next pass reloads it */
  forget(id: string) {
    this.loaded.delete(id);
    const o = this.scene?.children.find(c => ((c.userData || {}).structure as Structure | undefined)?.id === id);
    if (o && this.scene) { this.scene.remove(o); this.eng.map.triggerRepaint(); }
  }

  build() {
    const m = this.eng.map;
    m.addSource('vis', { type: 'geojson', data: { type: 'FeatureCollection', features: this.planFeatures() } });
    // a reserved site reads as ground marking, not a building: no height, a dashed violet edge
    m.addLayer({ id: 'vis-site', type: 'fill', source: 'vis', minzoom: 13.5, filter: ['==', ['get', 'status'], 'site'],
      paint: { 'fill-color': '#8e5cf5', 'fill-opacity': 0.16 } }, PROP_ANCHOR);
    m.addLayer({ id: 'vis-site-line', type: 'line', source: 'vis', minzoom: 13.5, filter: ['==', ['get', 'status'], 'site'],
      layout: { 'line-join': 'round' }, paint: { 'line-color': '#c9a2ff', 'line-width': 2, 'line-dasharray': [2.5, 1.5], 'line-opacity': 0.95 } }, PROP_ANCHOR);
    m.addLayer({ id: 'vis-3d', type: 'fill-extrusion', source: 'vis', minzoom: 13.5, filter: ['==', ['get', 'status'], 'massing'],
      paint: { 'fill-extrusion-color': '#c9a2ff', 'fill-extrusion-height': ['get', 'heightM'], 'fill-extrusion-base': 0, 'fill-extrusion-opacity': 0.72, 'fill-extrusion-vertical-gradient': true } }, PROP_ANCHOR);
    for (const l of ['vis-site', 'vis-3d']) m.on('click', l, e => { const f = e.features?.[0]; if (!f) return; const s = this.structures.find(x => x.id === f.properties.sid); if (s) this.onSelect(s); });
    m.on('idle', () => this.reground());
    this.applyMode(this.mode);
    void this.ensureModels();
  }

  onSelect: (s: Structure) => void = () => {};

  refresh() {
    const src = this.eng.map.getSource('vis') as maplibregl.GeoJSONSource | undefined;
    if (src) src.setData({ type: 'FeatureCollection', features: this.planFeatures() });
    for (const s of this.structures) if (s.status === 'model' && s.position) this.updatePlacement(s);
    void this.ensureModels();
  }

  applyMode(mode: 'today' | 'vision') {
    this.mode = mode;
    const m = this.eng.map, want = mode === 'today' ? 'current' : 'vision';
    const f: maplibregl.FilterSpecification = ['any', ['==', ['get', 'mode'], 'both'], ['==', ['get', 'mode'], want]];
    if (m.getLayer('vis-site')) m.setFilter('vis-site', ['all', ['==', ['get', 'status'], 'site'], f]);
    if (m.getLayer('vis-site-line')) m.setFilter('vis-site-line', ['all', ['==', ['get', 'status'], 'site'], f]);
    if (m.getLayer('vis-3d')) m.setFilter('vis-3d', ['all', ['==', ['get', 'status'], 'massing'], f]);
    if (this.scene && this.three) for (const o of this.scene.children) {
      const s = (o.userData || {}).structure as Structure | undefined;
      if (s) o.visible = s.mode === 'both' || s.mode === want;
    }
  }

  /** every structure with a .glb, loaded once into one three.js scene shared by the custom layer */
  private async ensureModels() {
    const want = this.structures.filter(s => s.status === 'model' && s.model && s.position);
    if (!want.length) return;
    if (!this.three) {
      const THREE = await import('three');
      this.three = THREE;
      this.scene = new THREE.Scene();
      this.camera = new THREE.Camera();
      this.scene.add(new THREE.AmbientLight(0xffffff, 1.1));
      const sun = new THREE.DirectionalLight(0xfff3dd, 2.2); sun.position.set(-0.6, -0.9, 1.4).normalize();
      this.scene.add(sun);
      const fill = new THREE.DirectionalLight(0xbcd4ff, 0.9); fill.position.set(0.8, 0.6, 0.7).normalize();
      this.scene.add(fill);
    }
    const THREE = this.three!;
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
    const loader = new GLTFLoader();
    for (const s of want) {
      if (this.loaded.has(s.id)) continue;
      this.loaded.add(s.id);
      try {
        const gltf = await loader.loadAsync(s.model!);
        const root = gltf.scene;
        root.userData.structure = s;
        root.visible = s.mode === 'both' || s.mode === (this.mode === 'today' ? 'current' : 'vision');
        this.scene!.add(root);
        this.updatePlacement(s);
        this.addCustom();
        this.eng.map.triggerRepaint();
      } catch (e) { console.info('[atlas] model ' + s.id, e); }
    }
    void THREE;
  }

  private addCustom() {
    const m = this.eng.map;
    if (this.custom || !this.three || !this.scene || !this.camera) return;
    const THREE = this.three, scene = this.scene, camera = this.camera;
    const self = this;
    this.custom = {
      id: 'vis-models', type: 'custom', renderingMode: '3d',
      onAdd(_map, gl) {
        self.renderer = new THREE.WebGLRenderer({ canvas: m.getCanvas(), context: gl as WebGLRenderingContext, antialias: false });
        self.renderer.autoClear = false;
      },
      render(_gl, opts) {
        if (!self.renderer) return;
        for (const o of scene.children) {
          const pl = (o.userData || {}).place as { x: number; y: number; z: number; unit: number; rot: number } | undefined;
          if (!pl) continue;
          // z up in Mercator, y down: the rotation about X turns a glTF's Y-up model the right way
          o.matrix = new THREE.Matrix4()
            .makeTranslation(pl.x, pl.y, pl.z)
            .multiply(new THREE.Matrix4().makeScale(pl.unit, -pl.unit, pl.unit))
            .multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2))
            .multiply(new THREE.Matrix4().makeRotationY(pl.rot));
          o.matrixAutoUpdate = false;
        }
        camera.projectionMatrix = new THREE.Matrix4().fromArray(Array.from(opts.modelViewProjectionMatrix) as number[]);
        self.renderer.resetState();
        self.renderer.render(scene, camera);
        m.triggerRepaint();
      }
    };
    m.addLayer(this.custom, PROP_ANCHOR);
  }
}
