'use client';

import { useState } from 'react';
import { BarChart3, LayoutDashboard } from 'lucide-react';
import { InvestorHeader } from '@/components/investor-dashboard/investor-header';
import { AdvancedFilters, FiltersState } from '@/components/investor-dashboard/advanced-filters';
import { InvestorMetricRibbon } from '@/components/investor-dashboard/investor-metric-ribbon';
import { DealFeedTable } from '@/components/investor-dashboard/deal-feed-table';
import { ProjectDetailDrawer } from '@/components/investor-dashboard/project-detail-drawer';
import { KanbanBoard } from '@/components/investor-dashboard/kanban-board';

// Import 3 section vũ khí mới
import { ExclusiveVault } from '@/components/investor-dashboard/exclusive-vault';
import { MentorEndorsements } from '@/components/investor-dashboard/mentor-endorsements';
import { AITrendRadar } from '@/components/investor-dashboard/ai-trend-radar';

// Import mock data từ file tách rời
import { dealFlowProjects } from './mock-data';

export default function PremiumInvestorDashboard() {
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'board' | 'list'>('board');

    // State khởi tạo cho bộ lọc
    const [filters, setFilters] = useState<FiltersState>({
        industries: [],
        stage: 'Tất cả trạng thái',
        ipVerifiedOnly: false,
        need: 'all',
        fundingLimit: 5000 // Khởi tạo mốc tối đa là 5 Tỷ VNĐ
    });

    // 🚀 LOGIC BỘ LỌC CHÍNH THỨC
    const filteredProjects = dealFlowProjects.filter(project => {
        if (filters.ipVerifiedOnly && !project.ipSecured) return false;
        if (filters.stage !== 'Tất cả trạng thái' && project.stage !== filters.stage) return false;

        if (filters.industries.length > 0) {
            const projectTags = project.industry.split('/').map(i => i.trim());
            const hasMatchedTag = filters.industries.some(ind => projectTags.includes(ind.split(' / ')[0].trim()));
            if (!hasMatchedTag) return false;
        }

        if (filters.need !== 'all' && project.need !== filters.need) return false;
        if (project.need === 'funding' && project.fundingAmount > filters.fundingLimit) return false;

        return true;
    });

    return (
        <div className="min-h-screen bg-kizuna-surface text-kizuna-text-main font-sans selection:bg-kizuna-primary/10">
            <InvestorHeader viewMode={viewMode} setViewMode={setViewMode} />

            <main className="px-8 py-8 flex gap-8 max-w-[1600px] mx-auto relative items-start">
                <aside className="w-64 flex-none sticky top-28 h-fit self-start z-10 hidden lg:block">
                    <AdvancedFilters filters={filters} setFilters={setFilters} />
                </aside>

                <div className="flex-1 min-w-0 space-y-6">
                    <InvestorMetricRibbon />

                    <div className="flex items-center justify-between pt-2">
                        <h2 className="text-lg font-black text-kizuna-text-main flex items-center gap-2 uppercase tracking-tighter">
                            {viewMode === 'board' ? <LayoutDashboard className="w-5 h-5 text-kizuna-primary" /> : <BarChart3 className="w-5 h-5 text-kizuna-primary" />}
                            {viewMode === 'board' ? 'Deal Flow Pipeline' : 'Danh sách Deal thực tế'}
                        </h2>
                        <div className="flex items-center gap-2 text-kizuna-text-muted text-[11px] font-black uppercase tracking-widest">
                            Sắp xếp: <span className="text-kizuna-primary cursor-pointer hover:underline">Match Score</span>
                        </div>
                    </div>

                    {/* Vùng Render Pipeline chính */}
                    {viewMode === 'board' ? (
                        <KanbanBoard projects={filteredProjects} onViewProject={setSelectedProject} />
                    ) : (
                        <DealFeedTable projects={filteredProjects} onViewProject={setSelectedProject} />
                    )}

                    {/* 3 "VŨ KHÍ HẠNG NẶNG" ĐƯỢC CHÈN VÀO ĐÂY */}
                    <div className="pt-8">
                        <ExclusiveVault />
                        <MentorEndorsements />
                        <AITrendRadar />
                    </div>
                </div>
            </main>

            <ProjectDetailDrawer project={selectedProject} onClose={() => setSelectedProject(null)} />
        </div>
    );
}