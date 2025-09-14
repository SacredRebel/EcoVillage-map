import { Button } from '@/components/ui/button';

export default function ProjectSummary() {
  return (
    <div className="absolute bottom-6 left-6 z-40" data-testid="project-summary">
      <div className="floating-panel bg-card rounded-lg p-6 w-80 shadow-lg">
        <h3 className="font-serif text-xl font-semibold mb-4">Project Overview</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-primary/5 rounded-lg">
            <div className="text-2xl font-bold text-primary" data-testid="text-projected-arv">
              $6.9M
            </div>
            <div className="text-sm text-muted-foreground">Projected ARV</div>
          </div>
          <div className="text-center p-3 bg-accent rounded-lg">
            <div className="text-2xl font-bold text-accent-foreground" data-testid="text-total-acres">
              9.47
            </div>
            <div className="text-sm text-muted-foreground">Acres</div>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Current Appraisal:</span>
            <span className="font-medium" data-testid="text-current-appraisal">$2.3M</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Investment:</span>
            <span className="font-medium" data-testid="text-total-investment">$3M+</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Timeline:</span>
            <span className="font-medium" data-testid="text-project-timeline">18-24 months</span>
          </div>
        </div>
        <Button 
          className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
          data-testid="button-investment-details"
        >
          View Investment Details
        </Button>
      </div>
    </div>
  );
}
