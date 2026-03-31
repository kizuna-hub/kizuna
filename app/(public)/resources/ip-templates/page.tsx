'use client';

import { motion, Variants } from 'framer-motion';
import {
    ShieldCheck,
    FileSignature,
    Scale,
    Shield,
    DownloadCloud,
    Upload,
    Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", damping: 12 }
    },
};

const templates = [
    {
        icon: FileSignature,
        title: 'Non-Disclosure Agreement (NDA)',
        badge: 'Essential',
        description:
            'A legally binding agreement to protect confidential information shared between parties. Ideal for early-stage discussions.',
        color: 'from-blue-600/20 to-blue-900/20',
    },
    {
        icon: Scale,
        title: 'Co-Founder Equity Agreement',
        badge: 'Advanced',
        description:
            'Define equity ownership, vesting schedules, and decision-making rights among co-founders.',
        color: 'from-purple-600/20 to-purple-900/20',
    },
    {
        icon: Shield,
        title: 'IP Assignment Agreement',
        badge: 'Essential',
        description:
            'Transfer intellectual property ownership from employees or contractors to your company.',
        color: 'from-orange-600/20 to-orange-900/20',
    },
    {
        icon: ShieldCheck,
        title: 'Trademark Application Basics',
        badge: 'Advanced',
        description:
            'Step-by-step guidance on protecting your startup&apos;s brand name and logo.',
        color: 'from-green-600/20 to-green-900/20',
    },
    {
        icon: FileSignature,
        title: 'Terms of Service & Privacy Policy',
        badge: 'Essential',
        description:
            'Comprehensive templates to ensure GDPR/CCPA compliance and user data protection.',
        color: 'from-red-600/20 to-red-900/20',
    },
];

export default function IPTemplatesPage() {
    return (
        <div className="w-full flex flex-col gap-8">
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="py-12 px-6 rounded-2xl bg-zinc-900/50 border border-zinc-800"
            >
                <div className="max-w-2xl">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        IP & Legal Resources
                    </h1>
                    <p className="text-lg text-zinc-300">
                        Protect your ideas, secure your assets, and build a legally sound
                        foundation for your startup.
                    </p>
                </div>
            </motion.section>

            {/* IP Protection Ledger Widget */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="border-2 border-dashed border-zinc-700 rounded-2xl p-8 bg-gradient-to-br from-zinc-900/30 to-zinc-800/20 backdrop-blur-sm hover:border-orange-500/40 transition-all duration-300"
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
                            <ShieldCheck className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                IP Timestamping Ledger{' '}
                                <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300">
                                    Beta
                                </span>
                            </h2>
                            <p className="text-zinc-400 mb-4">
                                Securely hash and timestamp your pitch deck or source code to
                                prove ownership without revealing the contents.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Drag and Drop Zone Mockup */}
                <div className="mt-6 border-2 border-dashed border-zinc-600 rounded-xl p-12 flex flex-col items-center justify-center gap-3 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors">
                    <Upload className="w-12 h-12 text-zinc-500" />
                    <p className="text-white font-semibold">Drag and drop your files here</p>
                    <p className="text-sm text-zinc-400">or</p>
                    <Button
                        variant="default"
                        className="bg-orange-600 hover:bg-orange-700 text-white mt-2"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload & Timestamp File
                    </Button>
                </div>
            </motion.section>

            {/* Legal Templates Grid */}
            <motion.section
                variants={container}
                initial="hidden"
                animate="show"
            >
                <h2 className="text-2xl font-bold text-white mb-6">Legal Templates</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {templates.map((template, idx) => {
                        const Icon = template.icon;
                        return (
                            <motion.div
                                key={idx}
                                variants={item}
                                className={`group p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10`}
                            >
                                {/* Top: Icon and Badge */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-2 rounded-lg bg-zinc-800/50 group-hover:bg-orange-500/10 transition-colors">
                                        <Icon className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <span className="text-xs px-2 py-1 rounded-full bg-zinc-800/70 text-zinc-300 font-medium">
                                        {template.badge}
                                    </span>
                                </div>

                                {/* Middle: Title and Description */}
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    {template.title}
                                </h3>
                                <p className="text-sm text-zinc-400 line-clamp-2">
                                    {template.description}
                                </p>

                                {/* Action: Download Button */}
                                <button className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-orange-400 hover:bg-orange-500/10 transition-colors group/btn">
                                    <DownloadCloud className="w-4 h-4" />
                                    <span>Download</span>
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.section>

            {/* IP Expert Banner */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-full bg-gradient-to-r from-zinc-900 to-orange-900/20 border border-orange-500/20 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
            >
                <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">
                            Need help filing a patent or trademark?
                        </h3>
                        <p className="text-sm text-zinc-400">
                            Consult with our verified IP experts to navigate the complex world
                            of intellectual property protection.
                        </p>
                    </div>
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white whitespace-nowrap">
                    Find an IP Mentor
                </Button>
            </motion.section>
        </div>
    );
}
