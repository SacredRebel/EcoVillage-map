import React from 'react';

interface InvestmentOverlayProps {
  revenue: string;
  investment: string;
}

export default function InvestmentOverlay({ revenue, investment }: InvestmentOverlayProps) {
  return (
    <div className="absolute top-4 right-4 z-50 bg-primary/90 text-primary-foreground rounded-lg px-4 py-2 shadow-lg">
      <div className="font-bold text-lg">Revenue: {revenue}</div>
      <div className="text-sm">Investment: {investment}</div>
    </div>
  );
}
