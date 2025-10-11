# 🚀 Quick Start Guide - EcoVillageBuilder

## ⚡ Get Running in 30 Seconds

### Step 1: Open Terminal
```powershell
cd "F:\AI apps & websites\EcoVillageBuilder\EcoVillageBuilder"
```

### Step 2: Run the Server
```bash
npm run dev:direct
```

### Step 3: Open Browser
Navigate to: **http://localhost:5001**

---

## 🎯 That's It!

You should now see:
- 🗺️ Interactive satellite map of Sulphur Mountain
- 🏘️ 15 colorful zone markers with emojis
- 🔴 Red property boundary lines
- ⚙️ Admin controls in top-right corner

---

## 🖱️ What to Try

### Explore Zones
- Click any zone marker (🌾, 🏠, 🏛️, etc.)
- Side panel opens with project details
- See investment info, timelines, and features

### Admin Mode (Optional)
- Click the gear icon (⚙️) in top-right
- Toggle edit mode to drag zones
- Capture positions for export

### Drawing Tools (Optional)
- Click the palette icon (🎨) in top-right
- Select a zone to draw
- Use brush to define territories

---

## 🔧 If Something Goes Wrong

### Port Already in Use?
```powershell
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force
npm run dev:direct
```

### Need to Reinstall?
```bash
npm install
npm run dev:direct
```

### Still Not Working?
See **TROUBLESHOOTING.md** for detailed solutions

---

## 📁 Key Files

- **server-complete.js** - Main server (don't modify unless you know what you're doing)
- **package.json** - Contains all npm scripts
- **README.md** - Full documentation
- **TROUBLESHOOTING.md** - Problem solutions
- **FIXED.md** - What was fixed and current status

---

## 🎨 Customization (Advanced)

### Add Images
Place images in:
```
images/{zone-id}/current/
images/{zone-id}/vision/
images/{zone-id}/progress/
```

Example:
```
images/agricultural-hub/current/farm-photo.jpg
```

### Edit Zone Data
Open `server-complete.js` and find the `PROJECT_ZONES` array around line 15.

### Change Colors
Edit the `zoneColors` object in `server-complete.js` around line 450.

---

## 🌐 Access Points

### Main Map
http://localhost:5001

### API Endpoints
- http://localhost:5001/api/health
- http://localhost:5001/api/project-zones
- http://localhost:5001/api/images/{zone-id}/{category}

---

## 💡 Pro Tips

1. **Use Chrome DevTools (F12)** to see detailed logs
2. **Zoom to level 20+** for maximum detail
3. **Try different tile layers** (Street Map vs Satellite)
4. **Edit mode is for developers only** - be careful!
5. **Save your position captures** if you move zones

---

## 🎉 Success!

If you see the map with all zones and no errors, you're all set! The application is running perfectly.

**Enjoy exploring the Sulphur Mountain Eco-Village! 🏡🌿**

---

*For detailed documentation, see README.md*  
*For troubleshooting, see TROUBLESHOOTING.md*  
*For fix history, see FIXED.md*
