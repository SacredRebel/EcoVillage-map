# ⚠️ LOVABLE SETUP - READ THIS FIRST

## This is NOT a standard Vite/React project!

This project uses a **single-file Node.js Express server** (`server-complete.js`) that serves everything - HTML, CSS, JavaScript, and API endpoints.

## How to run in Lovable:

### 1. Ignore the build errors
The "build:dev" script runs but does nothing - this is intentional.

### 2. Start the actual server
After Lovable finishes its build process, the app automatically runs:
```bash
npm run dev
# This runs: node server-complete.js
```

### 3. Required Environment Variables
Add these in Lovable Settings → Environment:
```env
SUPABASE_URL=https://klokwelpowqixscecakh.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_BUCKET=eco-village-images
PORT=5001
```

### 4. Access the app
Once the server starts, visit:
- **Lovable Preview**: Your assigned Lovable URL
- **Local**: http://localhost:5001

## Architecture Explanation

```
┌─────────────────────────────────────┐
│   server-complete.js (7850+ lines)  │
│                                     │
│  • Express Server                   │
│  • Embedded HTML/CSS/JS             │
│  • Leaflet Map Integration          │
│  • 18 Project Zones Data            │
│  • Image Gallery System             │
│  • Mobile Gesture Handling          │
└─────────────────────────────────────┘
           ↓
    Serves everything on port 5001
```

## Why these files exist:

- **`index.html`** - Dummy file for Lovable compatibility (redirects to server)
- **`vite.config.ts`** - Minimal config to satisfy Lovable build system
- **`package.json`** - Scripts set to run `server-complete.js`
- **`build:dev` script** - Does nothing, just satisfies Lovable's build check

## The Real App

Everything runs from `server-complete.js`:
- 7850+ lines of complete application code
- Self-contained HTML, CSS, and JavaScript
- No build step needed
- No React components
- No separate client/server split

## Troubleshooting

**"Build failed" errors**: Ignore them - the build step is a no-op

**Server not starting**: Check that environment variables are set

**Port conflicts**: Lovable may assign a different port automatically

**Images not loading**: Verify Supabase credentials in env variables

## Need Help?

Check the full deployment guides:
- `LOVABLE_DEPLOY.md` - Complete deployment guide
- `LOVABLE_IMPORT.md` - Quick import instructions
