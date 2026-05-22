"use client";

import React from "react";
import { FeedNavbar } from "./feed-navbar";
import { FeaturedBanner } from "./featured-banner";
import { TractionLog } from "./traction-log";
import { FeedWidgets } from "./feed-widgets";
import { TopMentors } from "./top-mentors";
import { TopInvestors } from "./top-investors";

export function MainFeed() {
    return (
        // Nền zinc-50 quý phái
        <div className="min-h-screen w-full bg-zinc-50 pb-20 font-sans selection:bg-[#16452a]/20">

            {/* 1. Header Component */}
            <FeedNavbar />

            <main className="mx-auto mt-10 w-full max-w-5xl px-6 lg:px-8">

                {/* 2. Banner Component */}
                <FeaturedBanner />

                {/* 3. Lưới 2 cột (Timeline & Widgets) */}
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
                    <TractionLog />
                    <FeedWidgets />
                </div>

                {/* 4. Các Section Mở rộng */}
                <TopMentors />
                <TopInvestors />

            </main>
        </div>
    );
}