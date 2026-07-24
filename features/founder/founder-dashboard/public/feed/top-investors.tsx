"use client";

import React from "react";
import { Briefcase, ArrowRight } from "lucide-react";
import { topInvestors } from "./data";
import { cn } from "@/lib/utils";

export function TopInvestors() {
    return (
        <section className="mt-16 w-full border-t border-[#102c1e]/10 pt-12">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black font-heading text-[#102c1e]">Active Investors</h2>
                    <p className="mt-1 text-sm font-medium text-slate-500 font-sans">
                        Các quỹ VC và Angel Investor đang chủ động giải ngân trên nền tảng.
                    </p>
                </div>
                <button className="text-sm font-bold font-sans text-slate-500 hover:text-[#102c1e] underline underline-offset-4 transition-colors">
                    Gửi Pitch Deck
                </button>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                {topInvestors.map((investor) => (
                    <div
                        key={investor.id}
                        className="group flex flex-col justify-between rounded-2xl border border-[#102c1e]/10 bg-white p-6 shadow-sm transition-all hover:border-[#102c1e]/30 hover:shadow-md cursor-pointer"
                    >
                        <div className="flex items-center gap-4 mb-5">
                            <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-xl font-bold text-white shadow-inner font-sans", investor.color)}>
                                {investor.logo}
                            </div>
                            <div>
                                <h3 className="font-bold font-sans text-[#102c1e]">{investor.name}</h3>
                                <span className="mt-1 inline-block rounded bg-[#102c1e]/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#102c1e] font-sans">
                                    {investor.type}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center text-sm font-sans">
                                <span className="font-medium text-slate-500">Giai đoạn</span>
                                <span className="font-bold text-[#102c1e] text-xs">{investor.stage}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-sans">
                                <span className="font-medium text-slate-500">Ticket Size</span>
                                <span className="font-mono font-bold text-[#102c1e]">{investor.ticket}</span>
                            </div>
                        </div>

                        {/* Nút Pitch lật màu mượt mà */}
                        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#fafafa] py-3 text-sm font-bold text-[#102c1e] transition-colors group-hover:bg-[#102c1e] group-hover:text-[#fafafa] font-sans">
                            Pitch ngay <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}