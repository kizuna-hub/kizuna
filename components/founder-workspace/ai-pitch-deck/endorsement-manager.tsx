"use client";

import React, { useState } from "react";
import { Medal, Users, Crown } from "lucide-react";

interface EndorsementManagerProps {
    endorsements: any[];
    onOpenRequestModal: () => void;
    onTriggerPaywall: () => void;
}

export function EndorsementManager({ endorsements, onOpenRequestModal, onTriggerPaywall }: EndorsementManagerProps) {
    return (
        <div className="rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/50 p-6 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-200 rounded-full blur-3xl opacity-40 pointer-events-none" />

            <div className="flex items-center gap-2 mb-1.5">
                <Medal className="w-5 h-5 text-amber-500" />
                <h2 className="text-base font-bold text-[#081810]">Sự tín nhiệm & Bảo chứng (Endorsements)</h2>
            </div>
            <p className="text-xs font-medium text-slate-500 mb-6">Xin đánh giá và xác thực chuyên môn từ Mentor để tăng uy tín trong mắt các Quỹ đầu tư đầu ngành.</p>

            {endorsements.length === 0 ? (
                <div className="text-center py-4">
                    <button
                        onClick={onOpenRequestModal}
                        className="px-5 py-2.5 rounded-full bg-amber-400 text-amber-950 text-xs font-bold shadow-sm hover:bg-amber-500 transition-colors inline-flex items-center gap-2"
                    >
                        <Users className="w-4 h-4" /> Xin Bảo chứng từ Mentor
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {endorsements.map((end, idx) => (
                        <div key={idx} className="p-4 bg-white rounded-xl border border-amber-100 flex gap-4 animate-in fade-in duration-200">
                            <img src={end.avatar} className="w-10 h-10 rounded-full border border-zinc-100" alt="avatar" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1 gap-2">
                                    <h4 className="text-sm font-bold text-[#081810] truncate">{end.name}</h4>

                                    {/* Priority Pass Paywall Trigger */}
                                    <button
                                        onClick={onTriggerPaywall}
                                        className="flex items-center gap-1.5 cursor-pointer text-left text-zinc-400 hover:text-amber-600 transition-colors"
                                    >
                                        <span className="text-[9px] font-bold uppercase tracking-wider">Ghim ưu tiên</span>
                                        <div className="w-7 h-4 bg-zinc-200 rounded-full relative transition-colors">
                                            <div className="w-3 h-3 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm" />
                                        </div>
                                    </button>
                                </div>
                                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-tight mb-2">{end.role}</p>
                                <p className="text-sm italic text-slate-600 bg-zinc-50 p-3 rounded-lg border border-zinc-100">"{end.content}"</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}