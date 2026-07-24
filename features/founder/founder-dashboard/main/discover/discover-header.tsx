"use client";

import React from "react";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "./data";

export function DiscoverHeader() {
    return (
        // ĐÃ SỬA: Xóa bỏ `sticky top-0 z-10 backdrop-blur-md`
        // Thêm `mb-6` để tạo khoảng cách với cái lưới bên dưới
        <div className="bg-[#fafafa] pt-6 pb-4 border-b border-[#102c1e]/10 mb-6">

            {/* Search Input */}
            <div className="relative flex items-center w-full group">
                <Search className="absolute left-4 h-5 w-5 text-slate-400 group-focus-within:text-[#102c1e] transition-colors" />
                <input
                    type="text"
                    placeholder="Search startups, mentors, or insights..."
                    className="h-12 w-full rounded-xl border border-[#102c1e]/10 bg-white pl-12 pr-12 text-sm font-sans text-[#102c1e] shadow-sm outline-none placeholder:text-slate-400 transition-all focus:border-[#102c1e]/30 focus:ring-4 focus:ring-[#102c1e]/5"
                />
                <button className="absolute right-3 p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors">
                    <SlidersHorizontal className="h-4 w-4" />
                </button>
            </div>

            {/* Header & Tabs */}
            <div className="mt-8 flex items-baseline gap-6">
                <h1 className="font-heading text-3xl font-black text-[#102c1e] tracking-tight">Discover</h1>
                <div className="flex items-center gap-6 font-sans text-sm font-bold">
                    <button className="text-[#102c1e] border-b-2 border-[#102c1e] pb-1">Feed</button>
                    <button className="text-slate-400 hover:text-[#102c1e] transition-colors pb-1">Projects</button>
                    <button className="text-slate-400 hover:text-[#102c1e] transition-colors pb-1">Mentors</button>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="mt-4 flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden pb-2">
                {CATEGORIES.map((cat, idx) => (
                    <button
                        key={cat}
                        className={cn(
                            "whitespace-nowrap rounded-full px-4 py-1.5 font-sans text-xs font-bold transition-colors shadow-sm",
                            idx === 0
                                ? "bg-[#102c1e] text-[#fafafa]"
                                : "bg-white border border-[#102c1e]/10 text-[#102c1e]/70 hover:border-[#102c1e]/30 hover:text-[#102c1e]"
                        )}
                    >
                        {cat}
                    </button>
                ))}
                <button className="flex items-center gap-1 whitespace-nowrap rounded-full border border-dashed border-[#102c1e]/30 bg-transparent px-3 py-1.5 font-sans text-xs font-bold text-[#102c1e]/50 hover:border-[#102c1e]/50 hover:text-[#102c1e] transition-colors ml-2">
                    <Plus className="h-3 w-3" /> Filter
                </button>
            </div>

        </div>
    );
}