import React from 'react';
import { Filter } from 'lucide-react';

export default function AnalyticsFunnel() {
  const steps = [
    { label: 'Pitch Deck', value: 100, desc: 'Top of funnel views' },
    { label: 'Financial Model', value: 40, desc: 'Engaged with financials' },
    { label: 'Tech Architecture Spec', value: 12.5, desc: 'Deep technical diligence' },
  ];
  return (
    <div className="bg-surface-1 border border-hairline shadow-framer-edge rounded-xl p-6 h-full flex flex-col min-h-[300px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-heading font-bold text-ink text-lg">Multi-Doc Funnel</h3>
          <p className="text-[11px] font-medium text-ink-muted uppercase tracking-widest mt-1">Asset Conversion Flow</p>
        </div>
        <div className="p-2 bg-surface-2 rounded-xl text-ink-muted"><Filter className="h-4 w-4" /></div>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-5 mt-2">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="flex items-end justify-between">
              <span className="font-body font-bold text-sm text-ink">{s.label}</span>
              <span className="font-mono font-bold text-sm text-ink">{s.value}%</span>
            </div>
            <div className="w-full h-8 bg-surface-2 rounded-lg overflow-hidden flex items-center">
              <div
                className="h-full bg-ink transition-all duration-1000 ease-out rounded-lg"
                style={{ width: s.value + '%', opacity: 1 - i * 0.25 }}
              />
            </div>
            <div className="text-[11px] text-ink-muted">{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}