'use client';

import React, { useState, useMemo } from 'react';
import {
    FileSignature, Lock, Unlock, Zap, MoreHorizontal, Download,
    HelpCircle, Search, TrendingUp, X, ChevronDown, ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── TYPES ────────────────────────────────────────────────────────────────────
type VestingStatus = 'vesting' | 'cliff' | 'new' | 'complete';
type FilterKey = 'all' | 'vesting' | 'cliff' | 'complete';

interface FASTContract {
    id: number;
    startup: string;
    initials: string;
    role: string;
    vertical: string;
    equity: string;
    equityValue: string;   // estimated USD value
    valuation: string;     // implied startup valuation
    cliffMonths: number;   // 0 = no cliff
    vestingMonths: number;
    cliffLabel: string;
    vestingLabel: string;
    progress: number;      // 0–100
    status: VestingStatus;
    statusLabel: string;
    nextEvent: string;     // date string of next cliff / vesting event
}

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const CONTRACTS: FASTContract[] = [
    {
        id: 1,
        startup: 'Kizuna Hub',
        initials: 'KH',
        role: 'Product Advisory',
        vertical: 'B2B SaaS',
        equity: '1.5%',
        equityValue: '$75,000',
        valuation: '$5.0M',
        cliffMonths: 12,
        vestingMonths: 48,
        cliffLabel: '1 Năm Cliff',
        vestingLabel: '4 Năm / 48 Tháng',
        progress: 35,
        status: 'vesting',
        statusLabel: 'Đang Vesting',
        nextEvent: '01/10/2026',
    },
    {
        id: 2,
        startup: 'Dietfit AI',
        initials: 'DA',
        role: 'Growth Strategy',
        vertical: 'HealthTech',
        equity: '0.5%',
        equityValue: '$12,500',
        valuation: '$2.5M',
        cliffMonths: 0,
        vestingMonths: 24,
        cliffLabel: 'Không Cliff',
        vestingLabel: '2 Năm / 24 Tháng',
        progress: 10,
        status: 'cliff',
        statusLabel: 'Chờ Cliff',
        nextEvent: '15/08/2026',
    },
    {
        id: 3,
        startup: 'SnapMoney',
        initials: 'SM',
        role: 'Technical Expert (CTO-as-a-Service)',
        vertical: 'FinTech',
        equity: '2.0%',
        equityValue: '$180,000',
        valuation: '$9.0M',
        cliffMonths: 12,
        vestingMonths: 48,
        cliffLabel: '1 Năm Cliff',
        vestingLabel: '4 Năm / 48 Tháng',
        progress: 100,
        status: 'complete',
        statusLabel: 'Hoàn tất',
        nextEvent: '—',
    },
    {
        id: 4,
        startup: 'EcoDeliver',
        initials: 'ED',
        role: 'Go-to-Market Advisor',
        vertical: 'LogiTech',
        equity: '0.8%',
        equityValue: '$24,000',
        valuation: '$3.0M',
        cliffMonths: 6,
        vestingMonths: 24,
        cliffLabel: '6 Tháng Cliff',
        vestingLabel: '2 Năm / 24 Tháng',
        progress: 5,
        status: 'new',
        statusLabel: 'Mới bắt đầu',
        nextEvent: '01/12/2026',
    },
];

// ─── FILTER CONFIG ─────────────────────────────────────────────────────────────
const FILTERS: { key: FilterKey; label: string }[] = [
    { key: 'all',      label: 'Tất cả' },
    { key: 'vesting',  label: 'Đang Vesting' },
    { key: 'cliff',    label: 'Chờ Cliff' },
    { key: 'complete', label: 'Hoàn tất 100%' },
];

// ─── STATUS CONFIG ─────────────────────────────────────────────────────────────
const STATUS_CFG: Record<VestingStatus, { dot: string; badge: string; bar: string }> = {
    vesting:  { dot: 'bg-[#102c1e]',    badge: 'bg-[#102c1e]/8 text-[#102c1e] border-[#102c1e]/15',       bar: 'bg-[#102c1e]'    },
    cliff:    { dot: 'bg-amber-500',     badge: 'bg-amber-50 text-amber-700 border-amber-200',              bar: 'bg-amber-400'    },
    new:      { dot: 'bg-slate-400',     badge: 'bg-slate-100 text-slate-600 border-slate-200',             bar: 'bg-slate-400'    },
    complete: { dot: 'bg-emerald-500',   badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',        bar: 'bg-[#a1e2b6]'   },
};

// ─── COMPUTED SUMMARY ─────────────────────────────────────────────────────────
const totalVested  = '$267,500';
const totalUnvested = '$24,000';
const nextCliff    = CONTRACTS.find(c => c.status === 'cliff');

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function FastLedger() {
    const [showTooltip, setShowTooltip] = useState(false);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<FilterKey>('all');
    const [openMenu, setOpenMenu] = useState<number | null>(null);

    const filtered = useMemo(() => {
        return CONTRACTS.filter(c => {
            const matchSearch = c.startup.toLowerCase().includes(search.toLowerCase()) ||
                c.role.toLowerCase().includes(search.toLowerCase());
            const matchFilter = filter === 'all' || c.status === filter ||
                (filter === 'cliff' && (c.status === 'cliff' || c.status === 'new'));
            return matchSearch && matchFilter;
        });
    }, [search, filter]);

    return (
        <div className="min-h-screen w-full bg-[#fafafa] p-6 md:p-8 lg:p-10 font-sans text-[#102c1e]">
            <div className="mx-auto flex h-full max-w-6xl flex-col space-y-6">

                {/* ── HEADER ── */}
                <header className="flex items-end justify-between border-b border-slate-200 pb-5">
                    <div>
                        <p className="font-sans text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Quản trị cổ phần</p>
                        <div className="flex items-center gap-2.5">
                            <h1 className="font-heading font-black text-[#102c1e] text-3xl md:text-4xl tracking-tight">
                                Sổ cái Hợp đồng FAST
                            </h1>
                            {/* [i] Tooltip — compressed legal note */}
                            <div className="relative mt-1">
                                <button
                                    onMouseEnter={() => setShowTooltip(true)}
                                    onMouseLeave={() => setShowTooltip(false)}
                                    className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors"
                                >
                                    <HelpCircle className="w-3 h-3 text-slate-400" />
                                </button>
                                {showTooltip && (
                                    <div className="absolute left-7 top-0 z-30 w-72 bg-[#102c1e] text-white rounded-2xl px-4 py-3 shadow-2xl pointer-events-none">
                                        <p className="font-sans font-black text-xs mb-1">⚖️ Lưu ý pháp lý — FAST</p>
                                        <p className="font-sans text-[11px] text-white/70 leading-relaxed">
                                            Hợp đồng là bản ghi nội bộ, không có hiệu lực pháp lý tại Việt Nam nếu chưa công chứng theo Luật DN 2020.{' '}
                                            <a href="#" className="underline text-[#a1e2b6]">Tìm hiểu thêm →</a>
                                        </p>
                                        <div className="absolute -left-1.5 top-3 w-3 h-3 bg-[#102c1e] rotate-45" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="font-sans text-sm text-slate-500 mt-1.5">
                            Quản lý Cam kết Tiêu chuẩn & Lộ trình Vesting (Founder / Advisor Standard Template).
                        </p>
                    </div>
                    {/* Template download — header only */}
                    <a
                        href="#"
                        className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-sans text-sm font-bold text-[#102c1e] shadow-sm transition-colors hover:bg-slate-50"
                    >
                        <Download className="h-4 w-4" /> Template FAST-VN
                    </a>
                </header>

                {/* ── ZONE 1: TOP METRICS ── */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                    {/* Vested */}
                    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-[#a1e2b6]/8 pointer-events-none" />
                        <p className="relative font-sans text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Tổng Tài sản Đã Vest
                        </p>
                        <p className="relative mt-3 font-mono text-4xl font-black tracking-tighter text-[#102c1e]">{totalVested}</p>
                        <div className="relative mt-3 flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="font-sans text-xs font-bold text-emerald-600">+$12K vs. tháng trước</span>
                        </div>
                    </div>

                    {/* Unvested */}
                    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                        <p className="font-sans text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Tài sản Đang Chờ (Unvested)
                        </p>
                        <p className="mt-3 font-mono text-4xl font-black tracking-tighter text-slate-400">{totalUnvested}</p>
                        <p className="mt-3 font-sans text-xs text-slate-400">Trên {CONTRACTS.filter(c => c.status !== 'complete').length} hợp đồng đang chạy</p>
                    </div>

                    {/* Next Cliff — dark card */}
                    <div className="relative flex flex-col overflow-hidden rounded-2xl bg-[#102c1e] p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#a1e2b6]/10 rounded-full blur-2xl pointer-events-none" />
                        <p className="relative flex items-center gap-2 font-sans text-[10px] font-black uppercase tracking-widest text-[#a1e2b6]/70">
                            <Zap className="h-3 w-3 text-[#a1e2b6]" /> Cliff Gần nhất (Sắp tới)
                        </p>
                        {nextCliff ? (
                            <div className="relative mt-3">
                                <p className="font-mono text-3xl font-black tracking-tighter text-white">{nextCliff.startup}</p>
                                <p className="mt-2 border-t border-white/10 pt-2 font-sans text-sm text-[#a1e2b6]">
                                    Vào ngày {nextCliff.nextEvent}
                                </p>
                            </div>
                        ) : (
                            <p className="relative mt-3 font-sans text-sm text-white/50">Không có cliff sắp tới</p>
                        )}
                    </div>
                </div>

                {/* ── ZONE 2: CONTROL BAR ── */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px] max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Tìm Startup hoặc vai trò..."
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl font-sans text-sm text-[#102c1e] placeholder:text-slate-400 focus:outline-none focus:border-[#102c1e]/30 focus:bg-white transition-all shadow-sm"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#102c1e]">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Filter pills */}
                    <div className="flex items-center gap-1.5">
                        {FILTERS.map(f => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={cn(
                                    'px-3.5 py-2 rounded-xl font-sans text-xs font-bold border transition-all',
                                    filter === f.key
                                        ? 'bg-[#102c1e] text-white border-[#102c1e] shadow-sm'
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-[#102c1e]'
                                )}
                            >
                                {f.label}
                                {f.key === 'all' && (
                                    <span className="ml-1.5 font-mono text-[10px] opacity-60">{CONTRACTS.length}</span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Spacer + CSV export */}
                    <div className="ml-auto">
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-sans text-xs font-bold text-[#102c1e] shadow-sm hover:bg-slate-50 transition-all">
                            <ArrowUpRight className="w-3.5 h-3.5" /> Xuất CSV
                        </button>
                    </div>
                </div>

                {/* ── ZONE 3: DATA GRID ── */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

                    {/* Grid header label */}
                    <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-slate-50/60">
                        <div className="flex items-center gap-2">
                            <FileSignature className="w-4 h-4 text-[#102c1e]/40" />
                            <span className="font-heading font-black text-[#102c1e] text-base">Danh sách Cam kết</span>
                        </div>
                        <div className="flex items-center gap-3 font-sans text-xs text-slate-400">
                            <span><span className="font-black text-[#102c1e]">{CONTRACTS.filter(c => c.status !== 'complete').length}</span> đang chạy</span>
                            <span className="w-px h-4 bg-slate-200" />
                            <span><span className="font-black text-[#102c1e]">{CONTRACTS.filter(c => c.status === 'complete').length}</span> hoàn tất</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-[900px] w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="px-6 py-3 font-sans text-[10px] font-bold uppercase tracking-widest text-slate-400">Startup & Vai trò</th>
                                    <th className="px-4 py-3 font-sans text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Equity & Value</th>
                                    <th className="px-4 py-3 font-sans text-[10px] font-bold uppercase tracking-widest text-slate-400">Vesting Terms</th>
                                    <th className="px-4 py-3 font-sans text-[10px] font-bold uppercase tracking-widest text-slate-400">Tiến độ</th>
                                    <th className="px-4 py-3 font-sans text-[10px] font-bold uppercase tracking-widest text-slate-400">Sự kiện tới</th>
                                    <th className="px-4 py-3 font-sans text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                                    <th className="px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center">
                                            <p className="font-sans text-sm font-bold text-slate-400">Không tìm thấy hợp đồng nào</p>
                                        </td>
                                    </tr>
                                ) : filtered.map(c => {
                                    const cfg = STATUS_CFG[c.status];
                                    const isMenuOpen = openMenu === c.id;
                                    return (
                                        <tr key={c.id} className="group/row transition-colors hover:bg-slate-50/60">

                                            {/* COL 1: Startup + Role */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-[#102c1e] flex items-center justify-center font-heading font-black text-sm text-[#a1e2b6] shrink-0">
                                                        {c.initials}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-heading font-black text-[#102c1e] text-sm leading-tight truncate">{c.startup}</p>
                                                        <p className="font-sans text-xs text-slate-500 truncate mt-0.5">{c.role}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* COL 2: Equity + USD value */}
                                            <td className="px-4 py-4 text-right">
                                                <p className="font-mono text-base font-black text-[#102c1e] leading-tight">{c.equity}</p>
                                                <p className="font-mono text-xs text-slate-400 mt-0.5">~{c.equityValue}</p>
                                            </td>

                                            {/* COL 3: Vesting Terms */}
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className={cn(
                                                        'inline-flex items-center gap-1 w-max font-sans text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border',
                                                        c.cliffMonths === 0
                                                            ? 'bg-slate-50 border-slate-200 text-slate-500'
                                                            : 'bg-[#102c1e]/5 border-[#102c1e]/10 text-[#102c1e]'
                                                    )}>
                                                        {c.cliffMonths === 0
                                                            ? <Unlock className="w-2.5 h-2.5" />
                                                            : <Lock className="w-2.5 h-2.5" />
                                                        }
                                                        {c.cliffLabel}
                                                    </span>
                                                    <p className="font-sans text-xs font-medium text-slate-600">{c.vestingLabel}</p>
                                                </div>
                                            </td>

                                            {/* COL 4: Progress bar */}
                                            <td className="px-4 py-4">
                                                <div className="w-full min-w-[140px]">
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <span className="font-mono text-xs font-bold text-[#102c1e]">{c.progress}%</span>
                                                    </div>
                                                    {/* Compact bar */}
                                                    <div className="relative h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                                                        {/* Cliff marker */}
                                                        {c.cliffMonths > 0 && (
                                                            <div
                                                                className="absolute top-0 bottom-0 w-px bg-white z-10"
                                                                style={{ left: `${(c.cliffMonths / c.vestingMonths) * 100}%` }}
                                                            />
                                                        )}
                                                        <div
                                                            className={cn('h-full rounded-full transition-all duration-700 relative', cfg.bar)}
                                                            style={{ width: `${c.progress}%` }}
                                                        >
                                                            {c.progress > 0 && c.progress < 100 && (
                                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white border-[2.5px] border-current shadow-sm" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* COL 5: Next event date */}
                                            <td className="px-4 py-4">
                                                <p className="font-mono text-xs font-bold text-[#102c1e]">{c.nextEvent}</p>
                                                <p className="font-sans text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide">
                                                    {c.status === 'cliff' ? 'Cliff date' : c.status === 'complete' ? 'Hoàn tất' : 'Kỳ vesting'}
                                                </p>
                                            </td>

                                            {/* COL 6: Status badge */}
                                            <td className="px-4 py-4">
                                                <span className={cn(
                                                    'inline-flex items-center gap-1.5 font-sans text-[10px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap',
                                                    cfg.badge
                                                )}>
                                                    <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
                                                    {c.statusLabel}
                                                </span>
                                            </td>

                                            {/* COL 7: Action menu */}
                                            <td className="px-4 py-4 relative">
                                                <button
                                                    onClick={() => setOpenMenu(isMenuOpen ? null : c.id)}
                                                    className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 hover:text-[#102c1e] transition-colors"
                                                >
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                                {isMenuOpen && (
                                                    <div className="absolute right-6 top-full z-20 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                                                        {['Xem chi tiết', 'Tải hợp đồng PDF', 'Yêu cầu Counter', 'Lưu trữ'].map(item => (
                                                            <button
                                                                key={item}
                                                                onClick={() => setOpenMenu(null)}
                                                                className="w-full text-left px-4 py-2.5 font-sans text-sm text-[#102c1e] hover:bg-slate-50 transition-colors"
                                                            >
                                                                {item}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Grid footer */}
                    <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between">
                        <p className="font-sans text-xs text-slate-400">
                            Hiển thị {filtered.length} / {CONTRACTS.length} hợp đồng
                        </p>
                        <p className="font-sans text-xs text-slate-400">
                            Tổng Equity: <span className="font-black text-[#102c1e]">4.8%</span>
                            <span className="mx-2 text-slate-200">·</span>
                            Implied Value: <span className="font-black text-[#102c1e]">$291,500</span>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}