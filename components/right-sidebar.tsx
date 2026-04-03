'use client'

import { Calendar, Clock, MapPin, Star, Award, PanelRightClose } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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

export function RightSidebar({ onClose }: { onClose?: () => void }) {
  const daysUntilSURF = Math.floor((new Date('2026-06-15').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  return (
    <aside className="w-80 h-full bg-zinc-900 border-l border-zinc-800 overflow-y-auto no-scrollbar">
      <div className="p-6">
        {/* Premium Sidebar Header */}
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
            Widgets
          </h2>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-7 h-7 rounded-full text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all"
              title="Focus Mode (Hide Sidebar)"
            >
              <PanelRightClose className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {/* Project of the Month Widget */}
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 rounded-xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-2xl -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <Star className="w-5 h-5 text-orange-400 fill-orange-400/20" />
              <h3 className="font-semibold text-zinc-100">Project of the Month</h3>
            </div>
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-orange-900/20">
                  T
                </div>
                <div>
                  <h4 className="font-bold text-white leading-tight">TrendEngine</h4>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-orange-400 border-orange-500/20 bg-orange-500/10 mt-1">
                    #1 Trending
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Hyper-local events and deals platform that hit +5k scans this weekend.
              </p>
              <Button className="w-full bg-zinc-800 hover:bg-orange-500 text-white transition-colors border border-zinc-700 hover:border-orange-500">
                View Profile
              </Button>
            </div>
          </div>

          {/* Upcoming Events Widget */}
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-orange-400" />
              <h3 className="font-semibold text-zinc-100">Upcoming Events</h3>
            </div>

            {/* Main Event */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0">
                  <span className="text-xs font-semibold">JUN</span>
                  <span className="text-lg font-bold leading-none">15</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-zinc-100 mb-1">SURF Danang 2026</h4>
                  <p className="text-sm text-zinc-400 mb-2">Southeast Asia's Premier University Startup Festival</p>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <MapPin className="w-3 h-3" />
                    <span>Da Nang, Vietnam</span>
                  </div>
                </div>
              </div>

              {/* Countdown */}
              <div className="bg-zinc-900/50 rounded-lg p-3 border border-orange-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-medium text-zinc-300">Countdown</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-400">{daysUntilSURF}</div>
                    <div className="text-xs text-zinc-500">days left</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Events */}
            <div className="pt-3 border-t border-orange-500/10 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-300">Pitch Night #12</span>
                <span className="text-zinc-500">Apr 12</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-300">Mentor Meetup</span>
                <span className="text-zinc-500">Apr 18</span>
              </div>
            </div>

            <button className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors">
              View All Events
            </button>
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

          {/* Community Stats */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h3 className="font-semibold text-zinc-100 mb-4">Community Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">247</div>
                <div className="text-xs text-zinc-500">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">1.2K</div>
                <div className="text-xs text-zinc-500">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">89</div>
                <div className="text-xs text-zinc-500">Mentors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">34</div>
                <div className="text-xs text-zinc-500">Universities</div>
              </div>
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
      </div>
    </aside>
  )
}