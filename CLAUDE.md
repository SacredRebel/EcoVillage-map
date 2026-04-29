# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is an interactive investment map for **Sulphur Mountain Eco-Village** (Ojai Valley, CA), showcasing 18 regenerative development zones across a 10-acre property. It is built for investor presentations and partner onboarding.

There are **two parallel implementations** in this repo:

1. **`server-complete.js`** — The original V1 production server: a single large Node.js/Express file that bundles the entire backend and a vanilla-JS/Leaflet frontend. This is what all deployment configs (Vercel, Railway, Procfile, `lovable.config.json`) point to.

2. **`server/` + `client/` + `shared/`** — A newer Replit/Lovable-style fullstack TypeScript app using Express + Vite + React + Leaflet + Drizzle ORM. This is the actively developed version.

The `package.json` scripts (`dev`, `start`) currently run `server-complete.js`, not the TypeScript stack.

## Commands

### TypeScript fullstack app (server/ + client/)

```bash
# Development (runs Express on port 5000, Vite middleware embedded)
npx tsx server/index.ts

# Or with external Vite dev server on port 8080
USE_EXTERNAL_VITE=1 npx tsx server/index.ts   # Express on 5000
npx vite                                        # Vite on 8080

# Type checking
npm run check

# Push DB schema to Neon/Postgres
npm run db:push
```

### Legacy single-file server (V1)

```bash
npm run dev     # node server-complete.js (port 5001)
npm start       # same
```

## Architecture

### TypeScript stack (server/ + client/ + shared/)

```
shared/schema.ts          — Drizzle ORM table definitions + Zod validation schemas
                            Exports: users, projectZones, and inferred types

server/db.ts              — Neon serverless Postgres connection; exports `db`, `pool`, `hasDatabase`
                            Falls back gracefully when DATABASE_URL is absent
server/storage.ts         — IStorage interface with DatabaseStorage (Postgres) and MemoryStorage impls
                            Auto-selects based on hasDatabase; seeds 5 initial zones on startup
server/routes.ts          — REST API: GET/POST/PUT/DELETE /api/project-zones, /api/admin/project-zones
server/index.ts           — Express entrypoint; attaches Vite middleware in dev, serves static in prod
server/vite.ts            — Helpers: setupVite(), serveStatic(), log()

client/src/main.tsx       — React entry
client/src/App.tsx        — QueryClientProvider + Wouter router; single route "/" → MapPage
client/src/pages/map.tsx  — Root page: fetches /api/project-zones, manages selectedZone / phase state
client/src/components/
  MapContainer.tsx        — Leaflet map init; renders zone polygons/polylines + emoji markers;
                            exposes map instance as window.mapInstance for MapControls
  ProjectModal.tsx        — Right-panel slide-in; shows zone details, stats, investment copy
  ZoneLegend.tsx          — Color-coded legend for zone types
  admin/AdminPanel.tsx    — Placeholder admin UI (not yet wired to API)
  ui/                     — shadcn/ui component library (do not edit)

client/src/lib/
  mapUtils.ts             — Shared constants: defaultMapCenter, propertyBounds, zoneColors, zoneIcons
  queryClient.ts          — TanStack Query client; uses URL as queryKey, credentials: "include"
```

**Data flow:** `map.tsx` fetches zones via TanStack Query → passes `zones` to `MapContainer` (renders Leaflet layers) and click handler → sets `selectedZone` → renders `ProjectModal`.

### Zone data model (`shared/schema.ts`)
Key fields: `id`, `name`, `type` (agricultural/residence/community/retreat/infrastructure), `budget`, `timeline`, `monthlyRevenue`, `description`, `features` (jsonb string[]), `investment`, `status`, `imageUrl`, `coordinates` (jsonb polygon or polyline), `color`.

Infrastructure zones render as `L.polyline`; all others render as `L.polygon`.

### Path aliases (tsconfig.json + vite.config.ts)
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`

## Environment Variables

Copy `.env.example` to `.env`:

```
DATABASE_URL=           # Neon/Postgres connection string (optional; uses in-memory store if absent)
SUPABASE_URL=           # Supabase project URL (used by server-complete.js V1 for image CDN)
SUPABASE_ANON_KEY=      # Supabase anon key
SUPABASE_BUCKET=eco-village-images
PORT=5000               # Default for TypeScript server; V1 defaults to 5001
```

## Deployment

- **Vercel**: routes everything through `server-complete.js` (V1)
- **Railway**: `node server-complete.js` via `railway.toml`
- **Render**: `render.yaml` (also V1)

To deploy the TypeScript stack, you would need to add a build step (`vite build` → `dist/`) and update `server/vite.ts`'s `serveStatic` to point at the correct output path.

## Key Gotchas

- `MapControls.tsx` reads `window.mapInstance` (set by `MapContainer`) to call Leaflet zoom methods — avoid removing that side-effect.
- `ProjectZone.features` is typed `jsonb` in Drizzle but cast to `string[]` in JSX: `(zone.features as string[])`.
- `MemoryStorage.seedInitialData()` seeds 5 zones; `DatabaseStorage.seedInitialData()` seeds the same 5 and is idempotent (skips if rows exist).
- The `AdminPanel` component exists but is not routed anywhere and its CRUD forms are not yet implemented.
- `image-urls.js` and `image-urls-V1-FINAL-2025-11-04.js` are large data files used exclusively by `server-complete.js` (V1) for Supabase image URLs.
