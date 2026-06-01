'use client';

import React, { useState } from 'react';
import DealFlowCRM from '@/components/investor/deal-flow-crm';
import { InvestorSidebar } from '@/components/investor/investor-sidebar';

export default function InvestorDashboardPage() {
    const [activeMenu, setActiveMenu] = useState('deal-pipeline');
    const [activeIndustry, setActiveIndustry] = useState('All');

    return (
        <div className="flex h-screen bg-[#fafafa] overflow-hidden">
            <InvestorSidebar
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                activeIndustry={activeIndustry}
                setActiveIndustry={setActiveIndustry}
            />

            <main className="flex-1 h-full overflow-hidden">
                {activeMenu === 'deal-pipeline' && <DealFlowCRM />}
                {/* Fallback for other menus until implemented */}
                {activeMenu !== 'deal-pipeline' && (
                    <div className="flex items-center justify-center h-full font-geist text-slate-400">
                        {activeMenu} module coming soon...
                    </div>
                )}
            </main>
        </div>
    );
}