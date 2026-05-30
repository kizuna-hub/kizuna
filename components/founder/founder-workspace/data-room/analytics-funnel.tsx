import React from 'react';
import { Filter } from 'lucide-react';

export default function AnalyticsFunnel() {
    const steps = [
        { label: 'Pitch Deck', value: 100, desc: 'Top of funnel views', color: 'bg-[#102c1e]' },
        { label: 'Financial Model', value: 40, desc: 'Engaged with financials', color: 'bg-[#102c1e]/80' },
        { label: 'Tech Architecture Spec', value: 12.5, desc: 'Deep technical diligence', color: 'bg-[#102c1e]/30' },
    ];

    return (
        <div className="bg-white border border-[#102c1e]/10 shadow-sm rounded-3xl p-6 h-full flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-outfit font-bold text-[#102c1e] text-lg">Multi-Doc Funnel</h3>
                    <p className="font-geist text-[11px] font-medium text-slate-400 uppercase tracking-widest mt-1">Asset Conversion Flow</p>
                </div>
                <div className="p-2 bg-[#102c1e]/5 rounded-xl text-[#102c1e]">
                    <Filter className="h-4 w-4" />
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-5 mt-2">
                {steps.map((step, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5">
                        <div className="flex items-end justify-between">
                            <span className="font-geist font-bold text-sm text-[#102c1e]">{step.label}</span>
                            <span className="font-mono font-bold text-sm text-[#102c1e]">{step.value}%</span>
                        </div>
                        <div className="w-full h-8 bg-[#102c1e]/5 rounded-lg overflow-hidden flex items-center shadow-inner">
                            <div
                                className={`h-full ${step.color} transition-all duration-1000 ease-out`}
                                style={{ width: `${step.value}%` }}
                            />
                        </div>
                        <div className="font-inter text-[11px] text-slate-500">{step.desc}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}