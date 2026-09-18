# 🗺️ Ojai Valley Properties — Interactive Development Map

**Multi-property platform** — one interactive map, multiple properties in the Ojai Valley: the **Howard Property** (1320 Baldwin Rd), the **Sulphur Mountain Eco-Village** (11962 Sulphur Mountain Rd), **Keri's Property** (14209 De La Garrigue Rd), **Cher's Property** (10622 Encino Dr, Oak View), **Black Mountain Ranch** (8434 Ojai Santa Paula Rd — the 63-parcel Lemuria Headquarters), and the **Rose Valley Property** (7343 Rose Valley Rd — a 40-acre for-sale inholding surrounded by Los Padres National Forest).

## How it works

The map opens on an **overview** showing every property with its glowing rainbow boundary and name chip. Click a chip (or zoom in) to fly into a property — each property's project icons fade in as you approach that property's own zoom level.

**Current ⇄ Vision:** the pill toggle at the top of the map switches the whole platform between **Today** (what exists — real parcels, real photos, factual panels) and **✨ Vision** (the Lemuria Life overlay — golden branding, vision projects, vision galleries, and each property's future identity). The choice is remembered per visitor. Click any icon for the full project page; click a boundary for that property's details panel.

| Property | Projects | Size | Status |
|---|---|---|---|
| 🏔️ Howard Property | 4 today · 13 in vision | ~44 acres | Proposal draft |
| 🌿 Sulphur Mountain Eco-Village | 4 today · 18 in vision | ~10 acres | Lemuria Pilot |
| 🌸 Keri's Property | 3 places | ~34 acres | Starting points |
| 🌹 Cher's Property | 2 places | 2 acres | Starting points |
| ⛰️ Black Mountain Ranch | 9 today · 15 in vision · 63 parcels | 3,380 county acres | Lemuria Headquarters |
| 🌄 Rose Valley | Boundary + panel | 40 acres | For sale — $810K acquisition target |

Sulphur Mountain photos load directly from the [EcoVillage-map repo](https://github.com/SacredRebel/EcoVillage-map) via raw.githubusercontent.com — no image copies in this repo.

## Adding a new property

1. Create `properties/<name>.js` exporting a property object: `{ id, name, shortLabel, labelChip, center, zoom, footerTitle, footerInfo, cta, panel: { title, html }, boundary: [segments], zones: [zones] }` (copy `properties/howard.js` as the template).
2. Register it in `server-complete.js`: add the import and append to `PROPERTIES`.
3. Add an entry in `image-urls.js` under the property's id for photos.

That's it — boundaries, panels, icons, admin tools, and the overview all pick it up automatically.

## Position Editor (currently enabled)

Click the **⚙️ button** (top right) to open the Position Editor — it stays open while you work:

1. **Pick a property** — the map flies there (buttons appear automatically for every property)
2. **Start Editing** — ALL of that property's icons unlock at once with a glowing pulse; drag any of them (the map still pans/zooms; icon taps won't open panels while editing). A live list shows everything you've moved, and **Reset This Property** undoes the session.
3. **🔒 Save Layout for Everyone** — commits the layout straight to git (`data/zone-positions.json`) and Vercel redeploys with it baked in. First save asks for the Edit PIN (then remembers it on that device). **📋 Capture / Export** stays as a backup path.

### How saving works (git-backed)

`data/zone-positions.json` is the live source of truth for icon positions — the server applies it over the built-in defaults at boot. The Save button POSTs to `/api/save-positions`, which verifies the PIN and commits the new file to GitHub via the Contents API, so **every layout change is a git commit** and the site auto-redeploys.

One-time setup (Vercel → project → Settings → Environment Variables):

| Variable | Value |
|---|---|
| `EDIT_PIN` | any PIN you choose — the editor asks for it on first save |
| `GITHUB_TOKEN` | fine-grained PAT, this repo only, **Contents: Read & write** |

Until those are set, the Save button politely says saving isn't configured and the Capture → paste-to-Claude path still works.

### The world's edits (`POST /api/pack/edits`)

The [walkable world](https://github.com/SacredRebel/spatial-map) edits a property through its **data pack** (e.g. [sulphur-mountain-world](https://github.com/SacredRebel/sulphur-mountain-world)), never the record: a tree marked gone, a project's post moved, a marker, a fence. It sends `{ pin, pack, features }` here; the atlas checks the PIN, validates every feature against the pack's small edit grammar (`op` remove/move/add × `layer` trees/vision/notes/lines/zones/terrain, geometry inside the county, a shaping at most 300 m across), merges them into the pack's `edits.geojson` and commits it as Sacred Rebel. Which packs can be written is a server-side list, so a request can never name a repository:

| Variable | Value |
|---|---|
| `PACK_REPOS` | `sulphur-mountain=SacredRebel/sulphur-mountain-world` (default; comma-separate more) |
| `PACK_GITHUB_TOKEN` | optional — a PAT with Contents: Read & write on the pack repos. When absent, `GITHUB_TOKEN` is used, which then needs the pack repos in its repository access. |
| `BUILDER_PIN` | optional — the PIN that makes a **builder** in the world (every tool; saves become proposals). `EDIT_PIN` makes an **admin**. |

### The magic box's agent (`/api/agent`)

A builder or admin at a magic box in the world sends `{pin, pack, box, heading, messages}` here. With `ANTHROPIC_API_KEY` set (and optionally `AGENT_MODEL`, default `claude-sonnet-4-5`) the agent is Claude, given seven tools and nothing else — `place_block`, `draw_line`, `place_marker`, `remove_trees`, `plant_tree`, `draw_zone`, `shape_ground`, all in metres east and north of the box — and its tool calls come back as *proposals* the world shows as cards; nothing is applied here. Without the key a small parser answers plain commands ("a shed 6 by 4, 3 m high", "a fence 20 m east then 10 m north") and says it is not connected to a model.

### Roles and proposals (`/api/pack/role`, `/api/pack/proposals`)

`POST /api/pack/role {pin}` says what a PIN is worth: `admin` (`EDIT_PIN`) or `builder` (`BUILDER_PIN`). `POST /api/pack/proposals {pin, pack, note, edits, structures}` takes a builder's or an admin's changes — pack edit features and structure rows (or `{id, remove: true}`) for that pack's property — validates every one, and commits the proposal as `data/proposals/<pack>/<id>.json` here, so who proposed what is git history. An admin's proposal is applied at once; a builder's waits. `GET /api/pack/proposals?pack=` lists them; `POST /api/pack/proposals/:id/decide {pin, pack, decision: approve|reject, note}` (admin) applies or marks one. Applying merges the edits into the pack's `edits.geojson` and the structure changes into `data/structures.json` (same id replaces, new id appends, `remove` drops).

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:5001
```

No env vars, no build step.

## Structure

```
├── server-complete.js            # App: Express + embedded Leaflet frontend
├── properties/
│   ├── howard.js                 # Howard Property (zones, boundary, panel, CTA)
│   ├── sulphur-mountain.js       # Sulphur Mountain Eco-Village
│   ├── keris-property.js         # Keri's Property
│   ├── chers-property.js         # Cher's Property
│   └── black-mountain-ranch.js   # Black Mountain Ranch (generated — see bmr/)
├── bmr/                          # Ranch county-parcel data + generator (+ vision.mjs: Lemuria zones)
├── data/zone-positions.json      # Saved icon layout (git-backed source of truth)
├── images/                       # Photo uploads — one folder per property & project
├── image-urls.js                 # Photo manifests, namespaced by property id
├── api/index.js                  # Vercel serverless entry
└── vercel.json
```

## Uploading photos

Drop images into `images/<property>/<project>/current/` (photos of how it looks today) or `.../vision/` (renders & inspiration for what it will become). Property-wide gallery photos go in `images/<property>/property/current/`. Any format is fine (jpg/png/webp). After uploading, the files get listed in `image-urls.js` to appear in the map's galleries. Full folder tree + details: [`images/README.md`](images/README.md). (Sulphur Mountain photos stay in the EcoVillage-map repo.)

## Roadmap

1. ✅ Howard layout + real county boundary
2. ✅ 13 Howard proposal zones + reposition mode
3. ✅ Multi-property merge (Sulphur Mountain on the same map)
4. ✅ Keri's + Cher's properties · icon positions locked in git
5. ✅ Black Mountain Ranch — all 63 county parcels drawn as individual lot territories (63rd confirmed by owner)
6. ✅ 63rd parcel (APN 035-0-020-010, 610 ac North Ridge) confirmed and on the map
7. ✅ V0.9 — Current ⇄ Vision toggle · Lemuria HQ vision layer (6 zones) · first vision galleries
8. ✅ V0.10 — Rose Valley Property added (for-sale acquisition target, real county boundary)
9. ✅ V0.11 — Today ⇄ Vision curated per property: what exists now vs what Lemuria builds (zones can carry a different name & story per mode)
10. ⬜ Photo galleries (upload to `images/`, wire into `image-urls.js`)
11. ⬜ Custom UI theme · hide admin tools for public release

---

© 2026 Ojai Valley Properties
