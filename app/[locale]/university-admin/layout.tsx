import React from "react";
import { AdminSidebar } from "@/components/university-admin/admin-sidebar";

export default function UniversityAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-50/50">
      {/* Sidebar cố định bên trái */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Placeholder (Có thể thêm avatar user, thông báo ở đây) */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-end px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-zinc-700">Ban Giám Hiệu - ĐH Bách Khoa</span>
            <div className="w-8 h-8 rounded-full bg-kizuna-primary text-white flex items-center justify-center font-bold">
              B
            </div>
          </div>
        </header>

        {/* Khu vực render page.tsx */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}