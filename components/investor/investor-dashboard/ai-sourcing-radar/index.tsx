'use client';

import React, { useState } from 'react';
import {
    Sparkles, Target, Building2, DollarSign, TrendingUp,
    ChevronRight, Check, Plus, X, ArrowRight, Zap, Globe,
    Sliders, BarChart3, RefreshCw, Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── TYPES ────────────────────────────────────────────────────────
type WizardStep = 1 | 2 | 3;

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
const STAGE_OPTIONS = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Growth'];
const VERTICAL_OPTIONS = [
    'FinTech', 'EdTech', 'HealthTech', 'AgriTech', 'AI / ML',
    'SaaS B2B', 'E-Commerce', 'CleanTech', 'PropTech', 'LogiTech',
    'GameFi', 'Web3', 'DeepTech', 'Consumer', 'B2G',
];
const GEO_OPTIONS = ['Vietnam', 'SEA', 'India', 'Singapore', 'Global'];
const REVENUE_OPTIONS = ['Pre-revenue', '$0–10K MRR', '$10–50K MRR', '$50K+ MRR', 'Profitable'];

// ─── AI MATCHES (mock for preview in step 3) ──────────────────────
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

// ─── PILL TOGGLE ──────────────────────────────────────────────────
function PillToggle({ label, active, onToggle }: { label: string; active: boolean; onToggle: () => void }) {
    return (
        <button
            onClick={onToggle}
            className={cn(
                'relative flex items-center gap-1.5 px-3 py-2 rounded-xl font-geist text-xs font-bold transition-all duration-200 border',
                active
                    ? 'bg-[#102c1e] text-white border-[#102c1e] shadow-md'
                    : 'bg-white text-slate-500 border-[#102c1e]/10 hover:border-[#102c1e]/30 hover:text-[#102c1e]'
            )}
        >
            {active && <Check className="w-3 h-3 text-[#a1e2b6] shrink-0" />}
            {label}
        </button>
    );
}

// ─── SCORE CIRCLE ─────────────────────────────────────────────────
function ScoreCircle({ score }: { score: number }) {
    const r = 16, c = 2 * Math.PI * r;
    const color = score >= 90 ? '#a1e2b6' : score >= 75 ? '#a1e2b6' : '#94a3b8';
    return (
        <div className="relative w-12 h-12 flex items-center justify-center">
            <svg viewBox="0 0 44 44" className="absolute inset-0 -rotate-90">
                <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeOpacity="0.15" strokeWidth="4" />
                <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="4"
                    strokeLinecap="round" strokeDasharray={`${(score / 100) * c} ${c}`} />
            </svg>
            <span className="font-mono text-[11px] font-black text-[#102c1e]">{score}</span>
        </div>
    );
}

// ─── STEP INDICATOR ───────────────────────────────────────────────
function Steps({ current }: { current: WizardStep }) {
    return (
        <div className="flex items-center justify-center gap-0">
            {([1, 2, 3] as WizardStep[]).map((s, i) => (
                <React.Fragment key={s}>
                    <div className="flex flex-col items-center gap-1.5">
                        <div className={cn(
                            'w-8 h-8 rounded-xl flex items-center justify-center font-geist font-black text-sm transition-all duration-300',
                            current === s ? 'bg-[#102c1e] text-white shadow-lg scale-110' :
                                current > s ? 'bg-[#a1e2b6]/20 border border-[#a1e2b6]/40 text-[#102c1e]' :
                                    'bg-white border border-[#102c1e]/15 text-slate-400'
                        )}>
                            {current > s ? <Check className="w-4 h-4" /> : s}
                        </div>
                        <span className={cn('font-geist text-[9px] font-bold uppercase tracking-wider',
                            current === s ? 'text-[#102c1e]' : 'text-slate-400')}>
                            {s === 1 ? 'Stage & Vertical' : s === 2 ? 'Check Size' : 'Preview'}
                        </span>
                    </div>
                    {i < 2 && (
                        <div className={cn('h-px w-16 mb-4 transition-colors', current > s ? 'bg-[#102c1e]' : 'bg-[#102c1e]/15')} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}

// ─── MAIN ─────────────────────────────────────────────────────────
export default function AIThesisSetup() {
    const [step, setStep] = useState<WizardStep>(1);
    const [saved, setSaved] = useState(false);
    const [thesis, setThesis] = useState<ThesisConfig>({
        stages: ['Series A'],
        verticals: ['FinTech', 'AI / ML'],
        minCheckSize: 200_000,
        maxCheckSize: 1_000_000,
        geographies: ['Vietnam', 'SEA'],
        minMatchScore: 80,
        revenueStages: ['$10–50K MRR', '$50K+ MRR'],
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

    const fmt$ = (v: number) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1_000).toFixed(0)}K`;
    const pctMin = ((thesis.minCheckSize - 50_000) / (5_000_000 - 50_000)) * 100;
    const pctMax = ((thesis.maxCheckSize - 50_000) / (5_000_000 - 50_000)) * 100;

    return (
        <div className="min-h-screen bg-[#fafafa] font-inter">

            {/* ── AMBIENT ── */}
            <div className="pointer-events-none fixed inset-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#a1e2b6]/6 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#102c1e]/4 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-3xl mx-auto px-6 py-16">

                {/* ── HERO HEADER ── */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 bg-[#102c1e] text-[#a1e2b6] px-4 py-2 rounded-full text-xs font-geist font-black mb-6 shadow-lg">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Sourcing Radar
                    </div>
                    <h1 className="font-outfit font-black text-[#102c1e] text-4xl md:text-5xl tracking-tight leading-tight mb-4">
                        Thiết lập<br />
                        <span className="relative">
                            Khẩu Vị Đầu Tư
                            <div className="absolute -bottom-1 left-0 right-0 h-1 bg-[#a1e2b6]/40 rounded-full" />
                        </span>
                    </h1>
                    <p className="font-inter text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
                        AI sẽ tự động lọc và đổ deal vào Inbound của bạn mỗi ngày dựa trên investment thesis này.
                    </p>
                </div>

                {/* ── STEPS ── */}
                <div className="mb-10">
                    <Steps current={step} />
                </div>

                {/* ── STEP 1: Stage & Vertical ── */}
                {step === 1 && (
                    <div className="bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm p-8 space-y-8">
                        <div>
                            <h2 className="font-outfit font-black text-[#102c1e] text-2xl mb-1">Giai đoạn đầu tư</h2>
                            <p className="font-inter text-sm text-slate-500">Chọn các giai đoạn bạn quan tâm. AI sẽ chỉ hiển thị deal phù hợp.</p>
                            <div className="flex flex-wrap gap-2 mt-5">
                                {STAGE_OPTIONS.map(s => (
                                    <PillToggle key={s} label={s}
                                        active={thesis.stages.includes(s)}
                                        onToggle={() => toggle('stages', s)} />
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-[#102c1e]/6" />

                        <div>
                            <h2 className="font-outfit font-black text-[#102c1e] text-2xl mb-1">Ngành / Vertical</h2>
                            <p className="font-inter text-sm text-slate-500">Tối đa 5 vertical — đây là input quan trọng nhất cho AI Match Score.</p>
                            <div className="flex flex-wrap gap-2 mt-5">
                                {VERTICAL_OPTIONS.map(v => (
                                    <PillToggle key={v} label={v}
                                        active={thesis.verticals.includes(v)}
                                        onToggle={() => {
                                            if (!thesis.verticals.includes(v) && thesis.verticals.length >= 5) return;
                                            toggle('verticals', v);
                                        }} />
                                ))}
                            </div>
                            <p className="font-geist text-[10px] text-slate-400 mt-2">{thesis.verticals.length}/5 đã chọn</p>
                        </div>

                        <div>
                            <h2 className="font-outfit font-black text-[#102c1e] text-xl mb-1">Địa lý</h2>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {GEO_OPTIONS.map(g => (
                                    <PillToggle key={g} label={g}
                                        active={thesis.geographies.includes(g)}
                                        onToggle={() => toggle('geographies', g)} />
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={() => setStep(2)}
                                disabled={thesis.stages.length === 0 || thesis.verticals.length === 0}
                                className="flex items-center gap-2 bg-[#102c1e] text-white font-geist font-black px-6 py-3 rounded-2xl hover:bg-[#0a1c13] transition-all shadow-md disabled:opacity-40 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                Tiếp theo <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* ── STEP 2: Check Size & Revenue ── */}
                {step === 2 && (
                    <div className="bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm p-8 space-y-8">
                        <div>
                            <h2 className="font-outfit font-black text-[#102c1e] text-2xl mb-1">Check Size</h2>
                            <p className="font-inter text-sm text-slate-500 mb-8">Phạm vi đầu tư mỗi deal bạn có thể cam kết.</p>

                            {/* Dual display */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-[#102c1e]/5 border border-[#102c1e]/8 rounded-xl px-4 py-2.5 text-center">
                                    <p className="font-geist text-[9px] font-bold text-slate-400 uppercase tracking-widest">Min</p>
                                    <p className="font-mono text-xl font-black text-[#102c1e]">{fmt$(thesis.minCheckSize)}</p>
                                </div>
                                <div className="text-slate-300 font-geist text-sm">—</div>
                                <div className="bg-[#102c1e] rounded-xl px-4 py-2.5 text-center shadow-md">
                                    <p className="font-geist text-[9px] font-bold text-white/50 uppercase tracking-widest">Max</p>
                                    <p className="font-mono text-xl font-black text-white">{fmt$(thesis.maxCheckSize)}</p>
                                </div>
                            </div>

                            {/* Range sliders */}
                            <div className="space-y-5">
                                <div>
                                    <label className="font-geist text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                                        Mức tối thiểu: <span className="text-[#102c1e]">{fmt$(thesis.minCheckSize)}</span>
                                    </label>
                                    <input type="range"
                                        min={50_000} max={2_000_000} step={50_000}
                                        value={thesis.minCheckSize}
                                        onChange={e => setThesis(p => ({ ...p, minCheckSize: Math.min(Number(e.target.value), p.maxCheckSize - 100_000) }))}
                                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                                        style={{ background: `linear-gradient(to right, #102c1e 0%, #102c1e ${pctMin}%, #e4e8ef ${pctMin}%, #e4e8ef 100%)` }}
                                    />
                                </div>
                                <div>
                                    <label className="font-geist text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                                        Mức tối đa: <span className="text-[#102c1e]">{fmt$(thesis.maxCheckSize)}</span>
                                    </label>
                                    <input type="range"
                                        min={100_000} max={5_000_000} step={100_000}
                                        value={thesis.maxCheckSize}
                                        onChange={e => setThesis(p => ({ ...p, maxCheckSize: Math.max(Number(e.target.value), p.minCheckSize + 100_000) }))}
                                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                                        style={{ background: `linear-gradient(to right, #a1e2b6 0%, #a1e2b6 ${pctMax}%, #e4e8ef ${pctMax}%, #e4e8ef 100%)` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-[#102c1e]/6" />

                        <div>
                            <h2 className="font-outfit font-black text-[#102c1e] text-xl mb-1">Giai đoạn Doanh thu</h2>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {REVENUE_OPTIONS.map(r => (
                                    <PillToggle key={r} label={r}
                                        active={thesis.revenueStages.includes(r)}
                                        onToggle={() => toggle('revenueStages', r)} />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="font-outfit font-black text-[#102c1e] text-xl mb-1">Ngưỡng AI Match Score</h2>
                            <p className="font-inter text-xs text-slate-500 mb-4">Chỉ hiển thị deal có AI score từ {thesis.minMatchScore}% trở lên.</p>
                            <div className="flex items-center gap-4">
                                {[60, 70, 80, 90].map(score => (
                                    <button
                                        key={score}
                                        onClick={() => setThesis(p => ({ ...p, minMatchScore: score }))}
                                        className={cn(
                                            'flex-1 py-3 rounded-2xl font-mono font-black text-sm transition-all border',
                                            thesis.minMatchScore === score
                                                ? 'bg-[#102c1e] text-white border-[#102c1e] shadow-md'
                                                : 'bg-white text-slate-400 border-[#102c1e]/10 hover:border-[#102c1e]/30'
                                        )}
                                    >
                                        {score}%+
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-400 hover:text-[#102c1e] font-geist font-bold text-sm transition-colors">
                                <ChevronRight className="w-4 h-4 rotate-180" /> Quay lại
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                className="flex items-center gap-2 bg-[#102c1e] text-white font-geist font-black px-6 py-3 rounded-2xl hover:bg-[#0a1c13] transition-all shadow-md hover:-translate-y-0.5"
                            >
                                Xem Preview AI <Sparkles className="w-4 h-4 text-[#a1e2b6]" />
                            </button>
                        </div>
                    </div>
                )}

                {/* ── STEP 3: Preview ── */}
                {step === 3 && (
                    <div className="space-y-5">
                        {/* Thesis summary card */}
                        <div className="bg-[#102c1e] rounded-3xl p-6 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-5 pointer-events-none"
                                style={{ backgroundImage: 'radial-gradient(ellipse at 80% 20%, #a1e2b6 0%, transparent 60%)' }} />
                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-outfit font-black text-white text-xl">Investment Thesis</h3>
                                    <button onClick={() => setStep(1)} className="font-geist text-[10px] font-bold text-white/40 hover:text-white/70 transition-colors flex items-center gap-1">
                                        <Sliders className="w-3 h-3" /> Chỉnh sửa
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: 'Stage', value: thesis.stages.join(', ') || '—' },
                                        { label: 'Check Size', value: `${fmt$(thesis.minCheckSize)} – ${fmt$(thesis.maxCheckSize)}` },
                                        { label: 'Verticals', value: thesis.verticals.slice(0, 3).join(', ') + (thesis.verticals.length > 3 ? ` +${thesis.verticals.length - 3}` : '') },
                                        { label: 'Min AI Score', value: `${thesis.minMatchScore}%+` },
                                        { label: 'Geography', value: thesis.geographies.join(', ') || '—' },
                                        { label: 'Revenue', value: thesis.revenueStages[0] || 'Any' },
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white/5 rounded-xl px-3 py-2">
                                            <p className="font-geist text-[9px] font-bold text-white/40 uppercase tracking-widest">{item.label}</p>
                                            <p className="font-geist text-xs font-bold text-white mt-0.5 truncate">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* AI matches preview */}
                        <div className="bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-[#102c1e]/5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 bg-[#a1e2b6]/15 border border-[#a1e2b6]/30 px-3 py-1.5 rounded-xl">
                                        <Sparkles className="w-3.5 h-3.5 text-[#102c1e]" />
                                        <span className="font-geist text-[10px] font-black text-[#102c1e]">AI đang quét {AI_MATCHES.length} deal phù hợp</span>
                                    </div>
                                </div>
                                <span className="font-geist text-[10px] text-slate-400 font-bold">Preview — cập nhật hàng ngày</span>
                            </div>

                            <div className="divide-y divide-[#102c1e]/5">
                                {AI_MATCHES.map(match => (
                                    <div key={match.id} className="px-6 py-4 flex items-center gap-4 hover:bg-[#fafafa] transition-colors group">
                                        <div className="w-11 h-11 rounded-2xl bg-[#102c1e]/5 border border-[#102c1e]/8 flex items-center justify-center text-2xl shrink-0">
                                            {match.logo}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <p className="font-geist font-black text-[#102c1e] text-sm">{match.name}</p>
                                                <span className="font-geist text-[9px] font-bold bg-[#102c1e]/5 text-[#102c1e]/60 px-2 py-0.5 rounded-full">{match.stage}</span>
                                                {match.source === 'warm-intro' && (
                                                    <span className="font-geist text-[9px] font-black bg-[#102c1e] text-white px-2 py-0.5 rounded-full">Warm Intro</span>
                                                )}
                                            </div>
                                            <p className="font-inter text-xs text-slate-500 truncate">{match.reason}</p>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className="text-right">
                                                <p className="font-mono text-xs font-bold text-[#102c1e]">{match.ask}</p>
                                                <p className="font-geist text-[9px] text-slate-400">{match.mrr}</p>
                                            </div>
                                            <ScoreCircle score={match.score} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Save CTA */}
                        <div className="flex items-center gap-3 justify-end">
                            <button onClick={() => setStep(2)} className="font-geist text-sm font-bold text-slate-400 hover:text-[#102c1e] transition-colors flex items-center gap-1">
                                <ChevronRight className="w-4 h-4 rotate-180" /> Quay lại
                            </button>
                            <button
                                onClick={() => setSaved(true)}
                                className={cn(
                                    'flex items-center gap-2 font-geist font-black text-sm px-6 py-3 rounded-2xl transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0',
                                    saved
                                        ? 'bg-[#a1e2b6]/20 border border-[#a1e2b6]/40 text-[#102c1e]'
                                        : 'bg-[#102c1e] text-white hover:bg-[#0a1c13]'
                                )}
                            >
                                {saved ? (
                                    <><Check className="w-4 h-4 text-[#102c1e]" /> Thesis đã lưu! AI Radar đang chạy</>
                                ) : (
                                    <><Zap className="w-4 h-4 text-[#a1e2b6]" /> Kích hoạt AI Radar</>
                                )}
                            </button>
                        </div>

                        {saved && (
                            <div className="bg-[#a1e2b6]/10 border border-[#a1e2b6]/30 rounded-2xl p-4 flex items-start gap-3">
                                <Check className="w-4 h-4 text-[#102c1e] mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-geist font-black text-sm text-[#102c1e]">AI Sourcing Radar đã kích hoạt</p>
                                    <p className="font-inter text-xs text-slate-600 mt-0.5">
                                        Deal mới phù hợp thesis sẽ tự động xuất hiện trong cột <strong>AI Matched</strong> của Deal Flow CRM.
                                        Bạn có thể chỉnh sửa thesis bất cứ lúc nào.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
