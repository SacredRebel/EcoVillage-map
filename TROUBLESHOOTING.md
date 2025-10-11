# 🔧 EcoVillageBuilder - Troubleshooting Guide

## ✅ What Was Fixed

### 1. Path with Spaces Issue
**Problem:** Windows couldn't parse the path `F:\AI apps & websites\EcoVillageBuilder\EcoVillageBuilder`

**Fix Applied:**
- Updated `startup.js` to properly quote paths with spaces
- Created `start-map.js` as an alternative launcher
- Added new npm scripts for different server options

### 2. JavaScript Event Listener Corruption
**Problem:** Event listeners had corrupted syntax like `addEventListenerfunction`

**Fix Applied:**
- All event listeners now use correct `.addEventListener()` syntax
- Removed HTML entity encoding from JavaScript code
- Fixed all arrow function syntax

### 3. Server Selection Confusion
**Problem:** Multiple server files causing confusion about which to run

**Clarification:**
- `server-complete.js` = Standalone interactive map (PORT 5001) ✅
- `server/index.ts` = Full React/TypeScript app (PORT 5000)
- Use `npm run dev:direct` for the map

## 🚀 Verified Working Commands

### Command 1: Direct Map Server (FASTEST)
```bash
npm run dev:direct
```
- ✅ Runs server-complete.js directly
- ✅ No TypeScript compilation needed
- ✅ Opens on http://localhost:5001
- ✅ Best for interactive map demo

### Command 2: Map Server via Wrapper
```bash
npm run dev:map
```
- ✅ Uses start-map.js wrapper
- ✅ Same result as dev:direct
- ✅ Opens on http://localhost:5001

### Command 3: Full TypeScript Server
```bash
npm run dev
```
- ✅ Runs the React/Vite application
- ⚠️ Requires tsx to be working
- ✅ Opens on http://localhost:5000

## 🎯 Current Server Status

### Server: ✅ RUNNING
- **Port**: 5001
- **Status**: Active and serving requests
- **Zones**: 15 project zones loaded
- **Map**: Leaflet initialized successfully
- **Interactive Features**: All working

### Features Confirmed Working:
- ✅ Interactive Leaflet map with satellite imagery
- ✅ Zone markers with custom icons
- ✅ Property boundary lines
- ✅ Side panel with project details
- ✅ Admin controls popup
- ✅ Territory drawing editor
- ✅ Zone positioning system
- ✅ Image gallery placeholders
- ✅ SEO-optimized metadata

## 🌐 Access URLs

### Interactive Map Application
```
http://localhost:5001
```

### API Endpoints
```
http://localhost:5001/api/health
http://localhost:5001/api/project-zones
http://localhost:5001/api/images/{zoneId}/{category}
```

## 🔍 Verification Checklist

Run through this checklist if you encounter issues:

- [ ] Node.js is installed (check: `node --version`)
- [ ] Dependencies are installed (run: `npm install`)
- [ ] Port 5001 is not in use by another application
- [ ] Server is running (check terminal output for "Server running on...")
- [ ] Browser can access http://localhost:5001
- [ ] No JavaScript errors in browser console (F12)
- [ ] Leaflet CSS and JS are loading (check Network tab in DevTools)

## 🐛 Common Error Messages

### Error: "EADDRINUSE"
**Cause:** Port 5001 is already in use

**Solution:**
```powershell
# Kill process on port 5001
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force
```

### Error: "Cannot find module"
**Cause:** Missing dependencies

**Solution:**
```bash
npm install
```

### Error: "SyntaxError" or "Unexpected token"
**Cause:** JavaScript syntax error (should be fixed now)

**Solution:** The latest code has all syntax errors fixed. Pull the latest changes.

### Error: Map container is empty
**Cause:** JavaScript not executing or Leaflet not loading

**Solution:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab to ensure Leaflet loads
4. Verify the map div exists in the HTML

## 📝 Testing Steps

### 1. Start the Server
```bash
npm run dev:direct
```

### 2. Verify Server Output
You should see:
```
🚀 Starting EcoVillageBuilder Interactive Map...
🚀 EcoVillageBuilder Interactive Map Server
🌐 Server running on http://localhost:5001
📊 Serving 15 project zones ($7.75M total investment)
🔲 10 permanent property boundary lines
✨ Ready for investor presentations and interactive exploration
```

### 3. Open Browser
Navigate to: http://localhost:5001

### 4. Check Map Loading
You should see:
- Satellite imagery of Sulphur Mountain property
- 15 colored zone markers with emojis
- Red property boundary lines
- Admin controls in top-right corner
- Footer with project information

### 5. Test Interactivity
- Click on any zone marker → Side panel should open
- Click admin gear icon (⚙️) → Admin popup should appear
- Click territory editor icon (🎨) → Drawing tools should appear
- Zoom in/out → Map should respond smoothly

## 🔄 Quick Reset Commands

### Kill All Node Processes
```powershell
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force
```

### Restart Server
```bash
npm run dev:direct
```

### Clear npm Cache (if needed)
```bash
npm cache clean --force
npm install
```

## 📊 Performance Optimization

### If Map Loads Slowly
1. Check internet connection (satellite tiles load from external sources)
2. Try different tile layer (Street Map vs Satellite)
3. Reduce initial zoom level if needed

### If Browser Freezes
1. Check browser console for errors
2. Verify no infinite loops in JavaScript
3. Test in different browser (Chrome, Firefox, Edge)

## 🎨 Customization

### Change Server Port
Edit `server-complete.js`:
```javascript
const port = 5001; // Change to desired port
```

### Add New Zone
Edit `PROJECT_ZONES` array in `server-complete.js`:
```javascript
{
  id: "new-zone",
  name: "New Zone Name",
  emoji: "🌟",
  position: [latitude, longitude],
  // ... other properties
}
```

### Modify Zone Colors
Edit `zoneColors` object in `server-complete.js`:
```javascript
const zoneColors = {
  agriculture: '#2E7D32',  // Green
  residential: '#1565C0',  // Blue
  // ... add or modify colors
};
```

## 📞 Getting Help

If issues persist after trying all solutions:

1. **Check the README.md** for general project information
2. **Review server logs** in the terminal for error messages
3. **Check browser console** (F12) for client-side errors
4. **Verify file integrity** - ensure no files are corrupted
5. **Re-clone the repository** as a last resort

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Server starts without errors
- ✅ Browser loads the map at http://localhost:5001
- ✅ Map displays satellite imagery
- ✅ Zone markers are visible and clickable
- ✅ Side panel opens with project details
- ✅ Admin controls are accessible
- ✅ No errors in browser console

---

**Last Updated:** All issues resolved and server confirmed working on PORT 5001
**Status:** 🟢 FULLY OPERATIONAL
