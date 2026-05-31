import React from "react";
import { MentorDashboardSidebar } from "@/components/mentor/dashboard-sidebar";

export default function MentorDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex bg-[#fafafa] min-h-screen">
            <MentorDashboardSidebar />
            <div className="flex-1 ml-[260px]">
                {children}
            </div>
        </div>
    );
}