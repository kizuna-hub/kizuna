'use client';

import React, { useState, useRef } from 'react';
import {
    Shield, FileText, CheckSquare, MessageSquare, AlertTriangle,
    ChevronRight, Download, Send, Plus, Sparkles, Eye, Lock,
    Clock, Users, TrendingUp, BarChart3, Building2, CheckCircle2,
    XCircle, Circle, Bookmark, ExternalLink, ArrowLeft, Zap,
    StickyNote, FolderOpen, Star, Target, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── TYPES ───────────────────────────────────────────────────────
type DDTab = 'dataroom' | 'checklist' | 'notes' | 'ai-scanner';
type CheckStatus = 'done' | 'issue' | 'pending' | 'na';

interface DDItem {
    id: string;
    category: string;
    label: string;
    status: CheckStatus;
    assignee?: string;
    note?: string;
    weight: 'critical' | 'important' | 'standard';
}

interface DataDoc {
    id: string;
    name: string;
    type: 'pdf' | 'xlsx' | 'ppt' | 'link';
    size?: string;
    lastUpdated: string;
    viewed: boolean;
    pages?: number;
}

// ─── MOCK DATA ────────────────────────────────────────────────────
const STARTUP = {
    name: 'SnapMoney',
    logo: '💸',
    vertical: 'FinTech',
    stage: 'Series A',
    ask: '$1M',
    founder: 'Lê Bảo',
    aiScore: 96,
};

const DD_CHECKLIST: DDItem[] = [
    // Legal
    { id: 'l1', category: 'Pháp lý', label: 'Đăng ký doanh nghiệp hợp lệ', status: 'done', weight: 'critical' },
    { id: 'l2', category: 'Pháp lý', label: 'Cap Table sạch, không tranh chấp', status: 'done', weight: 'critical' },
    { id: 'l3', category: 'Pháp lý', label: 'IP đã đăng ký & bảo hộ', status: 'issue', note: 'Patent còn đang pending tại NOIP', weight: 'critical' },
    { id: 'l4', category: 'Pháp lý', label: 'Hợp đồng lao động key team', status: 'pending', weight: 'important' },
    { id: 'l5', category: 'Pháp lý', label: 'FAST Agreement (nếu có Mentor equity)', status: 'done', weight: 'standard' },
    // Finance
    { id: 'f1', category: 'Tài chính', label: 'Financial model P&L 3 năm', status: 'done', weight: 'critical' },
    { id: 'f2', category: 'Tài chính', label: 'Bank statement 6 tháng gần nhất', status: 'pending', weight: 'critical' },
    { id: 'f3', category: 'Tài chính', label: 'MRR verified (screenshot dashboard)', status: 'done', weight: 'important' },
    { id: 'f4', category: 'Tài chính', label: 'Burn rate & runway calculation', status: 'done', weight: 'important' },
    { id: 'f5', category: 'Tài chính', label: 'Unit Economics (CAC/LTV)', status: 'issue', note: 'LTV chưa được tính đúng phương pháp', weight: 'important' },
    // Product
    { id: 'p1', category: 'Sản phẩm', label: 'Product demo live', status: 'done', weight: 'critical' },
    { id: 'p2', category: 'Sản phẩm', label: 'Tech stack review', status: 'done', weight: 'standard' },
    { id: 'p3', category: 'Sản phẩm', label: 'Security audit report', status: 'pending', weight: 'important' },
    // Market
    { id: 'm1', category: 'Thị trường', label: 'TAM/SAM/SOM analysis', status: 'done', weight: 'important' },
    { id: 'm2', category: 'Thị trường', label: 'Competitor landscape', status: 'done', weight: 'standard' },
    // Team
    { id: 't1', category: 'Đội ngũ', label: 'LinkedIn verification founder', status: 'done', weight: 'critical' },
    { id: 't2', category: 'Đội ngũ', label: 'Reference check (2+ references)', status: 'pending', weight: 'important' },
    { id: 't3', category: 'Đội ngụ', label: 'Vesting schedule key team', status: 'done', weight: 'important' },
];

const DATA_DOCS: DataDoc[] = [
    { id: 'd1', name: 'SnapMoney — Pitch Deck v4.2', type: 'ppt', size: '8.4 MB', lastUpdated: '1 ngày trước', viewed: true, pages: 18 },
    { id: 'd2', name: 'Financial Model 2024–2027', type: 'xlsx', size: '2.1 MB', lastUpdated: '3 ngày trước', viewed: true },
    { id: 'd3', name: 'Cap Table (Fully Diluted)', type: 'xlsx', size: '400 KB', lastUpdated: '3 ngày trước', viewed: false },
    { id: 'd4', name: 'Legal — Giấy ĐKKD + Điều lệ', type: 'pdf', size: '1.8 MB', lastUpdated: '1 tuần trước', viewed: false },
    { id: 'd5', name: 'IP Filing Receipt — NOIP', type: 'pdf', size: '600 KB', lastUpdated: '2 tuần trước', viewed: false },
    { id: 'd6', name: 'Product Demo — Video Walkthrough', type: 'link', lastUpdated: '5 ngày trước', viewed: true },
    { id: 'd7', name: 'Team Org Chart & Bios', type: 'pdf', size: '900 KB', lastUpdated: '1 tuần trước', viewed: false },
];

const AI_FLAGS = [
    { level: 'warn', title: 'IP Patent Pending', detail: 'Bằng sáng chế thuật toán scoring chưa được cấp. Rủi ro nếu competitor clone trong thời gian này. Cân nhắc thêm covenant bảo hộ vào Term Sheet.' },
    { level: 'info', title: 'LTV Methodology Gap', detail: 'Tỉ lệ LTV/CAC = 4.2x nhưng cách tính LTV chưa chuẩn theo phương pháp cohort. Yêu cầu founder cung cấp cohort retention data.' },
    { level: 'ok', title: 'MRR Verified', detail: 'MRR $38K đã được xác nhận qua bank statement tháng 4/2025. Tăng trưởng 24% MoM trong 3 tháng liên tiếp.' },
    { level: 'ok', title: 'Founder Background Clean', detail: 'LinkedIn xác minh, không có tiền án, không có conflict of interest với portfolio hiện tại của bạn.' },
    { level: 'warn', title: 'Reference Check Pending', detail: 'Chưa có 2 reference calls bắt buộc. Khuyến nghị ưu tiên điều này trước khi ra Term Sheet.' },
];

const TYPE_ICON: Record<string, string> = { pdf: '📄', xlsx: '📊', ppt: '📑', link: '🔗' };
const STATUS_CONFIG: Record<CheckStatus, { icon: typeof CheckCircle2; color: string; bg: string; label: string }> = {
    done: { icon: CheckCircle2, color: 'text-[#102c1e]', bg: 'bg-[#a1e2b6]/20', label: 'Hoàn thành' },
    issue: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', label: 'Cần xem xét' },
    pending: { icon: Circle, color: 'text-slate-400', bg: 'bg-slate-100', label: 'Chưa xem' },
    na: { icon: XCircle, color: 'text-slate-300', bg: 'bg-slate-50', label: 'Không áp dụng' },
};

// ─── PROGRESS RING ────────────────────────────────────────────────
function ProgressRing({ pct, size = 44, stroke = 4 }: { pct: number; size?: number; stroke?: number }) {
    const r = (size - stroke * 2) / 2;
    const c = 2 * Math.PI * r;
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#102c1e" strokeOpacity="0.08" strokeWidth={stroke} />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#a1e2b6" strokeWidth={stroke}
                strokeLinecap="round" strokeDasharray={`${(pct / 100) * c} ${c}`} className="transition-all duration-700" />
        </svg>
    );
}

// ─── SIDEBAR MINI-TABS ─────────────────────────────────────────────
const TABS: { id: DDTab; icon: typeof Shield; label: string; badge?: string }[] = [
    { id: 'dataroom', icon: FolderOpen, label: 'Data Room' },
    { id: 'checklist', icon: CheckSquare, label: 'DD Checklist', badge: '2' },
    { id: 'notes', icon: StickyNote, label: 'Ghi chú nội bộ' },
    { id: 'ai-scanner', icon: Sparkles, label: 'AI Red Flag' },
];

// ─── MAIN ─────────────────────────────────────────────────────────
export default function DueDiligenceTerminal({ dealId }: { dealId?: string }) {
    const [activeTab, setActiveTab] = useState<DDTab>('dataroom');
    const [items, setItems] = useState<DDItem[]>(DD_CHECKLIST);
    const [note, setNote] = useState('');
    const [notes, setNotes] = useState<{ text: string; time: string }[]>([
        { text: 'Cần clarify thêm về phương pháp tính LTV. Đã email founder.', time: '10:32 sáng' },
        { text: 'IP patent pending — sẽ thêm protective covenant vào term sheet draft.', time: 'Hôm qua' },
    ]);

    const done = items.filter(i => i.status === 'done').length;
    const issues = items.filter(i => i.status === 'issue').length;
    const pct = Math.round((done / items.length) * 100);
    const grouped = items.reduce<Record<string, DDItem[]>>((acc, item) => {
        (acc[item.category] = acc[item.category] || []).push(item);
        return acc;
    }, {});

    const toggleStatus = (id: string) => {
        setItems(prev => prev.map(item => {
            if (item.id !== id) return item;
            const cycle: CheckStatus[] = ['pending', 'done', 'issue', 'na'];
            const next = cycle[(cycle.indexOf(item.status) + 1) % cycle.length];
            return { ...item, status: next };
        }));
    };

    return (
        <div className="flex h-screen bg-[#fafafa] font-inter overflow-hidden">

            {/* ── LEFT PANEL: Sidebar ── */}
            <div className="w-72 shrink-0 bg-[#102c1e] flex flex-col overflow-hidden">
                {/* Back nav */}
                <div className="px-5 pt-5 pb-4 border-b border-white/5">
                    <a href="/investor/deal-flow" className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors text-xs font-geist font-bold mb-4">
                        <ArrowLeft className="w-3.5 h-3.5" /> Deal Flow CRM
                    </a>
                    {/* Startup identity */}
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-2xl border border-white/10">
                            {STARTUP.logo}
                        </div>
                        <div>
                            <h2 className="font-outfit font-black text-white text-base">{STARTUP.name}</h2>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="font-geist text-[9px] font-bold bg-[#a1e2b6]/15 border border-[#a1e2b6]/25 text-[#a1e2b6] px-2 py-0.5 rounded-full">
                                    {STARTUP.stage}
                                </span>
                                <span className="font-geist text-[9px] text-white/40">{STARTUP.vertical}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DD Progress */}
                <div className="px-5 py-4 border-b border-white/5">
                    <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4">
                        <div className="relative">
                            <ProgressRing pct={pct} size={52} stroke={5} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-mono font-black text-sm text-white">{pct}%</span>
                            </div>
                        </div>
                        <div>
                            <p className="font-geist text-[10px] font-bold text-white/40 uppercase tracking-widest">DD Progress</p>
                            <p className="font-mono font-black text-white text-lg mt-0.5">{done}<span className="text-white/30 font-normal text-sm">/{items.length}</span></p>
                            {issues > 0 && (
                                <p className="font-geist text-[10px] font-bold text-red-400 mt-0.5 flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> {issues} red flag
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Section Tabs */}
                <nav className="flex-1 px-3 py-4 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                    <p className="font-geist text-[9px] font-bold text-white/30 uppercase tracking-widest mb-3 px-2">Modules</p>
                    <div className="space-y-1">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-geist text-sm font-bold text-left',
                                    activeTab === tab.id
                                        ? 'bg-white/10 text-white'
                                        : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                                )}
                            >
                                <tab.icon className="w-4 h-4 shrink-0" />
                                <span className="flex-1">{tab.label}</span>
                                {tab.badge && (
                                    <span className="bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{tab.badge}</span>
                                )}
                                {activeTab === tab.id && <div className="w-1 h-1 rounded-full bg-[#a1e2b6]" />}
                            </button>
                        ))}
                    </div>

                    {/* Quick stats */}
                    <div className="mt-6 px-2 space-y-3">
                        <p className="font-geist text-[9px] font-bold text-white/30 uppercase tracking-widest">Deal Info</p>
                        {[
                            { label: 'Founder', value: STARTUP.founder },
                            { label: 'Ask', value: STARTUP.ask },
                            { label: 'AI Match', value: `${STARTUP.aiScore}%` },
                        ].map(s => (
                            <div key={s.label} className="flex justify-between items-center">
                                <span className="font-geist text-xs text-white/40">{s.label}</span>
                                <span className="font-mono text-xs font-black text-white">{s.value}</span>
                            </div>
                        ))}
                    </div>
                </nav>

                {/* Bottom actions */}
                <div className="px-3 pb-4 border-t border-white/5 pt-3 space-y-2">
                    <button className="w-full flex items-center gap-2 justify-center bg-[#a1e2b6] text-[#102c1e] rounded-xl py-2.5 font-geist font-black text-sm hover:bg-[#a1e2b6]/90 transition-colors shadow-md">
                        <Target className="w-4 h-4" />
                        Tạo Term Sheet Draft
                    </button>
                    <button className="w-full flex items-center gap-2 justify-center bg-white/5 text-white/70 rounded-xl py-2 font-geist font-bold text-xs hover:bg-white/10 transition-colors">
                        <Download className="w-3.5 h-3.5" />
                        Export DD Report (PDF)
                    </button>
                </div>
            </div>

            {/* ── RIGHT PANEL: Content ── */}
            <div className="flex-1 overflow-y-auto">

                {/* Topbar */}
                <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#102c1e]/8 px-8 py-3.5 flex items-center justify-between">
                    <div>
                        <h1 className="font-outfit font-black text-[#102c1e] text-xl">
                            {TABS.find(t => t.id === activeTab)?.label}
                        </h1>
                        <p className="font-geist text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                            {STARTUP.name} · Due Diligence Terminal
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-[#a1e2b6]/15 border border-[#a1e2b6]/30 px-3 py-1.5 rounded-xl">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#a1e2b6] animate-pulse" />
                            <span className="font-geist text-[10px] font-black text-[#102c1e]">Data Room Active</span>
                        </div>
                        <button className="p-2 rounded-xl hover:bg-[#102c1e]/5 text-slate-400 hover:text-[#102c1e] transition-colors">
                            <Bookmark className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="p-8">

                    {/* ── TAB: DATA ROOM ── */}
                    {activeTab === 'dataroom' && (
                        <div>
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {[
                                    { label: 'Tài liệu', value: DATA_DOCS.length.toString(), icon: FileText, sub: `${DATA_DOCS.filter(d => d.viewed).length} đã xem` },
                                    { label: 'Lần truy cập', value: '12', icon: Eye, sub: 'Tổng lượt view' },
                                    { label: 'Cập nhật', value: '1 ngày', icon: Clock, sub: 'Bởi Founder' },
                                ].map((s, i) => (
                                    <div key={i} className="bg-white rounded-2xl border border-[#102c1e]/8 p-4 hover:border-[#102c1e]/20 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-geist text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</span>
                                            <s.icon className="w-4 h-4 text-[#102c1e]/30" />
                                        </div>
                                        <p className="font-mono font-black text-[#102c1e] text-2xl">{s.value}</p>
                                        <p className="font-geist text-[10px] text-slate-400 mt-1">{s.sub}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2">
                                {DATA_DOCS.map(doc => (
                                    <div
                                        key={doc.id}
                                        className={cn(
                                            'group flex items-center gap-4 bg-white border rounded-2xl px-5 py-4 hover:border-[#102c1e]/20 transition-all cursor-pointer hover:shadow-sm',
                                            !doc.viewed ? 'border-[#102c1e]/15 bg-[#102c1e]/[0.01]' : 'border-[#102c1e]/6'
                                        )}
                                    >
                                        <span className="text-2xl">{TYPE_ICON[doc.type]}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-geist font-black text-[#102c1e] text-sm truncate">{doc.name}</p>
                                                {!doc.viewed && (
                                                    <span className="font-geist text-[9px] font-black bg-[#102c1e] text-white px-1.5 py-0.5 rounded-full shrink-0">NEW</span>
                                                )}
                                            </div>
                                            <p className="font-geist text-[10px] text-slate-400 mt-0.5">
                                                {doc.size && `${doc.size} · `}Cập nhật {doc.lastUpdated}
                                                {doc.pages && ` · ${doc.pages} trang`}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 rounded-lg hover:bg-[#102c1e]/5 text-slate-400 hover:text-[#102c1e] transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 rounded-lg hover:bg-[#102c1e]/5 text-slate-400 hover:text-[#102c1e] transition-colors">
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                        {doc.viewed && <CheckCircle2 className="w-4 h-4 text-[#a1e2b6] shrink-0" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── TAB: DD CHECKLIST ── */}
                    {activeTab === 'checklist' && (
                        <div className="space-y-6">
                            {/* Summary pills */}
                            <div className="flex items-center gap-2 flex-wrap">
                                {(Object.entries(STATUS_CONFIG) as [CheckStatus, typeof STATUS_CONFIG['done']][]).map(([status, cfg]) => {
                                    const count = items.filter(i => i.status === status).length;
                                    return (
                                        <div key={status} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-xl border', cfg.bg)}>
                                            <cfg.icon className={cn('w-3.5 h-3.5', cfg.color)} />
                                            <span className={cn('font-geist text-xs font-bold', cfg.color)}>{count} {cfg.label}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Grouped items */}
                            {Object.entries(grouped).map(([cat, catItems]) => (
                                <div key={cat}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <h3 className="font-outfit font-black text-[#102c1e] text-base">{cat}</h3>
                                        <div className="h-px flex-1 bg-[#102c1e]/8" />
                                        <span className="font-geist text-[10px] font-bold text-slate-400">
                                            {catItems.filter(i => i.status === 'done').length}/{catItems.length}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        {catItems.map(item => {
                                            const cfg = STATUS_CONFIG[item.status];
                                            const StatusIcon = cfg.icon;
                                            return (
                                                <div
                                                    key={item.id}
                                                    onClick={() => toggleStatus(item.id)}
                                                    className={cn(
                                                        'group flex items-start gap-4 bg-white border rounded-2xl px-4 py-3.5 cursor-pointer hover:shadow-sm transition-all',
                                                        item.status === 'issue' ? 'border-red-200 bg-red-50/30' :
                                                            item.status === 'done' ? 'border-[#102c1e]/8' : 'border-[#102c1e]/8 hover:border-[#102c1e]/20'
                                                    )}
                                                >
                                                    {/* Status icon */}
                                                    <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5', cfg.bg)}>
                                                        <StatusIcon className={cn('w-4 h-4', cfg.color)} />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className={cn('font-geist font-bold text-sm', item.status === 'done' ? 'text-[#102c1e]' : item.status === 'issue' ? 'text-red-700' : 'text-slate-600')}>
                                                                {item.label}
                                                            </p>
                                                            {item.weight === 'critical' && (
                                                                <span className="font-geist text-[8px] font-black bg-[#102c1e] text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider">Critical</span>
                                                            )}
                                                        </div>
                                                        {item.note && (
                                                            <p className="font-inter text-xs text-red-600 mt-1">{item.note}</p>
                                                        )}
                                                    </div>

                                                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── TAB: INTERNAL NOTES ── */}
                    {activeTab === 'notes' && (
                        <div className="max-w-2xl">
                            <div className="bg-[#102c1e]/[0.02] border border-[#102c1e]/8 rounded-2xl p-3 mb-4 text-xs font-geist text-slate-500 flex items-center gap-2">
                                <Lock className="w-3.5 h-3.5 text-[#102c1e]/30" />
                                Ghi chú nội bộ — Founder không thể xem nội dung này. Chỉ team của bạn.
                            </div>

                            <div className="space-y-3 mb-6">
                                {notes.map((n, i) => (
                                    <div key={i} className="bg-white border border-[#102c1e]/8 rounded-2xl p-4 hover:border-[#102c1e]/15 transition-colors">
                                        <p className="font-inter text-sm text-[#102c1e] leading-relaxed">{n.text}</p>
                                        <p className="font-geist text-[10px] text-slate-400 mt-2">{n.time}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Note compose */}
                            <div className="bg-white border border-[#102c1e]/10 rounded-2xl overflow-hidden focus-within:border-[#102c1e]/30 transition-colors shadow-sm">
                                <textarea
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                    placeholder="Ghi chú thẩm định nội bộ..."
                                    rows={4}
                                    className="w-full px-5 pt-4 pb-2 bg-transparent font-inter text-sm text-[#102c1e] placeholder:text-slate-300 resize-none focus:outline-none"
                                />
                                <div className="flex items-center justify-between px-5 pb-4">
                                    <span className="font-geist text-[10px] text-slate-400">{note.length} ký tự</span>
                                    <button
                                        onClick={() => {
                                            if (!note.trim()) return;
                                            setNotes(prev => [{ text: note.trim(), time: 'Vừa xong' }, ...prev]);
                                            setNote('');
                                        }}
                                        className="flex items-center gap-2 bg-[#102c1e] text-white font-geist font-bold text-xs px-4 py-2 rounded-xl hover:bg-[#0a1c13] transition-colors"
                                    >
                                        <Send className="w-3 h-3" /> Lưu ghi chú
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── TAB: AI RED FLAG SCANNER ── */}
                    {activeTab === 'ai-scanner' && (
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center gap-2 bg-[#102c1e] text-[#a1e2b6] px-4 py-2 rounded-xl font-geist font-black text-sm">
                                    <Sparkles className="w-4 h-4" />
                                    AI Analysis Complete
                                </div>
                                <span className="font-geist text-xs text-slate-400">Phân tích {DATA_DOCS.length} tài liệu · Cập nhật 2h trước</span>
                            </div>

                            <div className="space-y-3">
                                {AI_FLAGS.map((flag, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            'rounded-2xl border p-5 flex items-start gap-4 transition-all hover:shadow-sm',
                                            flag.level === 'warn' ? 'bg-red-50/40 border-red-200' :
                                                flag.level === 'ok' ? 'bg-[#a1e2b6]/8 border-[#a1e2b6]/30' :
                                                    'bg-white border-[#102c1e]/8'
                                        )}
                                    >
                                        <div className={cn(
                                            'w-8 h-8 rounded-xl flex items-center justify-center shrink-0',
                                            flag.level === 'warn' ? 'bg-red-100 text-red-500' :
                                                flag.level === 'ok' ? 'bg-[#a1e2b6]/20 text-[#102c1e]' :
                                                    'bg-[#102c1e]/5 text-[#102c1e]'
                                        )}>
                                            {flag.level === 'warn' ? <AlertTriangle className="w-4 h-4" /> :
                                                flag.level === 'ok' ? <CheckCircle2 className="w-4 h-4" /> :
                                                    <Activity className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className={cn(
                                                'font-geist font-black text-sm mb-1',
                                                flag.level === 'warn' ? 'text-red-700' : 'text-[#102c1e]'
                                            )}>{flag.title}</p>
                                            <p className="font-inter text-sm text-slate-600 leading-relaxed">{flag.detail}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Regenerate */}
                            <button className="mt-6 flex items-center gap-2 text-[#102c1e]/50 hover:text-[#102c1e] font-geist text-xs font-bold transition-colors">
                                <Sparkles className="w-3.5 h-3.5" />
                                Chạy lại phân tích AI với tài liệu mới nhất
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
