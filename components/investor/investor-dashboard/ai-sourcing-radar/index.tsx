'use client';

import React, { useState } from 'react';
import {
    Sparkles, Target, DollarSign, ChevronRight, Check, Zap, Globe,
    Sliders, CheckCircle2, Circle, ArrowLeft, BarChart3, Building2, MapPin, Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── TYPES ────────────────────────────────────────────────────────
type WizardStep = 1 | 2 | 3 | 4; // Tách thành 4 bước cho nhẹ UI giống BorderPilot

interface ThesisConfig {
    stages: string[];
    verticals: string[];
    minCheckSize: number;
    maxCheckSize: number;
    geographies: string[];
    minMatchScore: number;
    revenueStages: string[];
}

// ─── OPTIONS ──────────────────────────────────────────────────────
const STAGE_OPTIONS = [
    { id: 'Pre-Seed', desc: 'Ý tưởng & MVP' },
    { id: 'Seed', desc: 'Có lực kéo (Traction)' },
    { id: 'Series A', desc: 'Sẵn sàng mở rộng (Scale)' },
    { id: 'Series B+', desc: 'Tăng trưởng mạnh' }
];

const VERTICAL_OPTIONS = [
    'FinTech', 'EdTech', 'HealthTech', 'AgriTech', 'AI / ML',
    'SaaS B2B', 'E-Commerce', 'CleanTech', 'PropTech', 'LogiTech',
    'GameFi', 'Web3', 'DeepTech', 'Consumer', 'B2G',
];

const GEO_OPTIONS = [
    { id: 'Vietnam', desc: 'Thị trường nội địa' },
    { id: 'SEA', desc: 'Đông Nam Á' },
    { id: 'Singapore', desc: 'Hub tài chính' },
    { id: 'Global', desc: 'Không giới hạn' }
];

const REVENUE_OPTIONS = ['Pre-revenue', '$0–10K MRR', '$10–50K MRR', '$50K+ MRR', 'Profitable'];

// ─── AI MATCHES (Mock data) ───────────────────────────────────────
const AI_MATCHES = [
    {
        id: 'm1', name: 'SnapMoney', logo: '💸', vertical: 'FinTech', stage: 'Series A',
        ask: '$1M', score: 96, mrr: '$38K MRR', source: 'warm-intro',
        mentor: 'Nguyễn Tuấn', reason: 'Exact thesis match: P2P Lending + Vietnam + Series A',
    },
    {
        id: 'm2', name: 'EduPath AI', logo: '🎓', vertical: 'EdTech', stage: 'Seed',
        ask: '$500K', score: 88, mrr: '$12K MRR', source: 'ai-match',
        reason: 'High-growth EdTech, AI-first, aligns với Deep Tech filter',
    },
    {
        id: 'm3', name: 'AgriSense IoT', logo: '🌾', vertical: 'AgriTech', stage: 'Pre-Seed',
        ask: '$250K', score: 74, mrr: 'Pre-revenue', source: 'ai-match',
        reason: 'Early stage AgriTech, geography SEA, tech moat potential',
    },
];

const WIZARD_STEPS = [
    { id: 1, label: 'Target' },
    { id: 2, label: 'Financials' },
    { id: 3, label: 'Filters' },
    { id: 4, label: 'Preview' },
];

// ─── HELPERS ──────────────────────────────────────────────────────
const fmt$ = (v: number) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1_000).toFixed(0)}K`;

// ─── COMPONENT ────────────────────────────────────────────────────
export default function AIThesisSetup() {
    const [step, setStep] = useState<WizardStep>(1);
    const [saved, setSaved] = useState(false);
    const [thesis, setThesis] = useState<ThesisConfig>({
        stages: [],
        verticals: [],
        minCheckSize: 100_000,
        maxCheckSize: 500_000,
        geographies: [],
        minMatchScore: 80,
        revenueStages: [],
    });

    const toggle = (key: keyof ThesisConfig, val: string) => {
        setThesis(prev => {
            const arr = prev[key] as string[];
            return {
                ...prev,
                [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val],
            };
        });
    };

    // Calculate validation for steps
    const isStep1Valid = thesis.stages.length > 0 && thesis.verticals.length > 0;
    const isStep2Valid = thesis.revenueStages.length > 0;
    const isStep3Valid = thesis.geographies.length > 0;

    // Calculate "Sourcing Breadth" (Độ rộng của phễu)
    const calculateBreadth = () => {
        let score = 100;
        if (thesis.stages.length === 1) score -= 20;
        if (thesis.verticals.length === 1) score -= 30;
        if (thesis.geographies.includes('Vietnam') && thesis.geographies.length === 1) score -= 20;
        if (thesis.minMatchScore >= 90) score -= 20;
        return Math.max(10, score); // Min 10%
    };
    const breadthScore = calculateBreadth();

    // Range slider pct
    const pctMin = ((thesis.minCheckSize - 50_000) / (5_000_000 - 50_000)) * 100;
    const pctMax = ((thesis.maxCheckSize - 50_000) / (5_000_000 - 50_000)) * 100;

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-[#102c1e]">

            {/* ── HEADER ── */}
            <header className="px-10 pt-10 pb-6">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <div>
                        <p className="font-sans text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">
                            Wizard · Deal Flow
                        </p>
                        <h1 className="font-heading font-black text-[#102c1e] text-3xl">
                            AI Thesis Setup Wizard
                        </h1>
                        <p className="font-sans text-slate-500 text-sm mt-2">
                            Thiết lập khẩu vị đầu tư (Investment Thesis) để AI Radar tự động săn deal cho bạn.
                        </p>
                    </div>
                    {saved && (
                        <div className="flex items-center gap-2 bg-[#a1e2b6]/20 border border-[#a1e2b6]/50 text-[#102c1e] px-4 py-2 rounded-xl font-sans text-xs font-bold">
                            <Zap className="w-4 h-4" /> Radar Active
                        </div>
                    )}
                </div>
            </header>

            {/* ── MAIN LAYOUT (2 COLUMNS) ── */}
            <div className="max-w-[1400px] mx-auto px-10 pb-20 flex flex-col lg:flex-row gap-10 items-start">

                {/* LẼFT COLUMN: Wizard Content */}
                <div className="flex-1 w-full max-w-4xl">

                    {/* Horizontal Step Indicator */}
                    <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
                        {WIZARD_STEPS.map((s, idx) => (
                            <React.Fragment key={s.id}>
                                <div className="flex items-center gap-2 shrink-0">
                                    <div className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center font-sans text-[10px] font-black transition-all",
                                        step === s.id ? "bg-[#102c1e] text-white" :
                                            step > s.id ? "bg-[#102c1e]/10 text-[#102c1e]" : "bg-white border border-slate-200 text-slate-400"
                                    )}>
                                        {step > s.id ? <Check className="w-3.5 h-3.5" /> : s.id}
                                    </div>
                                    <span className={cn(
                                        "font-sans text-xs transition-colors",
                                        step === s.id ? "font-bold text-[#102c1e]" : "font-medium text-slate-400"
                                    )}>
                                        {s.label}
                                    </span>
                                </div>
                                {idx < WIZARD_STEPS.length - 1 && (
                                    <div className="w-12 h-px bg-slate-200 shrink-0 mx-2" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Step Content Area */}
                    <div className="min-h-[400px]">

                        {/* STEP 1: TARGET */}
                        {step === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <h3 className="font-heading text-xl font-bold text-[#102c1e] mb-4">Giai đoạn mục tiêu (Stage)</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {STAGE_OPTIONS.map(s => {
                                            const isActive = thesis.stages.includes(s.id);
                                            return (
                                                <button
                                                    key={s.id}
                                                    onClick={() => toggle('stages', s.id)}
                                                    className={cn(
                                                        "flex flex-col items-start p-4 rounded-xl border text-left transition-all",
                                                        isActive
                                                            ? "bg-[#102c1e]/5 border-[#102c1e] ring-1 ring-[#102c1e]"
                                                            : "bg-white border-slate-200 hover:border-[#102c1e]/30"
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between w-full mb-1">
                                                        <span className={cn("font-sans text-sm font-bold", isActive ? "text-[#102c1e]" : "text-slate-700")}>
                                                            {s.id}
                                                        </span>
                                                        <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", isActive ? "border-[#102c1e] bg-[#102c1e]" : "border-slate-300")}>
                                                            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                        </div>
                                                    </div>
                                                    <span className="font-sans text-xs text-slate-500">{s.desc}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-heading text-xl font-bold text-[#102c1e] mb-4">Lĩnh vực ưu tiên (Verticals)</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {VERTICAL_OPTIONS.map(v => {
                                            const isActive = thesis.verticals.includes(v);
                                            return (
                                                <button
                                                    key={v}
                                                    onClick={() => {
                                                        if (!isActive && thesis.verticals.length >= 5) return;
                                                        toggle('verticals', v);
                                                    }}
                                                    className={cn(
                                                        "px-4 py-2 rounded-lg font-sans text-xs font-bold transition-all border",
                                                        isActive
                                                            ? "bg-[#102c1e] text-white border-[#102c1e]"
                                                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                                                    )}
                                                >
                                                    {v}
                                                </button>
                                            )
                                        })}
                                    </div>
                                    <p className="font-sans text-xs text-slate-400 mt-3">Đã chọn {thesis.verticals.length}/5 (Tối đa 5 ngành lõi).</p>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: FINANCIALS */}
                        {step === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <h3 className="font-heading text-xl font-bold text-[#102c1e] mb-4">Check Size (Quy mô đầu tư)</h3>

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4">
                                            <p className="font-sans text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Từ (Min)</p>
                                            <p className="font-mono text-2xl font-black text-[#102c1e]">{fmt$(thesis.minCheckSize)}</p>
                                        </div>
                                        <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4">
                                            <p className="font-sans text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Đến (Max)</p>
                                            <p className="font-mono text-2xl font-black text-[#102c1e]">{fmt$(thesis.maxCheckSize)}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6 bg-white border border-slate-200 rounded-xl p-6">
                                        <div>
                                            <label className="font-sans text-xs font-bold text-slate-600 flex justify-between mb-3">
                                                <span>Min Check</span>
                                            </label>
                                            <input type="range"
                                                min={50_000} max={2_000_000} step={50_000}
                                                value={thesis.minCheckSize}
                                                onChange={e => setThesis(p => ({ ...p, minCheckSize: Math.min(Number(e.target.value), p.maxCheckSize - 100_000) }))}
                                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-slate-200"
                                                style={{ background: `linear-gradient(to right, #102c1e 0%, #102c1e ${pctMin}%, #e2e8f0 ${pctMin}%, #e2e8f0 100%)` }}
                                            />
                                        </div>
                                        <div>
                                            <label className="font-sans text-xs font-bold text-slate-600 flex justify-between mb-3">
                                                <span>Max Check</span>
                                            </label>
                                            <input type="range"
                                                min={100_000} max={5_000_000} step={100_000}
                                                value={thesis.maxCheckSize}
                                                onChange={e => setThesis(p => ({ ...p, maxCheckSize: Math.max(Number(e.target.value), p.minCheckSize + 100_000) }))}
                                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-slate-200"
                                                style={{ background: `linear-gradient(to right, #a1e2b6 0%, #a1e2b6 ${pctMax}%, #e2e8f0 ${pctMax}%, #e2e8f0 100%)` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-heading text-xl font-bold text-[#102c1e] mb-4">Giai đoạn doanh thu (Revenue)</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {REVENUE_OPTIONS.map(r => {
                                            const isActive = thesis.revenueStages.includes(r);
                                            return (
                                                <button
                                                    key={r}
                                                    onClick={() => toggle('revenueStages', r)}
                                                    className={cn(
                                                        "px-4 py-2 rounded-lg font-sans text-xs font-bold transition-all border",
                                                        isActive
                                                            ? "bg-[#102c1e] text-white border-[#102c1e]"
                                                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                                                    )}
                                                >
                                                    {r}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: FILTERS (Geo & Score) */}
                        {step === 3 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <h3 className="font-heading text-xl font-bold text-[#102c1e] mb-4">Địa lý (Geography)</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {GEO_OPTIONS.map(g => {
                                            const isActive = thesis.geographies.includes(g.id);
                                            return (
                                                <button
                                                    key={g.id}
                                                    onClick={() => toggle('geographies', g.id)}
                                                    className={cn(
                                                        "flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
                                                        isActive
                                                            ? "bg-[#102c1e]/5 border-[#102c1e] ring-1 ring-[#102c1e]"
                                                            : "bg-white border-slate-200 hover:border-[#102c1e]/30"
                                                    )}
                                                >
                                                    <div className={cn("w-8 h-8 flex items-center justify-center rounded-lg border", isActive ? "bg-white border-[#102c1e]/20 text-[#102c1e]" : "bg-slate-50 border-slate-200 text-slate-400")}>
                                                        {g.id === 'Global' ? <Globe className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                                    </div>
                                                    <div>
                                                        <p className={cn("font-sans text-sm font-bold", isActive ? "text-[#102c1e]" : "text-slate-700")}>{g.id}</p>
                                                        <p className="font-sans text-xs text-slate-500">{g.desc}</p>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-heading text-xl font-bold text-[#102c1e] mb-4">Độ khớp tối thiểu (AI Match Score)</h3>
                                    <p className="font-sans text-sm text-slate-500 mb-4">Chỉ hiển thị các dự án được AI chấm điểm từ ngưỡng này trở lên.</p>
                                    <div className="flex items-center gap-3">
                                        {[60, 70, 80, 90].map(score => (
                                            <button
                                                key={score}
                                                onClick={() => setThesis(p => ({ ...p, minMatchScore: score }))}
                                                className={cn(
                                                    "flex-1 py-4 rounded-xl font-mono font-black text-lg transition-all border",
                                                    thesis.minMatchScore === score
                                                        ? "bg-[#102c1e] text-white border-[#102c1e] shadow-md"
                                                        : "bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600"
                                                )}
                                            >
                                                {score}%+
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: PREVIEW */}
                        {step === 4 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="bg-[#102c1e]/5 border border-[#102c1e]/10 rounded-2xl p-5 flex items-start gap-4">
                                    <div className="p-3 bg-white rounded-xl shadow-sm border border-[#102c1e]/10">
                                        <Search className="w-6 h-6 text-[#102c1e]" />
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-bold text-[#102c1e] text-lg">AI Simulation Run</h3>
                                        <p className="font-sans text-sm text-slate-600 mt-1">
                                            Dựa trên thesis của bạn, AI đã quét cơ sở dữ liệu hiện tại và tìm thấy <strong>{AI_MATCHES.length} deals</strong> tiềm năng.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {AI_MATCHES.map(match => (
                                        <div key={match.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shrink-0">
                                                        {match.logo}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-heading font-bold text-[#102c1e] text-lg">{match.name}</h4>
                                                        <div className="flex gap-2 mt-1">
                                                            <span className="font-sans text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">{match.vertical}</span>
                                                            <span className="font-sans text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">{match.stage}</span>
                                                            {match.source === 'warm-intro' && (
                                                                <span className="font-sans text-[10px] font-bold bg-[#102c1e] text-white px-2 py-0.5 rounded-md">Warm Intro</span>
                                                            )}
                                                        </div>
                                                        <p className="font-sans text-sm text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                                                            " {match.reason} "
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#a1e2b6] font-mono font-black text-[#102c1e] text-sm">
                                                        {match.score}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between">
                        <button
                            onClick={() => setStep(Math.max(1, step - 1) as WizardStep)}
                            className={cn(
                                "flex items-center gap-2 font-sans text-sm font-bold transition-colors",
                                step === 1 ? "opacity-0 pointer-events-none" : "text-slate-500 hover:text-[#102c1e]"
                            )}
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>

                        {step < 4 ? (
                            <button
                                onClick={() => setStep(step + 1 as WizardStep)}
                                disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid)}
                                className="flex items-center gap-2 bg-[#102c1e] text-white font-sans text-sm font-bold px-8 py-3 rounded-xl hover:bg-[#0a1c13] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={() => setSaved(true)}
                                className={cn(
                                    "flex items-center gap-2 font-sans text-sm font-bold px-8 py-3 rounded-xl transition-all shadow-md",
                                    saved
                                        ? "bg-[#a1e2b6] text-[#102c1e]"
                                        : "bg-[#102c1e] text-white hover:bg-[#0a1c13]"
                                )}
                            >
                                {saved ? <><Check className="w-4 h-4" /> Active</> : "Confirm & Activate"}
                            </button>
                        )}
                    </div>

                </div>

                {/* RIGHT COLUMN: Readiness & Status (Sticky) */}
                <div className="w-full lg:w-80 shrink-0 space-y-6 lg:sticky lg:top-10">

                    {/* Readiness Checklist */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h4 className="font-heading font-bold text-[#102c1e] mb-4">Thesis Checklist</h4>
                        <div className="space-y-3">
                            {[
                                { id: 1, label: 'Stages selected', isValid: isStep1Valid },
                                { id: 2, label: 'Financial targets set', isValid: isStep2Valid },
                                { id: 3, label: 'Filters applied', isValid: isStep3Valid },
                            ].map(item => (
                                <div key={item.id} className="flex items-center gap-3">
                                    {item.isValid
                                        ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                        : <Circle className="w-5 h-5 text-slate-200 shrink-0" />
                                    }
                                    <span className={cn("font-sans text-sm", item.isValid ? "text-[#102c1e] font-medium" : "text-slate-400")}>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sourcing Power Health */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
                        <h4 className="font-heading font-bold text-[#102c1e] mb-2 w-full text-left">Sourcing Breadth</h4>
                        <p className="font-sans text-xs text-slate-500 w-full text-left mb-6">
                            Độ bao phủ của bộ lọc. Phần trăm càng cao, AI càng mang về nhiều deal.
                        </p>

                        <div className="relative w-32 h-32 mb-4">
                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                                <circle cx="50" cy="50" r="40" fill="none" stroke={breadthScore > 50 ? "#a1e2b6" : "#f59e0b"} strokeWidth="12"
                                    strokeLinecap="round" strokeDasharray={`${(breadthScore / 100) * 251.2} 251.2`}
                                    className="transition-all duration-700 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-mono text-3xl font-black text-[#102c1e]">{breadthScore}%</span>
                            </div>
                        </div>

                        {breadthScore < 50 && (
                            <div className="bg-amber-50 border border-amber-200 text-amber-700 px-3 py-2 rounded-lg font-sans text-xs text-left">
                                <span className="font-bold">Warning:</span> Bộ lọc đang quá hẹp, bạn có thể bỏ lỡ nhiều thương vụ tốt.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}