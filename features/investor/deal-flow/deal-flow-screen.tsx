'use client';

import React, { useState } from 'react';
import DealFlowCRM from '@/components/investor/deal-flow-crm';
import { InvestorSidebar } from '@/components/investor/investor-sidebar';

export function DealFlowScreen() {
    const [activeIndustry, setActiveIndustry] = useState('All');

    return (
        <div className="flex h-screen bg-[#fafafa] overflow-hidden">
            <InvestorSidebar
                activeIndustry={activeIndustry}
                setActiveIndustry={setActiveIndustry}
            />

            <main className="flex-1 h-full overflow-hidden">
                <DealFlowCRM />
            </main>
        </div>
    );
}