'use client';

import React from 'react';
import { Bell, Share2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
    return (
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Workspace</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground font-medium">Dashboard</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-border text-foreground hover:bg-muted hover:text-primary"
                >
                    <Share2 className="w-4 h-4" />
                    Share Project
                </Button>
                <button className="p-2 rounded-lg hover:bg-muted transition-colors relative">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
                </button>
            </div>
        </header>
    );
}
