"use client";
import React from "react";
import { ArrowRight, BadgeDollarSign, Lightbulb, Building2, Coins, TrendingUp } from "lucide-react";

export function FundROIHeatmap() {
    return (
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-zinc-900">Bản đồ Giải ngân & Hiệu suất ROI</h3>
                    <p className="text-sm text-zinc-500 mt-1">Theo dõi hành trình vốn NCKH chuyển hóa thành vốn đầu tư thực tế</p>
                </div>
                <div className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-bold">Tỷ suất ROI: 25x</span>
                </div>
            </div>

            {/* Sankey / Pipeline Flow */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 w-full">
                {/* Step 1: Ngân sách trường */}
                <div className="w-full lg:w-1/4 bg-zinc-50 border border-zinc-200 p-4 rounded-xl text-center relative z-10">
                    <Building2 className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
                    <p className="text-xs text-zinc-500 font-medium">Ngân sách NCKH (Nhà trường)</p>
                    <p className="text-xl font-bold text-zinc-900 mt-1">500 Triệu</p>
                </div>

                <ArrowRight className="w-6 h-6 text-zinc-300 hidden lg:block rotate-90 lg:rotate-0" />

                {/* Step 2: Ươm tạo IP */}
                <div className="w-full lg:w-1/4 bg-blue-50 border border-blue-200 p-4 rounded-xl text-center relative z-10">
                    <Lightbulb className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-xs text-blue-600 font-medium">Đầu tư tạo MVP & IP Ledger</p>
                    <p className="text-xl font-bold text-blue-900 mt-1">124 Dự án</p>
                </div>

                <ArrowRight className="w-6 h-6 text-blue-300 hidden lg:block rotate-90 lg:rotate-0" />

                {/* Step 3: Vốn NQ-54 */}
                <div className="w-full lg:w-1/4 bg-orange-50 border border-orange-200 p-4 rounded-xl text-center relative z-10">
                    <BadgeDollarSign className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <p className="text-xs text-orange-600 font-medium">Đạt chuẩn & Lấy vốn NQ-54</p>
                    <p className="text-xl font-bold text-orange-900 mt-1">15 Dự án</p>
                </div>

                <ArrowRight className="w-6 h-6 text-orange-300 hidden lg:block rotate-90 lg:rotate-0" />

                {/* Step 4: Vốn VC */}
                <div className="w-full lg:w-1/4 bg-gradient-to-br from-kizuna-primary to-[#0a1f14] p-4 rounded-xl text-center relative z-10 shadow-lg transform scale-105">
                    <Coins className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                    <p className="text-xs text-zinc-300 font-medium">Thu hút Vốn xã hội (VCs)</p>
                    <p className="text-2xl font-black text-white mt-1">12.5 Tỷ</p>
                </div>
            </div>

            <div className="mt-6 text-center text-sm text-zinc-500">
                Insight: 1 Đồng ngân sách mồi của Nhà trường đang tạo ra 25 Đồng vốn xã hội hóa đổ vào sinh viên.
            </div>
        </div>
    );
}