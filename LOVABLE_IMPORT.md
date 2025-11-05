# Lovable Import Instructions

## 🎯 One-Click Import to Lovable

### Step 1: Go to Lovable
Visit [lovable.dev](https://lovable.dev) and sign in

### Step 2: Import from GitHub
1. Click **"New Project"** or **"Import"**
2. Select **"Import from GitHub"**
3. Paste this URL:
   ```
   https://github.com/SacredRebel/sacred-web5-renaissance.git
   ```
4. Click **"Import"**

### Step 3: Configure Environment
Lovable will auto-detect the config. Add these environment variables:

```env
SUPABASE_URL=https://klokwelpowqixscecakh.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_BUCKET=eco-village-images
```

### Step 4: Deploy
Click **"Deploy"** - Lovable will:
- Install dependencies from `package.json`
- Run `node server-complete.js`
- Expose on port 5001 (or auto-assign)

### Step 5: Preview
Your app will be live at: `https://your-project.lovable.app`

---

## 📋 What Lovable Will Detect

✅ **Entry Point**: `server-complete.js`
✅ **Package Manager**: npm (via `package.json`)
✅ **Start Command**: `node server-complete.js`
✅ **Dependencies**: express, compression, cors
✅ **Port**: 5001 (configurable)

---

## 🔧 Alternative: Manual Configuration

If auto-detection doesn't work:

1. **Build Command**: Leave empty (no build needed)
2. **Start Command**: `node server-complete.js`
3. **Port**: `5001`
4. **Environment Variables**: Add the 3 variables above

---

## ✨ Features You'll Get

- 🗺️ Interactive Leaflet map
- 📊 18 project zones ($1.32M investment tracking)
- 🖼️ Image galleries with Supabase storage
- 📱 Mobile-optimized (swipe gestures, responsive)
- 🎨 Smooth animations and transitions
- 💰 Investment calculations and property details

---

## 🆘 Troubleshooting

**Images not loading?**
- Check Supabase bucket is public
- Verify CORS settings in Supabase
- Confirm `SUPABASE_ANON_KEY` is correct

**Port conflict?**
- Lovable usually auto-assigns ports
- Check if `PORT` env variable is set correctly

**Server not starting?**
- Verify all dependencies installed
- Check Lovable build logs
- Ensure Node.js 18+ is available

---

## 📞 Support

Need help? Check:
- Lovable documentation: [lovable.dev/docs](https://lovable.dev/docs)
- This repo's issues: [GitHub Issues](https://github.com/SacredRebel/sacred-web5-renaissance/issues)
