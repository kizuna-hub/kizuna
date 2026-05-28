"use client";

import React from "react";
import { DashboardSidebar } from "../../../dashboard-sidebar";
import { DashboardHeader } from "./dashboard-header";
import { LatestNews } from "./latest-news";
import { GetStarted } from "./get-started";
import { TasksAndTips } from "./tasks-and-tips";
// --- THÊM CÁC SECTION MỚI ---
import { OverviewStats } from "./statistics/overview-stats";
import { PerformanceCharts } from "./statistics/performance-charts";
import { StatusSuggestions } from "./status-suggestions";
import { BottomWidgets } from "./bottom-widgets";

export function FounderDashboard() {
    return (
        <div className="min-h-screen bg-zinc-50 font-sans selection:bg-[#16452a]/20 flex">

            {/* 1. Sidebar Fixed bên trái */}
            <DashboardSidebar />

            {/* 2. Main Content (Cách lề trái một khoảng bằng Sidebar 260px) */}
            <main className="flex-1 ml-[260px]">
                {/* Container nội dung */}
                <div className="mx-auto max-w-4xl px-2 py-6 flex flex-col gap-2">

                    {/* Header */}
                    <DashboardHeader />

                    {/* Section 1: Tin tức */}
                    <LatestNews />

                    {/* Section 2: Hướng dẫn */}
                    <GetStarted />

                    {/* Section 3: Tasks & Tips */}
                    <TasksAndTips />

                    {/* =========================================
              CÁC SECTION MỚI THEO ẢNH CỦA MÀY
              ========================================= */}

                    {/* Section 4: 4 Ô Tổng quan */}
                    <OverviewStats />

                    {/* Section 5: Biểu đồ Performance */}
                    <PerformanceCharts />

                    {/* Section 6: Khối Empty State bự chảng */}
                    {/* <StatusSuggestions /> */}

                    {/* Section 7: Các Grid phụ trợ ở dưới cùng */}
                    <BottomWidgets />

                </div>
            </main>
        </div>
    );
}