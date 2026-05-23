"use client";

import React from "react";
import {
    Search, LayoutDashboard, Package, Users, MessageSquare,
    CircleDashed, Eye, CalendarClock, Loader2, CheckCircle2,
    XCircle, Settings, HelpCircle, Sparkles
} from "lucide-react";
import { dashboardData } from "./data";
import { cn } from "@/lib/utils";

const NavItem = ({ icon: Icon, label, active, badge }: any) => (
    <button className={cn(
        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active ? "bg-[#16452a]/5 text-[#16452a] font-bold" : "text-slate-600 hover:bg-zinc-50 hover:text-slate-900"
    )}>
        <div className="flex items-center gap-3">
            <Icon className={cn("h-4 w-4", active ? "text-[#16452a]" : "text-slate-400")} />
            {label}
        </div>
        {badge && <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">{badge}</span>}
    </button>
);

export function DashboardSidebar() {
    const { user } = dashboardData;

    return (
        <aside className="fixed left-0 top-0 flex h-screen w-[260px] flex-col border-r border-zinc-200 bg-white z-50">

            {/* Logo & Search */}
            <div className="p-4 flex flex-col gap-4 border-b border-zinc-100">
                <div className="flex items-center gap-2 px-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#081810]">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-serif text-lg font-bold tracking-tight text-[#081810]">Kizuna Hub</span>
                </div>

                <div className="relative flex items-center w-full">
                    <Search className="absolute left-3 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="h-9 w-full rounded-md border border-zinc-200 bg-zinc-50 pl-9 pr-8 text-sm text-slate-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#16452a]/20"
                    />
                    <kbd className="absolute right-2 text-[10px] font-bold text-slate-400">⌘K</kbd>
                </div>
            </div>

            {/* Nav Links (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-3 [&::-webkit-scrollbar]:hidden flex flex-col gap-6">

                {/* PLATFORM */}
                <div>
                    <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Platform</p>
                    <div className="flex flex-col gap-0.5">
                        <NavItem icon={LayoutDashboard} label="Overview" active={true} />
                        <NavItem icon={Package} label="Products" />
                        <NavItem icon={Users} label="Teams" />
                    </div>
                </div>

                {/* FEEDBACK */}
                <div>
                    <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Feedback</p>
                    <div className="flex flex-col gap-0.5">
                        <NavItem icon={MessageSquare} label="All" />
                        <NavItem icon={CircleDashed} label="Pending" />
                        <NavItem icon={Eye} label="Reviewing" />
                        <NavItem icon={CalendarClock} label="Planned" />
                        <NavItem icon={Loader2} label="In progress" />
                        <NavItem icon={CheckCircle2} label="Completed" />
                        <NavItem icon={XCircle} label="Rejected" />
                    </div>
                </div>

                {/* ACCOUNT */}
                <div>
                    <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Account</p>
                    <div className="flex flex-col gap-0.5">
                        <NavItem icon={Settings} label="Settings" />
                        <NavItem icon={HelpCircle} label="Support" />
                    </div>
                </div>
            </div>

            {/* Bottom: Level & User */}
            <div className="border-t border-zinc-200 p-4 flex flex-col gap-4 bg-zinc-50/50">
                <div className="rounded-card border border-zinc-200 bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-[#081810]">Lv.{user.level}</span>
                        <span className="text-xs font-semibold text-zinc-400">{user.points} points</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
                        <div className="h-full w-[10%] rounded-full bg-orange-500" />
                    </div>
                    <p className="mt-2 text-[10px] font-semibold text-zinc-400">{user.nextLevelPoints} more → Lv.{user.level + 1}</p>
                </div>

                <div className="flex items-center gap-3 px-1 cursor-pointer group">
                    <img src={user.avatar} alt="User" className="h-9 w-9 rounded-full border border-zinc-200 group-hover:border-[#16452a] transition-colors" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#081810] truncate">{user.name}</p>
                        <p className="text-xs font-medium text-zinc-500 truncate">{user.handle}</p>
                    </div>
                </div>
            </div>

        </aside>
    );
}