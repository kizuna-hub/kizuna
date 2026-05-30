import React from 'react';
import { RefreshCw, TrendingUp, DollarSign, LineChart, Percent, ArrowRight, History } from 'lucide-react';

export default function CapTablePage() {
    const topMetrics = [
        { label: "Post-Money Valuation", value: "$12,500,000", subtext: "Series A (Pre-money $10M)", icon: TrendingUp },
        { label: "Price Per Share (PPS)", value: "$1.25", subtext: "Tăng +$0.4 so với Seed", icon: DollarSign, trend: "positive" },
        { label: "Total Raised Funds", value: "$2,500,000", subtext: "Tổng số vốn đã gọi", icon: LineChart },
        { label: "Option Pool Available", value: "12.5%", subtext: "Đủ cho 18-24 tháng tới", icon: Percent },
    ];

    const stakeholders = [
        { id: 1, initials: "NT", bg: "bg-[#102c1e]", text: "text-[#fafafa]", name: "Nguyen Tuan Ngoc", role: "Founder / CEO", shareClass: "Common", shares: "4,500,000", ownership: "45.0%", value: "$5,625,000" },
        { id: 2, initials: "KV", bg: "bg-[#a1e2b6]", text: "text-[#102c1e]", name: "Kizuna Ventures", role: "Lead Investor", shareClass: "Series A", shares: "2,000,000", ownership: "20.0%", value: "$2,500,000" },
        { id: 3, initials: "JD", bg: "bg-[#102c1e]/10", text: "text-[#102c1e]", name: "John Doe", role: "CTO", shareClass: "Options", shares: "1,500,000", ownership: "15.0%", value: "$1,875,000" },
        { id: 4, initials: "OP", bg: "bg-slate-100", text: "text-slate-500", name: "Option Pool", role: "Employee Pool", shareClass: "Unallocated", shares: "1,250,000", ownership: "12.5%", value: "$1,562,500" },
    ];

    const upcomingVesting = [
        { id: 1, person: "John Doe (CTO)", event: "1 Year Cliff", date: "15 Nov 2026", shares: "375,000" },
        { id: 2, person: "Jane Smith (CMO)", event: "Monthly Vesting", date: "01 Dec 2026", shares: "15,000" },
        { id: 3, person: "David Lee (Dev)", event: "Monthly Vesting", date: "01 Dec 2026", shares: "5,000" },
    ];

    return (
        <div className="min-h-screen bg-[#fafafa] p-6 md:p-8 lg:p-10 font-inter">
            <div className="max-w-[1200px] mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-4">
                            <h1 className="font-outfit font-black text-2xl text-[#102c1e] tracking-tight">Cap Table & Equity Ledger</h1>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#102c1e]/5 border border-[#102c1e]/10">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a1e2b6] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#a1e2b6]"></span>
                                </span>
                                <span className="font-geist text-[10px] font-bold text-[#102c1e] uppercase tracking-wider">Live Sync</span>
                            </div>
                        </div>
                        <p className="text-slate-500 font-medium text-sm">Cấu trúc vốn và tỷ lệ sở hữu cập nhật sau vòng Series A.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#fafafa] text-[#102c1e] font-geist font-bold text-sm rounded-xl border border-[#102c1e]/10 hover:bg-[#102c1e]/5 transition-colors">
                            <History className="h-4 w-4" />
                            Lịch sử
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#102c1e] text-[#fafafa] font-geist font-bold text-sm rounded-xl hover:bg-[#102c1e]/90 transition-colors shadow-sm">
                            <RefreshCw className="h-4 w-4" />
                            Đồng bộ dữ liệu
                        </button>
                    </div>
                </div>

                {/* Metrics Container (4 columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {topMetrics.map((metric, idx) => (
                        <div key={idx} className="bg-white border border-[#102c1e]/10 shadow-sm rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-[#102c1e]/5 rounded-lg text-[#102c1e]">
                                    <metric.icon className="h-4 w-4" />
                                </div>
                                <p className="text-slate-500 font-medium text-[11px] uppercase tracking-widest">{metric.label}</p>
                            </div>
                            <div>
                                <h3 className="font-mono font-bold text-2xl text-[#102c1e] mb-1">{metric.value}</h3>
                                <p className={`font-medium text-[11px] ${metric.trend === 'positive' ? 'text-[#a1e2b6] font-bold' : 'text-[#102c1e]/50'}`}>
                                    {metric.subtext}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* DashGrid - Asymmetrical Bento Grid - Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Stakeholder Ledger */}
                    <div className="lg:col-span-8 bg-white border border-[#102c1e]/10 shadow-sm rounded-3xl p-6 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-outfit font-bold text-[#102c1e] text-lg">Stakeholder Ledger</h3>
                            <div className="flex items-center gap-4">
                                {/* New Feature Toggle */}
                                <div className="flex items-center bg-[#fafafa] rounded-lg border border-[#102c1e]/10 p-1">
                                    <button className="px-3 py-1 text-[11px] font-geist font-bold rounded-md bg-white shadow-sm border border-[#102c1e]/5 text-[#102c1e]">Issued Shares</button>
                                    <button className="px-3 py-1 text-[11px] font-geist font-medium rounded-md text-slate-500 hover:text-[#102c1e] transition-colors">Fully Diluted</button>
                                </div>
                                <button className="bg-[#102c1e]/5 text-[#102c1e] font-geist font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-[#102c1e]/10 transition-colors">
                                    + Mới
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[#102c1e]/10">
                                        <th className="pb-3 text-[10px] font-geist font-bold text-[#102c1e]/50 uppercase tracking-widest pl-2">Name / Role</th>
                                        <th className="pb-3 text-[10px] font-geist font-bold text-[#102c1e]/50 uppercase tracking-widest">Share Class</th>
                                        <th className="pb-3 text-[10px] font-geist font-bold text-[#102c1e]/50 uppercase tracking-widest text-right">Shares</th>
                                        <th className="pb-3 text-[10px] font-geist font-bold text-[#102c1e]/50 uppercase tracking-widest text-right">Ownership</th>
                                        <th className="pb-3 text-[10px] font-geist font-bold text-[#102c1e]/50 uppercase tracking-widest text-right pr-2">Value (Pro-forma)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#102c1e]/5">
                                    {stakeholders.map((row) => (
                                        <tr key={row.id} className="hover:bg-[#fafafa] transition-colors group">
                                            <td className="py-3 font-geist text-sm pl-2">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg ${row.bg} ${row.text} flex items-center justify-center font-geist font-black text-xs shrink-0`}>
                                                        {row.initials}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-[#102c1e]">{row.name}</div>
                                                        <div className="text-slate-400 text-xs mt-0.5">{row.role}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 font-geist text-sm">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#102c1e]/5 text-[#102c1e]">
                                                    {row.shareClass}
                                                </span>
                                            </td>
                                            <td className="py-3 font-mono font-medium text-[#102c1e] text-right text-sm">{row.shares}</td>
                                            <td className="py-3 font-mono font-bold text-[#102c1e] text-right text-sm">{row.ownership}</td>
                                            <td className="py-3 font-mono font-medium text-[#102c1e]/70 text-right text-sm pr-2">{row.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Column: Ownership Distribution */}
                    <div className="lg:col-span-4 bg-white border border-[#102c1e]/10 shadow-sm rounded-3xl p-6 flex flex-col items-center">
                        <h3 className="font-outfit font-bold text-[#102c1e] text-lg w-full mb-4 text-left">Ownership Overview</h3>

                        {/* Minimalist Donut Chart */}
                        <div className="relative w-32 h-32 mb-6">
                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#102c1e" strokeOpacity="0.05" strokeWidth="12"></circle>
                                {/* 60% Founders */}
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#102c1e" strokeWidth="12" strokeDasharray="150.8 251.2" strokeDashoffset="0"></circle>
                                {/* 27.5% Investors */}
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#102c1e" strokeOpacity="0.6" strokeWidth="12" strokeDasharray="69.1 251.2" strokeDashoffset="-150.8"></circle>
                                {/* 12.5% Option Pool */}
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#a1e2b6" strokeWidth="12" strokeDasharray="31.3 251.2" strokeDashoffset="-219.9"></circle>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span className="font-mono font-bold text-xl text-[#102c1e] leading-none">10M</span>
                                <span className="font-geist text-[9px] font-bold text-[#102c1e]/40 uppercase tracking-widest mt-1">Shares</span>
                            </div>
                        </div>

                        {/* Compact Legend */}
                        <div className="w-full space-y-1 bg-[#fafafa] p-3 rounded-xl border border-[#102c1e]/5">
                            <div className="flex justify-between items-center py-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#102c1e]"></div>
                                    <span className="text-[#102c1e]/70 font-geist text-xs font-medium">Founders</span>
                                </div>
                                <span className="font-mono font-bold text-xs text-[#102c1e]">60.0%</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#102c1e]/60"></div>
                                    <span className="text-[#102c1e]/70 font-geist text-xs font-medium">Investors</span>
                                </div>
                                <span className="font-mono font-bold text-xs text-[#102c1e]">27.5%</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#a1e2b6]"></div>
                                    <span className="text-[#102c1e]/70 font-geist text-xs font-medium">Option Pool</span>
                                </div>
                                <span className="font-mono font-bold text-xs text-[#102c1e]">12.5%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DashGrid - Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Equity Scenario Modeling */}
                    <div className="lg:col-span-6 bg-white border border-[#102c1e]/10 shadow-sm rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-outfit font-bold text-[#102c1e] text-lg">Scenario Modeling</h3>
                                <p className="text-[11px] font-geist font-medium text-slate-400 mt-1 uppercase tracking-widest">Dự phóng Vòng Kế Tiếp</p>
                            </div>
                            <div className="p-2 bg-[#a1e2b6]/20 rounded-xl text-[#102c1e]">
                                <LineChart className="h-4 w-4" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="flex-1">
                                    <label className="text-[10px] font-geist font-bold text-[#102c1e]/50 uppercase tracking-widest block mb-2">Target Raise ($)</label>
                                    <input type="text" defaultValue="3,000,000" className="w-full bg-transparent border-b border-[#102c1e]/10 py-1 text-lg font-mono font-bold text-[#102c1e] focus:outline-none focus:border-[#a1e2b6] transition-colors" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] font-geist font-bold text-[#102c1e]/50 uppercase tracking-widest block mb-2">Pre-Money Val ($)</label>
                                    <input type="text" defaultValue="15,000,000" className="w-full bg-transparent border-b border-[#102c1e]/10 py-1 text-lg font-mono font-bold text-[#102c1e] focus:outline-none focus:border-[#a1e2b6] transition-colors" />
                                </div>
                            </div>

                            <div className="bg-[#fafafa] rounded-2xl border border-[#102c1e]/5 p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="font-geist text-xs font-medium text-[#102c1e]/60">Founder Dilution Impact</span>
                                    <span className="font-mono font-bold text-sm text-[#102c1e] flex items-center gap-2">
                                        45.0% <ArrowRight className="h-3 w-3 text-slate-300" /> <span className="text-[#a1e2b6]">37.5%</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-geist text-xs font-medium text-[#102c1e]/60">New Investor Ownership</span>
                                    <span className="font-mono font-bold text-sm text-[#102c1e]">16.67%</span>
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button className="text-xs font-geist font-bold text-[#102c1e] flex items-center gap-1.5 hover:text-[#a1e2b6] transition-colors">
                                    Mở bảng tính chi tiết <ArrowRight className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Vesting Schedule */}
                    <div className="lg:col-span-6 bg-white border border-[#102c1e]/10 shadow-sm rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-outfit font-bold text-[#102c1e] text-lg">Upcoming Vesting Cliffs</h3>
                            <div className="px-2 py-0.5 rounded-full bg-[#102c1e]/5 border border-[#102c1e]/10 text-[9px] font-geist font-bold text-[#102c1e] uppercase tracking-wider">
                                3 Events
                            </div>
                        </div>

                        <div className="relative before:absolute before:inset-0 before:left-3 before:h-full before:w-px before:bg-[#102c1e]/10 ml-2 space-y-6">
                            {upcomingVesting.map((item, index) => (
                                <div key={item.id} className="relative flex items-start gap-4">
                                    <div className="absolute left-[-21px] top-1.5 w-3 h-3 rounded-full bg-[#a1e2b6] ring-4 ring-white border border-[#102c1e]/10 z-10"></div>
                                    <div className="flex-1 bg-[#fafafa] border border-[#102c1e]/5 hover:border-[#102c1e]/10 transition-colors rounded-xl p-3">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-geist font-bold text-[13px] text-[#102c1e]">{item.person}</span>
                                            <span className="font-mono font-bold text-xs text-[#a1e2b6]">+{item.shares}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] font-geist font-medium text-slate-400">
                                            <span>{item.event}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                            <span className="text-[#102c1e]/60">{item.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
