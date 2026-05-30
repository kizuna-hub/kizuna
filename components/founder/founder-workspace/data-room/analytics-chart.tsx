import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsChart() {
    const slides = [
        { title: 'COVER', height: '20%' },
        { title: 'PROBLEM', height: '45%' },
        { title: 'SOLUTION', height: '60%' },
        { title: 'TECH STACK', height: '90%', active: true },
        { title: 'BUSINESS', height: '50%' },
        { title: 'TEAM', height: '30%' },
    ];

    return (
        <div className="h-full bg-white border border-[#102c1e]/10 shadow-sm rounded-3xl p-6 flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-outfit font-bold text-[#102c1e] text-lg">Slide-by-Slide Engagement</h3>
                    <p className="font-geist text-[11px] font-medium text-slate-400 uppercase tracking-widest mt-1">Average time spent per section</p>
                </div>
                <div className="p-2 bg-[#102c1e]/5 rounded-xl text-[#102c1e]">
                    <BarChart3 className="h-4 w-4" />
                </div>
            </div>

            <div className="flex-1 flex items-end justify-between gap-4 mt-6">
                {slides.map((slide, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center group h-full justify-end">
                        <div className="relative w-full h-[80%] flex items-end">
                            <div
                                className={`w-full rounded-t-lg transition-all duration-300 ${slide.active
                                    ? 'bg-[#a1e2b6] shadow-[0_0_15px_rgba(161,226,182,0.3)]'
                                    : 'bg-[#102c1e]/5 group-hover:bg-[#102c1e]/10'
                                    }`}
                                style={{ height: slide.height }}
                            >
                                {slide.active && (
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#102c1e] text-[#fafafa] font-geist font-bold text-[10px] px-2 py-1 rounded-md whitespace-nowrap hidden sm:block shadow-sm">
                                        SpacetimeDB Focus
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 font-geist text-[10px] uppercase text-slate-400 font-bold text-center tracking-wider h-8 flex flex-col justify-center">
                            <span>{slide.title}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}