'use client';

import React, { useState } from 'react';
import {
    TrendingUp, AlertTriangle, CheckCircle2,
    Clock, DollarSign, Activity, ChevronRight,
    Search, PieChart, ShieldAlert, ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── TYPES ────────────────────────────────────────────────────────
type HealthLevel = 'healthy' | 'watch' | 'critical';

interface PortfolioCompany {
    id: string;
    name: string;
    vertical: string;
    stage: string;
    investedUSD: number;
    ownership: number;
    currentValuation: string;
    healthLevel: HealthLevel;
    runwayMonths: number;
    mrrGrowth: number;  // % MoM
    mrr: string;
    burnRate: string;
    lastUpdate: string;
    nextMilestone: string;
    sparkline: number[];
}

// ─── MOCK DATA ────────────────────────────────────────────────────
const PORTFOLIO: PortfolioCompany[] = [
    {
        id: 'p1', name: 'SnapMoney', vertical: 'FinTech', stage: 'Series A',
        investedUSD: 500_000, ownership: 8.5, currentValuation: '$12M',
        healthLevel: 'healthy', runwayMonths: 18, mrrGrowth: 24, mrr: '$38K', burnRate: '$45K',
        lastUpdate: '3d ago', nextMilestone: 'Series B close Q3',
        sparkline: [18, 22, 26, 30, 36, 38, 38],
    },
    {
        id: 'p2', name: 'EduPath AI', vertical: 'EdTech', stage: 'Seed',
        investedUSD: 200_000, ownership: 12.0, currentValuation: '$2.8M',
        healthLevel: 'watch', runwayMonths: 7, mrrGrowth: 8, mrr: '$12K', burnRate: '$30K',
        lastUpdate: '7d ago', nextMilestone: 'Reach 20K students',
        sparkline: [10, 11, 10, 12, 11, 12, 12],
    },
    {
        id: 'p3', name: 'AgriSense', vertical: 'AgriTech', stage: 'Pre-Seed',
        investedUSD: 100_000, ownership: 15.0, currentValuation: '$800K',
        healthLevel: 'critical', runwayMonths: 2, mrrGrowth: -5, mrr: '$3K', burnRate: '$22K',
        lastUpdate: '2w ago', nextMilestone: 'Cần gọi vốn bridge',
        sparkline: [8, 7, 8, 6, 5, 4, 3],
    },
    {
        id: 'p4', name: 'HealthKit VN', vertical: 'HealthTech', stage: 'Seed',
        investedUSD: 300_000, ownership: 10.0, currentValuation: '$4.5M',
        healthLevel: 'healthy', runwayMonths: 14, mrrGrowth: 15, mrr: '$22K', burnRate: '$35K',
        lastUpdate: '5d ago', nextMilestone: 'Tích hợp BHYT số',
        sparkline: [12, 15, 17, 18, 20, 21, 22],
    },
    {
        id: 'p5', name: 'Kizuna Hub', vertical: 'SaaS B2B', stage: 'Seed',
        investedUSD: 150_000, ownership: 5.0, currentValuation: '$3M',
        healthLevel: 'healthy', runwayMonths: 24, mrrGrowth: 40, mrr: '$8K', burnRate: '$12K',
        lastUpdate: '1d ago', nextMilestone: 'Launch Pro-Rata Tool',
        sparkline: [2, 3, 5, 6, 7, 8, 8],
    }
];

// ─── HELPERS ──────────────────────────────────────────────────────
const HEALTH: Record<HealthLevel, { label: string; text: string; bg: string; dot: string; icon: any }> = {
    healthy: { label: 'Healthy', text: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', icon: CheckCircle2 },
    watch: { label: 'Watch', text: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-500', icon: AlertTriangle },
    critical: { label: 'Critical Risk', text: 'text-red-700', bg: 'bg-red-50 border-red-200', dot: 'bg-red-500', icon: ShieldAlert },
};

function Sparkline({ data, isUp }: { data: number[], isUp: boolean }) {
    const min = Math.min(...data), max = Math.max(...data);
    const range = max - min || 1;
    const w = 50, h = 18;
    const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
    const color = isUp ? '#10b981' : '#ef4444';
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
            <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────
export default function PortfolioCommandCenter() {
    const [searchQuery, setSearchQuery] = useState('');

    const fmt$ = (v: number) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1_000).toFixed(0)}K`;

    return (
        <div className="flex flex-col h-full bg-[#fafafa] overflow-hidden">

            {/* ── HEADER ── */}
            <header className="shrink-0 px-8 pt-8 pb-6 bg-white border-b border-slate-200">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="font-sans text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">PROTECT · POST-INVESTMENT</p>
                        <h1 className="font-heading font-black text-[#102c1e] text-3xl tracking-tight leading-none">
                            Portfolio Command Center
                        </h1>
                        <p className="font-sans text-slate-500 text-sm mt-2">
                            Detect operational risks — burn rate, runway, MRR churn — before they damage your fund's growth.
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search portfolio companies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl font-sans text-xs text-[#102c1e] focus:outline-none focus:border-[#a1e2b6] focus:ring-4 focus:ring-[#a1e2b6]/10 transition-all shadow-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-[#102c1e] text-white px-4 py-2 rounded-xl font-sans text-xs font-bold hover:bg-[#0a1c13] transition-colors shadow-sm">
                        <PieChart className="w-4 h-4" /> Pro-Rata Simulator
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 [&::-webkit-scrollbar]:hidden">
                <div className="max-w-7xl mx-auto space-y-6 pb-20">

                    {/* ── TOP ALERT CARDS (Ops Risk Style) ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                        {/* Card 1: Critical Runway */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-red-50 border border-red-200 text-red-600 px-2 py-0.5 rounded-md font-sans text-[10px] font-bold uppercase tracking-wide">High Risk</span>
                                <span className="font-sans text-[10px] font-bold text-slate-500">AgriSense</span>
                            </div>
                            <h3 className="font-heading font-black text-[#102c1e] text-base mb-1">Runway Alert: 2 months left</h3>
                            <p className="font-sans text-xs text-slate-500 mb-4">Cash out date projected: Aug 15. MRR dropping 5% MoM.</p>
                            <button className="bg-[#102c1e] text-white px-4 py-2 rounded-lg font-sans text-[10px] font-bold hover:bg-[#0a1c13] transition-colors w-full text-center">
                                Review Bridge Loan
                            </button>
                        </div>

                        {/* Card 2: Watchlist */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-amber-50 border border-amber-200 text-amber-600 px-2 py-0.5 rounded-md font-sans text-[10px] font-bold uppercase tracking-wide">Watch</span>
                                <span className="font-sans text-[10px] font-bold text-slate-500">EduPath AI</span>
                            </div>
                            <h3 className="font-heading font-black text-[#102c1e] text-base mb-1">Burn rate spike: $30K/mo</h3>
                            <p className="font-sans text-xs text-slate-500 mb-4">Marketing spend increased 40% but CAC worsened by 15%.</p>
                            <button className="bg-[#102c1e] text-white px-4 py-2 rounded-lg font-sans text-[10px] font-bold hover:bg-[#0a1c13] transition-colors w-full text-center">
                                Schedule Board Call
                            </button>
                        </div>

                        {/* Card 3: Report Due */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-sans text-[10px] font-bold uppercase tracking-wide">Action</span>
                                <span className="font-sans text-[10px] font-bold text-slate-500">3 Companies</span>
                            </div>
                            <h3 className="font-heading font-black text-[#102c1e] text-base mb-1">Q2 Reports Missing</h3>
                            <p className="font-sans text-xs text-slate-500 mb-4">SnapMoney, HealthKit and 1 other haven't submitted financials.</p>
                            <button className="bg-[#102c1e] text-white px-4 py-2 rounded-lg font-sans text-[10px] font-bold hover:bg-[#0a1c13] transition-colors w-full text-center">
                                Send Automated Reminders
                            </button>
                        </div>

                        {/* Card 4: Good News */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-2 py-0.5 rounded-md font-sans text-[10px] font-bold uppercase tracking-wide">Success</span>
                                <span className="font-sans text-[10px] font-bold text-slate-500">Kizuna Hub</span>
                            </div>
                            <h3 className="font-heading font-black text-[#102c1e] text-base mb-1">MRR Growth +40% MoM</h3>
                            <p className="font-sans text-xs text-slate-500 mb-4">Hit $8K MRR. Valuation estimate increased to $3M.</p>
                            <button className="bg-white border border-slate-200 text-[#102c1e] px-4 py-2 rounded-lg font-sans text-[10px] font-bold hover:bg-slate-50 transition-colors w-full text-center">
                                View Traction Report
                            </button>
                        </div>

                    </div>

                    {/* ── PORTFOLIO LEDGER GRID ── */}
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="font-heading font-black text-[#102c1e] text-lg">Portfolio Ledger</h3>
                            <div className="flex items-center gap-4 font-sans text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <span>Deployed: $1.25M</span>
                                <span>Total Value: $23.1M</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="px-6 py-4 font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company</th>
                                        <th className="px-4 py-4 font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest">Health & Runway</th>
                                        <th className="px-4 py-4 font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Invested / Value</th>
                                        <th className="px-4 py-4 font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Ownership</th>
                                        <th className="px-4 py-4 font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest">MRR / Burn</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {PORTFOLIO.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((company) => {
                                        const h = HEALTH[company.healthLevel];
                                        return (
                                            <tr key={company.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">

                                                {/* Company & Vertical */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn("w-2 h-2 rounded-full shrink-0", h.dot)} />
                                                        <div>
                                                            <p className="font-heading font-bold text-[#102c1e] text-base leading-none mb-1">{company.name}</p>
                                                            <p className="font-sans text-[11px] text-slate-500">{company.vertical} · {company.stage}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Health & Runway */}
                                                <td className="px-4 py-4">
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border w-fit font-sans text-[9px] font-bold uppercase tracking-wider", h.bg, h.text)}>
                                                            <h.icon className="w-3 h-3" /> {h.label}
                                                        </div>
                                                        <div className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                                                            <Clock className="w-3 h-3" /> {company.runwayMonths} months
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Invested vs Value */}
                                                <td className="px-4 py-4 text-right">
                                                    <p className="font-mono font-medium text-slate-500 text-xs mb-0.5">{fmt$(company.investedUSD)}</p>
                                                    <p className="font-mono font-black text-[#102c1e] text-sm">{company.currentValuation}</p>
                                                </td>

                                                {/* Ownership */}
                                                <td className="px-4 py-4 text-right">
                                                    <span className="font-mono font-black text-[#102c1e] bg-[#102c1e]/5 px-2 py-1 rounded-md text-sm border border-[#102c1e]/10">
                                                        {company.ownership}%
                                                    </span>
                                                </td>

                                                {/* Traction (MRR / Burn) */}
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div>
                                                            <div className="flex items-center gap-1 font-mono text-sm font-black text-[#102c1e] mb-0.5">
                                                                {company.mrr}
                                                                <span className={cn("text-[10px] ml-1", company.mrrGrowth > 0 ? "text-emerald-500" : "text-red-500")}>
                                                                    {company.mrrGrowth > 0 ? '+' : ''}{company.mrrGrowth}%
                                                                </span>
                                                            </div>
                                                            <p className="font-sans text-[10px] text-slate-500">Burn: {company.burnRate}/mo</p>
                                                        </div>
                                                        <div className="w-16 opacity-70 group-hover:opacity-100 transition-opacity">
                                                            <Sparkline data={company.sparkline} isUp={company.mrrGrowth > 0} />
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Action */}
                                                <td className="px-6 py-4 text-right">
                                                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-sans text-[10px] font-bold text-[#102c1e] hover:border-[#102c1e]/30 hover:bg-slate-50 transition-colors">
                                                        Command <ChevronRight className="w-3 h-3" />
                                                    </button>
                                                </td>

                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}