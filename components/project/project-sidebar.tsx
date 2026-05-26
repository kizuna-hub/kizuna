// components/project/project-sidebar.tsx
"use client";

import React from "react";
import { Flame, Bell, Bookmark, Share, Facebook, Instagram } from "lucide-react";
import { projectData } from "./data";

export function ProjectSidebar() {
    return (
        // Đã xóa "sticky top-24". Bây giờ nó sẽ cuộn tự nhiên cùng nội dung bên trái.
        <div className="flex flex-col gap-6">

            {/* Action Card */}
            <div className="rounded-card border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-2 text-xs font-bold text-zinc-500">
                    <Flame className="h-4 w-4 text-orange-500" /> Launched today!
                </div>

                <div className="mb-6">
                    <div className="text-4xl font-black text-[#16452a]">{projectData.points}</div>
                    <div className="text-sm font-semibold text-zinc-400">points</div>
                </div>

                <div className="flex flex-col gap-3">
                    <button className="flex w-full items-center justify-center gap-2 rounded-card bg-[#16452a] py-3 text-sm font-bold text-white transition-all hover:bg-[#0a1c13]">
                        <Flame className="h-4 w-4" /> Clap
                    </button>
                    <button className="flex w-full items-center justify-center gap-2 rounded-card border border-zinc-200 bg-white py-3 text-sm font-bold text-zinc-700 transition-all hover:bg-zinc-50">
                        <Bell className="h-4 w-4" /> Follow
                    </button>
                </div>

                <div className="mt-4 flex gap-3">
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-card bg-zinc-50 py-2.5 text-xs font-bold text-zinc-600 transition-colors hover:bg-zinc-100">
                        <Bookmark className="h-3.5 w-3.5" /> Save
                    </button>
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-card bg-zinc-50 py-2.5 text-xs font-bold text-zinc-600 transition-colors hover:bg-zinc-100">
                        <Share className="h-3.5 w-3.5" /> Share
                    </button>
                </div>
            </div>

            {/* Built By */}
            <div>
                <h3 className="mb-4 text-sm font-bold text-[#081810]">Built by</h3>
                <div className="flex items-center gap-3 rounded-card border border-zinc-200 bg-white p-4 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-lg font-bold text-white">
                        {projectData.maker.avatar}
                    </div>
                    <div>
                        <div className="text-sm font-bold text-slate-900">{projectData.maker.name}</div>
                        <div className="text-xs font-medium text-zinc-500">{projectData.maker.handle}</div>
                    </div>
                </div>
            </div>

            {/* Tags & Categories */}
            <div className="flex flex-col gap-5 pt-4 border-t border-zinc-200">
                <div>
                    <h3 className="mb-3 text-sm font-bold text-[#081810]">Tech stack</h3>
                    <div className="flex flex-wrap gap-2">
                        {projectData.techStack.map(tech => (
                            <span key={tech} className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-600 shadow-sm">{tech}</span>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="mb-3 text-sm font-bold text-[#081810]">Categories</h3>
                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-[#16452a] cursor-pointer">
                        📁 {projectData.category}
                    </div>
                </div>

                <div>
                    <h3 className="mb-3 text-sm font-bold text-[#081810]">Links</h3>
                    <div className="flex items-center gap-4 text-sm font-medium text-zinc-500">
                        <span className="flex items-center gap-1 hover:text-[#16452a] cursor-pointer"><Facebook className="h-4 w-4" /> Facebook</span>
                        <span className="flex items-center gap-1 hover:text-[#16452a] cursor-pointer"><Instagram className="h-4 w-4" /> Instagram</span>
                    </div>
                </div>
            </div>
        </div>
    );
}