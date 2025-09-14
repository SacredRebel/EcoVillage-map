import { ProjectZone } from '@shared/schema';

interface ZoneLegendProps {
  zones: ProjectZone[];
}

export default function ZoneLegend({ zones }: ZoneLegendProps) {
  const getZoneDescription = (type: string) => {
    const descriptions = {
      agricultural: '3-acre farming & nursery operations',
      residence: '7,200 sq ft luxury compound',
      community: 'Central kitchen & gathering spaces',
      retreat: '50 unique lodging units',
      infrastructure: 'Roads, utilities & solar systems'
    };
    return descriptions[type as keyof typeof descriptions] || '';
  };

  return (
    <div className="absolute top-6 right-6 z-40" data-testid="zone-legend">
      <div className="floating-panel bg-card rounded-lg p-4 w-72 shadow-lg">
        <h3 className="font-semibold text-lg mb-4">Development Zones</h3>
        <div className="space-y-3">
          {zones.map((zone) => (
            <div key={zone.id} className="flex items-center space-x-3">
              <div 
                className="zone-indicator w-5 h-5 rounded-full border-2 border-white shadow-md"
                style={{ backgroundColor: zone.color }}
              />
              <div>
                <div className="font-medium text-sm">{zone.name}</div>
                <div className="text-xs text-muted-foreground">
                  {getZoneDescription(zone.type)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
