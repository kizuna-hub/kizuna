'use client';

import React from 'react';
import {
    ArrowRight, CheckCircle2, FileText, TrendingUp,
    AlertTriangle, Clock, Check, X, ChevronRight,
    Award, Calendar, DollarSign, Activity
} from 'lucide-react';
import { Link } from '@/i18n/routing';

// --- MOCK DATA ---
const ACTION_QUEUE = [
    {
        id: 1,
        priority: 'urgent',
        entity: 'Dietfit AI',
        title: 'Ký hợp đồng FAST (Advisory Agreement)',
        context: 'Dietfit đề xuất 1.5% cổ phần (Vesting 2 năm) cho vị trí Cố vấn Sản phẩm.',
        time: '2h trước'
    },
    {
        id: 2,
        priority: 'urgent',
        entity: 'Kizuna Hub',
        title: 'Duyệt Báo cáo Tài chính Tháng 4',
        context: 'Báo cáo trễ hạn 2 ngày. Cần xem xét mức tăng trưởng MRR (+14.5%) trước buổi họp.',
        time: '5h trước'
    },
    {
        id: 3,
        priority: 'normal',
        entity: 'SnapMoney',
        title: 'Yêu cầu Warm Intro: Nextrans VC',
        context: 'Founder Lê Bảo muốn xin giới thiệu đến Nguyễn Tuấn Anh (Partner tại Nextrans).',
        time: 'Hôm qua'
    },
];

const FAST_LEDGER = [
    {
        id: 'p1',
        name: 'Kizuna Hub',
        vertical: 'B2B SaaS',
        valuation: '$3.5M',
        equity: '2.0%',
        vested: '1.0%',
        growth: '+14.5%',
        nextSync: 'Hôm nay, 14:00'
    },
    {
        id: 'p2',
        name: 'SnapMoney',
        vertical: 'FinTech',
        valuation: '$12M',
        equity: '1.0%',
        vested: '0.5%',
        growth: '+22.0%',
        nextSync: '15/06/2026'
    },
    {
        id: 'p3',
        name: 'Dietfit AI',
        vertical: 'HealthTech',
        valuation: '$2.8M',
        equity: 'Pending',
        vested: '0%',
        growth: '+8.2%',
        nextSync: 'Chờ ký HĐ'
    },
];

// --- COMPONENT ---
export default function MentorDashboard() {
    return (
        <div className="min-h-screen w-full bg-[#fafafa] p-6 md:p-8 lg:p-10 font-inter text-[#102c1e]">
            <div className="mx-auto flex h-full max-w-6xl flex-col space-y-8">

                {/* ─── HEADER ─── */}
                <header className="flex items-end justify-between border-b border-slate-200 pb-5">
                    <div>
                        <p className="font-geist text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Elite Advisor Workspace</p>
                        <h1 className="font-outfit font-black text-[#102c1e] text-3xl md:text-4xl tracking-tight">Trung tâm Xử lý Tác vụ</h1>
                        <p className="font-inter text-slate-500 mt-2 text-sm">Xử lý yêu cầu từ Startup, tích lũy điểm uy tín và mở khóa tài sản cổ phần.</p>
                    </div>
                    <Link href="/mentor/dashboard/calendar" className="hidden md:flex items-center gap-2 bg-[#102c1e] text-[#a1e2b6] font-geist font-bold rounded-xl px-5 py-2.5 hover:bg-[#0a1c13] transition-colors shadow-sm text-sm">
                        <Calendar className="w-4 h-4" />
                        Quản lý Lịch trống
                    </Link>
                </header>

                {/* ─── PHÂN KHU 1: REWARDS & PULSE (4 METRICS) ─── */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Metric 1: Vested Equity */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-geist text-xs font-bold text-slate-500 uppercase tracking-wider">Tài sản cổ phần</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <DollarSign className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="font-mono text-3xl font-black text-[#102c1e]">$125,000</span>
                            <span className="font-geist text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mb-1">
                                ↑ 12%
                            </span>
                        </div>
                        <p className="font-inter text-xs text-slate-500 mt-2">Tổng giá trị Vested từ FAST</p>
                    </div>

                    {/* Metric 2: Capacity */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-geist text-xs font-bold text-slate-500 uppercase tracking-wider">Công suất (Slots)</span>
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Activity className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="font-mono text-3xl font-black text-[#102c1e]">3</span>
                            <span className="font-mono text-xl text-slate-400">/ 5</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                            <div className="h-full bg-[#102c1e] rounded-full" style={{ width: '60%' }} />
                        </div>
                    </div>

                    {/* Metric 3: Reputation Tier */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-geist text-xs font-bold text-slate-500 uppercase tracking-wider">Chỉ số Uy tín</span>
                            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                                <Award className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="font-mono text-3xl font-black text-[#102c1e]">92</span>
                            <span className="font-mono text-sm text-slate-400 mb-1">/ 100</span>
                        </div>
                        <p className="font-inter text-xs text-[#102c1e] font-bold mt-2 bg-amber-50 border border-amber-200 w-fit px-2 py-0.5 rounded-md">
                            Elite Advisor
                        </p>
                    </div>

                    {/* Metric 4: Next Milestone */}
                    <div className="bg-[#102c1e] border border-[#102c1e] rounded-2xl p-5 shadow-sm relative overflow-hidden text-white">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#a1e2b6]/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="flex items-center justify-between mb-3 relative">
                            <span className="font-geist text-xs font-bold text-white/60 uppercase tracking-wider">Kỳ Vesting Tới</span>
                            <div className="w-8 h-8 rounded-lg bg-white/10 text-[#a1e2b6] flex items-center justify-center">
                                <Clock className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="font-mono text-2xl font-black text-white relative">
                            30 Tháng 6
                        </div>
                        <p className="font-inter text-xs text-[#a1e2b6] mt-2 relative">
                            +0.25% SnapMoney equity
                        </p>
                    </div>
                </section>

                {/* ─── PHÂN KHU 2: ACTION QUEUE (DANH SÁCH TÁC VỤ) ─── */}
                <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <h2 className="font-outfit font-black text-[#102c1e] text-xl">Cần Xử Lý</h2>
                            <span className="bg-red-100 text-red-700 font-geist text-xs font-bold px-2.5 py-0.5 rounded-full">
                                {ACTION_QUEUE.filter(a => a.priority === 'urgent').length} Gấp
                            </span>
                        </div>
                        <Link href="/mentor/dashboard/requests" className="font-geist text-xs font-bold text-slate-400 hover:text-[#102c1e] transition-colors flex items-center gap-1">
                            Xem tất cả <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {ACTION_QUEUE.map((action) => (
                            <div key={action.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors group">

                                {/* Info */}
                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                    <div className="mt-1 shrink-0">
                                        {action.priority === 'urgent' ? (
                                            <AlertTriangle className="w-5 h-5 text-red-500" />
                                        ) : (
                                            <FileText className="w-5 h-5 text-slate-400" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-geist text-xs font-black text-[#102c1e] px-2 py-0.5 bg-slate-100 rounded-md">
                                                {action.entity}
                                            </span>
                                            <span className="font-geist text-xs text-slate-400">{action.time}</span>
                                        </div>
                                        <h3 className="font-outfit font-bold text-[#102c1e] text-base leading-tight mb-1 truncate">
                                            {action.title}
                                        </h3>
                                        <p className="font-inter text-sm text-slate-500 truncate">
                                            {action.context}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <button className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 font-geist text-xs font-bold hover:bg-slate-50 hover:text-[#102c1e] transition-colors shadow-sm">
                                        <X className="w-4 h-4" /> Từ chối
                                    </button>
                                    <button className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#102c1e] text-white font-geist text-xs font-bold hover:bg-[#0a1c13] transition-colors shadow-sm">
                                        <Check className="w-4 h-4" /> Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ─── PHÂN KHU 3: FAST LEDGER GRID (BẢNG DỮ LIỆU) ─── */}
                <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h2 className="font-outfit font-black text-[#102c1e] text-xl">Dự án Đang Cố vấn (FAST Ledger)</h2>
                        <Link href="/mentor/dashboard/fast-ledger" className="font-geist text-xs font-bold text-slate-400 hover:text-[#102c1e] transition-colors flex items-center gap-1">
                            Mở Sổ cái FAST <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="border-b border-slate-100 bg-white">
                                    <th className="px-6 py-4 font-geist text-xs font-bold text-slate-400 uppercase tracking-widest">Startup</th>
                                    <th className="px-4 py-4 font-geist text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Định giá</th>
                                    <th className="px-4 py-4 font-geist text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Cổ phần (FAST)</th>
                                    <th className="px-4 py-4 font-geist text-xs font-bold text-slate-400 uppercase tracking-widest">Tăng trưởng</th>
                                    <th className="px-6 py-4 font-geist text-xs font-bold text-slate-400 uppercase tracking-widest">Lịch họp tới</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {FAST_LEDGER.map((startup) => (
                                    <tr key={startup.id} className="hover:bg-slate-50/80 transition-colors group">

                                        {/* Tên & Ngành */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-outfit font-black text-[#102c1e] text-lg">
                                                    {startup.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-outfit font-bold text-[#102c1e] text-base group-hover:text-[#4a7c5f] transition-colors">{startup.name}</p>
                                                    <p className="font-inter text-xs text-slate-500">{startup.vertical}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Định giá */}
                                        <td className="px-4 py-4 text-right">
                                            <span className="font-mono font-black text-[#102c1e] text-sm">
                                                {startup.valuation}
                                            </span>
                                        </td>

                                        {/* Cổ phần FAST */}
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="font-mono font-black text-[#102c1e] text-sm bg-[#102c1e]/5 px-2 py-1 rounded-md border border-[#102c1e]/10">
                                                    {startup.equity}
                                                </span>
                                                {startup.vested !== '0%' && (
                                                    <span className="font-geist text-[10px] text-slate-400 mt-1">
                                                        Vested: {startup.vested}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Tăng trưởng */}
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                                                <span className="font-mono font-bold text-emerald-600 text-sm">
                                                    {startup.growth}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Lịch họp */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                <span className="font-inter text-sm text-slate-600">{startup.nextSync}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

            </div>
        </div>
    );
}