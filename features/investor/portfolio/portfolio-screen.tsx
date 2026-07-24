'use client';

import React, { useState } from 'react';
import PortfolioCommandCenter from '@/components/investor/investor-dashboard/portfolio-command';
import { InvestorSidebar } from '@/components/investor/investor-sidebar';

export function PortfolioScreen() {
    const [activeIndustry, setActiveIndustry] = useState('All');

    return (
        <div className="flex h-screen bg-[#fafafa] overflow-hidden">
            <InvestorSidebar
                activeIndustry={activeIndustry}
                setActiveIndustry={setActiveIndustry}
            />
            <main className="flex-1 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <PortfolioCommandCenter />
            </main>
        </div>
    );
}
