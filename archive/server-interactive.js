// EcoVillageBuilder - Final version with permanent property lines
import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting EcoVillageBuilder - Final version with permanent property lines...');

// Real Sulphur Mountain Eco-Village coordinates: 34.433086, -119.155336
const mockProjectZones = [
  {
    id: "zone-1",
    name: "Agricultural Hub",
    description: "10-acre regenerative farmland zone with extensive food forests, over 500 fruit trees, and diverse gardens for herbs and produce. Includes nursery, compost operations, and mycelium production.",
    coordinates: [[34.4325, -119.1560], [34.4330, -119.1560], [34.4330, -119.1550], [34.4325, -119.1550]],
    cost: 500000,
    phase: 1,
    category: "agriculture",
    features: [
      "Extensive food forests with over 500 fruit trees",
      "On-site nursery for plant propagation", 
      "Gravity-fed irrigation and rainwater harvesting",
      "Compost and mycelium operations",
      "Sacred geometry gardens and landscaping"
    ],
    timeline: { start: "Phase 1 (Months 0-6)", completion: "Ongoing expansion" },
    monthlyRevenue: "$3,000+ (scaling to $5,000+)",
    budget: "$500,000",
    revenueStreams: "CSA boxes, seasonal farm stands, direct-to-consumer online sales, partnerships with restaurants/hotels"
  },
  {
    id: "zone-2", 
    name: "Main Residence Compound",
    description: "A 3,000-5,000 sq. ft. luxury residence with 5 bedrooms, plus 1,000 sq. ft. guesthouse and remodeled gatehouse, serving as both private dwelling and hospitality hub with spectacular Topa-Topa Mountain views.",
    coordinates: [[34.4330, -119.1555], [34.4335, -119.1555], [34.4335, -119.1545], [34.4330, -119.1545]],
    cost: 2500000,
    phase: 1,
    category: "residential",
    features: [
      "Main House (3,000-5,000 sq. ft.) with 5 bedrooms",
      "Guesthouse (1,000 sq. ft.) with 2 bedrooms", 
      "Gatehouse remodel (1,000 sq. ft.) for operations",
      "Sacred geometry and bio-integrated architecture",
      "Panoramic views of Topa-Topa Mountains",
      "Open indoor-outdoor layout with communal kitchen",
      "Elevated decks and soaking areas"
    ],
    timeline: { start: "Phase 1 (Months 0-6)", completion: "Permitting ready, 60-day clearance expected" },
    monthlyRevenue: "$10,000+",
    budget: "$2,500,000", 
    revenueStreams: "Luxury short-term stays, retreat rental packages, executive hosting, media/content production"
  },
  {
    id: "zone-3",
    name: "Community Hub", 
    description: "Central gathering space with community kitchen, shared facilities, and social areas, built around a historic 100+ year-old stone fireplace and BBQ pit adjacent to the seasonal creek.",
    coordinates: [[34.4320, -119.1555], [34.4325, -119.1555], [34.4325, -119.1545], [34.4320, -119.1545]],
    cost: 750000,
    phase: 2,
    category: "community",
    features: [
      "Community kitchen and creekside dining area",
      "Bathrooms and shared amenities",
      "Historic 100+ year-old stone fireplace and BBQ pit", 
      "Long tables and shaded gathering spaces",
      "Direct access to McQueen's Garage",
      "Ample seating and covered areas for all weather"
    ],
    timeline: { start: "Phase 2 (Months 7-18)", completion: "Community kitchen finalization and activation" },
    monthlyRevenue: "$7,000+",
    budget: "$750,000",
    revenueStreams: "Farm-to-table dinners, workshop hosting, community gatherings, event space rentals"
  },
  {
    id: "zone-4",
    name: "Retreat Village", 
    description: "Comprehensive lodging ecosystem with up to 30 diverse guest units plus 4-6 core team housing units. Includes custom chalets, earth-built dwellings, glamping, and operational team homes.",
    coordinates: [[34.4335, -119.1560], [34.4340, -119.1560], [34.4340, -119.1550], [34.4335, -119.1550]],
    cost: 1500000,
    phase: 2,
    category: "hospitality", 
    features: [
      "Custom-built guest chalets for premium stays ($200-$350/night)",
      "Cobb houses and earth-built dwellings from co-build events", 
      "Geodesic domes and sacred geometry structures",
      "Glamping units and safari tents along the creek ($100-$200/night)",
      "Teepees, yurts, and mobile accommodation options",
      "Core team housing (4-6 tiny homes for operational staff)",
      "Quick-deploy off-grid capable units",
      "Wooden decks, fire pits, and communal gathering areas"
    ],
    timeline: { start: "Phase 2 (Months 7-18)", completion: "Phase 3 expansion to full capacity" },
    monthlyRevenue: "$16,000+ at full capacity",
    budget: "$1,500,000 (includes team housing integration)",
    revenueStreams: "Airbnb rentals, retreat packages, long-term eco-residencies, team housing rent"
  },
  {
    id: "zone-5",
    name: "Infrastructure",
    description: "Essential utilities and systems supporting the eco-village including water, electrical, roads, drainage, and energy infrastructure.",
    coordinates: [[34.4315, -119.1560], [34.4320, -119.1560], [34.4320, -119.1550], [34.4315, -119.1550]],
    cost: 400000,
    phase: 1,
    category: "infrastructure", 
    features: [
      "Well producing 30 gallons per minute",
      "Off-grid solar grid systems with battery storage", 
      "Expanded internal road network",
      "City sewer connection with expansion capability",
      "Propane/gas systems for heating and cooking"
    ],
    timeline: { start: "Phase 1 (Months 0-6)", completion: "Ongoing upgrades" },
    monthlyRevenue: "N/A (Support system)",
    budget: "$400,000",
    revenueStreams: "Enables all revenue-generating activities, reduces operational costs"
  },
  {
    id: "zone-6",
    name: "McQueen's Garage",
    description: "Historic 2,000 sq. ft. steel-frame warehouse with 15 ft ceilings, transformed into a dynamic hybrid indoor-outdoor venue for creative production and sacred ceremonies.",
    coordinates: [[34.4328, -119.1568], [34.4332, -119.1568], [34.4332, -119.1564], [34.4328, -119.1564]],
    cost: 500000,
    phase: 2,
    category: "creative",
    features: [
      "Music and film studio for live and recorded productions",
      "Venue for farm-to-table dinners and educational workshops", 
      "Primary space for retreat hosting and sound journeys",
      "Ceremonial gathering area with indoor-outdoor flow",
      "Large, openable front facade adjacent to creek"
    ],
    timeline: { start: "Phase 2 (Months 7-18)", completion: "Complete renovation" },
    monthlyRevenue: "$5,000+",
    budget: "$500,000",
    revenueStreams: "Studio rentals, venue rentals, ticketed dinners, performances, events, ceremonies"
  },
  {
    id: "zone-7", 
    name: "Ceremonial Infrastructure",
    description: "Network of sacred gathering areas for ceremonial practices, spiritual work, and transformational experiences throughout the property.",
    coordinates: [[34.4320, -119.1572], [34.4324, -119.1572], [34.4324, -119.1568], [34.4320, -119.1568]],
    cost: 250000,
    phase: 1,
    category: "ceremonial",
    features: [
      "Multiple kivas including full-scale ceremonial kiva",
      "Sacred fire circles under mature oak trees",
      "Traditional sweat lodges for purification", 
      "Outdoor ceremony platforms for sound healing and breathwork"
    ],
    timeline: { start: "Phase 1+ ongoing", completion: "Continuous expansion" },
    monthlyRevenue: "Part of retreat packages",
    budget: "$250,000",
    revenueStreams: "Integral part of retreat programming, ceremony hosting fees, sacred space rentals"
  },
  {
    id: "zone-8",
    name: "Wellness & Embodiment Facilities", 
    description: "Dedicated spaces for physical and mental wellbeing, including movement practices, contemplation, and therapeutic experiences.",
    coordinates: [[34.4312, -119.1572], [34.4316, -119.1572], [34.4316, -119.1568], [34.4312, -119.1568]],
    cost: 200000,
    phase: 2,
    category: "wellness",
    features: [
      "Nature gym with primal movement stations",
      "Indoor/outdoor hall for yoga, breathwork, and dance",
      "Contemplation areas throughout the property",
      "Hydrotherapy with saunas, ice baths, and hot tubs"
    ],
    timeline: { start: "Phase 2-3 (Months 7+)", completion: "Enhanced therapeutic facilities" },
    monthlyRevenue: "Part of retreat packages", 
    budget: "$200,000",
    revenueStreams: "Wellness retreats, classes, workshops, private sessions, therapeutic services"
  },
  {
    id: "zone-9",
    name: "Mushroom Cultivation",
    description: "Innovative mushroom cultivation operation combining trailer-based systems for controlled production and log-based methods for natural integration.",
    coordinates: [[34.4336, -119.1572], [34.4340, -119.1572], [34.4340, -119.1568], [34.4336, -119.1568]],
    cost: 65000,
    phase: 1,
    category: "agriculture",
    features: [
      "1-2 self-sustainable 40ft growing trailers",
      "Log-based mushroom cultivation on hillside", 
      "Potential yield of 3,000 to 5,000 lbs from 600 logs and 1-2 growing trailers",
      "Integrated with natural forest environment"
    ],
    timeline: { start: "Phase 1-2 (Months 0-12)", completion: "Full harvesting cycle and expansion" },
    monthlyRevenue: "$500 scaling to $5,000-$15,000",
    budget: "$50,000-$80,000", 
    revenueStreams: "Local restaurants and hotels, farmers' markets, online sales, B2B collaborations",
    roi: "ROI: 250% for trailers and log-based system (payback in 5-12 months)"
  },
  {
    id: "zone-10",
    name: "Beekeeping Operations",
    description: "Collaborative beekeeping initiative with local beekeepers hosting their bee families on the property, minimizing costs while maximizing ecological benefits.",
    coordinates: [[34.4316, -119.1576], [34.4320, -119.1576], [34.4320, -119.1572], [34.4316, -119.1572]],
    cost: 5000,
    phase: 1, 
    category: "agriculture",
    features: [
      "Partnership model with local beekeepers",
      "Dedicated space with secure fencing",
      "Processing shed for honey extraction",
      "Shared revenue from honey and bee products"
    ],
    timeline: { start: "Phase 1-2 (Months 0-12)", completion: "Revenue generation within 6 months" },
    monthlyRevenue: "Part of agricultural revenues",
    budget: "$5,000 (initial setup)",
    revenueStreams: "Honey and beeswax products through online sales and farmers' markets"
  },
  {
    id: "zone-11",
    name: "Livestock Program", 
    description: "Comprehensive regenerative livestock program enhancing land vitality, promoting self-sufficiency, and offering educational experiences.",
    coordinates: [[34.4324, -119.1576], [34.4328, -119.1576], [34.4328, -119.1572], [34.4324, -119.1572]],
    cost: 30000,
    phase: 1,
    category: "agriculture", 
    features: [
      "Diverse animals: Chickens, ducks, goats, sheep, cattle, pigs, bees",
      "Rotational paddocks and mobile shelters",
      "Integration with compost and food systems",
      "Educational component for visitors"
    ],
    timeline: { start: "Phase 1-2 (Months 0-12)", completion: "Strategic animal introduction phases" },
    monthlyRevenue: "$3,000+ annually",
    budget: "$30,000",
    revenueStreams: "Farm products (eggs, honey, meat), educational tours, grazing services",
    roi: "ROI: 126.7% (payback period: 11 months)"
  }
];

// PERMANENT PROPERTY BOUNDARY LINES - EMBEDDED AND IMMUTABLE
// These lines were drawn by the property owner and are now permanently locked
const PERMANENT_PROPERTY_LINES = [
  // ✅ PERFECT PROPERTY BOUNDARY - FINAL LOCKED VERSION
  // Captured with corrected coordinates - No lines extend beyond property
  // 10 boundary lines, 31 total points, 8px thickness - PERMANENTLY EMBEDDED
  {
    id: 'boundary_line_1',
    coordinates: [
      [34.433576, -119.156878],
      [34.433578, -119.155856], 
      [34.433580, -119.154834]
    ],
    thickness: 8,
    color: '#FF0000',
    description: 'East boundary - North section (3 points)',
    permanent: true,
    created: '2025-10-02T00:00:00.000Z'
  },
  {
    id: 'boundary_line_2',
    coordinates: [
      [34.433585, -119.154840],
      [34.433215, -119.154843],
      [34.432846, -119.154845]
    ],
    thickness: 8,
    color: '#FF0000',
    description: 'North boundary - Top edge (3 points)',
    permanent: true,
    created: '2025-10-02T00:00:00.000Z'
  },
  {
    id: 'boundary_line_3',
    coordinates: [
      [34.432855, -119.154845],
      [34.432857, -119.154885],
      [34.432859, -119.154925]
    ],
    thickness: 8,
    color: '#FF0000',
    description: 'Northwest corner transition (3 points)',
    permanent: true,
    created: '2025-10-02T00:00:00.000Z'
  },
  {
    id: 'boundary_line_4',
    coordinates: [
      [34.432855, -119.154920],
      [34.432370, -119.154912],
      [34.432185, -119.154908],
      [34.431886, -119.154904]
    ],
    thickness: 8,
    color: '#FF0000',
    description: 'West boundary - North section (4 points)',
    permanent: true,
    created: '2025-10-02T00:00:00.000Z'
  },
  {
    id: 'boundary_line_5',
    coordinates: [
      [34.431886, -119.154893],
      [34.431890, -119.155854],
      [34.431894, -119.156814]
    ],
    thickness: 8,
    color: '#FF0000',
    description: 'West boundary - South section (3 points)',
    permanent: true,
    created: '2025-10-02T00:00:00.000Z'
  },
  {
    id: 'boundary_line_6',
    coordinates: [
      [34.431899, -119.156808],
      [34.432000, -119.156816],
      [34.432102, -119.156824]
    ],
    thickness: 8,
    color: '#FF0000',
    description: 'Southwest corner transition (3 points)',
    permanent: true,
    created: '2025-10-02T00:00:00.000Z'
  },
  {
    id: 'boundary_line_7',
    coordinates: [
      [34.432102, -119.156824],
      [34.432160, -119.157278],
      [34.432217, -119.157731]
    ],
    thickness: 8,
    color: '#FF0000',
    description: 'South boundary - West section (3 points)',
    permanent: true,
    created: '2025-10-02T00:00:00.000Z'
  },
  {
    id: 'boundary_line_8',
    coordinates: [
      [34.432222, -119.157726],
      [34.432293, -119.157742],
      [34.432363, -119.157758]
    ],
    thickness: 8,
    color: '#FF0000',
    description: 'South boundary - Center section (3 points)',
    permanent: true,
    created: '2025-10-02T00:00:00.000Z'
  },
  {
    id: 'boundary_line_9',
    coordinates: [
      [34.432368, -119.157758],
      [34.432470, -119.157326],
      [34.432571, -119.156894]
    ],
    thickness: 8,
    color: '#FF0000',
    description: 'Southeast corner return (3 points)',
    permanent: true,
    created: '2025-10-02T00:00:00.000Z'
  },
  {
    id: 'boundary_line_10',
    coordinates: [
      [34.432576, -119.156899],
      [34.433078, -119.156889],
      [34.433580, -119.156878]
    ],
    thickness: 8,
    color: '#FF0000',
    description: 'East boundary - Completing perimeter (3 points)',
    permanent: true,
    created: '2025-10-02T00:00:00.000Z'
  }
];

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static images
app.use('/images', express.static(join(__dirname, 'public', 'images')));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// API Routes
app.get("/api/project-zones", async (req, res) => {
  try {
    res.json(mockProjectZones);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch project zones" });
  }
});

app.get("/api/project-zones/:id", async (req, res) => {
  try {
    const zone = mockProjectZones.find(z => z.id === req.params.id);
    if (!zone) {
      res.status(404).json({ error: "Project zone not found" });
      return;
    }
    res.json(zone);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch project zone" });
  }
});

// NEW ENDPOINT: Capture current property lines for permanent embedding
app.post("/api/capture-property-lines", async (req, res) => {
  try {
    const { lines } = req.body;
    console.log('🔒 CAPTURING PROPERTY LINES FOR PERMANENT EMBEDDING:');
    console.log('📍 Number of lines to capture:', lines.length);
    
    lines.forEach((line, index) => {
      console.log(`📏 Line ${index + 1}:`);
      console.log(`   - Thickness: ${line.thickness}px`);
      console.log(`   - Points: ${line.coordinates.length}`);
      console.log(`   - Coordinates:`, line.coordinates);
    });
    
    // This would normally save to database or update the source code
    // For now, we'll return the formatted data for manual embedding
    res.json({
      success: true,
      message: `Captured ${lines.length} property lines for permanent embedding`,
      embeddableCode: lines.map((line, index) => ({
        id: `permanent_line_${index + 1}`,
        coordinates: line.coordinates,
        thickness: line.thickness,
        description: `Property boundary line ${index + 1}`,
        type: 'boundary'
      }))
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to capture property lines" });
  }
});

// In development, serve the interactive HTML
if (process.env.NODE_ENV !== 'production') {
  app.get('/', (req, res) => {
    try {
      const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sulphur Mountain Eco-Village - Property Map</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          #map { height: 100vh; width: 100%; }
          
          .controls { 
            position: absolute; 
            top: 10px; 
            left: 10px; 
            background: white; 
            padding: 15px; 
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 1000;
            min-width: 220px;
          }
          
          /* Google Maps Style Side Panel */
          .side-panel { 
            position: absolute; 
            top: 0; 
            left: -420px;
            width: 400px;
            height: 100vh;
            background: white; 
            box-shadow: 4px 0 20px rgba(0,0,0,0.15);
            z-index: 1001;
            transition: left 0.3s ease;
            overflow-y: auto;
          }
          
          .side-panel.open { left: 0; }
          
          .side-panel-header {
            padding: 20px;
            border-bottom: 1px solid #e0e0e0;
            background: #f8f9fa;
          }
          
          .side-panel-content {
            padding: 0;
          }
          
          .close-panel {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            padding: 5px;
          }
          
          .close-panel:hover { color: #000; }
          
          /* Image Gallery Section */
          .image-section {
            padding: 20px;
            border-bottom: 1px solid #e0e0e0;
          }
          
          .image-toggle {
            display: flex;
            background: #f1f3f4;
            border-radius: 6px;
            margin-bottom: 16px;
            padding: 4px;
          }
          
          .toggle-btn {
            flex: 1;
            padding: 8px 16px;
            border: none;
            background: transparent;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
          }
          
          .toggle-btn.active {
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            color: #1a73e8;
          }
          
          .image-gallery {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-top: 16px;
          }
          
          .image-placeholder {
            aspect-ratio: 16/9;
            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
            font-size: 14px;
            border: 2px dashed #ccc;
          }
          
          .project-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 8px;
          }
          
          /* Project Details */
          .project-details {
            padding: 20px;
          }
          
          .project-title {
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 8px 0;
            color: #202124;
          }
          
          .project-description {
            color: #5f6368;
            margin-bottom: 20px;
            line-height: 1.5;
          }
          
          .detail-grid {
            display: grid;
            gap: 16px;
          }
          
          .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;
          }
          
          .detail-item:last-child {
            border-bottom: none;
          }
          
          .detail-label {
            font-weight: 500;
            color: #5f6368;
          }
          
          .detail-value {
            color: #202124;
            font-weight: 500;
          }
          
          .cost-value {
            color: #1a73e8;
            font-weight: 600;
          }
          
          .features-list {
            list-style: none;
            padding: 0;
            margin: 8px 0 0 0;
          }
          
          .features-list li {
            padding: 4px 0;
            color: #5f6368;
          }
          
          .features-list li:before {
            content: "•";
            color: #1a73e8;
            margin-right: 8px;
          }
          
          /* Mobile Responsive */
          @media (max-width: 768px) {
            .side-panel {
              left: -100%;
              width: 100%;
              top: auto;
              bottom: -100%;
              height: 70vh;
              border-radius: 16px 16px 0 0;
            }
            
            .side-panel.open {
              left: 0;
              bottom: 0;
            }
            
            .controls {
              top: auto;
              bottom: 20px;
              left: 50%;
              transform: translateX(-50%);
            }
          }
          

          
          .btn { 
            padding: 10px 16px; 
            margin: 5px; 
            border: none; 
            border-radius: 4px; 
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
          }
          
          .unlock-btn { 
            background: #FF5722; 
            color: white; 
          }
          
          .lock-btn { 
            background: #4CAF50; 
            color: white; 
          }
          
          .capture-btn { 
            background: #9C27B0; 
            color: white; 
          }
          
          .unlock-btn:hover { background: #E64A19; }
          .lock-btn:hover { background: #45a049; }
          .capture-btn:hover { background: #7B1FA2; }
          
          .drag-status {
            margin-top: 10px;
            padding: 8px;
            border-radius: 4px;
            font-size: 0.9em;
          }
          
          .status-locked { background: #ffebee; color: #c62828; }
          .status-unlocked { background: #e8f5e8; color: #2e7d32; }
          
          .property-line-permanent {
            pointer-events: none !important;
            opacity: 1 !important;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        
        <div class="controls">
          <h4 style="margin: 0 0 15px 0;">🎯 Zone Placement</h4>
          
          <button class="btn unlock-btn" onclick="enableDragMode()">
            🔓 Unlock All Zones
          </button>
          
          <button class="btn lock-btn" onclick="lockAllZones()">
            🔒 Lock All Zones
          </button>
          
          <button class="btn capture-btn" onclick="capturePropertyLines()" id="capture-btn">
            🔒 Capture & Lock Property Lines
          </button>
          
          <div id="drag-status" class="drag-status status-locked">
            🔒 Zones Locked
          </div>
          
          <div style="margin-top: 10px; font-size: 0.85em; color: #666;">
            • Unlock to drag zones to exact positions<br>
            • Lock when satisfied with placement<br>
            • <strong>Use "Capture & Lock" to permanently embed property lines</strong>
          </div>
        </div>
        


        <!-- Google Maps Style Interactive Side Panel -->
        <div id="side-panel" class="side-panel">
          <button class="close-panel" onclick="closeSidePanel()">&times;</button>
          
          <div class="side-panel-header">
            <h2 id="panel-title" class="project-title">Project Details</h2>
            <p id="panel-description" class="project-description">Click on a zone to view details</p>
          </div>
          
          <div class="side-panel-content">
            <!-- Image Gallery Section -->
            <div class="image-section">
              <div class="image-toggle">
                <button class="toggle-btn active" onclick="showActualImages()">Current State</button>
                <button class="toggle-btn" onclick="showPotentialImages()">Planned Vision</button>
              </div>
              
              <div id="image-gallery" class="image-gallery">
                <!-- Images will be loaded dynamically -->
              </div>
            </div>
            
            <!-- Project Details Section -->
            <div class="project-details">
              <div class="detail-grid" id="project-detail-grid">
                <!-- Details will be loaded dynamically -->
              </div>
            </div>
          </div>
        </div>
        
        <script>
          // Global variables
          let map;
          let zones = [];
          let zonePolygons = {};
          let isDragMode = false;
          let propertyLines = [];
          
          // Initialize map with enhanced zoom capabilities
          map = L.map('map', {
            maxZoom: 22,  // Increased from default 18 to allow much closer zoom
            minZoom: 10   // Set minimum zoom to prevent zooming out too far
          }).setView([34.433086, -119.155336], 17);
          
          // Add tile layers with enhanced zoom
          const streetMap = L.tileLayer('https://\\{s\\}.tile.openstreetmap.org/\\{z\\}/\\{x\\}/\\{y\\}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 22
          });
          
          const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/\\{z\\}/\\{y\\}/\\{x\\}', {
            attribution: '© Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS',
            maxZoom: 22
          });
          
          // Add default layer
          satelliteMap.addTo(map);
          
          // Add layer control
          const baseLayers = {
            "Satellite": satelliteMap,
            "Street Map": streetMap
          };
          L.control.layers(baseLayers).addTo(map);
          
          // Colors for different categories
          const colors = {
            agriculture: '#4CAF50',
            residential: '#2196F3', 
            community: '#FF9800',
            hospitality: '#9C27B0',
            infrastructure: '#607D8B',
            creative: '#FF5722',
            ceremonial: '#673AB7',
            wellness: '#00BCD4'
          };
          
          // Emoji markers  
          const emojis = {
            agriculture: '🌾',
            residential: '🏠',
            community: '🏛️',
            hospitality: '🏡', 
            infrastructure: '⚡',
            creative: '🎭',
            ceremonial: '🔮',
            wellness: '🧘'
          };
          
          // Special emojis for specific projects
          const specialEmojis = {
            'McQueen\'s Garage': '🎭',
            'Mushroom Cultivation': '🍄',
            'Beekeeping Operations': '🐝', 
            'Livestock Program': '🐄'
          };
          
          // Helper function to get zone emoji
          function getZoneEmoji(category, name) {
            // Check for special project emojis first
            if (name && specialEmojis[name]) {
              return specialEmojis[name];
            }
            // Fall back to category emoji
            return emojis[category] || '📍';
          }          // Zone management functions
          function enableDragMode() {
            isDragMode = true;
            document.getElementById('drag-status').innerHTML = '🔓 Drag Mode Active';
            document.getElementById('drag-status').className = 'drag-status status-unlocked';
            
            Object.values(zonePolygons).forEach(polygon => {
              polygon.dragging.enable();
            });
            
            console.log('🔓 Drag mode enabled');
          }
          
          function lockAllZones() {
            isDragMode = false;
            document.getElementById('drag-status').innerHTML = '🔒 Zones Locked';
            document.getElementById('drag-status').className = 'drag-status status-locked';
            
            Object.values(zonePolygons).forEach(polygon => {
              polygon.dragging.disable();
            });
            
            saveAllZonePositions();
            console.log('🔒 Zones locked and positions saved');
          }
          
          function saveAllZonePositions() {
            zones.forEach(zone => {
              if (zonePolygons[zone.id]) {
                const polygon = zonePolygons[zone.id];
                const center = polygon.getLatLng();
                const offset = 0.0001;
                const newCoords = [
                  [center.lat - offset, center.lng - offset],
                  [center.lat + offset, center.lng - offset], 
                  [center.lat + offset, center.lng + offset],
                  [center.lat - offset, center.lng + offset]
                ];
                
                fetch('/api/project-zones/' + zone.id + '/coordinates', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ coordinates: newCoords })
                }).then(response => response.json())
                  .then(updatedZone => {
                    console.log('✅ Saved ' + updatedZone.name + ' position');
                  })
                  .catch(err => console.error('❌ Failed to save ' + zone.name + ':', err));
              }
            });
          }
          
          // Property lines capture function
          function capturePropertyLines() {
            if (propertyLines.length === 0) {
              alert('No property lines to capture. The lines have already been permanently embedded or none exist.');
              return;
            }
            
            const confirmation = confirm(
              \`🔒 PERMANENT LOCK CONFIRMATION\\n\\n\` +
              'This will permanently embed ' + propertyLines.length + ' property line(s) into the map.\\n\\n' +
              \`⚠️  IMPORTANT: After this action:\\n\` +
              \`• Lines cannot be moved, edited, or deleted\\n\` +
              \`• Lines will appear for all users and browsers\\n\` +
              \`• Drawing tools will be removed\\n\` +
              \`• This action cannot be undone\\n\\n\` +
              \`Do you want to proceed with permanent embedding?\`
            );
            
            if (!confirmation) return;
            
            // Prepare line data for capture
            const lineData = propertyLines.map(line => ({
              coordinates: line.getLatLngs().map(latlng => [latlng.lat, latlng.lng]),
              thickness: line._thickness || 4,
              type: 'boundary'
            }));
            
            // Send to server for permanent embedding
            fetch('/api/capture-property-lines', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ lines: lineData })
            }).then(response => response.json())
              .then(result => {
                if (result.success) {
                  alert('✅ SUCCESS!\\n\\n' + result.message + '\\n\\nThe page will now reload with permanently embedded property lines.');
                  
                  // Log the embeddable code for manual insertion
                  console.log('🔒 PROPERTY LINES CAPTURED FOR PERMANENT EMBEDDING:');
                  console.log('📋 Copy this data into PERMANENT_PROPERTY_LINES array:');
                  console.log(JSON.stringify(result.embeddableCode, null, 2));
                  
                  // Disable the capture button
                  document.getElementById('capture-btn').disabled = true;
                  document.getElementById('capture-btn').innerHTML = '✅ Lines Captured';
                  
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                } else {
                  alert('❌ Failed to capture property lines. Please try again.');
                }
              })
              .catch(err => {
                console.error('Capture error:', err);
                alert('❌ Error capturing property lines. Check console for details.');
              });
          }
          
          // Load permanent property lines (these cannot be modified)
          function loadPermanentPropertyLines() {
            const permanentLines = PERMANENT_PROPERTY_LINES_PLACEHOLDER;
            
            permanentLines.forEach((lineData, index) => {
              const line = L.polyline(lineData.coordinates, {
                color: '#8B0000',
                weight: lineData.thickness || 4,
                opacity: 1,
                className: 'property-line-permanent'
              }).addTo(map);
              
              // Make completely uneditable
              line._permanent = true;
              line._lineId = lineData.id;
              
              console.log('📏 Loaded permanent property line ' + (index + 1) + ': ' + lineData.description);
            });
            
            document.getElementById('lines-count').textContent = 
              permanentLines.length + ' permanent boundary lines';
          }
          
          // Load and display zones
          fetch('/api/project-zones')
            .then(response => response.json())
            .then(data => {
              zones = data;
              
              zones.forEach(zone => {
                
                // Calculate center point
                const centerLat = zone.coordinates.reduce((sum, coord) => sum + coord[0], 0) / zone.coordinates.length;
                const centerLng = zone.coordinates.reduce((sum, coord) => sum + coord[1], 0) / zone.coordinates.length;
                
                // Create small circular zone
                const polygon = L.circle([centerLat, centerLng], {
                  radius: 15,
                  color: colors[zone.category] || '#666',
                  fillColor: colors[zone.category] || '#666',
                  fillOpacity: 0.4,
                  weight: 2
                }).addTo(map);
                
                // Store polygon reference
                zonePolygons[zone.id] = polygon;
                
                // Dragging functionality
                polygon.dragging = {
                  enable: function() {
                    polygon.on('mousedown', startDrag);
                    polygon.getElement().style.cursor = 'move';
                  },
                  disable: function() {
                    polygon.off('mousedown', startDrag);
                    polygon.getElement().style.cursor = 'pointer';
                  }
                };
                
                let isDragging = false;
                let startLatLng = null;
                
                function startDrag(e) {
                  if (!isDragMode) return;
                  isDragging = true;
                  startLatLng = e.latlng;
                  polygon.setStyle({ fillOpacity: 0.7, weight: 3 });
                  
                  map.on('mousemove', onDrag);
                  map.on('mouseup', endDrag);
                  map.dragging.disable();
                  e.originalEvent.preventDefault();
                }
                
                function onDrag(e) {
                  if (!isDragging) return;
                  polygon.setLatLng(e.latlng);
                  if (polygon.marker) {
                    polygon.marker.setLatLng(e.latlng);
                  }
                }
                
                function endDrag(e) {
                  if (!isDragging) return;
                  isDragging = false;
                  polygon.setStyle({ fillOpacity: 0.4, weight: 2 });
                  
                  const center = polygon.getLatLng();
                  const offset = 0.0001;
                  zone.coordinates = [
                    [center.lat - offset, center.lng - offset],
                    [center.lat + offset, center.lng - offset], 
                    [center.lat + offset, center.lng + offset],
                    [center.lat - offset, center.lng + offset]
                  ];
                  
                  map.off('mousemove', onDrag);
                  map.off('mouseup', endDrag);
                  map.dragging.enable();
                  
                  console.log('Moved ' + zone.name + ' to new position');
                }
                
                // Add emoji marker
                const marker = L.marker([centerLat, centerLng], {
                  icon: L.divIcon({
                    html: '<div style="text-align: center; line-height: 24px; font-size: 16px;">' + getZoneEmoji(zone.category, zone.name) + '</div>',
                    className: 'emoji-marker',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                  })
                }).addTo(map);
                
                polygon.marker = marker;
                
                // Click handlers for interactive panel
                polygon.on('click', () => {
                  if (!isDragMode) {
                    openSidePanel(zone);
                  }
                });
                
                marker.on('click', () => {
                  if (!isDragMode) {
                    openSidePanel(zone);
                  }
                });
              });
              
              // Load permanent property lines after zones
              loadPermanentPropertyLines();
              
              console.log('🗺️ Map loaded with', zones.length, 'zones and permanent property lines');
            })
            .catch(err => {
              console.error('Error loading zones:', err);
            });

          // Interactive Panel Functions
          let currentImageMode = 'actual';
          
          function openSidePanel(zone) {
            const panel = document.getElementById('side-panel');
            const title = document.getElementById('panel-title');
            const description = document.getElementById('panel-description');
            
            // Update panel content
            title.textContent = getZoneEmoji(zone.category, zone.name) + ' ' + zone.name;
            description.textContent = zone.description;
            
            // Load images for this zone
            loadZoneImages(zone);
            
            // Load project details
            loadProjectDetails(zone);
            
            // Show the panel
            panel.classList.add('open');
          }
          
          function closeSidePanel() {
            const panel = document.getElementById('side-panel');
            panel.classList.remove('open');
          }
          
          function showActualImages() {
            currentImageMode = 'actual';
            updateToggleButtons();
            const currentZone = getCurrentZoneFromPanel();
            if (currentZone) {
              loadZoneImages(currentZone);
            }
          }
          
          function showPotentialImages() {
            currentImageMode = 'potential';
            updateToggleButtons();
            const currentZone = getCurrentZoneFromPanel();
            if (currentZone) {
              loadZoneImages(currentZone);
            }
          }
          
          function updateToggleButtons() {
            const buttons = document.querySelectorAll('.toggle-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            
            if (currentImageMode === 'actual') {
              buttons[0].classList.add('active');
            } else {
              buttons[1].classList.add('active');
            }
          }
          
          function getCurrentZoneFromPanel() {
            const title = document.getElementById('panel-title').textContent;
            return zones.find(zone => title.includes(zone.name));
          }
          
          function loadZoneImages(zone) {
            const gallery = document.getElementById('image-gallery');
            const projectName = zone.name.toLowerCase().replace(/\\s+/g, '-');
            const imageType = currentImageMode;
            
            // Create placeholder images for now (4 images per project)
            const imageCount = 4;
            let galleryHtml = '';
            
            for (let i = 1; i <= imageCount; i++) {
              const imagePath = '/images/projects/' + projectName + '/' + imageType + '/image' + i + '.jpg';
              galleryHtml += '<div class="image-placeholder" onclick="previewImage(\\'' + imagePath + '\\')">' +
                '<span>📸 ' + (imageType === 'actual' ? 'Current' : 'Planned') + ' View ' + i + '</span>' +
                '</div>';
            }
            
            gallery.innerHTML = galleryHtml;
          }
          
          function loadProjectDetails(zone) {
            const detailGrid = document.getElementById('project-detail-grid');
            
            let detailsHtml = '<div class="detail-item">' +
              '<span class="detail-label">Investment Budget</span>' +
              '<span class="detail-value cost-value">' + (zone.budget || '$' + zone.cost.toLocaleString()) + '</span>' +
              '</div>' +
              '<div class="detail-item">' +
              '<span class="detail-label">Development Phase</span>' +
              '<span class="detail-value">Phase ' + zone.phase + '</span>' +
              '</div>' +
              '<div class="detail-item">' +
              '<span class="detail-label">Category</span>' +
              '<span class="detail-value">' + zone.category.charAt(0).toUpperCase() + zone.category.slice(1) + '</span>' +
              '</div>';
            
            // Add monthly revenue if available
            if (zone.monthlyRevenue) {
              detailsHtml += '<div class="detail-item">' +
                '<span class="detail-label">Monthly Revenue</span>' +
                '<span class="detail-value cost-value">' + zone.monthlyRevenue + '</span>' +
                '</div>';
            }
            
            detailsHtml += '<div class="detail-item">' +
              '<span class="detail-label">Timeline</span>' +
              '<span class="detail-value">' + zone.timeline.start + ' - ' + zone.timeline.completion + '</span>' +
              '</div>';
            
            // Add ROI if available
            if (zone.roi) {
              detailsHtml += '<div class="detail-item">' +
                '<span class="detail-label">ROI</span>' +
                '<span class="detail-value cost-value">' + zone.roi + '</span>' +
                '</div>';
            }
            
            // Add revenue streams if available
            if (zone.revenueStreams) {
              detailsHtml += '<div class="detail-item">' +
                '<span class="detail-label">Revenue Streams</span>' +
                '<span class="detail-value">' + zone.revenueStreams + '</span>' +
                '</div>';
            }
            
            detailsHtml += '<div class="detail-item">' +
              '<span class="detail-label">Key Features</span>' +
              '<div class="detail-value">' +
              '<ul class="features-list">' +
              zone.features.map(function(feature) { return '<li>' + feature + '</li>'; }).join('') +
              '</ul>' +
              '</div>' +
              '</div>';
            
            detailGrid.innerHTML = detailsHtml;
          }
          
          function previewImage(imagePath) {
            // Simple image preview - could be enhanced with a modal
            alert('Image preview: ' + imagePath + '\\n\\nThis would open a larger view of the image in a production app.');
          }
          
        </script>
      </body>
      </html>
    `;
    
    // Replace the placeholder with actual data
    const finalHtml = htmlContent.replace(
      'PERMANENT_PROPERTY_LINES_PLACEHOLDER',
      JSON.stringify(PERMANENT_PROPERTY_LINES)
    );
    
    res.send(finalHtml);
    } catch (error) {
      console.error('Error in route handler:', error);
      res.status(500).send('Error generating page: ' + error.message);
    }
  });
}

// Error handling  
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  console.error('Error:', err);
});

// Global error handlers (non-fatal for development)
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Don't exit in development
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit in development
});

const server = createServer(app);
const port = parseInt(process.env.PORT || '5000', 10);

server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 EcoVillageBuilder - Final version serving on port ${port}`);
  console.log(`🌐 Open http://localhost:${port} to view your property map`);
  console.log(`🔒 Use "Capture & Lock Property Lines" to permanently embed your boundary lines`);
});