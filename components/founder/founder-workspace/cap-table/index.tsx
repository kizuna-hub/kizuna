'use client';

import React, { useState } from 'react';
import {
    Plus, MoreHorizontal, Shield, Users, TrendingUp,
    Download, Lock, Unlock, ChevronDown, Pencil, Trash2, ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Shareholder, CapTableStats } from './types';
import { CapTableChart } from './cap-table-chart';

// ─── MOCK DATA ──────────────────────────────────────────────────
const INITIAL_SHAREHOLDERS: Shareholder[] = [
    {
        id: 'sh-1', name: 'Hoàng Trần', type: 'founder', shares: 4_500_000,
        percentage: 45.0, date: '2024-01-01',
        notes: 'Co-founder & CEO',
        vestingSchedule: { totalMonths: 48, cliffMonths: 12, vestedPercent: 35 },
    },
    {
        id: 'sh-2', name: 'Minh Nguyễn', type: 'founder', shares: 3_000_000,
        percentage: 30.0, date: '2024-01-01',
        notes: 'Co-founder & CTO',
        vestingSchedule: { totalMonths: 48, cliffMonths: 12, vestedPercent: 35 },
    },
    {
        id: 'sh-3', name: 'Kizuna Ventures', type: 'investor', shares: 1_000_000,
        percentage: 10.0, investedAmount: 500_000, round: 'Pre-Seed',
        date: '2024-06-15', notes: 'Lead Investor — Pre-Seed Round',
    },
    {
        id: 'sh-4', name: 'Tuấn Mentor', type: 'advisor', shares: 200_000,
        percentage: 2.0, date: '2024-03-01',
        notes: 'Growth & GTM Advisor',
        vestingSchedule: { totalMonths: 24, cliffMonths: 6, vestedPercent: 60 },
    },
    {
        id: 'sh-5', name: 'ESOP Pool', type: 'esop', shares: 1_300_000,
        percentage: 13.0, date: '2024-01-01',
        notes: 'Reserved for future employees & key hires',
    },
];

const CAP_TABLE_STATS: CapTableStats = {
    totalShares: 10_000_000,
    fullyDilutedShares: 10_000_000,
    optionPoolShares: 1_300_000,
    optionPoolPercent: 13.0,
    postMoneyValuation: 5_000_000,
    pricePerShare: 0.5,
    lastRound: 'Pre-Seed — $500K',
};

// ─── TYPE CONFIG ─────────────────────────────────────────────────
const TYPE_CONFIG: Record<Shareholder['type'], { label: string; badge: string; dot: string }> = {
    founder: {
        label: 'Founder',
        badge: 'bg-[#102c1e] text-white',
        dot: 'bg-[#102c1e]',
    },
    investor: {
        label: 'Investor',
        badge: 'bg-[#a1e2b6]/30 border border-[#a1e2b6]/50 text-[#102c1e]',
        dot: 'bg-[#a1e2b6]',
    },
    advisor: {
        label: 'Advisor',
        badge: 'bg-[#102c1e]/10 text-[#102c1e]',
        dot: 'bg-[#4a7c5f]',
    },
    esop: {
        label: 'ESOP',
        badge: 'bg-slate-100 text-slate-600',
        dot: 'bg-slate-400',
    },
    employee: {
        label: 'Employee',
        badge: 'bg-slate-50 border border-slate-200 text-slate-500',
        dot: 'bg-slate-300',
    },
};

// ─── VESTING BAR ────────────────────────────────────────────────
function VestingBar({ schedule }: { schedule: NonNullable<Shareholder['vestingSchedule']> }) {
    const cliffPct = (schedule.cliffMonths / schedule.totalMonths) * 100;
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1">
                <span className="font-geist text-[9px] text-slate-400 font-bold uppercase">Vesting</span>
                <span className="font-mono text-[9px] font-bold text-[#102c1e]">{schedule.vestedPercent}%</span>
            </div>
            <div className="relative h-1.5 w-full rounded-full bg-slate-100">
                {/* Cliff marker */}
                <div
                    className="absolute top-0 bottom-0 w-px bg-white z-10"
                    style={{ left: `${cliffPct}%` }}
                />
                {/* Progress */}
                <div
                    className="h-full rounded-full bg-[#102c1e] transition-all"
                    style={{ width: `${schedule.vestedPercent}%` }}
                />
            </div>
        </div>
    );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────
export default function CapTable() {
    const [shareholders, setShareholders] = useState<Shareholder[]>(INITIAL_SHAREHOLDERS);
    const [activeRow, setActiveRow] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const stats = CAP_TABLE_STATS;
    const totalPct = shareholders.reduce((s, sh) => s + sh.percentage, 0);

    return (
        <div className="min-h-screen w-full bg-[#fafafa] p-6 md:p-8 lg:p-10 font-inter">
            <div className="mx-auto flex h-full max-w-6xl flex-col space-y-8">

                {/* ── HEADER ── */}
                <header className="pt-6 pb-4 border-b border-[#102c1e]/10 flex items-end justify-between gap-6">
                    <div>
                        <h1 className="font-outfit font-black text-[#102c1e] text-4xl tracking-tight">
                            Cap Table
                        </h1>
                        <p className="font-inter text-slate-600 mt-2 text-base">
                            Cơ cấu sở hữu công ty theo thời gian thực.
                            <span className="ml-2 bg-[#a1e2b6]/20 border border-[#a1e2b6]/40 px-2 py-0.5 rounded-full font-geist text-xs font-bold text-[#102c1e]">
                                {stats.lastRound}
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#102c1e]/10 bg-white font-geist text-sm font-bold text-[#102c1e]/70 hover:border-[#102c1e]/30 hover:text-[#102c1e] transition-all shadow-sm">
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#102c1e] font-geist text-sm font-black text-white hover:bg-[#0a1c13] transition-all shadow-md"
                        >
                            <Plus className="w-4 h-4" />
                            Add Shareholder
                        </button>
                    </div>
                </header>

                {/* ── STATS ROW ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Shares', value: stats.totalShares.toLocaleString(), icon: Shield, accent: false },
                        { label: 'Post-Money Val.', value: `$${(stats.postMoneyValuation! / 1_000_000).toFixed(1)}M`, icon: TrendingUp, accent: true },
                        { label: 'Price Per Share', value: `$${stats.pricePerShare?.toFixed(2)}`, icon: ArrowUpRight, accent: false },
                        { label: 'ESOP Pool', value: `${stats.optionPoolPercent}%`, icon: Users, accent: false },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className={cn(
                                'rounded-2xl p-5 border shadow-sm',
                                stat.accent
                                    ? 'bg-[#102c1e] border-[#102c1e] text-white'
                                    : 'bg-white border-[#102c1e]/10'
                            )}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <p className={cn('font-geist text-[10px] font-bold uppercase tracking-widest', stat.accent ? 'text-white/60' : 'text-slate-400')}>
                                    {stat.label}
                                </p>
                                <stat.icon className={cn('w-4 h-4', stat.accent ? 'text-[#a1e2b6]' : 'text-[#102c1e]/30')} />
                            </div>
                            <p className={cn('font-mono text-2xl font-black tracking-tight', stat.accent ? 'text-white' : 'text-[#102c1e]')}>
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* ── MAIN GRID: Chart + Table ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT: Donut Chart */}
                    <div className="lg:col-span-4 bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm p-6 flex flex-col">
                        <h2 className="font-outfit font-black text-[#102c1e] text-xl mb-6">
                            Ownership Structure
                        </h2>
                        <CapTableChart
                            shareholders={shareholders}
                            totalShares={stats.totalShares}
                            optionPoolPercent={stats.optionPoolPercent}
                        />

                        {/* Dilution warning */}
                        {totalPct > 100 && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                                <p className="font-geist text-xs font-bold text-red-600">
                                    ⚠️ Tổng % vượt quá 100%. Kiểm tra lại cổ phần.
                                </p>
                            </div>
                        )}

                        {/* Key info */}
                        <div className="mt-6 pt-4 border-t border-[#102c1e]/5 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="font-geist text-xs text-slate-500 font-bold">Fully Diluted</span>
                                <span className="font-mono text-xs font-black text-[#102c1e]">
                                    {stats.fullyDilutedShares.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-geist text-xs text-slate-500 font-bold">Unissued ESOP</span>
                                <span className="font-mono text-xs font-black text-[#102c1e]">
                                    {stats.optionPoolShares.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Shareholder Table */}
                    <div className="lg:col-span-8 bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#102c1e]/5 flex items-center justify-between bg-white">
                            <h2 className="font-outfit font-black text-[#102c1e] text-xl">
                                Shareholders
                                <span className="ml-2 font-geist text-sm font-bold text-slate-400">({shareholders.length})</span>
                            </h2>
                            {/* Filter pills */}
                            <div className="flex items-center gap-1">
                                {(['All', 'Founders', 'Investors', 'ESOP'] as const).map((f) => (
                                    <button
                                        key={f}
                                        className="px-3 py-1 rounded-full font-geist text-[10px] font-bold text-[#102c1e]/60 hover:bg-[#102c1e]/5 hover:text-[#102c1e] transition-all first:bg-[#102c1e] first:text-white"
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[#102c1e]/5">
                                        {['Shareholder', 'Type', 'Shares', 'Ownership', 'Vesting', ''].map(h => (
                                            <th key={h} className="px-5 py-3 font-geist text-[9px] font-bold uppercase tracking-widest text-[#102c1e]/40">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#102c1e]/5">
                                    {shareholders.map((sh) => {
                                        const cfg = TYPE_CONFIG[sh.type];
                                        return (
                                            <tr
                                                key={sh.id}
                                                className="group/row hover:bg-[#102c1e]/[0.02] transition-colors"
                                            >
                                                {/* Name */}
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-xl bg-[#102c1e]/5 border border-[#102c1e]/10 flex items-center justify-center shrink-0">
                                                            <span className="font-geist text-[11px] font-black text-[#102c1e]">
                                                                {sh.name.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-geist text-sm font-black text-[#102c1e] leading-none">{sh.name}</p>
                                                            {sh.notes && (
                                                                <p className="font-inter text-[11px] text-slate-400 mt-0.5">{sh.notes}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Type badge */}
                                                <td className="px-5 py-4">
                                                    <span className={cn('font-geist text-[10px] font-bold px-2.5 py-1 rounded-full', cfg.badge)}>
                                                        {cfg.label}
                                                    </span>
                                                </td>

                                                {/* Shares */}
                                                <td className="px-5 py-4">
                                                    <p className="font-mono text-sm font-bold text-[#102c1e]">
                                                        {sh.shares.toLocaleString()}
                                                    </p>
                                                    {sh.investedAmount && (
                                                        <p className="font-mono text-[10px] text-slate-400">
                                                            ${sh.investedAmount.toLocaleString()}
                                                        </p>
                                                    )}
                                                </td>

                                                {/* Ownership % */}
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full rounded-full transition-all"
                                                                style={{
                                                                    width: `${Math.min(100, sh.percentage)}%`,
                                                                    backgroundColor: TYPE_CONFIG[sh.type].dot.replace('bg-', '').includes('[') ? '#102c1e' : undefined,
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="font-mono text-xs font-black text-[#102c1e]">
                                                            {sh.percentage.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Vesting */}
                                                <td className="px-5 py-4 min-w-[120px]">
                                                    {sh.vestingSchedule ? (
                                                        <VestingBar schedule={sh.vestingSchedule} />
                                                    ) : (
                                                        <span className="font-geist text-[10px] text-slate-300 font-bold">N/A</span>
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-5 py-4">
                                                    <div className="opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center gap-1">
                                                        <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-[#102c1e] transition-colors">
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer: add row CTA */}
                        <div className="px-5 py-3 border-t border-[#102c1e]/5 bg-[#fafafa]/60">
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center gap-2 font-geist text-xs font-bold text-[#102c1e]/40 hover:text-[#102c1e] transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Add shareholder row
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── DISCLAIMER ── */}
                <div className="bg-white border border-[#102c1e]/8 rounded-2xl px-5 py-4 flex items-start gap-3">
                    <Lock className="w-4 h-4 text-[#102c1e]/30 mt-0.5 shrink-0" />
                    <p className="font-inter text-xs text-slate-500 leading-relaxed">
                        <span className="font-bold text-[#102c1e]">Lưu ý pháp lý:</span> Cap Table này là công cụ theo dõi nội bộ, không phải tài liệu pháp lý có hiệu lực. 
                        Mọi thay đổi cơ cấu cổ đông cần được thực hiện qua hợp đồng chính thức có công chứng theo Luật Doanh nghiệp Việt Nam 2020.
                    </p>
                </div>

            </div>
        </div>
    );
}
