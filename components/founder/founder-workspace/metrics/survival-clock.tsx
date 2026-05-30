"use client";

import React, { useState } from "react";
import { AlertCircle, TrendingDown } from "lucide-react";

export function SurvivalClock() {
    const currentCash = 250000;
    const baseBurnRate = 22000;

    const [additionalBurn, setAdditionalBurn] = useState(0);

    const totalBurn = baseBurnRate + additionalBurn;
    const runwayMonths = currentCash / totalBurn;

    const isCritical = runwayMonths < 4;

    return (
        <div className={`col-span-1 md:col-span-8 bg-white rounded-3xl border shadow-sm p-6 md:p-10 transition-all duration-300 flex flex-col justify-between ${isCritical ? 'border-amber-200 bg-amber-50/30' : 'border-[#102c1e]/10 hover:border-[#102c1e]/30 hover:shadow-md'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="font-outfit font-black text-[#102c1e] text-2xl tracking-tight mb-1 uppercase">Runway</h2>
                    <p className="font-geist text-slate-400 text-sm">Estimated time until cash depletion</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="font-mono text-sm text-slate-400">
                        Current Cash: <span className="font-bold text-[#102c1e]">${currentCash.toLocaleString()}</span>
                    </div>
                    {isCritical && (
                        <div className="flex items-center gap-2 bg-[#fef3c7] text-[#ea580c] font-geist font-bold text-xs uppercase px-3 py-1.5 rounded-full">
                            <AlertCircle size={14} />
                            Critical
                        </div>
                    )}
                </div>
            </div>

            <div className="my-8 md:my-12 flex flex-col lg:flex-row lg:items-end gap-4">
                <div className={`font-mono text-7xl md:text-9xl tracking-tighter leading-none ${isCritical ? 'bg-gradient-to-br from-amber-600 to-orange-600 text-transparent bg-clip-text' : 'bg-gradient-to-br from-[#102c1e] to-[#2a5a40] text-transparent bg-clip-text'}`}>
                    {runwayMonths.toFixed(1)}
                </div>
                <div className={`font-mono text-2xl md:text-4xl pb-1 md:pb-2 uppercase ${isCritical ? 'text-[#ea580c]/70' : 'text-[#102c1e]/50'}`}>
                    Months
                </div>
            </div>

            {/* Progress Bar visual indicator */}
            <div className="w-full h-3 bg-[#fafafa] rounded-full overflow-hidden mb-8 border border-[#102c1e]/5">
                <div
                    className={`h-full transition-all duration-500 ${isCritical ? 'bg-orange-500' : 'bg-[#a1e2b6]'}`}
                    style={{ width: `${Math.min(100, (runwayMonths / 24) * 100)}%` }}
                />
            </div>

            {/* Burn Rate Simulator */}
            <div className="bg-[#fafafa] rounded-2xl border border-[#102c1e]/5 p-5 md:p-6 mt-auto">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="font-geist font-bold text-[#102c1e] text-sm flex items-center gap-2">
                            <TrendingDown size={16} className="text-[#102c1e]/60" />
                            Burn Rate Simulator
                        </h3>
                        <p className="font-geist text-slate-400 text-xs mt-1">Simulate new hires or marketing spend</p>
                    </div>

                    <div className="text-right">
                        <div className="font-mono text-xl text-[#102c1e]">
                            ${totalBurn.toLocaleString()}<span className="text-sm text-[#102c1e]/50">/mo</span>
                        </div>
                        {additionalBurn > 0 && (
                            <div className="font-mono text-xs text-[#a1e2b6] font-bold">
                                +${additionalBurn.toLocaleString()} added
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative pt-2">
                    <input
                        type="range"
                        min="0"
                        max="30000"
                        step="500"
                        value={additionalBurn}
                        onChange={(e) => setAdditionalBurn(Number(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer outline-none bg-[#102c1e]/10 
                                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
                                   [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_2px_4px_rgba(16,44,30,0.15)] 
                                   [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-[#102c1e]/10 [&::-webkit-slider-thumb]:mt-[-8px]
                                   [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full"
                        style={{
                            background: `linear-gradient(to right, #a1e2b6 0%, #a1e2b6 ${(additionalBurn / 30000) * 100}%, rgba(16, 44, 30, 0.1) ${(additionalBurn / 30000) * 100}%, rgba(16, 44, 30, 0.1) 100%)`
                        }}
                    />
                    <div className="flex justify-between text-xs font-mono text-slate-400 mt-3">
                        <span>$0</span>
                        <span>+$15k</span>
                        <span>+$30k</span>
                    </div>
                </div>
            </div>
        </div>
    );
}