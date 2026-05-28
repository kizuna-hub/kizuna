"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

export function DashboardHeader() {
    return (
        <header className="mb-10">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-zinc-400">
                <span className="hover:text-zinc-900 cursor-pointer transition-colors">Dashboard</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-zinc-900">Overview</span>
            </div>
            <h1 className="text-3xl font-black text-[#081810] tracking-tight mb-2">Your dashboard</h1>
            <p className="text-sm font-medium text-slate-500">Track performance, find opportunities, and reach your goals</p>
        </header>
    );
}