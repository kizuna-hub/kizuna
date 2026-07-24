"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing"; // Sử dụng đúng định tuyến i18n của mày

export function PlatformShortcuts() {
    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center justify-between mb-1">
                <h2 className="font-heading text-xs font-black text-[#102c1e]/50 uppercase tracking-widest">Platform Shortcuts</h2>
            </div>

            <div className="flex flex-col gap-2">
                <Link href="/submit-project" className="flex items-center justify-between p-3.5 rounded-xl border border-[#102c1e]/10 bg-white hover:border-[#102c1e]/30 transition-all shadow-sm group">
                    <div className="flex flex-col">
                        <h3 className="font-sans text-sm font-bold text-[#102c1e]">Submit Project</h3>
                        <p className="font-sans text-xs text-slate-400">Đăng sản phẩm mới lên Hub chung.</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-[#102c1e] transition-colors" />
                </Link>

                <Link href="/discover" className="flex items-center justify-between p-3.5 rounded-xl border border-[#102c1e]/10 bg-white hover:border-[#102c1e]/30 transition-all shadow-sm group">
                    <div className="flex flex-col">
                        <h3 className="font-sans text-sm font-bold text-[#102c1e]">Tìm kiếm Mentor</h3>
                        <p className="font-sans text-xs text-slate-400">Kết nối chuyên gia đầu ngành AI & Web.</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-[#102c1e] transition-colors" />
                </Link>

                <Link href="/founder-dashboard" className="flex items-center justify-between p-3.5 rounded-xl border border-[#102c1e]/10 bg-white hover:border-[#102c1e]/30 transition-all shadow-sm group">
                    <div className="flex flex-col">
                        <h3 className="font-sans text-sm font-bold text-[#102c1e]">Quản lý giải đấu</h3>
                        <p className="font-sans text-xs text-slate-400">Theo dõi thông tin và ngân sách IT League.</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-[#102c1e] transition-colors" />
                </Link>
            </div>
        </div>
    );
}