# 🚀 EcoVillage Map - Deployment Guide

This guide covers deploying your interactive map to various hosting platforms.

## ✅ Prerequisites

Your application is **deployment-ready** with:
- ✓ Single-file server architecture (`server-complete.js`)
- ✓ Dynamic port configuration (`process.env.PORT`)
- ✓ No build step required
- ✓ Minimal dependencies (only Express.js)
- ✓ All assets served inline (HTML/CSS/JS)

---

## 🌐 Platform-Specific Deployment

### 1️⃣ **Vercel** (Recommended for Quick Deploy)

**Configuration File:** `vercel.json` ✅ (already created)

**Deploy Steps:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or deploy to production
vercel --prod
```

**Settings:**
- Build Command: `echo "No build needed"`
- Output Directory: `.`
- Install Command: `npm install express`
- Start Command: `node server-complete.js`

**Note:** Images folder is excluded (`.gitignore`). If needed, upload images separately or use a CDN.

---

### 2️⃣ **Render.com** (Great for Node.js)

**Configuration File:** `render.yaml` ✅ (already created)

**Deploy Steps:**
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `SacredRebel/EcoVillage-map`
4. Render will auto-detect `render.yaml`
5. Click "Create Web Service"

**Manual Settings (if needed):**
- Environment: `Node`
- Build Command: `echo "No build required"`
- Start Command: `node server-complete.js`
- Plan: Free (or paid for better performance)

---

### 3️⃣ **Railway.app** (Modern & Fast)

**Configuration File:** `railway.toml` ✅ (already created)

**Deploy Steps:**
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `SacredRebel/EcoVillage-map`
4. Railway auto-detects Node.js and uses `railway.toml`
5. Your app deploys automatically!

**Manual Settings (if needed):**
- Start Command: `node server-complete.js`
- No build command needed

---

### 4️⃣ **Fly.io** (Global Edge Network)

**Deploy Steps:**
```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Launch app (creates fly.toml automatically)
flyctl launch

# When prompted:
# - App name: ecovillage-map
# - Region: Choose closest to you
# - PostgreSQL: No
# - Redis: No

# Deploy
flyctl deploy
```

---

### 5️⃣ **Heroku** (Classic Platform)

**Configuration File:** `Procfile` ✅ (already created)

**Deploy Steps:**
```bash
# Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create ecovillage-map

# Deploy
git push heroku main

# Open in browser
heroku open
```

**Manual Settings:**
- Buildpack: `heroku/nodejs`
- No build step needed

---

### 6️⃣ **DigitalOcean App Platform**

**Deploy Steps:**
1. Go to [cloud.digitalocean.com](https://cloud.digitalocean.com)
2. Click "Create" → "Apps"
3. Connect your GitHub: `SacredRebel/EcoVillage-map`
4. DigitalOcean auto-detects Node.js
5. Configure:
   - Run Command: `node server-complete.js`
   - Build Command: *leave empty*
6. Click "Create Resources"

---

### 7️⃣ **Netlify** (Functions-based)

**⚠️ Note:** Netlify is primarily for static sites, but can work with serverless functions.

**Deploy Steps:**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

**Manual Settings:**
- Build Command: `echo "No build"`
- Publish Directory: `.`
- Functions Directory: `netlify/functions` (create wrapper if needed)

---

## 🔧 Environment Variables

All platforms need these environment variables:

| Variable | Value | Required |
|----------|-------|----------|
| `NODE_ENV` | `production` | Optional |
| `PORT` | *Auto-set by platform* | Auto |

---

## 📦 Deployment Checklist

Before deploying, ensure:

- [ ] `server-complete.js` uses `process.env.PORT || 5000`
- [ ] Server listens on `0.0.0.0` (not just `localhost`)
- [ ] `.gitignore` excludes `node_modules/` and `images/`
- [ ] `package.json` has correct `"start"` script
- [ ] Dependencies list only includes `express`
- [ ] All code is committed and pushed to GitHub

---

## 🎯 Quick Deploy Commands

**For Vercel (Fastest):**
```bash
vercel --prod
```

**For Render:**
```bash
# Just push to GitHub, Render auto-deploys!
git push origin main
```

**For Railway:**
```bash
# Connect repo on railway.app dashboard
# Or use CLI:
railway up
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'express'"
**Solution:** Ensure `package.json` dependencies include:
```json
"dependencies": {
  "express": "^4.18.2"
}
```

### Issue: "Port already in use"
**Solution:** Platform automatically assigns ports via `process.env.PORT` ✅

### Issue: "Images not loading"
**Solution:** Images folder is excluded. Options:
1. Upload images to cloud storage (S3, Cloudinary)
2. Remove `images/` from `.gitignore` and rename long filenames
3. Use external image URLs

### Issue: "502 Bad Gateway"
**Solution:** Check server logs. Common causes:
- Server not listening on `0.0.0.0`
- Port configuration incorrect
- Server crash on startup

---

## 📊 Recommended Platforms by Use Case

| Use Case | Platform | Why |
|----------|----------|-----|
| **Quick Demo** | Vercel | Instant deploy, free tier |
| **Production App** | Render/Railway | Always-on, good performance |
| **Global Scale** | Fly.io | Edge network, low latency |
| **Enterprise** | DigitalOcean | Full control, scalable |
| **Cost-Free Forever** | Render Free Tier | Free with sleep mode |

---

## 🎉 Success!

Once deployed, your app will be available at:
- **Vercel:** `https://ecovillage-map.vercel.app`
- **Render:** `https://ecovillage-map.onrender.com`
- **Railway:** `https://ecovillage-map.up.railway.app`
- **Fly.io:** `https://ecovillage-map.fly.dev`

Share your map with investors! 🌍💚

---

## 📝 Post-Deployment

**Update README with your live URL:**
```markdown
🌐 **Live Demo:** https://your-app-url.com
```

**Monitor Your App:**
- Check platform dashboards for logs
- Set up alerts for downtime
- Monitor response times

**Optimize:**
- Add CDN for faster asset delivery
- Enable caching headers
- Compress responses with gzip
