'use client';

import React from 'react';
import { Send, Eye, CheckCircle2, XCircle, ExternalLink, Network, Search, ArrowRight } from 'lucide-react';

const stats = [
    { label: 'Tổng số Lời giới thiệu', value: '12', trend: '+2 tháng này', icon: Send },
    { label: 'Tỉ lệ mở (Open Rate)', value: '91%', trend: 'Cao hơn trung bình', icon: Eye },
    { label: 'Deals thành công', value: '4', trend: 'Từ Warm Intro', icon: CheckCircle2 }
];

const introHistory = [
    { id: 1, startup: 'Kizuna Hub', investor: 'CyberAgent Capital', investorEmail: 'partner@cyberagent.vc', date: 'Vừa xong', status: 'sent', statusText: 'Đã gửi' },
    { id: 2, startup: 'SnapMoney', investor: 'Do Ventures', investorEmail: 'dealflow@doventures.vc', date: '2 ngày trước', status: 'viewed', statusText: 'Đã xem 100% Deck' },
    { id: 3, startup: 'Dietfit AI', investor: 'Sơn (Angel Investor)', investorEmail: 'son@angel.vn', date: '1 tuần trước', status: 'meeting', statusText: 'Đã sắp xếp họp' }
];

const networkConnections = [
    { name: 'CyberAgent Capital', type: 'Venture Capital', intros: 5 },
    { name: 'Do Ventures', type: 'Venture Capital', intros: 3 },
    { name: 'Sơn Nguyen', type: 'Angel Investor', intros: 2 }
];

export default function WarmIntrosView() {
    return (
        <div className="min-h-screen w-full bg-[#fafafa] p-6 md:p-8 lg:p-10 font-inter">
            <div className="mx-auto flex h-full max-w-5xl flex-col space-y-8">
                {/* Header */}
                <header className="mb-6 flex items-baseline justify-between border-b border-[#102c1e]/10 pb-4 pt-6">
                    <div>
                        <h1 className="flex items-center gap-3 font-outfit font-black text-[#102c1e] text-4xl tracking-tight">
                            Trạm Giới Thiệu Chéo <span className="bg-[#a1e2b6]/30 text-[#102c1e] text-sm px-3 py-1 rounded-full border border-[#a1e2b6]/50">Đặc quyền Mentor</span>
                        </h1>
                        <p className="font-inter text-slate-600 mt-2 text-base">Tạo Secure Link (Magic Link) để giới thiệu Startup cho Quỹ đầu tư mà không sợ rò rỉ dữ liệu.</p>
                    </div>
                    <button className="flex items-center gap-2 bg-[#102c1e] text-[#fafafa] font-geist font-bold rounded-xl px-5 py-2.5 hover:bg-[#102c1e]/90 transition-colors shadow-sm text-sm">
                        <Send className="w-4 h-4" />
                        Tên Intro Mới
                    </button>
                </header>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="bg-white p-6 rounded-3xl border border-[#102c1e]/10 shadow-sm flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-[#102c1e]/5 text-[#102c1e] rounded-xl border border-[#102c1e]/10">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                </div>
                                <h3 className="font-geist text-sm text-slate-500 font-bold mb-1">{stat.label}</h3>
                                <div className="flex items-end gap-3 tracking-tight">
                                    <span className="font-outfit font-black text-3xl text-[#102c1e]">{stat.value}</span>
                                    <span className="text-xs font-geist text-[#a1e2b6] bg-[#102c1e] px-2 py-0.5 rounded-md font-bold mb-1">{stat.trend}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left Col (8) */}
                    <div className="md:col-span-8 flex flex-col gap-6">
                        <section className="bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm p-8 flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-outfit font-black text-[#102c1e] text-2xl tracking-tight">Lịch sử Deal Syndication</h2>
                                <div className="relative">
                                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Tìm quỹ đầu tư..."
                                        className="pl-9 pr-4 py-2 bg-[#fafafa] border border-[#102c1e]/10 rounded-xl text-sm font-geist focus:outline-none focus:border-[#102c1e]/30 transition-colors w-64"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left font-inter">
                                    <thead>
                                        <tr className="border-b border-[#102c1e]/10 font-geist text-xs uppercase tracking-wider text-slate-400">
                                            <th className="pb-4 font-bold">Startup</th>
                                            <th className="pb-4 font-bold">Người nhận (Investor)</th>
                                            <th className="pb-4 font-bold">Trạng thái (Real-time)</th>
                                            <th className="pb-4 font-bold">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#102c1e]/5">
                                        {introHistory.map((item) => (
                                            <tr key={item.id} className="group hover:bg-[#102c1e]/5 transition-colors">
                                                <td className="py-5 pr-4">
                                                    <span className="font-outfit font-black text-[#102c1e] text-base">{item.startup}</span>
                                                </td>
                                                <td className="py-5 pr-4">
                                                    <p className="font-geist font-bold text-[#102c1e] text-sm">{item.investor}</p>
                                                    <p className="font-inter text-xs text-slate-500">{item.investorEmail}</p>
                                                </td>
                                                <td className="py-5 pr-4">
                                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold font-geist border
                                                        ${item.status === 'sent' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                            item.status === 'viewed' ? 'bg-[#a1e2b6]/20 text-[#102c1e] border-[#a1e2b6]' :
                                                                'bg-green-50 text-green-700 border-green-200'}`}>
                                                        {item.status === 'sent' && <Send className="w-3 h-3" />}
                                                        {item.status === 'viewed' && <Eye className="w-3 h-3" />}
                                                        {item.status === 'meeting' && <CheckCircle2 className="w-3 h-3" />}
                                                        {item.statusText}
                                                    </div>
                                                </td>
                                                <td className="py-5 pr-4">
                                                    <button className="text-slate-400 hover:text-[#102c1e] transition-colors p-2 hover:bg-white rounded-lg">
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

                    {/* Right Col (4) */}
                    <div className="md:col-span-4 flex flex-col gap-6">
                        <section className="bg-[#102c1e] rounded-3xl border border-[#102c1e]/10 shadow-sm p-6 flex flex-col text-[#fafafa]">
                            <div className="flex items-center gap-3 mb-6">
                                <Network className="w-6 h-6 text-[#a1e2b6]" />
                                <h2 className="font-outfit font-black text-2xl tracking-tight">Mạng lưới VC</h2>
                            </div>
                            <p className="text-sm font-inter text-white/70 mb-6 drop-shadow-sm">Các mục tiêu nhận lời giới thiệu nhiều nhất từ bạn dựa trên lịch sử.</p>

                            <div className="flex flex-col gap-4">
                                {networkConnections.map((vc, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-outfit font-black text-[#a1e2b6]">
                                                {vc.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-geist font-bold text-sm">{vc.name}</h3>
                                                <p className="font-inter text-[10px] text-white/50">{vc.type}</p>
                                            </div>
                                        </div>
                                        <span className="font-mono text-xs font-bold text-[#fafafa]">{vc.intros} Intros</span>
                                    </div>
                                ))}
                            </div>

                            <button className="mt-6 w-full py-3 rounded-xl border border-white/20 text-white font-geist font-bold text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                                Xem toàn bộ danh bạ <ArrowRight className="w-4 h-4" />
                            </button>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}