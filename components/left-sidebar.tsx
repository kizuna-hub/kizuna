'use client'

import { useState } from 'react'
import { Zap, TrendingUp, Star, Code2, Leaf, BarChart3, Sparkles, BookOpen, Gift, Info } from 'lucide-react'
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
  const [stage, setStage] = useState<string>('all')
  const [nq54Eligible, setNq54Eligible] = useState(false)
  const [generatingRevenue, setGeneratingRevenue] = useState(false)
  const [showNq54Tooltip, setShowNq54Tooltip] = useState(false)

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

        {/* Advanced Filters */}
        <div className="border-t border-zinc-800 pt-8">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
            Advanced Filters
          </h3>

          {/* Stage Filter */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-zinc-300 mb-2 block">Stage</label>
            <div className="space-y-2">
              {['Idea', 'MVP', 'Traction/Scaling'].map((stageOption) => (
                <label key={stageOption} className="flex items-center gap-2 cursor-pointer hover:bg-zinc-800 p-2 rounded transition">
                  <input
                    type="radio"
                    name="stage"
                    value={stageOption.toLowerCase()}
                    checked={stage === stageOption.toLowerCase()}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <span className="text-sm text-zinc-300">{stageOption}</span>
                </label>
              ))}
            </div>
          </div>

          {/* NQ-54 Eligible Toggle */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <label className="text-xs font-semibold text-zinc-300">NQ-54 Eligible</label>
              <button
                onMouseEnter={() => setShowNq54Tooltip(true)}
                onMouseLeave={() => setShowNq54Tooltip(false)}
                className="relative"
              >
                <Info className="w-3.5 h-3.5 text-zinc-500 hover:text-zinc-300 transition" />
                {showNq54Tooltip && (
                  <div className="absolute left-0 top-6 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-300 p-2 w-40 z-50">
                    NQ-54 is a regulatory qualification for high-tech startups
                  </div>
                )}
              </button>
            </div>
            <button
              onClick={() => setNq54Eligible(!nq54Eligible)}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                nq54Eligible ? 'bg-orange-500' : 'bg-zinc-700'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  nq54Eligible ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>

          {/* Generating Revenue Toggle */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 mb-2 block">Generating Revenue</label>
            <button
              onClick={() => setGeneratingRevenue(!generatingRevenue)}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                generatingRevenue ? 'bg-orange-500' : 'bg-zinc-700'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  generatingRevenue ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
