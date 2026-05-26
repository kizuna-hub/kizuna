"use client";

import React from "react";
import { Package, ArrowUp, Eye, Users } from "lucide-react";

export function OverviewStats() {
    const stats = [
        { label: "Products", value: "0", icon: Package },
        { label: "Upvotes", value: "0", icon: ArrowUp },
        { label: "Views", value: "0", icon: Eye },
        { label: "Followers", value: "0", icon: Users },
    ];

    return (
        <section className="mb-12">
            <h2 className="mb-6 text-xl font-bold text-[#081810]">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="rounded-card border border-zinc-200 bg-zinc-50/50 p-6 flex items-start justify-between shadow-sm">
                            <div>
                                <p className="text-xs font-semibold text-zinc-500 mb-2">{stat.label}</p>
                                <p className="text-3xl font-black text-[#081810]">{stat.value}</p>
                            </div>
                            <Icon className="h-5 w-5 text-zinc-400" />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}