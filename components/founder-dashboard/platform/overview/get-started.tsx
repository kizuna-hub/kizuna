"use client";

import React from "react";
import { ChevronUp, Package, User, Trophy } from "lucide-react";
import { dashboardData } from "./data";

const iconMap: Record<string, any> = { Box: Package, User: User, Trophy: Trophy };

export function GetStarted() {
    return (
        <section className="mb-12 rounded-card border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
                        <Package className="h-4 w-4" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-[#081810]">Get started</h2>
                        <p className="text-xs font-medium text-slate-500">0/3 completed</p>
                    </div>
                </div>
                <button className="text-zinc-400 hover:text-slate-900 transition-colors">
                    <ChevronUp className="h-5 w-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dashboardData.getStarted.map((item) => {
                    const IconComponent = iconMap[item.icon];
                    return (
                        <div key={item.id} className="rounded-card border border-zinc-200 bg-zinc-50/50 p-5 flex flex-col gap-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-zinc-200 shadow-sm text-zinc-500">
                                <IconComponent className="h-4 w-4" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-[#081810] mb-1">{item.title}</h4>
                                <p className="text-xs font-medium text-slate-500 leading-relaxed">{item.desc}</p>
                            </div>
                            <button className="mt-auto w-fit rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-zinc-50 hover:border-zinc-300 transition-all">
                                {item.action}
                            </button>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}