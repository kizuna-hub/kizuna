"use client";

import React from "react";
import { Flame, ChevronRight, Star, MessageCircle } from "lucide-react";

export function FeedWidgets() {
    return (
        <div className="flex flex-col gap-8">

            {/* Activity Streak Widget */}
            <div>
                <h2 className="mb-4 text-sm font-black font-heading text-[#102c1e]">Activity streak</h2>
                <div className="rounded-2xl border border-[#102c1e]/10 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                        {/* Đổi nền icon sang tone màu chuẩn */}
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#102c1e]/5 text-[#102c1e]">
                            <Flame className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold font-sans text-[#102c1e]">
                                1 consecutive days
                            </h3>
                            <p className="mt-0.5 text-xs font-medium text-slate-500 font-sans">6 more days to reach the next milestone!</p>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between text-[10px] font-bold text-slate-400 font-sans">
                        <span className="text-[#102c1e]">7</span>
                        <span>30</span>
                        <span>60</span>
                        <span>90</span>
                        <span>100</span>
                    </div>
                    {/* Thanh tiến độ */}
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#102c1e]/10">
                        <div className="h-full w-[15%] rounded-full bg-[#102c1e]" />
                    </div>

                    <button className="mt-4 flex items-center gap-1 text-xs font-bold font-sans text-slate-500 hover:text-[#102c1e] transition-colors">
                        All achievements <ChevronRight className="h-3 w-3" />
                    </button>
                </div>
            </div>

            {/* Reviews Widget */}
            <div>
                <h2 className="mb-4 text-sm font-black font-heading text-[#102c1e]">Kizuna Reviews</h2>
                <div className="flex flex-col gap-4 rounded-2xl border border-[#102c1e]/10 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">

                    <div className="flex gap-3">
                        <div className="h-8 w-8 shrink-0 rounded-lg bg-[#102c1e]/10 border border-[#102c1e]/20" />
                        <div>
                            <p className="text-sm font-bold font-sans text-[#102c1e] leading-snug">Giải pháp tối ưu hóa trải nghiệm IOS</p>
                            <div className="mt-1 flex items-center gap-2 text-xs font-medium text-slate-500 font-sans">
                                <span className="text-slate-700">LuvTK</span>
                                <Star className="h-3 w-3 text-[#e88b5c]" /> 2
                                <MessageCircle className="h-3 w-3 text-slate-300" /> 267
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="h-8 w-8 shrink-0 rounded-lg bg-[#a1e2b6]/30 border border-[#a1e2b6]" />
                        <div>
                            <p className="text-sm font-bold font-sans text-[#102c1e] leading-snug">Đánh giá chi tiết nền tảng AI Roleplay</p>
                            <div className="mt-1 flex items-center gap-2 text-xs font-medium text-slate-500 font-sans">
                                <span className="text-slate-700">Ngoc</span>
                                <Star className="h-3 w-3 text-[#e88b5c]" /> 5
                                <MessageCircle className="h-3 w-3 text-slate-300" /> 120
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}