'use client';

import { useState } from 'react';
import { BarChart3, LayoutGrid, List } from 'lucide-react';
import { InvestorHeader } from '@/components/investor-dashboard/investor-header';
import { AdvancedFilters, FiltersState } from '@/components/investor-dashboard/advanced-filters';
import { InvestorMetricRibbon } from '@/components/investor-dashboard/investor-metric-ribbon';
import { DealFeedTable } from '@/components/investor-dashboard/deal-feed-table';
import { ProjectDetailDrawer } from '@/components/investor-dashboard/project-detail-drawer';
import { DealGridView } from '@/components/investor-dashboard/deal-grid-view';

// Nền tảng
import { ExclusiveVault } from '@/components/investor-dashboard/exclusive-vault';
import { MentorEndorsements } from '@/components/investor-dashboard/mentor-endorsements';
import { AITrendRadar } from '@/components/investor-dashboard/ai-trend-radar';

import { dealFlowProjects } from './mock-data';

export default function PremiumInvestorDashboard() {
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const [filters, setFilters] = useState<FiltersState>({
        industries: [],
        stage: 'all',
        ipVerifiedOnly: false,
        valMin: 1000,
        valMax: 50000,
        capitalMin: 0,
        capitalMax: 5000,
        aiScoreMin: 0
    });

    const filteredProjects = dealFlowProjects.filter(project => {
        if (filters.ipVerifiedOnly && !project.ipSecured) return false;
        if (filters.stage !== 'all' && project.stage !== filters.stage) return false;

        if (filters.industries.length > 0) {
            const projectTags = project.industry.split(/[\/\-]/).map((i: string) => i.trim());
            const hasMatchedTag = filters.industries.some(ind => projectTags.includes(ind));
            if (!hasMatchedTag) return false;
        }

        if (project.fundingAmount < filters.capitalMin) return false;
        if (project.valuation && project.valuation > filters.valMax) return false;
        if (project.aiMatchScore < filters.aiScoreMin) return false;

        return true;
    });

    return (
        <div className="min-h-screen bg-zinc-50/50 text-[#102c1e] font-sans selection:bg-[#102c1e]/10 pb-20">
            <InvestorHeader viewMode={viewMode} setViewMode={setViewMode} />

            <main className="px-8 py-8 flex gap-8 max-w-[1600px] mx-auto relative items-start">
                {/* ADVANCED AI FILTER SIDEBAR */}
                <aside className="w-64 flex-none sticky top-28 h-fit self-start z-10 hidden lg:block">
                    <AdvancedFilters filters={filters} setFilters={setFilters} />
                </aside>

                <div className="flex-1 min-w-0 space-y-8">
                    <InvestorMetricRibbon />

                    {/* DEAL FLOW VIEW TOGGLE HEADER */}
                    <div className="flex items-center justify-between pt-2 pb-2 border-b border-black/5 sticky top-24 bg-zinc-50/90 backdrop-blur z-20">
                        <h2 className="text-xl font-black text-[#102c1e] flex items-center gap-2 tracking-tighter">
                            {viewMode === 'grid' ? <LayoutGrid className="w-5 h-5" /> : <List className="w-5 h-5" />}
                            Deal Hub
                        </h2>
                        <div className="flex items-center gap-4">
                            <span className="text-zinc-500 text-xs font-bold">{filteredProjects.length} Deals</span>
                            <div className="flex items-center bg-black/5 p-1 rounded-xl">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#102c1e]' : 'text-zinc-500 hover:text-[#102c1e]'}`}
                                >
                                    <LayoutGrid className="w-3.5 h-3.5" /> Lưới
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#102c1e]' : 'text-zinc-500 hover:text-[#102c1e]'}`}
                                >
                                    <List className="w-3.5 h-3.5" /> Danh sách
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* MAIN EXECUTIONS */}
                    {viewMode === 'grid' ? (
                        <DealGridView projects={filteredProjects} onViewProject={setSelectedProject} />
                    ) : (
                        <DealFeedTable projects={filteredProjects} onViewProject={setSelectedProject} />
                    )}

                    <div className="pt-12 space-y-12">
                        {/* <ExclusiveVault /> */}
                        <MentorEndorsements />
                        <AITrendRadar />
                    </div>
                </div>
            </main>

            <ProjectDetailDrawer project={selectedProject} onClose={() => setSelectedProject(null)} />
        </div>
    );
}