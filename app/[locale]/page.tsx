import React from "react";
// Nhớ check lại đường dẫn import Sidebar cho đúng với cấu trúc thư mục của mày nhé
import { DashboardSidebar } from "@/components/founder/dashboard-sidebar";
import { MainFeed } from "@/components/founder/founder-dashboard/public/feed";

export default function Home() {
    return (
        // Set nền tổng thể cho Main Feed là #fafafa để làm nổi bật các thẻ Bento trắng
        <div className="flex min-h-screen w-full bg-[#fafafa]">

            {/* 1. Thanh Sidebar cố định bên trái (Đã code xong, nó chiếm 260px) */}
            <DashboardSidebar />

            {/* 2. Khu vực nội dung chính: Dùng ml-[260px] để né cái Sidebar ra */}
            <main className="flex-1 ml-[260px] flex flex-col relative min-h-screen">

                {/* Thêm padding (p-6 hoặc p-8) để Main Feed không bị dính sát vào mép màn hình và Sidebar */}
                <div className="w-full h-full p-6 md:p-8">
                    <MainFeed />
                </div>

            </main>

        </div>
    );
}