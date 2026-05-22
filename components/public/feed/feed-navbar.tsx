"use client";

import React from "react";
import { Search, Sparkles } from "lucide-react";

export function FeedNavbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6 lg:px-8">
                {/* Left: Logo & Menu */}
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-2 cursor-pointer">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#081810]">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-serif text-xl font-bold tracking-tight text-[#081810]">Kizuna Hub</span>
                    </div>
                    <nav className="hidden items-center gap-6 md:flex">
                        <button className="text-sm font-semibold text-slate-900">Categories</button>
                        <button className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Talks</button>
                        <button className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Explore</button>
                    </nav>
                </div>

                {/* Right: Search & Actions */}
                <div className="flex items-center gap-4">
                    <div className="relative hidden lg:flex items-center w-64">
                        <Search className="absolute left-3 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="h-9 w-full rounded-full border border-slate-200 bg-slate-50 pl-9 pr-12 text-sm text-slate-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#16452a]/20"
                        />
                        <kbd className="absolute right-3 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400">⌘K</kbd>
                    </div>
                    <button className="flex h-9 items-center gap-2 rounded-full bg-[#16452a] px-4 text-sm font-bold text-white transition-all hover:bg-[#0a1c13]">
                        Submit project
                    </button>
                    <div className="h-8 w-8 overflow-hidden rounded-full border border-slate-200 bg-slate-100 cursor-pointer">
                        <img src="https://github.com/shadcn.png" alt="Avatar" className="h-full w-full object-cover" />
                    </div>
                </div>
            </div>
        </header>
    );
}