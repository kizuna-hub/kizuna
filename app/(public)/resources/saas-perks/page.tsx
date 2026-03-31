'use client';

import { useState, useMemo } from 'react';
import { Search, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import {
    SiNotion,
    SiLinear,
    SiStripe,
    SiFigma,
    SiGithub,
    SiDatadog,
    SiSlack,
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';

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
        icon: FaAws,
        scarcityTag: '🔥 HOT',
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
        icon: SiNotion,
        scarcityTag: null,
    },
    {
        id: 3,
        name: 'Linear Startup Plan',
        provider: 'Linear',
        value: '50% Off Annual',
        category: 'Dev Tools',
        description: 'Issue tracking and project management built for modern teams.',
        locked: false,
        brandColor: 'text-blue-400',
        icon: SiLinear,
        scarcityTag: null,
    },
    {
        id: 4,
        name: 'Stripe Atlas',
        provider: 'Stripe',
        value: '$20,000 Credits',
        category: 'Payments',
        description: 'Complete payment processing suite with startup-friendly pricing.',
        locked: true,
        brandColor: 'text-blue-600',
        icon: SiStripe,
        scarcityTag: '💎 Kizuna Exclusive',
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
        icon: SiFigma,
        scarcityTag: null,
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
        icon: SiGithub,
        scarcityTag: null,
    },
    {
        id: 7,
        name: 'Datadog Monitoring',
        provider: 'Datadog',
        value: '$5,000 Credits',
        category: 'Cloud',
        description: 'Application performance monitoring and observability platform.',
        locked: false,
        brandColor: 'text-purple-500',
        icon: SiDatadog,
        scarcityTag: null,
    },
    {
        id: 8,
        name: 'Slack Pro',
        provider: 'Slack',
        value: '50% Off 1 Year',
        category: 'Productivity',
        description: 'Team messaging and collaboration platform for remote teams.',
        locked: false,
        brandColor: 'text-cyan-400',
        icon: SiSlack,
        scarcityTag: null,
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
                {/* Glowing radial gradient blob */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl opacity-40 animate-pulse" />
                </div>

                <div className="relative z-10 max-w-3xl">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 text-balance tracking-tight">
                        Startup SaaS Perks
                    </h1>
                    <p className="text-lg text-zinc-300 text-balance mb-6">
                        Unlock over $250,000 in credits and discounts to scale your startup. Access premium tools and services at discounted rates.
                    </p>

                    {/* Social Proof Badge */}
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-zinc-900 flex items-center justify-center text-xs font-bold text-white">
                                A
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-zinc-900 flex items-center justify-center text-xs font-bold text-white">
                                B
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-zinc-900 flex items-center justify-center text-xs font-bold text-white">
                                C
                            </div>
                        </div>
                        <p className="text-sm text-zinc-300">
                            Trusted by <span className="font-semibold text-white">50+ verified startups</span> building on Kizuna Hub.
                        </p>
                    </div>
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
                            className="group relative bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(255,107,0,0.15)] hover:border-orange-500/50"
                        >
                            {/* Scarcity Tag */}
                            {perk.scarcityTag && (
                                <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-full text-xs font-bold text-orange-300">
                                    {perk.scarcityTag}
                                </div>
                            )}

                            {/* Header */}
                            <div className="flex items-start justify-between mb-4 pr-16">
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 rounded-xl bg-zinc-800/60 ${perk.brandColor}`}>
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

                            {/* Value Badge - EMERALD STYLING */}
                            <div className="mb-4">
                                <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                                    <span className="font-bold text-sm text-emerald-400">
                                        {perk.value}
                                    </span>
                                </div>
                            </div>

                            {/* Footer/CTA */}
                            <div>
                                {!perk.locked ? (
                                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group/btn">
                                        Claim Offer
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                ) : (
                                    <button className="w-full bg-transparent border border-zinc-700 text-zinc-400 hover:border-zinc-600 font-medium py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 cursor-not-allowed">
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
