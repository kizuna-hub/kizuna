"use client";

import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

export function FounderRoadmap() {
    return (
        <div className="flex flex-col gap-3 w-full">
            {/* Header nhỏ gọn của khối */}
            <div className="flex items-center justify-between mb-1">
                <h2 className="font-heading text-xs font-black text-[#102c1e]/50 uppercase tracking-widest">Founder Roadmap</h2>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 font-sans">
                    <span>1/3</span>
                    <div className="w-12 h-1 rounded-full bg-[#102c1e]/10 overflow-hidden">
                        <div className="w-1/3 h-full bg-[#102c1e]" />
                    </div>
                </div>
            </div>

            {/* Danh sách các nhiệm vụ bento */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#102c1e]/10 bg-white hover:border-[#102c1e]/20 transition-all shadow-sm group">
                    <div className="flex items-center gap-3 min-w-0">
                        <CheckCircle2 className="h-4.5 w-4.5 text-[#a1e2b6] shrink-0" />
                        <div className="flex flex-col min-w-0">
                            <h3 className="font-sans text-sm font-bold text-[#102c1e]">Xác thực sinh viên</h3>
                            <p className="font-sans text-xs text-slate-400 truncate">Đã kết nối email @dut.udn.vn thành công.</p>
                        </div>
                    </div>
                    <span className="text-xs font-bold text-slate-400 font-sans px-2 py-1">Done</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#102c1e]/10 bg-white hover:border-[#102c1e]/20 transition-all shadow-sm group">
                    <div className="flex items-center gap-3 min-w-0">
                        <Circle className="h-4.5 w-4.5 text-slate-300 shrink-0" />
                        <div className="flex flex-col min-w-0">
                            <h3 className="font-sans text-sm font-bold text-[#102c1e]">Hoàn thiện Pitch Deck</h3>
                            <p className="font-sans text-xs text-slate-400 truncate">Tải slide giới thiệu dự án lên hệ thống.</p>
                        </div>
                    </div>
                    <button className="text-xs font-bold font-sans bg-[#fafafa] text-[#102c1e] px-3 py-1.5 rounded-lg border border-[#102c1e]/5 hover:bg-[#102c1e] hover:text-[#fafafa] transition-colors shrink-0">Upload</button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#102c1e]/10 bg-white hover:border-[#102c1e]/20 transition-all shadow-sm group">
                    <div className="flex items-center gap-3 min-w-0">
                        <Circle className="h-4.5 w-4.5 text-slate-300 shrink-0" />
                        <div className="flex flex-col min-w-0">
                            <h3 className="font-sans text-sm font-bold text-[#102c1e]">Cập nhật Tech Stack</h3>
                            <p className="font-sans text-xs text-slate-400 truncate">Khai báo SpacetimeDB để AI đề xuất matching.</p>
                        </div>
                    </div>
                    <button className="text-xs font-bold font-sans bg-[#fafafa] text-[#102c1e] px-3 py-1.5 rounded-lg border border-[#102c1e]/5 hover:bg-[#102c1e] hover:text-[#fafafa] transition-colors shrink-0">Update</button>
                </div>
            </div>
        </div>
    );
}