"use client";

import React from 'react';
import { Clock, CheckCircle2, Video } from 'lucide-react';

export function UpcomingEvents() {
    return (
        <section className="lg:col-span-1">
            <h2 className="text-lg font-bold text-[#081810] mb-4">Sự kiện sắp tới</h2>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-200">
                <div className="flex gap-4">
                    <div className="flex flex-col items-center min-w-[3rem]">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Th 10</span>
                        <span className="text-2xl font-black text-[#081810]">24</span>
                    </div>
                    <div className="flex-1 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                        <div className="flex justify-between items-start gap-2 mb-3">
                            <h4 className="font-bold text-sm text-[#081810]">1:1 Call với Elena</h4>
                            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 bg-white px-2 py-1 rounded border border-zinc-200 shrink-0"><Clock className="w-3 h-3" /> 10:00 AM</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-zinc-100 shadow-sm mb-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Chuẩn bị trước:</p>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                <span className="underline underline-offset-2">Đã đính kèm AI Pitch Deck v2</span>
                            </div>
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 bg-[#16452a] hover:bg-[#0a1c13] text-white rounded-lg h-9 text-xs font-bold shadow-sm transition-all">
                            <Video className="w-3.5 h-3.5" /> Tham gia Meeting
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}