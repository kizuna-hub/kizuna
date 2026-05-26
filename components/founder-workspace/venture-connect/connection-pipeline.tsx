"use client";

import React from 'react';
import { Lock } from 'lucide-react';
import { cn } from "@/lib/utils";

const activePipelines = [
    { id: 1, name: 'Michael Chang', role: 'VP of Product', status: 'Cần gửi Pitch Deck', color: 'text-amber-700 bg-amber-50 border-amber-200', initials: 'MC' },
    { id: 2, name: 'Elena Rodriguez', role: 'Angel Investor', status: 'Chờ lên lịch hẹn 1-1', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', initials: 'ER' },
    { id: 3, name: 'Priya Patel', role: 'Tech Co-founder', status: 'Đang chờ phản hồi', color: 'text-slate-600 bg-zinc-100 border-zinc-200', initials: 'PP' }
];

export function ConnectionPipeline() {
    return (
        <section className="lg:col-span-2">
            <h2 className="text-lg font-bold text-[#081810] mb-4">Đang theo dõi (Pipeline)</h2>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-200">
                <div className="space-y-3">
                    {activePipelines.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 hover:bg-zinc-50 rounded-xl transition-colors border border-transparent hover:border-zinc-200 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-500 text-xs border border-zinc-200">
                                    {item.initials}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-[#081810]">{item.name}</h4>
                                    <p className="text-xs text-slate-500">{item.role}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <span className={cn("text-[11px] px-3 py-1.5 rounded-full font-bold border", item.color)}>
                                    {item.status}
                                </span>
                                <button className="p-2 text-zinc-400 hover:text-[#16452a] hover:bg-[#16452a]/10 rounded-lg transition-colors flex items-center gap-1">
                                    <Lock className="w-4 h-4" /> <span className="text-[10px] font-bold uppercase hidden sm:block">Gửi bảo mật</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}