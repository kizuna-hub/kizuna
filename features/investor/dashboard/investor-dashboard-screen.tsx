"use client";

import React, { useState } from 'react';
import { Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { InvestorSidebar } from '@/components/investor/investor-sidebar';
import { InvestorTopbar } from '@/components/investor/investor-dashboard/investor-topbar';
import { InvestorMetrics } from '@/components/investor/investor-dashboard/investor-metrics';
import { DealListTable } from '@/components/investor/investor-dashboard/deal-list-table';
import { ProjectDetailModal } from '@/components/investor/investor-dashboard/project-detail-modal';
import { usePaywall } from '@/components/ui/upgrade-modal';
import type { InvestorTier } from '@/lib/subscription-tiers';

// ── Tier Context (in production, pull from auth session/cookie) ───
// Switch this to 'angel' to test the paywall UI
const MOCK_USER_TIER: InvestorTier = 'vc_enterprise';

export function InvestorDashboardScreen() {
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [activeIndustry, setActiveIndustry] = useState('AI / ML');
    const [selectedProject, setSelectedProject] = useState<any>(null);

    // Real paywall — replaces alert()
    const { triggerPaywall, PaywallModalElement } = usePaywall();

    const userTier = MOCK_USER_TIER;

    const handleLockedFeature = () => {
        triggerPaywall({
            title: 'Pro-Rata Simulator & Team Collaboration',
            description: 'Nâng cấp lên VC Enterprise để mở khoá bộ công cụ đầu tư chuyên nghiệp đầy đủ.',
            targetTier: 'vc_enterprise',
        });
    };

    return (
        <div className="flex h-screen w-full bg-white overflow-hidden font-sans selection:bg-[#102c1e]/20">

            <InvestorSidebar
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                activeIndustry={activeIndustry}
                setActiveIndustry={setActiveIndustry}
            />

            <div className="flex-1 flex flex-col min-w-0 bg-zinc-50/50">
                <InvestorTopbar />

                <main className="flex-1 overflow-y-auto p-6 md:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-1">Deal Sourcing</h1>
                            <p className="text-sm font-medium text-zinc-500">Khám phá, ưu tiên và ra quyết định đầu tư dễ dàng.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={userTier !== 'vc_enterprise' ? handleLockedFeature : undefined}
                                className="h-10 rounded-full border-zinc-200 text-zinc-600 font-bold text-xs bg-white shadow-sm hover:bg-zinc-50"
                            >
                                <Download className="w-3.5 h-3.5 mr-2" /> Export
                            </Button>
                            <Button className="h-10 rounded-full bg-[#102c1e] hover:bg-[#0a1c13] text-white font-bold text-xs shadow-md">
                                <Plus className="w-3.5 h-3.5 mr-2" /> Tạo Alert Radar
                            </Button>
                        </div>
                    </div>

                    <InvestorMetrics />
                    <DealListTable onViewProject={setSelectedProject} />
                </main>
            </div>

            <ProjectDetailModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
                userTier={userTier}
                onTriggerPaywall={handleLockedFeature}
            />

            {/* Real upgrade modal (replaces alert()) */}
            {PaywallModalElement}
        </div>
    );
}