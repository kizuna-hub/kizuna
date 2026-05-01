'use client';

import { useState } from 'react';
import { Inbox, Users } from 'lucide-react';
import { MentorHeader } from '@/components/mentor-dashboard/mentor-header';
import { ReputationCard } from '@/components/mentor-dashboard/reputation-card';
import { ActiveMenteeCard } from '@/components/mentor-dashboard/active-mentee-card';
import { MatchmakingCard } from '@/components/mentor-dashboard/matchmaking-card';
import { CalendarSidebar } from '@/components/mentor-dashboard/calendar-sidebar';
import { ChartsSection } from '@/components/mentor-dashboard/charts-section';
import { FundingLeaderboard } from '@/components/mentor-dashboard/funding-leaderboard';
import { IPLedgerStream } from '@/components/mentor-dashboard/ip-ledger-stream';
import { HiddenGems } from '@/components/mentor-dashboard/hidden-gems';
import { ProjectDetailsDrawer } from '@/components/mentor-dashboard/project-details-drawer';
import { mentorProfile, matchmakingRequests, activeMentees } from './mock-data';

export default function MentorDashboard() {
    // State quản lý Drawer
    const [selectedProject, setSelectedProject] = useState<any>(null);

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans pb-20 selection:bg-[#00BFA5]/20">
            <MentorHeader />

            <main className="px-8 py-10 max-w-[1400px] mx-auto space-y-10">

                {/* SECTION 1: WORKSPACE & QUẢN LÝ */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Trái: Reputation & Mentee */}
                    <div className="lg:col-span-8 space-y-10">
                        <ReputationCard stats={mentorProfile.stats} />

                        <div className="space-y-6">
                            <h2 className="text-xl font-black text-[#1A1A1A] tracking-tighter flex items-center gap-3">
                                <Users className="w-6 h-6 text-[#16452a]" /> Workspace: Đang dẫn dắt
                            </h2>
                            <div className="grid gap-6">
                                {activeMentees.map(team => (
                                    <ActiveMenteeCard key={team.id} team={team} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Phải: Lời mời & Lịch hẹn */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="space-y-6">
                            <h2 className="text-xl font-black text-[#1A1A1A] tracking-tighter flex items-center gap-3">
                                <Inbox className="w-6 h-6 text-[#16452a]" /> Lời mời mới
                            </h2>
                            <div className="grid gap-6">
                                {matchmakingRequests.map(req => (
                                    <MatchmakingCard
                                        key={req.id}
                                        request={req}
                                        // Truyền function mở Drawer
                                        onViewDetails={() => setSelectedProject(req)}
                                    />
                                ))}
                            </div>
                        </div>

                        <CalendarSidebar />
                    </div>
                </div>

                {/* SECTION 2: DATA VISUALIZATION (CHARTS) */}
                <div className="pt-4 border-t border-[#e4e4e7]">
                    <ChartsSection />
                </div>

                {/* SECTION 3: THỊ TRƯỜNG & PHÁP LÝ */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-[#e4e4e7] pt-10">
                    <div className="lg:col-span-8">
                        {/* Thay thế Ecosystem Radar bằng Funding Leaderboard cực kỳ "khét" */}
                        <FundingLeaderboard />
                    </div>
                    <div className="lg:col-span-4">
                        <IPLedgerStream />
                    </div>
                </div>

                {/* SECTION 4: FOMO MỒI NHỬ ĐẦU TƯ */}
                <div className="pt-4">
                    <HiddenGems />
                </div>

            </main>

            {/* Render Drawer ở cấp Root */}
            <ProjectDetailsDrawer
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
                project={selectedProject}
            />
        </div>
    );
}