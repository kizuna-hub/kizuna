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
    <aside className="w-80 h-full bg-kizuna-surface border-l border-kizuna-border overflow-y-auto no-scrollbar">
      <div className="p-6">
        {/* Premium Sidebar Header */}
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="text-[11px] font-bold text-kizuna-text-muted uppercase tracking-[0.2em]">
            Widgets
          </h2>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-7 h-7 rounded-full text-kizuna-text-muted bg-transparent"
              title="Focus Mode (Hide Sidebar)"
            >
              <PanelRightClose className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {/* Project of the Month Widget */}
          <div className="bg-kizuna-canvas border border-kizuna-border rounded-2xl p-5 relative overflow-hidden group shadow-sm">
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <Star className="w-5 h-5 text-kizuna-text-main" />
              <h3 className="font-semibold text-kizuna-text-main">Project of the Month</h3>
            </div>
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-kizuna-primary rounded-lg flex items-center justify-center font-bold text-xl text-white shadow-sm">
                  T
                </div>
                <div>
                  <h4 className="font-bold text-kizuna-text-main leading-tight">TrendEngine</h4>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-kizuna-primary border-kizuna-primary/20 bg-kizuna-primary/5 mt-1">
                    #1 Trending
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-kizuna-text-muted leading-relaxed">
                Hyper-local events and deals platform that hit +5k scans this weekend.
              </p>
              <Button className="w-full bg-kizuna-primary text-white border-none shadow-none rounded-md">
                View Profile
              </Button>
            </div>
          </div>

          {/* Upcoming Events Widget */}
          <div className="bg-kizuna-canvas border border-kizuna-border rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-kizuna-text-main" />
              <h3 className="font-semibold text-kizuna-text-main">Upcoming Events</h3>
            </div>

            {/* Main Event */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-kizuna-surface border border-kizuna-border rounded-xl flex flex-col items-center justify-center text-kizuna-text-main flex-shrink-0">
                  <span className="text-xs font-semibold">JUN</span>
                  <span className="text-lg font-bold leading-none">15</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-kizuna-text-main mb-1">SURF Danang 2026</h4>
                  <p className="text-sm text-kizuna-text-muted mb-2">Southeast Asia's Premier University Startup Festival</p>
                  <div className="flex items-center gap-2 text-xs text-kizuna-text-muted">
                    <MapPin className="w-3 h-3" />
                    <span>Da Nang, Vietnam</span>
                  </div>
                </div>
              </div>

              {/* Countdown */}
              <div className="bg-kizuna-surface rounded-lg p-3 border border-kizuna-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-kizuna-text-main" />
                    <span className="text-sm font-medium text-kizuna-text-main">Countdown</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-kizuna-primary">{daysUntilSURF}</div>
                    <div className="text-xs text-kizuna-text-muted">days left</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Events */}
            <div className="pt-3 border-t border-kizuna-border space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-kizuna-text-main">Pitch Night #12</span>
                <span className="text-kizuna-text-muted">Apr 12</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-kizuna-text-main">Mentor Meetup</span>
                <span className="text-kizuna-text-muted">Apr 18</span>
              </div>
            </div>

            <button className="w-full py-2 bg-kizuna-primary text-white rounded-lg text-sm font-medium">
              View All Events
            </button>
          </div>

          {/* Top Mentors */}
          <div>
            <h2 className="text-sm font-semibold text-kizuna-text-main mb-4 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Top Mentors
            </h2>
            <div className="space-y-3">
              {topMentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="p-3 bg-kizuna-canvas border border-kizuna-border rounded-lg shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={mentor.avatar} />
                      <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-kizuna-text-main truncate">
                        {mentor.name}
                      </h3>
                      <p className="text-xs text-kizuna-text-muted line-clamp-2 mb-2">
                        {mentor.expertise}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-kizuna-text-main">
                        <Star className="w-3 h-3 text-kizuna-primary" />
                        {mentor.followers} followers
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Stats */}
          <div className="bg-kizuna-canvas border border-kizuna-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-kizuna-text-main mb-4">Community Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-kizuna-primary">247</div>
                <div className="text-xs text-kizuna-text-muted">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-kizuna-primary">1.2K</div>
                <div className="text-xs text-kizuna-text-muted">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-kizuna-primary">89</div>
                <div className="text-xs text-kizuna-text-muted">Mentors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-kizuna-primary">34</div>
                <div className="text-xs text-kizuna-text-muted">Universities</div>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="pt-4 border-t border-kizuna-border">
            <div className="space-y-2 text-xs">
              <a href="#" className="block text-kizuna-text-muted hover:text-kizuna-text-main transition">
                About NovaHub
              </a>
              <a href="#" className="block text-kizuna-text-muted hover:text-kizuna-text-main transition">
                Community Guidelines
              </a>
              <a href="#" className="block text-kizuna-text-muted hover:text-kizuna-text-main transition">
                Contact & Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}