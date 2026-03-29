'use client';

import React, { useState } from 'react';
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
    { icon: BarChart3, label: 'Dashboard', active: true },
    { icon: FileText, label: 'AI Pitch Deck & Forms', active: false },
    { icon: Users, label: 'Venture Connect', active: false },
    { icon: Lock, label: 'IP Protection Ledger', active: false },
    { icon: Zap, label: 'SaaS Perks & Offers', active: false },
];

export default function Sidebar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
            {/* Logo Section */}
            <div className="p-6 border-b border-zinc-800">
                <h1 className="text-2xl font-bold text-zinc-50 mb-4">
                    NovaHub
                </h1>
                <Button
                    variant="outline"
                    className="w-full justify-between text-zinc-50 border-zinc-800 hover:bg-orange-500/10 hover:text-orange-500"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <span className="text-sm">Select Workspace</span>
                    <ChevronDown className="w-4 h-4" />
                </Button>
                {isDropdownOpen && (
                    <div className="mt-2 p-2 bg-orange-500/10 rounded-lg border border-zinc-800">
                        <p className="text-xs text-zinc-400 px-2 py-1">
                            TechStarter Inc.
                        </p>
                        <p className="text-xs text-zinc-400 px-2 py-1">
                            AI Solutions LLC
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.label}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${item.active
                                    ? 'bg-orange-500 text-zinc-50'
                                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-sm font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-zinc-800">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-800 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                        <User className="w-4 h-4 text-zinc-50" />
                    </div>
                    <div className="text-left flex-1">
                        <p className="text-sm font-medium text-zinc-50">
                            Alex Chen
                        </p>
                        <p className="text-xs text-zinc-400">
                            Founder
                        </p>
                    </div>
                    <Settings className="w-4 h-4 text-zinc-400" />
                </button>
            </div>
        </aside>
    );
}
