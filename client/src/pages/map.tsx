import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import MapContainer from "@/components/MapContainer";
import ProjectModal from "@/components/ProjectModal";
import ZoneLegend from "@/components/ZoneLegend";
import ProjectSummary from "@/components/ProjectSummary";
import MapControls from "@/components/MapControls";
import { ProjectZone } from "@shared/schema";
import { Button } from "@/components/ui/button";
import PhaseTimeline from "@/components/PhaseTimeline";
import LayerToggle from "@/components/LayerToggle";

export default function MapPage() {
  const [selectedZone, setSelectedZone] = useState<ProjectZone | null>(null);
  const [currentPhase, setCurrentPhase] = useState<'current' | 'future'>('current');
  const [activeLayer, setActiveLayer] = useState<string>('All');

  const { data: zones = [], isLoading } = useQuery<ProjectZone[]>({
    queryKey: ['/api/project-zones'],
  });

  const handleZoneClick = (zoneType: string) => {
    const zone = zones.find(z => z.type === zoneType);
    if (zone) {
      setSelectedZone(zone);
    }
  };

  const handlePhaseChange = (phase: 'current' | 'future') => {
    setCurrentPhase(phase);
  };

  const handleLayerToggle = (layer: string) => {
    setActiveLayer(layer);
  };

  // Example timeline data for PhaseTimeline
  const timeline = [
    { phase: 'foundation', label: 'Foundation', color: '#22C55E', status: 'Complete' },
    { phase: 'content', label: 'Content Integration', color: '#3B82F6', status: 'In Progress' },
    { phase: 'polish', label: 'Polish & Features', color: '#F59E0B', status: 'Not Started' },
  ];

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading interactive map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen relative">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-serif font-semibold text-foreground">
                Sulphur Mountain Eco-Village
              </h1>
              <span className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full font-medium">
                Interactive Development Map
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => handlePhaseChange(currentPhase === 'current' ? 'future' : 'current')}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-phase-toggle"
              >
                {currentPhase === 'current' ? 'Current Phase' : 'Future Vision'}
              </Button>
              <Button 
                variant="secondary"
                className="bg-accent text-accent-foreground hover:bg-accent/80"
                data-testid="button-investment-info"
              >
                Investment Info
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 h-screen relative">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 flex gap-4">
          <PhaseTimeline 
            currentPhase={currentPhase} 
            onPhaseChange={handlePhaseChange} 
            timeline={timeline}
          />
          <LayerToggle 
            phases={['All', 'Agricultural', 'Residence', 'Community', 'Retreat', 'Infrastructure']} 
            activePhase={activeLayer} 
            onToggle={handleLayerToggle}
          />
        </div>
        <MapContainer 
          zones={zones} 
          onZoneClick={handleZoneClick}
          currentPhase={currentPhase}
        />
        <MapControls />
        <ZoneLegend zones={zones} />
        <ProjectSummary />
      </main>

      {/* Project Detail Modal */}
      {selectedZone && (
        <ProjectModal 
          zone={selectedZone} 
          onClose={() => setSelectedZone(null)} 
        />
      )}
    </div>
  );
}
