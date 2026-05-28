"use client";

import React from "react";
import { MessageSquarePlus, Heart, Rocket, Gift, Trophy, Flame, Target, Compass, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

export function TasksAndTips() {

    // Data cho Today's tasks
    const tasks = [
        { id: 1, title: "Tạo 1 Talk mới", points: "+20", icon: MessageSquarePlus },
        { id: 2, title: "Bật nhận cà phê hoặc thêm link donate", points: "+10", icon: Coffee },
        { id: 3, title: "Thích 2 Talk", points: "+5", icon: Heart },
        { id: 4, title: "Giới thiệu 1 sản phẩm hay", points: "", icon: Rocket },
        { id: 5, title: "Hoàn thành tất cả nhiệm vụ", points: "+100", icon: Gift },
    ];

    // Data cho Tips from Uni
    const tips = [
        {
            id: 1,
            content: "Còn 3 lượt xem nữa là bạn đạt cấp mới cho \"Nhà khám phá\"! 🏆",
            action: "Xem thành tích",
            icon: Trophy,
            iconColor: "text-amber-500",
            iconBg: "bg-amber-50"
        },
        {
            id: 2,
            content: "Streak 2 ngày! Đừng quên hoạt động hôm nay để duy trì nhé 🔥",
            action: "Khám phá",
            icon: Flame,
            iconColor: "text-red-500",
            iconBg: "bg-red-50"
        },
        {
            id: 3,
            content: "Thử thách hôm nay: Upvote 3 sản phẩm bạn thấy hay! 👍",
            action: "Khám phá",
            icon: Target,
            iconColor: "text-blue-500",
            iconBg: "bg-blue-50"
        },
        {
            id: 4,
            content: "Bạn chưa khám phá danh mục \"Âm nhạc & Audio\". Có thể có sản phẩm hay đang chờ bạn! 🧭",
            action: "Khám phá",
            icon: Compass,
            iconColor: "text-cyan-500",
            iconBg: "bg-cyan-50"
        },
    ];

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

            {/* 1. Today's tasks */}
            <div className="rounded-card border border-zinc-200 bg-white p-6 shadow-sm min-h-[300px]">
                <h3 className="text-base font-bold text-[#081810] mb-1">Today's tasks</h3>
                <p className="text-xs font-medium text-slate-500 mb-6">0/4 completed</p>

                {/* Render List Task */}
                <div className="flex flex-col">
                    {tasks.map((task, index) => {
                        const IconComponent = task.icon;
                        // Xác định xem có cần border-b không (bỏ border-b ở item cuối cùng)
                        const isLast = index === tasks.length - 1;

                        return (
                            <div
                                key={task.id}
                                className={cn(
                                    "flex items-center justify-between py-3.5 group cursor-pointer hover:bg-zinc-50 rounded-lg px-2 -mx-2 transition-colors",
                                    !isLast && "border-b border-zinc-100"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Icon Box */}
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-colors group-hover:bg-[#16452a]/10 group-hover:text-[#16452a]">
                                        <IconComponent className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700 group-hover:text-[#081810]">
                                        {task.title}
                                    </span>
                                </div>
                                {/* Điểm số (Nếu có) */}
                                {task.points && (
                                    <span className="text-sm font-bold text-emerald-600 shrink-0">
                                        {task.points}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 2. Tips from Uni */}
            <div className="rounded-card border border-zinc-200 bg-white p-6 shadow-sm min-h-[300px]">
                <h3 className="text-base font-bold text-[#081810] mb-6">Tips from Uni</h3>

                {/* Render List Tips */}
                <div className="flex flex-col">
                    {tips.map((tip, index) => {
                        const IconComponent = tip.icon;
                        const isLast = index === tips.length - 1;

                        return (
                            <div
                                key={tip.id}
                                className={cn(
                                    "flex items-center gap-4 py-4 group cursor-pointer",
                                    !isLast && "border-b border-zinc-100/80"
                                )}
                            >
                                {/* Icon nổi bật */}
                                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-0.5", tip.iconBg, tip.iconColor)}>
                                    <IconComponent className="h-4 w-4" />
                                </div>

                                {/* Content & Action */}
                                <div className="flex flex-1 items-center justify-between gap-4 min-w-0">
                                    <p className="text-sm font-medium text-slate-700 leading-snug group-hover:text-[#081810]">
                                        {tip.content}
                                    </p>
                                    <button className="text-xs font-semibold text-slate-500 hover:text-slate-900 whitespace-nowrap transition-colors">
                                        {tip.action}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Cập nhật hồ sơ (Phần tử tĩnh cuối cùng nếu cần, hiện tại đã tích hợp vào mock data trên) */}
            </div>

        </section>
    );
}