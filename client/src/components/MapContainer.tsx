import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ProjectZone } from '@shared/schema';

interface MapContainerProps {
  zones: ProjectZone[];
  onZoneClick: (zoneType: string) => void;
  currentPhase: 'current' | 'future';
}

export default function MapContainer({ zones, onZoneClick, currentPhase }: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const zonesLayerRef = useRef<L.LayerGroup | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [34.4708, -119.2979],
      zoom: 17,
      minZoom: 15,
      maxZoom: 20,
      zoomControl: false
    });

    mapInstanceRef.current = map;

    // Add satellite imagery
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Sulphur Mountain Eco-Village Development Map'
    }).addTo(map);

    // Create property boundary
    const propertyBounds: L.LatLngExpression[] = [
      [34.4715, -119.2985],
      [34.4715, -119.2970],
      [34.4700, -119.2970], 
      [34.4700, -119.2985]
    ];

    L.polygon(propertyBounds, {
      color: '#dc2626',
      weight: 3,
      fillOpacity: 0.1,
      fillColor: '#dc2626'
    }).addTo(map);

    // Initialize layer groups
    zonesLayerRef.current = L.layerGroup().addTo(map);
    markersLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !zonesLayerRef.current || !markersLayerRef.current) return;

    // Clear existing layers
    zonesLayerRef.current.clearLayers();
    markersLayerRef.current.clearLayers();

    zones.forEach(zone => {
      if (!zonesLayerRef.current || !markersLayerRef.current) return;

      // Create zone polygon or polyline based on type
      let zoneLayer;
      if (zone.type === 'infrastructure') {
        // Infrastructure is a line across the property
        zoneLayer = L.polyline(zone.coordinates as L.LatLngExpression[], {
          color: zone.color,
          weight: 4,
          opacity: 0.7,
          className: 'zone-overlay cursor-pointer transition-all duration-300 hover:brightness-110'
        });
      } else {
        // Other zones are polygons
        zoneLayer = L.polygon(zone.coordinates as L.LatLngExpression[], {
          color: zone.color,
          weight: 2,
          fillOpacity: 0.3,
          fillColor: zone.color,
          className: 'zone-overlay cursor-pointer transition-all duration-300 hover:brightness-110'
        });
      }

      zoneLayer.on('click', () => onZoneClick(zone.type));
      zonesLayerRef.current.addLayer(zoneLayer);

      // Add markers for major structures
      const markerIcons = {
        residence: '🏠',
        retreat: '🏭',
        agricultural: '🌱',
        community: '🍽️',
        infrastructure: '⚡'
      };

      const icon = markerIcons[zone.type as keyof typeof markerIcons] || '📍';
      
      // Calculate center point for marker
      let center: L.LatLng;
      if (zone.type === 'infrastructure') {
        const coords = zone.coordinates as number[][];
        const midPoint = coords[Math.floor(coords.length / 2)];
        center = L.latLng(midPoint[0], midPoint[1]);
      } else {
        center = L.polygon(zone.coordinates as L.LatLngExpression[]).getBounds().getCenter();
      }

      const markerIcon = L.divIcon({
        html: `<div class="w-8 h-8 border-2 border-white rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-xs" style="background-color: ${zone.color};">${icon}</div>`,
        iconSize: [32, 32],
        className: 'custom-marker'
      });

      const marker = L.marker(center, { icon: markerIcon });
      marker.on('click', () => onZoneClick(zone.type));
      markersLayerRef.current.addLayer(marker);
    });
  }, [zones, onZoneClick, currentPhase]);

  // Expose map controls to global scope for MapControls component
  useEffect(() => {
    if (mapInstanceRef.current) {
      (window as any).mapInstance = mapInstanceRef.current;
    }
  }, []);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full relative"
      data-testid="map-container"
    />
  );
}
