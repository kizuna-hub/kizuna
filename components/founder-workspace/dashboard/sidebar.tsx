"use client";

import React, { useState } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import {
    BarChart3,
    FileText,
    Users,
    Lock,
    Zap,
    Settings,
    ChevronDown,
    Sparkles
} from 'lucide-react';
import { cn } from "@/lib/utils";

// --- Component NavItem (tương tự như Dashboard Global) ---
const NavItem = ({ icon: Icon, label, href, exact = false }: any) => {
    const pathname = usePathname();

    const normalizedPath = pathname === '/' ? '/' : pathname;

    // Xác định trạng thái active
    const isActive = exact
        ? normalizedPath === href || normalizedPath === `${href}/`
        : normalizedPath === href || normalizedPath.startsWith(`${href}/`);

    return (
        <Link
            href={href}
            className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                    ? "bg-[#16452a]/5 text-[#16452a] font-bold" // Màu active chuẩn Kizuna Hub
                    : "text-slate-600 hover:bg-zinc-50 hover:text-slate-900"
            )}
        >
            <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-[#16452a]" : "text-slate-400")} />
            <span className="truncate">{label}</span>
        </Link>
    );
};

// NHẬN PROJECT ID TỪ LAYOUT TRUYỀN XUỐNG
export default function WorkspaceSidebar({ projectId }: { projectId: string }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // MOCK DATA: Lấy tên dự án dựa trên projectId để hiển thị ở Dropdown
    // Trong thực tế, mày sẽ dùng useEffect fetch data từ API dựa vào projectId này
    const currentProjectName = projectId === "p1" ? "Kizuna Hub" : projectId === "p2" ? "SnapMoney" : projectId === "p3" ? "Dietfit AI" : "Dự án mới";
    const currentProjectInitials = currentProjectName.charAt(0);

    // Dữ liệu mock User
    const user = {
        name: "Nguyen Tuan Ngoc",
        handle: "Nhà sáng lập",
        avatar: "https://github.com/shadcn.png"
    };

    // TẠO BASE URL CHO CÁC LINK TRONG SIDEBAR
    const baseUrl = `/founder-workspace/${projectId}`;

    return (
        // Dùng fixed left-0 top-0 h-screen w-[260px] để đồng bộ với Global Dashboard
        <aside className="fixed left-0 top-0 flex h-screen w-[260px] flex-col border-r border-zinc-200 bg-white z-50">

            {/* Top Section: Nút Quay lại & Project Switcher */}
            <div className="p-4 flex flex-col border-b border-zinc-100">
                {/* Nút Quay lại Khám phá */}
                <Link href="/founder-dashboard/products" className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 hover:text-[#081810] mb-5 transition-colors uppercase tracking-wider">
                    &larr; Quay lại danh sách
                </Link>

                {/* Project Switcher Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2 shadow-sm transition-all hover:border-zinc-300 hover:bg-zinc-50"
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            {/* Logo Project thu nhỏ */}
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#16452a] text-white font-bold text-[10px]">
                                {currentProjectInitials}
                            </div>
                            <span className="text-sm font-bold text-[#081810] truncate">{currentProjectName}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-zinc-400 shrink-0" />
                    </button>

                    {/* Dropdown Menu (Giả lập) */}
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-full rounded-lg border border-zinc-200 bg-white p-1 shadow-lg z-10 animate-in fade-in slide-in-from-top-1">
                            {/* Tạm thời giả lập link chuyển qua lại giữa các dự án */}
                            <Link href="/founder-workspace/p1" className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-bold text-[#081810] hover:bg-zinc-50">
                                <div className="flex h-5 w-5 items-center justify-center rounded bg-[#081810] text-white text-[9px]">K</div>
                                Kizuna Hub
                            </Link>
                            <Link href="/founder-workspace/p2" className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-bold text-[#081810] hover:bg-zinc-50">
                                <div className="flex h-5 w-5 items-center justify-center rounded bg-amber-400 text-white text-[9px]">S</div>
                                SnapMoney
                            </Link>
                            <Link href="/founder-workspace/p3" className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-bold text-[#081810] hover:bg-zinc-50">
                                <div className="flex h-5 w-5 items-center justify-center rounded bg-orange-500 text-white text-[9px]">D</div>
                                Dietfit AI
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto p-3 [&::-webkit-scrollbar]:hidden flex flex-col gap-1 mt-2">
                {/* TRUYỀN BASE URL VÀO href CỦA CÁC NAV ITEM */}
                <NavItem icon={BarChart3} label="Dashboard" href={baseUrl} exact={true} />
                <NavItem icon={FileText} label="AI Pitch Deck" href={`${baseUrl}/ai-pitch-deck`} />
                <NavItem icon={Users} label="Venture Connect" href={`${baseUrl}/venture-connect`} />
                <NavItem icon={Lock} label="IP Protection Ledger" href={`${baseUrl}/ip-ledger`} />
                <NavItem icon={Zap} label="SaaS Perks & Ưu đãi" href={`${baseUrl}/saas-perks`} />
            </nav>

            {/* Bottom: User Profile */}
            <div className="border-t border-zinc-200 p-4 bg-zinc-50/50">
                <button className="flex w-full items-center gap-3 px-1 group">
                    <img src={user.avatar} alt="User" className="h-9 w-9 shrink-0 rounded-full border border-zinc-200 group-hover:border-[#16452a] transition-colors" />
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-bold text-[#081810] truncate group-hover:text-[#16452a] transition-colors">{user.name}</p>
                        <p className="text-xs font-medium text-zinc-500 truncate">{user.handle}</p>
                    </div>
                    <Settings className="h-4 w-4 text-zinc-400 group-hover:text-[#16452a] transition-colors shrink-0" />
                </button>
            </div>
        </aside>
    );
}