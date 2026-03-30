'use client';

import React from 'react';
import Sidebar from './sidebar';
import Header from './header';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-background text-foreground">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-auto bg-background">
                    {children}
                </main>
            </div>
        </div>
    );
}
