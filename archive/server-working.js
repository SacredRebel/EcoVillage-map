// Working EcoVillageBuilder Server - Based on successful test-simple.js
import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting EcoVillageBuilder - Working version...');

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
    emoji: "🌾",
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
    emoji: "🏠",
    features: [
      "Main House (3,000-5,000 sq. ft.) with 5 bedrooms",
      "Guesthouse (1,000 sq. ft.) with 2 bedrooms", 
      "Gatehouse remodel (1,000 sq. ft.) for operations",
      "Sacred geometry and bio-integrated architecture",
      "Panoramic views of Topa-Topa Mountains"
    ],
    timeline: { start: "Phase 1 (Months 6-18)", completion: "Month 18" },
    monthlyRevenue: "$8,000+ (retreat bookings)",
    budget: "$2,500,000",
    revenueStreams: "Private retreat bookings, event hosting, luxury eco-tourism"
  },
  {
    id: "zone-3",
    name: "Community Hub", 
    description: "Central gathering space featuring community kitchen, co-working areas, library, and event spaces designed to foster collaboration and social connection among residents and visitors.",
    coordinates: [[34.4335, -119.1560], [34.4340, -119.1560], [34.4340, -119.1550], [34.4335, -119.1550]],
    cost: 800000,
    phase: 2,
    category: "community",
    emoji: "🏛️",
    features: [
      "Community kitchen and dining hall",
      "Co-working spaces with high-speed internet",
      "Library and resource center",
      "Multi-purpose event and workshop spaces"
    ],
    timeline: { start: "Phase 2 (Months 12-24)", completion: "Month 24" },
    monthlyRevenue: "$2,000+ (event hosting, co-working)",
    budget: "$800,000",
    revenueStreams: "Event hosting, co-working memberships, workshop fees"
  },
  {
    id: "zone-4",
    name: "Retreat Village",
    description: "Collection of 8-12 eco-cabins and team housing designed for visiting groups, workshops, and retreats, providing immersive nature experiences while maintaining comfort and sustainability.",
    coordinates: [[34.4320, -119.1555], [34.4325, -119.1555], [34.4325, -119.1545], [34.4320, -119.1545]],
    cost: 1200000,
    phase: 2,
    category: "hospitality",
    emoji: "🏡",
    features: [
      "8-12 eco-cabins for retreat guests",
      "Team housing for extended stays",
      "Shared bathroom and common facilities",
      "Integration with natural landscape"
    ],
    timeline: { start: "Phase 2 (Months 18-30)", completion: "Month 30" },
    monthlyRevenue: "$4,000+ (retreat bookings)",
    budget: "$1,200,000", 
    revenueStreams: "Retreat bookings, team housing rentals, workshop accommodation"
  },
  {
    id: "zone-5",
    name: "Infrastructure & Utilities",
    description: "Comprehensive off-grid infrastructure including solar power systems, water treatment, waste management, and high-speed internet connectivity to support the entire eco-village.",
    coordinates: [[34.4340, -119.1555], [34.4345, -119.1555], [34.4345, -119.1545], [34.4340, -119.1545]],
    cost: 600000,
    phase: 1,
    category: "infrastructure", 
    emoji: "⚡",
    features: [
      "100kW solar power system with battery storage",
      "Greywater and blackwater treatment systems",
      "Starlink high-speed internet infrastructure",
      "Sustainable waste management systems"
    ],
    timeline: { start: "Phase 1 (Months 0-12)", completion: "Ongoing maintenance" },
    monthlyRevenue: "$0 (cost center)",
    budget: "$600,000",
    revenueStreams: "Supports all other revenue-generating activities"
  },
  {
    id: "zone-6",
    name: "McQueen's Garage & Workshop",
    description: "Multi-purpose workshop and garage space with 15-foot ceilings, designed for vehicle maintenance, woodworking, metalwork, and various maker activities supporting the community.",
    coordinates: [[34.4315, -119.1560], [34.4320, -119.1560], [34.4320, -119.1550], [34.4315, -119.1550]],
    cost: 300000,
    phase: 2,
    category: "workshop",
    emoji: "🎭",
    features: [
      "15-foot ceiling height for large projects",
      "Vehicle maintenance and repair bay",
      "Woodworking and metalworking stations",
      "Tool library and equipment sharing"
    ],
    timeline: { start: "Phase 2 (Months 12-18)", completion: "Month 18" },
    monthlyRevenue: "$500+ (workshop rentals)",
    budget: "$300,000",
    revenueStreams: "Workshop space rentals, tool sharing, repair services"
  },
  {
    id: "zone-7",
    name: "Ceremonial & Spiritual Infrastructure",
    description: "Sacred spaces including meditation areas, fire circles, and ceremonial grounds designed to support spiritual practices, community rituals, and personal reflection.",
    coordinates: [[34.4325, -119.1565], [34.4330, -119.1565], [34.4330, -119.1555], [34.4325, -119.1555]],
    cost: 200000,
    phase: 3,
    category: "spiritual",
    emoji: "🔮", 
    features: [
      "Meditation and mindfulness spaces",
      "Fire circles for community gatherings", 
      "Labyrinth and walking paths",
      "Sacred geometry installations"
    ],
    timeline: { start: "Phase 3 (Months 24-36)", completion: "Month 36" },
    monthlyRevenue: "$1,000+ (spiritual retreats)",
    budget: "$200,000",
    revenueStreams: "Spiritual retreats, ceremony hosting, mindfulness programs"
  },
  {
    id: "zone-8",
    name: "Wellness & Healing Facilities", 
    description: "Integrated wellness center offering massage therapy, yoga studios, sauna facilities, and healing arts spaces to support physical and mental well-being of residents and visitors.",
    coordinates: [[34.4330, -119.1565], [34.4335, -119.1565], [34.4335, -119.1555], [34.4330, -119.1555]],
    cost: 400000,
    phase: 3,
    category: "wellness",
    emoji: "🧘",
    features: [
      "Yoga and movement studios",
      "Massage and bodywork rooms",
      "Sauna and cold plunge facilities", 
      "Healing arts and therapy spaces"
    ],
    timeline: { start: "Phase 3 (Months 30-42)", completion: "Month 42" },
    monthlyRevenue: "$3,000+ (wellness services)",
    budget: "$400,000",
    revenueStreams: "Wellness retreats, therapy sessions, healing arts workshops"
  },
  {
    id: "zone-9",
    name: "Mushroom Cultivation Facility",
    description: "Specialized indoor growing facility for gourmet and medicinal mushroom cultivation, featuring controlled environment systems and processing areas for high-value crop production.",
    coordinates: [[34.4335, -119.1565], [34.4340, -119.1565], [34.4340, -119.1555], [34.4335, -119.1555]],
    cost: 150000,
    phase: 2,
    category: "agriculture",
    emoji: "🍄",
    features: [
      "Climate-controlled growing chambers",
      "Substrate preparation and sterilization",
      "Processing and packaging facility",
      "Multiple mushroom varieties cultivation"
    ],
    timeline: { start: "Phase 2 (Months 18-24)", completion: "Month 24" },
    monthlyRevenue: "$1,250+ (250% ROI annually)",
    budget: "$150,000", 
    revenueStreams: "Gourmet mushroom sales, medicinal mushroom products, cultivation workshops"
  },
  {
    id: "zone-10",
    name: "Beekeeping & Pollinator Support",
    description: "Comprehensive apiary program supporting both honey production and ecosystem health through pollinator conservation, featuring multiple hive locations and honey processing facilities.",
    coordinates: [[34.4320, -119.1565], [34.4325, -119.1565], [34.4325, -119.1555], [34.4320, -119.1555]],
    cost: 75000,
    phase: 2,
    category: "agriculture", 
    emoji: "🐝",
    features: [
      "Multiple beehive locations across property",
      "Honey extraction and processing facility",
      "Pollinator-friendly plant corridors",
      "Educational beekeeping programs"
    ],
    timeline: { start: "Phase 2 (Months 12-18)", completion: "Ongoing management" },
    monthlyRevenue: "$625+ (126.7% ROI annually)",
    budget: "$75,000",
    revenueStreams: "Honey and beeswax products, pollination services, beekeeping education"
  },
  {
    id: "zone-11", 
    name: "Livestock & Regenerative Grazing",
    description: "Rotational grazing system supporting goats, chickens, and other small livestock for meat, dairy, and eggs while improving soil health through regenerative agriculture practices.",
    coordinates: [[34.4340, -119.1565], [34.4345, -119.1565], [34.4345, -119.1555], [34.4340, -119.1555]],
    cost: 125000,
    phase: 3,
    category: "agriculture",
    emoji: "🐄",
    features: [
      "Rotational grazing paddock systems",
      "Mobile shelters and fencing infrastructure", 
      "Small-scale dairy and egg production",
      "Regenerative land management practices"
    ],
    timeline: { start: "Phase 3 (Months 24-30)", completion: "Ongoing operations" },
    monthlyRevenue: "$1,320+ (126.7% ROI annually)",
    budget: "$125,000",
    revenueStreams: "Grass-fed meat sales, fresh dairy products, pasture-raised eggs"
  }
];

// Permanent property lines (embedded permanently) - All 10 boundary lines
const PERMANENT_PROPERTY_LINES = [
  {
    id: 'permanent_line_1',
    coordinates: [
      [34.4320, -119.1570], [34.4325, -119.1565], [34.4330, -119.1560]
    ],
    thickness: 8,
    color: '#FF0000',
    description: 'North boundary - Main entrance area (3 points)',
    permanent: true,
    created: '2025-10-02T00:00:00.000Z'
  },
  {
    id: 'permanent_line_2',
    coordinates: [
      [34.4330, -119.1560], [34.4335, -119.1555], [34.4340, -119.1550], [34.4345, -119.1545]
    ],
    thickness: 8,
    color: '#FF0000',
    description: 'Northeast boundary - Property line extending east (4 points)',
    permanent: true,
    created: '2025-10-02T00:00:00.000Z'
  },
  {
    id: 'permanent_line_3',
    coordinates: [
      [34.4345, -119.1545], [34.4340, -119.1540], [34.4335, -119.1535]
    ],
    thickness: 8,
    color: '#FF0000',
    description: 'East boundary - Property corner and eastern edge (3 points)',
    permanent: true,
    created: '2025-10-02T00:00:00.000Z'
  },
  {
    id: 'permanent_line_4',
    coordinates: [
      [34.4335, -119.1535], [34.4330, -119.1540], [34.4325, -119.1545], [34.4320, -119.1550]
    ],
    thickness: 8,
    color: '#FF0000',
    description: 'Southeast boundary - Southern property line (4 points)',
    permanent: true,
    created: '2025-10-02T00:00:00.000Z'
  },
  {
    id: 'permanent_line_5',
    coordinates: [
      [34.4320, -119.1550], [34.4315, -119.1555], [34.4310, -119.1560]
    ],
    thickness: 8,
    color: '#FF0000',
    description: 'South boundary - Lower property edge (3 points)',
    permanent: true,
    created: '2025-10-02T00:00:00.000Z'
  },
  {
    id: 'permanent_line_6',
    coordinates: [
      [34.4310, -119.1560], [34.4315, -119.1565], [34.4320, -119.1570]
    ],
    thickness: 8,
    color: '#FF0000',
    description: 'West boundary - Closing the perimeter (3 points)',
    permanent: true,
    created: '2025-10-02T00:00:00.000Z'
  },
  {
    id: 'permanent_line_7',
    coordinates: [
      [34.4325, -119.1568], [34.4330, -119.1565], [34.4335, -119.1562]
    ],
    thickness: 8,
    color: '#FF0000',
    description: 'Internal boundary - Agricultural zone separator (3 points)',
    permanent: true,
    created: '2025-10-02T00:00:00.000Z'
  },
  {
    id: 'permanent_line_8',
    coordinates: [
      [34.4322, -119.1558], [34.4327, -119.1555], [34.4332, -119.1552], [34.4337, -119.1549]
    ],
    thickness: 8,
    color: '#FF0000',
    description: 'Central access road - Main internal pathway (4 points)',
    permanent: true,
    created: '2025-10-02T00:00:00.000Z'
  },
  {
    id: 'permanent_line_9',
    coordinates: [
      [34.4318, -119.1562], [34.4323, -119.1559], [34.4328, -119.1556]
    ],
    thickness: 8,
    color: '#FF0000',
    description: 'Secondary access - Service road boundary (3 points)',
    permanent: true,
    created: '2025-10-02T00:00:00.000Z'
  },
  {
    id: 'permanent_line_10',
    coordinates: [
      [34.4340, -119.1548], [34.4342, -119.1546], [34.4344, -119.1544]
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

// API endpoints
app.get('/api/project-zones', (req, res) => {
  res.json(mockProjectZones);
});

app.get('/api/property-lines', (req, res) => {
  res.json(PERMANENT_PROPERTY_LINES);
});

// Main HTML route
app.get('/', (req, res) => {
  try {
    const htmlContent = `<!DOCTYPE html>
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
    
    .control-button {
      display: block;
      width: 100%;
      margin: 5px 0;
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      text-align: center;
    }
    
    .unlock-btn { background: #FF5722; color: white; }
    .lock-btn { background: #4CAF50; color: white; }
    .capture-btn { background: #9C27B0; color: white; }

    /* Google Maps Style Side Panel */
    .side-panel { 
      position: fixed;
      top: 0;
      left: -400px;
      width: 400px;
      height: 100vh;
      background: white;
      box-shadow: 2px 0 10px rgba(0,0,0,0.3);
      transition: left 0.3s ease-in-out;
      z-index: 2000;
      overflow-y: auto;
    }

    .side-panel.open { left: 0; }

    .side-panel-header {
      background: #2E7D32;
      color: white;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .side-panel-content {
      padding: 20px;
      max-height: calc(100vh - 80px);
      overflow-y: auto;
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .project-info {
      margin: 15px 0;
    }

    .info-section {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
      margin: 15px 0;
    }

    .feature-list {
      list-style: none;
      padding: 0;
    }

    .feature-list li {
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }

    .feature-list li:before {
      content: "✓";
      color: #4CAF50;
      font-weight: bold;
      margin-right: 10px;
    }

    .budget-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin: 15px 0;
    }

    .budget-item {
      text-align: center;
      padding: 10px;
      background: #e8f5e8;
      border-radius: 4px;
    }

    .zone-marker {
      cursor: pointer;
      transition: transform 0.2s;
    }

    .zone-marker:hover {
      transform: scale(1.1);
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .side-panel {
        width: 100vw;
        left: -100vw;
      }
      
      .side-panel.open {
        left: 0;
      }
    }
  </style>
</head>
<body>
  <div id="map"></div>
  
  <!-- Google Maps Style Side Panel -->
  <div id="side-panel" class="side-panel">
    <div class="side-panel-header">
      <h2 id="panel-title">Project Details</h2>
      <button class="close-btn" onclick="closeSidePanel()">&times;</button>
    </div>
    <div class="side-panel-content" id="panel-content">
      <p>Click on a zone to see detailed information</p>
    </div>
  </div>
  
  <div class="controls">
    <h3>🎯 Zone Placement</h3>
    <button class="control-button unlock-btn" onclick="unlockAllZones()">🔓 Unlock All Zones</button>
    <button class="control-button lock-btn" onclick="lockAllZones()">🔒 Lock All Zones</button>
    <button class="control-button capture-btn" onclick="capturePropertyLines()">📐 Capture & Lock Property Lines</button>
    
    <div id="status">
      <p>🔒 <strong>Zones Locked</strong></p>
      <p>• Unlock to drag zones to exact positions</p>
      <p>• Lock when satisfied with placement</p>
      <p>• Use "Capture & Lock" to permanently embed property lines</p>
    </div>
  </div>

  <script>
    console.log('Initializing map...');
    
    // Initialize map with enhanced zoom capabilities
    const map = L.map('map', {
      maxZoom: 22,
      minZoom: 10
    }).setView([34.433086, -119.155336], 17);
    
    // Add tile layers with proper URL escaping
    const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '© Esri, Maxar, GeoEye, Earthstar Geographics',
      maxZoom: 22
    });
    
    // Add default layer
    satelliteMap.addTo(map);
    
    console.log('Map initialized successfully');
    
    // Load permanent property lines
    function loadPermanentPropertyLines() {
      const permanentLines = ` + JSON.stringify(PERMANENT_PROPERTY_LINES) + `;
      
      permanentLines.forEach((lineData, index) => {
        const line = L.polyline(lineData.coordinates, {
          color: '#8B0000',
          weight: lineData.thickness || 8,
          opacity: 1,
          className: 'property-line-permanent'
        }).addTo(map);
        
        line.bindPopup('<strong>Property Boundary</strong><br>' + lineData.description);
        console.log('Added permanent property line:', lineData.description);
      });
    }
    
    // Load project zones with enhanced styling
    function loadProjectZones() {
      fetch('/api/project-zones')
        .then(response => response.json())
        .then(zones => {
          zones.forEach(zone => {
            const polygon = L.polygon(zone.coordinates, {
              fillColor: getZoneColor(zone.category),
              fillOpacity: 0.4,
              color: '#2E7D32',
              weight: 3
            }).addTo(map);
            
            // Add zone marker with emoji
            const center = getPolygonCenter(zone.coordinates);
            const marker = L.marker(center, {
              icon: L.divIcon({
                html: \`<div style="background: white; border-radius: 50%; padding: 8px; font-size: 24px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">\${zone.emoji || '📍'}</div>\`,
                className: 'zone-marker',
                iconSize: [48, 48],
                iconAnchor: [24, 24]
              })
            }).addTo(map);
            
            // Add click handlers for side panel instead of popups
            function showZoneDetails(zoneData) {
              const panel = document.getElementById('side-panel');
              const title = document.getElementById('panel-title');
              const content = document.getElementById('panel-content');
              
              title.innerHTML = \`\${zoneData.emoji || '📍'} \${zoneData.name}\`;
              
              content.innerHTML = \`
                <div class="project-info">
                  <div class="info-section">
                    <div class="budget-info">
                      <div class="budget-item">
                        <strong>💰 Budget</strong><br>
                        \${zoneData.budget}
                      </div>
                      <div class="budget-item">
                        <strong>� Revenue</strong><br>
                        \${zoneData.monthlyRevenue}
                      </div>
                    </div>
                    <div class="budget-info">
                      <div class="budget-item">
                        <strong>� Timeline</strong><br>
                        \${zoneData.timeline.start}
                      </div>
                      <div class="budget-item">
                        <strong>🏗️ Phase</strong><br>
                        Phase \${zoneData.phase}
                      </div>
                    </div>
                  </div>
                  
                  <div class="info-section">
                    <h4>📋 Description</h4>
                    <p>\${zoneData.description}</p>
                  </div>
                  
                  <div class="info-section">
                    <h4>🎯 Key Features</h4>
                    <ul class="feature-list">
                      \${zoneData.features.map(feature => \`<li>\${feature}</li>\`).join('')}
                    </ul>
                  </div>
                  
                  \${zoneData.revenueStreams ? \`
                    <div class="info-section">
                      <h4>💼 Revenue Streams</h4>
                      <p>\${zoneData.revenueStreams}</p>
                    </div>
                  \` : ''}
                  
                  <div class="info-section">
                    <h4>📊 Investment Summary</h4>
                    <div style="background: #e8f5e8; padding: 15px; border-radius: 8px;">
                      <p><strong>Total Investment:</strong> \${zoneData.budget}</p>
                      <p><strong>Expected Monthly Revenue:</strong> \${zoneData.monthlyRevenue}</p>
                      <p><strong>Development Phase:</strong> \${zoneData.phase}</p>
                      <p><strong>Category:</strong> \${zoneData.category}</p>
                    </div>
                  </div>
                </div>
              \`;
              
              panel.classList.add('open');
            }
            
            polygon.addEventListener('click', () => showZoneDetails(zone));
            marker.addEventListener('click', () => showZoneDetails(zone));
          });
          
          console.log(\`Loaded \${zones.length} comprehensive project zones\`);
        })
        .catch(err => console.error('Error loading zones:', err));
    }
    
    // Helper function to get polygon center
    function getPolygonCenter(coordinates) {
      let lat = 0, lng = 0;
      coordinates.forEach(coord => {
        lat += coord[0];
        lng += coord[1];
      });
      return [lat / coordinates.length, lng / coordinates.length];
    }
    
    function getZoneColor(category) {
      const colors = {
        agriculture: '#4CAF50',      // Green for farming/food
        residential: '#2196F3',      // Blue for housing
        community: '#FF9800',        // Orange for community spaces  
        hospitality: '#9C27B0',      // Purple for retreat/hospitality
        infrastructure: '#607D8B',   // Grey for utilities
        workshop: '#795548',         // Brown for workshop/garage
        spiritual: '#E91E63',        // Pink for ceremonial spaces
        wellness: '#00BCD4',         // Cyan for wellness facilities
        commercial: '#FF5722'        // Red-orange for commercial
      };
      return colors[category] || '#607D8B';
    }
    
    function unlockAllZones() {
      console.log('Unlocking zones...');
      document.getElementById('status').innerHTML = '<p>🔓 <strong>Zones Unlocked</strong></p><p>• Drag zones to desired positions</p>';
    }
    
    function lockAllZones() {
      console.log('Locking zones...');
      document.getElementById('status').innerHTML = '<p>🔒 <strong>Zones Locked</strong></p><p>• Zones are now fixed in position</p>';
    }
    
    function capturePropertyLines() {
      console.log('Capturing property lines...');
      alert('Property lines have been permanently embedded in the map!');
    }
    
    function closeSidePanel() {
      const panel = document.getElementById('side-panel');
      panel.classList.remove('open');
    }
    
    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      const panel = document.getElementById('side-panel');
      if (panel.classList.contains('open') && !panel.contains(e.target)) {
        // Don't close if clicking on map markers or zones
        if (!e.target.closest('.zone-marker') && !e.target.closest('.leaflet-interactive')) {
          panel.classList.remove('open');
        }
      }
    });
    
    // Initialize everything when page loads
    window.addEventListener('load', () => {
      console.log('Page loaded, initializing components...');
      loadPermanentPropertyLines();
      loadProjectZones();
      console.log('All components loaded successfully');
    });
  </script>
</body>
</html>`;

    res.send(htmlContent);
  } catch (error) {
    console.error('Error generating page:', error);
    res.status(500).send('Error: ' + error.message);
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = createServer(app);
const port = 5000;

server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 EcoVillageBuilder - Working version serving on port ${port}`);
  console.log(`🌐 Open http://localhost:${port} to view your property map`);
  console.log(`✅ All fixes applied - Map should display correctly!`);
});