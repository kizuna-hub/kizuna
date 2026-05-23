"use client";

import React from "react";
import { TrendingUp } from "lucide-react";

export function StatusSuggestions() {
    return (
        <section className="mb-12">
            <h2 className="mb-6 text-xl font-bold text-[#081810]">Status & suggestions</h2>
            <div className="flex flex-col items-center justify-center rounded-card border border-zinc-200 bg-white py-20 shadow-sm">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
                    <TrendingUp className="h-6 w-6 text-zinc-500" />
                </div>
                <h3 className="mb-2 text-base font-bold text-[#081810]">No stats yet</h3>
                <p className="text-sm font-medium text-slate-500 max-w-sm text-center">
                    When the community interacts with your products, key statistics will appear here
                </p>
            </div>
        </section>
    );
}