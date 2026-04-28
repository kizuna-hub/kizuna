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
    { icon: BarChart3, label: 'Dashboard', href: '/founder-workspace' },
    { icon: FileText, label: 'AI Pitch Deck & Forms', href: '/founder-workspace/ai-pitch-deck' },
    { icon: Users, label: 'Venture Connect', href: '/founder-workspace/venture-connect' },
    { icon: Lock, label: 'IP Protection Ledger', href: '/founder-workspace/ip-ledger' },
    { icon: Zap, label: 'SaaS Perks & Offers', href: '/founder-workspace/perks' },
];

export default function Sidebar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-kizuna-surface border-r border-kizuna-border flex flex-col">
            {/* Logo Section */}
            <div className="p-6 border-b border-kizuna-border">
                <h1 className="text-2xl font-bold text-kizuna-text-main mb-4">
                    NovaHub
                </h1>
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
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-zinc-100 text-kizuna-primary font-medium'
                                : 'text-kizuna-text-muted hover:bg-zinc-50'
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
                            Founder
                        </p>
                    </div>
                    <Settings className="w-4 h-4 text-kizuna-text-muted" />
                </button>
            </div>
        </aside>
    );
}
