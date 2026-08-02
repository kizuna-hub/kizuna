'use client';

import React from 'react';
import { Lock, ArrowUpRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UPGRADE_PROMPTS } from './subscription-tiers';

interface PaywallGateProps {
    featureKey: keyof typeof UPGRADE_PROMPTS;
    isAllowed: boolean;
    children: React.ReactNode;
    /** Blur children instead of hiding completely */
    blur?: boolean;
    /** Override the default upgrade prompt */
    customPrompt?: {
        title: string;
        description: string;
        cta?: string;
    };
    onUpgrade?: () => void;
    className?: string;
}

/**
 * Wrapper component that gates content behind a subscription paywall.
 * Usage: wrap any component that requires a paid tier.
 * 
 * <PaywallGate featureKey="pro-rata-simulator" isAllowed={tier === 'vc_enterprise'}>
 *   <ProRataSimulator />
 * </PaywallGate>
 */
export function PaywallGate({
    featureKey,
    isAllowed,
    children,
    blur = false,
    customPrompt,
    onUpgrade,
    className,
}: PaywallGateProps) {
    if (isAllowed) return <>{children}</>;

    const prompt = customPrompt ?? UPGRADE_PROMPTS[featureKey];

    if (blur) {
        return (
            <div className={cn('relative', className)}>
                {/* Blurred content behind */}
                <div className="pointer-events-none select-none blur-sm opacity-40">
                    {children}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-2xl">
                    <PaywallCard prompt={prompt} onUpgrade={onUpgrade} />
                </div>
            </div>
        );
    }

    return (
        <div className={cn('flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-[#102c1e]/15 bg-white', className)}>
            <PaywallCard prompt={prompt} onUpgrade={onUpgrade} />
        </div>
    );
}

function PaywallCard({
    prompt,
    onUpgrade,
}: {
    prompt: typeof UPGRADE_PROMPTS[string];
    onUpgrade?: () => void;
}) {
    return (
        <div className="flex flex-col items-center text-center max-w-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#102c1e] flex items-center justify-center mb-4 shadow-lg">
                <Lock className="w-5 h-5 text-[#a1e2b6]" />
            </div>

            <h3 className="font-heading font-black text-[#102c1e] text-lg leading-tight mb-2">
                {prompt.title}
            </h3>
            <p className="font-sans text-sm text-slate-500 leading-relaxed mb-5">
                {prompt.description}
            </p>

            <button
                onClick={onUpgrade}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#102c1e] font-sans text-sm font-black text-white hover:bg-[#0a1c13] transition-all shadow-md group"
            >
                <Sparkles className="w-4 h-4 text-[#a1e2b6]" />
                Nâng cấp lên {prompt.targetTier.replace('_', ' ').toUpperCase()}
                <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
        </div>
    );
}

// ── Inline Paywall Badge (for showing locked indicators on UI elements) ──
export function PaywallBadge({ tier }: { tier: string }) {
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#102c1e]/5 border border-[#102c1e]/10 font-sans text-[9px] font-black text-[#102c1e]/50 uppercase tracking-wider">
            <Lock className="w-2.5 h-2.5" />
            {tier}
        </span>
    );
}
