import React from 'react';

interface PhaseTimelineProps {
  currentPhase: 'current' | 'future';
  onPhaseChange: (phase: 'current' | 'future') => void;
  timeline: { phase: string; label: string; color: string; status: string; }[];
}

export default function PhaseTimeline({ currentPhase, onPhaseChange, timeline }: PhaseTimelineProps) {
  return (
    <div className="floating-panel bg-card rounded-lg p-4 shadow-lg flex flex-col gap-4 w-80">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-serif text-lg font-semibold">Development Timeline</h3>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium ${currentPhase === 'current' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            onClick={() => onPhaseChange('current')}
          >
            Current
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium ${currentPhase === 'future' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            onClick={() => onPhaseChange('future')}
          >
            Future
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {timeline.map((item, idx) => (
          <div key={item.phase} className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
            <span className="font-medium text-sm">{item.label}</span>
            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${item.status === 'Complete' ? 'bg-green-200 text-green-800' : item.status === 'In Progress' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-800'}`}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
