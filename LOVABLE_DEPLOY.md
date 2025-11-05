# EcoVillage Interactive Map - Lovable Deployment Guide

## 🚀 Quick Deploy to Lovable

This project is a complete, self-contained interactive map application for Sulphur Mountain EcoVillage.

### Prerequisites
- Supabase account with storage bucket configured
- Node.js 18+ environment

### Environment Variables Required
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_BUCKET=eco-village-images
PORT=5001
```

### Project Structure
```
├── server-complete.js       # Single-file full-stack application (7850+ lines)
├── image-urls.js           # Image configuration (Supabase CDN URLs)
├── package.json            # Node.js dependencies
├── .env                    # Environment variables (create this)
└── lovable.config.json     # Lovable deployment config
```

### Features
✅ **Interactive Map**: Leaflet.js-based property visualization
✅ **18 Project Zones**: Complete with descriptions, investments, timelines
✅ **Image Galleries**: Current state + vision galleries with Supabase
✅ **Mobile Optimized**: Swipe gestures, responsive design, touch-friendly
✅ **Property Details**: Unified property panel with full specifications
✅ **Investment Tracking**: Real-time zone investment calculations

### Deploy Steps

#### Option 1: Direct Import to Lovable
1. Push this repo to GitHub (already done ✅)
2. In Lovable, click "Import from GitHub"
3. Select: `https://github.com/SacredRebel/sacred-web5-renaissance.git`
4. Lovable will detect `lovable.config.json` and configure automatically
5. Add environment variables in Lovable dashboard
6. Deploy!

#### Option 2: Manual Setup in Lovable
1. Create new Lovable project
2. Copy `server-complete.js` content
3. Copy `image-urls.js` content
4. Add environment variables
5. Deploy with start command: `node server-complete.js`

### Environment Setup in Lovable
1. Go to Project Settings → Environment Variables
2. Add:
   - `SUPABASE_URL` → Your Supabase project URL
   - `SUPABASE_ANON_KEY` → Your Supabase anon/public key
   - `SUPABASE_BUCKET` → `eco-village-images`
   - `PORT` → `5001` (or Lovable's auto-assigned port)

### Supabase Storage Setup
1. Create bucket: `eco-village-images`
2. Set to **public** access
3. Enable CORS for your domain
4. Upload images organized by zone:
   ```
   eco-village-images/
   ├── mushroom-cultivation/
   │   ├── current/
   │   └── vision/
   ├── community-greenhouse/
   │   ├── current/
   │   └── vision/
   └── [other zones...]
   ```

### Testing Locally
```bash
# Install dependencies
npm install

# Create .env file with your Supabase credentials
echo "SUPABASE_URL=https://your-project.supabase.co" > .env
echo "SUPABASE_ANON_KEY=your-key" >> .env
echo "SUPABASE_BUCKET=eco-village-images" >> .env

# Start server
node server-complete.js

# Open browser
# http://localhost:5001
```

### Key Files Explanation

**server-complete.js** (7850 lines)
- Full Express.js server
- Complete HTML/CSS/JavaScript client embedded
- All 18 project zones with detailed content
- Image gallery system
- Mobile gesture handling
- Map initialization and controls

**image-urls.js**
- Configuration file with Supabase CDN URLs
- Organized by zone and category
- Supports subcategories (infrastructure, main-residence, etc.)

### Mobile Optimizations
- ✅ Responsive titles with dynamic font sizing
- ✅ Smooth gallery transitions (no jumps)
- ✅ Swipe-to-close panels
- ✅ Production Cycle Timeline: horizontal layout (icon + content)
- ✅ All grid layouts convert to single column
- ✅ Touch-friendly controls and spacing

### Support
For issues or questions:
- Check Supabase console for image access
- Verify environment variables are set
- Check browser console for JavaScript errors
- Ensure port 5001 is available (or use Lovable's auto-port)

### License
Private project - All rights reserved

---

**Built with**: Express.js, Leaflet.js, Supabase Storage
**Deployment**: Optimized for Lovable, Vercel, Railway, or any Node.js host
