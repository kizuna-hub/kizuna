"use client";

import React from "react";
import { MessageSquare, Bell, ArrowUp } from "lucide-react";

export function BottomWidgets() {
    // Mock Data cho "You might be interested"
    const interests = [
        { name: "SnapWall", desc: "Nền tảng chia sẻ ảnh thời gian thực", claps: 28, logo: "S", color: "bg-blue-600" },
        { name: "Learn English with Meow", desc: "Học tiếng Anh miễn phí", claps: 19, logo: "M", color: "bg-pink-400" },
        { name: "GIAOVIECNGAY.VN", desc: "GIAO VIỆC QUA WEB - NHẬN VIỆC QUA ZALO", claps: 18, logo: "G", color: "bg-black" },
    ];

    // Mock Data cho "Contests"
    const contests = [
        { name: "Tools for Builders", status: "Sắp diễn ra", logo: "T" },
        { name: "The Weird and Wonderful", status: "Sắp diễn ra", logo: "W" },
    ];

    return (
        <div className="flex flex-col gap-8 mb-20">

            {/* Row 1: Interests & Contests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* You might be interested */}
                <section className="rounded-card border border-zinc-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-6 text-lg font-bold text-[#081810]">You might be interested</h3>
                    <div className="flex flex-col gap-5">
                        {interests.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 cursor-pointer group">
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white font-bold ${item.color}`}>
                                    {item.logo}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-[#081810] group-hover:text-[#16452a] truncate">{item.name}</h4>
                                    <p className="text-xs font-medium text-slate-500 truncate">{item.desc}</p>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-semibold text-zinc-500 shrink-0">
                                    <ArrowUp className="h-3.5 w-3.5" />
                                    <span>{item.claps}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contests */}
                <section className="rounded-card border border-zinc-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-[#081810]">Contests</h3>
                        <button className="text-xs font-semibold text-slate-500 hover:text-slate-900 underline underline-offset-4">View all</button>
                    </div>
                    <div className="flex flex-col gap-5">
                        {contests.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 cursor-pointer group">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 font-bold border border-orange-200">
                                    {item.logo}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-[#081810] group-hover:text-[#16452a] truncate">{item.name}</h4>
                                    <p className="text-xs font-bold text-blue-500 truncate">{item.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Row 2: Discussions & Activity (Empty States) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Discussions */}
                <section className="rounded-card border border-zinc-200 bg-white p-6 shadow-sm flex flex-col h-72">
                    <div className="mb-auto flex items-center justify-between">
                        <h3 className="text-lg font-bold text-[#081810]">Discussions about your products</h3>
                        <button className="text-xs font-semibold text-slate-500 hover:text-slate-900 underline underline-offset-4">View all</button>
                    </div>
                    <div className="flex flex-col items-center justify-center mb-8">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
                            <MessageSquare className="h-6 w-6 text-zinc-500" />
                        </div>
                        <h4 className="mb-2 text-sm font-bold text-[#081810]">No conversations yet</h4>
                        <p className="text-xs font-medium text-slate-500 text-center max-w-[250px]">
                            When the community discusses or asks questions about your products, conversations...
                        </p>
                    </div>
                </section>

                {/* Recent activity */}
                <section className="rounded-card border border-zinc-200 bg-white p-6 shadow-sm flex flex-col h-72">
                    <h3 className="mb-auto text-lg font-bold text-[#081810]">Recent activity</h3>
                    <div className="flex flex-col items-center justify-center mb-8">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
                            <Bell className="h-6 w-6 text-zinc-500" />
                        </div>
                        <h4 className="mb-2 text-sm font-bold text-[#081810]">No new activity</h4>
                        <p className="text-xs font-medium text-slate-500 text-center max-w-[250px]">
                            When the community comments, votes, or interacts with your products, notifications will...
                        </p>
                    </div>
                </section>

            </div>
        </div>
    );
}