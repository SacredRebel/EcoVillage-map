import React from 'react';

interface LayerToggleProps {
  phases: string[];
  activePhase: string;
  onToggle: (phase: string) => void;
}

export default function LayerToggle({ phases, activePhase, onToggle }: LayerToggleProps) {
  return (
    <div className="floating-panel bg-card rounded-lg p-2 shadow-lg flex gap-2">
      {phases.map(phase => (
        <button
          key={phase}
          className={`px-3 py-1 rounded-full text-sm font-medium ${activePhase === phase ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          onClick={() => onToggle(phase)}
        >
          {phase}
        </button>
      ))}
    </div>
  );
}
