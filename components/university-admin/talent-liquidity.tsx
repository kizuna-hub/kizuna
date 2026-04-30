"use client";
import React from "react";
import { Flame, Eye, Handshake, ExternalLink } from "lucide-react";

export function TalentLiquidity() {
    const hotDeals = [
        // { name: "AgriDrone X", founder: "Nguyễn Tuấn Ngọc (Cơ khí)", views: 156, requests: 12, status: "Đang đàm phán", statusColor: "text-amber-600 bg-amber-50 border-amber-200" },
        { name: "DevShare AI", founder: "Nguyễn Tuấn Ngọc (CNTT)", views: 243, requests: 8, status: "HOT", statusColor: "text-red-600 bg-red-50 border-red-200" },
        { name: "Kizuna Hub", founder: "Nguyễn Tuấn Ngọc (CNTT)", views: 512, requests: 25, status: "Chốt Deal", statusColor: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    ];

    return (
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                        Top Nhân tài <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span>
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1">Sức nóng trên Venture Connect (Live)</p>
                </div>
                <Flame className="w-5 h-5 text-red-500" />
            </div>

            <div className="space-y-3 flex-1">
                {hotDeals.map((deal, idx) => (
                    <div key={idx} className="p-3 border border-zinc-100 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="text-sm font-bold text-zinc-900">{deal.name}</h4>
                                <p className="text-xs text-zinc-500 mt-0.5">{deal.founder}</p>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded border ${deal.statusColor}`}>
                                {deal.status}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-medium text-zinc-600 mt-3 pt-3 border-t border-zinc-200/60">
                            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-zinc-400" /> {deal.views} Lượt xem</span>
                            <span className="flex items-center gap-1"><Handshake className="w-3.5 h-3.5 text-kizuna-primary" /> {deal.requests} Request</span>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-4 py-2 text-sm font-medium text-white bg-kizuna-primary border border-zinc-200 rounded-lg flex items-center justify-center gap-2 transition-colors">
                Xem toàn bộ Deal Flow <ExternalLink className="w-4 h-4" />
            </button>
        </div>
    );
}