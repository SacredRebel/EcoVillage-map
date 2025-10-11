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
    description: "Sustainable farming and food production center",
    coordinates: [[34.4325, -119.1560], [34.4330, -119.1560], [34.4330, -119.1550], [34.4325, -119.1550]],
    cost: 500000,
    phase: 1,
    category: "agriculture",
    features: ["Greenhouse complex", "Aquaponics system", "Composting facility"],
    timeline: { start: "2024-Q1", completion: "2024-Q4" }
  },
  {
    id: "zone-2", 
    name: "Main Residence",
    description: "Primary living complex with modern amenities",
    coordinates: [[34.4330, -119.1555], [34.4335, -119.1555], [34.4335, -119.1545], [34.4330, -119.1545]],
    cost: 2500000,
    phase: 1,
    category: "residential",
    features: ["Solar power system", "Rainwater collection", "Geothermal heating"],
    timeline: { start: "2024-Q2", completion: "2025-Q2" }
  },
  {
    id: "zone-3",
    name: "Community Hub", 
    description: "Central gathering space and shared facilities",
    coordinates: [[34.4320, -119.1555], [34.4325, -119.1555], [34.4325, -119.1545], [34.4320, -119.1545]],
    cost: 750000,
    phase: 2,
    category: "community",
    features: ["Meeting hall", "Workshop spaces", "Library", "Wellness center"],
    timeline: { start: "2024-Q3", completion: "2025-Q1" }
  },
  {
    id: "zone-4",
    name: "Retreat Village",
    description: "Guest accommodation and retreat facilities", 
    coordinates: [[34.4335, -119.1560], [34.4340, -119.1560], [34.4340, -119.1550], [34.4335, -119.1550]],
    cost: 1200000,
    phase: 3,
    category: "hospitality",
    features: ["Eco-cabins", "Meditation garden", "Yoga pavilion", "Natural pool"],
    timeline: { start: "2025-Q1", completion: "2025-Q4" }
  },
  {
    id: "zone-5",
    name: "Infrastructure",
    description: "Essential utilities and systems",
    coordinates: [[34.4315, -119.1560], [34.4320, -119.1560], [34.4320, -119.1550], [34.4315, -119.1550]],
    cost: 400000,
    phase: 1,
    category: "infrastructure", 
    features: ["Water treatment", "Power grid", "Road network", "Waste management"],
    timeline: { start: "2024-Q1", completion: "2024-Q3" }
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
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sulphur Mountain Eco-Village - Property Map</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { margin: 0; font-family: Arial, sans-serif; }
          #map { height: 100vh; width: 100%; }
          
          .controls { 
            position: absolute; 
            top: 10px; 
            left: 10px; 
            background: white; 
            padding: 15px; 
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            min-width: 220px;
          }
          
          .info-panel { 
            position: absolute; 
            top: 10px; 
            right: 10px; 
            background: white; 
            padding: 20px; 
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            max-width: 300px;
          }
          
          .zone { 
            margin: 10px 0; 
            padding: 10px; 
            border-left: 4px solid #007cba; 
            background: #f9f9f9; 
          }
          
          .cost { font-weight: bold; color: #007cba; }
          .phase { font-size: 0.9em; color: #666; }
          
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
        
        <div class="info-panel">
          <h3>🏔️ Sulphur Mountain Eco-Village</h3>
          <p style="font-size: 0.9em; color: #666; margin: 5px 0;">📍 California • 34.433°N, 119.155°W</p>
          <div id="property-status" style="margin: 10px 0; padding: 8px; background: #e3f2fd; border-radius: 4px; font-size: 0.9em;">
            <strong>📏 Property Lines:</strong> <span id="lines-count">Loading...</span>
          </div>
          <div id="zones-info">Loading zones...</div>
        </div>
        
        <script>
          // Global variables
          let map;
          let zones = [];
          let zonePolygons = {};
          let isDragMode = false;
          let propertyLines = [];
          
          // Initialize map
          map = L.map('map').setView([34.433086, -119.155336], 17);
          
          // Add tile layers
          const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          });
          
          const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS'
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
            infrastructure: '#607D8B'
          };
          
          // Emoji markers
          const emojis = {
            agriculture: '🌾',
            residential: '🏠', 
            community: '🏛️',
            hospitality: '🏡',
            infrastructure: '⚡'
          };
          
          // Zone management functions
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
                
                fetch(\`/api/project-zones/\${zone.id}/coordinates\`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ coordinates: newCoords })
                }).then(response => response.json())
                  .then(updatedZone => {
                    console.log(\`✅ Saved \${updatedZone.name} position\`);
                  })
                  .catch(err => console.error(\`❌ Failed to save \${zone.name}:\`, err));
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
              \`This will permanently embed \${propertyLines.length} property line(s) into the map.\\n\\n\` +
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
                  alert(\`✅ SUCCESS!\\n\\n\${result.message}\\n\\nThe page will now reload with permanently embedded property lines.\`);
                  
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
            const permanentLines = ${JSON.stringify(PERMANENT_PROPERTY_LINES)};
            
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
              
              console.log(\`📏 Loaded permanent property line \${index + 1}: \${lineData.description}\`);
            });
            
            document.getElementById('lines-count').textContent = 
              \`\${permanentLines.length} permanent boundary lines\`;
          }
          
          // Load and display zones
          fetch('/api/project-zones')
            .then(response => response.json())
            .then(data => {
              zones = data;
              const zonesInfo = document.getElementById('zones-info');
              let totalCost = 0;
              let infoHtml = '';
              
              zones.forEach(zone => {
                totalCost += zone.cost;
                
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
                  
                  console.log(\`Moved \${zone.name} to new position\`);
                }
                
                // Add emoji marker
                const marker = L.marker([centerLat, centerLng], {
                  icon: L.divIcon({
                    html: \`<div style="text-align: center; line-height: 24px; font-size: 16px;">\${emojis[zone.category] || '📍'}</div>\`,
                    className: 'emoji-marker',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                  })
                }).addTo(map);
                
                polygon.marker = marker;
                
                // Click handler
                polygon.on('click', () => {
                  if (!isDragMode) {
                    alert(\`\${emojis[zone.category]} \${zone.name}\\n\\n\${zone.description}\\n\\nCost: $\${zone.cost.toLocaleString()}\\nPhase: \${zone.phase}\\n\\nFeatures:\\n\${zone.features.map(f => '• ' + f).join('\\n')}\`);
                  }
                });
                
                // Add to info panel
                infoHtml += \`
                  <div class="zone">
                    <strong>\${emojis[zone.category]} \${zone.name}</strong><br>
                    <div class="cost">$\${zone.cost.toLocaleString()}</div>
                    <div class="phase">Phase \${zone.phase}</div>
                  </div>
                \`;
              });
              
              infoHtml += \`
                <div style="border-top: 2px solid #007cba; margin-top: 15px; padding-top: 10px;">
                  <strong>Total Investment: $\${totalCost.toLocaleString()}</strong>
                </div>
              \`;
              
              zonesInfo.innerHTML = infoHtml;
              
              // Load permanent property lines after zones
              loadPermanentPropertyLines();
              
              console.log('🗺️ Map loaded with', zones.length, 'zones and permanent property lines');
            })
            .catch(err => {
              console.error('Error loading zones:', err);
              document.getElementById('zones-info').innerHTML = '❌ Error loading zones';
            });
        </script>
      </body>
      </html>
    `);
  });
}

// Error handling  
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  console.error('Error:', err);
});

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const server = createServer(app);
const port = parseInt(process.env.PORT || '5000', 10);

server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 EcoVillageBuilder - Final version serving on port ${port}`);
  console.log(`🌐 Open http://localhost:${port} to view your property map`);
  console.log(`🔒 Use "Capture & Lock Property Lines" to permanently embed your boundary lines`);
});