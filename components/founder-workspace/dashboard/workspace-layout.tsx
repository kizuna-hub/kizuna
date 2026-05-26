'use client';

import React from 'react';
import WorkspaceSidebar from './sidebar';
import Header from './header';

export default function WorkspaceLayout({
    children,
    projectId, // Hứng projectId từ cha truyền xuống
}: {
    children: React.ReactNode;
    projectId: string; // Khai báo type
}) {
    return (
        <div className="min-h-screen bg-zinc-50 font-sans selection:bg-[#16452a]/20 flex">

            {/* 1. Sidebar Fixed bên trái (Ném projectId vào đây) */}
            <WorkspaceSidebar projectId={projectId} />

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