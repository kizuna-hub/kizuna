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
        <div className="min-h-screen w-full bg-[#fafafa] p-6 md:p-8 lg:p-10 font-inter">
            <div className="mx-auto flex h-full max-w-5xl flex-col space-y-8">

                {/* Header chuẩn Rule 4.1 */}
                <header className="mb-6 flex items-baseline justify-between border-b border-[#102c1e]/10 pb-4 pt-6">
                    <div>
                        <h1 className="font-outfit text-3xl font-black tracking-tight text-[#102c1e] md:text-4xl">Sổ cái Hợp đồng FAST</h1>
                        <p className="mt-2 font-inter text-base leading-relaxed text-slate-700">Quản lý Cam kết Tiêu chuẩn & Lộ trình Vesting (Founder / Advisor Standard Template).</p>
                    </div>
                    <button className="flex items-center gap-2 rounded-xl border border-[#102c1e]/10 bg-white px-5 py-2.5 font-geist text-sm font-bold text-[#102c1e] shadow-sm transition-colors hover:bg-[#102c1e]/5">
                        <ArrowUpRight className="h-4 w-4" /> Xuất Báo cáo CSV
                    </button>
                </header>

                {/* Global Financial Stats */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Bento Card chuẩn Rule 5.1 */}
                    <div className="group relative flex break-inside-avoid flex-col overflow-hidden rounded-2xl border border-[#102c1e]/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                        <div className="absolute right-0 top-0 -z-0 h-32 w-32 rounded-bl-full bg-[#a1e2b6]/10"></div>
                        <p className="relative z-10 font-geist text-[11px] font-black uppercase tracking-widest text-[#102c1e]/50">Tổng Tài sản Đã Vest (Vested)</p>
                        <p className="relative z-10 mt-3 font-mono text-4xl font-bold tracking-tighter text-[#102c1e]">$267,500</p>
                    </div>

                    <div className="group flex break-inside-avoid flex-col overflow-hidden rounded-2xl border border-[#102c1e]/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                        <p className="font-geist text-[11px] font-black uppercase tracking-widest text-[#102c1e]/50">Tài sản Đang Chờ (Unvested)</p>
                        <p className="mt-3 font-mono text-4xl font-bold tracking-tighter text-slate-400">$410,000</p>
                    </div>

                    <div className="group relative flex break-inside-avoid flex-col overflow-hidden rounded-2xl bg-[#102c1e] p-6 text-white shadow-sm transition-shadow hover:shadow-md">
                        <p className="flex items-center gap-2 font-geist text-[11px] font-black uppercase tracking-widest text-[#a1e2b6]/70">
                            <Zap className="h-3 w-3 text-[#a1e2b6]" /> Cliff Gần nhất (Sắp tới)
                        </p>
                        <div className="mt-3">
                            <p className="font-mono text-3xl font-bold tracking-tighter text-white">Dietfit AI</p>
                            <p className="mt-1 max-w-fit shrink-0 border-t border-white/10 pt-2 font-inter text-sm text-[#a1e2b6]">Vào ngày 15 Tháng 8, 2026</p>
                        </div>
                    </div>
                </div>

                {/* Ledger Table chuẩn White Bento */}
                <div className="group flex flex-col overflow-hidden rounded-2xl border border-[#102c1e]/10 bg-white shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-center justify-between border-b border-[#102c1e]/5 bg-[#fafafa]/50 px-5 py-4">
                        <h2 className="flex items-center gap-2 font-outfit text-xl font-black tracking-tight text-[#102c1e]">
                            <FileSignature className="h-5 w-5 text-[#a1e2b6]" /> Danh sách Cam kết
                        </h2>
                        <div className="flex gap-4 rounded-lg border border-[#102c1e]/10 bg-white px-3 py-1.5 font-geist text-sm">
                            <span className="font-bold text-[#102c1e]">Active: 3</span>
                            <span className="text-slate-400">Archived: 0</span>
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                        {/* Table chuẩn Rule 6 (No vertical borders, faint horizontal) */}
                        <table className="min-w-[800px] w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-[#102c1e]/5 bg-white">
                                    <th className="w-1/5 px-6 py-4 font-geist text-[10px] font-bold uppercase tracking-widest text-[#102c1e]/50">Startup & Vai trò</th>
                                    <th className="w-[15%] px-4 py-4 font-geist text-[10px] font-bold uppercase tracking-widest text-[#102c1e]/50">Cổ phần</th>
                                    <th className="w-1/4 px-4 py-4 font-geist text-[10px] font-bold uppercase tracking-widest text-[#102c1e]/50">Điều khoản (Cliff/Term)</th>
                                    <th className="w-1/4 px-4 py-4 font-geist text-[10px] font-bold uppercase tracking-widest text-[#102c1e]/50">Tiến độ Vesting</th>
                                    <th className="px-4 py-4 font-geist text-[10px] font-bold uppercase tracking-widest text-[#102c1e]/50">Tùy chọn</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {contracts.map((contract) => (
                                    <tr key={contract.id} className="group/row border-b border-[#102c1e]/5 transition-colors last:border-0 hover:bg-[#102c1e]/5">

                                        {/* Cột 1: Startup & Vai trò */}
                                        <td className="px-6 py-5">
                                            <p className="font-outfit text-lg font-black leading-tight text-[#102c1e] transition-colors group-hover/row:text-[#a1e2b6]">{contract.startup}</p>
                                            <p className="mt-0.5 font-inter text-[13px] text-slate-700">{contract.role}</p>
                                        </td>

                                        {/* Cột 2: Cổ phần (Equity & Fiat Match) */}
                                        <td className="px-4 py-5">
                                            <p className="font-mono text-xl font-bold leading-none tracking-tight text-[#102c1e]">{contract.equity}</p>
                                            <p className="mt-1 font-mono text-[11px] text-slate-400">~ {contract.vestedValue}</p>
                                        </td>

                                        {/* Cột 3: Điều khoản */}
                                        <td className="px-4 py-5">
                                            <div className="flex flex-col gap-1.5 align-baseline">
                                                <span className="flex w-max items-center gap-1 rounded border border-[#102c1e]/10 bg-[#fafafa] px-2 py-0.5 font-geist text-[10px] font-bold uppercase text-slate-600">
                                                    {contract.cliff.includes('Không') ? <Unlock className="h-3 w-3 text-[#a1e2b6]" /> : <Lock className="h-3 w-3" />}
                                                    {contract.cliff}
                                                </span>
                                                <p className="font-inter text-sm font-medium text-[#102c1e]">{contract.vestingPeriod}</p>
                                            </div>
                                        </td>

                                        {/* Cột 4: Tiến độ Vesting (Progress) */}
                                        <td className="px-4 py-5">
                                            <div className="w-full max-w-[200px]">
                                                <div className="mb-1.5 flex items-center justify-between">
                                                    <span className={cn(
                                                        "font-geist text-[10px] font-bold uppercase tracking-wider",
                                                        contract.progress === 100 ? "text-[#a1e2b6]" : "text-[#102c1e]"
                                                    )}>
                                                        {contract.status}
                                                    </span>
                                                    <span className="font-mono text-xs font-bold text-[#102c1e]/60">{contract.progress}%</span>
                                                </div>
                                                {/* Thanh Tiến độ UI */}
                                                <div className="relative h-2 w-full overflow-hidden rounded-full border border-[#102c1e]/5 bg-[#102c1e]/5">
                                                    {contract.progress > 0 && contract.progress < 100 && (
                                                        <div className="absolute bottom-0 left-[25%] top-0 z-20 w-px bg-red-400/50" title="1-Year Cliff Mark"></div>
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

                                        {/* Cột 5: Actions - Rule 5.4 */}
                                        <td className="px-4 py-5">
                                            <button className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#102c1e] group-hover/row:text-[#102c1e]">
                                                <MoreHorizontal className="h-5 w-5" />
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