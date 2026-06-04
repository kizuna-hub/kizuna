"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, Briefcase, Star, Radar,
    ShieldCheck, Users, Settings, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const InvestorSidebar = () => {
    const pathname = usePathname();

    // Tự động lấy ngôn ngữ (locale) từ đường dẫn hiện tại
    const locale = pathname.split('/')[1] || 'en';
    const basePath = `/${locale}/investor`;

    // ─── KHỐI 1: NGHIỆP VỤ LÕI ───
    const operateMenu = [
        { id: 'deal-flow', icon: LayoutDashboard, label: 'Deal Flow CRM', href: `${basePath}/deal-flow` },
        { id: 'sourcing', icon: Radar, label: 'AI Sourcing Radar', href: `${basePath}/sourcing` },
        { id: 'portfolio', icon: Briefcase, label: 'Portfolio Command', href: `${basePath}/portfolio` },
        { id: 'saved', icon: Star, label: 'Đã lưu', href: `${basePath}/saved` },
    ];

    // ─── KHỐI 2: MẠNG LƯỚI & DỮ LIỆU ───
    const networkMenu = [
        { id: 'data-rooms', icon: ShieldCheck, label: 'Data Rooms', href: `${basePath}/data-rooms` },
        // NÚT BẤM NAV QUA TRANG MENTOR NETWORK Ở ĐÂY 👇
        { id: 'mentor-network', icon: Users, label: 'Mentor Network', href: `${basePath}/mentor-network` },
    ];

    // ─── KHỐI 3: HỆ THỐNG QUẢN TRỊ ───
    const systemMenu = [
        { id: 'team', icon: Users, label: 'Team Workspace', href: `${basePath}/team` },
        { id: 'settings', icon: Settings, label: 'Settings & Billing', href: `${basePath}/settings` },
    ];

    // Helper function để render từng menu group
    const renderMenuGroup = (title: string, items: typeof operateMenu) => (
        <div className="mb-8">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 px-4">{title}</p>
            <nav className="space-y-1">
                {items.map((item) => {
                    // Match pathname chính xác để active highlight
                    const isActive = pathname.includes(item.href);
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all relative group",
                                isActive
                                    ? "bg-zinc-100 text-[#102c1e]"
                                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                            )}
                        >
                            <item.icon className={cn("w-4 h-4", isActive ? "text-[#102c1e]" : "text-zinc-400 group-hover:text-zinc-600")} />
                            {item.label}
                            {isActive && (
                                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#102c1e] shadow-[0_0_8px_#102c1e]" />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );

    return (
        <aside className="w-[280px] h-full shrink-0 border-r border-zinc-200/60 bg-white flex flex-col overflow-hidden hidden md:flex">

            {/* ── LOGO ZONE ── */}
            <div className="flex items-center gap-3 pt-8 pb-6 px-6 shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-[#102c1e] to-[#16452a] rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-white font-black text-xl">K</span>
                </div>
                <span className="text-xl font-black text-zinc-900 tracking-tight">Kizuna<span className="text-zinc-400">Hub</span></span>
            </div>

            {/* ── SCROLLABLE MENU ZONE ── */}
            <div className="flex-1 overflow-y-auto px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {renderMenuGroup('Operate', operateMenu)}
                {renderMenuGroup('Network & Data', networkMenu)}
            </div>

            {/* ── BOTTOM ZONE (SYSTEM & PROFILE) ── */}
            <div className="shrink-0 px-4 pb-6 pt-4 border-t border-zinc-100 bg-white">
                <nav className="space-y-1 mb-4">
                    {systemMenu.map((item) => {
                        const isActive = pathname.includes(item.href);
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all",
                                    isActive ? "bg-zinc-100 text-[#102c1e]" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                                )}
                            >
                                <item.icon className={cn("w-4 h-4", isActive ? "text-[#102c1e]" : "text-zinc-400")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Profile Card */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-50 transition-colors cursor-pointer group">
                    <div className="w-9 h-9 rounded-full bg-[#102c1e]/10 flex items-center justify-center shrink-0 border border-[#102c1e]/10">
                        <span className="font-black text-[#102c1e] text-sm">N</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-zinc-900 truncate">Nguyen Tuan Ngoc</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest truncate">Kizuna Ventures</p>
                    </div>
                    <button className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>

        </aside>
    );
};