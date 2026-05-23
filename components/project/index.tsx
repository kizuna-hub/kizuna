"use client";

import React from "react";
// Import Navbar từ folder feed để đảm bảo tính đồng bộ của toàn bộ trang web
import { FeedNavbar } from "../public/feed/feed-navbar";

// Import các mảnh linh kiện của Project Page
import { ProjectHeader } from "./project-header";
import { ProjectSidebar } from "./project-sidebar";
import { ProjectContent } from "./project-content";
import { ProjectReviews } from "./project-reviews";
import { ProjectRelated } from "./project-related";

export function ProjectDetailsPage() {
    return (
        // Nền zinc-50 sang trọng, font sans hiện đại
        <div className="min-h-screen w-full bg-zinc-50 pb-20 font-sans selection:bg-[#16452a]/20">

            {/* 1. Thanh điều hướng dùng chung cho cả Hub */}
            <FeedNavbar />

            {/* 2. Container chính: Bóp thụt vào max-w-5xl theo yêu cầu của mày */}
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
              CỘT PHẢI: SIDEBAR (VOTE, MAKER, LINKS)
              ======================================= */}
                    <aside className="relative">
                        {/* ProjectSidebar được thiết kế sticky bên trong để khi cuộn trang nó luôn dính ở mắt */}
                        <ProjectSidebar />
                    </aside>

                </div>
            </main>
        </div>
    );
}