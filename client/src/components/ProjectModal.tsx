import { ProjectZone } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Check } from 'lucide-react';
import ImageGallery from '@/components/ImageGallery';
import ProgressTracker from '@/components/ProgressTracker';
import InvestmentOverlay from '@/components/InvestmentOverlay';

interface ProjectModalProps {
  zone: ProjectZone;
  onClose: () => void;
}

export default function ProjectModal({ zone, onClose }: ProjectModalProps) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Use imageUrl as the only image for now (schema does not have images array)
  const images = [zone.imageUrl];
  // Placeholder: In real app, progress would be dynamic
  const progress = zone.status === 'Complete' ? 100 : zone.status === 'In Progress' ? 60 : 10;

  return (
    <div 
      className="fixed inset-0 z-50 fade-in"
      onClick={handleBackdropClick}
      data-testid="project-modal"
    >
      <div className="modal-backdrop absolute inset-0 bg-black/50" />
      <div className="absolute inset-y-0 right-0 w-full max-w-2xl bg-card shadow-2xl slide-in">
        <div className="h-full flex flex-col relative">
          {/* Investment Overlay */}
          <InvestmentOverlay revenue={zone.monthlyRevenue} investment={zone.investment} />
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-2xl font-serif font-semibold" data-testid="text-modal-title">
              {zone.name}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80"
              data-testid="button-close-modal"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Image Gallery */}
            <ImageGallery images={images} />

            {/* Project Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-accent rounded-lg">
                <div className="text-xl font-bold text-accent-foreground" data-testid="text-budget">
                  {zone.budget}
                </div>
                <div className="text-sm text-muted-foreground">Budget</div>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-xl font-bold text-primary" data-testid="text-timeline">
                  {zone.timeline}
                </div>
                <div className="text-sm text-muted-foreground">Timeline</div>
              </div>
              <div className="text-center p-4 bg-orange-500/10 rounded-lg">
                <div className="text-xl font-bold text-orange-600" data-testid="text-revenue">
                  {zone.monthlyRevenue}
                </div>
                <div className="text-sm text-muted-foreground">Monthly Revenue</div>
              </div>
            </div>

            {/* Progress Tracker */}
            <ProgressTracker status={zone.status} progress={progress} />

            {/* Project Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Project Description</h3>
              <p className="text-muted-foreground leading-relaxed" data-testid="text-description">
                {zone.description}
              </p>
            </div>

            {/* Key Features */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Key Features</h3>
              <ul className="space-y-2" data-testid="list-features">
                {(zone.features as string[]).map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Investment Opportunity */}
            <div className="bg-primary/5 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-2 text-primary">Investment Opportunity</h3>
              <p className="text-sm text-muted-foreground mb-3" data-testid="text-investment">
                {zone.investment}
              </p>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-partnership-info"
              >
                Request Partnership Info
              </Button>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge 
                variant="secondary" 
                className="bg-orange-500/20 text-orange-700"
                data-testid="badge-status"
              >
                {zone.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
