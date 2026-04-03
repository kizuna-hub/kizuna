'use client';

import { useState } from 'react';
import {
    Settings,
    Search,
    ChevronDown,
    Building,
    MapPin,
    AlertCircle,
    TrendingUp,
    Sparkles,
    Eye,
    X,
    Briefcase,
    Zap,
    Users,
    Target,
    Activity,
    SlidersHorizontal,
    Globe,
    Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FaMoneyBill } from 'react-icons/fa';

// Mock deal flow projects
const dealFlowProjects = [
    {
        id: '1',
        name: 'TrendEngine',
        logo: '🎓',
        school: 'Da Nang University of Science and Technology',
        industry: 'AI / FashionTech',
        metrics: '+5,000 Monthly Scans, +25% MoM',
        ask: '$50K for 10% Equity',
        stage: 'MVP',
        description: 'AI-driven personalized learning path platform for STEM students.',
    },
    {
        id: '2',
        name: 'DUTCareers',
        logo: '🌾',
        school: 'Da Nang University of Science and Technology',
        industry: 'SaaS / EdTech',
        metrics: '10 B2B University Partnerships',
        ask: '$30K for 5% Equity',
        stage: 'Traction',
        description: 'Blockchain-based supply chain transparency for agricultural products.',
    },
    {
        id: '3',
        name: 'Unburden',
        logo: '🚚',
        school: 'Da Nang University of Science and Technology',
        industry: 'AI / HealthTech',
        metrics: '+1.5K Active Users, MVP Ready',
        ask: '$75K for 12% Equity',
        stage: 'Seed',
        description: 'Electric fleet management software optimizing urban last-mile delivery.',
    }
];

// Top Investors Mock
const topInvestors = [
    { id: 1, name: 'Alex Chen - AI/ML', logo: 'AC', count: 124 },
    { id: 2, name: 'Sarah Johnson - Growth', logo: 'SJ', count: 89 },
    { id: 3, name: 'Y-Combinator', logo: 'YC', count: 256 },
];

export default function PremiumInvestorDashboard() {
    const [selectedProject, setSelectedProject] = useState<any>(null);

    return (
        <div className="min-h-screen bg-zinc-950 text-white font-sans relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[orange-500]/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[orange-500]/10 blur-[150px] rounded-full pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 border-b border-white/10 bg-zinc-950/50 backdrop-blur-xl sticky top-0">
                <div className="px-8 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-900 border border-white/10 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                            <Target className="w-7 h-7 text-[orange-500]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
                                Kizuna Hub: Deal Flow
                            </h1>
                            <p className="text-zinc-400 text-sm">Premium VC Deal Sourcing & Intelligence</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full max-w-md">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search startups, industries..."
                                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/60 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 focus:shadow-[0_0_15px_rgba(249,115,22,0.2)] transition-all"
                            />
                        </div>
                        <Button className="bg-orange-600 hover:bg-orange-500 text-white font-bold flex items-center gap-2 h-11 px-5 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all">
                            <Settings className="w-5 h-5" />
                            Advanced Filter
                        </Button>
                    </div>
                </div>
            </header>

            <main className="relative z-10 px-8 py-8 flex gap-8 max-w-[1600px] mx-auto">

                {/* Left Sidebar - Advanced Filter Panel */}
                <div className="w-64 flex-shrink-0 space-y-6">
                    <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <SlidersHorizontal className="w-5 h-5 text-orange-500" />
                            Filters
                        </h3>

                        <div className="space-y-6">
                            {/* Industry Filter */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Industry / Vertical</label>
                                <div className="space-y-2">
                                    {['AI & ML', 'Web3 / Crypto', 'EdTech', 'FinTech', 'SaaS'].map(i => (
                                        <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-orange-500 focus:ring-orange-500 focus:ring-offset-zinc-950 transition-colors" />
                                            <span className="text-zinc-300 group-hover:text-white transition-colors">{i}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Stage Filter */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Stage</label>
                                <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all">
                                    <option>All Stages</option>
                                    <option>Pre-seed</option>
                                    <option>Seed</option>
                                    <option>Series A</option>
                                </select>
                            </div>

                            {/* Ask Slider */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Ask Size</label>
                                    <span className="text-xs font-bold text-orange-500">$0 - $1M+</span>
                                </div>
                                <input type="range" min="0" max="1000000" className="w-full accent-orange-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Content - Deal Flow Grid */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Zap className="w-5 h-5 text-orange-500" />
                            Active Deals ({dealFlowProjects.length})
                        </h2>
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                            Sort by: <span className="text-white cursor-pointer hover:text-orange-500 transition-colors">Match Score</span>
                        </div>
                    </div>

                    {/* ĐÃ FIX LỖI 2: Tăng khoảng cách Lưới bằng gap-6 và lg:gap-8, tăng mt-6 để cách xa tiêu đề */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-6">
                        {dealFlowProjects.map(project => (
                            <div
                                key={project.id}
                                className="bg-zinc-900 border border-zinc-800 hover:border-orange-500/40 hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)] transition-all duration-300 rounded-xl p-5 flex flex-col cursor-pointer group h-full"
                                onClick={() => setSelectedProject(project)}
                            >
                                <div className="flex justify-between items-start mb-4 relative">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-zinc-800 rounded-xl flex items-center justify-center text-3xl border border-white/5 shadow-inner">
                                            {project.logo}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-orange-500 transition-colors">{project.name}</h3>
                                            <div className="flex items-center gap-1 text-sm text-zinc-400 mt-1">
                                                <Building className="w-3.5 h-3.5" />
                                                <span>{project.school}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="absolute top-0 right-0 px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-wider rounded-full border border-white/10 shadow-sm">
                                        {project.stage}
                                    </span>
                                </div>

                                {/* The Traction Box */}
                                <div className="bg-zinc-950/50 rounded-lg p-3 my-4 border border-zinc-800 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                                    <span className="text-emerald-400 font-semibold text-sm">↗ {project.metrics.replace('Traction: ', '')}</span>
                                </div>

                                {/* ĐÃ FIX: Tăng pt-5 để "The Ask" có không gian thở với Traction Box */}
                                <div className="mt-4 pt-5 flex items-end justify-between gap-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">The Ask</span>
                                        <div className="text-xl font-extrabold text-white">
                                            {project.ask.split(' for ')[0]} <span className="text-sm font-medium text-zinc-400 font-normal">for {project.ask.split(' for ')[1] || project.ask}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="px-2 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded text-xs font-bold">
                                            {project.industry}
                                        </span>
                                    </div>
                                </div>

                                {/* ĐÃ FIX LỖI 1: Tăng mt-6 để giãn nút ra khỏi phần "The Ask" */}
                                <Button
                                    onClick={(e) => { e.stopPropagation(); setSelectedProject(project); }}
                                    className="w-full mt-6 bg-orange-600 hover:bg-orange-500 text-white font-semibold transition-colors"
                                >
                                    View Pitch Deck
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column - Widgets */}
                <div className="w-80 flex-shrink-0 space-y-6">
                    {/* Mạng lưới Kizuna Hub */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg relative overflow-hidden group hover:border-[orange-500]/30 transition-colors">
                        <div className="absolute inset-0 rounded-2xl border-2 border-transparent [background:linear-gradient(45deg,transparent,rgba(249,115,22,0.6),transparent)_border-box] [-webkit-mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)] [-webkit-mask-composite:destination-out] mask-composite:exclude pointer-events-none opacity-50"></div>
                        <div className="flex items-center gap-2 mb-4">
                            <Globe className="w-5 h-5 text-orange-500" />
                            <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider">Kizuna Network</h3>
                        </div>
                        <p className="text-sm text-zinc-400 relative z-10 mb-4 leading-relaxed">
                            Connect with validated top-tier founders from elite institutions across Vietnam.
                        </p>
                        <Button className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold transition-colors relative z-10 border-0">
                            Explore Network
                        </Button>
                    </div>

                    {/* Project of the month - Lột xác thành TrendEngine */}
                    <div className="bg-orange-500/5 border border-orange-500/30 hover:border-orange-500/60 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] transition-all duration-300 rounded-xl p-6 cursor-pointer relative overflow-hidden group">
                        {/* Lớp viền glow mờ */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-transparent [background:linear-gradient(45deg,transparent,rgba(249,115,22,0.6),transparent)_border-box] [-webkit-mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)] [-webkit-mask-composite:destination-out] mask-composite:exclude pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"></div>

                        <div className="flex items-center gap-2 mb-4 relative z-10">
                            <Sparkles className="w-5 h-5 text-orange-500 animate-pulse" />
                            <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider">Project of the Month</h3>
                        </div>

                        <div className="flex flex-col gap-3 mb-4 relative z-10">
                            <div className="flex items-center gap-3">
                                {/* Thay icon Robot thành icon sang trọng hơn (vd: Graduation Cap hoặc Shirt) */}
                                <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center text-2xl shadow-inner border border-zinc-800">
                                    🎓
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-white text-xl">TrendEngine</h4>
                                    <p className="text-xs font-semibold text-orange-400 mt-1">AI / FashionTech</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-zinc-300 mb-4 line-clamp-2 relative z-10 leading-relaxed">
                            AI-powered fashion trend analysis platform empowering Gen-Z designers with real-time data.
                        </p>

                        <div className="bg-zinc-950/50 rounded-lg p-3 border border-zinc-800 flex items-center justify-between relative z-10">
                            <span className="text-xs text-zinc-400 font-semibold uppercase">Traction</span>
                            <span className="text-sm font-bold text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]">+5,000 Scans</span>
                        </div>
                    </div>

                    {/* Top Investors / Mentors */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg relative">
                        <div className="flex items-center gap-2 mb-6">
                            <Star className="w-5 h-5 text-orange-500" />
                            <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider">Top Mentors</h3>
                        </div>
                        <div className="space-y-4">
                            {topInvestors.map(investor => (
                                <div key={investor.id} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center font-bold text-zinc-400 group-hover:text-[orange-500] group-hover:border-[orange-500]/50 transition-colors">
                                            {investor.logo}
                                        </div>
                                        <span className="font-medium text-zinc-200 group-hover:text-white transition-colors">{investor.name}</span>
                                    </div>
                                    <div className="bg-zinc-800 border border-zinc-700 px-3 py-1 rounded-full flex items-center gap-1.5">
                                        <Activity className="w-3 h-3 text-zinc-400" />
                                        <span className="text-sm font-bold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">{investor.count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Side-Over Panel */}
            {selectedProject && (
                <>
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                        onClick={() => setSelectedProject(null)}
                    />
                    <div className="fixed top-0 right-0 h-full w-[450px] bg-zinc-950 border-l border-zinc-800 shadow-[[-20px_0_50px_rgba(0,0,0,0.8)]] z-50 p-8 overflow-y-auto transform transition-transform duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <Badge className="bg-orange-500/20 text-orange-500 hover:bg-orange-500/30 border-none">Deck Overview</Badge>
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-black transition-colors border border-zinc-800"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="text-center mb-8">
                            <div className="w-24 h-24 mx-auto bg-zinc-900 rounded-2xl flex items-center justify-center text-5xl border border-zinc-800 shadow-[0_0_30px_rgba(249,115,22,0.1)] mb-4">
                                {selectedProject.logo}
                            </div>
                            <h2 className="text-3xl font-black text-zinc-100 mb-2">{selectedProject.name}</h2>
                            <p className="text-zinc-400">{selectedProject.description}</p>
                        </div>

                        <div className="space-y-6">
                            {/* Problem/Solution */}
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
                                <h4 className="text-orange-500 text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Target className="w-4 h-4" /> Problem & Solution
                                </h4>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    <strong className="text-zinc-100">Problem:</strong> Legacy systems create huge operational overhead and poor UX for growing Gen-Z base. <br /><br />
                                    <strong className="text-zinc-100">Solution:</strong> A unified, API-first architecture providing scalable infrastructure and pristine front-end integrations.
                                </p>
                            </div>

                            {/* Traction */}
                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-5 shadow-[0_0_20px_rgba(52,211,153,0.05)]">
                                <h4 className="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Activity className="w-4 h-4" /> Live Metrics
                                </h4>
                                <p className="text-emerald-50 font-medium">{selectedProject.metrics}</p>
                                <div className="mt-3 h-2 bg-black/50 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-400 w-[65%]" />
                                </div>
                            </div>

                            {/* Ask Details */}
                            <div className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-5 shadow-[0_0_20px_rgba(249,115,22,0.05)]">
                                <h4 className="text-orange-500 text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4" /> The Ask
                                </h4>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-black text-zinc-100">{selectedProject.ask.split(' for ')[0]}</span>
                                    <span className="text-zinc-400 font-medium mb-1">for {selectedProject.ask.split(' for ')[1] || selectedProject.ask}</span>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
                                        <p className="text-xs text-zinc-500 mb-1">Valuation</p>
                                        <p className="text-sm font-bold text-zinc-100">$1.2M Pre</p>
                                    </div>
                                    <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
                                        <p className="text-xs text-zinc-500 mb-1">Closing</p>
                                        <p className="text-sm font-bold text-zinc-100">Next 30 Days</p>
                                    </div>
                                </div>
                            </div>

                            <Button className="w-full h-12 text-lg font-bold bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all mt-6">
                                Request Full Data Room
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}