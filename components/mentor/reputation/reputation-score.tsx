'use client';

import React, { useState } from 'react';
import {
    Star, TrendingUp, Users, ArrowUpRight, Shield, Zap,
    Award, CheckCircle2, Lock, ExternalLink, BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── MOCK DATA ────────────────────────────────────────────────────
const REPUTATION_DATA = {
    score: 73,
    level: 'Rising Star',
    nextLevel: 'Trusted Advisor',
    nextThreshold: 80,
    totalIntros: 18,
    successfulIntros: 9,
    conversionRate: 50,
    totalMentees: 12,
    activeMentees: 5,
    avgMenteeHealth: 7.8,
    dealCreditEarned: 3,  // warm intros that led to investment
    totalVestedEquity: '$267,500',
};

const BADGE_MILESTONES = [
    {
        id: 'first-intro',
        name: 'Warm Introducer',
        icon: '🤝',
        description: 'Tạo Warm Intro đầu tiên thành công',
        threshold: 1,
        current: 9,
        earned: true,
    },
    {
        id: 'deal-maker',
        name: 'Deal Catalyst',
        icon: '⚡',
        description: '3 Warm Intros dẫn đến đầu tư thực tế',
        threshold: 3,
        current: 3,
        earned: true,
    },
    {
        id: 'vc-network',
        name: 'VC Network',
        icon: '🌐',
        description: 'Reputation Score ≥ 80 + 5 deal credits',
        threshold: 80,
        current: 73,
        earned: false,
        locked: true,
    },
    {
        id: 'top-mentor',
        name: 'Top 10% Mentor',
        icon: '🏆',
        description: 'Nằm trong top 10% mentor toàn nền tảng',
        threshold: 90,
        current: 73,
        earned: false,
        locked: true,
    },
];

const RECENT_ACTIVITY = [
    { id: 1, type: 'intro_success', text: 'Warm Intro đến Nexus Capital đã được VC xem', time: '2 ngày trước', points: +5 },
    { id: 2, type: 'mentee_milestone', text: 'DietFit AI (mentee) đạt milestone MVP', time: '5 ngày trước', points: +3 },
    { id: 3, type: 'fast_signed', text: 'Ký FAST với startup SnapMoney', time: '1 tuần trước', points: +2 },
    { id: 4, type: 'intro_deal', text: '🎉 Kizuna Hub nhận được đầu tư từ Warm Intro của bạn!', time: '2 tuần trước', points: +15 },
    { id: 5, type: 'session', text: 'Hoàn thành 3 buổi mentoring tuần này', time: '2 tuần trước', points: +3 },
];

// ── SCORE RING ───────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
    const r = 54;
    const circumference = 2 * Math.PI * r;
    const progress = (score / 100) * circumference;

    return (
        <div className="relative w-40 h-40">
            <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
                {/* Track */}
                <circle cx="64" cy="64" r={r} fill="none" stroke="#102c1e" strokeOpacity="0.08" strokeWidth="10" />
                {/* Progress */}
                <circle
                    cx="64" cy="64" r={r}
                    fill="none"
                    stroke="#a1e2b6"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${progress} ${circumference}`}
                    className="transition-all duration-1000"
                />
                {/* Milestone marker at 80 */}
                <circle
                    cx={64 + r * Math.cos(2 * Math.PI * 0.8 - Math.PI / 2)}
                    cy={64 + r * Math.sin(2 * Math.PI * 0.8 - Math.PI / 2)}
                    r="5"
                    fill="white"
                    stroke="#102c1e"
                    strokeWidth="2"
                />
            </svg>
            {/* Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-4xl font-black text-[#102c1e] leading-none">{score}</span>
                <span className="font-geist text-[9px] font-bold text-[#102c1e]/40 uppercase tracking-widest mt-1">/ 100</span>
            </div>
        </div>
    );
}

// ── MAIN ─────────────────────────────────────────────────────────
export default function MentorReputationScore() {
    const data = REPUTATION_DATA;
    const toNextLevel = data.nextThreshold - data.score;

    return (
        <div className="min-h-screen w-full bg-[#fafafa] p-6 md:p-8 lg:p-10 font-inter">
            <div className="mx-auto max-w-5xl space-y-8">

                {/* HEADER */}
                <header className="pt-6 pb-4 border-b border-[#102c1e]/10">
                    <h1 className="font-outfit font-black text-[#102c1e] text-4xl tracking-tight">Reputation Score</h1>
                    <p className="font-inter text-slate-500 mt-2">
                        Uy tín của bạn trên Kizuna Hub — được tính dựa trên chất lượng mentoring, warm intro và deal attribution.
                    </p>
                </header>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT: Score Card */}
                    <div className="lg:col-span-4 bg-[#102c1e] rounded-3xl p-8 text-white flex flex-col items-center gap-6">
                        <ScoreRing score={data.score} />

                        <div className="text-center">
                            <p className="font-geist text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Cấp độ hiện tại</p>
                            <h2 className="font-outfit font-black text-2xl text-white">{data.level}</h2>
                        </div>

                        {/* Next Level Progress */}
                        <div className="w-full bg-white/10 rounded-2xl p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-geist text-xs font-bold text-white/60">→ {data.nextLevel}</span>
                                <span className="font-mono text-xs font-black text-[#a1e2b6]">{toNextLevel} điểm nữa</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-[#a1e2b6] transition-all duration-700"
                                    style={{ width: `${(data.score / data.nextThreshold) * 100}%` }}
                                />
                            </div>
                            <p className="font-geist text-[9px] text-white/40 mt-2">
                                Đạt {data.nextThreshold}+ để mở khoá VC Network Badge và Early Access Deal Flow
                            </p>
                        </div>

                        {/* Quick Stats */}
                        <div className="w-full space-y-2">
                            {[
                                { label: 'Warm Intro thành công', value: `${data.successfulIntros}/${data.totalIntros}`, icon: TrendingUp },
                                { label: 'Deal Credit tích lũy', value: `${data.dealCreditEarned} deals`, icon: Zap },
                                { label: 'Mentee Health Score', value: `${data.avgMenteeHealth}/10`, icon: Users },
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2.5">
                                    <div className="flex items-center gap-2">
                                        <stat.icon className="w-3.5 h-3.5 text-[#a1e2b6]" />
                                        <span className="font-geist text-xs text-white/70">{stat.label}</span>
                                    </div>
                                    <span className="font-mono text-xs font-black text-white">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Badges + Activity */}
                    <div className="lg:col-span-8 flex flex-col gap-6">

                        {/* BADGES */}
                        <div className="bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-outfit font-black text-[#102c1e] text-xl">Huy hiệu & Thành tựu</h3>
                                <span className="font-geist text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    {BADGE_MILESTONES.filter(b => b.earned).length}/{BADGE_MILESTONES.length} đạt được
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {BADGE_MILESTONES.map((badge) => (
                                    <div
                                        key={badge.id}
                                        className={cn(
                                            'rounded-2xl p-4 border transition-all',
                                            badge.earned
                                                ? 'bg-[#102c1e] border-[#102c1e] text-white'
                                                : 'bg-[#fafafa] border-[#102c1e]/8 text-[#102c1e]/40'
                                        )}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="text-2xl">{badge.icon}</span>
                                            {badge.earned ? (
                                                <CheckCircle2 className="w-4 h-4 text-[#a1e2b6]" />
                                            ) : (
                                                <Lock className="w-4 h-4 opacity-40" />
                                            )}
                                        </div>
                                        <p className={cn('font-outfit font-black text-sm', badge.earned ? 'text-white' : 'text-[#102c1e]/40')}>
                                            {badge.name}
                                        </p>
                                        <p className={cn('font-inter text-[11px] mt-1 leading-tight', badge.earned ? 'text-white/60' : 'text-slate-400')}>
                                            {badge.description}
                                        </p>

                                        {/* Progress for locked badges */}
                                        {!badge.earned && typeof badge.threshold === 'number' && (
                                            <div className="mt-3">
                                                <div className="h-1 rounded-full bg-[#102c1e]/10 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-[#102c1e]/30"
                                                        style={{ width: `${Math.min(100, (badge.current / badge.threshold) * 100)}%` }}
                                                    />
                                                </div>
                                                <p className="font-mono text-[9px] text-slate-400 mt-1">
                                                    {badge.current} / {badge.threshold}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ACTIVITY FEED */}
                        <div className="bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm p-6">
                            <h3 className="font-outfit font-black text-[#102c1e] text-xl mb-5">
                                Hoạt động gần đây
                                <span className="ml-2 font-geist text-sm font-bold text-slate-400">— tích lũy điểm</span>
                            </h3>

                            <div className="space-y-3">
                                {RECENT_ACTIVITY.map((act) => (
                                    <div
                                        key={act.id}
                                        className="flex items-center justify-between p-3 rounded-xl hover:bg-[#fafafa] transition-colors group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={cn(
                                                'w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                                                act.type === 'intro_deal'
                                                    ? 'bg-[#a1e2b6]/20 border border-[#a1e2b6]/30'
                                                    : 'bg-[#102c1e]/5 border border-[#102c1e]/8'
                                            )}>
                                                {act.type === 'intro_deal' ? (
                                                    <Star className="w-3.5 h-3.5 text-[#102c1e]" fill="#a1e2b6" />
                                                ) : act.type === 'fast_signed' ? (
                                                    <Shield className="w-3.5 h-3.5 text-[#102c1e]/50" />
                                                ) : (
                                                    <BarChart3 className="w-3.5 h-3.5 text-[#102c1e]/50" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-inter text-sm text-[#102c1e] leading-snug">{act.text}</p>
                                                <p className="font-geist text-[10px] text-slate-400 mt-0.5">{act.time}</p>
                                            </div>
                                        </div>
                                        <span className={cn(
                                            'font-mono text-xs font-black shrink-0 ml-4',
                                            act.points >= 10 ? 'text-[#102c1e]' : 'text-[#102c1e]/50'
                                        )}>
                                            +{act.points} pts
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* DEAL ATTRIBUTION (tracked warm intro conversions) */}
                <div className="bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="font-outfit font-black text-[#102c1e] text-xl">Deal Attribution</h3>
                            <p className="font-inter text-sm text-slate-500 mt-1">
                                Theo dõi các Warm Intro của bạn đã chuyển thành đầu tư thực sự.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-[#a1e2b6]/15 border border-[#a1e2b6]/30 px-3 py-1.5 rounded-xl">
                            <Zap className="w-4 h-4 text-[#102c1e]" />
                            <span className="font-geist text-sm font-black text-[#102c1e]">{data.dealCreditEarned} Deal Credits</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { startup: 'Kizuna Hub', vc: 'Kizuna Ventures', amount: '$500K', date: 'Jan 2025', status: 'Closed' },
                            { startup: 'DietFit AI', vc: 'Mekong Capital', amount: '$200K', date: 'Mar 2025', status: 'Closed' },
                            { startup: 'SnapMoney', vc: 'Nextrans', amount: '$350K', date: 'May 2025', status: 'In DD' },
                        ].map((deal, i) => (
                            <div key={i} className="bg-[#fafafa] rounded-2xl border border-[#102c1e]/8 p-4 hover:border-[#102c1e]/20 transition-all group cursor-default">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="font-geist font-black text-sm text-[#102c1e]">{deal.startup}</p>
                                        <p className="font-inter text-xs text-slate-400 mt-0.5">{deal.vc}</p>
                                    </div>
                                    <span className={cn(
                                        'font-geist text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full',
                                        deal.status === 'Closed'
                                            ? 'bg-[#a1e2b6]/20 text-[#102c1e]'
                                            : 'bg-[#102c1e]/8 text-slate-500'
                                    )}>
                                        {deal.status}
                                    </span>
                                </div>
                                <p className="font-mono font-black text-xl text-[#102c1e]">{deal.amount}</p>
                                <p className="font-geist text-[10px] text-slate-400 mt-1">{deal.date}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* HOW SCORE IS CALCULATED */}
                <div className="bg-[#102c1e]/[0.02] border border-[#102c1e]/8 rounded-2xl p-5">
                    <h4 className="font-geist font-black text-[#102c1e] text-sm mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Cách tính Reputation Score
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { factor: 'Warm Intro → Viewed', weight: '15 pts/event' },
                            { factor: 'Warm Intro → Investment', weight: '25 pts/deal' },
                            { factor: 'Mentee Milestone', weight: '5 pts/event' },
                            { factor: 'FAST Signed', weight: '10 pts/contract' },
                        ].map((f, i) => (
                            <div key={i} className="bg-white rounded-xl border border-[#102c1e]/8 p-3">
                                <p className="font-inter text-xs text-slate-500">{f.factor}</p>
                                <p className="font-mono text-sm font-black text-[#102c1e] mt-1">{f.weight}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
