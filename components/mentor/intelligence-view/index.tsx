'use client';

import React, { useState } from 'react';
import { ChevronLeft, Flag, MessageSquare, Lock, FileText, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';

// --- MOCK SVG SPARKLINE ---
// Một component vẽ biểu đồ line siêu tối giản (Traction Sparkline) theo quy tắc "Zero Clutter".
const Sparkline = ({ data, color = '#a1e2b6' }: { data: number[], color?: string }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 100;
    const height = 30;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((d - min) / range) * height; // Đảo ngược y vì SVG y=0 là ở trên cùng
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox={`0 -5 ${width} ${height + 10}`} className="w-full h-10 overflow-visible drop-shadow-sm">
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

// --- MOCK DATA ---
const startupMetrics = [
    { id: 1, label: 'Doanh thu (MRR)', val: '$14,250', trend: '+12.5%', sparkData: [10, 12, 11, 14, 13, 16, 18], isPositive: true },
    { id: 2, label: 'Người dùng (MAU)', val: '8,420', trend: '+5.2%', sparkData: [20, 22, 24, 23, 26, 28, 30], isPositive: true },
    { id: 3, label: 'Tốc độ Đốt (Burn Rate)', val: '$8,100/mo', trend: '-2.0%', sparkData: [15, 14, 14, 15, 13, 12, 11], isPositive: true, sub: 'Đang Tối ưu' },
    { id: 4, label: 'Đường băng (Runway)', val: '18 Tháng', trend: 'Ổn định', sparkData: [18, 18, 18, 18, 18, 18, 18], isPositive: true, isFlat: true },
];

export default function StartupIntelligenceView() {
    const [activeTab, setActiveTab] = useState('pitch');

    return (
        <div className="min-h-screen w-full bg-[#fafafa] p-6 md:p-8 lg:p-10 font-inter">
            <div className="mx-auto flex h-full max-w-5xl flex-col space-y-8">

                {/* Lớp điều hướng (Breadcrumb) & Header */}
                <header className="mb-6 flex items-baseline justify-between border-b border-[#102c1e]/10 pb-4 pt-6">
                    <Link href="/mentor/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#102c1e] font-geist text-sm font-bold transition-colors group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Về Dashboard
                    </Link>

                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-10 h-10 rounded-xl bg-[#102c1e]/5 flex items-center justify-center font-outfit font-black text-[#102c1e] text-xl border border-[#102c1e]/10">
                                    K
                                </div>
                                <h1 className="font-outfit font-black text-[#102c1e] text-4xl tracking-tight">Kizuna Hub</h1>
                                <span className="bg-[#a1e2b6]/20 text-[#102c1e] font-geist text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md self-center">
                                    Seed Stage
                                </span>
                            </div>
                            <p className="font-inter text-slate-500 text-sm ml-14">Cập nhật SpacetimeDB lần cuối: 2 phút trước</p>
                        </div>

                        <div className="flex gap-3">
                            <button className="bg-white border border-[#102c1e]/10 text-[#102c1e] font-geist font-bold rounded-xl px-4 py-2 hover:bg-[#102c1e]/5 transition-colors shadow-sm flex items-center gap-2 text-sm">
                                <MessageSquare className="w-4 h-4" /> Bắn tin nhắn
                            </button>
                            <button className="bg-white border text-amber-600 border-amber-200 hover:bg-amber-50 font-geist font-bold rounded-xl px-4 py-2 transition-colors shadow-sm flex items-center gap-2 text-sm">
                                <Flag className="w-4 h-4" /> Yêu cầu Giải trình
                            </button>
                        </div>
                    </div>
                </header>

                {/* 1. KHỐI METRICS THỜI GIAN THỰC (Traction Ledger) */}
                <div>
                    <h2 className="font-outfit font-black text-[#102c1e] text-xl tracking-tight mb-4">Chỉ số Lực kéo (Live Traction)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {startupMetrics.map((metric) => (
                            <div key={metric.id} className="bg-white rounded-2xl border border-[#102c1e]/10 shadow-sm p-5 hover:border-[#102c1e]/30 transition-colors group">
                                <p className="font-geist text-[10px] font-bold text-slate-400 uppercase tracking-widest">{metric.label}</p>
                                <div className="flex items-end justify-between mt-2">
                                    <div>
                                        <p className="font-mono font-bold text-[#102c1e] text-2xl tracking-tighter leading-none">{metric.val}</p>
                                        <p className="font-geist text-xs font-bold text-[#a1e2b6] mt-1.5 flex items-center gap-1">
                                            {metric.sub ? <span className="text-slate-500 font-normal">{metric.sub}</span> : metric.trend}
                                        </p>
                                    </div>
                                    <div className="w-16 opacity-70 group-hover:opacity-100 transition-opacity">
                                        <Sparkline data={metric.sparkData} color={metric.isFlat ? '#cbd5e1' : '#a1e2b6'} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. KHÔNG GIAN DỮ LIỆU & GHI CHÚ RIÊNG (Data Room vs Private Notes) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">

                    {/* TRÁI (8-cols): Data Room / Asset Viewer */}
                    <div className="col-span-1 lg:col-span-8 bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm flex flex-col overflow-hidden">
                        <div className="border-b border-[#102c1e]/5 bg-[#fafafa] flex">
                            {['pitch', 'cap-table', 'monthly'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-4 font-geist text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === tab
                                        ? 'border-[#102c1e] text-[#102c1e] bg-white'
                                        : 'border-transparent text-slate-400 hover:text-[#102c1e]'
                                        }`}
                                >
                                    {tab === 'pitch' ? 'Pitch Deck' : tab === 'cap-table' ? 'Cap Table' : 'Báo cáo Tháng'}
                                </button>
                            ))}
                        </div>

                        {/* Simulated PDF / Asset Canvas */}
                        <div className="flex-1 bg-slate-100/50 p-6 flex flex-col items-center overflow-y-auto relative">
                            <div className="w-full max-w-2xl bg-white shadow-md border border-[#102c1e]/5 rounded-sm h-[500px] p-10 mt-4 relative group">
                                {/* Fake slide content */}
                                <h3 className="font-outfit font-black text-[#102c1e] text-3xl mb-6">Vấn đề & Giải pháp</h3>
                                <div className="space-y-4">
                                    <div className="w-full h-8 bg-slate-100 rounded"></div>
                                    <div className="w-3/4 h-8 bg-slate-100 rounded"></div>
                                    <div className="w-full h-32 bg-[#fafafa] rounded-xl border border-slate-100 mt-8 flex items-center justify-center text-slate-300 font-geist">Khung biểu đồ</div>
                                </div>

                                {/* Micro-Interaction: Add Note Tooltip (Hovering over the document) */}
                                <div className="absolute top-1/2 -right-4 w-8 h-8 rounded-full bg-[#102c1e] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg z-10" title="Đánh dấu để Cố vấn">
                                    <MessageSquare className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-[#102c1e]/5 bg-white p-4 flex justify-between items-center">
                            <span className="font-geist text-xs text-slate-400">Trang 4 / 24</span>
                            <button className="text-[#102c1e] font-geist font-bold text-sm flex items-center gap-2 hover:bg-[#102c1e]/5 px-3 py-1.5 rounded-lg transition-colors">
                                <Download className="w-4 h-4" /> Tải tệp Gốc
                            </button>
                        </div>
                    </div>

                    {/* PHẢI (4-cols): Private Notepad (Đặc quyền Cố vấn) */}
                    <div className="col-span-1 lg:col-span-4 bg-[#102c1e] rounded-3xl shadow-md p-6 flex flex-col relative text-[#fafafa]">
                        <div className="flex items-center gap-2 mb-6 text-[#a1e2b6]">
                            <Lock className="w-4 h-4" />
                            <h2 className="font-outfit font-black text-lg">Sổ tay Chỉ định</h2>
                        </div>
                        <p className="font-inter text-[#fafafa]/60 text-xs mb-4">Các ghi chú này được mã hóa và chỉ Bạn (Mentor) mới có thể đọc. Founder sẽ không thấy nội dung này.</p>

                        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                            {/* A mocked previous note */}
                            <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
                                <p className="font-inter text-sm leading-relaxed text-[#fafafa]/90">
                                    Sẽ cần xem xét lại định giá ($15M là hơi cao so với traction hiện tại). Chú ý slide "Dòng tiền" đang mâu thuẫn với báo cáo Spacetime.
                                </p>
                                <p className="font-geist text-[10px] text-white/40 mt-3 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-[#a1e2b6]" /> Đã lưu lúc 09:12 AM
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10 relative">
                            <textarea
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-[#fafafa] placeholder:text-[#fafafa]/30 focus:outline-none focus:ring-1 focus:ring-[#a1e2b6] transition-all resize-none h-24 font-inter"
                                placeholder="Draft new thesis or feedback..."
                            ></textarea>
                            <button className="absolute bottom-6 right-3 bg-[#a1e2b6] text-[#102c1e] font-geist font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm hover:bg-[#a1e2b6]/90 transition-colors">
                                Lưu trữ
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}