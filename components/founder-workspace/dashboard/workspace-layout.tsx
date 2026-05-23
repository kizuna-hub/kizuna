'use client';

import React from 'react';
import WorkspaceSidebar from './sidebar';
import Header from './header';

export default function WorkspaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // Dùng nền zinc-50 chuẩn
        <div className="min-h-screen bg-zinc-50 font-sans selection:bg-[#16452a]/20 flex">

            {/* 1. Sidebar Fixed bên trái */}
            <WorkspaceSidebar />

            {/* 2. Cột nội dung chính (Bị đẩy sang phải 260px) */}
            <div className="flex-1 ml-[260px] flex flex-col">

                {/* Header dính phía trên */}
                <Header />

                {/* Nội dung chính scrollable */}
                <main className="flex-1 p-8">
                    <div className="mx-auto max-w-6xl">
                        {children}
                    </div>
                </main>

            </div>
        </div>
    );
}