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
    <main className="flex-1 ml-56 mr-80 pt-6 pb-12">
      <div className="max-w-3xl mx-auto px-6">
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
    </main>
  )
}
