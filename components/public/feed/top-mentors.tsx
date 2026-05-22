"use client";

import React from "react";
import { Star, CalendarDays, ArrowUpRight } from "lucide-react";
import { topMentors } from "./data";
import { cn } from "@/lib/utils";

export function TopMentors() {
    return (
        <section className="mt-16 w-full border-t border-zinc-200 pt-12">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-[#081810]">Top Mentors</h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                        Kết nối 1-1 với các chuyên gia kỹ thuật và vận hành hàng đầu.
                    </p>
                </div>
                <button className="text-sm font-semibold text-slate-500 hover:text-[#081810] underline underline-offset-4 transition-colors">
                    Xem tất cả
                </button>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                {topMentors.map((mentor) => (
                    <div
                        key={mentor.id}
                        className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md cursor-pointer"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-lg font-bold text-[#081810] group-hover:bg-[#16452a] group-hover:text-white transition-colors">
                                {mentor.avatar}
                            </div>
                            <div>
                                <h3 className="font-bold text-[#081810]">{mentor.name}</h3>
                                <p className="mt-0.5 text-xs font-semibold text-[#16452a]">{mentor.company}</p>
                                <p className="mt-2 text-xs font-medium text-slate-500 leading-relaxed line-clamp-2">
                                    {mentor.expertise}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4">
                            <div className="flex gap-4">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                    <Star className="h-3.5 w-3.5 text-amber-500" />
                                    <span className="font-mono">{mentor.rating}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    <span className="font-mono">{mentor.sessions}</span>
                                </div>
                            </div>
                            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-50 text-slate-400 group-hover:bg-[#0a1c13] group-hover:text-white transition-colors">
                                <ArrowUpRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}