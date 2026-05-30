import React from 'react';
import { ActivityLog } from './types';
import { Clock } from 'lucide-react';

export default function LiveActivity() {
    const activities: ActivityLog[] = [
        { id: '1', timestamp: 'Just now', investor: 'Takeru Hishinuma', event: 'Viewing "Tech Stack - SpacetimeDB Monolith"', isLive: true },
        { id: '2', timestamp: '2m ago', investor: 'Kizuna Ventures', event: 'Downloaded Financial Model PDF', isLive: false },
        { id: '3', timestamp: '15m ago', investor: 'John Doe', event: 'Finished reviewing Pitch Deck', isLive: false },
        { id: '4', timestamp: '1h ago', investor: 'Jane Smith', event: 'Opened Secure Link #42A9', isLive: false },
    ];

    return (
        <div className="lg:col-span-4 bg-white border border-[#102c1e]/10 shadow-sm rounded-3xl p-6 flex flex-col min-h-[360px]">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-outfit font-bold text-[#102c1e] text-lg">Live Activity</h3>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#102c1e]/5 border border-[#102c1e]/10">
                    <Clock className="h-3 w-3 text-[#102c1e]" />
                    <span className="font-geist text-[10px] font-bold text-[#102c1e] uppercase tracking-wider">Stream</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
                <div className="relative before:absolute before:inset-0 before:left-[11px] before:h-full before:w-px before:bg-[#102c1e]/10 space-y-7 ml-1">
                    {activities.map((activity) => (
                        <div key={activity.id} className="relative flex items-start gap-4">
                            <div className="absolute left-0 -translate-x-[2px] mt-1.5 bg-white py-1">
                                {activity.isLive ? (
                                    <span className="relative flex h-2.5 w-2.5 ml-[5px]">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a1e2b6] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#a1e2b6] ring-2 ring-white"></span>
                                    </span>
                                ) : (
                                    <div className="h-1.5 w-1.5 rounded-full bg-[#102c1e]/20 ring-[4px] ring-white ml-[7px]"></div>
                                )}
                            </div>
                            <div className="pl-7">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-geist font-bold text-[13px] text-[#102c1e]">{activity.investor}</span>
                                    <span className="font-geist text-[10px] font-medium text-slate-400">{activity.timestamp}</span>
                                </div>
                                <p className="font-inter text-[12px] text-slate-500 leading-relaxed">{activity.event}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}