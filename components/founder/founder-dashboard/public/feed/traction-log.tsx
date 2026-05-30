"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { Flame, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { timelineProjects } from "./data";

export function TractionLog() {
    return (
        <div className="w-full">
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-xl font-black font-outfit text-[#102c1e]">Traction Log</h2>
                <button className="text-sm font-bold font-geist text-slate-400 hover:text-[#102c1e] underline underline-offset-4 transition-colors">
                    View all
                </button>
            </div>

            <div className="relative">
                {/* Đường kẻ dọc mờ phân chia timeline trục chính */}
                <div className="absolute left-[88px] top-4 bottom-4 w-px bg-zinc-200 hidden sm:block" />

                <div className="flex flex-col gap-10">
                    {timelineProjects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/project/${project.id}`}
                            className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-12 group cursor-pointer"
                        >
                            {/* Khối hiển thị ngày bên lề trái */}
                            <div className="w-auto sm:w-24 shrink-0 pt-3">
                                <span className="text-[11px] font-black uppercase tracking-widest font-geist text-zinc-400 group-hover:text-[#102c1e] transition-colors">
                                    {project.date}
                                </span>
                            </div>

                            {/* Dấu chấm bám trên trục đường kẻ dọc */}
                            <div className="hidden sm:flex absolute left-[84px] top-4 h-2.5 w-2.5 rounded-full bg-zinc-300 ring-4 ring-zinc-50 transition-colors group-hover:bg-[#102c1e]" />

                            {/* Ruột card bento hiển thị milestone dự án */}
                            <div className="flex-1 rounded-2xl border border-[#102c1e]/10 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-[#102c1e]/30">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white shadow-inner font-geist", project.color)}>
                                                {project.logo}
                                            </div>
                                            <h3 className="text-base font-bold font-geist text-[#102c1e] group-hover:text-[#102c1e]/80 transition-colors">
                                                {project.name}
                                            </h3>
                                        </div>
                                        <p className="text-sm font-medium leading-relaxed text-slate-500 font-inter">
                                            {project.milestone}
                                        </p>

                                        {/* Toàn bộ dải tags */}
                                        <div className="mt-4 flex flex-wrap gap-1.5">
                                            {project.tags.map((tag) => (
                                                <span key={tag} className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 font-geist">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bộ đếm claps/comments bên phải */}
                                    <div className="flex flex-col items-center gap-3 shrink-0">
                                        <button className="group/btn flex w-12 flex-col items-center gap-1 rounded-xl border border-[#102c1e]/10 bg-[#fafafa] py-2 transition-colors hover:border-[#102c1e]/30 hover:bg-[#102c1e]/5">
                                            <Flame className="h-4 w-4 text-zinc-400 group-hover/btn:text-[#102c1e]" />
                                            <span className="text-xs font-bold text-slate-700">{project.claps}</span>
                                        </button>
                                        <div className="flex items-center gap-1 text-[10px] font-bold font-geist text-slate-400">
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