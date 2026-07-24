import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsChart() {
  const slides = [
    { title: 'COVER', height: '20%', active: false },
    { title: 'PROBLEM', height: '45%', active: false },
    { title: 'SOLUTION', height: '60%', active: false },
    { title: 'TECH STACK', height: '90%', active: true },
    { title: 'BUSINESS', height: '50%', active: false },
    { title: 'TEAM', height: '30%', active: false },
  ];
  return (
    <div className="h-full bg-surface-1 border border-hairline shadow-framer-edge rounded-xl p-6 flex flex-col min-h-[300px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-heading font-bold text-ink text-lg">Slide-by-Slide Engagement</h3>
          <p className="text-[11px] font-medium text-ink-muted uppercase tracking-widest mt-1">Average time spent per section</p>
        </div>
        <div className="p-2 bg-surface-2 rounded-xl text-ink-muted"><BarChart3 className="h-4 w-4" /></div>
      </div>
      <div className="flex-1 flex items-end justify-between gap-4 mt-6">
        {slides.map((s, i) => (
          <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end">
            <div className="relative w-full h-[80%] flex items-end">
              <div
                className={"w-full rounded-t-lg transition-all duration-300 " + (s.active ? "bg-ink shadow-[0_0_20px_rgba(255,255,255,0.08)]" : "bg-surface-2 group-hover:bg-hairline")}
                style={{ height: s.height }}
              >
                {s.active && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-ink text-on-primary font-body font-bold text-[10px] px-2 py-1 rounded-md whitespace-nowrap hidden sm:block shadow-sm">
                    SpacetimeDB Focus
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 text-[10px] uppercase text-ink-muted font-bold text-center tracking-wider h-8 flex flex-col justify-center">
              <span>{s.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}