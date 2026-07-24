"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { dashboardData } from "./data";

export function LatestNews() {
    return (
        <section className="mb-12 relative">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#081810]">Latest from Kizuna</h2>
                <div className="flex gap-2">
                    <button className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-400 hover:text-[#081810] hover:border-zinc-300 transition-colors shadow-sm">
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-400 hover:text-[#081810] hover:border-zinc-300 transition-colors shadow-sm">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {dashboardData.latestNews.map((news) => (
                    <div key={news.id} className="group rounded-card border border-zinc-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col">
                        <div className="h-40 w-full overflow-hidden bg-zinc-100">
                            <img src={news.image} alt={news.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                            <div className="mb-3">
                                <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${news.tagColor}`}>
                                    {news.tag}
                                </span>
                            </div>
                            <h3 className="text-sm font-bold text-[#081810] leading-snug mb-2 group-hover:text-[#16452a] transition-colors">{news.title}</h3>
                            <p className="text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed flex-1">{news.desc}</p>
                            <div className="mt-4 text-xs font-bold text-[#16452a]">
                                {news.date}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}