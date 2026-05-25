"use client";

import React, { useState } from 'react';
import { Filter, Lock, Zap, Briefcase, Users, HeartHandshake } from 'lucide-react';
import { cn } from "@/lib/utils";

// COMPONENT IMPORTS (Adjust paths based on your actual structure)
import { MentorMatchCard } from '@/components/founder-workspace/venture-connect/mentor-match-card';
import { ConnectionPipeline } from '@/components/founder-workspace/venture-connect/connection-pipeline';
import { UpcomingEvents } from '@/components/founder-workspace/venture-connect/upcoming-events';
import { PioneerSpotlight } from '@/components/founder-workspace/venture-connect/pioneer-spotlight';
import { PaywallModal } from '@/components/founder-workspace/ai-pitch-deck/paywall-modal'; // Tái sử dụng Paywall từ Pitch Deck hoặc copy ra folder shared

// --- MOCK DATA ---
const topMentors = [
    { id: 1, name: 'Dr. Alex Chen', role: 'SaaS Growth Expert / Ex-YC', matchScore: '96%', tier: 'Elite Mentor', tags: ['#B2B SaaS', '#Growth'], socialProof: 'Đã mentor 5 startup exit thành công', aiReason: "Mô hình B2B SaaS của bạn rất khớp với kinh nghiệm scale-up của Alex.", initials: 'AC' },
    { id: 2, name: 'Sarah Johnson', role: 'Tech Lead @ Stripe', matchScore: '92%', tier: 'Tech Advisor', tags: ['#Fintech', '#System Arch'], socialProof: 'Top 1% Mentor trên Kizuna Hub', aiReason: "Bạn đang cần xây dựng kiến trúc thanh toán, Sarah là chuyên gia hàng đầu.", initials: 'SJ' },
    { id: 3, name: 'David Vu', role: 'Founder & CEO CloudX', matchScore: '88%', tier: 'Pioneer Founder', tags: ['#Cloud', '#B2B'], socialProof: 'Gọi vốn Series A năm 2025', aiReason: "David vừa trải qua giai đoạn Seed, có thể chia sẻ bài học thực chiến.", initials: 'DV' }
];

export default function VentureConnectDashboard() {
    // --- STATES ---
    const [activeTab, setActiveTab] = useState<'mentor' | 'investor'>('mentor');
    const [connectionTokens, setConnectionTokens] = useState(1);
    const [paywall, setPaywall] = useState({ isOpen: false, title: "", desc: "" });

    const handleConnectClick = () => {
        if (connectionTokens <= 0) {
            setPaywall({
                isOpen: true,
                title: "Hết lượt Kết nối (Tokens)",
                desc: "Bạn đã dùng hết 3/3 lượt gửi yêu cầu kết nối của gói Basic tháng này. Nâng cấp <b>Premium</b> để mở khóa quyền kết nối <b>Vô hạn</b>."
            });
            return;
        }
        setConnectionTokens(prev => prev - 1);
        alert("Đã gửi yêu cầu kết nối thành công!");
    };

    const handleInvestorTabClick = () => {
        setPaywall({
            isOpen: true,
            title: "Khóa Tab Nhà Đầu Tư",
            desc: "Tính năng Investor Match chỉ dành cho tài khoản <b>Premium</b>. Thuật toán AI sẽ tự động phân tích Pitch Deck của bạn để tìm ra Top 3 Quỹ đầu tư giải ngân khớp nhất."
        });
    };

    return (
        <div className="min-h-screen pb-20 animate-in fade-in duration-300 relative max-w-6xl mx-auto">

            {/* --- HEADER TỔNG QUAN --- */}
            <div className="mb-8 flex flex-col lg:flex-row justify-between items-start gap-6">
                <div>
                    <h1 className="text-2xl font-black text-[#081810] flex items-center gap-2">
                        <HeartHandshake className="w-6 h-6 text-[#16452a]" /> Venture Connect
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Mạng lưới kết nối thông minh. Mở khóa tiềm năng dự án của bạn.</p>
                </div>

                {/* Token Stats */}
                <div className="bg-white border border-zinc-200 p-3 rounded-xl shadow-sm flex items-center gap-4 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100">
                        <Zap className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Connection Tokens</p>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-black text-[#081810] leading-none">{connectionTokens}</span>
                            <span className="text-xs font-semibold text-slate-500">/ 3 lượt</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- TABS NAVIGATION --- */}
            <div className="flex items-center border-b border-zinc-200 mb-8">
                <button
                    onClick={() => setActiveTab('mentor')}
                    className={cn(
                        "px-6 py-3 text-sm font-bold transition-all border-b-2",
                        activeTab === 'mentor' ? "border-[#16452a] text-[#16452a]" : "border-transparent text-slate-500 hover:text-slate-800"
                    )}
                >
                    <Users className="w-4 h-4 inline-block mr-2" /> Mentor Match
                </button>
                <button
                    onClick={handleInvestorTabClick}
                    className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-amber-600 transition-all border-b-2 border-transparent flex items-center gap-2"
                >
                    <Briefcase className="w-4 h-4" /> Investor Match <Lock className="w-3.5 h-3.5 text-amber-500" />
                </button>
            </div>

            {/* --- MAIN CONTENT (MENTOR TAB) --- */}
            {activeTab === 'mentor' && (
                <div className="space-y-10">

                    {/* Section 1: Top AI Matches */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-[#081810]">Top AI Matches</h2>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg shadow-sm">
                                <Filter className="w-3.5 h-3.5 text-zinc-400" />
                                <span className="text-xs font-bold text-slate-600">Mục tiêu: Gọi vốn Seed</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {topMentors.map((mentor) => (
                                <MentorMatchCard
                                    key={mentor.id}
                                    mentor={mentor}
                                    connectionTokens={connectionTokens}
                                    onConnect={handleConnectClick}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Section 2: Pipeline & Upcoming */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <ConnectionPipeline />
                        <UpcomingEvents />
                    </div>

                    {/* Section 3: Pioneer Spotlight */}
                    <PioneerSpotlight />
                </div>
            )}

            {/* --- MODAL PAYWALL --- */}
            <PaywallModal
                isOpen={paywall.isOpen}
                onClose={() => setPaywall({ ...paywall, isOpen: false })}
                title={paywall.title}
                description={paywall.desc}
            />
        </div>
    );
}