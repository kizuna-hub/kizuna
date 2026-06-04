'use client';

import React, { useState } from 'react';
import {
    Search, Users, Star, Send, Sparkles, Building2, Briefcase,
    Linkedin, Mail, ExternalLink, ChevronRight, Check, RefreshCw,
    TrendingUp, Shield, Globe, Clock, BadgeCheck, Edit3,
    ArrowUpRight, Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Industry = 'All' | 'FinTech' | 'AI/ML' | 'SaaS' | 'EdTech' | 'HealthTech' | 'Web3';
type RequestPurpose = 'warm-intro' | 'expert-dd';

interface AdvisedStartup {
    id: string;
    name: string;
    logo: string;
    stage: string;
    vertical: string;
    fastEquity: string; // FAST advisory equity %
    mrr?: string;
    lastActivity: string;
    status: 'active' | 'exited' | 'watch';
}

interface Mentor {
    id: string;
    name: string;
    initials: string;
    title: string;
    company: string;
    industries: Industry[];
    bio: string;
    background: { role: string; org: string; period: string }[];
    advisedCount: number;
    totalFastEquity: string;
    linkedin: string;
    email: string;
    responseTime: string;
    verified: boolean;
    advisedStartups: AdvisedStartup[];
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MENTORS: Mentor[] = [
    {
        id: 'm1',
        name: 'Nguyễn Tuấn Anh',
        initials: 'NA',
        title: 'Ex-CPO · Investor',
        company: 'Ex-MoMo · Nextrans',
        industries: ['FinTech', 'SaaS'],
        bio: 'Former Chief Product Officer at MoMo (Vietnam\'s #1 FinTech unicorn). Led product from 5M to 30M users. Now an active angel investor focused on B2B SaaS and FinTech infrastructure across SEA. Brings deep network across Vietnam tech ecosystem.',
        background: [
            { role: 'CPO', org: 'MoMo', period: '2016 – 2022' },
            { role: 'Managing Partner', org: 'Nextrans', period: '2022 – Present' },
            { role: 'Board Member', org: 'FinTech Vietnam Association', period: '2020 – Present' },
        ],
        advisedCount: 4,
        totalFastEquity: '6.5%',
        linkedin: 'linkedin.com/in/nguyen-tuan-anh',
        email: 'tuan.anh@nextrans.vc',
        responseTime: '< 12 hours',
        verified: true,
        advisedStartups: [
            { id: 's1', name: 'SnapMoney', logo: '💸', stage: 'Series A', vertical: 'FinTech', fastEquity: '1.5%', mrr: '$38K MRR', lastActivity: '2d ago', status: 'active' },
            { id: 's2', name: 'PayCore API', logo: '🔌', stage: 'Seed', vertical: 'FinTech', fastEquity: '2.0%', mrr: '$12K MRR', lastActivity: '1w ago', status: 'active' },
            { id: 's3', name: 'ClearLedger', logo: '📒', stage: 'Pre-Seed', vertical: 'SaaS', fastEquity: '1.0%', lastActivity: '3w ago', status: 'watch' },
            { id: 's4', name: 'Nami Wallet', logo: '💼', stage: 'Seed', vertical: 'FinTech', fastEquity: '2.0%', mrr: '$8K MRR', lastActivity: '5d ago', status: 'active' },
        ],
    },
    {
        id: 'm2',
        name: 'Trần Phương Linh',
        initials: 'TL',
        title: 'Ex-CTO · AI Advisor',
        company: 'Ex-VNG · AI Vietnam Lab',
        industries: ['AI/ML', 'SaaS'],
        bio: 'Former CTO at VNG Cloud, one of Vietnam\'s largest tech conglomerates. Led AI & ML infrastructure at scale. Founded AI Vietnam Lab, an applied AI research hub. Advises B2B SaaS and AI-first startups on architecture, data moats, and tech team building.',
        background: [
            { role: 'CTO', org: 'VNG Cloud', period: '2014 – 2021' },
            { role: 'Founder / Director', org: 'AI Vietnam Lab', period: '2021 – Present' },
            { role: 'Technical Advisor', org: 'Vietnam AI Alliance', period: '2022 – Present' },
        ],
        advisedCount: 3,
        totalFastEquity: '4.5%',
        linkedin: 'linkedin.com/in/tran-phuong-linh',
        email: 'linh@aivietnam.lab',
        responseTime: '< 24 hours',
        verified: true,
        advisedStartups: [
            { id: 's5', name: 'EduPath AI', logo: '🎓', stage: 'Seed', vertical: 'EdTech', fastEquity: '1.5%', mrr: '$12K MRR', lastActivity: '1d ago', status: 'active' },
            { id: 's6', name: 'Rekog Vision', logo: '👁️', stage: 'Pre-Seed', vertical: 'AI/ML', fastEquity: '2.0%', lastActivity: '2w ago', status: 'active' },
            { id: 's7', name: 'DataFlux', logo: '🌊', stage: 'Series A', vertical: 'SaaS', fastEquity: '1.0%', mrr: '$55K MRR', lastActivity: '3d ago', status: 'active' },
        ],
    },
    {
        id: 'm3',
        name: 'Lê Minh Quang',
        initials: 'LQ',
        title: 'Serial Founder · Operator',
        company: 'Ex-Topica · KinderWorld',
        industries: ['EdTech', 'SaaS'],
        bio: 'Two-time EdTech founder. Co-founded Topica, Vietnam\'s largest online education platform (acquired). Board member at KinderWorld International. Deep expertise in curriculum digitization, student retention mechanics, and EdTech monetization models across SEA.',
        background: [
            { role: 'Co-Founder & CEO', org: 'Topica', period: '2008 – 2018' },
            { role: 'Board Member', org: 'KinderWorld International', period: '2019 – Present' },
            { role: 'LP / Advisor', org: 'Education Angels Network', period: '2020 – Present' },
        ],
        advisedCount: 2,
        totalFastEquity: '3.0%',
        linkedin: 'linkedin.com/in/le-minh-quang',
        email: 'quang@kinderworld.com',
        responseTime: '2–3 days',
        verified: false,
        advisedStartups: [
            { id: 's8', name: 'ClassMind VN', logo: '📚', stage: 'Pre-Seed', vertical: 'EdTech', fastEquity: '1.5%', lastActivity: '1w ago', status: 'active' },
            { id: 's9', name: 'StudyVault', logo: '🔒', stage: 'Seed', vertical: 'EdTech', fastEquity: '1.5%', mrr: '$4K MRR', lastActivity: '4d ago', status: 'watch' },
        ],
    },
    {
        id: 'm4',
        name: 'Pham Thi Bich Van',
        initials: 'BV',
        title: 'HealthTech Expert · GP',
        company: 'Ex-Vinmec · HealthBase Fund',
        industries: ['HealthTech'],
        bio: 'Former Chief Digital Officer at Vinmec International Hospital. Built Vietnam\'s first fully integrated hospital digital platform. General Partner at HealthBase Fund, focusing on HealthTech infrastructure, telemedicine, and medical AI across ASEAN.',
        background: [
            { role: 'Chief Digital Officer', org: 'Vinmec International', period: '2017 – 2023' },
            { role: 'General Partner', org: 'HealthBase Fund', period: '2023 – Present' },
        ],
        advisedCount: 3,
        totalFastEquity: '5.0%',
        linkedin: 'linkedin.com/in/pham-bich-van',
        email: 'van@healthbase.fund',
        responseTime: '< 24 hours',
        verified: true,
        advisedStartups: [
            { id: 's10', name: 'MedTrack AI', logo: '🏥', stage: 'Series A', vertical: 'HealthTech', fastEquity: '1.5%', mrr: '$20K MRR', lastActivity: '1d ago', status: 'active' },
            { id: 's11', name: 'TeleDoc VN', logo: '🩺', stage: 'Seed', vertical: 'HealthTech', fastEquity: '2.0%', mrr: '$9K MRR', lastActivity: '3d ago', status: 'active' },
            { id: 's12', name: 'PharmaLink', logo: '💊', stage: 'Pre-Seed', vertical: 'HealthTech', fastEquity: '1.5%', lastActivity: '2w ago', status: 'watch' },
        ],
    },
];

const INDUSTRIES: Industry[] = ['All', 'FinTech', 'AI/ML', 'SaaS', 'EdTech', 'HealthTech', 'Web3'];

const PURPOSE_OPTIONS: { id: RequestPurpose; label: string; desc: string; icon: React.ElementType }[] = [
    { id: 'warm-intro', label: 'Request Warm Intro', desc: 'Ask mentor to introduce you to one of their advised startups', icon: Users },
    { id: 'expert-dd', label: 'Expert Due Diligence', desc: 'Invite mentor for a 30-min paid advisory session on a deal', icon: Briefcase },
];

const STATUS_CONFIG = {
    active: { label: 'Active', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
    exited: { label: 'Exited', color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200',       dot: 'bg-blue-500'    },
    watch:  { label: 'Watch',  color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',     dot: 'bg-amber-500'   },
};

// ─── GENERATE AI DRAFT ────────────────────────────────────────────────────────
function generateDraft(mentor: Mentor, startup: AdvisedStartup | null, purpose: RequestPurpose): string {
    if (!startup) {
        return purpose === 'warm-intro'
            ? `Hi ${mentor.name.split(' ')[0]},\n\nHope this finds you well. I've been following your work in the ${mentor.industries[0]} space closely — your track record with ${mentor.background[0].org} is genuinely impressive.\n\nI'm a VC actively deploying into early-stage ${mentor.industries[0]} companies in Vietnam & SEA. I'd love to explore whether any of the founders you advise might be a fit for our current thesis.\n\nWould you be open to a 15-minute intro call?\n\nBest,\n[Your name]`
            : `Hi ${mentor.name.split(' ')[0]},\n\nI'm reaching out because I'm currently in the due diligence phase of a ${mentor.industries[0]} deal and your expertise would be invaluable.\n\nGiven your deep background at ${mentor.background[0].org} and your current advisory portfolio, I believe a 30-minute expert session with you would significantly sharpen our investment thesis.\n\nWould you be available for a paid advisory call this week?\n\nBest,\n[Your name]`;
    }

    return purpose === 'warm-intro'
        ? `Hi ${mentor.name.split(' ')[0]},\n\nI hope you're doing well. I've been closely following ${startup.name} — I think their ${startup.vertical} approach is genuinely differentiated, especially at the ${startup.stage} stage with ${startup.mrr ?? 'early traction'}.\n\nGiven your advisory relationship with them, I'd love to request a warm introduction to the founding team. I believe there's strong potential alignment with our current fund's thesis.\n\nWould you be comfortable making that introduction? Happy to send a brief context note to make it easy for you.\n\nMany thanks,\n[Your name]`
        : `Hi ${mentor.name.split(' ')[0]},\n\nI'm currently conducting deep due diligence on a deal in the ${startup.vertical} space (${startup.stage}), and your background at ${mentor.background[0].org} makes you uniquely positioned to help us stress-test the thesis.\n\nSpecifically, I'd love your perspective on: (1) technical feasibility of the core product, (2) go-to-market risks in Vietnam, and (3) team quality assessment.\n\nI'd like to schedule a paid 45-min expert DD session. Our standard rate is $300/hr — would that work for you?\n\nLooking forward to it,\n[Your name]`;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function Initials({ text, size = 'md' }: { text: string; size?: 'sm' | 'md' | 'lg' }) {
    const sizeClass = { sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-base', lg: 'w-16 h-16 text-2xl' }[size];
    return (
        <div className={cn('rounded-2xl bg-[#102c1e] text-[#a1e2b6] font-outfit font-black flex items-center justify-center shrink-0', sizeClass)}>
            {text}
        </div>
    );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function MentorNetworkDirectory() {
    const [search, setSearch] = useState('');
    const [activeIndustry, setActiveIndustry] = useState<Industry>('All');
    const [activeMentor, setActiveMentor] = useState<Mentor>(MENTORS[0]);
    const [selectedStartup, setSelectedStartup] = useState<AdvisedStartup | null>(null);
    const [purpose, setPurpose] = useState<RequestPurpose>('warm-intro');
    const [draft, setDraft] = useState(() => generateDraft(MENTORS[0], null, 'warm-intro'));
    const [isEditing, setIsEditing] = useState(false);
    const [sent, setSent] = useState(false);

    const filteredMentors = MENTORS.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.company.toLowerCase().includes(search.toLowerCase()) ||
            m.title.toLowerCase().includes(search.toLowerCase());
        const matchesIndustry = activeIndustry === 'All' || m.industries.includes(activeIndustry as Industry);
        return matchesSearch && matchesIndustry;
    });

    const handleSelectMentor = (mentor: Mentor) => {
        setActiveMentor(mentor);
        setSelectedStartup(null);
        setSent(false);
        setDraft(generateDraft(mentor, null, purpose));
    };

    const handleSelectStartup = (startup: AdvisedStartup) => {
        const next = selectedStartup?.id === startup.id ? null : startup;
        setSelectedStartup(next);
        setDraft(generateDraft(activeMentor, next, purpose));
        setSent(false);
    };

    const handlePurposeChange = (p: RequestPurpose) => {
        setPurpose(p);
        setDraft(generateDraft(activeMentor, selectedStartup, p));
        setSent(false);
    };

    const handleSend = () => {
        setSent(true);
        setIsEditing(false);
    };

    return (
        <div className="flex h-screen bg-[#fafafa] overflow-hidden font-inter">

            {/* ══════════════════════════════════════════════════════════
                LEFT PANE — The Directory (w-1/4)
            ══════════════════════════════════════════════════════════ */}
            <aside className="w-1/4 min-w-[260px] max-w-[320px] shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden">

                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2 mb-1">
                        <Users className="w-5 h-5 text-[#102c1e]" />
                        <h1 className="font-outfit font-black text-[#102c1e] text-xl">Mentor Directory</h1>
                    </div>
                    <p className="font-inter text-sm text-slate-500">
                        {MENTORS.length} vetted advisors · {MENTORS.reduce((a, m) => a + m.advisedCount, 0)} active mandates
                    </p>
                </div>

                {/* Search */}
                <div className="px-4 py-3 border-b border-slate-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by name, firm, or title..."
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-inter text-sm text-[#102c1e] placeholder:text-slate-400 focus:outline-none focus:border-[#102c1e]/30 focus:bg-white transition-all"
                        />
                    </div>
                </div>

                {/* Industry Filter Pills */}
                <div className="px-4 py-3 border-b border-slate-100 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                    <div className="flex items-center gap-1.5 w-max">
                        {INDUSTRIES.map(industry => (
                            <button
                                key={industry}
                                onClick={() => setActiveIndustry(industry)}
                                className={cn(
                                    'whitespace-nowrap font-geist text-xs font-bold px-3 py-1.5 rounded-full border transition-all',
                                    activeIndustry === industry
                                        ? 'bg-[#102c1e] text-white border-[#102c1e]'
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700',
                                )}
                            >
                                {industry}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mentor List */}
                <div className="flex-1 overflow-y-auto py-2 [&::-webkit-scrollbar]:hidden">
                    {filteredMentors.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                            <Users className="w-8 h-8 text-slate-200 mb-3" />
                            <p className="font-inter text-sm font-semibold text-slate-400">No mentors found</p>
                        </div>
                    ) : (
                        <div className="space-y-0.5 px-2">
                            {filteredMentors.map(mentor => {
                                const isActive = activeMentor.id === mentor.id;
                                return (
                                    <button
                                        key={mentor.id}
                                        onClick={() => handleSelectMentor(mentor)}
                                        className={cn(
                                            'group w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left relative',
                                            isActive
                                                ? 'bg-[#102c1e]/5 border border-[#102c1e]/10'
                                                : 'hover:bg-slate-50 border border-transparent',
                                        )}
                                    >
                                        {/* Active indicator */}
                                        {isActive && (
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-[#102c1e] rounded-r-full" />
                                        )}

                                        <Initials text={mentor.initials} size="sm" />

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                <p className={cn(
                                                    'font-inter text-sm font-bold truncate',
                                                    isActive ? 'text-[#102c1e]' : 'text-slate-700 group-hover:text-[#102c1e]',
                                                )}>
                                                    {mentor.name}
                                                </p>
                                                {mentor.verified && (
                                                    <BadgeCheck className="w-3.5 h-3.5 text-[#a1e2b6] shrink-0" />
                                                )}
                                            </div>
                                            <p className="font-inter text-xs text-slate-500 truncate">{mentor.title}</p>
                                        </div>

                                        <div className={cn(
                                            'shrink-0 font-geist text-xs font-bold px-2 py-1 rounded-lg border',
                                            isActive
                                                ? 'bg-[#a1e2b6]/20 border-[#a1e2b6]/40 text-[#102c1e]'
                                                : 'bg-slate-50 border-slate-200 text-slate-500',
                                        )}>
                                            {mentor.advisedCount}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </aside>

            {/* ══════════════════════════════════════════════════════════
                MIDDLE PANE — Profile & FAST Ledger (w-1/2)
            ══════════════════════════════════════════════════════════ */}
            <main className="flex-1 flex flex-col overflow-hidden border-r border-slate-200 bg-white min-w-0">

                {/* Profile Header */}
                <div className="px-8 py-6 border-b border-slate-200">
                    <div className="flex items-start gap-5">
                        <Initials text={activeMentor.initials} size="lg" />

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap mb-1">
                                <h2 className="font-outfit font-black text-[#102c1e] text-2xl leading-tight">
                                    {activeMentor.name}
                                </h2>
                                {activeMentor.verified && (
                                    <div className="flex items-center gap-1 bg-[#a1e2b6]/20 border border-[#a1e2b6]/40 px-2.5 py-1 rounded-full">
                                        <BadgeCheck className="w-3.5 h-3.5 text-[#102c1e]" />
                                        <span className="font-geist text-xs font-bold text-[#102c1e]">Verified</span>
                                    </div>
                                )}
                            </div>
                            <p className="font-inter text-base text-slate-600 mb-3">
                                {activeMentor.title} · <span className="font-semibold text-slate-700">{activeMentor.company}</span>
                            </p>

                            {/* Industry tags */}
                            <div className="flex items-center gap-2 flex-wrap">
                                {activeMentor.industries.map(ind => (
                                    <span key={ind} className="font-geist text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-full">
                                        {ind}
                                    </span>
                                ))}
                                <span className="font-geist text-xs text-slate-400 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" /> Responds {activeMentor.responseTime}
                                </span>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                            <a
                                href={`https://${activeMentor.linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 font-geist text-xs font-bold text-[#102c1e] bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl transition-all"
                            >
                                <Linkedin className="w-4 h-4" /> LinkedIn
                                <ExternalLink className="w-3 h-3 text-slate-400" />
                            </a>
                            <button className="flex items-center gap-2 font-geist text-xs font-bold bg-[#102c1e] text-[#a1e2b6] hover:bg-[#0a1c13] px-3 py-2 rounded-xl transition-all">
                                <Mail className="w-4 h-4" /> Contact
                            </button>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">

                    {/* Section 1: Expertise & Background */}
                    <div className="px-8 py-6 border-b border-slate-100">
                        <h3 className="font-outfit font-black text-[#102c1e] text-lg mb-3 flex items-center gap-2">
                            <Briefcase className="w-5 h-5" /> Expertise & Background
                        </h3>
                        <p className="font-inter text-sm text-slate-600 leading-relaxed mb-5">
                            {activeMentor.bio}
                        </p>

                        {/* Career timeline */}
                        <div className="space-y-3">
                            {activeMentor.background.map((bg, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                                        <Building2 className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-inter text-sm font-bold text-[#102c1e]">{bg.role}</span>
                                            <span className="font-geist text-xs text-slate-400">·</span>
                                            <span className="font-inter text-sm font-semibold text-slate-700">{bg.org}</span>
                                        </div>
                                        <p className="font-geist text-xs text-slate-400 mt-0.5">{bg.period}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 2: Advised Startups & FAST Ledger */}
                    <div className="px-8 py-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-outfit font-black text-[#102c1e] text-lg flex items-center gap-2">
                                <Wallet className="w-5 h-5" /> Advised Startups & FAST Ledger
                            </h3>
                            <div className="flex items-center gap-2">
                                <div className="text-right">
                                    <p className="font-geist text-xs text-slate-400 uppercase tracking-widest">Total Advisory Equity</p>
                                    <p className="font-mono text-lg font-black text-[#102c1e]">{activeMentor.totalFastEquity}</p>
                                </div>
                                <div className="w-px h-8 bg-slate-200" />
                                <div className="text-right">
                                    <p className="font-geist text-xs text-slate-400 uppercase tracking-widest">Active Mandates</p>
                                    <p className="font-mono text-lg font-black text-[#102c1e]">{activeMentor.advisedCount}</p>
                                </div>
                            </div>
                        </div>

                        {/* FAST context note */}
                        <div className="flex items-start gap-2.5 bg-[#102c1e]/4 border border-[#102c1e]/10 rounded-xl p-4 mb-5">
                            <Shield className="w-4 h-4 text-[#102c1e]/60 shrink-0 mt-0.5" />
                            <p className="font-inter text-sm text-slate-600">
                                <span className="font-bold text-[#102c1e]">FAST = Founder-Advisor Standard Template.</span>
                                {' '}Equity percentages below represent vested advisory stakes, proving this mentor has real skin-in-the-game alignment with each startup.
                            </p>
                        </div>

                        {/* Bento Grid of Startups */}
                        <div className="grid grid-cols-2 gap-3">
                            {activeMentor.advisedStartups.map(startup => {
                                const stCfg = STATUS_CONFIG[startup.status];
                                const isSelected = selectedStartup?.id === startup.id;
                                return (
                                    <button
                                        key={startup.id}
                                        onClick={() => handleSelectStartup(startup)}
                                        className={cn(
                                            'text-left p-4 rounded-2xl border transition-all',
                                            isSelected
                                                ? 'bg-[#102c1e]/5 border-[#102c1e] ring-1 ring-[#102c1e]/30 shadow-sm'
                                                : 'bg-[#fafafa] border-slate-200 hover:border-slate-300 hover:bg-white hover:shadow-sm',
                                        )}
                                    >
                                        {/* Startup top row */}
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg shrink-0">
                                                    {startup.logo}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-inter text-sm font-bold text-[#102c1e] truncate">{startup.name}</p>
                                                    <p className="font-geist text-xs text-slate-400 truncate">{startup.vertical}</p>
                                                </div>
                                            </div>
                                            {isSelected && <Check className="w-4 h-4 text-[#102c1e] shrink-0" />}
                                        </div>

                                        {/* Tags row */}
                                        <div className="flex items-center gap-1.5 flex-wrap mb-3">
                                            <span className="font-geist text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md">
                                                {startup.stage}
                                            </span>
                                            <span className={cn(
                                                'inline-flex items-center gap-1 font-geist text-xs font-bold px-2 py-0.5 rounded-md border',
                                                stCfg.bg, stCfg.color,
                                            )}>
                                                <span className={cn('w-1.5 h-1.5 rounded-full', stCfg.dot)} />
                                                {stCfg.label}
                                            </span>
                                        </div>

                                        {/* FAST equity — the key data point */}
                                        <div className="flex items-center justify-between pt-2.5 border-t border-slate-200">
                                            <div>
                                                <p className="font-geist text-xs text-slate-400 uppercase tracking-wide">Advisory Equity (FAST)</p>
                                                <p className="font-mono text-base font-black text-[#102c1e] mt-0.5">{startup.fastEquity}</p>
                                            </div>
                                            {startup.mrr && (
                                                <div className="text-right">
                                                    <p className="font-geist text-xs text-slate-400 uppercase tracking-wide">MRR</p>
                                                    <p className="font-mono text-sm font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                                                        <TrendingUp className="w-3 h-3" />{startup.mrr}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {selectedStartup && (
                            <div className="mt-3 flex items-center gap-2 px-4 py-3 bg-[#a1e2b6]/10 border border-[#a1e2b6]/30 rounded-xl">
                                <Check className="w-4 h-4 text-[#102c1e]" />
                                <p className="font-inter text-sm text-[#102c1e]">
                                    <span className="font-bold">{selectedStartup.name}</span> selected for connection request — see AI draft →
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* ══════════════════════════════════════════════════════════
                RIGHT PANE — Connection Terminal & AI Draft (w-1/4)
            ══════════════════════════════════════════════════════════ */}
            <aside className="w-1/4 min-w-[280px] max-w-[340px] shrink-0 bg-white flex flex-col overflow-hidden">

                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-200">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-lg bg-[#102c1e] flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-[#a1e2b6]" />
                        </div>
                        <h2 className="font-outfit font-black text-[#102c1e] text-base">Request Connection</h2>
                    </div>
                    <p className="font-inter text-sm text-slate-500">AI drafts a contextual outreach for you</p>
                </div>

                {/* To: */}
                <div className="px-5 py-4 border-b border-slate-100">
                    <p className="font-geist text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">To</p>
                    <div className="flex items-center gap-3">
                        <Initials text={activeMentor.initials} size="sm" />
                        <div className="min-w-0">
                            <p className="font-inter text-sm font-bold text-[#102c1e] truncate">{activeMentor.name}</p>
                            <p className="font-geist text-xs text-slate-400 truncate">{activeMentor.email}</p>
                        </div>
                    </div>
                </div>

                {/* Purpose Selector */}
                <div className="px-5 py-4 border-b border-slate-100">
                    <p className="font-geist text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Purpose</p>
                    <div className="space-y-2">
                        {PURPOSE_OPTIONS.map(opt => {
                            const Icon = opt.icon;
                            const isActive = purpose === opt.id;
                            return (
                                <button
                                    key={opt.id}
                                    onClick={() => handlePurposeChange(opt.id)}
                                    className={cn(
                                        'w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all',
                                        isActive
                                            ? 'bg-[#102c1e]/5 border-[#102c1e]/20 ring-1 ring-[#102c1e]/10'
                                            : 'bg-slate-50 border-slate-200 hover:border-slate-300',
                                    )}
                                >
                                    <div className={cn(
                                        'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                                        isActive ? 'bg-[#102c1e] text-[#a1e2b6]' : 'bg-white border border-slate-200 text-slate-400',
                                    )}>
                                        <Icon className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className={cn('font-inter text-sm font-bold leading-tight', isActive ? 'text-[#102c1e]' : 'text-slate-600')}>
                                            {opt.label}
                                        </p>
                                        <p className="font-inter text-xs text-slate-400 mt-0.5 leading-snug">{opt.desc}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Regarding */}
                {selectedStartup && (
                    <div className="px-5 py-3 border-b border-slate-100 bg-[#fafafa]">
                        <p className="font-geist text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Re: Startup</p>
                        <div className="flex items-center gap-2">
                            <span className="text-lg">{selectedStartup.logo}</span>
                            <span className="font-inter text-sm font-bold text-[#102c1e]">{selectedStartup.name}</span>
                            <span className="font-geist text-xs text-slate-400">{selectedStartup.stage}</span>
                        </div>
                    </div>
                )}

                {/* AI Draft Message */}
                <div className="flex-1 overflow-hidden flex flex-col px-5 py-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#102c1e]/50" />
                            <p className="font-geist text-xs font-bold text-slate-400 uppercase tracking-widest">AI Draft</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setDraft(generateDraft(activeMentor, selectedStartup, purpose))}
                                className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-[#102c1e] transition-colors"
                                title="Regenerate"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setIsEditing(e => !e)}
                                className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-[#102c1e] transition-colors"
                                title="Edit"
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {sent ? (
                        /* ── SENT STATE ── */
                        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center bg-[#a1e2b6]/10 border border-[#a1e2b6]/30 rounded-xl p-6">
                            <div className="w-12 h-12 rounded-full bg-[#a1e2b6]/30 flex items-center justify-center">
                                <Check className="w-6 h-6 text-[#102c1e]" />
                            </div>
                            <div>
                                <p className="font-outfit font-black text-[#102c1e] text-lg">Message Sent!</p>
                                <p className="font-inter text-sm text-slate-600 mt-1">
                                    Your request has been sent to{' '}
                                    <span className="font-bold">{activeMentor.name.split(' ')[0]}</span>.
                                    Expected reply in {activeMentor.responseTime}.
                                </p>
                            </div>
                            <button
                                onClick={() => setSent(false)}
                                className="font-geist text-xs font-bold text-slate-500 hover:text-[#102c1e] transition-colors mt-2"
                            >
                                Send another request
                            </button>
                        </div>
                    ) : (
                        /* ── DRAFT TEXTAREA ── */
                        <textarea
                            value={draft}
                            onChange={e => setDraft(e.target.value)}
                            readOnly={!isEditing}
                            className={cn(
                                'flex-1 w-full font-inter text-sm text-[#102c1e] leading-relaxed bg-slate-50 border border-slate-200 rounded-xl p-4 resize-none transition-all',
                                isEditing
                                    ? 'focus:outline-none focus:border-[#102c1e]/30 focus:bg-white'
                                    : 'cursor-default',
                            )}
                        />
                    )}
                </div>

                {/* Actions */}
                {!sent && (
                    <div className="px-5 pb-5 pt-3 border-t border-slate-100 space-y-2">
                        <button
                            onClick={handleSend}
                            className="w-full flex items-center justify-center gap-2 bg-[#102c1e] text-[#a1e2b6] font-geist font-black text-sm py-3 rounded-xl hover:bg-[#0a1c13] transition-all shadow-sm"
                        >
                            <Send className="w-4 h-4" />
                            Approve & Send
                        </button>
                        <button
                            onClick={() => setIsEditing(e => !e)}
                            className={cn(
                                'w-full flex items-center justify-center gap-2 font-geist font-bold text-sm py-2.5 rounded-xl border transition-all',
                                isEditing
                                    ? 'bg-[#a1e2b6]/20 border-[#a1e2b6]/40 text-[#102c1e]'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300',
                            )}
                        >
                            <Edit3 className="w-4 h-4" />
                            {isEditing ? 'Done Editing' : 'Edit Draft'}
                        </button>
                    </div>
                )}
            </aside>
        </div>
    );
}
