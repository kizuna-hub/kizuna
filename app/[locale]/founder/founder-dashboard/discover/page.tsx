import React from "react";
import { DashboardSidebar } from "@/components/founder/dashboard-sidebar";
import { DiscoverMain } from "@/components/founder/founder-dashboard/main/discover";

export const metadata = {
    title: "Discover | Founder Workspace",
};

export default function DiscoverPage() {
    return (
        <div className="flex min-h-screen w-full bg-[#fafafa]">
            <DashboardSidebar />
            <main className="flex-1 ml-[260px] flex flex-col relative min-h-screen">
                <div className="w-full h-full p-6 md:p-8 lg:p-10">
                    <DiscoverMain />
                </div>
            </main>
        </div>
    );
}