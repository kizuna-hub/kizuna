'use client'

import { ProjectCard, ProjectData } from '@/components/project-card'

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

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Startup Directory</h1>
          <p className="text-lg text-zinc-400">
            Discover the next big thing from university students.
          </p>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {mockProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}
