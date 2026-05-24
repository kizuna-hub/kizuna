"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { ChevronRight, Plus, Search, Eye, ArrowUp, UserCheck, DollarSign } from "lucide-react";
import { DashboardSidebar } from "../overview/dashboard-sidebar";
import { myProductsData } from "./data";

// --- Component Badge Trạng Thái Gọi Vốn ---
const TractionBadge = ({ traction }: { traction: any }) => {
    if (traction.status === "Funded") {
        return (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200">
                <DollarSign className="h-3 w-3" /> {traction.round}: {traction.amount}
            </span>
        );
    }
    if (traction.status === "Seeking") {
        return (
            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 border border-blue-200">
                Seeking {traction.amount}
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-600 border border-zinc-200">
            Bootstrapped
        </span>
    );
};

export function ProductsPage() {
    return (
        <div className="min-h-screen bg-zinc-50 font-sans selection:bg-[#16452a]/20 flex">

            {/* 1. Sidebar Fixed bên trái (Dùng chung của Global Dashboard) */}
            <DashboardSidebar />

            {/* 2. Main Content */}
            <main className="flex-1 ml-[260px]">
                <div className="mx-auto max-w-5xl px-8 py-10 flex flex-col gap-8">

                    {/* Header & Controls */}
                    <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div>
                            <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-zinc-400">
                                <span className="hover:text-zinc-900 cursor-pointer transition-colors">Dashboard</span>
                                <ChevronRight className="h-3 w-3" />
                                <span className="text-zinc-900">Products</span>
                            </div>
                            <h1 className="text-3xl font-black text-[#081810] tracking-tight mb-2">Your products</h1>
                            <p className="text-sm font-medium text-slate-500">Manage, track performance, and grow your products</p>
                        </div>

                        {/* Actions: Add New, Search, Filter */}
                        <div className="flex items-center gap-3">
                            {/* Nút Add New trỏ thẳng về /submit-project */}
                            <Link
                                href="/submit-project"
                                className="flex h-9 items-center gap-2 rounded-card bg-white border border-zinc-200 px-4 text-sm font-bold text-slate-700 transition-all hover:bg-zinc-50 hover:border-zinc-300 shadow-sm"
                            >
                                <Plus className="h-4 w-4" /> Add new
                            </Link>

                            <div className="relative flex items-center">
                                <Search className="absolute left-3 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="h-9 w-48 rounded-card border border-zinc-200 bg-white pl-9 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-[#16452a] focus:ring-1 focus:ring-[#16452a] shadow-sm"
                                />
                            </div>

                            <select className="h-9 rounded-card border border-zinc-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 outline-none hover:border-zinc-300 shadow-sm cursor-pointer">
                                <option>Newest</option>
                                <option>Oldest</option>
                                <option>Most popular</option>
                            </select>
                        </div>
                    </header>

                    {/* Danh sách Dự án (Grid 1 cột để card trải ngang rộng rãi) */}
                    <div className="flex flex-col gap-4 mt-4">
                        {myProductsData.map((project) => (
                            // BỌC THẺ LINK TRỎ THẲNG VỀ /founder-workspace
                            <Link
                                key={project.id}
                                href="/founder-workspace"
                                className="group flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-card border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md cursor-pointer"
                            >
                                {/* Info Section (Left) */}
                                <div className="flex items-center gap-5 flex-1 min-w-0">
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[14px] bg-zinc-100 overflow-hidden border border-zinc-100">
                                        <img src={project.logo} alt={project.name} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <h3 className="text-base font-bold text-[#081810] group-hover:text-[#16452a] transition-colors truncate">
                                                {project.name}
                                            </h3>
                                            <TractionBadge traction={project.traction} />
                                        </div>
                                        <p className="text-sm font-medium text-slate-500 line-clamp-1 mb-2.5 pr-4">
                                            {project.tagline}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs font-semibold text-zinc-500">
                                            <div className="flex items-center gap-1.5">
                                                <UserCheck className="h-3.5 w-3.5 text-zinc-400" />
                                                <span>Mentor: <span className={project.mentor !== "Chưa có" ? "text-slate-700" : ""}>{project.mentor}</span></span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {project.categories.map(cat => (
                                                    <span key={cat} className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-slate-600">{cat}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Section (Right) */}
                                <div className="flex md:flex-col items-center justify-end gap-6 md:gap-3 shrink-0 border-t md:border-t-0 md:border-l border-zinc-100 pt-4 md:pt-0 md:pl-6">
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col items-end">
                                            <span className="flex items-center gap-1 text-xs font-semibold text-zinc-400 mb-0.5"><Eye className="h-3.5 w-3.5" /> Views</span>
                                            <span className="font-mono text-sm font-bold text-[#081810]">{project.stats.views.toLocaleString()}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="flex items-center gap-1 text-xs font-semibold text-zinc-400 mb-0.5"><ArrowUp className="h-3.5 w-3.5" /> Upvotes</span>
                                            <span className="font-mono text-sm font-bold text-[#081810]">{project.stats.upvotes}</span>
                                        </div>
                                    </div>
                                    <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                                        Updated {project.updatedAt}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            </main>
        </div>
    );
}