"use client";
import React from "react";
import { Lightbulb, ShieldCheck, Wallet, Award, TrendingUp } from "lucide-react";

export function StrategicMetrics() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Card 1: Startup (Neutral/Blue) */}
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-zinc-500">Startup Đang Ươm tạo</p>
                        <h3 className="text-3xl font-bold text-zinc-900 mt-2">124</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Lightbulb className="w-6 h-6" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                    <span className="flex items-center text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                        <TrendingUp className="w-3 h-3 mr-1" /> +12%
                    </span>
                    <span className="text-zinc-400 ml-2">so với tháng trước</span>
                </div>
            </div>

            {/* Card 2: IP Ledger (Purple - Trí tuệ) */}
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden hover:border-purple-300 transition-colors">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-zinc-500">Tài sản IP Ledger</p>
                        <h3 className="text-3xl font-bold text-zinc-900 mt-2">48</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                    <span className="flex items-center text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                        <TrendingUp className="w-3 h-3 mr-1" /> +5
                    </span>
                    <span className="text-zinc-400 ml-2">bản quyền mới</span>
                </div>
            </div>

            {/* Card 3: Vốn gọi thành công (HIGHLIGHT: Gradient Kizuna Primary) */}
            <div className="bg-gradient-to-br from-kizuna-primary to-[#0a1f14] p-6 rounded-2xl shadow-lg relative overflow-hidden transform hover:-translate-y-1 transition-all">
                {/* Decorative background glow */}
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl"></div>

                <div className="flex items-start justify-between relative z-10">
                    <div>
                        <p className="text-sm font-medium text-zinc-300">Tổng Vốn Gọi Thành Công</p>
                        <h3 className="text-3xl font-bold text-white mt-2">12.5 <span className="text-lg font-medium text-emerald-400">Tỷ VNĐ</span></h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-emerald-400 border border-white/20">
                        <Wallet className="w-6 h-6" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm relative z-10">
                    <span className="flex items-center text-kizuna-primary font-bold bg-emerald-400 px-2 py-0.5 rounded-full">
                        <TrendingUp className="w-3 h-3 mr-1" /> +2.4 Tỷ
                    </span>
                    <span className="text-zinc-300 ml-2">trong quý này</span>
                </div>
            </div>

            {/* Card 4: NQ-54 (Orange - Cảnh báo/Mục tiêu) */}
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden hover:border-orange-300 transition-colors">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-zinc-500">Chuẩn NQ-54/QĐ-3344</p>
                        <h3 className="text-3xl font-bold text-zinc-900 mt-2">68%</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                        <Award className="w-6 h-6" />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                    <div className="w-full bg-zinc-100 rounded-full h-1.5 mr-2">
                        <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: "68%" }}></div>
                    </div>
                    <span className="text-zinc-500 font-medium text-xs">Mục tiêu 80%</span>
                </div>
            </div>
        </div>
    );
}