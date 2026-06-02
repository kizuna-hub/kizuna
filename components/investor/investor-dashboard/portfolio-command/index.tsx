'use client';

import React, { useState } from 'react';
import {
    TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
    Clock, Users, DollarSign, BarChart3, Activity, Calendar,
    ChevronRight, Bell, Plus, ArrowUpRight, Zap, FileText,
    Building2, Globe, Star, Target, Send, Filter, Inbox
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── TYPES ────────────────────────────────────────────────────────
type HealthLevel = 'healthy' | 'watch' | 'critical';

interface PortfolioCompany {
    id: string;
    name: string;
    logo: string;
    vertical: string;
    stage: string;
    invested: string;
    investedUSD: number;
    ownership: number;
    currentValuation: string;
    moicEstimate: number;
    healthLevel: HealthLevel;
    healthScore: number;
    runwayMonths: number;
    mrrGrowth: number;  // % MoM
    mrr: string;
    burnRate: string;
    lastUpdate: string;
    nextMilestone: string;
    mentor?: string;
    sparkline: number[];
    nextBoardMeeting?: string;
}

interface PortfolioEvent {
    id: string;
    company: string;
    logo: string;
    type: 'board-meeting' | 'report-due' | 'milestone' | 'alert';
    title: string;
    date: string;
    urgent?: boolean;
}

// ─── MOCK DATA ────────────────────────────────────────────────────
const PORTFOLIO: PortfolioCompany[] = [
    {
        id: 'p1', name: 'SnapMoney', logo: '💸', vertical: 'FinTech', stage: 'Series A',
        invested: '$500K', investedUSD: 500_000, ownership: 8.5,
        currentValuation: '$12M', moicEstimate: 2.1,
        healthLevel: 'healthy', healthScore: 88,
        runwayMonths: 18, mrrGrowth: 24, mrr: '$38K', burnRate: '$45K/mo',
        lastUpdate: '3 ngày trước', nextMilestone: 'Series B close Q3 2026',
        mentor: 'Nguyễn Tuấn',
        sparkline: [18, 22, 26, 30, 36, 38, 38],
        nextBoardMeeting: '15 Jun 2026',
    },
    {
        id: 'p2', name: 'EduPath AI', logo: '🎓', vertical: 'EdTech', stage: 'Seed',
        invested: '$200K', investedUSD: 200_000, ownership: 12.0,
        currentValuation: '$2.8M', moicEstimate: 1.68,
        healthLevel: 'watch', healthScore: 62,
        runwayMonths: 7, mrrGrowth: 8, mrr: '$12K', burnRate: '$30K/mo',
        lastUpdate: '1 tuần trước', nextMilestone: 'Reach 20K students (Aug 2026)',
        mentor: 'Hà Linh',
        sparkline: [10, 11, 10, 12, 11, 12, 12],
        nextBoardMeeting: '20 Jun 2026',
    },
    {
        id: 'p3', name: 'AgriSense', logo: '🌾', vertical: 'AgriTech', stage: 'Pre-Seed',
        invested: '$100K', investedUSD: 100_000, ownership: 15.0,
        currentValuation: '$800K', moicEstimate: 1.2,
        healthLevel: 'critical', healthScore: 38,
        runwayMonths: 3, mrrGrowth: -5, mrr: '$3K', burnRate: '$22K/mo',
        lastUpdate: '2 tuần trước', nextMilestone: 'Cần gọi vốn bridge URGENTLY',
        sparkline: [8, 7, 8, 6, 5, 4, 3],
        nextBoardMeeting: '10 Jun 2026',
    },
    {
        id: 'p4', name: 'HealthKit VN', logo: '🏥', vertical: 'HealthTech', stage: 'Seed',
        invested: '$300K', investedUSD: 300_000, ownership: 10.0,
        currentValuation: '$4.5M', moicEstimate: 1.5,
        healthLevel: 'healthy', healthScore: 79,
        runwayMonths: 14, mrrGrowth: 15, mrr: '$22K', burnRate: '$35K/mo',
        lastUpdate: '5 ngày trước', nextMilestone: 'Tích hợp BHYT số (Q4 2026)',
        sparkline: [12, 15, 17, 18, 20, 21, 22],
        nextBoardMeeting: '25 Jun 2026',
    },
];

const EVENTS: PortfolioEvent[] = [
    { id: 'e1', company: 'AgriSense', logo: '🌾', type: 'alert', title: 'Runway < 3 tháng — Cần hành động ngay', date: 'Hôm nay', urgent: true },
    { id: 'e2', company: 'EduPath AI', logo: '🎓', type: 'report-due', title: 'Báo cáo tháng 5 chưa nộp (7 ngày trễ)', date: 'Hôm nay', urgent: true },
    { id: 'e3', company: 'AgriSense', logo: '🌾', type: 'board-meeting', title: 'Board Meeting — Emergency Call', date: '10 Jun 2026', urgent: true },
    { id: 'e4', company: 'EduPath AI', logo: '🎓', type: 'board-meeting', title: 'Board Meeting Q2 Review', date: '20 Jun 2026' },
    { id: 'e5', company: 'SnapMoney', logo: '💸', type: 'milestone', title: 'Series B prep kick-off meeting', date: '15 Jun 2026' },
    { id: 'e6', company: 'HealthKit VN', logo: '🏥', type: 'board-meeting', title: 'Board Meeting — Q2 Review', date: '25 Jun 2026' },
];

// ─── HEALTH CONFIG ────────────────────────────────────────────────
const HEALTH: Record<HealthLevel, { label: string; dot: string; badge: string; border: string }> = {
    healthy: { label: 'Healthy', dot: 'bg-[#a1e2b6]', badge: 'bg-[#a1e2b6]/20 text-[#102c1e] border-[#a1e2b6]/30', border: 'border-l-[#a1e2b6]' },
    watch: { label: 'Watch', dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600 border-slate-200', border: 'border-l-slate-300' },
    critical: { label: 'Critical', dot: 'bg-red-500', badge: 'bg-red-50 text-red-700 border-red-200', border: 'border-l-red-400' },
};

// ─── MINI SPARKLINE ───────────────────────────────────────────────
function MiniLine({ data, positive }: { data: number[]; positive: boolean }) {
    const w = 60, h = 24;
    const max = Math.max(...data), min = Math.min(...data);
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / (max - min || 1)) * h;
        return `${x},${y}`;
    }).join(' ');
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
            <polyline points={pts} fill="none" stroke={positive ? '#a1e2b6' : '#fca5a5'} strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

// ─── SURVIVAL CLOCK (compact) ─────────────────────────────────────
function RunwayClock({ months, name }: { months: number; name: string }) {
    const pct = Math.min(100, (months / 18) * 100);
    const critical = months <= 4;
    const watch = months <= 8;
    const r = 22, c = 2 * Math.PI * r;
    return (
        <div className="flex items-center gap-2.5">
            <div className="relative w-12 h-12">
                <svg viewBox="0 0 52 52" className="-rotate-90">
                    <circle cx="26" cy="26" r={r} fill="none" stroke={critical ? '#fca5a5' : watch ? '#e4e8ef' : '#e4e8ef'} strokeWidth="4" />
                    <circle cx="26" cy="26" r={r} fill="none"
                        stroke={critical ? '#ef4444' : watch ? '#94a3b8' : '#a1e2b6'}
                        strokeWidth="4" strokeLinecap="round"
                        strokeDasharray={`${(pct / 100) * c} ${c}`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={cn('font-mono text-[10px] font-black', critical ? 'text-red-600' : 'text-[#102c1e]')}>{months}m</span>
                </div>
            </div>
            <div>
                <p className="font-geist text-xs font-black text-[#102c1e]">{name}</p>
                <p className={cn('font-geist text-[10px] font-bold', critical ? 'text-red-500' : 'text-slate-400')}>
                    {critical ? '🚨 Khẩn cấp' : watch ? '⚠️ Cần theo dõi' : '✓ An toàn'}
                </p>
            </div>
        </div>
    );
}

// ─── MAIN ─────────────────────────────────────────────────────────
export default function PortfolioCommandCenter() {
    const [activeFilter, setActiveFilter] = useState<HealthLevel | 'all'>('all');

    const totalInvested = PORTFOLIO.reduce((s, p) => s + p.investedUSD, 0);
    const avgMoic = PORTFOLIO.reduce((s, p) => s + p.moicEstimate, 0) / PORTFOLIO.length;
    const criticalCount = PORTFOLIO.filter(p => p.healthLevel === 'critical').length;
    const watchCount = PORTFOLIO.filter(p => p.healthLevel === 'watch').length;

    const filtered = activeFilter === 'all' ? PORTFOLIO : PORTFOLIO.filter(p => p.healthLevel === activeFilter);

    return (
        <div className="min-h-screen bg-[#fafafa] font-inter p-6 md:p-8 lg:p-10">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* ── HEADER ── */}
                <header className="pt-4 pb-5 border-b border-[#102c1e]/10 flex items-end justify-between gap-6">
                    <div>
                        <p className="font-geist text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Investor Dashboard</p>
                        <h1 className="font-outfit font-black text-[#102c1e] text-4xl tracking-tight">Portfolio Command</h1>
                        <p className="font-inter text-slate-500 mt-2">Theo dõi sức khỏe danh mục đầu tư theo thời gian thực.</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        {criticalCount > 0 && (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-2.5 rounded-xl">
                                <Bell className="w-4 h-4 text-red-500" />
                                <span className="font-geist font-black text-sm text-red-700">{criticalCount} cần hành động ngay</span>
                            </div>
                        )}
                        <button className="flex items-center gap-2 bg-[#102c1e] text-white font-geist font-black text-sm px-4 py-2.5 rounded-xl hover:bg-[#0a1c13] transition-colors shadow-md">
                            <Plus className="w-4 h-4 text-[#a1e2b6]" />
                            Thêm công ty
                        </button>
                    </div>
                </header>

                {/* ── TOP STATS ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Tổng đầu tư', value: `$${(totalInvested / 1_000).toFixed(0)}K`, icon: DollarSign, accent: true },
                        { label: 'Portfolio MOIC', value: `${avgMoic.toFixed(2)}x`, icon: TrendingUp, accent: false },
                        { label: 'Cần theo dõi', value: `${watchCount + criticalCount}`, icon: AlertTriangle, accent: false },
                        { label: 'Công ty portfolio', value: PORTFOLIO.length.toString(), icon: Building2, accent: false },
                    ].map((stat, i) => (
                        <div key={i} className={cn(
                            'rounded-2xl p-5 border shadow-sm',
                            stat.accent ? 'bg-[#102c1e] border-[#102c1e]' : 'bg-white border-[#102c1e]/10 hover:border-[#102c1e]/20 transition-colors'
                        )}>
                            <div className="flex items-center justify-between mb-3">
                                <p className={cn('font-geist text-[10px] font-bold uppercase tracking-widest', stat.accent ? 'text-white/50' : 'text-slate-400')}>
                                    {stat.label}
                                </p>
                                <stat.icon className={cn('w-4 h-4', stat.accent ? 'text-[#a1e2b6]' : 'text-[#102c1e]/20')} />
                            </div>
                            <p className={cn('font-mono text-2xl font-black', stat.accent ? 'text-white' : 'text-[#102c1e]')}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* ── LEFT: PORTFOLIO HEALTH MAP ── */}
                    <div className="lg:col-span-8 space-y-4">
                        {/* Filter tabs */}
                        <div className="flex items-center gap-2">
                            {(['all', 'healthy', 'watch', 'critical'] as const).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setActiveFilter(f)}
                                    className={cn(
                                        'px-4 py-2 rounded-xl font-geist text-xs font-bold transition-all',
                                        activeFilter === f
                                            ? 'bg-[#102c1e] text-white shadow-md'
                                            : 'bg-white border border-[#102c1e]/10 text-slate-500 hover:text-[#102c1e] hover:border-[#102c1e]/20'
                                    )}
                                >
                                    {f === 'all' ? 'Tất cả' : f === 'healthy' ? '✓ Healthy' : f === 'watch' ? '⚡ Watch' : '🚨 Critical'}
                                </button>
                            ))}
                        </div>

                        {/* Company cards */}
                        <div className="space-y-3">
                            {filtered.map(company => {
                                const h = HEALTH[company.healthLevel];
                                return (
                                    <div
                                        key={company.id}
                                        className={cn(
                                            'bg-white rounded-3xl border border-l-4 shadow-sm hover:shadow-md transition-all group',
                                            h.border, 'border-[#102c1e]/8'
                                        )}
                                    >
                                        <div className="p-5">
                                            <div className="flex items-start gap-4">
                                                {/* Logo + identity */}
                                                <div className="w-12 h-12 rounded-2xl bg-[#102c1e]/5 border border-[#102c1e]/8 flex items-center justify-center text-2xl shrink-0">
                                                    {company.logo}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <h3 className="font-outfit font-black text-[#102c1e] text-base">{company.name}</h3>
                                                                <span className={cn('font-geist text-[9px] font-black px-2 py-0.5 rounded-full border', h.badge)}>
                                                                    <span className={cn('inline-block w-1.5 h-1.5 rounded-full mr-1', h.dot)} />
                                                                    {h.label}
                                                                </span>
                                                                {company.mentor && (
                                                                    <span className="font-geist text-[9px] text-slate-400 flex items-center gap-0.5">
                                                                        <Star className="w-2.5 h-2.5" /> {company.mentor}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="font-geist text-xs text-slate-500 mt-0.5">{company.vertical} · {company.stage}</p>
                                                        </div>

                                                        {/* Health score */}
                                                        <div className="text-right shrink-0">
                                                            <div className="font-mono text-2xl font-black text-[#102c1e]">{company.healthScore}</div>
                                                            <div className="font-geist text-[9px] text-slate-400 uppercase tracking-widest">Health</div>
                                                        </div>
                                                    </div>

                                                    {/* Metrics row */}
                                                    <div className="grid grid-cols-4 gap-3 mt-4">
                                                        {[
                                                            { label: 'Invested', value: company.invested },
                                                            { label: 'Ownership', value: `${company.ownership}%` },
                                                            { label: 'MRR', value: company.mrr },
                                                            { label: 'MOIC est.', value: `${company.moicEstimate}x` },
                                                        ].map((m, i) => (
                                                            <div key={i}>
                                                                <p className="font-geist text-[9px] font-bold text-slate-400 uppercase tracking-widest">{m.label}</p>
                                                                <p className="font-mono text-sm font-black text-[#102c1e]">{m.value}</p>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Bottom row */}
                                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#102c1e]/5">
                                                        <div className="flex items-center gap-3">
                                                            {/* Runway mini-clock */}
                                                            <div className="flex items-center gap-1.5">
                                                                <Clock className="w-3.5 h-3.5 text-[#102c1e]/30" />
                                                                <span className={cn(
                                                                    'font-geist text-xs font-bold',
                                                                    company.runwayMonths <= 4 ? 'text-red-600' :
                                                                        company.runwayMonths <= 8 ? 'text-slate-500' : 'text-[#102c1e]/50'
                                                                )}>
                                                                    {company.runwayMonths}m runway
                                                                    {company.runwayMonths <= 4 && ' 🚨'}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <MiniLine data={company.sparkline} positive={company.mrrGrowth > 0} />
                                                                <span className={cn('font-mono text-xs font-bold', company.mrrGrowth > 0 ? 'text-[#102c1e]/60' : 'text-red-500')}>
                                                                    {company.mrrGrowth > 0 ? '+' : ''}{company.mrrGrowth}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <a
                                                                href={`/investor/deal-flow/${company.id}/due-diligence`}
                                                                className="font-geist text-[10px] font-bold text-[#102c1e] hover:text-[#a1e2b6] transition-colors flex items-center gap-1"
                                                            >
                                                                DD Terminal <ChevronRight className="w-3 h-3" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Critical warning banner */}
                                        {company.healthLevel === 'critical' && (
                                            <div className="mx-5 mb-4 flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-2.5">
                                                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                                                <p className="font-geist text-xs font-bold text-red-700">{company.nextMilestone}</p>
                                                <button className="ml-auto font-geist text-xs font-black text-red-700 hover:text-red-900 whitespace-nowrap flex items-center gap-1">
                                                    Liên hệ ngay <ChevronRight className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── RIGHT: Sidebar panels ── */}
                    <div className="lg:col-span-4 space-y-5">

                        {/* Upcoming events */}
                        <div className="bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm">
                            <div className="px-5 py-4 border-b border-[#102c1e]/5 flex items-center justify-between">
                                <h3 className="font-outfit font-black text-[#102c1e] text-lg">Lịch sắp tới</h3>
                                <Calendar className="w-4 h-4 text-[#102c1e]/30" />
                            </div>
                            <div className="divide-y divide-[#102c1e]/5">
                                {EVENTS.map(ev => (
                                    <div key={ev.id} className={cn(
                                        'px-5 py-3 flex items-start gap-3 hover:bg-[#fafafa] transition-colors',
                                        ev.urgent && 'bg-red-50/50'
                                    )}>
                                        <span className="text-lg shrink-0 mt-0.5">{ev.logo}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className={cn('font-geist text-xs font-bold leading-snug', ev.urgent ? 'text-red-700' : 'text-[#102c1e]')}>
                                                {ev.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="font-geist text-[9px] text-slate-400">{ev.date}</span>
                                                {ev.urgent && (
                                                    <span className="font-geist text-[8px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-full">URGENT</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Runway overview */}
                        <div className="bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm p-5">
                            <h3 className="font-outfit font-black text-[#102c1e] text-lg mb-4">Runway Overview</h3>
                            <div className="space-y-4">
                                {PORTFOLIO.map(p => (
                                    <RunwayClock key={p.id} months={p.runwayMonths} name={p.name} />
                                ))}
                            </div>
                        </div>

                        {/* Quick actions */}
                        <div className="bg-[#102c1e] rounded-3xl p-5 text-white relative overflow-hidden">
                            <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-[#a1e2b6]/10 blur-2xl pointer-events-none" />
                            <h3 className="font-outfit font-black text-white text-lg mb-4 relative">Quick Actions</h3>
                            <div className="relative space-y-2">
                                {[
                                    { icon: FileText, label: 'Request monthly report', sub: 'Gửi template cho tất cả' },
                                    { icon: Send, label: 'Bridge loan template', sub: 'Cho AgriSense' },
                                    { icon: Target, label: 'Schedule board meetings', sub: 'Bulk calendar invite' },
                                ].map((action, i) => (
                                    <button key={i} className="w-full flex items-start gap-3 bg-white/5 hover:bg-white/10 rounded-2xl p-3 text-left transition-colors group">
                                        <action.icon className="w-4 h-4 text-[#a1e2b6] shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-geist text-xs font-bold text-white">{action.label}</p>
                                            <p className="font-geist text-[10px] text-white/40 mt-0.5">{action.sub}</p>
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors ml-auto mt-0.5 shrink-0" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
