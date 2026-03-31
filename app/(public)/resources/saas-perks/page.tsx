'use client';

import { useState, useMemo } from 'react';
import { Search, Lock, ArrowRight, Cloud, Zap, Code, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Data
const PERKS = [
    {
        id: 1,
        name: 'AWS Activate',
        provider: 'Amazon Web Services',
        value: '$10,000 Credits',
        category: 'Cloud',
        description: 'Get credits for compute, storage, and database services to power your startup.',
        locked: false,
        brandColor: 'text-orange-500',
        icon: Cloud,
    },
    {
        id: 2,
        name: 'Notion for Startups',
        provider: 'Notion',
        value: '12 Months Free',
        category: 'Productivity',
        description: 'All-in-one workspace for documentation, planning, and collaboration.',
        locked: false,
        brandColor: 'text-slate-300',
        icon: Zap,
    },
    {
        id: 3,
        name: 'Linear Startup Plan',
        provider: 'Linear',
        value: '50% Off Annual',
        category: 'Dev Tools',
        description: 'Issue tracking and project management built for modern teams.',
        locked: false,
        brandColor: 'text-blue-500',
        icon: Code,
    },
    {
        id: 4,
        name: 'Stripe Atlas',
        provider: 'Stripe',
        value: '$20,000 Credits',
        category: 'Payments',
        description: 'Complete payment processing suite with startup-friendly pricing.',
        locked: true,
        brandColor: 'text-purple-500',
        icon: TrendingUp,
    },
    {
        id: 5,
        name: 'Figma Design',
        provider: 'Figma',
        value: '6 Months Free',
        category: 'Design',
        description: 'Collaborative design tool for prototyping and UI/UX creation.',
        locked: false,
        brandColor: 'text-pink-500',
        icon: Zap,
    },
    {
        id: 6,
        name: 'GitHub Enterprise',
        provider: 'GitHub',
        value: '1 Year Free',
        category: 'Dev Tools',
        description: 'Advanced version control, CI/CD, and team collaboration features.',
        locked: true,
        brandColor: 'text-white',
        icon: Code,
    },
    {
        id: 7,
        name: 'Datadog Monitoring',
        provider: 'Datadog',
        value: '$5,000 Credits',
        category: 'Cloud',
        description: 'Application performance monitoring and observability platform.',
        locked: false,
        brandColor: 'text-purple-600',
        icon: Cloud,
    },
    {
        id: 8,
        name: 'Slack Pro',
        provider: 'Slack',
        value: '50% Off 1 Year',
        category: 'Productivity',
        description: 'Team messaging and collaboration platform for remote teams.',
        locked: false,
        brandColor: 'text-cyan-500',
        icon: Zap,
    },
];

const CATEGORIES = ['All', 'Cloud', 'Productivity', 'Dev Tools', 'Design', 'Payments'];

export default function SaaSPerksPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Filter perks based on search and category
    const filteredPerks = useMemo(() => {
        return PERKS.filter((perk) => {
            const matchesSearch = perk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                perk.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                perk.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = selectedCategory === 'All' || perk.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    return (
        <div className="w-full flex flex-col gap-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-white/5 px-8 py-16 md:px-12 md:py-20">
                {/* Glowing blob background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl opacity-30 animate-pulse" />
                </div>

                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">
                        Startup SaaS Perks
                    </h1>
                    <p className="text-lg text-zinc-300 text-balance">
                        Unlock over $250,000 in credits and discounts to scale your startup. Access premium tools and services at discounted rates.
                    </p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="sticky top-0 z-20 flex flex-col gap-4 bg-black/40 backdrop-blur-md border-b border-white/5 -mx-4 px-4 py-4 md:-mx-6 md:px-6">
                {/* Search Input */}
                <div className="flex items-center gap-2 bg-zinc-900/60 border border-white/10 rounded-lg px-4 py-2.5 transition-all duration-300 focus-within:border-orange-500/50">
                    <Search className="w-5 h-5 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search perks, providers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none"
                    />
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${selectedCategory === category
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Perk Cards Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
                {filteredPerks.map((perk) => {
                    const IconComponent = perk.icon;
                    return (
                        <motion.div
                            key={perk.id}
                            variants={cardVariants}
                            className="group bg-zinc-900/40 border border-white/5 backdrop-blur-sm rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-orange-500/20"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg bg-zinc-800 ${perk.brandColor}`}>
                                        <IconComponent className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">{perk.name}</h3>
                                        <p className="text-xs text-zinc-500">{perk.provider}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-zinc-400 mb-4">{perk.description}</p>

                            {/* Value Badge */}
                            <div className="mb-4">
                                <div className="inline-block bg-zinc-800 px-3 py-1.5 rounded-lg">
                                    <span className={`font-bold text-sm ${perk.brandColor}`}>
                                        {perk.value}
                                    </span>
                                </div>
                            </div>

                            {/* Footer/CTA */}
                            <div>
                                {!perk.locked ? (
                                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 group/btn">
                                        Claim Offer
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                ) : (
                                    <button className="w-full bg-transparent border border-zinc-700 text-zinc-400 hover:border-zinc-600 font-medium py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        Requires Verification
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Empty State */}
            {filteredPerks.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-zinc-400 text-lg">No perks found matching your search.</p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('All');
                        }}
                        className="mt-4 text-orange-500 hover:text-orange-400 font-medium transition-colors"
                    >
                        Clear filters
                    </button>
                </div>
            )}

            {/* Info Footer */}
            <div className="rounded-lg bg-zinc-900/40 border border-white/5 p-6 text-center">
                <p className="text-sm text-zinc-400">
                    💡 <span className="text-white font-medium">Pro Tip:</span> Combine multiple perks to maximize your startup's runway. Verify your project status to unlock exclusive offers.
                </p>
            </div>
        </div>
    );
}
