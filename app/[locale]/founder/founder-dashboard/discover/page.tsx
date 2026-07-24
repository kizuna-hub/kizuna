import React from "react";
import { DashboardSidebar } from "@/features/founder/dashboard-sidebar";
import { DiscoverMain } from "@/features/founder/founder-dashboard/main/discover";

export const metadata = {
    title: "Discover | Founder Workspace",
};

export default function DiscoverPage() {
    return (
        <div className="min-h-screen w-full bg-canvas font-body text-ink">
            <div className="hidden md:block">
                <DashboardSidebar />
            </div>
            <main className="min-w-0 px-4 py-5 md:ml-[260px] md:px-8 md:py-8">
                <div className="w-full">
                    <DiscoverMain />
                </div>
            </main>
        </div>
    );
}
