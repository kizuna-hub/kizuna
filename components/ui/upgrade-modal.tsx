'use client';

import React, { useState } from 'react';
import { X, Lock, Sparkles, ArrowRight, Check } from 'lucide-react';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    feature?: {
        title: string;
        description: string;
        targetTier: string;
    };
}

const TIER_HIGHLIGHTS = {
    angel: [
        'Deal Flow CRM đầy đủ',
        '20 AI-matched deals/tháng',
        'Due Diligence Terminal',
        'Warm Intro access',
        '5 Portfolio slots',
    ],
    vc_enterprise: [
        'AI-matched deals không giới hạn',
        'Pro-Rata Simulator',
        'Team Collaboration cho DD',
        'Portfolio không giới hạn',
        'Export báo cáo đầy đủ',
    ],
};

export function UpgradeModal({ isOpen, onClose, feature }: UpgradeModalProps) {
    if (!isOpen) return null;

    const isEnterprise = feature?.targetTier === 'vc_enterprise';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-overlay backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-2xl animate-in fade-in zoom-in-95 duration-200">

                {/* Ambient glow top */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary-muted to-transparent" />

                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-workspace-row-hover hover:text-foreground"
                    aria-label="Close"
                >
                    <X className="size-4" />
                </button>

                <div className="relative p-8">
                    {/* Icon */}
                    <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary-muted text-primary-text shadow-lg">
                        <Lock className="size-6" />
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                        <p className="mb-1 font-sans text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            {isEnterprise ? 'VC Enterprise' : 'Angel Investor'} — Yêu cầu nâng cấp
                        </p>
                        <h2 className="mb-2 font-heading text-2xl font-black leading-tight text-foreground">
                            {feature?.title ?? 'Tính năng cao cấp'}
                        </h2>
                        <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                            {feature?.description ?? 'Nâng cấp để mở khóa toàn bộ công cụ đầu tư chuyên nghiệp.'}
                        </p>
                    </div>

                    {/* Feature list */}
                    <div className="mb-6 space-y-2.5 rounded-2xl border border-border bg-muted p-4">
                        <p className="mb-3 font-sans text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            Bao gồm trong gói {isEnterprise ? 'VC Enterprise' : 'Angel'}
                        </p>
                        {(isEnterprise ? TIER_HIGHLIGHTS.vc_enterprise : TIER_HIGHLIGHTS.angel).map((item, i) => (
                            <div key={i} className="flex items-center gap-2.5">
                                <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary-muted">
                                    <Check className="size-2.5 text-primary-text" />
                                </div>
                                <span className="font-sans text-sm text-foreground">{item}</span>
                            </div>
                        ))}
                    </div>

                    {/* Pricing */}
                    <div className="mb-5 flex items-center justify-between rounded-2xl bg-primary-action px-5 py-3 text-[var(--color-on-primary)]">
                        <div>
                            <p className="font-sans text-xs font-bold opacity-60">Giá từ</p>
                            <p className="font-mono text-xl font-black">
                                ${isEnterprise ? '199' : '79'}<span className="text-sm font-bold opacity-50">/tháng</span>
                            </p>
                        </div>
                        <div className="rounded-xl border border-current/25 bg-background/10 px-3 py-1.5">
                            <span className="font-sans text-xs font-black">-20% nếu thanh toán năm</span>
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="space-y-2">
                        <a href="/pricing" className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-action py-3 font-sans text-sm font-black text-[var(--color-on-primary)] shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary-action-hover">
                            <Sparkles className="size-4" />
                            Xem gói & Nâng cấp
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                        <button
                            onClick={onClose}
                            className="w-full py-2 font-sans text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Để sau
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── PAYWALL HOOK ─────────────────────────────────────────────────
export function usePaywall() {
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        feature?: UpgradeModalProps['feature'];
    }>({ isOpen: false });

    const triggerPaywall = (feature?: UpgradeModalProps['feature']) => {
        setModalState({ isOpen: true, feature });
    };

    const closePaywall = () => {
        setModalState({ isOpen: false });
    };

    const PaywallModalElement = (
        <UpgradeModal
            isOpen={modalState.isOpen}
            onClose={closePaywall}
            feature={modalState.feature}
        />
    );

    return { triggerPaywall, PaywallModalElement };
}
