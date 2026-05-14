'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BarChart3,
    FileText,
    Users,
    Lock,
    Zap,
    Settings,
    ChevronDown,
    User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const menuItems = [
    // { icon: BarChart3, label: 'Dashboard', href: '/founder-workspace' },
    { icon: FileText, label: 'AI Pitch Deck', href: '/founder-workspace/ai-pitch-deck' },
    { icon: Users, label: 'Venture Connect', href: '/founder-workspace/venture-connect' },
    { icon: Lock, label: 'IP Protection Ledger', href: '/founder-workspace/ip-ledger' },
    { icon: Zap, label: 'SaaS Perks & Ưu đãi', href: '/founder-workspace/saas-perks' },
];

export default function Sidebar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-kizuna-surface border-r border-kizuna-border flex flex-col">
            {/* Logo Section */}
            <div className="p-6 border-b border-kizuna-border">
                <Link href="/" className="block mb-2">
                    <h1 className="text-2xl font-bold text-kizuna-text-main hover:text-kizuna-primary transition-colors">
                        Kizuna Hub
                    </h1>
                </Link>
                <Link href="/" className="flex items-center text-xs font-medium text-kizuna-text-muted hover:text-kizuna-text-main mb-6 transition-colors">
                    &larr; Quay lại Khám phá
                </Link>
                <Button
                    variant="outline"
                    className="w-full justify-between text-kizuna-text-main border-kizuna-border hover:bg-zinc-50 hover:text-kizuna-primary"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <span className="text-sm font-medium">TrendEngine</span>
                    <ChevronDown className="w-4 h-4" />
                </Button>
                {isDropdownOpen && (
                    <div className="mt-2 p-2 bg-zinc-50 rounded-lg border border-kizuna-border">
                        <p className="text-xs text-kizuna-text-muted px-2 py-1">
                            TechStarter Inc.
                        </p>
                        <p className="text-xs text-kizuna-text-muted px-2 py-1">
                            AI Solutions LLC
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    // Xử lý pathname để lấy route thực tế, bỏ qua locale (ví dụ: /vi/founder...)
                    const normalizedPath = pathname.replace(/^\/[a-zA-Z-]{2,5}(\/|$)/, '/');

                    // Xử lý riêng cho nút Dashboard (vì nó là prefix của tất cả các route khác)
                    const isActive = item.href === '/founder-workspace'
                        ? normalizedPath === '/founder-workspace' || normalizedPath === '/founder-workspace/'
                        : normalizedPath === item.href || normalizedPath.startsWith(item.href + '/');

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-kizuna-primary text-white font-medium shadow-sm'
                                : 'text-kizuna-text-muted hover:bg-zinc-100 hover:text-kizuna-text-main'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-kizuna-border">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-kizuna-primary flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left flex-1">
                        <p className="text-sm font-medium text-kizuna-text-main">
                            Alex Chen
                        </p>
                        <p className="text-xs text-kizuna-text-muted">
                            Nhà sáng lập
                        </p>
                    </div>
                    <Settings className="w-4 h-4 text-kizuna-text-muted" />
                </button>
            </div>
        </aside>
    );
}
