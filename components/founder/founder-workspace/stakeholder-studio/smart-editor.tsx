import React from 'react';
import { ArrowUpRight, Plus, Italic, Bold, Link2 } from 'lucide-react';

export function SmartEditor() {
    return (
        <div className="bg-white rounded-3xl p-8 lg:p-12 border border-[#102c1e]/10 shadow-sm min-h-[600px] flex flex-col relative group h-full">
            {/* Editor Floating Toolbar mockup */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white border border-[#102c1e]/10 shadow-lg rounded-xl p-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-[#102c1e] hover:bg-[#102c1e]/5 rounded-lg"><Bold size={14}/></button>
                <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-[#102c1e] hover:bg-[#102c1e]/5 rounded-lg"><Italic size={14}/></button>
                <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-[#102c1e] hover:bg-[#102c1e]/5 rounded-lg"><Link2 size={14}/></button>
            </div>

            <div className="font-outfit text-3xl font-black text-[#102c1e] mb-6">April 2026: The Expansion Phase</div>
            
            <div className="font-inter text-slate-700 leading-relaxed space-y-6 text-[15px]">
                <p>
                    Hi everyone, <br/><br/>
                    April has been an outstanding month for Kizuna Hub. We've officially launched our new AI match-making module and saw unprecedented adoption rates from our waitlist. As promised in the last board meeting, we fully transitioned away from our legacy backend.
                </p>
                
                <h3 className="font-outfit text-xl font-bold text-[#102c1e] mt-4">1. Key Highlights & Metrics</h3>
                <p>
                    Our traction is accelerating faster than our Q2 projections. Here is the real-time MRR pull from Stripe:
                </p>

                {/* Mocked Live Data Block */}
                <div className="my-6 p-4 bg-[#fafafa] border border-[#102c1e]/10 rounded-2xl flex items-center justify-between hover:border-[#102c1e]/30 transition-all cursor-pointer shadow-sm relative overflow-hidden group/block">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#a1e2b6]"></div>
                    <div>
                        <div className="font-geist text-[10px] text-slate-500 uppercase tracking-widest mb-1">Live Sync • Stripe</div>
                        <div className="font-outfit font-bold text-[#102c1e]">Monthly Recurring Revenue (MRR)</div>
                    </div>
                    <div className="text-right">
                        <div className="font-mono text-2xl font-black text-[#102c1e]">$124,500</div>
                        <div className="flex items-center justify-end gap-1 font-geist font-bold text-[10px] text-[#102c1e] bg-[#a1e2b6]/30 px-1.5 py-0.5 rounded ml-auto w-max">
                            <ArrowUpRight size={12} strokeWidth={3} />
                            24% MoM
                        </div>
                    </div>
                </div>

                <p>
                    We’ve also managed to decrease our blended CAC by 15% due to organic growth loops triggered by the new referral system.
                </p>

                <div className="relative group/line flex items-center -ml-8">
                    <button className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-[#102c1e] hover:bg-[#102c1e]/10 rounded-md opacity-0 group-hover/line:opacity-100 transition-opacity absolute left-0">
                        <Plus size={16} />
                    </button>
                    <p className="font-inter text-slate-400 ml-8 cursor-text">
                        Type '/' for commands or drag widgets here...
                    </p>
                </div>
            </div>
        </div>
    );
}