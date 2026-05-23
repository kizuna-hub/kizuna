// components/public/feed/traction-log.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Flame, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { timelineProjects } from "./data";

export function TractionLog() {
    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#081810]">Traction Log</h2>
                <button className="text-sm font-semibold text-slate-500 hover:text-slate-900 underline underline-offset-4">
                    View all
                </button>
            </div>

            <div className="relative">
                {/* Đường kẻ mờ */}
                <div className="absolute left-[88px] top-4 bottom-4 w-px bg-zinc-200 hidden sm:block" />

                <div className="flex flex-col gap-10">
                    {timelineProjects.map((project) => (
                        // BỌC BẰNG LINK ĐỂ ĐIỀU HƯỚNG VÀO TRANG PROJECT
                        <Link
                            key={project.id}
                            href={`/project/${project.id}`}
                            className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-12 group cursor-pointer"
                        >
                            <div className="w-auto sm:w-24 shrink-0 pt-3">
                                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-[#16452a] transition-colors">
                                    {project.date}
                                </span>
                            </div>

                            <div className="hidden sm:flex absolute left-[84px] top-4 h-2.5 w-2.5 rounded-full bg-zinc-300 ring-4 ring-zinc-50 transition-colors group-hover:bg-[#16452a]" />

                            <div className="flex-1 rounded-card border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-zinc-300">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white shadow-inner", project.color)}>
                                                {project.logo}
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#16452a] transition-colors">{project.name}</h3>
                                        </div>
                                        <p className="text-sm font-medium leading-relaxed text-slate-500">
                                            {project.milestone}
                                        </p>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {project.tags.map((tag) => (
                                                <span key={tag} className="rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center gap-3 shrink-0">
                                        <button className="group/btn flex w-12 flex-col items-center gap-1 rounded-card border border-zinc-200 bg-zinc-50 py-2 transition-colors hover:border-[#16452a] hover:bg-[#16452a]/5">
                                            <Flame className="h-4 w-4 text-zinc-400 group-hover/btn:text-[#16452a]" />
                                            <span className="text-xs font-bold text-slate-700">{project.claps}</span>
                                        </button>
                                        <div className="flex items-center gap-1 text-xs font-bold text-zinc-400">
                                            <MessageCircle className="h-3.5 w-3.5" />
                                            {project.comments}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}