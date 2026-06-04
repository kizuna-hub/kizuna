'use client';

import React from 'react';
import MentorNetworkDirectory from '@/components/investor/investor-dashboard/mentor-network';
import { InvestorSidebar } from '@/components/investor/investor-sidebar';

export default function MentorNetworkPage() {
    return (
        <div className="flex h-screen bg-[#fafafa] overflow-hidden">
            <InvestorSidebar />
            <main className="flex-1 h-full overflow-hidden">
                <MentorNetworkDirectory />
            </main>
        </div>
    );
}
