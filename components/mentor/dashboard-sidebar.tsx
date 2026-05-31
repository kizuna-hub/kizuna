"use client";

import React, { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing";
import {
    Search, LayoutDashboard, Briefcase, FileSignature,
    CalendarDays, Settings, HelpCircle, Inbox, Send, Mic
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Mock User Data (thực tế lấy từ context/store) ---
const mentorData = {
    user: {
        name: "Dr. Trần Văn A",
        handle: "mentor.tran",
        avatar: "https://i.pravatar.cc/150?img=11",
        title: "Senior AI Advisor",
        engagementScore: 92
    }
};

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
                "flex w-full items-center justify-between rounded-lg px-3 py-2 transition-all duration-200 font-geist",
                isActive
                    ? "bg-[#fafafa] text-[#102c1e] font-bold shadow-sm"
                    : "text-white/70 hover:bg-white/10 hover:text-white font-medium text-sm"
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

export function MentorDashboardSidebar() {
    const { user } = mentorData;
    const [isSearchOpen, setIsSearchOpen] = useState(false);

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
            <aside className="fixed left-0 top-0 flex h-screen w-[260px] flex-col border-r border-white/5 bg-[#102c1e] z-40">
                <div className="p-4 flex flex-col gap-6 border-b border-white/5">
                    <Link href="/" className="flex items-center gap-2 px-1 cursor-pointer group">
                        <div className="flex h-7 w-7 items-center justify-center rounded bg-[#fafafa] group-hover:scale-105 transition-transform">
                            <span className="font-outfit font-black text-xs text-[#102c1e]">K</span>
                        </div>
                        <span className="font-outfit text-base font-bold tracking-wide text-[#fafafa]">Trạm Cố Vấn</span>
                    </Link>

                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="flex w-full items-center justify-between rounded-lg bg-[#fafafa] px-3 py-2 text-[#102c1e] hover:bg-white transition-colors group shadow-sm"
                    >
                        <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-[#102c1e]/70 group-hover:text-[#102c1e] transition-colors" />
                            <span className="font-geist text-sm font-bold">Tìm kiếm nhanh</span>
                        </div>
                        <kbd className="rounded border border-[#102c1e]/10 bg-[#102c1e]/5 px-1.5 py-0.5 text-[10px] font-bold text-[#102c1e]/70 font-geist">
                            Ctrl K
                        </kbd>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 [&::-webkit-scrollbar]:hidden flex flex-col gap-6 mt-1">
                    <div className="flex flex-col gap-0.5">
                        <NavItem icon={LayoutDashboard} label="Tổng quan" href="/mentor/dashboard" exact={true} />
                        <NavItem icon={Inbox} label="Lời mời Cố vấn" href="/mentor/dashboard/requests" badge="2" />
                    </div>

                    <div>
                        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-[#a1e2b6]/70 font-geist">Nhiệm vụ</p>
                        <div className="flex flex-col gap-0.5">
                            <NavItem icon={FileSignature} label="Sổ cái FAST" href="/mentor/dashboard/fast-ledger" />
                            <NavItem icon={CalendarDays} label="Lịch trình & Slot" href="/mentor/dashboard/calendar" />
                        </div>
                    </div>

                    <div>
                        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-[#a1e2b6]/70 font-geist">Vũ khí của bạn</p>
                        <div className="flex flex-col gap-0.5">
                            <NavItem icon={Send} label="Trạm Giới thiệu (Intros)" href="/mentor/dashboard/warm-intros" />
                            <NavItem icon={Mic} label="Phản biện Async" href="/mentor/dashboard/async-feedback" />
                        </div>
                    </div>

                    <div>
                        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-[#a1e2b6]/70 font-geist">Tài khoản</p>
                        <div className="flex flex-col gap-0.5">
                            <NavItem icon={Settings} label="Cài đặt" href="/mentor/dashboard/settings" />
                            <NavItem icon={HelpCircle} label="Hỗ trợ" href="/mentor/dashboard/support" />
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 p-4 flex flex-col gap-4 bg-[#102c1e]">
                    <div className="rounded-xl bg-[#fafafa] p-3 shadow-sm border border-[#102c1e]/10">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-geist text-sm font-bold text-[#102c1e]">Chỉ số Uy tín</span>
                            <span className="font-geist text-xs font-bold text-[#102c1e] bg-[#a1e2b6]/30 px-2 py-0.5 rounded-full">{user.engagementScore}/100</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-[#102c1e]/10 overflow-hidden">
                            <div className="h-full w-[92%] rounded-full bg-[#102c1e]" />
                        </div>
                        <p className="mt-2 font-inter text-[10px] text-slate-500">Tier: Elite Advisor</p>
                    </div>

                    <button className="flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group text-left">
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-9 w-9 rounded-full object-cover grayscale contrast-125 border border-white/20 group-hover:border-[#fafafa] transition-colors"
                        />
                        <div className="flex-1 min-w-0 flex flex-col">
                            <p className="font-geist text-sm font-bold text-[#fafafa] truncate">{user.name}</p>
                            <p className="font-geist text-[11px] font-medium text-[#a1e2b6] truncate">{user.title}</p>
                        </div>
                    </button>
                </div>
            </aside>
        </>
    );
}