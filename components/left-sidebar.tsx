'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Zap, TrendingUp, Star, Code2, Leaf, BarChart3, Sparkles, BookOpen, Gift, Info, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const navSections = [
  {
    title: 'Discover',
    items: [
      { label: 'Newest', icon: Sparkles, href: '/', count: 24 },
      { label: 'Trending', icon: TrendingUp, href: '/trending', count: 12 },
      { label: 'Top Voted', icon: Star, href: '/top-voted', count: 8 },
    ],
  },
  {
    title: 'Categories',
    items: [
      { label: 'AI & Tech', icon: Code2, href: '/categories/ai-tech', count: 45 },
      { label: 'EdTech', icon: BookOpen, href: '/categories/edtech', count: 23 },
      { label: 'AgriTech', icon: Leaf, href: '/categories/agritech', count: 15 },
      { label: 'Social Impact', icon: BarChart3, href: '/categories/social-impact', count: 18 },
    ],
  },
  {
    title: 'Resources',
    items: [
      { label: 'Mentor Hub', icon: Sparkles, href: '/resources/mentor-hub' },
      { label: 'SaaS Perks', icon: Gift, href: '/resources/saas-perks' },
      { label: 'IP Templates', icon: BookOpen, href: '/resources/ip-templates' },
    ],
  },
]

export function LeftSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [stage, setStage] = useState<string>('all')
  const [nq54Eligible, setNq54Eligible] = useState(false)
  const [generatingRevenue, setGeneratingRevenue] = useState(false)
  const [showNq54Tooltip, setShowNq54Tooltip] = useState(false)

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-64px)] bg-zinc-900 border-r border-zinc-800 transition-all duration-300 z-40 flex flex-col",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="p-4 space-y-8">
            {navSections.map((section) => (
              <div key={section.title}>
                <h3 className={cn(
                  "text-xs font-semibold text-zinc-400 uppercase tracking-wider px-2 transition-all duration-300 whitespace-nowrap overflow-hidden",
                  isCollapsed ? "h-0 opacity-0 mb-0" : "h-4 opacity-100 mb-3"
                )}>
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const isLink = Boolean(item.href)

                    const content = (
                      <div className="flex items-center w-full">
                        <div className="flex items-center justify-center w-5 h-5 shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className={cn(
                          "flex items-center flex-1 justify-between overflow-hidden transition-all duration-300 whitespace-nowrap",
                          isCollapsed ? "w-0 opacity-0 ml-0" : "ml-3 opacity-100"
                        )}>
                          <span className="truncate">{item.label}</span>
                          {item.count !== undefined && (
                            <span className="text-[10px] font-medium bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full shrink-0 ml-2">
                              {item.count}
                            </span>
                          )}
                        </div>
                      </div>
                    )

                    const className = cn(
                      'w-full flex items-center p-2.5 rounded-lg text-sm transition-colors overflow-hidden',
                      'hover:bg-zinc-800 text-zinc-300 hover:text-white'
                    )

                    return (
                      <li key={item.label} title={isCollapsed ? item.label : undefined}>
                        {isLink ? (
                          <Link href={item.href!} className={className}>
                            {content}
                          </Link>
                        ) : (
                          <button className={className}>
                            {content}
                          </button>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}

            {/* Advanced Filters */}
            <div className={cn("border-t border-zinc-800 pt-8", isCollapsed && "hidden")}>
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4 px-2">
                Advanced Filters
              </h3>

              {/* Stage Filter */}
              <div className="mb-6 px-2">
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
              <div className="mb-6 px-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-zinc-300">NQ-54 Eligible</label>
                  <button
                    onMouseEnter={() => setShowNq54Tooltip(true)}
                    onMouseLeave={() => setShowNq54Tooltip(false)}
                    className="relative cursor-help"
                  >
                    <Info className="w-3.5 h-3.5 text-zinc-500 hover:text-zinc-300 transition" />
                    {showNq54Tooltip && (
                      <div className="absolute left-0 top-6 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-300 p-2 w-40 z-50 pointer-events-none">
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
              <div className="px-2 flex items-center justify-between pb-4">
                <label className="text-xs font-semibold text-zinc-300">Generating Revenue</label>
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
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-8 bg-zinc-800 border border-zinc-700 rounded-full p-1 text-zinc-400 hover:text-white hover:bg-zinc-700 transition z-50 flex items-center justify-center cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>
      {/* Spacer to push content based on sidebar width */}
      <div className={cn("hidden md:block h-full shrink-0 transition-all duration-300", isCollapsed ? "w-20" : "w-64")} />
    </>
  )
}