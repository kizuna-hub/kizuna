"use client";

import React from 'react';
import { Star, Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils";

interface MentorMatchCardProps {
    mentor: any;
    connectionTokens: number;
    onConnect: () => void;
}

export function MentorMatchCard({ mentor, connectionTokens, onConnect }: MentorMatchCardProps) {
    return (
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col h-full">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#16452a]/5 rounded-bl-full pointer-events-none" />

            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 font-bold border border-zinc-200 shrink-0">
                        {mentor.initials}
                    </div>
                    <div>
                        <h3 className="font-bold text-[#081810] text-sm">{mentor.name}</h3>
                        <p className="text-[11px] font-medium text-slate-500">{mentor.role}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-lg font-black text-[#16452a]">{mentor.matchScore}</span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Độ phù hợp</span>
                </div>
            </div>

            <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 mb-4 flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3 h-3 text-[#16452a]" />
                    <span className="text-[10px] font-bold text-[#16452a] uppercase tracking-wider">AI Phân tích</span>
                </div>
                <p className="text-xs text-slate-600 font-medium italic">"{mentor.aiReason}"</p>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 bg-white border border-zinc-200 p-2 rounded-lg mb-4">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                <span className="truncate">{mentor.socialProof}</span>
            </div>

            {/* CỤM NÚT ACTION MỚI */}
            <div className="flex gap-3 mt-auto">
                <button className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border border-zinc-200 bg-white text-slate-700 hover:bg-zinc-50 hover:border-zinc-300 shadow-sm">
                    Xem hồ sơ
                </button>
                <button
                    onClick={onConnect}
                    className={cn(
                        "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex justify-center items-center gap-1.5",
                        connectionTokens > 0
                            ? "bg-[#16452a] text-white hover:bg-[#0a1c13]"
                            : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                    )}
                >
                    Kết nối ngay
                </button>
            </div>
        </div>
    );
}