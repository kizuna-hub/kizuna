// components/public/feed/featured-banner.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { featuredProjects } from "./data";

export function FeaturedBanner() {
    return (
        <div className="mb-12">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#081810]">Featured last week</h2>
                <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-slate-800" />
                    <div className="h-2 w-2 rounded-full bg-slate-300" />
                    <div className="h-2 w-2 rounded-full bg-slate-300" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {featuredProjects.map((item) => (
                    // BỌC BẰNG LINK ĐỂ ĐIỀU HƯỚNG
                    <Link
                        key={item.id}
                        href={`/project/${item.id}`}
                        className="group relative flex cursor-pointer items-center gap-4 rounded-card border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-zinc-300"
                    >
                        {item.tag && (
                            <span className="absolute -top-3 left-4 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-800 border border-amber-200">
                                {item.tag}
                            </span>
                        )}
                        <div className="flex-1">
                            <div className="mb-1 flex items-center gap-1 text-xs font-bold text-slate-500">
                                <Award className="h-3.5 w-3.5 text-amber-500" />
                                {item.points} pts
                            </div>
                            <h3 className="font-bold text-slate-900 group-hover:text-[#16452a] transition-colors">{item.name}</h3>
                            <p className="mt-1 line-clamp-2 text-xs font-medium text-slate-500 leading-relaxed">{item.desc}</p>
                        </div>
                        <div className={cn("flex h-16 w-16 shrink-0 items-center justify-center rounded-card text-2xl font-bold shadow-inner", item.color)}>
                            {item.logo}
                        </div>
                    </Link>
                ))}

                {/* Placeholder Quảng Cáo */}
                <div className="flex items-center gap-4 rounded-card border border-dashed border-zinc-300 bg-zinc-50 p-4">
                    <div className="flex-1">
                        <h3 className="font-bold text-slate-900">Your Project Here</h3>
                        <p className="mt-1 text-xs font-medium text-slate-500">Reach thousands of users every day.</p>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-card bg-zinc-200 text-xs font-bold text-slate-400">
                        AD
                    </div>
                </div>
            </div>
        </div>
    );
}