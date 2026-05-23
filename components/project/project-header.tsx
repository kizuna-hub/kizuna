"use client";

import React from "react";
import { ChevronRight, Star, ExternalLink, MessageSquare, Map, Clock } from "lucide-react";
import { projectData } from "./data";
import { cn } from "@/lib/utils";

export function ProjectHeader() {
    return (
        <div className="mb-10">
            {/* Breadcrumbs */}
            <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-zinc-400">
                <span className="hover:text-zinc-900 cursor-pointer transition-colors">Home</span>
                <ChevronRight className="h-3 w-3" />
                <span className="hover:text-zinc-900 cursor-pointer transition-colors">{projectData.category}</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-zinc-900">{projectData.name}</span>
            </div>

            {/* Main Info */}
            <div className="flex items-start gap-6">
                <div className={cn("flex h-24 w-24 shrink-0 items-center justify-center rounded-card text-4xl font-black text-white shadow-sm", projectData.color)}>
                    {projectData.logo}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-black text-[#081810] tracking-tight">{projectData.name}</h1>
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-500">{projectData.version}</span>
                    </div>
                    <p className="mt-2 text-lg font-medium text-slate-600">{projectData.tagline}</p>

                    <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-zinc-500">
                        <div className="flex items-center gap-1">
                            <span className="flex text-zinc-300"><Star className="h-4 w-4" /><Star className="h-4 w-4" /><Star className="h-4 w-4" /><Star className="h-4 w-4" /><Star className="h-4 w-4" /></span>
                            <span className="ml-1">No reviews yet</span>
                        </div>
                        <span>•</span>
                        <span>{projectData.comments} comments</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
                <button className="flex items-center gap-2 rounded-full border border-[#16452a] text-[#16452a] px-5 py-2 text-sm font-bold transition-all hover:bg-[#16452a]/5">
                    <ExternalLink className="h-4 w-4" /> App Store
                </button>
                <button className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-2 text-sm font-bold text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50">
                    <MessageSquare className="h-4 w-4 text-zinc-400" /> Feedback
                </button>
                <button className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-2 text-sm font-bold text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50">
                    <Map className="h-4 w-4 text-zinc-400" /> Roadmap
                </button>
                <button className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-2 text-sm font-bold text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50">
                    <Clock className="h-4 w-4 text-zinc-400" /> Updates <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-[10px]">1</span>
                </button>
            </div>

            {/* Mock Image Gallery */}
            <div className="mt-10 flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-[400px] w-[200px] shrink-0 rounded-card bg-gradient-to-b from-amber-100 to-amber-50 border border-zinc-100 shadow-sm flex items-center justify-center">
                        <span className="text-zinc-300 font-bold">Screenshot {i}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}