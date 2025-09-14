import { Button } from '@/components/ui/button';
import { Plus, Minus, RotateCcw } from 'lucide-react';

export default function MapControls() {
  const handleZoomIn = () => {
    const map = (window as any).mapInstance;
    if (map) map.zoomIn();
  };

  const handleZoomOut = () => {
    const map = (window as any).mapInstance;
    if (map) map.zoomOut();
  };

  const handleResetView = () => {
    const map = (window as any).mapInstance;
    if (map) map.setView([34.4708, -119.2979], 17);
  };

  return (
    <div className="absolute top-6 left-6 z-40 space-y-4" data-testid="map-controls">
      {/* Zoom Controls */}
      <div className="floating-panel bg-card rounded-lg p-2 shadow-lg">
        <Button
          size="icon"
          onClick={handleZoomIn}
          className="w-10 h-10 bg-primary text-primary-foreground rounded-lg mb-2 hover:bg-primary/90"
          data-testid="button-zoom-in"
        >
          <Plus className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          onClick={handleZoomOut}
          className="w-10 h-10 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80"
          data-testid="button-zoom-out"
        >
          <Minus className="h-5 w-5" />
        </Button>
      </div>

      {/* Reset View */}
      <div className="floating-panel bg-card rounded-lg p-2 shadow-lg">
        <Button
          size="icon"
          onClick={handleResetView}
          className="w-10 h-10 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80"
          data-testid="button-reset-view"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
