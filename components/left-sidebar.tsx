'use client'

import { Zap, TrendingUp, Star, Code2, Leaf, BarChart3, Sparkles, BookOpen, Gift } from 'lucide-react'
import { cn } from '@/lib/utils'

const navSections = [
  {
    title: 'Discover',
    items: [
      { label: 'Newest', icon: Sparkles },
      { label: 'Trending', icon: TrendingUp },
      { label: 'Top Voted', icon: Star },
    ],
  },
  {
    title: 'Categories',
    items: [
      { label: 'AI & Tech', icon: Code2 },
      { label: 'EdTech', icon: BookOpen },
      { label: 'AgriTech', icon: Leaf },
      { label: 'Social Impact', icon: BarChart3 },
    ],
  },
  {
    title: 'Resources',
    items: [
      { label: 'Mentor Hub', icon: Sparkles },
      { label: 'SaaS Perks', icon: Gift },
      { label: 'IP Templates', icon: BookOpen },
    ],
  },
]

export function LeftSidebar() {
  return (
    <aside className="w-56 fixed left-0 top-16 h-[calc(100vh-64px)] bg-zinc-900 border-r border-zinc-800 overflow-y-auto">
      <div className="p-6 space-y-8">
        {navSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <ul className="space-y-2">
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.label}>
                    <button
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                        'hover:bg-zinc-800 text-zinc-300 hover:text-white'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  )
}
