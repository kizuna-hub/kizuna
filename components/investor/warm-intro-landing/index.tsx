'use client';

import React, { useState } from 'react';
import {
    Shield, Star, Eye, ArrowRight, CheckCircle2, Lock,
    Sparkles, Users, TrendingUp, Building2, Globe, ExternalLink,
    Clock, ChevronRight, Zap, FileText, BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── MOCK DATA — simulate what the Magic Link carries ─────────────
const INTRO_DATA = {
    token: 'ki_mx7z9p_SnapMoney_CyberAgent',
    startup: {
        name: 'SnapMoney',
        tagline: 'P2P lending through social identity',
        logo: '💸',
        vertical: 'FinTech',
        stage: 'Series A',
        ask: '$1,000,000',
        country: 'Vietnam',
        founded: '2023',
        teamSize: 12,
        metrics: [
            { label: 'MRR', value: '$38K', trend: '+24%' },
            { label: 'Active Users', value: '45K', trend: '+18%' },
            { label: 'NPL Rate', value: '<2%', trend: 'Stable' },
        ],
        highlights: [
            'Thuật toán credit scoring độc quyền — không cần lịch sử tín dụng',
            'Đã triển khai tại 3 tỉnh thành, tốc độ tăng trưởng 24% MoM',
            'IP đã đăng ký & được bảo chứng bởi Mentor Tuấn (ex-Finhay CTO)',
        ],
        hasDataRoom: true,
    },
    mentor: {
        name: 'Nguyễn Tuấn',
        title: 'Ex-CTO at Finhay · Growth Advisor',
        avatar: 'NT',
        reputationScore: 73,
        successfulIntros: 9,
        endorsement: 'Tôi đã làm việc với team SnapMoney trong 8 tháng. Đây là startup hiếm hoi có cả moat kỹ thuật lẫn distribution lợi thế. Đặc biệt đáng xem xét ở giai đoạn này.',
    },
    vc: {
        name: 'CyberAgent Capital',
        email: 'partner@cyberagent.vc',
    },
    expiresAt: '2026-06-09T00:00:00Z',
    sentAt: '2026-06-02T10:00:00Z',
};

// ── SPARKLINE SVG ────────────────────────────────────────────────
function Sparkline({ data }: { data: number[] }) {
    const w = 80, h = 28;
    const max = Math.max(...data), min = Math.min(...data);
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / (max - min || 1)) * h;
        return `${x},${y}`;
    }).join(' ');
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
            <polyline points={pts} fill="none" stroke="#a1e2b6" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={w} cy={h - ((data[data.length - 1] - min) / (max - min || 1)) * h}
                r="3" fill="#a1e2b6" />
        </svg>
    );
}

// ── STEP INDICATOR ────────────────────────────────────────────────
function StepDot({ done, active, label }: { done?: boolean; active?: boolean; label: string }) {
    return (
        <div className="flex flex-col items-center gap-1.5">
            <div className={cn(
                'w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all',
                done ? 'bg-[#102c1e] border-[#102c1e]' :
                    active ? 'bg-white border-[#102c1e] shadow-[0_0_0_4px_rgba(16,44,30,0.08)]' :
                        'bg-white border-[#102c1e]/20'
            )}>
                {done
                    ? <CheckCircle2 className="w-4 h-4 text-white" />
                    : <div className={cn('w-2 h-2 rounded-full', active ? 'bg-[#102c1e]' : 'bg-[#102c1e]/20')} />
                }
            </div>
            <span className={cn('font-sans text-[9px] font-bold uppercase tracking-wider', active ? 'text-[#102c1e]' : 'text-slate-400')}>
                {label}
            </span>
        </div>
    );
}

// ── MAIN ─────────────────────────────────────────────────────────
export default function WarmIntroLanding() {
    const [accepted, setAccepted] = useState(false);
    const [step, setStep] = useState<'preview' | 'accepting' | 'done'>('preview');
    const d = INTRO_DATA;
    const daysLeft = 7;

    const handleAccept = () => {
        setStep('accepting');
        setTimeout(() => {
            setAccepted(true);
            setStep('done');
        }, 1400);
    };

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans relative overflow-hidden">

            {/* ── AMBIENT BACKGROUND ── */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#a1e2b6]/8 blur-3xl" />
                <div className="absolute -bottom-60 -left-20 w-[500px] h-[500px] rounded-full bg-[#102c1e]/4 blur-3xl" />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-[#102c1e]/8 to-transparent" />
            </div>

            <div className="relative max-w-2xl mx-auto px-4 py-16">

                {/* ── KIZUNA TRUST BADGE ── */}
                <div className="flex justify-center mb-10">
                    <div className="flex items-center gap-2.5 bg-white border border-[#102c1e]/10 rounded-full px-4 py-2 shadow-sm">
                        <div className="w-5 h-5 bg-[#102c1e] rounded-full flex items-center justify-center">
                            <span className="font-heading font-black text-[8px] text-white">K</span>
                        </div>
                        <span className="font-sans text-xs font-bold text-[#102c1e]">Kizuna Hub</span>
                        <div className="w-px h-3 bg-[#102c1e]/15" />
                        <Shield className="w-3.5 h-3.5 text-[#a1e2b6]" />
                        <span className="font-sans text-[10px] font-bold text-slate-500">Verified Warm Intro</span>
                    </div>
                </div>

                {/* ── STEP PROGRESS ── */}
                <div className="flex items-center justify-center gap-0 mb-12">
                    <StepDot done={step !== 'preview'} active={step === 'preview'} label="Preview" />
                    <div className={cn('h-px w-16 transition-colors', step !== 'preview' ? 'bg-[#102c1e]' : 'bg-[#102c1e]/15')} />
                    <StepDot done={step === 'done'} active={step === 'accepting'} label="Accept" />
                    <div className={cn('h-px w-16 transition-colors', step === 'done' ? 'bg-[#102c1e]' : 'bg-[#102c1e]/15')} />
                    <StepDot done={false} active={step === 'done'} label="Deal Flow" />
                </div>

                {step !== 'done' ? (
                    <>
                        {/* ── MENTOR ENDORSEMENT CARD ── */}
                        <div className="bg-[#102c1e] rounded-3xl p-6 mb-5 relative overflow-hidden">
                            {/* Texture */}
                            <div className="absolute inset-0 opacity-5 pointer-events-none"
                                style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #a1e2b6 0%, transparent 60%)' }} />

                            <div className="relative flex items-start gap-4">
                                {/* Avatar */}
                                <div className="w-12 h-12 rounded-2xl bg-[#a1e2b6]/20 border border-[#a1e2b6]/30 flex items-center justify-center shrink-0">
                                    <span className="font-sans font-black text-[#a1e2b6] text-sm">{d.mentor.avatar}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-sans font-black text-white text-sm">{d.mentor.name}</p>
                                        <span className="bg-[#a1e2b6]/15 border border-[#a1e2b6]/25 text-[#a1e2b6] font-sans text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                                            Rep. {d.mentor.reputationScore}/100
                                        </span>
                                    </div>
                                    <p className="font-sans text-[10px] text-white/50 mt-0.5">{d.mentor.title}</p>
                                    <p className="font-sans text-sm text-white/75 mt-3 leading-relaxed italic">
                                        "{d.mentor.endorsement}"
                                    </p>
                                    <div className="flex items-center gap-1 mt-3">
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-3 h-3" fill={i < 4 ? '#a1e2b6' : 'none'} stroke="#a1e2b6" />
                                            ))}
                                        </div>
                                        <span className="font-sans text-[10px] text-white/40 ml-1">{d.mentor.successfulIntros} successful intros</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── STARTUP CARD ── */}
                        <div className="bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm overflow-hidden mb-5">
                            {/* Header strip */}
                            <div className="h-1.5 bg-gradient-to-r from-[#102c1e] via-[#a1e2b6] to-[#102c1e]/30" />

                            <div className="p-6">
                                <div className="flex items-start justify-between gap-4 mb-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-[#102c1e]/5 border border-[#102c1e]/8 flex items-center justify-center text-3xl shadow-inner">
                                            {d.startup.logo}
                                        </div>
                                        <div>
                                            <h1 className="font-heading font-black text-[#102c1e] text-2xl tracking-tight">{d.startup.name}</h1>
                                            <p className="font-sans text-sm text-slate-500 mt-0.5">{d.startup.tagline}</p>
                                        </div>
                                    </div>
                                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                                        <span className="font-sans text-[10px] font-bold bg-[#a1e2b6]/20 border border-[#a1e2b6]/40 text-[#102c1e] px-3 py-1 rounded-full">
                                            {d.startup.stage}
                                        </span>
                                        <span className="font-sans text-[10px] font-bold text-slate-400">
                                            {d.startup.vertical}
                                        </span>
                                    </div>
                                </div>

                                {/* Metrics strip */}
                                <div className="grid grid-cols-3 gap-3 mb-5">
                                    {d.startup.metrics.map((m, i) => (
                                        <div key={i} className="bg-[#fafafa] rounded-2xl border border-[#102c1e]/6 p-3.5 hover:border-[#102c1e]/15 transition-colors">
                                            <p className="font-sans text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">{m.label}</p>
                                            <p className="font-mono font-black text-[#102c1e] text-lg">{m.value}</p>
                                            <p className="font-sans text-[10px] font-bold text-[#a1e2b6] mt-0.5">{m.trend}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Highlights */}
                                <div className="space-y-2.5 mb-5">
                                    {d.startup.highlights.map((h, i) => (
                                        <div key={i} className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-[#a1e2b6] shrink-0 mt-0.5" />
                                            <p className="font-sans text-sm text-slate-600 leading-relaxed">{h}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Tags row */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    {[d.startup.country, `Founded ${d.startup.founded}`, `${d.startup.teamSize} people`].map((t, i) => (
                                        <span key={i} className="flex items-center gap-1 bg-[#102c1e]/5 px-2.5 py-1 rounded-full font-sans text-[10px] font-bold text-[#102c1e]/60">
                                            {i === 0 && <Globe className="w-3 h-3" />}
                                            {i === 1 && <Clock className="w-3 h-3" />}
                                            {i === 2 && <Users className="w-3 h-3" />}
                                            {t}
                                        </span>
                                    ))}
                                    <span className="ml-auto font-sans text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                        <Lock className="w-3 h-3" />
                                        Ask: <span className="text-[#102c1e] font-black">{d.startup.ask}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ── DATA ROOM TEASER ── */}
                        <div className="rounded-3xl border border-dashed border-[#102c1e]/20 bg-white/60 backdrop-blur-sm p-5 mb-6 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-[#102c1e]/5 border border-[#102c1e]/10 flex items-center justify-center shrink-0">
                                <Lock className="w-5 h-5 text-[#102c1e]/40" />
                            </div>
                            <div className="flex-1">
                                <p className="font-sans font-black text-sm text-[#102c1e]">Secure Data Room</p>
                                <p className="font-sans text-xs text-slate-500 mt-0.5">
                                    Pitch deck đầy đủ, Financial model, Cap Table và IP Ledger sẽ được mở sau khi chấp nhận.
                                </p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                {[FileText, BarChart3, Users].map((Icon, i) => (
                                    <div key={i} className="w-7 h-7 rounded-lg bg-[#102c1e]/5 border border-[#102c1e]/8 flex items-center justify-center">
                                        <Icon className="w-3.5 h-3.5 text-[#102c1e]/30" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── CTA ── */}
                        <button
                            onClick={handleAccept}
                            disabled={step === 'accepting'}
                            className="w-full relative group overflow-hidden rounded-2xl bg-[#102c1e] text-white py-4 font-sans font-black text-base tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-70"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            {step === 'accepting' ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Đang thêm vào Deal Flow...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Zap className="w-4 h-4 text-[#a1e2b6]" />
                                    Chấp nhận & Mở Data Room
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>

                        {/* Expiry notice */}
                        <p className="text-center font-sans text-[10px] text-slate-400 mt-3">
                            Link này hết hạn sau <span className="font-bold text-[#102c1e]">{daysLeft} ngày</span> · Được bảo mật bởi Kizuna Hub
                        </p>
                    </>
                ) : (
                    /* ── SUCCESS STATE ── */
                    <div className="bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm p-10 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#102c1e] flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <CheckCircle2 className="w-8 h-8 text-[#a1e2b6]" />
                        </div>
                        <h2 className="font-heading font-black text-[#102c1e] text-2xl mb-2">Deal đã vào CRM!</h2>
                        <p className="font-sans text-slate-500 text-sm mb-2">
                            <strong className="text-[#102c1e]">SnapMoney</strong> đã được thêm vào cột <strong>Warm Intros</strong> trong Deal Flow CRM của bạn.
                        </p>
                        <p className="font-sans text-slate-400 text-sm mb-8">
                            Data Room đã được mở khoá. Mentor Tuấn đã nhận thông báo bạn đã xem xét giới thiệu này.
                        </p>
                        <div className="flex items-center gap-3 justify-center">
                            <a
                                href="/investor/deal-flow"
                                className="flex items-center gap-2 bg-[#102c1e] text-white font-sans font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#0a1c13] transition-colors shadow-md"
                            >
                                <ChevronRight className="w-4 h-4" />
                                Mở Deal Flow CRM
                            </a>
                            <button className="flex items-center gap-2 border border-[#102c1e]/10 text-[#102c1e] font-sans font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#102c1e]/5 transition-colors">
                                <ExternalLink className="w-4 h-4" />
                                Xem Data Room
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
