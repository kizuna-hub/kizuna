'use client';

import React from 'react';
import { ArrowRight, MoreHorizontal, CheckCircle2, FileText, TrendingUp, ExternalLink } from 'lucide-react';
import { Link } from '@/i18n/routing'; // <-- Sử dụng Next-Intl router

// --- MOCK DATA (Tiếng Việt) ---
const engagements = [
    { id: 1, name: 'Kizuna Hub', ecosystem: 'B2B SaaS', growth: '+14.5%', status: 'Healthy', nextMilestone: 'Vòng Hạt giống (Seed)' },
    { id: 2, name: 'Dietfit AI', ecosystem: 'HealthTech', growth: '+8.2%', status: 'Stable', nextMilestone: 'Ký Hợp đồng FAST' },
    { id: 3, name: 'SnapMoney', ecosystem: 'Fintech', growth: '+22.0%', status: 'Scaling', nextMilestone: 'Series A' },
];

const actionItems = [
    { id: 1, type: 'update', title: 'Đọc Báo cáo Tháng 4', entity: 'Kizuna Hub', time: '2 giờ trước' },
    { id: 2, type: 'signature', title: 'Ký Hợp đồng FAST', entity: 'Dietfit AI', time: '5 giờ trước' },
];

const syncMeetings = [
    { id: 1, title: 'Họp 1:1 Định hướng', entity: 'Kizuna Hub', time: 'Hôm nay, 14:00' },
    { id: 2, title: 'Duyệt Pitch Deck Gọi Vốn', entity: 'SnapMoney', time: 'Ngày mai, 10:00' },
];

// --- COMPONENT ---

export default function MentorDashboard() {
    return (
        <div className="min-h-screen w-full bg-[#fafafa] p-6 md:p-8 lg:p-10 font-inter">
            <div className="mx-auto flex h-full max-w-5xl flex-col space-y-8">

                {/* Header */}
                <header className="pt-6 pb-4 border-b border-[#102c1e]/10 mb-6 flex items-baseline gap-6">
                    <div className="flex-1">
                        <h1 className="font-outfit font-black text-[#102c1e] text-4xl tracking-tight">Trung tâm Quản lý Cố vấn</h1>
                        <p className="font-inter text-slate-600 mt-2 text-base">Tổng quan định lượng về danh mục đầu tư sức lực và thời gian của bạn.</p>
                    </div>
                    <Link href="/mentor/dashboard/calendar" className="bg-[#102c1e] text-[#fafafa] font-geist font-bold rounded-xl px-5 py-2.5 hover:bg-[#102c1e]/90 transition-colors shadow-sm text-sm">
                        Quản lý Lịch trống
                    </Link>
                </header>

                {/* 12-Column Asymmetrical Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* Block 1: Dự án Đang Cố vấn */}
                    <section className="col-span-1 md:col-span-8 md:row-span-2 bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm hover:shadow-md hover:border-[#102c1e]/30 transition-all duration-200 p-8 flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-outfit font-black text-[#102c1e] text-2xl tracking-tight">Dự án Đang Cố vấn</h2>
                            <button className="text-slate-400 hover:text-[#102c1e] transition-colors">
                                <MoreHorizontal className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 w-full overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[#102c1e]/5">
                                        <th className="font-geist text-[#102c1e]/50 font-bold uppercase tracking-widest text-[11px] pb-4">Tên Startup</th>
                                        <th className="font-geist text-[#102c1e]/50 font-bold uppercase tracking-widest text-[11px] pb-4">Lĩnh vực</th>
                                        <th className="font-geist text-[#102c1e]/50 font-bold uppercase tracking-widest text-[11px] pb-4">Tăng trưởng (MoM)</th>
                                        <th className="font-geist text-[#102c1e]/50 font-bold uppercase tracking-widest text-[11px] pb-4">Mục tiêu tới</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#102c1e]/5">
                                    {engagements.map((item) => (
                                        <tr key={item.id} className="group hover:bg-[#102c1e]/5 transition-colors">
                                            <td className="py-5 pr-4">
                                                <Link href={`/mentor/dashboard/portfolio/${item.id}`} className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-[#102c1e]/5 border border-[#102c1e]/10 flex items-center justify-center font-outfit font-black text-[#102c1e]">
                                                        {item.name.charAt(0)}
                                                    </div>
                                                    <span className="font-outfit font-black text-[#102c1e] text-lg tracking-tight group-hover:text-[#a1e2b6] transition-colors">{item.name}</span>
                                                </Link>
                                            </td>
                                            <td className="py-5 pr-4">
                                                <span className="bg-[#102c1e]/5 text-[#102c1e] font-geist text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-[#102c1e]/10">
                                                    {item.ecosystem}
                                                </span>
                                            </td>
                                            <td className="py-5 pr-4">
                                                <div className="flex items-start flex-col gap-1 w-fit">
                                                    <div className="flex items-center gap-2">
                                                        <TrendingUp className="w-4 h-4 text-[#a1e2b6]" />
                                                        <span className="font-mono font-bold text-[#102c1e]">{item.growth}</span>
                                                    </div>
                                                    {/* Minimalist Spakline fake */}
                                                    <div className="h-4 w-16 bg-gradient-to-t from-[#a1e2b6]/20 to-transparent border-t border-[#a1e2b6] rounded-t-sm opacity-80" />
                                                </div>
                                            </td>
                                            <td className="py-5">
                                                <span className="font-inter text-slate-600 text-sm">{item.nextMilestone}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 pt-6 border-t border-[#102c1e]/5 flex justify-end">
                            <Link href="/mentor/dashboard/portfolio" className="flex items-center gap-2 text-[#102c1e] font-geist font-bold text-sm group">
                                Xem Toàn bộ Portfolio <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </section>

                    {/* Block 2: Cần Xử Lý Gấp */}
                    <section className="col-span-1 md:col-span-4 bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm hover:shadow-md hover:border-[#102c1e]/30 transition-all duration-200 p-6 flex flex-col">
                        <h2 className="font-outfit font-black text-[#102c1e] text-lg tracking-tight mb-5 flex items-center gap-2">
                            <span className="relative flex h-3 w-3 items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a1e2b6] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#a1e2b6]"></span>
                            </span>
                            Cần Xử Lý Gấp
                        </h2>
                        <div className="flex-1 flex flex-col gap-3">
                            {actionItems.map((action) => (
                                <Link
                                    key={action.id}
                                    href={action.type === 'signature' ? '/mentor/dashboard/fast-ledger' : '/mentor/dashboard/requests'}
                                    className="flex items-start justify-between p-3 rounded-2xl border border-[#102c1e]/5 bg-[#fafafa] hover:border-[#102c1e]/20 hover:bg-[#102c1e]/5 transition-all cursor-pointer group"
                                >
                                    <div className="flex gap-3 items-start">
                                        <div className="mt-0.5">
                                            {action.type === 'update' ? (
                                                <FileText className="w-4 h-4 text-[#102c1e]/50" />
                                            ) : (
                                                <CheckCircle2 className="w-4 h-4 text-[#a1e2b6]" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-geist font-bold text-[#102c1e] text-sm group-hover:text-[#a1e2b6] transition-colors">{action.title}</p>
                                            <p className="font-inter text-slate-500 text-xs mt-0.5">{action.entity} • {action.time}</p>
                                        </div>
                                    </div>
                                    <div className="p-1 text-[#102c1e]/30 group-hover:text-[#102c1e] transition-colors rounded-lg">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Block 3: Lịch trình */}
                    <section className="col-span-1 md:col-span-4 bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm hover:shadow-md hover:border-[#102c1e]/30 transition-all duration-200 p-6 flex flex-col relative overflow-hidden">
                        <h2 className="font-outfit font-black text-[#102c1e] text-lg tracking-tight mb-6">Lịch trình (48h tới)</h2>

                        <div className="relative pl-6 flex-1 mt-2">
                            {/* Vertical line - hidden standard border offset trick */}
                            <div className="absolute left-[7px] top-1 bottom-6 w-px bg-[#102c1e]/10"></div>

                            <div className="flex flex-col gap-7">
                                {syncMeetings.map((meeting) => (
                                    <div key={meeting.id} className="relative z-10 w-full">
                                        {/* Node with ring */}
                                        <div className="absolute -left-[28.5px] top-1.5 w-3 h-3 rounded-full bg-[#a1e2b6] ring-4 ring-white shadow-sm border border-[#102c1e]/5"></div>

                                        <div className="flex flex-col gap-1 w-full">
                                            <span className="font-geist text-[11px] font-black text-[#102c1e]/50 uppercase tracking-widest">{meeting.time}</span>
                                            <p className="font-geist font-bold text-[#102c1e] text-sm mt-0.5">{meeting.title}</p>
                                            <p className="font-inter text-slate-500 text-xs">{meeting.entity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button className="mt-6 w-full bg-[#fafafa] text-[#102c1e] font-geist font-bold rounded-xl border border-[#102c1e]/10 hover:bg-[#102c1e]/5 py-2.5 text-sm transition-all focus:ring-2 focus:ring-[#102c1e]/20 focus:outline-none">
                            Mở Lịch trình
                        </button>
                    </section>

                    {/* Block 4: Năng Lực & Cổ Phần (NEW) */}
                    <section className="col-span-1 md:col-span-12 bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm hover:shadow-md hover:border-[#102c1e]/30 transition-all duration-200 p-8 flex flex-col md:flex-row items-center gap-10 justify-between">

                        <div className="flex items-center gap-10 w-full md:w-auto">
                            <div className="flex flex-col gap-2">
                                <span className="font-geist text-[11px] font-black text-[#102c1e]/50 uppercase tracking-widest">Slot Cố vấn</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="font-mono font-bold text-[#102c1e] text-3xl md:text-4xl tracking-tighter leading-none">Đã nhận 3</span>
                                    <span className="font-mono text-[#102c1e]/40 text-xl md:text-2xl leading-snug">/ 5</span>
                                </div>
                            </div>

                            <div className="h-14 w-px bg-[#102c1e]/10 hidden md:block"></div>

                            <div className="flex flex-col gap-2">
                                <span className="font-geist text-[11px] font-black text-[#102c1e]/50 uppercase tracking-widest flex items-center gap-2">
                                    Tài sản Cổ phần (Vested Equity)
                                    <span className="bg-[#a1e2b6]/20 text-[#102c1e] font-geist text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase">Vested</span>
                                </span>
                                <div className="flex items-center gap-3">
                                    <span className="font-mono font-bold text-[#102c1e] text-3xl md:text-4xl tracking-tighter leading-none">
                                        $125,000
                                    </span>
                                    <Link href="/mentor/dashboard/fast-ledger" className="p-2 bg-[#fafafa] rounded-full hover:bg-[#102c1e]/5 transition-colors border border-[#102c1e]/10 group">
                                        <ExternalLink className="w-4 h-4 text-[#102c1e] group-hover:scale-110 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-auto flex-1 max-w-[320px]">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-geist font-bold text-[#102c1e] text-sm">Công suất (Capacity)</span>
                                <span className="font-mono font-bold text-[#102c1e]/60 text-sm">60%</span>
                            </div>
                            <div className="w-full h-2.5 bg-[#102c1e]/5 rounded-full overflow-hidden shadow-inner border border-[#102c1e]/10">
                                <div className="h-full bg-[#102c1e] rounded-r-md transition-all duration-500 ease-out relative" style={{ width: '60%' }}>
                                    {/* Subtly animated gradient inside bar for "premium" vibe */}
                                    <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-white/20 to-transparent"></div>
                                </div>
                            </div>
                        </div>

                    </section>

                </div>
            </div>
        </div>
    );
}