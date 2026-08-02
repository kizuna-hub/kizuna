"use client";

import React, { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing"; // Đảm bảo đường dẫn này khớp với project của mày
import {
    Search, LayoutDashboard, Package, Home,
    Compass, Flame, Plus
} from "lucide-react";
import { dashboardData } from "./founder-dashboard/platform/overview/data"; // Sửa lại đường dẫn nếu cần
import { cn } from "@/lib/utils";
import { SearchOrCreateModal } from "./search-or-create"; // Import Component Modal vừa tạo

// --- NavItem: Active dùng Bento White, Inactive dùng Text Trắng mờ ---
const NavItem = ({ icon: Icon, label, href, badge, exact = false }: any) => {
    const pathname = usePathname();
    const normalizedPath = pathname === '/' ? '/' : pathname;

    const isActive = exact
        ? normalizedPath === href
        : normalizedPath === href || normalizedPath.startsWith(`${href}/`);

    return (
        <Link
            href={href}
            className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 transition-all duration-200 font-sans",
                isActive
                    ? "bg-[#fafafa] text-[#102c1e] font-bold shadow-sm" // Active state: Bento White
                    : "text-white/70 hover:bg-white/10 hover:text-white font-medium text-sm" // Inactive state
            )}
        >
            <div className="flex items-center gap-3">
                <Icon className={cn("h-4 w-4", isActive ? "text-[#102c1e]" : "text-white/70")} />
                <span className={cn(isActive ? "text-sm" : "")}>{label}</span>
            </div>
            {badge && (
                <span className={cn(
                    "flex h-5 items-center rounded-full px-2 text-[10px] font-bold",
                    isActive ? "bg-[#102c1e]/10 text-[#102c1e]" : "bg-white/20 text-white"
                )}>
                    {badge}
                </span>
            )}
        </Link>
    );
};

export function DashboardSidebar() {
    const { user } = dashboardData;

    // State quản lý Bật/Tắt Modal Search
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Lắng nghe phím tắt Ctrl + K hoặc Cmd + K toàn cục
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            {/* Chỉ xài bg-kizuna-primary cho nền tổng */}
            <aside className="fixed left-0 top-0 flex h-screen w-[260px] flex-col border-r border-white/5 bg-kizuna-primary z-40">

                {/* Khối 1: Logo & Nút Gọi Command Palette */}
                <div className="p-4 flex flex-col gap-6 border-b border-white/5">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 px-1 cursor-pointer group">
                        <div className="flex h-7 w-7 items-center justify-center rounded bg-[#fafafa] group-hover:scale-105 transition-transform">
                            <span className="font-heading font-black text-xs text-[#102c1e]">K</span>
                        </div>
                        <span className="font-heading text-base font-bold tracking-wide text-[#fafafa]">Kizuna Hub</span>
                    </Link>

                    {/* Nút Search Or Create */}
                    {/* <button
                        onClick={() => setIsSearchOpen(true)}
                        className="flex w-full items-center justify-between rounded-lg bg-[#fafafa] px-3 py-2 text-[#102c1e] hover:bg-white transition-colors group shadow-sm"
                    >
                        <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-[#102c1e]/70 group-hover:text-[#102c1e] transition-colors" />
                            <span className="font-sans text-sm font-bold">Search or create</span>
                        </div>
                        <kbd className="rounded border border-[#102c1e]/10 bg-[#102c1e]/5 px-1.5 py-0.5 text-[10px] font-bold text-[#102c1e]/70 font-sans">
                            Ctrl K
                        </kbd>
                    </button> */}
                </div>

                {/* Khối 2: Nav Links (Đã xóa mục Feedback) */}
                <div className="flex-1 overflow-y-auto p-3 [&::-webkit-scrollbar]:hidden flex flex-col gap-6 mt-1">

                    {/* MAIN NAVIGATION */}
                    <div className="flex flex-col gap-0.5">
                        {/* <NavItem icon={Home} label="Home" href="/" exact={true} /> */}
                        <NavItem icon={LayoutDashboard} label="Launchpad" href="/founder/founder-dashboard" exact={true} />
                        <NavItem icon={Compass} label="Discover" href="/founder/founder-dashboard/discover" badge="New" />
                    </div>

                    {/* PIPELINE */}
                    <div>
                        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-white/50 font-sans">Pipeline</p>
                        <div className="flex flex-col gap-0.5">
                            <NavItem icon={Package} label="My Projects" href="/founder/founder-dashboard/products" />
                            <NavItem icon={Plus} label="Submit Project" href="/submit-project" />
                        </div>
                    </div>

                </div>

                {/* Khối 3: Bottom (Level & User) */}
                <div className="border-t border-white/5 p-4 flex flex-col gap-4 bg-kizuna-primary">

                    {/* Gamification Level Card - Bento White Card (#fafafa) */}
                    <div className="rounded-xl bg-[#fafafa] p-3 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-sans text-sm font-bold text-[#102c1e] flex items-center gap-1.5">
                                <Flame className="w-3.5 h-3.5 text-[#102c1e]" /> Lv.{user.level}
                            </span>
                            <span className="font-sans text-xs font-bold text-[#102c1e]/60">{user.points} pts</span>
                        </div>
                        {/* Thanh tiến độ nền xám nhạt, lõi màu kizuna-primary */}
                        <div className="h-1.5 w-full rounded-full bg-[#102c1e]/10 overflow-hidden">
                            <div className="h-full w-[30%] rounded-full bg-[#102c1e]" />
                        </div>
                        <p className="mt-2 font-sans text-[10px] font-bold text-[#102c1e]/60">
                            {user.nextLevelPoints} more to Lv.{user.level + 1}
                        </p>
                    </div>

                    {/* User Profile Mini (Text trắng) */}
                    <button className="flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group text-left">
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-9 w-9 rounded-full object-cover grayscale contrast-125 border border-white/20 group-hover:border-[#fafafa] transition-colors"
                        />
                        <div className="flex-1 min-w-0 flex flex-col">
                            <p className="font-sans text-sm font-bold text-[#fafafa] truncate">{user.name}</p>
                            <p className="font-sans text-xs font-medium text-white/60 truncate">{user.handle}</p>
                        </div>
                    </button>
                </div>

            </aside>

            {/* Chèn Component Modal vào (Chỉ hiển thị khi isSearchOpen = true) */}
            <SearchOrCreateModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </>
    );
}
