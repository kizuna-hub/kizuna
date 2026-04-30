'use client';

import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { InvestorHeader } from '@/components/investor-dashboard/investor-header';
import { AdvancedFilters } from '@/components/investor-dashboard/advanced-filters';
import { InvestorMetricRibbon } from '@/components/investor-dashboard/investor-metric-ribbon';
import { DealFeedTable } from '@/components/investor-dashboard/deal-feed-table';
import { ProjectDetailDrawer } from '@/components/investor-dashboard/project-detail-drawer';

// Mock deal flow projects
const dealFlowProjects = [
    {
        id: '1',
        name: 'TrendEngine',
        logo: '🎓',
        school: 'Đại học Bách Khoa - ĐHĐN',
        industry: 'AI / FashionTech',
        metrics: '+5,000 lượt quét hàng tháng',
        ask: '$50K cho 10% Equity',
        stage: 'MVP',
        description: 'Nền tảng lộ trình học tập cá nhân hóa do AI thúc đẩy dành cho sinh viên STEM.',
        aiMatchScore: 94,
        ipSecured: true,
    },
    {
        id: '2',
        name: 'DUTCareers',
        logo: '🌾',
        school: 'Đại học Bách Khoa - ĐHĐN',
        industry: 'SaaS / EdTech',
        metrics: '10 Đối tác B2B',
        ask: '$30K cho 5% Equity',
        stage: 'Traction',
        description: 'Minh bạch chuỗi cung ứng dựa trên Blockchain cho các sản phẩm nông nghiệp.',
        aiMatchScore: 88,
        ipSecured: false,
    },
    {
        id: '3',
        name: 'Unburden',
        logo: '🚚',
        school: 'Đại học Bách Khoa - ĐHĐN',
        industry: 'AI / HealthTech',
        metrics: '+1.5K Người dùng tích cực',
        ask: '$75K cho 12% Equity',
        stage: 'Seed',
        description: 'Phần mềm quản lý đội xe điện tối ưu hóa giao hàng chặng cuối trong đô thị.',
        aiMatchScore: 92,
        ipSecured: true,
    }
];

export default function PremiumInvestorDashboard() {
    // State quản lý dự án đang được chọn để xem chi tiết
    const [selectedProject, setSelectedProject] = useState<any>(null);

    return (
        <div className="min-h-screen bg-kizuna-surface text-kizuna-text-main font-sans selection:bg-kizuna-primary/10">
            {/* 1. Header cố định phía trên */}
            <InvestorHeader />

            {/* 2. Bố cục chính của Dashboard */}
            <main className="px-8 py-8 flex gap-8 max-w-[1600px] mx-auto relative items-start">

                {/* Cột trái: Bộ lọc nâng cao (Cố định khi cuộn) */}
                <aside className="w-64 flex-none sticky top-28 h-fit self-start z-10 hidden lg:block">
                    <AdvancedFilters />
                </aside>

                {/* Cột phải: Nội dung chính (Metrics & Bảng danh sách) */}
                <div className="flex-1 min-w-0 space-y-6">

                    {/* Ribbon hiển thị các chỉ số quan trọng */}
                    <InvestorMetricRibbon />

                    {/* Tiêu đề bảng và Logic sắp xếp */}
                    <div className="flex items-center justify-between pt-2">
                        <h2 className="text-lg font-black text-kizuna-text-main flex items-center gap-2 uppercase tracking-tighter">
                            <BarChart3 className="w-5 h-5 text-kizuna-primary" />
                            Danh sách Deal thực tế
                        </h2>
                        <div className="flex items-center gap-2 text-kizuna-text-muted text-[11px] font-black uppercase tracking-widest">
                            Sắp xếp: <span className="text-kizuna-primary cursor-pointer hover:underline">Match Score</span>
                        </div>
                    </div>

                    {/* Bảng danh sách Startup */}
                    <DealFeedTable
                        projects={dealFlowProjects}
                        onViewProject={(project) => setSelectedProject(project)}
                    />
                </div>
            </main>

            {/* 3. Ngăn kéo (Drawer) hiển thị chi tiết dự án khi click */}
            <ProjectDetailDrawer
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </div>
    );
}