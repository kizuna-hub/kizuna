'use client'

import { Clock, Star, Award } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const upcomingEvents = [
  {
    id: '1',
    name: 'SURF Danang 2026',
    description: 'Southeast Startup Festival',
    daysUntil: 45,
  },
]

const topMentors = [
  {
    id: '1',
    name: 'Alex Chen',
    expertise: 'AI/ML, Product Strategy',
    avatar: 'https://github.com/shadcn.png',
    followers: 342,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    expertise: 'Growth, Marketing',
    avatar: 'https://github.com/shadcn.png',
    followers: 287,
  },
  {
    id: '3',
    name: 'Marcus Lee',
    expertise: 'Fundraising, Business Dev',
    avatar: 'https://github.com/shadcn.png',
    followers: 456,
  },
]

export function RightSidebar() {
  return (
    <aside className="w-80 fixed right-0 top-16 h-[calc(100vh-64px)] bg-zinc-900 border-l border-zinc-800 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Upcoming Events */}
        <div>
          <h2 className="text-sm font-semibold text-zinc-50 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Upcoming Events
          </h2>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-lg hover:border-orange-500/40 transition"
              >
                <h3 className="font-semibold text-white text-sm mb-1">
                  {event.name}
                </h3>
                <p className="text-xs text-zinc-400 mb-2">
                  {event.description}
                </p>
                <div className="flex items-center gap-2 text-orange-400 text-xs font-semibold">
                  <Clock className="w-3 h-3" />
                  {event.daysUntil} days away
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Mentors */}
        <div>
          <h2 className="text-sm font-semibold text-zinc-50 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Top Mentors
          </h2>
          <div className="space-y-3">
            {topMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:bg-zinc-800 hover:border-zinc-600 transition"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={mentor.avatar} />
                    <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {mentor.name}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 mb-2">
                      {mentor.expertise}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-zinc-300">
                      <Star className="w-3 h-3 text-orange-500" />
                      {mentor.followers} followers
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="pt-4 border-t border-zinc-800">
          <div className="space-y-2 text-xs">
            <a href="#" className="block text-zinc-400 hover:text-zinc-200 transition">
              About NovaHub
            </a>
            <a href="#" className="block text-zinc-400 hover:text-zinc-200 transition">
              Community Guidelines
            </a>
            <a href="#" className="block text-zinc-400 hover:text-zinc-200 transition">
              Contact & Support
            </a>
          </div>
        </div>
      </div>
    </aside>
  )
}
