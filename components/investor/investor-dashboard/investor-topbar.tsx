"use client";

import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Zap, Settings, HelpCircle, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export const InvestorTopbar = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Tắt dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="h-20 px-8 flex items-center justify-between shrink-0 bg-white border-b border-zinc-200 relative z-40">
            {/* Search Bar */}
            <div className="flex-1 max-w-md relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-[#102c1e] transition-colors" />
                <input
                    type="text"
                    placeholder="Tìm kiếm Startup, Lĩnh vực, Founder..."
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-full pl-11 pr-4 py-2.5 text-sm font-medium text-zinc-900 focus:outline-none focus:border-[#102c1e] focus:ring-4 focus:ring-[#102c1e]/5 transition-all shadow-sm"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <kbd className="hidden sm:inline-flex items-center gap-1 bg-white border border-zinc-200 px-2 py-1 rounded text-[10px] font-bold text-zinc-400">⌘ F</kbd>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 ml-4">

                {/* Upsell Card Component trên Topbar */}
                <button className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-[#102c1e] to-[#1a4a2e] text-white pl-3 pr-4 py-2 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                    <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center">
                        <Zap className="w-3.5 h-3.5 text-yellow-400" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Mở khóa VC Enterprise</span>
                </button>

                <div className="h-6 w-px bg-zinc-200 hidden lg:block mx-1" />

                <button className="w-10 h-10 bg-white border border-zinc-200 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all relative shadow-sm">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
                </button>

                {/* Profile Dropdown Area */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className={cn(
                            "flex items-center gap-3 hover:opacity-80 transition-all bg-white border pl-2 pr-4 py-1.5 rounded-full shadow-sm",
                            isProfileOpen ? "border-[#102c1e] ring-2 ring-[#102c1e]/10" : "border-zinc-200"
                        )}
                    >
                        <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Profile" className="w-7 h-7 rounded-full bg-zinc-100" />
                        <div className="text-left hidden sm:block">
                            <p className="text-xs font-black text-zinc-900 leading-none mb-0.5">Alex Chen</p>
                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Kizuna Angel</p>
                        </div>
                    </button>

                    {/* Menu Dropdown */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-3 w-56 bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                            <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                                <p className="text-sm font-black text-zinc-900">Alex Chen</p>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase mt-0.5">alex.chen@kizuna.com</p>
                            </div>
                            <div className="p-2 space-y-1">
                                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                                    <Settings className="w-4 h-4 text-zinc-400" /> Cài đặt tài khoản
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                                    <HelpCircle className="w-4 h-4 text-zinc-400" /> Trung tâm trợ giúp
                                </button>
                                <div className="h-px bg-zinc-100 my-1" />
                                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors">
                                    <LogOut className="w-4 h-4 text-red-400" /> Đăng xuất
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};