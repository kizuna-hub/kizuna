'use client'

import { useState } from 'react'
import { ProjectCard, ProjectData } from '@/components/project-card'
import { TractionCard, TractionData } from '@/components/feed/traction-card'

const mockTractionData: TractionData[] = [
  {
    id: 't1',
    companyName: 'TrendEngine',
    companyLogo: 'T',
    companyInitials: 'TE',
    milestoneTag: 'Traction Achieved',
    achievement: 'TrendEngine secured massive metrics growth over the weekend.',
    metricValue: '+5,000',
    metricLabel: 'Scans recorded!',
    type: 'traction',
    timeAgo: '2h ago',
    claps: 124,
  },
  {
    id: 't2',
    companyName: 'DUTCareers',
    companyLogo: 'D',
    companyInitials: 'DC',
    milestoneTag: 'Partnership Milestone',
    achievement: 'DUTCareers secured partnership',
    type: 'partnership',
    timeAgo: '5h ago',
    claps: 89,
  },
  {
    id: 't3',
    companyName: 'Unburden',
    companyLogo: 'U',
    companyInitials: 'UB',
    milestoneTag: 'Product Launch',
    achievement: 'Unburden (Mental Health AI) launched their Beta MVP on Kizuna Hub. ✨',
    type: 'launch',
    timeAgo: '1d ago',
    claps: 256,
  },
]

const mockProjects: ProjectData[] = [
  {
    id: '1',
    name: 'MarketOS',
    description: 'AI-powered Marketing automation tool for university startups. Personalized campaigns, analytics, and customer insights all in one place.',
    logo: 'M',
    logoChar: 'M',
    logoBg: 'bg-blue-600',
    upvotes: 245,
    comments: 12,
    tags: ['MVP', 'AI', 'Marketing'],
    isBKSharkFinalist: true,
  },
  {
    id: '2',
    name: 'StudySync',
    description: 'Collaborative learning platform connecting students worldwide. Real-time note-sharing, study groups, and peer mentorship integrated.',
    logo: 'S',
    logoChar: 'S',
    logoBg: 'bg-purple-600',
    upvotes: 189,
    comments: 24,
    tags: ['EdTech', 'Social', 'MVP'],
    isBKSharkFinalist: true,
  },
  {
    id: '3',
    name: 'CropGuard',
    description: 'IoT + AI solution for smart agriculture. Real-time crop monitoring, disease detection, and yield prediction for farmers.',
    logo: 'C',
    logoChar: 'C',
    logoBg: 'bg-green-600',
    upvotes: 156,
    comments: 8,
    tags: ['AgriTech', 'IoT', 'AI'],
  },
  {
    id: '4',
    name: 'ImpactMap',
    description: 'Platform connecting social enterprises with impact investors. Track metrics, manage funding rounds, and scale social businesses.',
    logo: 'I',
    logoChar: 'I',
    logoBg: 'bg-red-600',
    upvotes: 128,
    comments: 16,
    tags: ['SocialImpact', 'B2B', 'Funding'],
  },
  {
    id: '5',
    name: 'VoiceCode',
    description: 'Voice-to-code IDE for developers. Write entire applications by speaking. Perfect for accessibility and hands-free development.',
    logo: 'V',
    logoChar: 'V',
    logoBg: 'bg-indigo-600',
    upvotes: 312,
    comments: 31,
    tags: ['DevTools', 'AI', 'Accessibility'],
  },
]

export function MainFeed() {
  const [activeTab, setActiveTab] = useState<'discover' | 'live'>('discover')

  return (
    <div className="pt-6 pb-12">
      <div className="w-full">
        {/* Hero Banner */}
        <div className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-kizuna-primary to-[#06110a] border border-white/10 p-10 shadow-[0_20px_40px_-15px_rgba(16,44,30,0.4)]">
          {/* 1. Main Glow: Ánh sáng trắng mờ hắt từ góc trên phải */}
          <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-white/5 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>

          {/* 2. Sub Glow: Ánh sáng xanh ngọc nhẹ hắt từ dưới lên tạo chiều sâu */}
          <div className="absolute bottom-0 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mb-20 pointer-events-none"></div>

          <div className="relative z-10">
            <h2 className="text-4xl font-serif font-medium text-white mb-4 tracking-tight">
              Discover Top 10 Finalists of BK SHARK 2026 🦈
            </h2>
            <p className="text-lg text-zinc-300 mb-8 font-light max-w-2xl leading-relaxed">
              The brightest university startups ready for seed funding. Exclusive deal flow for verified investors.
            </p>

            {/* Nút bấm (Inverted CTA): Nền trắng, chữ xanh, không hover theo rule, chỉ có hiệu ứng click nhẹ */}
            <button className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-kizuna-primary font-semibold rounded-xl border-none shadow-sm active:scale-95 transition-transform duration-200">
              View Pitch Decks
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Header & Main Tabs */}
        <div className="mb-8">
          <div className="flex items-center gap-6 border-b border-kizuna-border">
            <button
              onClick={() => setActiveTab('discover')}
              className={`pb-4 text-2xl font-bold ${activeTab === 'discover'
                ? 'text-kizuna-text-main border-b-2 border-kizuna-primary'
                : 'text-kizuna-text-muted hover:text-kizuna-text-main'
                }`}
            >
              Discover
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`pb-4 text-2xl font-bold flex items-center gap-2 ${activeTab === 'live'
                ? 'text-kizuna-text-main border-b-2 border-kizuna-primary'
                : 'text-kizuna-text-muted hover:text-kizuna-text-main'
                }`}
            >
              Live Updates
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-kizuna-primary/50"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-kizuna-primary"></span>
              </span>
            </button>
          </div>
          <p className="text-lg text-kizuna-text-muted mt-4">
            {activeTab === 'discover'
              ? 'Discover the next big thing from university students.'
              : 'Real-time traction, milestones, and funding updates from Kizuna startups.'}
          </p>
        </div>

        {activeTab === 'discover' ? (
          <div>
            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-kizuna-border pb-4 mb-4">
              <button className="px-4 py-2 rounded-lg bg-kizuna-primary/10 text-kizuna-primary border border-kizuna-primary/20 text-sm font-medium">
                Today
              </button>
              <button className="px-4 py-2 rounded-lg text-kizuna-text-muted hover:text-kizuna-text-main hover:bg-kizuna-surface border border-transparent text-sm font-medium">
                This Week
              </button>
              <button className="px-4 py-2 rounded-lg text-kizuna-text-muted hover:text-kizuna-text-main hover:bg-kizuna-surface border border-transparent text-sm font-medium">
                This Month
              </button>
              <button className="px-4 py-2 rounded-lg text-kizuna-text-muted hover:text-kizuna-text-main hover:bg-kizuna-surface border border-transparent text-sm font-medium">
                All Time
              </button>
            </div>

            {/* Projects List */}
            <div className="space-y-4">
              {mockProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        ) : (
          <div className="relative py-4">
            {/* Central Glowing Line */}
            <div className="absolute top-0 bottom-0 left-[27px] md:left-8 w-[2px] bg-gradient-to-b from-kizuna-primary/0 via-kizuna-primary/50 to-kizuna-primary/0 shadow-[0_0_8px_rgba(16,44,30,0.2)]"></div>

            <div className="space-y-6 relative">
              {mockTractionData.map((traction, i) => (
                <TractionCard key={traction.id} data={traction} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
