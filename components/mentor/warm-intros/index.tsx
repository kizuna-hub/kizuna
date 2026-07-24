'use client';

import React, { useState } from 'react';
import { Send, Eye, CheckCircle2, ChevronRight, Plus, ExternalLink, Activity, Search, ShieldCheck, Mail } from 'lucide-react';
import { Link } from '@/i18n/routing';

const stats = [
    { label: 'Tổng Lời Giới Thiệu (Intros)', value: '14', trend: '+3 tháng này', icon: Send },
    { label: 'Tỉ lệ mở (VC Open Rate)', value: '92.5%', trend: 'Cao hiển nhiên (Top 5% Mentor)', icon: Eye },
    { label: 'Pitch Deck & Phản hồi', value: '6', trend: 'Lịch sử thành công', icon: CheckCircle2 }
];

const introHistory = [
    {
        id: 1,
        startup: 'Kizuna Hub',
        investor: 'CyberAgent Capital',
        investorEmail: 'partner@cyberagent.vc',
        time: '15 phút trước',
        status: 'reading',
        statusText: 'Đang xem trực tiếp (Trang 12)'
    },
    {
        id: 2,
        startup: 'SnapMoney',
        investor: 'Do Ventures',
        investorEmail: 'dealflow@doventures.vc',
        time: 'Trưa qua, 14:30',
        status: 'viewed',
        statusText: 'Đã xem 100% Deck'
    },
    {
        id: 3,
        startup: 'Dietfit AI',
        investor: 'Nextrans',
        investorEmail: 'hello@nextrans.vn',
        time: '2 ngày trước',
        status: 'delivered',
        statusText: 'Đã gửi Link (Chưa mở)'
    }
];

export default function WarmIntrosHub() {
    return (
        <div className="min-h-screen w-full bg-[#fafafa] p-6 md:p-8 lg:p-10 font-sans">
            <div className="mx-auto flex h-full max-w-5xl flex-col space-y-8">
                {/* Standardized Header */}
                <header className="pt-6 pb-4 border-b border-[#102c1e]/10 mb-6 flex items-baseline gap-6">
                    <div className="flex-1">
                        <h1 className="font-heading font-black text-[#102c1e] text-4xl tracking-tight">
                            Trạm Kết Nối VC <span className="bg-[#a1e2b6]/20 text-[#102c1e] text-sm px-3 py-1 rounded-full border border-[#a1e2b6]/50 ml-2 font-sans">Warm Intro Hub</span>
                        </h1>
                        <p className="font-sans text-slate-600 mt-2 text-base">
                            Tạo Magic Link chia sẻ Secure Data Room. Theo dõi tương tác của Nhà đầu tư theo thời gian thực.
                        </p>
                    </div>
                    <button className="flex items-center gap-2 bg-[#102c1e] text-[#fafafa] font-sans font-bold rounded-xl px-5 py-2.5 hover:bg-[#102c1e]/90 transition-colors shadow-sm text-sm">
                        <Plus className="w-4 h-4" />
                        Tạo Warm Intro Mới
                    </button>
                </header>

                {/* KPI Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="bg-white p-6 rounded-2xl border border-[#102c1e]/10 shadow-sm flex flex-col hover:shadow-md transition-shadow group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-[#102c1e]/5 text-[#102c1e] rounded-xl border border-[#102c1e]/10 group-hover:bg-[#102c1e]/10 transition-colors">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                </div>
                                <h3 className="font-sans text-sm text-slate-500 font-bold mb-1">{stat.label}</h3>
                                <div className="flex items-end gap-3 tracking-tight">
                                    <span className="font-heading font-black text-3xl text-[#102c1e]">{stat.value}</span>
                                    <span className="text-xs font-sans text-[#a1e2b6] bg-[#102c1e] px-2 py-0.5 rounded-md font-bold mb-1">{stat.trend}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Asymmetrical 8-col: Real-time Tracking Board */}
                    <div className="md:col-span-8 flex flex-col gap-6">
                        <section className="bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm overflow-hidden flex flex-col">
                            <div className="px-8 pt-8 pb-4 flex justify-between items-center">
                                <div>
                                    <h2 className="font-heading font-black text-[#102c1e] text-2xl tracking-tight flex items-center gap-2">
                                        Live Tracking <Activity className="w-5 h-5 text-[#a1e2b6]" />
                                    </h2>
                                    <p className="font-sans text-sm text-slate-500 mt-1">Theo dõi tương tác của các Quỹ đầu tư với Data Room.</p>
                                </div>
                                <div className="relative group">
                                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#102c1e] transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Tìm Investor / Startup..."
                                        className="pl-9 pr-4 py-2 bg-[#fafafa] border border-[#102c1e]/10 rounded-xl text-sm font-sans focus:outline-none focus:border-[#102c1e]/30 focus:ring-4 focus:ring-[#102c1e]/5 transition-all w-64"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto px-4 pb-4">
                                <table className="w-full text-left font-sans">
                                    <thead>
                                        <tr className="border-b border-[#102c1e]/10 font-sans text-xs uppercase tracking-wider text-slate-400">
                                            <th className="pb-4 px-4 font-bold">VC / Người nhận</th>
                                            <th className="pb-4 px-4 font-bold">Startup</th>
                                            <th className="pb-4 px-4 font-bold">Tình trạng tương tác</th>
                                            <th className="pb-4 px-4 font-bold text-right">Report</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#102c1e]/5">
                                        {introHistory.map((item) => (
                                            <tr key={item.id} className="group hover:bg-[#102c1e]/5 transition-colors">
                                                <td className="py-5 px-4">
                                                    <p className="font-sans font-bold text-[#102c1e] text-base">{item.investor}</p>
                                                    <p className="font-sans text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                        <Mail className="w-3 h-3" /> {item.investorEmail}
                                                    </p>
                                                </td>
                                                <td className="py-5 px-4">
                                                    <span className="font-heading font-black text-[#102c1e] text-sm">{item.startup}</span>
                                                </td>
                                                <td className="py-5 px-4">
                                                    <div className="flex items-center gap-2">
                                                        {item.status === 'reading' && (
                                                            <span className="relative flex h-2.5 w-2.5">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a1e2b6] opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#a1e2b6]"></span>
                                                            </span>
                                                        )}
                                                        {item.status === 'viewed' && <CheckCircle2 className="w-3.5 h-3.5 text-[#102c1e]" />}
                                                        {item.status === 'delivered' && <Send className="w-3 h-3 text-slate-400" />}

                                                        <span className={`font-sans text-xs font-bold ${item.status === 'reading' ? 'text-[#a1e2b6] bg-[#102c1e] px-2 py-0.5 rounded-md' : 'text-[#102c1e]'}`}>
                                                            {item.statusText}
                                                        </span>
                                                    </div>
                                                    <span className="block font-sans text-[10px] text-slate-400 mt-1">Cập nhật: {item.time}</span>
                                                </td>
                                                <td className="py-5 px-4 text-right">
                                                    <button className="text-slate-400 hover:text-[#102c1e] transition-colors p-2 hover:bg-white rounded-lg border border-transparent hover:border-[#102c1e]/10">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    {/* 4-col Sidebar: Security & Network Strength */}
                    <div className="md:col-span-4 flex flex-col gap-6">
                        <section className="bg-[#102c1e] rounded-3xl p-6 flex flex-col shadow-sm text-white relative overflow-hidden">
                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#a1e2b6]/10 rounded-full blur-2xl"></div>

                            <div className="flex items-center gap-3 mb-4 relative z-10">
                                <ShieldCheck className="w-6 h-6 text-[#a1e2b6]" />
                                <h2 className="font-heading font-black text-xl tracking-tight text-[#fafafa]">Magic Link bảo mật</h2>
                            </div>
                            <p className="font-sans text-[#fafafa]/70 text-sm mb-6 relative z-10 leading-relaxed">
                                Mỗi link Warm Intro được đính kèm định danh chống Screenshot và hết hạn sau 7 ngày. Bạn hoàn toàn làm chủ dữ liệu của Startup.
                            </p>

                            <div className="p-4 bg-white/10 rounded-xl border border-white/5 relative z-10 font-mono text-xs text-[#a1e2b6] break-all">
                                kizuna.so/v/s?ref=m_cyberagent_99x
                            </div>
                        </section>

                        <section className="bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm p-6 flex flex-col">
                            <h3 className="font-heading font-black text-[#102c1e] text-lg mb-4">Mạng lưới VC Ưa thích</h3>
                            <div className="flex flex-col gap-3">
                                {['CyberAgent Capital', 'Do Ventures', 'Nextrans'].map((vc, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-[#102c1e]/5 bg-[#fafafa]/50 hover:bg-[#102c1e]/5 transition-colors group cursor-pointer">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-white border border-[#102c1e]/10 flex items-center justify-center font-heading font-black text-[#102c1e] text-xs">
                                                {vc.charAt(0)}
                                            </div>
                                            <span className="font-sans font-bold text-sm text-[#102c1e]">{vc}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#102c1e]" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}