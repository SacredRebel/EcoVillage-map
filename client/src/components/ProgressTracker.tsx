import React from 'react';

interface ProgressTrackerProps {
  status: string;
  progress: number; // 0-100
}

export default function ProgressTracker({ status, progress }: ProgressTrackerProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">Status: {status}</span>
        <span className="text-xs text-muted-foreground">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
