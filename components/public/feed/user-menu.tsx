"use client";

import React from "react";
import Link from "next/link"; // Import Link để điều hướng
import { User, LayoutDashboard, Sun, Moon, LogOut } from "lucide-react";

interface UserMenuProps {
    user: {
        name: string;
        email: string;
        avatar?: string;
    };
}

export function UserMenu({ user }: UserMenuProps) {
    return (
        <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden border border-zinc-200 bg-white shadow-xl rounded-card animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">
            {/* 1. User Header Info */}
            <div className="px-5 py-4 border-b border-zinc-100">
                <p className="text-sm font-bold text-[#081810] truncate">{user.name}</p>
                <p className="text-xs font-medium text-zinc-400 truncate mt-0.5">{user.email}</p>
            </div>

            {/* 2. Navigation Links */}
            <div className="p-2">
                {/* Đổi button Profile thành Link */}
                <Link href="/profile" className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-600 rounded-lg hover:bg-zinc-50 hover:text-[#16452a] transition-colors group">
                    <User className="h-4 w-4 text-zinc-400 group-hover:text-[#16452a]" />
                    Profile
                </Link>

                {/* Đổi button Dashboard thành Link trỏ về founder-dashboard */}
                <Link href="/founder-dashboard" className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-600 rounded-lg hover:bg-zinc-50 hover:text-[#16452a] transition-colors group">
                    <LayoutDashboard className="h-4 w-4 text-zinc-400 group-hover:text-[#16452a]" />
                    Dashboard
                </Link>

                {/* Các nút có hành động đặc biệt thì giữ nguyên button */}
                <button className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-zinc-600 rounded-lg hover:bg-zinc-50 hover:text-[#16452a] transition-colors group">
                    <div className="flex items-center gap-3">
                        <Sun className="h-4 w-4 text-zinc-400 group-hover:text-[#16452a]" />
                        Dark mode
                    </div>
                    <div className="h-4 w-8 rounded-full bg-zinc-200 relative">
                        <div className="absolute left-1 top-1 h-2 w-2 rounded-full bg-white shadow-sm" />
                    </div>
                </button>
            </div>

            {/* 3. Logout Section */}
            <div className="p-2 border-t border-zinc-100 bg-zinc-50/50">
                <button className="flex w-full items-center gap-3 px-3 py-2 text-sm font-bold text-red-500 rounded-lg hover:bg-red-50 transition-colors group">
                    <LogOut className="h-4 w-4 text-red-400 group-hover:text-red-500" />
                    Logout
                </button>
            </div>
        </div>
    );
}