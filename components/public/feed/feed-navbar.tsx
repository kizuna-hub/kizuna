// components/public/feed/feed-navbar.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { UserMenu } from "./user-menu"; // Nhớ đảm bảo mày đã tạo file user-menu.tsx cùng thư mục

export function FeedNavbar() {
    // State quản lý việc đóng/mở dropdown menu của user
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Ref dùng để bắt sự kiện click ra ngoài menu
    const menuRef = useRef<HTMLDivElement>(null);

    // Mock thông tin user hiện tại
    const currentUser = {
        name: "Nguyen Tuan Ngoc",
        email: "knkidngoc@gmail.com",
        avatar: "https://github.com/shadcn.png"
    };

    // Effect: Lắng nghe sự kiện click toàn cục để đóng menu nếu click ra ngoài
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }

        // Gắn listener khi component mount
        document.addEventListener("mousedown", handleClickOutside);

        // Dọn dẹp listener khi component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-xl">
            {/* Đổi thành max-w-7xl để đồng bộ độ rộng với trang Project */}
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6 lg:px-8">

                {/* Left: Logo & Menu */}
                <div className="flex items-center gap-10">
                    {/* Bọc Logo bằng Link để khi click sẽ về trang chủ */}
                    <Link href="/" className="flex items-center gap-2 cursor-pointer group">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#081810] transition-colors group-hover:bg-[#16452a]">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-serif text-xl font-bold tracking-tight text-[#081810]">Kizuna Hub</span>
                    </Link>

                    <nav className="hidden items-center gap-6 md:flex">
                        <button className="text-sm font-semibold text-slate-900">Categories</button>
                        <button className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Talks</button>
                        <button className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Explore</button>
                    </nav>
                </div>

                {/* Right: Search & Actions */}
                <div className="flex items-center gap-4">

                    <div className="relative hidden lg:flex items-center w-64">
                        <Search className="absolute left-3 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="h-9 w-full rounded-full border border-slate-200 bg-slate-50 pl-9 pr-12 text-sm text-slate-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#16452a]/20"
                        />
                        <kbd className="absolute right-3 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400">⌘K</kbd>
                    </div>

                    <Link href="/submit-project">
                        <button className="flex h-9 items-center gap-2 rounded-full bg-[#16452a] px-4 text-sm font-bold text-white transition-all hover:bg-[#0a1c13]">
                            Submit project
                        </button>
                    </Link>

                    {/* <button className="flex h-9 items-center gap-2 rounded-full bg-[#16452a] px-4 text-sm font-bold text-white transition-all hover:bg-[#0a1c13]">
                        Submit project
                    </button> */}

                    {/* KHU VỰC AVATAR & DROPDOWN MENU */}
                    <div className="relative" ref={menuRef}>
                        <div
                            className="h-8 w-8 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 cursor-pointer hover:ring-2 hover:ring-[#16452a]/20 transition-all"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <img src={currentUser.avatar} alt="Avatar" className="h-full w-full object-cover" />
                        </div>

                        {/* Dropdown Menu Component sẽ hiện ra khi isMenuOpen = true */}
                        {isMenuOpen && <UserMenu user={currentUser} />}
                    </div>

                </div>
            </div>
        </header>
    );
}