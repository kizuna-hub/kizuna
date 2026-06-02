'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
    Sparkles, Send, Lock, Unlock, Star, TrendingUp, TrendingDown,
    Activity, Plus, Filter, MoreHorizontal, ChevronRight, AlertCircle,
    Users, DollarSign, Calendar, Building2, Flame, Zap, ShieldCheck,
    Eye, MessageSquare, Bookmark, ArrowUpRight, Clock, Search,
    SlidersHorizontal, CheckCircle2, XCircle, FileText, Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
const COLUMNS = [
    {
        id: 'warm-intros',
        title: 'Warm Intros',
        subtitle: 'Từ Mentor',
        icon: Star,
        iconColor: 'text-[#102c1e]',
        accentColor: 'bg-[#102c1e]',
        borderColor: 'border-l-[#102c1e]',
        badgeStyle: 'bg-[#102c1e] text-white',
        isSpecial: true,
    },
    {
        id: 'inbound',
        title: 'AI Matched',
        subtitle: 'Inbound',
        icon: Sparkles,
        iconColor: 'text-[#a1e2b6]',
        accentColor: 'bg-[#a1e2b6]/20',
        borderColor: 'border-l-[#a1e2b6]',
        badgeStyle: 'bg-[#a1e2b6]/20 border border-[#a1e2b6]/50 text-[#102c1e]',
        isSpecial: false,
    },
    {
        id: 'screening',
        title: 'Screening',
        subtitle: 'Lọc sơ bộ',
        icon: Filter,
        iconColor: 'text-slate-400',
        accentColor: 'bg-slate-100',
        borderColor: 'border-l-slate-300',
        badgeStyle: 'bg-slate-100 text-slate-600',
        isSpecial: false,
    },
    {
        id: 'due-diligence',
        title: 'Due Diligence',
        subtitle: 'Data Room Mở',
        icon: ShieldCheck,
        iconColor: 'text-[#a1e2b6]',
        accentColor: 'bg-[#a1e2b6]/10',
        borderColor: 'border-l-[#a1e2b6]',
        badgeStyle: 'bg-[#a1e2b6]/20 border border-[#a1e2b6]/40 text-[#102c1e]',
        trigger: 'Auto-unlock Data Room',
        isSpecial: false,
    },
    {
        id: 'term-sheet',
        title: 'Term Sheet',
        subtitle: '/ Closed',
        icon: CheckCircle2,
        iconColor: 'text-[#102c1e]',
        accentColor: 'bg-[#102c1e]/5',
        borderColor: 'border-l-[#102c1e]',
        badgeStyle: 'bg-[#102c1e]/10 text-[#102c1e]',
        isSpecial: false,
    },
];

const INITIAL_DEALS: Deal[] = [
    {
        id: 'deal-1',
        startup: 'SnapMoney',
        tagline: 'P2P lending through social identity',
        vertical: 'FinTech',
        subVertical: 'Lending',
        founder: 'Lê Bảo',
        founderTitle: 'CEO & Co-founder',
        ask: '$1M',
        askUSD: 1000000,
        stage: 'Series A',
        source: 'warm-intro',
        referredBy: 'Tuấn (Mentor)',
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
        subVertical: 'AI/ML',
        founder: 'Minh Nguyễn',
        founderTitle: 'Founder',
        ask: '$500K',
        askUSD: 500000,
        stage: 'Seed',
        source: 'warm-intro',
        referredBy: 'Hà (Mentor)',
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
        subVertical: 'Marketplace',
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
        subVertical: 'Consumer',
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
    },
    {
        id: 'deal-5',
        startup: 'EcoDeliver',
        tagline: '100% EV last-mile logistics',
        vertical: 'Logistics',
        subVertical: 'GreenTech',
        founder: 'Văn An',
        founderTitle: 'Co-founder & COO',
        ask: '$300K',
        askUSD: 300000,
        stage: 'Pre-Seed',
        matchScore: 75,
        source: 'ai-match',
        col: 'screening',
        abstract: 'Giao hàng chặng cuối 100% xe điện, giảm 40% carbon footprint so với logistics truyền thống.',
        hasDataRoom: true,
        dataRoomStatus: 'locked',
        priority: 'medium',
        traction: '500 deliveries/day',
        teamSize: 6,
        founded: '2024',
        country: 'Vietnam',
        tags: ['Logistics', 'EV', 'Green'],
        bookmarked: false,
        lastActivity: '2d ago',
        sparkline: [15, 18, 22, 20, 28, 32, 30, 38],
    },
    {
        id: 'deal-6',
        startup: 'PropVault',
        tagline: 'Real estate tokenization for retail investors',
        vertical: 'PropTech',
        subVertical: 'Web3',
        founder: 'Hùng Lê',
        founderTitle: 'CEO',
        ask: '$750K',
        askUSD: 750000,
        stage: 'Seed',
        matchScore: 81,
        source: 'ai-match',
        col: 'screening',
        abstract: 'Token hóa bất động sản thương mại để nhà đầu tư nhỏ lẻ có thể đầu tư từ $100.',
        hasDataRoom: true,
        dataRoomStatus: 'locked',
        priority: 'low',
        traction: '2K investors',
        mrr: '$15K MRR',
        teamSize: 8,
        founded: '2023',
        country: 'Vietnam',
        tags: ['PropTech', 'Web3', 'DeFi'],
        bookmarked: false,
        lastActivity: '3d ago',
        sparkline: [30, 25, 35, 40, 38, 45, 42, 50],
    },
    {
        id: 'deal-7',
        startup: 'Nexus AI',
        tagline: 'LLM-powered customer service automation',
        vertical: 'Enterprise AI',
        subVertical: 'CX',
        founder: 'Trần Bình',
        founderTitle: 'CTO & Co-founder',
        ask: '$2M',
        askUSD: 2000000,
        stage: 'Series A',
        source: 'self-sourced',
        col: 'due-diligence',
        abstract: 'Tự động hóa CSKH bằng LLM Agent, giảm 70% chi phí support và tăng CSAT lên 4.8/5.',
        hasDataRoom: true,
        dataRoomStatus: 'unlocked',
        priority: 'critical',
        traction: '35 enterprise clients',
        mrr: '$120K MRR',
        teamSize: 18,
        founded: '2022',
        country: 'Vietnam',
        tags: ['Enterprise', 'AI', 'SaaS'],
        bookmarked: true,
        lastActivity: '30m ago',
        ddDeadline: '7d left',
        redFlags: ['Founder conflict history'],
        sparkline: [50, 62, 58, 75, 80, 90, 88, 110],
    },
    {
        id: 'deal-8',
        startup: 'ClearBridge',
        tagline: 'Cross-border B2B payment rails',
        vertical: 'FinTech',
        subVertical: 'Payments',
        founder: 'Na Phạm',
        founderTitle: 'CEO',
        ask: '$1.5M',
        askUSD: 1500000,
        stage: 'Series A',
        source: 'inbound',
        col: 'term-sheet',
        abstract: 'Hạ tầng thanh toán B2B xuyên biên giới, xử lý trong 4 giây với phí 0.3%.',
        hasDataRoom: true,
        dataRoomStatus: 'unlocked',
        priority: 'critical',
        traction: '$8M GMV/mo',
        mrr: '$200K MRR',
        teamSize: 22,
        founded: '2022',
        country: 'Vietnam',
        tags: ['FinTech', 'Payments', 'B2B'],
        bookmarked: true,
        lastActivity: '1h ago',
        sparkline: [80, 90, 95, 105, 110, 130, 140, 160],
    },
];

// ─────────────────────────── SPARKLINE ───────────────────────────
function Sparkline({ data, accent = false }: { data: number[]; accent?: boolean }) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const w = 60, h = 24;
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / range) * h;
        return `${x},${y}`;
    }).join(' ');
    const isUp = data[data.length - 1] >= data[0];
    const color = isUp ? '#a1e2b6' : '#fca5a5';
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
            <polyline points={pts} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// ─────────────────────────── PRIORITY BADGE ───────────────────────────
const PRIORITY_CONFIG: Record<Priority, { label: string; dot: string; text: string }> = {
    critical: { label: 'Critical', dot: 'bg-red-500', text: 'text-red-600' },
    high: { label: 'High', dot: 'bg-amber-500', text: 'text-amber-600' },
    medium: { label: 'Medium', dot: 'bg-slate-400', text: 'text-slate-500' },
    low: { label: 'Low', dot: 'bg-slate-300', text: 'text-slate-400' },
};

function PriorityDot({ priority }: { priority: Priority }) {
    const cfg = PRIORITY_CONFIG[priority];
    return (
        <span className={cn('w-2 h-2 rounded-full shrink-0', cfg.dot)} title={cfg.label} />
    );
}

// ─────────────────────────── DEAL CARD ───────────────────────────
interface DealCardProps {
    deal: Deal;
    isDragging: boolean;
    isOver: boolean;
    onDragStart: (e: React.DragEvent, id: string) => void;
    onToggleBookmark: (id: string) => void;
}

function DealCard({ deal, isDragging, isOver, onDragStart, onToggleBookmark }: DealCardProps) {
    const isWarmIntro = deal.source === 'warm-intro';
    const isUnlocked = deal.dataRoomStatus === 'unlocked';
    const isInDD = deal.col === 'due-diligence';

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, deal.id)}
            className={cn(
                'group relative bg-white rounded-2xl border border-[#102c1e]/10 cursor-grab active:cursor-grabbing',
                'transition-all duration-200 select-none',
                'hover:shadow-md hover:-translate-y-0.5',
                isDragging && 'opacity-40 scale-95 shadow-2xl ring-2 ring-[#a1e2b6]',
                isWarmIntro && 'border-l-4 border-l-[#102c1e]',
                isUnlocked && !isWarmIntro && 'border-l-4 border-l-[#a1e2b6]',
            )}
        >
            {/* Card Header */}
            <div className="p-4 pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                    {/* Left: Name + Vertical */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <PriorityDot priority={deal.priority} />
                            <span className="font-geist text-[10px] font-bold text-[#102c1e]/50 uppercase tracking-widest truncate">
                                {deal.vertical}
                            </span>
                        </div>
                        <h4 className="font-outfit font-black text-[#102c1e] text-lg leading-tight truncate">
                            {deal.startup}
                        </h4>
                        <p className="font-inter text-xs text-slate-500 leading-tight truncate mt-0.5">
                            {deal.tagline}
                        </p>
                    </div>

                    {/* Right: Score / Source badge + bookmark */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <button
                            onClick={(e) => { e.stopPropagation(); onToggleBookmark(deal.id); }}
                            className="p-1 rounded-md hover:bg-slate-50 transition-colors"
                        >
                            <Bookmark
                                className={cn('w-3.5 h-3.5 transition-colors', deal.bookmarked
                                    ? 'fill-[#102c1e] text-[#102c1e]'
                                    : 'text-slate-300 hover:text-slate-500'
                                )}
                            />
                        </button>
                        {deal.matchScore ? (
                            <div className="bg-[#a1e2b6]/20 border border-[#a1e2b6]/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5 text-[#102c1e]" />
                                <span className="font-geist text-[10px] font-black text-[#102c1e]">{deal.matchScore}%</span>
                            </div>
                        ) : isWarmIntro ? (
                            <div className="bg-[#102c1e] px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Star className="w-2.5 h-2.5 text-[#a1e2b6] fill-[#a1e2b6]" />
                                <span className="font-geist text-[10px] font-black text-white">Intro</span>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Abstract */}
                <p className="font-inter text-xs text-slate-600 leading-relaxed line-clamp-2 mt-2">
                    {deal.abstract}
                </p>
            </div>

            {/* Mid: Metrics row */}
            <div className="px-4 pb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    {deal.mrr && (
                        <div>
                            <p className="font-geist text-[9px] text-slate-400 font-bold uppercase">MRR</p>
                            <p className="font-geist text-xs font-black text-[#102c1e]">{deal.mrr}</p>
                        </div>
                    )}
                    {deal.traction && (
                        <div>
                            <p className="font-geist text-[9px] text-slate-400 font-bold uppercase">Traction</p>
                            <p className="font-geist text-xs font-black text-[#102c1e]">{deal.traction}</p>
                        </div>
                    )}
                </div>
                {deal.sparkline && (
                    <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                        <Sparkline data={deal.sparkline} />
                    </div>
                )}
            </div>

            {/* Divider */}
            <div className="mx-4 border-t border-[#102c1e]/5" />

            {/* Card Footer */}
            <div className="px-4 py-3 flex items-center justify-between gap-2">
                {/* Founder + Ask */}
                <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-[#102c1e]/10 flex items-center justify-center shrink-0">
                        <span className="font-geist text-[9px] font-black text-[#102c1e]">
                            {deal.founder.charAt(0)}
                        </span>
                    </div>
                    <div className="min-w-0">
                        <p className="font-geist text-[10px] font-bold text-slate-500 truncate">{deal.founder}</p>
                        <p className="font-geist text-[9px] text-slate-400 truncate">{deal.stage} · {deal.ask}</p>
                    </div>
                </div>

                {/* Status + Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                    {/* Red flag warning */}
                    {deal.redFlags && deal.redFlags.length > 0 && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-red-50 border border-red-200 rounded-md" title={deal.redFlags.join(', ')}>
                            <AlertCircle className="w-3 h-3 text-red-500" />
                            <span className="font-geist text-[9px] font-bold text-red-500">{deal.redFlags.length}</span>
                        </div>
                    )}

                    {/* DD Deadline */}
                    {deal.ddDeadline && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-[#102c1e]/5 border border-[#102c1e]/10 rounded-md">
                            <Clock className="w-3 h-3 text-[#102c1e]/50" />
                            <span className="font-geist text-[9px] font-bold text-[#102c1e]/60">{deal.ddDeadline}</span>
                        </div>
                    )}

                    {/* Data Room Status */}
                    {deal.hasDataRoom && (
                        <div className={cn(
                            'flex items-center gap-1 px-1.5 py-0.5 rounded-md border font-geist text-[9px] font-bold uppercase tracking-wide transition-all',
                            isUnlocked
                                ? 'bg-[#a1e2b6]/20 border-[#a1e2b6]/40 text-[#102c1e]'
                                : 'bg-slate-50 border-slate-200 text-slate-400'
                        )}>
                            {isUnlocked
                                ? <><Unlock className="w-2.5 h-2.5" /> Open</>
                                : <><Lock className="w-2.5 h-2.5" /> Locked</>
                            }
                        </div>
                    )}

                    {/* Last Activity */}
                    {deal.lastActivity && (
                        <span className="font-geist text-[9px] text-slate-400">{deal.lastActivity}</span>
                    )}
                </div>
            </div>

            {/* Warm intro referral ribbon */}
            {isWarmIntro && deal.referredBy && (
                <div className="px-4 py-2 bg-[#102c1e]/5 border-t border-[#102c1e]/5 flex items-center gap-1.5 rounded-b-2xl">
                    <Send className="w-3 h-3 text-[#102c1e]" />
                    <span className="font-geist text-[9px] font-bold text-[#102c1e]/70">Introduced by {deal.referredBy}</span>
                </div>
            )}

            {/* DD column: quick links to Terminal & Simulator */}
            {isInDD && (
                <div className="mx-0 rounded-b-2xl overflow-hidden">
                    <div className={cn(
                        'px-4 py-2.5 border-t flex items-center gap-2',
                        isUnlocked
                            ? 'bg-[#102c1e] border-[#102c1e]'
                            : 'bg-[#102c1e]/5 border-[#102c1e]/8'
                    )}>
                        {isUnlocked ? (
                            <>
                                <a
                                    href={`/en/investor/deal-flow/${deal.id}/due-diligence`}
                                    onClick={e => e.stopPropagation()}
                                    className="flex-1 flex items-center justify-center gap-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg py-1.5 font-geist text-[10px] font-black transition-colors"
                                >
                                    <ShieldCheck className="w-3 h-3" /> DD Terminal
                                </a>
                                <a
                                    href={`/en/investor/deal-flow/${deal.id}/pro-rata`}
                                    onClick={e => e.stopPropagation()}
                                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#a1e2b6]/20 hover:bg-[#a1e2b6]/30 text-[#a1e2b6] rounded-lg py-1.5 font-geist text-[10px] font-black transition-colors"
                                >
                                    <Target className="w-3 h-3" /> Pro-Rata
                                </a>
                            </>
                        ) : (
                            <p className="font-geist text-[9px] text-[#102c1e]/50 font-bold text-center w-full">
                                Kéo vào đây để mở khóa Data Room & kích hoạt DD Tools
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* DD unlocked animation overlay */}
            {isInDD && isUnlocked && (
                <div className="absolute top-2 right-2 pointer-events-none">
                    <div className="w-2 h-2 rounded-full bg-[#a1e2b6] animate-pulse" />
                </div>
            )}
        </div>
    );
}

// ─────────────────────────── COLUMN ───────────────────────────
interface ColumnConfig {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ElementType;
    iconColor: string;
    badgeStyle: string;
    trigger?: string;
    isSpecial: boolean;
}

interface KanbanColumnProps {
    column: ColumnConfig;
    deals: Deal[];
    draggedId: string | null;
    overColId: string | null;
    onDragOver: (e: React.DragEvent, colId: string) => void;
    onDrop: (e: React.DragEvent, colId: string) => void;
    onDragLeave: () => void;
    onDragStart: (e: React.DragEvent, id: string) => void;
    onToggleBookmark: (id: string) => void;
}

function KanbanColumn({
    column, deals, draggedId, overColId,
    onDragOver, onDrop, onDragLeave, onDragStart, onToggleBookmark,
}: KanbanColumnProps) {
    const isOver = overColId === column.id;
    const totalAsk = deals.reduce((sum, d) => sum + (d.askUSD || 0), 0);
    const fmtAsk = totalAsk >= 1_000_000
        ? `$${(totalAsk / 1_000_000).toFixed(1)}M`
        : totalAsk >= 1_000 ? `$${(totalAsk / 1_000).toFixed(0)}K` : '';

    return (
        <div
            className={cn(
                'flex flex-col w-[300px] shrink-0 rounded-3xl transition-all duration-200',
                'border border-[#102c1e]/5',
                column.isSpecial ? 'bg-[#102c1e]/[0.03]' : 'bg-white/60',
                isOver && 'ring-2 ring-[#a1e2b6] bg-[#a1e2b6]/5 scale-[1.01]',
            )}
            onDragOver={(e) => onDragOver(e, column.id)}
            onDrop={(e) => onDrop(e, column.id)}
            onDragLeave={onDragLeave}
        >
            {/* Column Header */}
            <div className={cn(
                'p-4 rounded-t-3xl border-b border-[#102c1e]/5',
                column.isSpecial ? 'bg-[#102c1e]/[0.04]' : 'bg-white/80',
            )}>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className={cn('w-6 h-6 rounded-lg flex items-center justify-center', column.isSpecial ? 'bg-[#102c1e]' : 'bg-[#102c1e]/5')}>
                            <column.icon className={cn('w-3.5 h-3.5', column.isSpecial ? 'text-white' : column.iconColor)} />
                        </div>
                        <div>
                            <p className="font-geist text-xs font-black text-[#102c1e] leading-none">{column.title}</p>
                            <p className="font-geist text-[9px] text-slate-400 leading-none mt-0.5">{column.subtitle}</p>
                        </div>
                    </div>
                    <span className={cn('font-geist text-xs font-black px-2 py-0.5 rounded-md', column.badgeStyle)}>
                        {deals.length}
                    </span>
                </div>

                {/* Column stats */}
                <div className="flex items-center justify-between">
                    {fmtAsk && (
                        <span className="font-geist text-[10px] text-slate-500 font-bold flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />{fmtAsk} total ask
                        </span>
                    )}
                    {column.trigger && (
                        <div className="flex items-center gap-1 bg-[#a1e2b6]/20 border border-[#a1e2b6]/30 px-2 py-0.5 rounded-full">
                            <Unlock className="w-2.5 h-2.5 text-[#102c1e]" />
                            <span className="font-geist text-[9px] font-black text-[#102c1e] uppercase tracking-widest">{column.trigger}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Drop Zone Indicator */}
            {isOver && (
                <div className="mx-3 mt-3 h-1.5 rounded-full bg-[#a1e2b6] animate-pulse" />
            )}

            {/* Cards */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                style={{ maxHeight: 'calc(100vh - 280px)' }}
            >
                {deals.length === 0 ? (
                    <div className={cn(
                        'flex flex-col items-center justify-center h-24 rounded-2xl border-2 border-dashed text-center transition-all',
                        isOver
                            ? 'border-[#a1e2b6] bg-[#a1e2b6]/10'
                            : 'border-[#102c1e]/10 bg-transparent'
                    )}>
                        <Plus className={cn('w-5 h-5 mb-1', isOver ? 'text-[#102c1e]' : 'text-slate-300')} />
                        <p className="font-geist text-[10px] text-slate-400 font-bold">
                            {isOver ? 'Drop here' : 'No deals yet'}
                        </p>
                    </div>
                ) : (
                    deals.map(deal => (
                        <DealCard
                            key={deal.id}
                            deal={deal}
                            isDragging={draggedId === deal.id}
                            isOver={false}
                            onDragStart={onDragStart}
                            onToggleBookmark={onToggleBookmark}
                        />
                    ))
                )}
            </div>

            {/* Column Footer: Add deal button */}
            <div className="p-3 pt-0">
                <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-[#102c1e]/15 text-[#102c1e]/40 font-geist text-[10px] font-bold hover:border-[#102c1e]/30 hover:text-[#102c1e]/60 hover:bg-[#102c1e]/3 transition-all">
                    <Plus className="w-3 h-3" /> Add Deal
                </button>
            </div>
        </div>
    );
}

// ─────────────────────────── MAIN BOARD ───────────────────────────
export default function DealFlowCRM() {
    const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [overColId, setOverColId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<string>('all');
    const [justUnlocked, setJustUnlocked] = useState<string | null>(null);

    // Derived stats
    const totalDeals = deals.length;
    const warmIntrosCount = deals.filter(d => d.source === 'warm-intro').length;
    const ddCount = deals.filter(d => d.col === 'due-diligence').length;
    const termSheetCount = deals.filter(d => d.col === 'term-sheet').length;
    const totalPipeline = deals.reduce((s, d) => s + (d.askUSD || 0), 0);
    const fmtPipeline = totalPipeline >= 1_000_000 ? `$${(totalPipeline / 1_000_000).toFixed(1)}M` : `$${(totalPipeline / 1000).toFixed(0)}K`;

    // Filter
    const filtered = deals.filter(d => {
        const matchSearch = searchQuery === '' ||
            d.startup.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.vertical.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.founder.toLowerCase().includes(searchQuery.toLowerCase());
        const matchFilter =
            activeFilter === 'all' ||
            (activeFilter === 'bookmarked' && d.bookmarked) ||
            (activeFilter === 'warm-intro' && d.source === 'warm-intro') ||
            (activeFilter === 'critical' && d.priority === 'critical');
        return matchSearch && matchFilter;
    });

    // Drag
    const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
        setDraggedId(id);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', id);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent, colId: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setOverColId(colId);
    }, []);

    const handleDragLeave = useCallback(() => {
        setOverColId(null);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, targetColId: string) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain') || draggedId;
        if (!id) return;

        setDeals(prev => prev.map(deal => {
            if (deal.id !== id) return deal;
            const wasNotDD = deal.col !== 'due-diligence';
            const movingToDD = targetColId === 'due-diligence';
            const autoUnlock = movingToDD && wasNotDD && deal.hasDataRoom;
            if (autoUnlock) setJustUnlocked(id);
            return {
                ...deal,
                col: targetColId,
                dataRoomStatus: autoUnlock ? 'unlocked' : deal.dataRoomStatus,
            };
        }));

        setDraggedId(null);
        setOverColId(null);

        // Clear "just unlocked" flash after 3s
        if (justUnlocked) setTimeout(() => setJustUnlocked(null), 3000);
    }, [draggedId, justUnlocked]);

    const handleToggleBookmark = useCallback((id: string) => {
        setDeals(prev => prev.map(d => d.id === id ? { ...d, bookmarked: !d.bookmarked } : d));
    }, []);

    const FILTER_PILLS = [
        { id: 'all', label: 'All Deals' },
        { id: 'warm-intro', label: '⭐ Warm Intros' },
        { id: 'bookmarked', label: '🔖 Saved' },
        { id: 'critical', label: '🔴 Critical' },
    ];

    return (
        <div className="flex flex-col h-full bg-[#fafafa] overflow-hidden">

            {/* ── HEADER ── */}
            <header className="shrink-0 px-6 pt-6 pb-4 border-b border-[#102c1e]/10">
                <div className="flex items-start justify-between gap-6 mb-4">
                    <div>
                        <h1 className="font-outfit font-black text-[#102c1e] text-3xl tracking-tight leading-none">
                            Deal Flow CRM
                        </h1>
                        <p className="font-inter text-slate-500 text-sm mt-1">
                            Kéo thẻ sang <span className="font-bold text-[#102c1e]">Due Diligence</span> để hệ thống tự động mở khóa Data Room.
                        </p>
                    </div>

                    {/* Header CTAs */}
                    <div className="flex items-center gap-2 shrink-0">
                        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#102c1e]/10 bg-white font-geist text-xs font-bold text-[#102c1e]/70 hover:border-[#102c1e]/30 hover:text-[#102c1e] transition-all shadow-sm">
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            Filters
                        </button>
                        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#102c1e] font-geist text-xs font-black text-white hover:bg-[#0a1c13] transition-all shadow-md">
                            <Plus className="w-3.5 h-3.5" />
                            Add Deal
                        </button>
                    </div>
                </div>

                {/* ── METRICS ROW ── */}
                <div className="flex items-center gap-4 mb-4">
                    {[
                        { label: 'Total Deals', value: totalDeals, icon: Activity, color: 'text-[#102c1e]' },
                        { label: 'Warm Intros', value: warmIntrosCount, icon: Star, color: 'text-[#102c1e]' },
                        { label: 'In Due Diligence', value: ddCount, icon: ShieldCheck, color: 'text-[#a1e2b6]' },
                        { label: 'Term Sheet', value: termSheetCount, icon: CheckCircle2, color: 'text-[#102c1e]' },
                        { label: 'Pipeline Value', value: fmtPipeline, icon: DollarSign, color: 'text-[#102c1e]' },
                    ].map((stat) => (
                        <div key={stat.label} className="flex items-center gap-2 bg-white border border-[#102c1e]/8 rounded-xl px-3 py-2 shadow-sm">
                            <stat.icon className={cn('w-3.5 h-3.5', stat.color)} />
                            <div>
                                <p className="font-geist text-[10px] text-slate-400 font-bold uppercase leading-none">{stat.label}</p>
                                <p className="font-geist text-sm font-black text-[#102c1e] leading-none mt-0.5">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── SEARCH + FILTER PILLS ── */}
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative group flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-[#102c1e] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search deals, founders..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="h-9 w-full rounded-xl border border-[#102c1e]/10 bg-white pl-9 pr-4 text-xs font-geist text-[#102c1e] shadow-sm outline-none placeholder:text-slate-400 transition-all focus:border-[#102c1e]/30 focus:ring-4 focus:ring-[#102c1e]/5"
                        />
                    </div>

                    {/* Pills */}
                    <div className="flex items-center gap-1.5">
                        {FILTER_PILLS.map(pill => (
                            <button
                                key={pill.id}
                                onClick={() => setActiveFilter(pill.id)}
                                className={cn(
                                    'px-3 py-1.5 rounded-full font-geist text-xs font-bold transition-all shadow-sm whitespace-nowrap',
                                    activeFilter === pill.id
                                        ? 'bg-[#102c1e] text-white'
                                        : 'bg-white border border-[#102c1e]/10 text-[#102c1e]/70 hover:border-[#102c1e]/30 hover:text-[#102c1e]'
                                )}
                            >
                                {pill.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* ── KANBAN BOARD ── */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden px-6 py-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex gap-4 h-full items-start w-max pb-4">
                    {COLUMNS.map(column => {
                        const colDeals = filtered.filter(d => d.col === column.id);
                        return (
                            <KanbanColumn
                                key={column.id}
                                column={column}
                                deals={colDeals}
                                draggedId={draggedId}
                                overColId={overColId}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onDragLeave={handleDragLeave}
                                onDragStart={handleDragStart}
                                onToggleBookmark={handleToggleBookmark}
                            />
                        );
                    })}
                </div>
            </div>

            {/* ── UNLOCK TOAST ── */}
            {justUnlocked && (
                <div className="fixed bottom-6 right-6 z-50 bg-[#102c1e] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 font-geist">
                    <div className="w-8 h-8 rounded-xl bg-[#a1e2b6]/20 flex items-center justify-center">
                        <Unlock className="w-4 h-4 text-[#a1e2b6]" />
                    </div>
                    <div>
                        <p className="text-xs font-black">Data Room Unlocked!</p>
                        <p className="text-[10px] text-white/60">Due diligence triggered automatically</p>
                    </div>
                </div>
            )}
        </div>
    );
}