'use client';

import React, { useState, useMemo } from 'react';
import {
    TrendingUp, ArrowRight, Download, Sparkles, AlertCircle,
    Info, RefreshCw, Lock, ChevronDown, Target, DollarSign,
    Zap, BarChart3, Users, CheckCircle2, ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── TYPES ────────────────────────────────────────────────────────
interface Holder {
    id: string;
    name: string;
    type: 'founder' | 'investor' | 'esop' | 'advisor';
    shares: number;
}

// ─── MOCK INITIAL CAP TABLE (from Founder data) ───────────────────
const BASE_HOLDERS: Holder[] = [
    { id: 'f1', name: 'Lê Bảo (Founder)', type: 'founder', shares: 4_500_000 },
    { id: 'f2', name: 'Minh CTO', type: 'founder', shares: 2_000_000 },
    { id: 'i1', name: 'Kizuna Ventures (Pre-Seed)', type: 'investor', shares: 1_000_000 },
    { id: 'a1', name: 'Advisor Pool', type: 'advisor', shares: 200_000 },
    { id: 'e1', name: 'ESOP Pool', type: 'esop', shares: 1_300_000 },
];

const TYPE_COLORS: Record<Holder['type'], string> = {
    founder: '#102c1e',
    investor: '#a1e2b6',
    esop: '#8ab4a0',
    advisor: '#4a7c5f',
};

const TYPE_LABEL: Record<Holder['type'], string> = {
    founder: 'Founders',
    investor: 'Investors',
    esop: 'ESOP',
    advisor: 'Advisors',
};

// ─── SVG DONUT (real-time) ────────────────────────────────────────
function LiveDonut({ slices, cx = 100, cy = 100, r = 72, innerR = 48 }:
    { slices: { pct: number; color: string; label: string }[]; cx?: number; cy?: number; r?: number; innerR?: number }) {

    let cumAngle = -90;
    const gap = 1.5;

    const paths = slices.filter(s => s.pct > 0.3).map(seg => {
        const sweep = (seg.pct / 100) * 360 - gap;
        const start = cumAngle + gap / 2;
        const end = start + sweep;
        cumAngle += (seg.pct / 100) * 360;

        const toR = (d: number) => (d * Math.PI) / 180;
        const x1 = cx + r * Math.cos(toR(start));
        const y1 = cy + r * Math.sin(toR(start));
        const x2 = cx + r * Math.cos(toR(end));
        const y2 = cy + r * Math.sin(toR(end));
        const ix1 = cx + innerR * Math.cos(toR(start));
        const iy1 = cy + innerR * Math.sin(toR(start));
        const ix2 = cx + innerR * Math.cos(toR(end));
        const iy2 = cy + innerR * Math.sin(toR(end));
        const la = sweep > 180 ? 1 : 0;

        return {
            d: `M${x1} ${y1} A${r} ${r} 0 ${la} 1 ${x2} ${y2} L${ix2} ${iy2} A${innerR} ${innerR} 0 ${la} 0 ${ix1} ${iy1}Z`,
            color: seg.color,
            label: seg.label,
            pct: seg.pct,
        };
    });

    return (
        <svg viewBox="0 0 200 200" className="w-full max-w-[220px]">
            {paths.map((p, i) => (
                <path key={i} d={p.d} fill={p.color} className="transition-all duration-500 hover:opacity-80" />
            ))}
            {/* Center */}
            <text x="100" y="93" textAnchor="middle" fill="#102c1e" fontSize="11" fontWeight="900" fontFamily="monospace">
                {slices[0]?.pct.toFixed(1)}%
            </text>
            <text x="100" y="107" textAnchor="middle" fill="#102c1e" fontSize="7" fontWeight="700" fontFamily="monospace" opacity="0.4">
                LEAD FOUNDER
            </text>
        </svg>
    );
}

// ─── SLIDER ───────────────────────────────────────────────────────
function SimSlider({ label, value, min, max, step = 1, format, onChange }:
    { label: string; value: number; min: number; max: number; step?: number; format: (v: number) => string; onChange: (v: number) => void }) {
    const pct = ((value - min) / (max - min)) * 100;
    return (
        <div>
            <div className="flex justify-between items-center mb-2.5">
                <label className="font-sans text-[11px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
                <span className="font-mono font-black text-sm text-[#102c1e] bg-[#102c1e]/5 px-2.5 py-1 rounded-lg border border-[#102c1e]/8">
                    {format(value)}
                </span>
            </div>
            <div className="relative">
                <input
                    type="range" min={min} max={max} step={step} value={value}
                    onChange={e => onChange(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, #102c1e 0%, #102c1e ${pct}%, #e4e8ef ${pct}%, #e4e8ef 100%)`,
                    }}
                />
            </div>
        </div>
    );
}

// ─── MAIN ─────────────────────────────────────────────────────────
export default function ProRataSimulator({ dealId }: { dealId?: string }) {
    const baseTotal = BASE_HOLDERS.reduce((s, h) => s + h.shares, 0);

    // Simulation controls
    const [investAmount, setInvestAmount] = useState(1_000_000); // $
    const [preMoneyVal, setPreMoneyVal] = useState(5_000_000); // $
    const [optionPoolExpand, setOptionPoolExpand] = useState(10); // %
    const [proRataPct, setProRataPct] = useState(2); // % ownership reserved for next round

    // ─── CALCULATIONS ─────────────────────────────────────────────
    const sim = useMemo(() => {
        const postMoney = preMoneyVal + investAmount;
        const newInvestorPct = (investAmount / postMoney) * 100;
        const pricePerShare = preMoneyVal / baseTotal;
        const newShares = Math.round(investAmount / pricePerShare);
        const optionExpansionShares = Math.round((optionPoolExpand / 100) * baseTotal);
        const totalNewShares = newShares + optionExpansionShares;
        const newTotal = baseTotal + totalNewShares;

        const holders = BASE_HOLDERS.map(h => ({
            ...h,
            newPct: (h.shares / newTotal) * 100,
            oldPct: (h.shares / baseTotal) * 100,
            diluted: ((h.shares / baseTotal) - (h.shares / newTotal)) * 100,
        }));

        return {
            postMoney,
            newInvestorPct,
            pricePerShare,
            newShares,
            newTotal,
            holders,
            founderDilution: holders.filter(h => h.type === 'founder').reduce((s, h) => s + h.diluted, 0),
            yourOwnership: newInvestorPct,
        };
    }, [investAmount, preMoneyVal, optionPoolExpand, baseTotal]);

    // Group for donut
    const donutSlices = useMemo(() => {
        const grouped: Record<string, number> = {};
        sim.holders.forEach(h => {
            grouped[h.type] = (grouped[h.type] || 0) + h.newPct;
        });
        // Add new investor
        grouped['investor'] = (grouped['investor'] || 0) + sim.newInvestorPct;

        return (Object.entries(grouped) as [Holder['type'], number][]).map(([type, pct]) => ({
            pct,
            color: TYPE_COLORS[type],
            label: TYPE_LABEL[type],
        }));
    }, [sim]);

    const fmt$ = (v: number) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1000).toFixed(0)}K`;

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans">

            {/* ── TOPBAR ── */}
            <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#102c1e]/8 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <a href="/investor/deal-flow" className="flex items-center gap-1.5 text-slate-400 hover:text-[#102c1e] transition-colors font-sans text-sm font-bold">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </a>
                    <div className="w-px h-5 bg-[#102c1e]/10" />
                    <div>
                        <h1 className="font-heading font-black text-[#102c1e] text-xl">Pro-Rata Simulator</h1>
                        <p className="font-sans text-[10px] text-slate-400 font-bold uppercase tracking-widest">SnapMoney · Series A</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 bg-[#102c1e] text-white font-sans font-black text-sm px-4 py-2 rounded-xl hover:bg-[#0a1c13] transition-colors shadow-md">
                        <Target className="w-4 h-4 text-[#a1e2b6]" />
                        Tạo Term Sheet
                    </button>
                    <button className="flex items-center gap-2 border border-[#102c1e]/10 text-[#102c1e] font-sans font-bold text-sm px-4 py-2 rounded-xl hover:bg-[#102c1e]/5 transition-colors">
                        <Download className="w-4 h-4" /> Export
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* ── LEFT: Controls ── */}
                    <div className="lg:col-span-5 space-y-5">

                        {/* Control card */}
                        <div className="bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm p-6 space-y-7">
                            <div>
                                <h2 className="font-heading font-black text-[#102c1e] text-xl mb-1">Thông số đầu tư</h2>
                                <p className="font-sans text-xs text-slate-500">Kéo slider để xem pha loãng cổ phần theo thời gian thực.</p>
                            </div>

                            <SimSlider
                                label="Số tiền đầu tư"
                                value={investAmount} min={100_000} max={5_000_000} step={50_000}
                                format={fmt$} onChange={setInvestAmount}
                            />
                            <SimSlider
                                label="Pre-Money Valuation"
                                value={preMoneyVal} min={1_000_000} max={20_000_000} step={250_000}
                                format={fmt$} onChange={setPreMoneyVal}
                            />
                            <SimSlider
                                label="Mở rộng Option Pool"
                                value={optionPoolExpand} min={0} max={20} step={1}
                                format={v => `+${v}%`} onChange={setOptionPoolExpand}
                            />
                            <SimSlider
                                label="Pro-Rata Right (vòng sau)"
                                value={proRataPct} min={0} max={10} step={0.5}
                                format={v => `${v}%`} onChange={setProRataPct}
                            />
                        </div>

                        {/* Key outputs card */}
                        <div className="bg-[#102c1e] rounded-3xl p-6 text-white relative overflow-hidden">
                            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[#a1e2b6]/10 blur-2xl" />
                            <h3 className="font-heading font-black text-white text-lg mb-5 relative">Kết quả tính toán</h3>
                            <div className="relative space-y-3">
                                {[
                                    { label: 'Post-Money Valuation', value: fmt$(sim.postMoney), highlight: true },
                                    { label: 'Sở hữu của bạn', value: `${sim.newInvestorPct.toFixed(2)}%`, highlight: true },
                                    { label: 'Giá cổ phần (PPS)', value: `$${sim.pricePerShare.toFixed(4)}`, highlight: false },
                                    { label: 'Cổ phần mới phát hành', value: sim.newShares.toLocaleString(), highlight: false },
                                    { label: 'Founder bị pha loãng', value: `-${sim.founderDilution.toFixed(1)}%`, highlight: false },
                                    { label: 'Tổng cổ phần (FD)', value: sim.newTotal.toLocaleString(), highlight: false },
                                ].map((item, i) => (
                                    <div key={i} className={cn(
                                        'flex justify-between items-center rounded-xl px-3 py-2.5',
                                        item.highlight ? 'bg-[#a1e2b6]/15 border border-[#a1e2b6]/20' : 'bg-white/5'
                                    )}>
                                        <span className="font-sans text-xs text-white/60">{item.label}</span>
                                        <span className={cn('font-mono font-black text-sm', item.highlight ? 'text-[#a1e2b6]' : 'text-white')}>
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Warning if dilution > threshold */}
                        {sim.founderDilution > 15 && (
                            <div className="flex items-start gap-3 bg-white border border-[#102c1e]/10 rounded-2xl p-4">
                                <AlertCircle className="w-4 h-4 text-[#102c1e]/50 mt-0.5 shrink-0" />
                                <p className="font-sans text-xs text-slate-600 leading-relaxed">
                                    <strong className="text-[#102c1e]">Cảnh báo pha loãng:</strong> Founder bị pha loãng hơn 15%. Cân nhắc thương lượng lại pre-money valuation hoặc giảm ESOP expansion để bảo toàn founder's drive.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: Visualization ── */}
                    <div className="lg:col-span-7 space-y-5">

                        {/* Donut chart card */}
                        <div className="bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="font-heading font-black text-[#102c1e] text-xl">Cơ cấu sở hữu sau đầu tư</h2>
                                    <p className="font-sans text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">Post-money · Fully diluted</p>
                                </div>
                                <div className="flex items-center gap-1.5 bg-[#a1e2b6]/15 border border-[#a1e2b6]/30 px-3 py-1.5 rounded-xl">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#a1e2b6] animate-pulse" />
                                    <span className="font-sans text-[10px] font-black text-[#102c1e]">Live</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-6">
                                {/* Donut */}
                                <div className="w-[220px] shrink-0">
                                    <LiveDonut slices={donutSlices} />
                                </div>

                                {/* Legend + holders breakdown */}
                                <div className="flex-1 space-y-2.5">
                                    {/* New investor entry */}
                                    <div className="flex items-center justify-between bg-[#a1e2b6]/10 border border-[#a1e2b6]/30 rounded-xl px-3.5 py-2.5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-2.5 h-2.5 rounded-sm bg-[#a1e2b6]" />
                                            <span className="font-sans text-xs font-black text-[#102c1e]">You (New Investor)</span>
                                        </div>
                                        <span className="font-mono text-sm font-black text-[#102c1e]">{sim.newInvestorPct.toFixed(2)}%</span>
                                    </div>

                                    {/* Existing holders */}
                                    {sim.holders.map(h => (
                                        <div key={h.id} className="flex items-center justify-between px-3.5 py-2 rounded-xl hover:bg-[#fafafa] transition-colors group">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: TYPE_COLORS[h.type] }} />
                                                <span className="font-sans text-xs font-bold text-slate-600">{h.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-sans text-[10px] text-slate-400">
                                                    {h.oldPct.toFixed(1)}% →
                                                </span>
                                                <span className="font-mono text-xs font-black text-[#102c1e]">{h.newPct.toFixed(1)}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Before/After comparison table */}
                        <div className="bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-[#102c1e]/5 flex items-center justify-between">
                                <h3 className="font-heading font-black text-[#102c1e] text-lg">So sánh trước / sau đầu tư</h3>
                                <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fully diluted basis</span>
                            </div>

                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-[#102c1e]/5">
                                        <th className="px-6 py-3 font-sans text-[9px] font-bold text-slate-400 uppercase tracking-widest">Cổ đông</th>
                                        <th className="px-4 py-3 font-sans text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Trước</th>
                                        <th className="px-4 py-3 font-sans text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Sau</th>
                                        <th className="px-6 py-3 font-sans text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Pha loãng</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#102c1e]/5">
                                    {sim.holders.map(h => (
                                        <tr key={h.id} className="hover:bg-[#fafafa] transition-colors">
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: TYPE_COLORS[h.type] }} />
                                                    <span className="font-sans text-sm font-bold text-[#102c1e]">{h.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-sm text-slate-500 text-right">{h.oldPct.toFixed(1)}%</td>
                                            <td className="px-4 py-3 font-mono text-sm font-black text-[#102c1e] text-right">{h.newPct.toFixed(1)}%</td>
                                            <td className="px-6 py-3 text-right">
                                                <span className="font-mono text-xs font-bold text-slate-400">-{h.diluted.toFixed(1)}%</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {/* New investor row */}
                                    <tr className="bg-[#a1e2b6]/8">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-[#a1e2b6]" />
                                                <span className="font-sans text-sm font-black text-[#102c1e]">You (New)</span>
                                                <span className="font-sans text-[9px] font-black bg-[#102c1e] text-white px-1.5 py-0.5 rounded-full">NEW</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-sm text-slate-400 text-right">—</td>
                                        <td className="px-4 py-3 font-mono text-sm font-black text-[#102c1e] text-right">{sim.newInvestorPct.toFixed(2)}%</td>
                                        <td className="px-6 py-3 text-right">
                                            <span className="font-mono text-xs font-bold text-[#a1e2b6]">New entry</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Pro-Rata summary */}
                        <div className="bg-[#102c1e]/[0.02] border border-[#102c1e]/8 rounded-2xl p-5 flex items-start gap-3">
                            <Info className="w-4 h-4 text-[#102c1e]/30 mt-0.5 shrink-0" />
                            <div>
                                <p className="font-sans font-bold text-xs text-[#102c1e] mb-0.5">Pro-Rata Right</p>
                                <p className="font-sans text-xs text-slate-500 leading-relaxed">
                                    Với {proRataPct}% pro-rata, bạn có quyền đầu tư thêm{' '}
                                    <strong className="text-[#102c1e]">{fmt$(sim.postMoney * (proRataPct / 100))}</strong>{' '}
                                    trong vòng gọi vốn tiếp theo để duy trì tỉ lệ sở hữu hiện tại.
                                    Bổ sung điều khoản này vào Term Sheet để bảo vệ quyền lợi.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
