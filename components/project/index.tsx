"use client";

import React from "react";
// 1. Kéo cái Sidebar tổng của hệ thống vào
import { DashboardSidebar } from "@/features/founder/dashboard-sidebar";

import { ProjectHeader } from "./project-header";
import { ProjectSidebar } from "./project-sidebar";
import { ProjectContent } from "./project-content";
import { ProjectReviews } from "./project-reviews";
import { ProjectRelated } from "./project-related";

export function ProjectDetailsPage() {
    return (
        // Khung bọc ngoài cùng: Flex dàn ngang, nền sáng
        <div className="flex min-h-screen w-full bg-[#fafafa]">

            {/* Thanh điều hướng chính (Bám bên trái, chiếm 260px) */}
            <DashboardSidebar />

            {/* Vùng nội dung: Đẩy lề trái 260px (ml-[260px]) để không bị Sidebar đè lên */}
            <div className="flex-1 ml-[260px] flex flex-col relative min-h-screen pb-20 font-sans selection:bg-[#a1e2b6]/30">

                {/* Container chính của Project: Bóp thụt vào max-w-5xl */}
                <main className="mx-auto mt-8 w-full max-w-5xl px-6 lg:px-8">

                    {/* Layout Grid 2 cột: Cột trái tự do (1fr), Cột phải cố định (320px) */}
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">

                        {/* =======================================
                  CỘT TRÁI: NỘI DUNG CHI TIẾT DỰ ÁN
                  ======================================= */}
                        <div className="min-w-0 flex flex-col gap-12">

                            {/* Header: Logo, Tên, Ảnh Gallery */}
                            <ProjectHeader />

                            {/* Content: Mô tả chi tiết, Cập nhật (Timeline) */}
                            <ProjectContent />

                            {/* Reviews: Đánh giá & Bình luận */}
                            <ProjectReviews />

                            {/* Related: Dự án khác của Maker & Dự án liên quan */}
                            <ProjectRelated />

                        </div>

                        {/* =======================================
                  CỘT PHẢI: SIDEBAR PHỤ CHI TIẾT DỰ ÁN
                  ======================================= */}
                        <aside className="relative">
                            {/* ProjectSidebar được thiết kế sticky bên trong để khi cuộn trang nó luôn dính ở mắt */}
                            <ProjectSidebar />
                        </aside>

                    </div>
                </main>

            </div>
        </div>
    );
}
