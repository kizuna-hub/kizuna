"use client";

import React from "react";

export function PerformanceCharts() {
    return (
        <section className="mb-12 rounded-card border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#081810]">Performance</h2>
                <div className="flex gap-2">
                    <button className="rounded-full bg-zinc-100 px-4 py-1.5 text-xs font-bold text-slate-800 transition-colors">7 days</button>
                    <button className="rounded-full bg-transparent px-4 py-1.5 text-xs font-bold text-zinc-500 hover:bg-zinc-50 hover:text-slate-800 transition-colors">30 days</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Views Chart */}
                <div>
                    <p className="text-sm font-semibold text-zinc-500 mb-1">Views 7 days</p>
                    <div className="flex items-baseline gap-2 mb-6">
                        <span className="text-3xl font-black text-[#081810]">0</span>
                        <span className="text-sm font-semibold text-zinc-400">0%</span>
                    </div>
                    <p className="text-xs font-medium text-zinc-400 mb-8">Total from 0 products · vs last 7 days</p>

                    {/* Mock Chart Area */}
                    <div className="h-40 w-full border-b border-l border-zinc-200 flex items-end">
                        {/* Đường line giả lập chạy ngang đáy */}
                        <div className="h-0.5 w-full bg-[#16452a]" />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] font-semibold text-zinc-400">
                        <span>16/5</span><span>17/5</span><span>18/5</span><span>19/5</span><span>20/5</span><span>21/5</span><span>22/5</span>
                    </div>
                </div>

                {/* Upvotes Chart */}
                <div>
                    <p className="text-sm font-semibold text-zinc-500 mb-1">Upvotes 7 days</p>
                    <div className="flex items-baseline gap-2 mb-6">
                        <span className="text-3xl font-black text-[#081810]">0</span>
                        <span className="text-sm font-semibold text-zinc-400">0%</span>
                    </div>
                    <p className="text-xs font-medium text-zinc-400 mb-8">Total from 0 products · vs last 7 days</p>

                    {/* Mock Chart Area */}
                    <div className="h-40 w-full border-b border-l border-zinc-200 flex items-end">
                        <div className="h-0.5 w-full bg-emerald-500" />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] font-semibold text-zinc-400">
                        <span>16/5</span><span>17/5</span><span>18/5</span><span>19/5</span><span>20/5</span><span>21/5</span><span>22/5</span>
                    </div>
                </div>
            </div>
        </section>
    );
}