'use client';

import { useState } from 'react';
import {
    Settings,
    Search,
    Building,
    TrendingUp,
    Target,
    Activity,
    SlidersHorizontal,
    Globe,
    Star,
    X,
    Briefcase,
    ShieldCheck,
    ArrowUpRight,
    Filter,
    BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock deal flow projects
const dealFlowProjects = [
    {
        id: '1',
        name: 'TrendEngine',
        logo: '🎓',
        school: 'Da Nang University of Science and Technology',
        industry: 'AI / FashionTech',
        metrics: '+5,000 Monthly Scans',
        ask: '$50K for 10% Equity',
        stage: 'MVP',
        description: 'AI-driven personalized learning path platform for STEM students.',
        aiMatchScore: 94,
        ipSecured: true,
    },
    {
        id: '2',
        name: 'DUTCareers',
        logo: '🌾',
        school: 'Da Nang University of Science and Technology',
        industry: 'SaaS / EdTech',
        metrics: '10 B2B Partnerships',
        ask: '$30K for 5% Equity',
        stage: 'Traction',
        description: 'Blockchain-based supply chain transparency for agricultural products.',
        aiMatchScore: 88,
        ipSecured: false,
    },
    {
        id: '3',
        name: 'Unburden',
        logo: '🚚',
        school: 'Da Nang University of Science and Technology',
        industry: 'AI / HealthTech',
        metrics: '+1.5K Active Users',
        ask: '$75K for 12% Equity',
        stage: 'Seed',
        description: 'Electric fleet management software optimizing urban last-mile delivery.',
        aiMatchScore: 92,
        ipSecured: true,
    }
];

export default function PremiumInvestorDashboard() {
    const [selectedProject, setSelectedProject] = useState<any>(null);

    return (
        <div className="min-h-screen bg-kizuna-surface text-kizuna-text-main font-sans relative">
            {/* Header */}
            <header className="relative z-10 border-b border-kizuna-border bg-white sticky top-0 shadow-sm">
                <div className="px-8 py-4 flex items-center justify-between max-w-[1600px] mx-auto">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-kizuna-primary rounded-lg flex items-center justify-center shadow-sm">
                            <Target className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-kizuna-text-main tracking-tight">
                                Kizuna Hub
                            </h1>
                            <p className="text-kizuna-text-muted text-xs font-medium">VC Deal Flow Room</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full max-w-md">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-kizuna-text-muted" />
                            <input
                                type="text"
                                placeholder="Search startups, industries..."
                                className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-kizuna-border rounded-lg text-sm text-kizuna-text-main placeholder-kizuna-text-muted focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all shadow-sm"
                            />
                        </div>
                        <Button className="bg-white border border-kizuna-border text-kizuna-text-main hover:bg-zinc-50 font-semibold flex items-center gap-2 h-9 px-4 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-kizuna-primary/20">
                            <Settings className="w-4 h-4" />
                            <span className="text-sm">Manage</span>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="relative z-10 px-8 py-8 flex gap-8 max-w-[1600px] mx-auto">
                {/* Left Sidebar - Advanced Filter Panel */}
                <div className="w-64 flex-shrink-0 space-y-6">
                    <div className="bg-white border border-kizuna-border rounded-xl p-5 shadow-sm">
                        <h3 className="text-sm font-bold text-kizuna-text-main mb-5 flex items-center gap-2">
                            <Filter className="w-4 h-4 text-kizuna-primary" />
                            Filters
                        </h3>

                        <div className="space-y-6">
                            {/* Industry Filter */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-kizuna-text-muted uppercase tracking-wider">Industry</label>
                                <div className="space-y-2">
                                    {['AI & ML', 'Web3 / Crypto', 'EdTech', 'FinTech', 'SaaS'].map(i => (
                                        <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-4 h-4 rounded border-kizuna-border text-kizuna-primary focus:ring-kizuna-primary transition-colors cursor-pointer" />
                                            <span className="text-sm text-kizuna-text-main group-hover:text-kizuna-primary transition-colors font-medium">{i}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Stage Filter */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-kizuna-text-muted uppercase tracking-wider">Investable Stage</label>
                                <select className="w-full bg-white border border-kizuna-border rounded-lg px-3 py-2 text-sm text-kizuna-text-main font-medium focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all shadow-sm cursor-pointer">
                                    <option>All Stages</option>
                                    <option>Pre-seed</option>
                                    <option>Seed</option>
                                    <option>Series A</option>
                                </select>
                            </div>

                            {/* Ask Slider */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-kizuna-text-muted uppercase tracking-wider">Ask Size</label>
                                    <span className="text-xs font-bold text-kizuna-primary">$0 - $1M+</span>
                                </div>
                                <input type="range" min="0" max="1000000" className="w-full accent-kizuna-primary cursor-pointer" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Content - Metric Ribbon & Deal List */}
                <div className="flex-1 space-y-6">
                    {/* Metric Ribbon */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl border border-kizuna-border p-4 shadow-sm flex flex-col justify-between">
                            <span className="text-xs font-bold text-kizuna-text-muted uppercase tracking-wider mb-2">Active Deals</span>
                            <div className="text-2xl font-black text-kizuna-text-main">24</div>
                        </div>
                        <div className="bg-white rounded-xl border border-kizuna-border p-4 shadow-sm flex flex-col justify-between">
                            <span className="text-xs font-bold text-kizuna-text-muted uppercase tracking-wider mb-2">Ask Volume</span>
                            <div className="text-2xl font-black text-kizuna-text-main">$4.2M</div>
                        </div>
                        <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-4 shadow-sm flex flex-col justify-between">
                            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">AI Recommended</span>
                            <div className="text-2xl font-black text-emerald-600">12</div>
                        </div>
                        <div className="bg-white rounded-xl border border-kizuna-border p-4 shadow-sm flex flex-col justify-between">
                            <span className="text-xs font-bold text-kizuna-text-muted uppercase tracking-wider mb-2">IP Secured</span>
                            <div className="text-2xl font-black text-kizuna-text-main">8</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <h2 className="text-lg font-bold text-kizuna-text-main flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-kizuna-primary" />
                            Live Deal Feed
                        </h2>
                        <div className="flex items-center gap-2 text-kizuna-text-muted text-sm font-medium">
                            Sort by: <span className="text-kizuna-primary cursor-pointer hover:underline">Match Score</span>
                        </div>
                    </div>

                    {/* Deal List / Advanced Table */}
                    <div className="bg-white rounded-xl border border-kizuna-border shadow-sm overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 bg-zinc-50 border-b border-kizuna-border py-3 px-6 text-xs font-bold text-kizuna-text-muted uppercase tracking-wider">
                            <div className="col-span-4">Startup</div>
                            <div className="col-span-3">Traction</div>
                            <div className="col-span-2">The Ask</div>
                            <div className="col-span-2 text-center">Indicators</div>
                            <div className="col-span-1 text-right">Action</div>
                        </div>

                        {/* Table Rows */}
                        <div className="divide-y divide-kizuna-border">
                            {dealFlowProjects.map(project => (
                                <div
                                    key={project.id}
                                    className="grid grid-cols-12 gap-4 items-center p-4 px-6 hover:bg-zinc-50 transition-colors cursor-pointer group"
                                    onClick={() => setSelectedProject(project)}
                                >
                                    {/* Startup Column */}
                                    <div className="col-span-4 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl border border-kizuna-border shadow-sm shrink-0">
                                            {project.logo}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold text-kizuna-text-main truncate">{project.name}</h3>
                                            <div className="flex items-center gap-1.5 text-xs text-kizuna-text-muted mt-0.5">
                                                <span className="truncate">{project.industry}</span>
                                                <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                                                <span>{project.stage}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Traction Column */}
                                    <div className="col-span-3 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-kizuna-primary" />
                                        <span className="text-sm font-semibold text-kizuna-text-main truncate">{project.metrics}</span>
                                    </div>

                                    {/* The Ask Column */}
                                    <div className="col-span-2 flex flex-col justify-center">
                                        <span className="text-sm font-black text-kizuna-text-main">{project.ask.split(' for ')[0]}</span>
                                        <span className="text-xs font-medium text-kizuna-text-muted">for {project.ask.split(' for ')[1] || project.ask}</span>
                                    </div>

                                    {/* Indicators Column (Badges) */}
                                    <div className="col-span-2 flex items-center justify-center gap-2">
                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold px-2 py-0.5 whitespace-nowrap">
                                            {project.aiMatchScore}% Match
                                        </Badge>
                                        {project.ipSecured && (
                                            <div className="w-6 h-6 rounded-md bg-zinc-100 flex items-center justify-center border border-zinc-200" title="IP Secured">
                                                <ShieldCheck className="w-3.5 h-3.5 text-kizuna-primary" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Column */}
                                    <div className="col-span-1 flex justify-end">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => { e.stopPropagation(); setSelectedProject(project); }}
                                            className="border-kizuna-border text-kizuna-text-main hover:bg-zinc-100 group-hover:border-zinc-300 font-semibold h-8 px-3"
                                        >
                                            View
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Detail Drawer Sidebar */}
            {selectedProject && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
                        onClick={() => setSelectedProject(null)}
                    />
                    
                    {/* Drawer */}
                    <div className="fixed top-0 right-0 h-full w-[450px] bg-white shadow-2xl z-50 p-8 overflow-y-auto transform transition-transform duration-300 flex flex-col border-l border-zinc-200">
                        <div className="flex items-center justify-between mb-8 shrink-0">
                            <Badge variant="outline" className="bg-zinc-50 text-kizuna-text-muted border-kizuna-border font-semibold">Quick View</Badge>
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-kizuna-text-muted hover:bg-zinc-100 hover:text-kizuna-text-main transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="text-center mb-8 shrink-0">
                            <div className="w-20 h-20 mx-auto bg-zinc-50 rounded-2xl flex items-center justify-center text-4xl border border-kizuna-border shadow-sm mb-4">
                                {selectedProject.logo}
                            </div>
                            <h2 className="text-2xl font-black text-kizuna-text-main mb-1">{selectedProject.name}</h2>
                            <div className="flex items-center justify-center gap-2 text-sm text-kizuna-text-muted font-medium mb-3">
                                <span>{selectedProject.industry}</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                                <span>{selectedProject.stage}</span>
                            </div>
                            <p className="text-kizuna-text-muted text-sm leading-relaxed max-w-sm mx-auto">{selectedProject.description}</p>
                        </div>

                        <div className="space-y-6 flex-1">
                            {/* Problem/Solution */}
                            <div className="bg-zinc-50 border border-kizuna-border rounded-xl p-5 shadow-sm">
                                <h4 className="text-kizuna-text-main text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-kizuna-primary" /> Problem & Solution
                                </h4>
                                <p className="text-kizuna-text-muted text-sm leading-relaxed">
                                    <strong className="text-kizuna-text-main">Problem:</strong> Legacy systems create huge operational overhead and poor UX for growing Gen-Z base. <br /><br />
                                    <strong className="text-kizuna-text-main">Solution:</strong> A unified, API-first architecture providing scalable infrastructure and pristine front-end integrations.
                                </p>
                            </div>

                            {/* Traction */}
                            <div className="bg-white border border-kizuna-border rounded-xl p-5 shadow-sm">
                                <h4 className="text-kizuna-text-main text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-kizuna-primary" /> Traction
                                </h4>
                                <div className="flex items-center gap-2 mb-3">
                                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                                    <p className="text-kizuna-text-main font-semibold">{selectedProject.metrics}</p>
                                </div>
                                <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-kizuna-primary w-[65%]" />
                                </div>
                            </div>

                            {/* Ask Details */}
                            <div className="bg-zinc-50 border border-kizuna-border rounded-xl p-5 shadow-sm">
                                <h4 className="text-kizuna-text-main text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-kizuna-primary" /> The Ask
                                </h4>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-kizuna-text-main">{selectedProject.ask.split(' for ')[0]}</span>
                                    <span className="text-kizuna-text-muted font-medium text-sm">for {selectedProject.ask.split(' for ')[1] || selectedProject.ask}</span>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="bg-white rounded-lg p-3 border border-kizuna-border shadow-sm">
                                        <p className="text-xs text-kizuna-text-muted font-semibold uppercase tracking-wider mb-1">Valuation</p>
                                        <p className="text-sm font-bold text-kizuna-text-main">$1.2M Pre</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border border-kizuna-border shadow-sm">
                                        <p className="text-xs text-kizuna-text-muted font-semibold uppercase tracking-wider mb-1">Closing</p>
                                        <p className="text-sm font-bold text-kizuna-text-main">Next 30 Days</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sticky CTA Footer */}
                        <div className="mt-6 pt-6 border-t border-kizuna-border shrink-0">
                            <Button className="w-full h-11 text-base font-bold bg-kizuna-primary text-white hover:bg-kizuna-primary/90 transition-none shadow-sm flex items-center gap-2">
                                Request Full Data Room
                                <ArrowUpRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}