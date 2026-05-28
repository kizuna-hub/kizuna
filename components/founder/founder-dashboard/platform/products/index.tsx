"use client";

import React from "react";
// Đổi từ Link sang useRouter
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { ChevronRight, Plus, Search, Eye, ArrowUp, UserCheck, DollarSign, Clock, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { DashboardSidebar } from "../../../dashboard-sidebar";
import { myProductsData } from "./data";
import { cn } from "@/lib/utils";


// --- Component 1: Badge Trạng Thái Gọi Vốn ---
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

// --- Component 2: Badge Trạng Thái Xét Duyệt AI Policy ---
const ApprovalBadge = ({ status }: { status: "Pending" | "Published" | "Rejected" }) => {
    switch (status) {
        case "Pending":
            return (
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200" title="AI đang kiểm tra hồ sơ dự án của bạn">
                    <Clock className="h-3 w-3" /> Đang thẩm định
                </div>
            );
        case "Published":
            return (
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200" title="Dự án đã xuất hiện trên cộng đồng">
                    <CheckCircle2 className="h-3 w-3" /> Đã lên sóng
                </div>
            );
        case "Rejected":
            return (
                <div className="flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200" title="Vui lòng cập nhật thêm thông tin Pitch Deck">
                    <AlertCircle className="h-3 w-3" /> Cần bổ sung
                </div>
            );
        default:
            return null;
    }
};

// --- Component 3: Project Card (ĐÃ FIX ĐÈ UI & LOGIC TAB) ---
const ProjectCard = ({ project }: { project: any }) => {
    const router = useRouter();

    const handleCardClick = () => {
        router.push(`/founder/founder-workspace/${project.id}`);
    };

    // Đổi window.open thành router.push để mở trong CÙNG 1 TAB
    const handleExternalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/project/${project.id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className={cn(
                "group flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-card border bg-white px-6 py-4 shadow-sm transition-all hover:shadow-md cursor-pointer",
                project.approvalStatus === "Rejected" ? "border-red-200 hover:border-red-300" : "border-zinc-200 hover:border-zinc-300"
            )}
        >
            {/* Info Section (Left) */}
            <div className="flex items-start gap-5 flex-1 min-w-0">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] bg-zinc-100 overflow-hidden border border-zinc-100 relative">
                    <img src={project.logo} alt={project.name} className="h-full w-full object-cover" />
                    {project.approvalStatus === "Rejected" && <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px]" />}
                </div>

                <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                        <h3 className="text-base font-bold text-[#081810] group-hover:text-[#16452a] transition-colors truncate max-w-[200px]">
                            {project.name}
                        </h3>
                        {/* Dời nút Xem Public ra ngay cạnh tên dự án, hết bị đè */}
                        <button
                            onClick={handleExternalClick}
                            className="text-zinc-400 hover:text-[#16452a] transition-colors flex items-center justify-center"
                            title="Xem trang hiển thị với cộng đồng"
                        >
                            <ExternalLink className="h-4 w-4" />
                        </button>

                        <ApprovalBadge status={project.approvalStatus as any} />
                    </div>

                    <p className="text-sm font-medium text-slate-500 line-clamp-1 mb-2.5 pr-4">
                        {project.tagline}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-semibold text-zinc-500 flex-wrap">
                        <TractionBadge traction={project.traction} />

                        <div className="flex items-center gap-1.5 border-l border-zinc-200 pl-4">
                            <UserCheck className="h-3.5 w-3.5 text-zinc-400" />
                            <span>Mentor: <span className={project.mentor !== "Chưa có" ? "text-[#16452a]" : ""}>{project.mentor}</span></span>
                        </div>

                        <div className="flex items-center gap-2 border-l border-zinc-200 pl-4 hidden sm:flex">
                            {project.categories.slice(0, 2).map((cat: string) => (
                                <span key={cat} className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-slate-600">{cat}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section (Right) - Đã xóa mớ absolute lằng nhằng */}
            <div className="flex md:flex-col items-center justify-end gap-6 md:gap-3 shrink-0 border-t md:border-t-0 md:border-l border-zinc-100 pt-4 md:pt-0 md:pl-6">
                <div className="flex items-center gap-6 opacity-80 group-hover:opacity-100 transition-opacity">
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
        </div>
    );
};

// --- Component Chính ---
export function ProductsPage() {
    return (
        <div className="min-h-screen bg-zinc-50 font-sans selection:bg-[#16452a]/20 flex">

            <DashboardSidebar />

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
                            <p className="text-sm font-medium text-slate-500">Quản lý và nâng cấp hồ sơ dự án của bạn.</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/submit-project"
                                className="flex h-9 items-center gap-2 rounded-card bg-white border border-zinc-200 px-4 text-sm font-bold text-slate-700 transition-all hover:bg-zinc-50 hover:border-[#16452a]/50 hover:text-[#16452a] shadow-sm group"
                            >
                                <Plus className="h-4 w-4 text-zinc-400 group-hover:text-[#16452a] transition-colors" /> Add new
                            </Link>

                            <div className="relative flex items-center hidden sm:flex">
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

                    {/* Danh sách Dự án */}
                    <div className="flex flex-col gap-4 mt-4">
                        {myProductsData.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>

                </div>
            </main>
        </div>
    );
}