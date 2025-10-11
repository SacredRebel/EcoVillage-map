# 🏡 EcoVillageBuilder - Interactive Map System

## 📋 Project Overview

EcoVillageBuilder is an interactive web-based map presentation tool showcasing the **Sulphur Mountain Eco-Village** sustainable development project. The application provides a comprehensive visualization of a $7.75M eco-village development across a 10-acre property in Ojai Valley, California.

### Key Features

- 🗺️ **Interactive Leaflet Map** with high-resolution satellite imagery
- 🎯 **15+ Project Zones** with detailed information panels
- 💰 **Financial Projections** including budgets, ROI, and revenue streams
- 🎨 **Territory Drawing Tools** for admin planning and zone editing
- 📸 **SEO-Optimized Image Gallery** with structured data
- 🔧 **Admin Controls** for zone positioning and management

## 🚀 Quick Start

### Prerequisites

- Node.js v16+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install
```

### Running the Application

There are multiple ways to run the server:

#### Option 1: Direct Map Server (Recommended for the interactive map)
```bash
npm run dev:direct
```
This runs the standalone interactive map server on **http://localhost:5001**

#### Option 2: Map Server via Wrapper
```bash
npm run dev:map
```
This uses the start-map.js wrapper to launch the map server

#### Option 3: Full TypeScript Server (React/Vite app)
```bash
npm run dev
```
This runs the full TypeScript server with React frontend on **http://localhost:5000**

## 📂 Project Structure

```
EcoVillageBuilder/
├── server-complete.js          # Standalone interactive map server (PORT 5001)
├── start-map.js               # Wrapper script for map server
├── startup.js                 # Wrapper script for TypeScript server
├── package.json               # Project configuration and scripts
├── server/
│   ├── index.ts              # TypeScript server entry point
│   ├── routes.ts             # API routes
│   └── vite.ts               # Vite development server setup
├── client/
│   ├── src/
│   │   ├── App.tsx           # React application root
│   │   ├── components/       # React UI components
│   │   ├── pages/            # Page components
│   │   └── lib/              # Utility functions
│   └── index.html            # HTML entry point
├── shared/
│   └── schema.ts             # Shared TypeScript types
├── images/                    # Project zone images
│   └── {zone-id}/
│       ├── current/          # Current site photos
│       ├── vision/           # Architectural renderings
│       └── progress/         # Construction progress
├── public/                    # Static assets
└── attached_assets/          # Project documentation and maps
```

## 🌟 Project Zones

The interactive map showcases 15 distinct development zones:

1. **🌾 Agricultural Hub** - $500K - Regenerative food production
2. **🏠 Main Residence** - $1.5M - Luxury sustainable home
3. **🏛️ Community Hub** - $600K - Coworking and community space
4. **🏕️ Retreat Village** - $1.2M - Boutique eco-cabins
5. **⚡ Infrastructure** - $800K - Utilities and energy systems
6. **🎭 McQueen's Garage** - $400K - Creative arts space
7. **🔮 Ceremonial Infrastructure** - $300K - Sacred spaces
8. **🧘 Wellness Facilities** - $600K - Spa and healing center
9. **🍄 Mushroom Cultivation** - $150K - Commercial production
10. **🐝 Beekeeping Program** - $10K - Collaborative honey production
11. **🐄 Livestock Program** - $200K - Regenerative grazing
12. **🎨 Creative Workshop** - $350K - Art and maker space
13. **🏕️ Glamping Village** - $450K - Creek-side lodging
14. **🏘️ Gatelodge Hub** - $45K - Operations center
15. **🌺 Living Landscape** - $850K - Food forests and gardens

**Total Investment: $7.75 Million**

## 🛠️ Technical Stack

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety (optional server)
- **ES Modules** for modern JavaScript

### Frontend
- **Leaflet.js** for interactive mapping
- **React** (TypeScript server option)
- **Vite** for development and building
- **TailwindCSS** for styling

### Additional Features
- **Drizzle ORM** for database operations
- **React Query** for data fetching
- **Radix UI** for accessible components

## 🔧 Common Issues & Solutions

### Issue 1: Path with Spaces Error
**Error:** `'F:\AI' is not recognized as an internal or external command`

**Solution:** This has been fixed in the updated `startup.js`. The script now properly handles paths with spaces.

### Issue 2: Server Won't Start
**Solution:** Use the direct command instead:
```bash
npm run dev:direct
```

### Issue 3: Map Not Displaying
**Causes:**
- JavaScript errors in console
- Missing Leaflet CSS/JS
- Incorrect port

**Solution:** 
1. Check browser console for errors
2. Verify server is running on http://localhost:5001
3. Clear browser cache and reload

### Issue 4: TypeScript Errors
**Solution:** The standalone map server (`server-complete.js`) doesn't require TypeScript. Use:
```bash
npm run dev:direct
```

## 📸 Image Management

The application supports three categories of images for each zone:

1. **Current Photos** - Existing site conditions
2. **Vision Renderings** - Architectural concepts
3. **Progress Updates** - Construction milestones

Images should be placed in:
```
images/{zone-id}/{category}/
```

Example:
```
images/agricultural-hub/current/photo1.jpg
images/agricultural-hub/vision/rendering1.png
images/agricultural-hub/progress/construction1.jpg
```

## 🎯 Admin Features

### Zone Positioning
- Toggle edit mode to drag and reposition zone markers
- Capture positions to export coordinates
- Reset zones to original positions

### Territory Drawing
- Free-draw zone territories with brush tools
- Erase and modify boundaries
- Save and load territory data

### Access Admin Controls
Click the gear icon (⚙️) in the top-right corner to access admin features.

## 🌐 Deployment

### Local Development
```bash
npm run dev:direct
```

### Production Build
```bash
npm run build
npm start
```

### Hosting Options
- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **Node.js Hosting**: Heroku, DigitalOcean, AWS
- **VPS**: Any Linux server with Node.js

## 📊 Investment Summary

- **Total Budget**: $7.75M
- **Project Zones**: 15
- **Property Size**: 10 acres
- **Location**: Sulphur Mountain, Ojai Valley, CA
- **Expected ROI**: 156% - 1200% (varies by zone)
- **Development Timeline**: 0-36 months (3 phases)

## 🤝 Get Involved

This project is seeking:
- 💰 Investment partners
- 🏗️ Development collaborators
- 🌱 Community members
- 🎨 Creative contributors

## 📝 License

MIT License - See LICENSE file for details

## 👥 Contact

For inquiries about the Sulphur Mountain Eco-Village project:
- **Email**: info@sulphurmountain-ecovillage.com
- **Phone**: +1-555-ECO-VILLAGE

---

**Built with 💚 for sustainable living and regenerative development**
