// EcoVillageBuilder server with drag-and-drop zone placement
import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting EcoVillageBuilder server with drag-and-drop...');

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

// Update zone coordinates (for drag-and-drop)
app.put("/api/project-zones/:id/coordinates", async (req, res) => {
  try {
    const zoneIndex = mockProjectZones.findIndex(z => z.id === req.params.id);
    if (zoneIndex === -1) {
      res.status(404).json({ error: "Project zone not found" });
      return;
    }
    
    mockProjectZones[zoneIndex].coordinates = req.body.coordinates;
    console.log(`Updated ${mockProjectZones[zoneIndex].name} coordinates`);
    res.json(mockProjectZones[zoneIndex]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update zone coordinates" });
  }
});

// Property Lines Capture API
app.post("/api/capture-property-lines", async (req, res) => {
  try {
    const { lines, totalLines, propertyCenter } = req.body;
    
    console.log('🔍 CAPTURE API CALLED:');
    console.log(`Total lines: ${totalLines}`);
    console.log(`Property center: ${propertyCenter}`);
    
    if (!lines || !Array.isArray(lines) || lines.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: "No lines provided for capture" 
      });
    }
    
    // Generate embeddable code for permanent inclusion
    const embeddableCode = lines.map((line, index) => ({
      id: line.id,
      coordinates: line.coordinates,
      thickness: line.thickness,
      color: '#FF0000',
      description: line.description,
      permanent: true,
      created: new Date().toISOString()
    }));
    
    // Log detailed capture information
    console.log('📊 CAPTURED PROPERTY LINES SUMMARY:');
    console.log(`• Total lines captured: ${embeddableCode.length}`);
    console.log(`• Total coordinate points: ${embeddableCode.reduce((sum, line) => sum + line.coordinates.length, 0)}`);
    console.log(`• Line thickness range: ${Math.min(...embeddableCode.map(l => l.thickness))}px - ${Math.max(...embeddableCode.map(l => l.thickness))}px`);
    
    embeddableCode.forEach((line, index) => {
      console.log(`📏 Line ${index + 1}: ${line.coordinates.length} points, ${line.thickness}px thick`);
      console.log(`   ID: ${line.id}`);
      console.log(`   Start: [${line.coordinates[0][0].toFixed(6)}, ${line.coordinates[0][1].toFixed(6)}]`);
      console.log(`   End: [${line.coordinates[line.coordinates.length-1][0].toFixed(6)}, ${line.coordinates[line.coordinates.length-1][1].toFixed(6)}]`);
    });
    
    res.json({
      success: true,
      message: `Successfully captured ${embeddableCode.length} property lines for permanent embedding`,
      embeddableCode: embeddableCode,
      totalLines: embeddableCode.length,
      totalPoints: embeddableCode.reduce((sum, line) => sum + line.coordinates.length, 0),
      captureTime: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Capture API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to capture property lines" 
    });
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
        <title>EcoVillage Builder - Drag & Drop Zones</title>
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
          
          .drawing-controls {
            position: absolute; 
            bottom: 10px; 
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
          
          .draw-btn { 
            background: #8B0000; 
            color: white; 
          }
          
          .erase-btn { 
            background: #757575; 
            color: white; 
          }
          
          .unlock-btn:hover { background: #E64A19; }
          .lock-btn:hover { background: #45a049; }
          .draw-btn:hover { background: #A52A2A; }
          .erase-btn:hover { background: #616161; }
          
          .drag-status {
            margin-top: 10px;
            padding: 8px;
            border-radius: 4px;
            font-size: 0.9em;
          }
          
          .status-locked { background: #ffebee; color: #c62828; }
          .status-unlocked { background: #e8f5e8; color: #2e7d32; }
          .status-drawing { background: #fff3e0; color: #e65100; }
          
          .dragging { opacity: 0.6; }
          
          .drawing-mode { cursor: crosshair !important; }
          .drawing-mode * { cursor: crosshair !important; }
          
          #line-thickness {
            padding: 4px 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 0.9em;
          }
          
          #delete-selected-btn:disabled {
            background: #ccc !important;
            color: #999 !important;
            cursor: not-allowed !important;
          }
          
          #selection-info {
            border: 1px solid #ddd;
            animation: fadeIn 0.3s ease-in;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .line-hover { cursor: pointer !important; }
          .line-selected { filter: drop-shadow(0 0 3px #FF4500); }
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
          
          <div id="drag-status" class="drag-status status-locked">
            🔒 Zones Locked
          </div>
          
          <div style="margin-top: 10px; font-size: 0.85em; color: #666;">
            • Unlock to drag zones to exact positions<br>
            • Lock when satisfied with placement
          </div>
        </div>
        
        <div class="drawing-controls">
          <h4 style="margin: 0 0 15px 0;">📏 Property Lines</h4>
          
          <div style="margin-bottom: 10px;">
            <label style="font-size: 0.9em; color: #666;">Line Thickness:</label>
            <select id="line-thickness" style="margin-left: 5px; padding: 2px;">
              <option value="2">Thin (2px)</option>
              <option value="4" selected>Medium (4px)</option>
              <option value="6">Thick (6px)</option>
              <option value="8">Extra Thick (8px)</option>
            </select>
          </div>
          
          <button class="btn draw-btn" onclick="enableDrawMode()">
            ✏️ Draw Property Lines
          </button>
          
          <button class="btn unlock-btn" onclick="toggleLinesLock()">
            🔓 Unlock Lines
          </button>
          
          <button class="btn erase-btn" onclick="deleteSelectedLine()" disabled id="delete-selected-btn">
            🗑️ Delete Selected
          </button>
          
          <button class="btn erase-btn" onclick="clearPropertyLines()">
            🗑️ Clear All Lines
          </button>
          
          <button class="btn" onclick="capturePropertyLines()" style="background: #4CAF50; margin-top: 10px;">
            📋 Capture Lines for Permanent Embedding
          </button>
          
          <div id="draw-status" class="drag-status status-locked">
            📏 Click to draw lines (Target: 8 boundary lines)
          </div>
          
          <div id="lines-status" class="drag-status status-locked" style="margin-top: 5px;">
            🔒 Lines Locked
          </div>
          
          <div id="selection-info" style="margin: 10px 0; padding: 8px; background: #f0f0f0; border-radius: 4px; font-size: 0.85em; color: #666; display: none;">
            <strong>Selected:</strong> <span id="selected-line-info">None</span>
          </div>
          
          <div style="margin-top: 10px; font-size: 0.85em; color: #666;">
            • Choose thickness, then draw lines<br>
            • Double-click to finish each line<br>
            • Unlock and click lines to select them<br>
            • Use "Delete Selected" for precise removal<br>
            • Right-click for quick deletion
          </div>
          
          <div id="debug-info" style="margin-top: 10px; padding: 5px; background: #f9f9f9; border-radius: 3px; font-size: 0.8em; color: #555;">
            <strong>Debug:</strong> <span id="debug-text">Lines: 0, Selected: None</span><br>
            <button onclick="updateDebugInfo()" style="font-size: 0.7em; padding: 2px 5px;">Refresh Debug</button>
          </div>
        </div>
        
        <div class="info-panel">
          <h3>🏔️ Sulphur Mountain Eco-Village</h3>
          <p style="font-size: 0.9em; color: #666; margin: 5px 0;">📍 California • 34.433°N, 119.155°W</p>
          <div id="zones-info">Loading zones...</div>
        </div>
        
        <script>
          // Global variables
          let map;
          let zones = [];
          let zonePolygons = {};
          let isDragMode = false;
          let isDrawMode = false;
          let propertyLines = [];
          let currentDrawingPoints = [];
          let tempLine = null;
          let linesLocked = true;
          let selectedLine = null;
          
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
          
          // Add map click handler to deselect lines
          map.on('click', function(e) {
            if (!isDrawMode && !linesLocked && selectedLine) {
              // Only deselect if clicking on empty space (not on a line or zone)
              deselectLine();
            }
          });
          
          // Add keyboard shortcuts
          document.addEventListener('keydown', function(e) {
            console.log(\`Key pressed: \${e.key}, Selected line: \${selectedLine ? selectedLine._lineId : 'none'}, Lines locked: \${linesLocked}\`);
            
            // Delete key to delete selected line
            if (e.key === 'Delete' && selectedLine && !linesLocked) {
              console.log(\`Delete key pressed - calling deleteSelectedLine\`);
              deleteSelectedLine();
              e.preventDefault();
            }
            
            // Escape key to deselect
            if (e.key === 'Escape' && selectedLine) {
              console.log(\`Escape key pressed - deselecting line\`);
              deselectLine();
              e.preventDefault();
            }
          });
          
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
          
          // Drag and drop functions
          function enableDragMode() {
            // Disable draw mode first
            if (isDrawMode) disableDrawMode();
            
            isDragMode = true;
            document.getElementById('drag-status').innerHTML = '🔓 Drag Mode Active';
            document.getElementById('drag-status').className = 'drag-status status-unlocked';
            
            // Enable dragging on all polygons
            Object.values(zonePolygons).forEach(polygon => {
              polygon.dragging.enable();
            });
            
            console.log('🔓 Drag mode enabled - You can now reposition zones');
          }
          
          function lockAllZones() {
            // Disable draw mode first
            if (isDrawMode) disableDrawMode();
            
            isDragMode = false;
            document.getElementById('drag-status').innerHTML = '🔒 Zones Locked';
            document.getElementById('drag-status').className = 'drag-status status-locked';
            
            // Disable dragging and save positions
            Object.values(zonePolygons).forEach(polygon => {
              polygon.dragging.disable();
            });
            
            saveAllZonePositions();
            console.log('🔒 Zones locked and positions saved');
          }
          
          // Property line drawing functions
          function enableDrawMode() {
            // Disable drag mode first
            if (isDragMode) lockAllZones();
            
            isDrawMode = true;
            document.getElementById('draw-status').innerHTML = '✏️ Drawing Mode Active';
            document.getElementById('draw-status').className = 'drag-status status-drawing';
            document.body.classList.add('drawing-mode');
            
            // Add click handler for drawing
            map.on('click', onMapClickForDrawing);
            map.on('dblclick', finishCurrentLine);
            
            console.log('✏️ Drawing mode enabled - Click to draw property lines');
          }
          
          function disableDrawMode() {
            isDrawMode = false;
            document.getElementById('draw-status').innerHTML = '📏 Click to draw lines';
            document.getElementById('draw-status').className = 'drag-status status-locked';
            document.body.classList.remove('drawing-mode');
            
            // Remove drawing handlers
            map.off('click', onMapClickForDrawing);
            map.off('dblclick', finishCurrentLine);
            
            // Finish any current line
            if (currentDrawingPoints.length > 0) {
              finishCurrentLine();
            }
          }
          
          function onMapClickForDrawing(e) {
            if (!isDrawMode) return;
            
            currentDrawingPoints.push([e.latlng.lat, e.latlng.lng]);
            
            const thickness = parseInt(document.getElementById('line-thickness').value);
            
            if (currentDrawingPoints.length === 1) {
              // Start new line
              tempLine = L.polyline(currentDrawingPoints, {
                color: '#8B0000',
                weight: thickness,
                opacity: 0.8,
                dashArray: '5, 5'
              }).addTo(map);
            } else {
              // Update existing line
              tempLine.setLatLngs(currentDrawingPoints);
            }
            
            console.log(\`Added point \${currentDrawingPoints.length} to property line\`);
          }
          
          function finishCurrentLine() {
            if (currentDrawingPoints.length < 2) {
              // Need at least 2 points for a line
              if (tempLine) {
                map.removeLayer(tempLine);
                tempLine = null;
              }
              currentDrawingPoints = [];
              return;
            }
            
            const thickness = parseInt(document.getElementById('line-thickness').value);
            
            // Create permanent line
            const permanentLine = L.polyline(currentDrawingPoints, {
              color: '#8B0000',
              weight: thickness,
              opacity: 1,
              dashArray: null
            }).addTo(map);
            
            // Store line properties
            permanentLine._lineId = 'line_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
            permanentLine._thickness = thickness;
            permanentLine._locked = true;
            
            console.log(\`Created line with ID: \${permanentLine._lineId}, thickness: \${thickness}px\`);
            
            // Add interaction handlers
            setupLineInteractions(permanentLine);
            
            propertyLines.push(permanentLine);
            
            // Trigger auto-detection for 8 lines
            autoCheckForLines();
            
            // Clean up temp line
            if (tempLine) {
              map.removeLayer(tempLine);
              tempLine = null;
            }
            
            console.log(\`✅ Created property line with \${currentDrawingPoints.length} points (thickness: \${thickness}px) - Total lines: \${propertyLines.length}\`);
            currentDrawingPoints = [];
          }
          
          function setupLineInteractions(line) {
            // Left click for selection (when unlocked)
            line.on('click', function(e) {
              if (!linesLocked) {
                selectLine(line);
              }
              e.originalEvent.stopPropagation();
            });
            
            // Right click for quick deletion (when unlocked)
            line.on('contextmenu', function(e) {
              console.log(\`Right-clicked line \${line._lineId}, locked: \${linesLocked}\`);
              if (!linesLocked) {
                selectLine(line);
                const lineInfo = \`thickness: \${line._thickness}px, \${line.getLatLngs().length} points\`;
                console.log(\`Right-click delete confirmation: \${lineInfo}\`);
                if (confirm(\`Quick delete: Property line (\${lineInfo})?\`)) {
                  console.log(\`Right-click deletion confirmed\`);
                  deleteLine(line);
                } else {
                  console.log(\`Right-click deletion canceled\`);
                }
              }
              e.originalEvent.preventDefault();
              e.originalEvent.stopPropagation();
            });
            
            // Hover effects (when unlocked)
            line.on('mouseover', function() {
              if (!linesLocked) {
                line.setStyle({ opacity: 0.7 });
              }
            });
            
            line.on('mouseout', function() {
              if (!linesLocked) {
                line.setStyle({ opacity: 1 });
              }
            });
          }
          
          function selectLine(line) {
            console.log(\`Selecting line: \${line._lineId}\`);
            
            // Deselect previous line
            if (selectedLine) {
              selectedLine.setStyle({ 
                color: '#8B0000',
                opacity: 1,
                dashArray: null
              });
            }
            
            // Select new line
            selectedLine = line;
            selectedLine.setStyle({ 
              color: '#FF4500',
              opacity: 1,
              dashArray: '10, 5'
            });
            
            // Update UI
            document.getElementById('selection-info').style.display = 'block';
            document.getElementById('selected-line-info').textContent = 
              \`\${line._thickness}px thick, \${line.getLatLngs().length} points\`;
            document.getElementById('delete-selected-btn').disabled = false;
            
            console.log(\`📍 Selected line \${line._lineId} (thickness: \${line._thickness}px)\`);
            updateDebugInfo();
          }
          
          function updateDebugInfo() {
            const debugText = \`Lines: \${propertyLines.length}, Selected: \${selectedLine ? selectedLine._lineId : 'None'}\`;
            document.getElementById('debug-text').textContent = debugText;
            console.log(\`Debug update: \${debugText}\`);
            
            // List all lines
            console.log('All lines:', propertyLines.map(line => ({
              id: line._lineId,
              thickness: line._thickness,
              points: line.getLatLngs().length
            })));
          }
          
          function deselectLine() {
            if (selectedLine) {
              selectedLine.setStyle({ 
                color: '#8B0000',
                opacity: 1,
                dashArray: null
              });
              selectedLine = null;
            }
            
            // Update UI
            document.getElementById('selection-info').style.display = 'none';
            document.getElementById('delete-selected-btn').disabled = true;
            
            console.log('📍 Line deselected');
            updateDebugInfo();
          }
          
          function deleteSelectedLine() {
            console.log(\`Delete button clicked. Selected line:\`, selectedLine);
            
            if (!selectedLine) {
              alert('No line selected. Click a line first to select it.');
              return;
            }
            
            const lineInfo = \`thickness: \${selectedLine._thickness}px, \${selectedLine.getLatLngs().length} points\`;
            console.log(\`Showing confirmation for line: \${lineInfo}\`);
            
            if (confirm(\`Delete selected property line (\${lineInfo})?\`)) {
              console.log(\`User confirmed deletion\`);
              deleteLine(selectedLine);
            } else {
              console.log(\`User canceled deletion\`);
            }
          }
          
          function deleteLine(line) {
            console.log(\`Attempting to delete line \${line._lineId}\`);
            console.log(\`Lines before deletion: \${propertyLines.length}\`);
            
            // Remove from map
            try {
              map.removeLayer(line);
              console.log(\`✅ Removed line from map\`);
            } catch (error) {
              console.error(\`❌ Error removing from map:\`, error);
            }
            
            // Remove from array
            const initialLength = propertyLines.length;
            propertyLines = propertyLines.filter(l => l !== line);
            console.log(\`Lines after deletion: \${propertyLines.length} (removed \${initialLength - propertyLines.length})\`);
            
            // If this was the selected line, deselect
            if (selectedLine === line) {
              selectedLine = null;
              document.getElementById('selection-info').style.display = 'none';
              document.getElementById('delete-selected-btn').disabled = true;
            }
            
            console.log(\`🗑️ Successfully deleted line \${line._lineId} (thickness: \${line._thickness}px)\`);
          }
          
          function toggleLinesLock() {
            linesLocked = !linesLocked;
            
            const button = event.target;
            const statusEl = document.getElementById('lines-status');
            
            if (linesLocked) {
              button.innerHTML = '🔓 Unlock Lines';
              button.className = 'btn unlock-btn';
              statusEl.innerHTML = '🔒 Lines Locked';
              statusEl.className = 'drag-status status-locked';
              
              // Deselect any selected line
              deselectLine();
              
              // Update all lines to locked state
              propertyLines.forEach(line => {
                line._locked = true;
                line.setStyle({ 
                  color: '#8B0000',
                  opacity: 1,
                  dashArray: null
                });
              });
              
              console.log('🔒 All property lines locked');
            } else {
              button.innerHTML = '🔒 Lock Lines';
              button.className = 'btn lock-btn';
              statusEl.innerHTML = '🔓 Lines Unlocked - Click to select';
              statusEl.className = 'drag-status status-unlocked';
              
              // Update all lines to unlocked state
              propertyLines.forEach(line => {
                line._locked = false;
              });
              
              console.log('🔓 Property lines unlocked - Click lines to select them');
            }
          }
          
          function clearPropertyLines() {
            if (propertyLines.length === 0) {
              alert('No property lines to clear');
              return;
            }
            
            const lineDetails = propertyLines.map(line => 
              \`• \${line._thickness}px thick line with \${line.getLatLngs().length} points\`
            ).join('\\n');
            
            if (confirm(\`Clear all \${propertyLines.length} property lines?\\n\\n\${lineDetails}\`)) {
              propertyLines.forEach(line => map.removeLayer(line));
              propertyLines = [];
              
              // Also clear any temp line
              if (tempLine) {
                map.removeLayer(tempLine);
                tempLine = null;
                currentDrawingPoints = [];
              }
              
              console.log('🗑️ All property lines cleared');
            }
          }
          
          // AUTOMATIC PROPERTY LINE CAPTURE SYSTEM
          function capturePropertyLines() {
            if (propertyLines.length === 0) {
              alert('⚠️ No property lines found!\\n\\nPlease draw your 8 boundary lines first.');
              return;
            }
            
            console.log(\`🔍 CAPTURING \${propertyLines.length} PROPERTY LINES...\`);
            
            // Prepare detailed line data for permanent embedding
            const lineData = propertyLines.map((line, index) => {
              const coords = line.getLatLngs().map(latlng => [latlng.lat, latlng.lng]);
              const thickness = line._thickness || 8;
              
              console.log(\`📏 Line \${index + 1}: \${coords.length} points, \${thickness}px thick\`);
              console.log(\`   Start: [\${coords[0][0].toFixed(6)}, \${coords[0][1].toFixed(6)}]\`);
              console.log(\`   End: [\${coords[coords.length-1][0].toFixed(6)}, \${coords[coords.length-1][1].toFixed(6)}]\`);
              
              return {
                id: \`boundary_line_\${index + 1}\`,
                coordinates: coords,
                thickness: thickness,
                type: 'property_boundary',
                description: \`Property boundary line \${index + 1} - \${thickness}px thick\`,
                color: '#FF0000',
                permanent: true
              };
            });
            
            console.log('🎯 COMPLETE LINE DATA FOR EMBEDDING:');
            console.log(JSON.stringify(lineData, null, 2));
            
            // Send to server for permanent embedding
            fetch('/api/capture-property-lines', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                lines: lineData,
                totalLines: propertyLines.length,
                propertyCenter: [34.433086, -119.155336]
              })
            })
            .then(response => response.json())
            .then(result => {
              if (result.success) {
                console.log('✅ LINES SUCCESSFULLY CAPTURED!');
                console.log('📋 Embeddable Code Generated:');
                console.log(result.embeddableCode);
                
                // Store captured data globally
                window.capturedPropertyLines = result.embeddableCode;
                
                alert(
                  \`✅ SUCCESS! \\n\\n\` +
                  \`Captured \${lineData.length} property boundary lines\\n\` +
                  \`Total coordinates: \${lineData.reduce((sum, line) => sum + line.coordinates.length, 0)}\\n\\n\` +
                  \`Lines are now ready for permanent embedding!\\n\` +
                  \`Check browser console for coordinate details.\`
                );
                
                // Highlight captured lines
                propertyLines.forEach(line => {
                  line.setStyle({ color: '#00FF00', weight: line._thickness + 2 });
                });
                
              } else {
                console.error('❌ Capture failed:', result);
                alert('❌ Failed to capture property lines. Please try again.');
              }
            })
            .catch(err => {
              console.error('❌ Capture error:', err);
              alert('❌ Error capturing property lines. Check console for details.');
            });
          }
          
          // Auto-detect lines when they reach 8 (target count)
          function autoCheckForLines() {
            if (propertyLines.length === 8) {
              console.log('🎯 Detected 8 property lines - ready for capture!');
              
              setTimeout(() => {
                if (confirm(
                  \`🎯 AUTOMATIC DETECTION\\n\\n\` +
                  \`Found 8 property boundary lines!\\n\` +
                  \`This matches your target count.\\n\\n\` +
                  \`Would you like to capture these lines now\\n\` +
                  \`for permanent embedding?\`
                )) {
                  capturePropertyLines();
                }
              }, 1000);
            }
          }
          
          // Load existing property lines for editing
          function loadExistingPropertyLines() {
            console.log('📏 Loading existing property boundary lines for editing...');
            
            // Your 10 captured property boundary lines
            const existingLines = [
              {
                id: 'boundary_line_1',
                coordinates: [[34.433576, -119.156878], [34.433578, -119.155856], [34.433580, -119.154834]],
                thickness: 8
              },
              {
                id: 'boundary_line_2', 
                coordinates: [[34.433585, -119.154840], [34.433215, -119.154843], [34.432846, -119.154845]],
                thickness: 8
              },
              {
                id: 'boundary_line_3',
                coordinates: [[34.432855, -119.154845], [34.432857, -119.154885], [34.432859, -119.154925]],
                thickness: 8
              },
              {
                id: 'boundary_line_4',
                coordinates: [[34.432855, -119.154920], [34.432370, -119.154912], [34.432185, -119.154908], [34.431886, -119.154904]],
                thickness: 8
              },
              {
                id: 'boundary_line_5',
                coordinates: [[34.431886, -119.154893], [34.431890, -119.155854], [34.431894, -119.156814]], 
                thickness: 8
              },
              {
                id: 'boundary_line_6',
                coordinates: [[34.431899, -119.156808], [34.432000, -119.156816], [34.432102, -119.156824]],
                thickness: 8
              },
              {
                id: 'boundary_line_7', 
                coordinates: [[34.432102, -119.156824], [34.432160, -119.157278], [34.432217, -119.157731]],
                thickness: 8
              },
              {
                id: 'boundary_line_8',
                coordinates: [[34.432222, -119.157726], [34.432293, -119.157742], [34.432363, -119.157758]],
                thickness: 8
              },
              {
                id: 'boundary_line_9',
                coordinates: [[34.432368, -119.157758], [34.432470, -119.157326], [34.432571, -119.156894]],
                thickness: 8
              },
              {
                id: 'boundary_line_10',
                coordinates: [[34.432576, -119.156899], [34.433078, -119.156889], [34.433580, -119.156878]],
                thickness: 8
              }
            ];
            
            // Create lines on the map
            existingLines.forEach((lineData, index) => {
              const line = L.polyline(lineData.coordinates, {
                color: '#FF0000',
                weight: lineData.thickness,
                opacity: 0.8
              }).addTo(map);
              
              // Store line properties
              line._lineId = lineData.id;
              line._thickness = lineData.thickness;
              line._locked = true;
              
              // Add interaction handlers
              setupLineInteractions(line);
              
              propertyLines.push(line);
              
              console.log(\`✅ Loaded \${lineData.id}: \${lineData.coordinates.length} points, \${lineData.thickness}px\`);
            });
            
            console.log(\`🎯 Loaded \${existingLines.length} property boundary lines for editing\`);
            console.log('🔓 Click "Unlock Lines" to select and edit individual lines');
            
            // Update the status
            document.getElementById('draw-status').textContent = 
              \`📏 Loaded \${existingLines.length} property lines - Unlock to edit\`;
          }
          
          function saveAllZonePositions() {
            zones.forEach(zone => {
              if (zonePolygons[zone.id]) {
                const polygon = zonePolygons[zone.id];
                const center = polygon.getLatLng();
                const offset = 0.0001; // Very small offset for rectangle compatibility
                const newCoords = [
                  [center.lat - offset, center.lng - offset],
                  [center.lat + offset, center.lng - offset], 
                  [center.lat + offset, center.lng + offset],
                  [center.lat - offset, center.lng + offset]
                ];
                
                // Update zone coordinates via API
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
                
                // Calculate center point from coordinates
                const centerLat = zone.coordinates.reduce((sum, coord) => sum + coord[0], 0) / zone.coordinates.length;
                const centerLng = zone.coordinates.reduce((sum, coord) => sum + coord[1], 0) / zone.coordinates.length;
                
                // Create small circular zone (radius ~15 meters at this zoom level)
                const polygon = L.circle([centerLat, centerLng], {
                  radius: 15,
                  color: colors[zone.category] || '#666',
                  fillColor: colors[zone.category] || '#666',
                  fillOpacity: 0.4,
                  weight: 2
                }).addTo(map);
                
                // Enable dragging
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
                
                // Store polygon reference
                zonePolygons[zone.id] = polygon;
                
                // Drag functionality
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
                  
                  // Move circle to new position
                  polygon.setLatLng(e.latlng);
                  
                  // Update marker position
                  if (polygon.marker) {
                    polygon.marker.setLatLng(e.latlng);
                  }
                }
                
                function endDrag(e) {
                  if (!isDragging) return;
                  
                  isDragging = false;
                  polygon.setStyle({ fillOpacity: 0.4, weight: 2 });
                  
                  // Update zone center coordinates (convert to small rectangle for API compatibility)
                  const center = polygon.getLatLng();
                  const offset = 0.0001; // Very small offset for rectangle
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
                
                // Add emoji marker at circle center
                const center = polygon.getLatLng();
                const marker = L.marker(center, {
                  icon: L.divIcon({
                    html: \`<div style="text-align: center; line-height: 24px; font-size: 16px;">\${emojis[zone.category] || '📍'}</div>\`,
                    className: 'emoji-marker',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                  })
                }).addTo(map);
                
                polygon.marker = marker;
                
                // Click handler for zone info
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
              
              console.log('🗺️ Map loaded with', zones.length, 'draggable zones');
              console.log('🔒 Zones are locked by default - click "Unlock" to reposition');
              
              // Auto-load existing property boundary lines for editing
              loadExistingPropertyLines();
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
  console.log(`🚀 EcoVillageBuilder with drag-and-drop serving on port ${port}`);
  console.log(`🌐 Open http://localhost:${port} to position your zones`);
  console.log(`🎯 Click "Unlock All Zones" to drag zones to exact positions`);
  console.log(`🔒 Click "Lock All Zones" to save positions when satisfied`);
});