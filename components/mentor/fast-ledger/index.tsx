'use client';

import React from 'react';
import { FileSignature, ArrowUpRight, Lock, Unlock, Zap, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const contracts = [
    {
        id: 1,
        startup: 'Kizuna Hub',
        role: 'Product Advisory',
        equity: '1.5%',
        cliff: '1 Năm Cliff',
        vestingPeriod: '4 Năm (48 Tháng)',
        vestedValue: '$75,000',
        progress: 35, // percent
        status: 'Đang vesting',
    },
    {
        id: 2,
        startup: 'Dietfit AI',
        role: 'Growth Strategy',
        equity: '0.5%',
        cliff: 'Không Cliff',
        vestingPeriod: '2 Năm (24 Tháng)',
        vestedValue: '$12,500',
        progress: 10,
        status: 'Mới bắt đầu',
    },
    {
        id: 3,
        startup: 'SnapMoney',
        role: 'Technical Expert (CTO As-a-Service)',
        equity: '2.0%',
        cliff: '1 Năm Cliff',
        vestingPeriod: '4 Năm (48 Tháng)',
        vestedValue: '$180,000',
        progress: 100,
        status: 'Hoàn tất Vesting',
    }
];

export default function FastLedger() {
    return (
        <div className="w-full p-6 md:p-8 lg:p-10 font-inter">
            <div className="w-full max-w-[1200px] mx-auto space-y-8">

                {/* Header */}
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="font-outfit font-black text-[#102c1e] text-4xl tracking-tight">Sổ cái Hợp đồng FAST</h1>
                        <p className="font-inter text-slate-600 mt-2 text-base">Quản lý Cam kết Tiêu chuẩn & Lộ trình Vesting (Founder / Advisor Standard Template).</p>
                    </div>
                    <button className="bg-[#fafafa] text-[#102c1e] border border-[#102c1e]/10 font-geist font-bold rounded-xl px-5 py-2.5 hover:bg-[#102c1e]/5 transition-colors shadow-sm flex items-center gap-2 text-sm">
                        <ArrowUpRight className="w-4 h-4" /> Xuất Báo cáo CSV
                    </button>
                </header>

                {/* Global Financial Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#a1e2b6]/10 rounded-bl-full -z-0"></div>
                        <p className="font-geist text-[11px] font-black text-[#102c1e]/50 uppercase tracking-widest relative z-10">Tổng Tài sản Đã Vest (Vested)</p>
                        <p className="font-mono font-bold text-[#102c1e] text-4xl mt-3 tracking-tighter relative z-10">$267,500</p>
                    </div>

                    <div className="bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm p-6">
                        <p className="font-geist text-[11px] font-black text-[#102c1e]/50 uppercase tracking-widest">Tài sản Đang Chờ (Unvested)</p>
                        <p className="font-mono font-bold text-slate-400 text-4xl mt-3 tracking-tighter">$410,000</p>
                    </div>

                    <div className="bg-[#102c1e] rounded-3xl shadow-sm p-6 text-[#fafafa] relative overflow-hidden">
                        <p className="font-geist text-[11px] font-black text-[#a1e2b6]/70 uppercase tracking-widest flex items-center gap-2">
                            <Zap className="w-3 h-3 text-[#a1e2b6]" /> Cliff Gần nhất (Sắp tới)
                        </p>
                        <div className="mt-3">
                            <p className="font-mono font-bold text-white text-3xl tracking-tighter">Dietfit AI</p>
                            <p className="font-inter text-[#a1e2b6] text-sm mt-1 border-t border-white/10 pt-2 shrink-0 max-w-fit">Vào ngày 15 Tháng 8, 2026</p>
                        </div>
                    </div>
                </div>

                {/* Cấu trúc Ledger Table chuẩn White Bento */}
                <div className="bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-[#102c1e]/5 bg-[#fafafa] flex items-center justify-between">
                        <h2 className="font-outfit font-black text-[#102c1e] text-xl tracking-tight flex items-center gap-2">
                            <FileSignature className="w-5 h-5 text-[#a1e2b6]" /> Danh sách Cam kết
                        </h2>
                        <div className="bg-white border border-[#102c1e]/10 px-3 py-1.5 rounded-lg flex gap-4 font-geist text-sm">
                            <span className="font-bold text-[#102c1e]">Active: 3</span>
                            <span className="text-slate-400">Archived: 0</span>
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                        {/* Enterprise Table - No vertical borders, clean horizontal divisors */}
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-[#102c1e]/5 bg-white">
                                    <th className="font-geist text-[#102c1e]/50 font-bold uppercase tracking-widest text-[11px] px-6 py-4 w-1/5">Startup & Vai trò</th>
                                    <th className="font-geist text-[#102c1e]/50 font-bold uppercase tracking-widest text-[11px] px-4 py-4 w-[15%]">Cổ phần</th>
                                    <th className="font-geist text-[#102c1e]/50 font-bold uppercase tracking-widest text-[11px] px-4 py-4 w-1/4">Điều khoản (Cliff/Term)</th>
                                    <th className="font-geist text-[#102c1e]/50 font-bold uppercase tracking-widest text-[11px] px-4 py-4 w-1/4">Tiến độ Vesting</th>
                                    <th className="font-geist text-[#102c1e]/50 font-bold uppercase tracking-widest text-[11px] px-4 py-4">Tùy chọn</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#102c1e]/5 bg-white">
                                {contracts.map((contract) => (
                                    <tr key={contract.id} className="group hover:bg-[#102c1e]/5 transition-colors">

                                        {/* Cột 1: Startup & Vai trò */}
                                        <td className="px-6 py-5">
                                            <p className="font-outfit font-black text-[#102c1e] text-lg leading-tight group-hover:text-[#a1e2b6] transition-colors">{contract.startup}</p>
                                            <p className="font-inter text-slate-500 text-[13px] mt-0.5">{contract.role}</p>
                                        </td>

                                        {/* Cột 2: Cổ phần (Equity & Fiat Match) */}
                                        <td className="px-4 py-5">
                                            <p className="font-mono font-bold text-[#102c1e] text-xl tracking-tight leading-none">{contract.equity}</p>
                                            <p className="font-mono text-slate-400 text-[11px] mt-1">~ {contract.vestedValue}</p>
                                        </td>

                                        {/* Cột 3: Điều khoản */}
                                        <td className="px-4 py-5">
                                            <div className="flex flex-col gap-1.5 align-baseline">
                                                <span className="bg-[#fafafa] border border-[#102c1e]/10 text-slate-600 font-geist text-[10px] uppercase font-bold px-2 py-0.5 rounded flex items-center gap-1 w-max">
                                                    {contract.cliff.includes('Không') ? <Unlock className="w-3 h-3 text-[#a1e2b6]" /> : <Lock className="w-3 h-3" />}
                                                    {contract.cliff}
                                                </span>
                                                <p className="font-inter text-[#102c1e] text-sm font-medium">{contract.vestingPeriod}</p>
                                            </div>
                                        </td>

                                        {/* Cột 4: Tiến độ Vesting (Progress) */}
                                        <td className="px-4 py-5">
                                            <div className="w-full max-w-[200px]">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className={cn(
                                                        "font-geist text-[10px] font-bold uppercase tracking-wider",
                                                        contract.progress === 100 ? "text-[#a1e2b6]" : "text-[#102c1e]"
                                                    )}>
                                                        {contract.status}
                                                    </span>
                                                    <span className="font-mono font-bold text-[#102c1e]/60 text-xs">{contract.progress}%</span>
                                                </div>
                                                {/* Thanh Tiến độ UI */}
                                                <div className="w-full h-2 bg-[#102c1e]/5 rounded-full overflow-hidden border border-[#102c1e]/5 relative">
                                                    {contract.progress > 0 && contract.progress < 100 && (
                                                        <div className="absolute left-[25%] top-0 bottom-0 w-px bg-red-400/50 z-20" title="1-Year Cliff Mark"></div>
                                                    )}
                                                    <div
                                                        className={cn(
                                                            "h-full rounded-r-md transition-all duration-1000",
                                                            contract.progress === 100 ? "bg-[#a1e2b6]" : "bg-[#102c1e]"
                                                        )}
                                                        style={{ width: `${contract.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>

                                        {/* Cột 5: Actions */}
                                        <td className="px-4 py-5">
                                            <button className="text-slate-400 hover:text-[#102c1e] hover:bg-[#102c1e]/5 p-2 rounded-lg transition-colors">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}