"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { FounderRoadmap } from "./founder-roadmap";
import { PlatformShortcuts } from "./platform-shortcuts";
import { TractionLog } from "./traction-log";
// Gọi lại cái FeedWidgets mày đang tìm
import { FeedWidgets } from "./feed-widgets";

export function MainFeed() {
    return (
        <div className="w-full pb-20 bg-[#fafafa] font-sans selection:bg-[#a1e2b6]/30">
            {/* Phải để max-w-5xl thì cái Widget 320px ở dưới mới có đất diễn */}
            <main className="mx-auto mt-6 w-full max-w-5xl px-6 lg:px-8">

                {/* 1. Lời chào tinh gọn phong cách Eden */}
                <div className="flex flex-col items-center justify-center mb-14 mt-4">
                    <div className="flex items-center gap-2.5">
                        <Sparkles className="h-5 w-5 text-[#102c1e]" />
                        <h1 className="font-heading text-2xl md:text-3xl font-black text-[#102c1e] tracking-tight">
                            Ready when you are.
                        </h1>
                    </div>
                </div>

                {/* 2. Cột đôi CHIA CHÍNH XÁC 70% / 30% */}
                <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-8 items-start">
                    <FounderRoadmap />
                    <PlatformShortcuts />
                </div>

                {/* 3. Khối Dưới: Traction Log (trái) + Feed Widgets (phải 320px) */}
                <div className="mt-20 border-t border-[#102c1e]/10 pt-10">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px] items-start">
                        <TractionLog />
                        <FeedWidgets />
                    </div>
                </div>

            </main>
        </div>
    );
}