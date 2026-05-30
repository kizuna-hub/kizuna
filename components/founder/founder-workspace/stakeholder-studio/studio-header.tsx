import React from 'react';
import { Sparkles, Send, Tag, Settings } from 'lucide-react';

export function StudioHeader() {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full bg-white rounded-3xl border border-[#102c1e]/10 p-4 md:px-6 shadow-sm">
            <div className="flex items-center gap-4 flex-1">
                <input 
                    type="text" 
                    defaultValue="April 2026 Update" 
                    className="font-outfit text-2xl font-bold text-[#102c1e] bg-transparent border-none outline-none focus:ring-0 w-full md:w-auto"
                />
                <div className="hidden md:flex items-center gap-1 bg-[#102c1e]/5 text-[#102c1e] px-2.5 py-1 rounded-md text-[10px] font-geist font-bold uppercase tracking-wider">
                    <Tag size={12} />
                    Draft
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#102c1e] text-[#fafafa] rounded-xl font-geist text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all group relative">
                    <Sparkles size={16} className="text-[#a1e2b6]" />
                    AI Auto-Draft
                    {/* Tooltip */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 p-2 bg-[#102c1e] text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-geist text-center">
                        Auto-extracts KPIs & commits from SpacetimeDB
                    </div>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-[#102c1e]/10 text-[#102c1e] rounded-xl font-geist text-sm font-bold hover:bg-[#102c1e]/5 transition-all">
                    <Send size={16} />
                    Send to Investors
                </button>
                <button className="w-9 h-9 flex items-center justify-center border border-[#102c1e]/10 text-slate-400 rounded-xl hover:bg-[#102c1e]/5 transition-all">
                    <Settings size={16} />
                </button>
            </div>
        </div>
    );
}