"use client";

import { ArrowUpRight, TrendingUp } from 'lucide-react';

export const InvestorMetrics = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
            <div className="bg-gradient-to-br from-[#102c1e] to-[#16452a] rounded-3xl p-6 text-white shadow-[0_8px_30px_rgb(16,44,30,0.15)] relative overflow-hidden group">
                <div className="absolute right-6 top-6 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:bg-white/20 transition-colors cursor-pointer">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs font-bold text-white/70 mb-2">Deals trong phễu</p>
                <h3 className="text-4xl font-black mb-3">24</h3>
                <div className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 text-[10px] font-bold">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-100">+5 Deal mới tuần này</span>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative group">
                <div className="absolute right-6 top-6 w-8 h-8 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-200 group-hover:bg-zinc-100 cursor-pointer"><ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600" /></div>
                <p className="text-xs font-bold text-zinc-500 mb-2">Tổng Quy Mô (Ask)</p>
                <h3 className="text-4xl font-black text-zinc-900 mb-3">50 Tỷ</h3>
                <p className="text-[10px] font-bold text-zinc-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />Trung bình 2.5 Tỷ/Deal</p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative group">
                <div className="absolute right-6 top-6 w-8 h-8 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-200 group-hover:bg-zinc-100 cursor-pointer"><ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600" /></div>
                <p className="text-xs font-bold text-zinc-500 mb-2">AI Match &gt; 90%</p>
                <h3 className="text-4xl font-black text-zinc-900 mb-3">12</h3>
                <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1.5"><TrendingUp className="w-3 h-3" /> Tăng 15% so với tháng trước</p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative group">
                <div className="absolute right-6 top-6 w-8 h-8 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-200 group-hover:bg-zinc-100 cursor-pointer"><ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600" /></div>
                <p className="text-xs font-bold text-zinc-500 mb-2">Yêu cầu mở khóa</p>
                <h3 className="text-4xl font-black text-zinc-900 mb-3">3</h3>
                <p className="text-[10px] font-bold text-amber-600 flex items-center gap-1.5"><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span></span> Chờ duyệt từ Founder</p>
            </div>
        </div>
    );
};