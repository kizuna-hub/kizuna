'use client';

import React from 'react';
import { VentureHeader } from '@/components/founder-workspace/venture-connect.tsx/venture-header';
import { ReadinessWidget } from '@/components/founder-workspace/venture-connect.tsx/readiness-widget';
import { MentorMatchGrid } from '@/components/founder-workspace/venture-connect.tsx/mentor-match-grid';
import { ConnectionPipeline } from '@/components/founder-workspace/venture-connect.tsx/connection-pipeline';
import { UpcomingEvents } from '@/components/founder-workspace/venture-connect.tsx/upcoming-events';
import { PioneerSpotlight } from '@/components/founder-workspace/venture-connect.tsx/pioneer-spotlight';

const topMatches = [
    { id: 1, name: 'Elena Rodriguez', role: 'Nhà sáng lập SaaS & Nhà đầu tư', matchScore: '98%', tier: 'Chuyên gia/CEO', tags: ['#SaaS', '#Định_giá'], socialProof: 'Hỗ trợ 5 dự án sinh viên', initials: 'ER' },
    { id: 2, name: 'TS. Trần Minh', role: 'Trưởng khoa CNTT', matchScore: '95%', tier: 'Giảng viên', tags: ['#Fintech', '#NQ54'], socialProof: 'Mentor 2 dự án giải Nhất', initials: 'TM' },
    { id: 3, name: 'Lê Hoàng', role: 'Co-founder X-Tech', matchScore: '92%', tier: 'Pioneer Founder', tags: ['#B2B', '#AI_Agent'], socialProof: 'Đã xác thực IP Ledger', initials: 'LH' }
];

export default function VentureConnectDashboard() {
    return (
        <div className="min-h-screen bg-kizuna-surface pt-10 px-4 md:px-8 pb-16 animate-in fade-in duration-500">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                    <VentureHeader />
                    <ReadinessWidget />
                </div>

                {/* Main Content Grid */}
                <MentorMatchGrid matches={topMatches} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <ConnectionPipeline />
                    </div>
                    <div className="lg:col-span-1">
                        <UpcomingEvents />
                    </div>
                </div>

                <PioneerSpotlight />
            </div>
        </div>
    );
}