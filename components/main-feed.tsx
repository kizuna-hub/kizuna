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
        <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-zinc-800 p-8">
          {/* Glowing corner accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-3xl -mr-32 -mt-32"></div>

          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-3">
              Discover Top 10 Finalists of BK SHARK 2026 🦈
            </h2>
            <p className="text-lg text-zinc-300 mb-6">
              The brightest university startups ready for seed funding. Exclusive deal flow for verified investors.
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors">
              View Pitch Decks
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Header & Main Tabs */}
        <div className="mb-8">
          <div className="flex items-center gap-6 border-b border-zinc-800">
            <button
              onClick={() => setActiveTab('discover')}
              className={`pb-4 text-2xl font-bold transition-colors ${activeTab === 'discover'
                ? 'text-white border-b-2 border-orange-500'
                : 'text-zinc-500 hover:text-zinc-300'
                }`}
            >
              Discover
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`pb-4 text-2xl font-bold transition-colors flex items-center gap-2 ${activeTab === 'live'
                ? 'text-white border-b-2 border-orange-500'
                : 'text-zinc-500 hover:text-zinc-300'
                }`}
            >
              Live Updates
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </button>
          </div>
          <p className="text-lg text-zinc-400 mt-4">
            {activeTab === 'discover'
              ? 'Discover the next big thing from university students.'
              : 'Real-time traction, milestones, and funding updates from Kizuna startups.'}
          </p>
        </div>

        {activeTab === 'discover' ? (
          <div>
            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-zinc-800 pb-4 mb-4">
              <button className="px-4 py-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 text-sm font-medium">
                Today
              </button>
              <button className="px-4 py-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 text-sm font-medium transition-colors">
                This Week
              </button>
              <button className="px-4 py-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 text-sm font-medium transition-colors">
                This Month
              </button>
              <button className="px-4 py-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 text-sm font-medium transition-colors">
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
            <div className="absolute top-0 bottom-0 left-[27px] md:left-8 w-[2px] bg-gradient-to-b from-orange-500/0 via-orange-500/50 to-orange-500/0 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>

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
