"use client";
import React from "react";
import Link from "next/link";
import { LayoutDashboard, Lightbulb, ShieldCheck, Users, BarChart3, Settings, Search } from "lucide-react";

export function AdminSidebar() {
    return (
        <aside className="w-64 bg-white border-r border-zinc-200 h-screen sticky top-0 flex flex-col">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-zinc-100">
                <div className="flex items-center gap-2 text-kizuna-primary font-bold text-xl">
                    <div className="w-8 h-8 bg-kizuna-primary rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">K</span>
                    </div>
                    Kizuna Hub
                </div>
            </div>

            {/* Search Bar */}
            <div className="p-4">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-kizuna-primary transition-colors"
                    />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                <p className="px-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 mt-4">Main Menu</p>

                <Link href="/university-admin" className="flex items-center gap-3 px-3 py-2 bg-kizuna-primary/10 text-kizuna-primary font-medium rounded-lg">
                    <LayoutDashboard className="w-5 h-5" />
                    Tổng quan
                </Link>
                <Link href="#" className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:text-kizuna-primary hover:bg-zinc-50 font-medium rounded-lg transition-colors">
                    <Lightbulb className="w-5 h-5" />
                    Quản lý Dự án
                </Link>
                <Link href="#" className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:text-kizuna-primary hover:bg-zinc-50 font-medium rounded-lg transition-colors">
                    <ShieldCheck className="w-5 h-5" />
                    Tài sản IP Ledger
                </Link>
                <Link href="#" className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:text-kizuna-primary hover:bg-zinc-50 font-medium rounded-lg transition-colors">
                    <Users className="w-5 h-5" />
                    Mạng lưới Mentor
                </Link>
                <Link href="#" className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:text-kizuna-primary hover:bg-zinc-50 font-medium rounded-lg transition-colors">
                    <BarChart3 className="w-5 h-5" />
                    Báo cáo NQ-54
                </Link>
            </nav>

            {/* Footer Settings */}
            <div className="p-4 border-t border-zinc-100">
                <Link href="#" className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:text-zinc-900 font-medium rounded-lg transition-colors">
                    <Settings className="w-5 h-5" />
                    Cài đặt hệ thống
                </Link>
            </div>
        </aside>
    );
}