'use client';

import React, { useState } from 'react';
import {
    Check, X, Zap, Sparkles, ArrowRight, Shield, Crown,
    Rocket, TrendingUp, Users, BarChart3, Building2, Star,
    ChevronDown, ChevronUp, Infinity
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── TYPES ────────────────────────────────────────────────────────
type Persona = 'founder' | 'investor' | 'mentor';
type BillingCycle = 'monthly' | 'annual';

// ─── PLAN DATA ────────────────────────────────────────────────────
const FOUNDER_PLANS = [
    {
        id: 'starter',
        name: 'Starter',
        badge: null,
        monthlyPrice: 0,
        description: 'Bắt đầu hành trình khởi nghiệp. Miễn phí mãi mãi.',
        cta: 'Bắt đầu miễn phí',
        ctaVariant: 'outline',
        icon: Rocket,
        features: [
            { text: '3 sections Pitch Deck', included: true },
            { text: '5 tài liệu Data Room', included: true },
            { text: '1 Magic Link chia sẻ', included: true },
            { text: '1 yêu cầu Mentor/tháng', included: true },
            { text: 'Survival Clock', included: true },
            { text: 'Phân tích Data Room', included: false },
            { text: 'Hiển thị trên Investor CRM', included: false },
            { text: 'Stakeholder Studio', included: false },
            { text: 'Export metrics CSV', included: false },
        ],
    },
    {
        id: 'pro',
        name: 'Pro',
        badge: 'Phổ biến nhất',
        monthlyPrice: 29,
        description: 'Đầy đủ công cụ để chuẩn bị gọi vốn nghiêm túc.',
        cta: 'Nâng cấp lên Pro',
        ctaVariant: 'primary',
        icon: TrendingUp,
        features: [
            { text: '12 sections Pitch Deck', included: true },
            { text: '50 tài liệu Data Room', included: true },
            { text: '10 Magic Links chia sẻ', included: true },
            { text: '5 yêu cầu Mentor/tháng', included: true },
            { text: 'Survival Clock', included: true },
            { text: 'Phân tích Data Room realtime', included: true },
            { text: 'Hiển thị trên Investor CRM', included: true },
            { text: 'Stakeholder Studio', included: true },
            { text: 'Export metrics CSV', included: true },
        ],
    },
    {
        id: 'scale',
        name: 'Scale',
        badge: 'Power User',
        monthlyPrice: 99,
        description: 'Không giới hạn. Dành cho startup đã có traction.',
        cta: 'Nâng cấp lên Scale',
        ctaVariant: 'dark',
        icon: Crown,
        features: [
            { text: 'Pitch Deck không giới hạn', included: true },
            { text: 'Data Room không giới hạn', included: true },
            { text: 'Magic Links không giới hạn', included: true },
            { text: 'Mentor không giới hạn', included: true },
            { text: 'Survival Clock', included: true },
            { text: 'Phân tích Data Room realtime', included: true },
            { text: 'Hiển thị trên Investor CRM', included: true },
            { text: 'Stakeholder Studio', included: true },
            { text: 'Export metrics CSV', included: true },
        ],
    },
];

const INVESTOR_PLANS = [
    {
        id: 'angel',
        name: 'Angel',
        badge: null,
        monthlyPrice: 79,
        description: 'Dành cho Angel Investor cá nhân muốn deal flow có chất lượng.',
        cta: 'Bắt đầu dùng Angel',
        ctaVariant: 'outline',
        icon: Star,
        features: [
            { text: 'Deal Flow CRM', included: true },
            { text: '20 AI-matched deals/tháng', included: true },
            { text: 'Warm Intro Access', included: true },
            { text: 'Due Diligence Terminal', included: true },
            { text: 'Mở khóa 5 Data Rooms/tháng', included: true },
            { text: '5 Portfolio slots', included: true },
            { text: 'Pro-Rata Simulator', included: false },
            { text: 'Team Collaboration (DD)', included: false },
            { text: 'Export báo cáo', included: false },
        ],
    },
    {
        id: 'vc_enterprise',
        name: 'VC Enterprise',
        badge: 'Đề xuất cho Quỹ',
        monthlyPrice: 199,
        description: 'Full stack cho quỹ đầu tư chuyên nghiệp. Không giới hạn.',
        cta: 'Liên hệ Sales',
        ctaVariant: 'primary',
        icon: Building2,
        features: [
            { text: 'Deal Flow CRM', included: true },
            { text: 'AI-matched deals không giới hạn', included: true },
            { text: 'Warm Intro Access', included: true },
            { text: 'Due Diligence Terminal', included: true },
            { text: 'Data Rooms không giới hạn', included: true },
            { text: 'Portfolio không giới hạn', included: true },
            { text: 'Pro-Rata Simulator', included: true },
            { text: 'Team Collaboration (DD)', included: true },
            { text: 'Export báo cáo đầy đủ', included: true },
        ],
    },
];

// ─── COMPONENTS ───────────────────────────────────────────────────
function FeatureRow({ text, included }: { text: string; included: boolean }) {
    return (
        <div className="flex items-start gap-3 py-2">
            <div className={cn(
                'w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                included ? 'bg-[#a1e2b6]/20' : 'bg-slate-100'
            )}>
                {included
                    ? <Check className="w-2.5 h-2.5 text-[#102c1e]" />
                    : <X className="w-2.5 h-2.5 text-slate-300" />
                }
            </div>
            <span className={cn('font-sans text-sm', included ? 'text-[#102c1e]' : 'text-slate-400 line-through decoration-slate-200')}>
                {text}
            </span>
        </div>
    );
}

function PlanCard({ plan, billing, recommended = false }: {
    plan: typeof FOUNDER_PLANS[0];
    billing: BillingCycle;
    recommended?: boolean;
}) {
    const price = billing === 'annual'
        ? Math.round(plan.monthlyPrice * 0.8)
        : plan.monthlyPrice;
    const Icon = plan.icon;

    return (
        <div className={cn(
            'relative rounded-3xl border flex flex-col transition-all duration-300',
            recommended
                ? 'bg-[#102c1e] border-[#102c1e] shadow-2xl shadow-[#102c1e]/25 scale-[1.02] z-10'
                : 'bg-white border-[#102c1e]/10 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#102c1e]/25'
        )}>
            {/* Badge */}
            {plan.badge && (
                <div className={cn(
                    'absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full font-sans text-xs font-black uppercase tracking-widest whitespace-nowrap shadow-md',
                    recommended
                        ? 'bg-[#a1e2b6] text-[#102c1e]'
                        : 'bg-[#102c1e] text-white'
                )}>
                    {plan.badge}
                </div>
            )}

            <div className="p-7 flex flex-col h-full">
                {/* Header */}
                <div className="mb-6">
                    <div className={cn(
                        'w-10 h-10 rounded-2xl flex items-center justify-center mb-4 border',
                        recommended
                            ? 'bg-[#a1e2b6]/15 border-[#a1e2b6]/25'
                            : 'bg-[#102c1e]/5 border-[#102c1e]/8'
                    )}>
                        <Icon className={cn('w-5 h-5', recommended ? 'text-[#a1e2b6]' : 'text-[#102c1e]')} />
                    </div>
                    <h3 className={cn('font-heading font-black text-xl mb-1', recommended ? 'text-white' : 'text-[#102c1e]')}>
                        {plan.name}
                    </h3>
                    <p className={cn('font-sans text-sm leading-relaxed', recommended ? 'text-white/60' : 'text-slate-500')}>
                        {plan.description}
                    </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                    <div className="flex items-end gap-2">
                        <span className={cn('font-mono font-black', recommended ? 'text-white' : 'text-[#102c1e]',
                            price === 0 ? 'text-4xl' : 'text-5xl')}>
                            {price === 0 ? 'Free' : `$${price}`}
                        </span>
                        {price > 0 && (
                            <span className={cn('font-sans text-sm font-bold mb-1.5', recommended ? 'text-white/40' : 'text-slate-400')}>
                                / tháng
                            </span>
                        )}
                    </div>
                    {billing === 'annual' && plan.monthlyPrice > 0 && (
                        <p className={cn('font-sans text-xs font-bold mt-1', recommended ? 'text-[#a1e2b6]' : 'text-[#102c1e]/50')}>
                            Tiết kiệm 20% khi thanh toán năm
                        </p>
                    )}
                </div>

                {/* CTA */}
                <button className={cn(
                    'w-full py-3 rounded-2xl font-sans font-black text-sm transition-all mb-6 flex items-center justify-center gap-2',
                    recommended
                        ? 'bg-[#a1e2b6] text-[#102c1e] hover:bg-[#8fd4a4] shadow-md'
                        : plan.ctaVariant === 'outline'
                            ? 'border-2 border-[#102c1e]/20 text-[#102c1e] hover:border-[#102c1e]/50 hover:bg-[#102c1e]/5'
                            : 'bg-[#102c1e] text-white hover:bg-[#0a1c13] shadow-md'
                )}>
                    {plan.cta}
                    {plan.monthlyPrice > 0 && <ArrowRight className="w-4 h-4" />}
                </button>

                {/* Divider */}
                <div className={cn('h-px mb-5', recommended ? 'bg-white/10' : 'bg-[#102c1e]/6')} />

                {/* Features */}
                <div className="space-y-0.5 flex-1">
                    {plan.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-3 py-2">
                            <div className={cn(
                                'w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                                f.included
                                    ? recommended ? 'bg-[#a1e2b6]/20' : 'bg-[#a1e2b6]/20'
                                    : recommended ? 'bg-white/10' : 'bg-slate-100'
                            )}>
                                {f.included
                                    ? <Check className={cn('w-2.5 h-2.5', recommended ? 'text-[#a1e2b6]' : 'text-[#102c1e]')} />
                                    : <X className={cn('w-2.5 h-2.5', recommended ? 'text-white/30' : 'text-slate-300')} />
                                }
                            </div>
                            <span className={cn('font-sans text-sm',
                                f.included
                                    ? recommended ? 'text-white/90' : 'text-[#102c1e]'
                                    : recommended ? 'text-white/30 line-through decoration-white/20' : 'text-slate-400 line-through decoration-slate-200'
                            )}>
                                {f.text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── MAIN ─────────────────────────────────────────────────────────
export default function PricingPage() {
    const [persona, setPersona] = useState<Persona>('founder');
    const [billing, setBilling] = useState<BillingCycle>('monthly');
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const plans = persona === 'founder' ? FOUNDER_PLANS : INVESTOR_PLANS;
    const recommendedId = persona === 'founder' ? 'pro' : 'vc_enterprise';

    const FAQS = [
        {
            q: 'Tôi có thể đổi gói bất cứ lúc nào không?',
            a: 'Có. Bạn có thể nâng cấp hoặc hạ cấp ngay lập tức. Số tiền sẽ được tính theo tỉ lệ ngày còn lại trong tháng.'
        },
        {
            q: 'Kizuna Hub có hỗ trợ thanh toán qua ví điện tử không?',
            a: 'Hiện tại chúng tôi hỗ trợ Visa/Mastercard, MoMo, ZaloPay, và chuyển khoản ngân hàng cho gói Enterprise.'
        },
        {
            q: 'Dữ liệu của tôi có được bảo mật không?',
            a: 'Tất cả dữ liệu được mã hóa AES-256 at rest và TLS 1.3 in transit. Data Room có phân quyền chi tiết và audit log đầy đủ.'
        },
        {
            q: 'Mentor có cần trả phí không?',
            a: 'Không. Mentor hoàn toàn miễn phí trên Kizuna Hub. Chúng tôi giữ chân Mentor bằng Reputation System và Deal Credit, không phải fee.'
        },
    ];

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans">

            {/* ── AMBIENT BACKGROUND ── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#a1e2b6]/8 rounded-full blur-3xl -translate-y-1/2" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#102c1e]/5 rounded-full blur-3xl translate-y-1/3" />
            </div>

            <div className="relative max-w-6xl mx-auto px-6 py-20">

                {/* ── HERO ── */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-white border border-[#102c1e]/10 text-[#102c1e] px-4 py-2 rounded-full text-xs font-sans font-black mb-6 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-[#a1e2b6]" />
                        Transparent Pricing — No hidden fees
                    </div>
                    <h1 className="font-heading font-black text-[#102c1e] text-5xl md:text-6xl tracking-tight leading-none mb-5">
                        Chọn gói<br />
                        <span className="relative inline-block">
                            phù hợp với bạn
                            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 400 12" fill="none">
                                <path d="M0 8 Q200 0 400 8" stroke="#a1e2b6" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        </span>
                    </h1>
                    <p className="font-sans text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed">
                        Kizuna Hub hoạt động theo mô hình SaaS minh bạch. Mentor miễn phí mãi mãi. Founder & Investor trả theo tính năng.
                    </p>
                </div>

                {/* ── PERSONA SWITCHER ── */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {([
                        { id: 'founder', label: 'Cho Founder', icon: Rocket },
                        { id: 'investor', label: 'Cho Investor', icon: TrendingUp },
                        { id: 'mentor', label: 'Cho Mentor', icon: Star },
                    ] as const).map(p => (
                        <button
                            key={p.id}
                            onClick={() => setPersona(p.id)}
                            className={cn(
                                'flex items-center gap-2 px-5 py-2.5 rounded-2xl font-sans font-black text-sm transition-all',
                                persona === p.id
                                    ? 'bg-[#102c1e] text-white shadow-lg'
                                    : 'bg-white border border-[#102c1e]/10 text-slate-500 hover:text-[#102c1e] hover:border-[#102c1e]/25 shadow-sm'
                            )}
                        >
                            <p.icon className="w-4 h-4" />
                            {p.label}
                        </button>
                    ))}
                </div>

                {/* ── BILLING TOGGLE ── */}
                {persona !== 'mentor' && (
                    <div className="flex items-center justify-center gap-3 mb-12">
                        <span className={cn('font-sans text-sm font-bold', billing === 'monthly' ? 'text-[#102c1e]' : 'text-slate-400')}>
                            Hàng tháng
                        </span>
                        <button
                            onClick={() => setBilling(b => b === 'monthly' ? 'annual' : 'monthly')}
                            className={cn(
                                'relative w-12 h-6 rounded-full transition-colors duration-300',
                                billing === 'annual' ? 'bg-[#102c1e]' : 'bg-slate-200'
                            )}
                        >
                            <div className={cn(
                                'absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300',
                                billing === 'annual' ? 'translate-x-7' : 'translate-x-1'
                            )} />
                        </button>
                        <span className={cn('font-sans text-sm font-bold', billing === 'annual' ? 'text-[#102c1e]' : 'text-slate-400')}>
                            Hàng năm
                        </span>
                        {billing === 'annual' && (
                            <span className="font-sans text-xs font-black bg-[#a1e2b6]/20 border border-[#a1e2b6]/40 text-[#102c1e] px-2.5 py-1 rounded-full">
                                -20%
                            </span>
                        )}
                    </div>
                )}

                {/* ── MENTOR FREE BANNER ── */}
                {persona === 'mentor' && (
                    <div className="mb-12 bg-[#102c1e] rounded-3xl p-8 text-white relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: 'radial-gradient(ellipse at 80% 50%, #a1e2b6 0%, transparent 60%)' }} />
                        <div className="relative flex flex-col md:flex-row items-center gap-6">
                            <div className="w-16 h-16 rounded-3xl bg-[#a1e2b6]/15 border border-[#a1e2b6]/25 flex items-center justify-center shrink-0">
                                <Star className="w-8 h-8 text-[#a1e2b6]" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="font-heading font-black text-2xl text-white mb-1">Mentor — Hoàn toàn miễn phí</h2>
                                <p className="font-sans text-white/60 leading-relaxed">
                                    Kizuna Hub tin rằng Mentor không nên bị rào cản tài chính. Thay vào đó, chúng tôi giữ chân Mentor bằng{' '}
                                    <strong className="text-[#a1e2b6]">Reputation Score</strong>,{' '}
                                    <strong className="text-[#a1e2b6]">Deal Credit</strong> và{' '}
                                    <strong className="text-[#a1e2b6]">Co-Investment Rights</strong>.
                                </p>
                            </div>
                            <div className="shrink-0">
                                <button className="bg-[#a1e2b6] text-[#102c1e] font-sans font-black px-6 py-3 rounded-2xl hover:bg-[#8fd4a4] transition-all shadow-md flex items-center gap-2">
                                    Đăng ký làm Mentor <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Mentor tiers comparison */}
                        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                            {[
                                {
                                    name: 'Mentor Free', price: 'Free', badge: null,
                                    features: ['5 mentee slots', '3 FAST contracts', '5 warm intros/tháng', 'Intelligence View', 'Reputation Score', 'Deal Credit tracking'],
                                },
                                {
                                    name: 'Mentor Pro', price: 'Free — mở khóa khi Score ≥ 80', badge: 'Reputation Unlocked',
                                    features: ['Mentee slots không giới hạn', 'FAST contracts không giới hạn', 'Warm intros không giới hạn', 'Intelligence View', 'Reputation Score', 'VC Network Badge + Early Access'],
                                },
                            ].map((tier, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <p className="font-heading font-black text-white text-lg">{tier.name}</p>
                                            <p className="font-sans text-xs text-white/50 mt-0.5">{tier.price}</p>
                                        </div>
                                        {tier.badge && (
                                            <span className="font-sans text-[9px] font-black bg-[#a1e2b6]/20 text-[#a1e2b6] border border-[#a1e2b6]/30 px-2 py-0.5 rounded-full">
                                                {tier.badge}
                                            </span>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        {tier.features.map((f, j) => (
                                            <div key={j} className="flex items-center gap-2">
                                                <Check className="w-3.5 h-3.5 text-[#a1e2b6] shrink-0" />
                                                <span className="font-sans text-sm text-white/80">{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── PLAN CARDS ── */}
                {persona !== 'mentor' && (
                    <div className={cn(
                        'grid gap-6 items-start mb-20',
                        plans.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto'
                    )}>
                        {plans.map((plan) => (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                billing={billing}
                                recommended={plan.id === recommendedId}
                            />
                        ))}
                    </div>
                )}

                {/* ── TRUST SIGNALS ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
                    {[
                        { icon: Shield, label: 'Bảo mật AES-256', sub: 'Mã hóa end-to-end' },
                        { icon: Zap, label: 'Uptime 99.9%', sub: 'SLA đảm bảo' },
                        { icon: Users, label: '500+ Startup', sub: 'Đang dùng trên platform' },
                        { icon: Sparkles, label: 'AI-First', sub: 'Match Score tự động' },
                    ].map((item, i) => (
                        <div key={i} className="bg-white border border-[#102c1e]/8 rounded-2xl p-4 text-center shadow-sm">
                            <div className="w-8 h-8 rounded-xl bg-[#102c1e]/5 flex items-center justify-center mx-auto mb-2">
                                <item.icon className="w-4 h-4 text-[#102c1e]" />
                            </div>
                            <p className="font-sans font-black text-[#102c1e] text-sm">{item.label}</p>
                            <p className="font-sans text-xs text-slate-400 mt-0.5">{item.sub}</p>
                        </div>
                    ))}
                </div>

                {/* ── FAQ ── */}
                <div className="max-w-2xl mx-auto">
                    <h2 className="font-heading font-black text-[#102c1e] text-3xl text-center mb-8">Câu hỏi thường gặp</h2>
                    <div className="space-y-3">
                        {FAQS.map((faq, i) => (
                            <div key={i} className="bg-white border border-[#102c1e]/10 rounded-2xl overflow-hidden shadow-sm">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#fafafa] transition-colors"
                                >
                                    <span className="font-sans font-black text-[#102c1e] text-sm pr-4">{faq.q}</span>
                                    {openFaq === i
                                        ? <ChevronUp className="w-4 h-4 text-[#102c1e]/40 shrink-0" />
                                        : <ChevronDown className="w-4 h-4 text-[#102c1e]/40 shrink-0" />
                                    }
                                </button>
                                {openFaq === i && (
                                    <div className="px-6 pb-4 border-t border-[#102c1e]/5">
                                        <p className="font-sans text-sm text-slate-600 leading-relaxed pt-3">{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── BOTTOM CTA ── */}
                <div className="mt-20 text-center">
                    <div className="inline-block bg-white border border-[#102c1e]/10 rounded-3xl px-10 py-8 shadow-sm">
                        <p className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Không chắc nên chọn gói nào?</p>
                        <h3 className="font-heading font-black text-[#102c1e] text-2xl mb-3">Nói chuyện với team của chúng tôi</h3>
                        <p className="font-sans text-sm text-slate-500 mb-5 max-w-sm">
                            Demo 30 phút, không ràng buộc. Chúng tôi sẽ giúp bạn chọn gói phù hợp nhất.
                        </p>
                        <button className="bg-[#102c1e] text-white font-sans font-black px-6 py-3 rounded-2xl hover:bg-[#0a1c13] transition-all shadow-md flex items-center gap-2 mx-auto hover:-translate-y-0.5">
                            Đặt lịch demo <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
