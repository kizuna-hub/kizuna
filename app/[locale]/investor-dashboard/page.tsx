"use client";

import React, { useState } from 'react';
import { Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { InvestorSidebar } from '@/components/investor-dashboard/investor-sidebar';
import { InvestorTopbar } from '@/components/investor-dashboard/investor-topbar';
import { InvestorMetrics } from '@/components/investor-dashboard/investor-metrics';
import { DealListTable } from '@/components/investor-dashboard/deal-list-table';

export default function InvestorDashboardPage() {
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [activeIndustry, setActiveIndustry] = useState('AI / ML');

    return (
        // Root Container: Tràn viền màn hình 100%, không còn thẻ bo góc bên ngoài
        <div className="flex h-screen w-full bg-white overflow-hidden font-sans selection:bg-[#102c1e]/20">

            {/* Sidebar tĩnh bên trái */}
            <InvestorSidebar
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                activeIndustry={activeIndustry}
                setActiveIndustry={setActiveIndustry}
            />

            {/* Vùng Main Content bên phải */}
            <div className="flex-1 flex flex-col mx-auto max-w-5xl bg-zinc-50/50">
                <InvestorTopbar />

                {/* Vùng scroll cho dữ liệu chính */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                    {/* Header Action */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-1">Deal Sourcing</h1>
                            <p className="text-sm font-medium text-zinc-500">Khám phá, ưu tiên và ra quyết định đầu tư dễ dàng.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="h-10 rounded-full border-zinc-200 text-zinc-600 font-bold text-xs bg-white shadow-sm hover:bg-zinc-50">
                                <Download className="w-3.5 h-3.5 mr-2" /> Export
                            </Button>
                            <Button className="h-10 rounded-full bg-[#102c1e] hover:bg-[#0a1c13] text-white font-bold text-xs shadow-md">
                                <Plus className="w-3.5 h-3.5 mr-2" /> Tạo Alert Radar
                            </Button>
                        </div>
                    </div>

                    {/* Components Data */}
                    <InvestorMetrics />
                    <DealListTable />

                </main>
            </div>
        </div>
    );
}