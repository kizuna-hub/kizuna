"use client";

import React from "react";

export function ProjectContent() {
    return (
        <div className="mb-16">
            {/* Description */}
            <div className="prose prose-zinc max-w-none text-slate-600">
                <p className="text-base font-medium leading-relaxed mb-6">
                    SNAPMONEY: Moments of Income and Expenditure is an application for recording financial transactions in a visual and modern style, helping users capture their daily financial moments through images and quick notes.
                </p>
                <p className="text-base font-medium leading-relaxed mb-4">
                    Instead of just entering dry figures, the application allows you to:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-base font-medium">
                    <li>Quickly capture a moment of spending or income.</li>
                    <li>Tag the amount, content, and categorize income and expenses.</li>
                </ul>

                <div className="mt-6 text-center">
                    <button className="rounded-full border border-zinc-200 bg-white px-6 py-2 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-zinc-50">
                        View more
                    </button>
                </div>
            </div>

            {/* Latest Updates Timeline */}
            <div className="mt-16">
                <h2 className="mb-6 text-xl font-bold text-[#081810]">Latest updates</h2>
                <div className="relative border-l border-zinc-200 pl-6 ml-3">
                    <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#16452a] ring-4 ring-zinc-50" />
                    <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-bold text-zinc-500">v1.0.0</span>
                            <span className="rounded bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Latest</span>
                            <span className="text-sm font-bold text-[#081810]">Phát hành sản phẩm</span>
                        </div>
                        <span className="text-xs font-semibold text-zinc-400">today</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-slate-600 max-w-2xl">
                        Chính thức ra mắt phiên bản đầu tiên, tập trung vào trải nghiệm ghi chép thu chi trực quan...
                    </p>
                </div>
            </div>
        </div>
    );
}