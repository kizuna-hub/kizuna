'use client';

import React, { useState } from 'react';
import { X, Lock, Sparkles, ArrowRight, Check, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

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
                className="absolute inset-0 bg-[#102c1e]/50 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Ambient glow top */}
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#a1e2b6]/20 to-transparent pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#102c1e]/5 flex items-center justify-center hover:bg-[#102c1e]/10 transition-colors z-10"
                >
                    <X className="w-4 h-4 text-[#102c1e]/50" />
                </button>

                <div className="relative p-8">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-[#102c1e] flex items-center justify-center mb-5 shadow-lg">
                        <Lock className="w-6 h-6 text-[#a1e2b6]" />
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                        <p className="font-geist text-[10px] font-bold text-[#102c1e]/40 uppercase tracking-widest mb-1">
                            {isEnterprise ? 'VC Enterprise' : 'Angel Investor'} — Yêu cầu nâng cấp
                        </p>
                        <h2 className="font-outfit font-black text-[#102c1e] text-2xl leading-tight mb-2">
                            {feature?.title ?? 'Tính năng cao cấp'}
                        </h2>
                        <p className="font-inter text-sm text-slate-500 leading-relaxed">
                            {feature?.description ?? 'Nâng cấp để mở khóa toàn bộ công cụ đầu tư chuyên nghiệp.'}
                        </p>
                    </div>

                    {/* Feature list */}
                    <div className="bg-[#fafafa] border border-[#102c1e]/8 rounded-2xl p-4 mb-6 space-y-2.5">
                        <p className="font-geist text-[10px] font-bold text-[#102c1e]/50 uppercase tracking-widest mb-3">
                            Bao gồm trong gói {isEnterprise ? 'VC Enterprise' : 'Angel'}
                        </p>
                        {(isEnterprise ? TIER_HIGHLIGHTS.vc_enterprise : TIER_HIGHLIGHTS.angel).map((item, i) => (
                            <div key={i} className="flex items-center gap-2.5">
                                <div className="w-4 h-4 rounded-full bg-[#a1e2b6]/25 flex items-center justify-center shrink-0">
                                    <Check className="w-2.5 h-2.5 text-[#102c1e]" />
                                </div>
                                <span className="font-inter text-sm text-[#102c1e]">{item}</span>
                            </div>
                        ))}
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center justify-between mb-5 bg-[#102c1e] rounded-2xl px-5 py-3">
                        <div>
                            <p className="font-geist text-xs text-white/50 font-bold">Giá từ</p>
                            <p className="font-mono font-black text-white text-xl">
                                ${isEnterprise ? '199' : '79'}<span className="text-white/40 text-sm font-bold">/tháng</span>
                            </p>
                        </div>
                        <div className="bg-[#a1e2b6]/15 border border-[#a1e2b6]/25 px-3 py-1.5 rounded-xl">
                            <span className="font-geist text-xs font-black text-[#a1e2b6]">-20% nếu thanh toán năm</span>
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="space-y-2">
                        <a href="/pricing" className="w-full flex items-center justify-center gap-2 bg-[#102c1e] text-white font-geist font-black text-sm py-3 rounded-2xl hover:bg-[#0a1c13] transition-all shadow-md hover:-translate-y-0.5 group">
                            <Sparkles className="w-4 h-4 text-[#a1e2b6]" />
                            Xem gói & Nâng cấp
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                        <button
                            onClick={onClose}
                            className="w-full font-geist text-sm font-bold text-slate-400 hover:text-[#102c1e] py-2 transition-colors"
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
