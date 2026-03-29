'use client';

import React from 'react';
import { Bell, Share2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
    return (
        <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-8 sticky top-0 z-10">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-zinc-400">
                <span>Workspace</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-zinc-50 font-medium">Dashboard</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-zinc-800 text-zinc-50 hover:bg-zinc-800 hover:text-orange-500"
                >
                    <Share2 className="w-4 h-4" />
                    Share Project
                </Button>
                <button className="p-2 rounded-lg hover:bg-zinc-800 transition-colors relative">
                    <Bell className="w-5 h-5 text-zinc-400" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                </button>
            </div>
        </header>
    );
}
