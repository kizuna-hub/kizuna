"use client";

import React from "react";
import { Briefcase, ArrowRight } from "lucide-react";
import { topInvestors } from "./data";
import { cn } from "@/lib/utils";

export function TopInvestors() {
    return (
        <section className="mt-16 w-full border-t border-zinc-200 pt-12">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-[#081810]">Active Investors</h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                        Các quỹ VC và Angel Investor đang chủ động giải ngân trên nền tảng.
                    </p>
                </div>
                <button className="text-sm font-semibold text-slate-500 hover:text-[#081810] underline underline-offset-4 transition-colors">
                    Gửi Pitch Deck
                </button>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                {topInvestors.map((investor) => (
                    <div
                        key={investor.id}
                        className="group flex flex-col justify-between rounded-card border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md cursor-pointer"
                    >
                        <div className="flex items-center gap-4 mb-5">
                            <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-card text-xl font-bold text-white shadow-inner", investor.color)}>
                                {investor.logo}
                            </div>
                            <div>
                                <h3 className="font-bold text-[#081810]">{investor.name}</h3>
                                <span className="mt-1 inline-block rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    {investor.type}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-slate-500">Giai đoạn</span>
                                <span className="font-bold text-[#081810] text-xs">{investor.stage}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-slate-500">Ticket Size</span>
                                <span className="font-mono font-bold text-[#16452a]">{investor.ticket}</span>
                            </div>
                        </div>

                        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-card bg-zinc-50 py-3 text-sm font-bold text-[#081810] transition-colors group-hover:bg-[#16452a] group-hover:text-white">
                            Pitch ngay <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}