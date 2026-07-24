'use client';

import React, { useState } from 'react';
import {
    Sparkles, Send, Lock, Unlock, Star, ShieldCheck,
    Search, Check, ChevronRight, Activity, Flame, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import DealDetailSidebar from './deal-detail-sidebar';// Import file Sidebar mới

// ─────────────────────────── TYPES ───────────────────────────
type DataRoomStatus = 'locked' | 'unlocked';
type Priority = 'critical' | 'high' | 'medium' | 'low';
type Source = 'ai-match' | 'warm-intro' | 'self-sourced' | 'inbound';

export interface Deal {
    id: string;
    startup: string;
    tagline: string;
    vertical: string;
    subVertical?: string;
    founder: string;
    founderTitle?: string;
    ask: string;
    askUSD?: number;
    stage: string;
    matchScore?: number;
    source: Source;
    referredBy?: string;
    col: string;
    abstract: string;
    hasDataRoom: boolean;
    dataRoomStatus?: DataRoomStatus;
    priority: Priority;
    traction?: string;
    mrr?: string;
    teamSize?: number;
    founded?: string;
    country?: string;
    tags?: string[];
    bookmarked?: boolean;
    lastActivity?: string;
    ddDeadline?: string;
    redFlags?: string[];
    sparkline?: number[];
}

// ─────────────────────────── MOCK DATA ───────────────────────────
const INITIAL_DEALS: Deal[] = [
    {
        id: 'deal-1',
        startup: 'SnapMoney',
        tagline: 'P2P lending through social identity',
        vertical: 'FinTech',
        founder: 'Lê Bảo',
        founderTitle: 'CEO & Co-founder',
        ask: '$1M',
        askUSD: 1000000,
        stage: 'Series A',
        source: 'warm-intro',
        referredBy: 'Tuấn Mentor',
        col: 'warm-intros',
        abstract: 'Vay siêu tốc P2P qua định danh Social Media. Thuật toán scoring độc quyền với tỉ lệ NPL < 2%.',
        hasDataRoom: true,
        dataRoomStatus: 'locked',
        priority: 'critical',
        traction: '45K users',
        mrr: '$38K MRR',
        teamSize: 12,
        founded: '2023',
        country: 'Vietnam',
        tags: ['FinTech', 'P2P', 'Lending'],
        bookmarked: true,
        lastActivity: '2h ago',
        sparkline: [20, 35, 28, 50, 45, 62, 58, 75],
    },
    {
        id: 'deal-2',
        startup: 'EduPath AI',
        tagline: 'Personalized learning journeys at scale',
        vertical: 'EdTech',
        founder: 'Minh Nguyễn',
        founderTitle: 'Founder',
        ask: '$500K',
        askUSD: 500000,
        stage: 'Seed',
        source: 'warm-intro',
        referredBy: 'Hà (Angel Investor)',
        col: 'warm-intros',
        abstract: 'AI cá nhân hóa lộ trình học theo phong cách và tốc độ của từng học sinh. Đã triển khai tại 3 trường ĐH lớn.',
        hasDataRoom: true,
        dataRoomStatus: 'locked',
        priority: 'high',
        traction: '8K students',
        mrr: '$12K MRR',
        teamSize: 7,
        founded: '2024',
        country: 'Vietnam',
        tags: ['EdTech', 'AI', 'B2B'],
        bookmarked: false,
        lastActivity: '1d ago',
        sparkline: [10, 15, 22, 30, 28, 40, 52, 60],
    },
    {
        id: 'deal-3',
        startup: 'Kizuna Hub',
        tagline: 'The OS for startup ecosystems',
        vertical: 'SaaS / B2B',
        founder: 'Hoàng Trần',
        founderTitle: 'CEO',
        ask: '$500K',
        askUSD: 500000,
        stage: 'Seed',
        matchScore: 94,
        source: 'ai-match',
        col: 'inbound',
        abstract: 'Nền tảng kết nối Founder, Mentor & Investor chuyên biệt cho hệ sinh thái khởi nghiệp Đông Nam Á.',
        hasDataRoom: true,
        dataRoomStatus: 'locked',
        priority: 'high',
        traction: '1.2K startups',
        mrr: '$8K MRR',
        teamSize: 9,
        founded: '2024',
        country: 'Vietnam',
        tags: ['SaaS', 'Network', 'B2B'],
        bookmarked: true,
        lastActivity: '3h ago',
        sparkline: [5, 12, 18, 25, 35, 42, 55, 70],
    },
    {
        id: 'deal-4',
        startup: 'Dietfit AI',
        tagline: 'AI nutrition coach that fits your gym cycle',
        vertical: 'HealthTech',
        founder: 'Thu Nguyễn',
        founderTitle: 'CEO',
        ask: '$250K',
        askUSD: 250000,
        stage: 'Pre-Seed',
        matchScore: 88,
        source: 'ai-match',
        col: 'inbound',
        abstract: 'AI cá nhân hóa thực đơn ăn kiêng theo chu kỳ gym và dữ liệu sinh học của người dùng.',
        hasDataRoom: false,
        priority: 'medium',
        traction: '3.5K users',
        teamSize: 4,
        founded: '2025',
        country: 'Vietnam',
        tags: ['HealthTech', 'AI', 'Consumer'],
        bookmarked: false,
        lastActivity: '5h ago',
        sparkline: [8, 10, 14, 20, 18, 25, 30, 35],
    }
];

// ─────────────────────────── HELPERS ───────────────────────────
const PRIORITY_CONFIG: Record<Priority, { label: string; bg: string; text: string }> = {
    critical: { label: 'High Priority', bg: 'bg-red-50', text: 'text-red-600' },
    high: { label: 'High Priority', bg: 'bg-amber-50', text: 'text-amber-600' },
    medium: { label: 'Medium Priority', bg: 'bg-orange-50', text: 'text-orange-600' },
    low: { label: 'Low Priority', bg: 'bg-slate-100', text: 'text-slate-600' },
};

const STAGES = [
    { id: 'all', label: 'All Deals' },
    { id: 'warm-intros', label: 'Warm Intros' },
    { id: 'inbound', label: 'Inbound' },
    { id: 'screening', label: 'Screening' },
    { id: 'due-diligence', label: 'Due Diligence' },
    { id: 'term-sheet', label: 'Term Sheet' },
];

function Sparkline({ data }: { data: number[] }) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const w = 60, h = 20;
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / range) * h;
        return `${x},${y}`;
    }).join(' ');
    const isUp = data[data.length - 1] >= data[0];
    const color = isUp ? '#a1e2b6' : '#fca5a5';
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" className="overflow-visible">
            <polyline points={pts} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// ─────────────────────────── MAIN BOARD ───────────────────────────
export default function DealFlowActionCenter() {
    const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
    const [activeStage, setActiveStage] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [justUnlocked, setJustUnlocked] = useState<string | null>(null);
    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null); // State quản lý Sidebar

    const handleAdvance = (id: string, currentCol: string, hasDataRoom: boolean) => {
        const flow = ['warm-intros', 'inbound', 'screening', 'due-diligence', 'term-sheet'];
        const currentIndex = flow.indexOf(currentCol);
        if (currentIndex === -1 || currentIndex === flow.length - 1) return;

        const nextCol = flow[currentIndex + 1] === 'inbound' && currentCol === 'warm-intros'
            ? 'screening'
            : flow[currentIndex + 1];

        setDeals(prev => prev.map(deal => {
            if (deal.id !== id) return deal;
            const movingToDD = nextCol === 'due-diligence';
            const autoUnlock = movingToDD && hasDataRoom;
            if (autoUnlock) {
                setJustUnlocked(id);
                setTimeout(() => setJustUnlocked(null), 3000);
            }
            return {
                ...deal,
                col: nextCol,
                dataRoomStatus: autoUnlock ? 'unlocked' : deal.dataRoomStatus
            };
        }));
    };

    const handleReject = (id: string) => {
        setDeals(prev => prev.map(deal => deal.id === id ? { ...deal, col: 'rejected' } : deal));
    };

    const filteredDeals = deals.filter(d => {
        if (d.col === 'rejected') return false;
        const matchStage = activeStage === 'all' || d.col === activeStage;
        const matchSearch = searchQuery === '' ||
            d.startup.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.vertical.toLowerCase().includes(searchQuery.toLowerCase());
        return matchStage && matchSearch;
    });

    return (
        <div className="flex flex-col h-full bg-[#fafafa] overflow-hidden relative">

            {/* ── HEADER ── */}
            <header className="shrink-0 px-8 pt-8 pb-6 bg-white border-b border-[#102c1e]/10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="font-sans text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Workflow · Approvals Queue</p>
                        <h1 className="font-heading font-black text-[#102c1e] text-3xl tracking-tight leading-none">
                            Action Center
                        </h1>
                        <p className="font-sans text-slate-500 text-sm mt-2">
                            Mọi quyết định đầu tư, thẩm định và cảnh báo AI đều tập trung tại đây. Duyệt, từ chối hoặc yêu cầu thêm Data.
                        </p>
                    </div>
                </div>

                {/* TABS & SEARCH */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5 p-1 bg-slate-100/50 rounded-xl border border-slate-200/50">
                        {STAGES.map(stage => {
                            const count = stage.id === 'all'
                                ? deals.filter(d => d.col !== 'rejected').length
                                : deals.filter(d => d.col === stage.id).length;

                            const isActive = activeStage === stage.id;

                            return (
                                <button
                                    key={stage.id}
                                    onClick={() => setActiveStage(stage.id)}
                                    className={cn(
                                        'flex items-center gap-2 px-3 py-1.5 rounded-lg font-sans text-[11px] font-bold transition-all',
                                        // ĐỔI MÀU NÚT KHI ACTIVE THÀNH MÀU KIZUNA (#102c1e)
                                        isActive
                                            ? 'bg-[#102c1e] text-[#a1e2b6] shadow-sm'
                                            : 'text-slate-500 hover:text-[#102c1e] hover:bg-slate-200/30'
                                    )}
                                >
                                    {stage.label}
                                    <span className={cn(
                                        'px-1.5 py-0.5 rounded-md text-[9px] leading-none transition-colors',
                                        isActive ? 'bg-white/10 text-white' : 'bg-slate-200/50 text-slate-500'
                                    )}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search deals..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl font-sans text-xs text-[#102c1e] focus:outline-none focus:border-[#102c1e] focus:ring-1 focus:ring-[#102c1e] transition-all shadow-sm"
                        />
                    </div>
                </div>
            </header>

            {/* ── LIST VIEW (ACTION CARDS) ── */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4 [&::-webkit-scrollbar]:hidden">
                <div className="max-w-5xl space-y-4 pb-20">
                    {filteredDeals.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="font-sans text-sm text-slate-400 font-bold">No deals in this queue.</p>
                        </div>
                    ) : (
                        filteredDeals.map(deal => {
                            const pCfg = PRIORITY_CONFIG[deal.priority];
                            const isDD = deal.col === 'due-diligence';

                            return (
                                <div key={deal.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">

                                    {/* TOP: Badges */}
                                    <div className="flex items-center gap-2">
                                        <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-md border border-black/5", pCfg.bg)}>
                                            <Flame className={cn("w-3 h-3", pCfg.text)} />
                                            <span className={cn("font-sans text-[10px] font-bold uppercase tracking-wide", pCfg.text)}>{pCfg.label}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-100">
                                            <span className="font-sans text-[10px] font-bold text-slate-500 uppercase tracking-wide">Stage: {deal.col.replace('-', ' ')}</span>
                                        </div>
                                    </div>

                                    {/* MIDDLE: Title, Abstract & FOUNDER INFO */}
                                    <div>
                                        <h3 className="font-heading text-xl font-black text-[#102c1e] flex items-center gap-2">
                                            {deal.startup}
                                            <span className="font-mono text-lg font-medium text-slate-400">· {deal.ask}</span>
                                        </h3>

                                        {/* THÔNG TIN FOUNDER VÀ MENTOR */}
                                        <div className="flex items-center gap-2 mt-2 mb-3">
                                            <span className="font-sans text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                Founder: <span className="font-bold text-[#102c1e]">{deal.founder}</span> ({deal.founderTitle})
                                            </span>
                                            {deal.source === 'warm-intro' && deal.referredBy && (
                                                <span className="flex items-center gap-1 font-sans text-xs text-[#102c1e] bg-[#a1e2b6]/20 px-2 py-1 rounded-md border border-[#a1e2b6]/30">
                                                    <Send className="w-3 h-3" />
                                                    Warm Intro by: <span className="font-bold">{deal.referredBy}</span>
                                                </span>
                                            )}
                                        </div>

                                        <p className="font-sans text-sm text-slate-600 max-w-3xl">
                                            <span className="font-bold text-[#102c1e]">{deal.tagline}.</span> {deal.abstract}
                                        </p>
                                    </div>

                                    {/* DATA PILLS ROW */}
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex items-center gap-1.5 text-[11px] font-sans font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#102c1e]"></span>
                                            {deal.vertical}
                                        </div>
                                        {deal.mrr && (
                                            <div className="flex items-center gap-1.5 text-[11px] font-sans font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                {deal.mrr}
                                            </div>
                                        )}
                                        {deal.traction && (
                                            <div className="flex items-center gap-1.5 text-[11px] font-sans font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                {deal.traction}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5 text-[11px] font-sans font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                            {deal.hasDataRoom ? (
                                                deal.dataRoomStatus === 'unlocked'
                                                    ? <><Unlock className="w-3 h-3 text-emerald-500" /> Data Room: Open</>
                                                    : <><Lock className="w-3 h-3 text-amber-500" /> Data Room: Locked</>
                                            ) : (
                                                <span className="text-slate-400">No Data Room</span>
                                            )}
                                        </div>
                                        {deal.sparkline && (
                                            <div className="ml-2 flex items-center gap-2">
                                                <span className="text-[10px] font-sans font-bold text-slate-400 uppercase">Growth</span>
                                                <Sparkline data={deal.sparkline} />
                                            </div>
                                        )}
                                    </div>

                                    {/* BOTTOM: Actions */}
                                    <div className="mt-2 pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {isDD ? (
                                                <>
                                                    <button className="flex items-center gap-2 px-4 py-2 bg-[#102c1e] text-white rounded-lg font-sans text-xs font-bold hover:bg-[#0a1c13] transition-colors">
                                                        <ShieldCheck className="w-4 h-4" /> DD Terminal
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => handleAdvance(deal.id, deal.col, deal.hasDataRoom)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-[#102c1e] text-white rounded-lg font-sans text-xs font-bold hover:bg-[#0a1c13] transition-colors shadow-sm"
                                                >
                                                    <Check className="w-4 h-4" />
                                                    {deal.col === 'screening' && deal.hasDataRoom ? 'Unlock Data Room & Advance' : 'Approve & Advance'}
                                                </button>
                                            )}

                                            {!isDD && deal.col !== 'term-sheet' && (
                                                <button
                                                    onClick={() => handleReject(deal.id)}
                                                    className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-red-500 rounded-lg font-sans text-xs font-bold hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors"
                                                >
                                                    <X className="w-4 h-4" /> Reject
                                                </button>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => setSelectedDeal(deal)} // KÍCH HOẠT MỞ SIDEBAR
                                            className="flex items-center gap-1 font-sans text-[11px] font-bold text-[#102c1e] hover:opacity-70 transition-opacity"
                                        >
                                            Open detail <ChevronRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Component Sidebar (Chi tiết Deal) */}
            {selectedDeal && (
                <DealDetailSidebar
                    deal={selectedDeal}
                    onClose={() => setSelectedDeal(null)}
                />
            )}
        </div>
    );
}