"use client";

import React from "react";
import { Flame, ChevronRight, Star, MessageCircle } from "lucide-react";

export function FeedWidgets() {
    return (
        <div className="flex flex-col gap-8">
            {/* Activity Streak Widget */}
            <div>
                <h2 className="mb-4 text-sm font-bold text-[#081810]">Activity streak</h2>
                <div className="rounded-card border border-zinc-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                            <Flame className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                <span className="text-orange-600">1</span> consecutive days
                            </h3>
                            <p className="mt-0.5 text-xs font-medium text-slate-500">6 more days to reach the next milestone!</p>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between text-[10px] font-bold text-zinc-400">
                        <span className="text-orange-600">7</span>
                        <span>30</span>
                        <span>60</span>
                        <span>90</span>
                        <span>100</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                        <div className="h-full w-[15%] rounded-full bg-orange-500" />
                    </div>
                    <button className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900">
                        All achievements <ChevronRight className="h-3 w-3" />
                    </button>
                </div>
            </div>

            {/* Reviews Widget */}
            <div>
                <h2 className="mb-4 text-sm font-bold text-[#081810]">Kizuna Reviews</h2>
                <div className="flex flex-col gap-4 rounded-card border border-zinc-200 bg-white p-5 shadow-sm">
                    <div className="flex gap-3">
                        <div className="h-8 w-8 shrink-0 rounded-lg bg-blue-600" />
                        <div>
                            <p className="text-sm font-bold text-slate-900 leading-snug">Giải pháp tối ưu hóa trải nghiệm IOS</p>
                            <div className="mt-1 flex items-center gap-2 text-xs font-medium text-slate-500">
                                <span className="text-slate-700">LuvTK</span>
                                <Star className="h-3 w-3 text-zinc-300" /> 2
                                <MessageCircle className="h-3 w-3 text-zinc-300" /> 267
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="h-8 w-8 shrink-0 rounded-lg bg-emerald-600" />
                        <div>
                            <p className="text-sm font-bold text-slate-900 leading-snug">Đánh giá chi tiết nền tảng AI Roleplay</p>
                            <div className="mt-1 flex items-center gap-2 text-xs font-medium text-slate-500">
                                <span className="text-slate-700">Ngoc</span>
                                <Star className="h-3 w-3 text-zinc-300" /> 5
                                <MessageCircle className="h-3 w-3 text-zinc-300" /> 120
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}