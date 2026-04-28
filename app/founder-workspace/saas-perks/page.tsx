'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { LayoutGrid, Server, Zap, Megaphone, Scale, BrainCircuit, CheckCircle2, Headset } from 'lucide-react';

const categories = [
    { id: 'all', label: 'All', icon: LayoutGrid },
    { id: 'infrastructure', label: 'Infrastructure', icon: Server },
    { id: 'productivity', label: 'Productivity', icon: Zap },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'legal', label: 'Legal', icon: Scale },
    { id: 'ai-tools', label: 'AI Tools', icon: BrainCircuit },
];

const perks = [
    {
        id: 1,
        provider: 'AWS Activate',
        logo: 'AWS',
        category: 'infrastructure',
        title: '$10,000 Credits for 2 years',
        description: 'Dedicated startup support and architectural guidance.',
        badge: 'MVP Ready Only',
        claimed: false,
    },
    {
        id: 2,
        provider: 'Stripe',
        logo: 'STR',
        category: 'infrastructure',
        title: '$50,000 Volume Fee-Free',
        description: 'Process your first $50k without any Stripe processing fees.',
        badge: 'Incorporated Only',
        claimed: true,
    },
    {
        id: 3,
        provider: 'Notion',
        logo: 'NOT',
        category: 'productivity',
        title: '6 Months Free (Plus Plan)',
        description: 'Unlimited collaborative workspace for your entire startup team.',
        badge: 'All Members',
        claimed: false,
    },
    {
        id: 4,
        provider: 'HubSpot',
        logo: 'HUB',
        category: 'marketing',
        title: '30% Off First Year',
        description: 'Access the complete CRM and marketing suite at a steep discount.',
        badge: 'All Members',
        claimed: false,
    },
    {
        id: 5,
        provider: 'OpenAI',
        logo: 'OAI',
        category: 'ai-tools',
        title: '$2,500 API Credits',
        description: 'Scale your AI features with subsidized GPT-4 API usage.',
        badge: 'IP Verified Only',
        claimed: false,
    },
    {
        id: 6,
        provider: 'Clerky',
        logo: 'CLK',
        category: 'legal',
        title: 'Free Incorporation Review',
        description: 'Get your post-incorporation documents reviewed by top startup lawyers.',
        badge: 'US Entities Only',
        claimed: false,
    }
];

export default function SaaSPerksPage() {
    const [activeFilter, setActiveFilter] = useState('all');

    const filteredPerks = activeFilter === 'all' 
        ? perks 
        : perks.filter(p => p.category === activeFilter);

    return (
        <div className="px-8 py-8 max-w-7xl mx-auto space-y-8">
            
            {/* 1. Top Section: Header */}
            <div>
                <h1 className="text-2xl font-bold text-kizuna-text-main">
                    SaaS Perks & Benefits
                </h1>
                <p className="text-sm text-kizuna-text-muted mt-1">
                    Unlock exclusive discounts and credits to scale your startup's infrastructure.
                </p>
            </div>

            {/* Main Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Content */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* 2. Filter Bar (Category Pills) */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            const isActive = activeFilter === category.id;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveFilter(category.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                        isActive 
                                            ? 'bg-kizuna-primary text-white' 
                                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {category.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* 3. The Perk Rows (2-Column Brand Grid) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredPerks.map((perk) => (
                            <div key={perk.id} className="bg-white border border-kizuna-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                                
                                {/* Card Layout (Top) */}
                                <div className="flex items-start justify-between">
                                    <div className="w-12 h-12 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-center font-bold text-zinc-400 text-sm">
                                        {perk.logo}
                                    </div>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-600 uppercase tracking-wider border border-zinc-200">
                                        {perk.badge}
                                    </span>
                                </div>
                                
                                {/* Card Layout (Middle) */}
                                <div className="flex-1 mt-4">
                                    <h3 className="text-lg font-semibold text-kizuna-text-main">
                                        {perk.provider}
                                    </h3>
                                    <p className="text-2xl font-bold text-kizuna-primary mt-1">
                                        {perk.title}
                                    </p>
                                    <p className="text-sm text-kizuna-text-muted mt-2 mb-6">
                                        {perk.description}
                                    </p>
                                </div>
                                
                                {/* Card Layout (Bottom) */}
                                <div>
                                    {perk.claimed ? (
                                        <button className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-emerald-50 text-kizuna-primary cursor-default">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Claimed
                                        </button>
                                    ) : (
                                        <button className="w-full rounded-lg px-4 py-2 text-sm font-medium bg-kizuna-primary text-white">
                                            Claim Offer
                                        </button>
                                    )}
                                </div>

                            </div>
                        ))}
                        {filteredPerks.length === 0 && (
                            <div className="md:col-span-2 p-8 text-center text-kizuna-text-muted text-sm border-2 border-dashed border-kizuna-border rounded-2xl bg-white">
                                No perks found for this category.
                            </div>
                        )}
                    </div>

                </div>

                {/* Right Column: Sidebar Widgets */}
                <div className="lg:col-span-4 flex flex-col gap-6 sticky top-6">
                    
                    {/* Widget 1: Your Value Vault */}
                    <div className="bg-white border border-kizuna-border rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-kizuna-text-main">Your Value Vault</h2>
                        <p className="text-3xl font-bold text-kizuna-primary mt-2">$12,500</p>
                        <div className="flex justify-between items-center mt-1">
                            <p className="text-sm text-kizuna-text-muted">Claimed Value</p>
                            <p className="text-xs text-kizuna-text-muted">of $250,000+ Potential</p>
                        </div>
                        {/* Visual Progress Bar */}
                        <div className="w-full bg-zinc-100 rounded-full h-2 mt-4 overflow-hidden">
                            <div className="bg-kizuna-primary h-full rounded-full" style={{ width: '5%' }}></div>
                        </div>
                    </div>

                    {/* Widget 2: Kizuna Concierge */}
                    <div className="bg-kizuna-surface border border-kizuna-border rounded-2xl p-6">
                        <Headset className="w-6 h-6 text-kizuna-primary" />
                        <h3 className="text-md font-semibold text-kizuna-text-main mt-3">Need help claiming?</h3>
                        <p className="text-sm text-kizuna-text-muted mt-2">
                            Having trouble verifying your startup for AWS or Stripe? Our Partner Success team can fast-track your application.
                        </p>
                        <button className="w-full mt-4 px-4 py-2 rounded-lg text-sm font-medium border border-kizuna-border bg-white text-kizuna-text-main">
                            Contact Support
                        </button>
                    </div>

                    {/* Widget 3: Offer a Perk */}
                    <div className="border-2 border-dashed border-zinc-300 rounded-2xl p-6 bg-transparent text-center">
                        <p className="text-sm text-kizuna-text-muted mb-3">
                            Are you a service provider? Partner with Kizuna Hub.
                        </p>
                        <button className="text-sm font-medium text-kizuna-primary hover:underline">
                            Submit an Offer
                        </button>
                    </div>

                </div>

            </div>

        </div>
    );
}
