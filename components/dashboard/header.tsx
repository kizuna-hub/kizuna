'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Share2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
    const pathname = usePathname();

    let currentSection = 'Dashboard';
    if (pathname?.includes('/ai-pitch-deck')) currentSection = 'AI Pitch Deck & Biểu mẫu';
    else if (pathname?.includes('/venture-connect')) currentSection = 'Venture Connect';
    else if (pathname?.includes('/ip-ledger')) currentSection = 'IP Protection Ledger';
    else if (pathname?.includes('/perks')) currentSection = 'SaaS Perks & Ưu đãi';

    return (
        <header className="h-16 bg-white border-b border-kizuna-border flex items-center justify-between px-8 sticky top-0 z-10">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-kizuna-text-muted">
                <span>TrendEngine</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-kizuna-text-main font-medium">{currentSection}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border border-kizuna-border text-kizuna-text-main hover:bg-zinc-50"
                >
                    <Share2 className="w-4 h-4" />
                    Chia sẻ Dự án
                </Button>
                <button className="p-2 rounded-lg hover:bg-zinc-50 transition-colors relative">
                    <Bell className="w-5 h-5 text-kizuna-text-muted" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-kizuna-primary rounded-full"></span>
                </button>
            </div>
        </header>
    );
}
