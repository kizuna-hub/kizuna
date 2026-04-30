"use client";
import React from "react";

export function AdminHeader() {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-2xl font-bold text-zinc-900">Tổng quan Hệ sinh thái</h1>
                <p className="text-sm text-zinc-500 mt-1">
                    Trung tâm điều hành Đổi mới sáng tạo Kizuna Hub
                </p>
            </div>
            <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-white border border-zinc-200 text-sm font-medium text-zinc-700 rounded-lg shadow-sm hover:bg-zinc-50 transition-colors">
                    Xuất báo cáo
                </button>
                <button className="px-4 py-2 bg-kizuna-primary text-sm font-medium text-white rounded-lg shadow-sm hover:bg-[#0a1f14] transition-colors">
                    Chính sách & Hỗ trợ
                </button>
            </div>
        </div>
    );
}