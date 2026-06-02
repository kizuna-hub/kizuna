'use client';

import React, { useState } from 'react';
import AIThesisSetup from '@/components/investor/investor-dashboard/ai-sourcing-radar';
import { InvestorSidebar } from '@/components/investor/investor-sidebar';

export default function SourcingPage() {
    const [activeIndustry, setActiveIndustry] = useState('All');

    return (
        <div className="flex h-screen bg-[#fafafa] overflow-hidden">
            <InvestorSidebar
                activeIndustry={activeIndustry}
                setActiveIndustry={setActiveIndustry}
            />
            <main className="flex-1 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <AIThesisSetup />
            </main>
        </div>
    );
}
