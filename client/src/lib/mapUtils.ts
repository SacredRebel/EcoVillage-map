export const defaultMapCenter: [number, number] = [34.4708, -119.2979];
export const defaultZoom = 17;

export const propertyBounds = [
  [34.4715, -119.2985],
  [34.4715, -119.2970],
  [34.4700, -119.2970], 
  [34.4700, -119.2985]
] as const;

export const zoneColors = {
  agricultural: '#22C55E',
  residence: '#3B82F6',
  community: '#F59E0B',
  retreat: '#8B5CF6',
  infrastructure: '#6B7280'
} as const;

export const zoneIcons = {
  residence: '🏠',
  retreat: '🏭',
  agricultural: '🌱',
  community: '🍽️',
  infrastructure: '⚡'
} as const;
