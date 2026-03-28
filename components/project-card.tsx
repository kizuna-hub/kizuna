'use client'

import { ThumbsUp, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface ProjectData {
  id: string
  name: string
  description: string
  logo: string
  logoChar: string
  logoBg: string
  upvotes: number
  comments: number
  tags: string[]
}

interface ProjectCardProps {
  project: ProjectData
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="flex gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 hover:bg-zinc-800/50 transition-all group">
      {/* Logo */}
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg text-white flex-shrink-0 ${project.logoBg}`}>
        {project.logoChar}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white text-base leading-tight mb-1">
          {project.name}
        </h3>
        <p className="text-sm text-zinc-400 mb-3 line-clamp-2">
          {project.description}
        </p>
        <div className="flex gap-2 flex-wrap">
          {project.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-xs"
            >
              #{tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 items-end">
        <Button
          variant="ghost"
          size="sm"
          className="bg-zinc-800 hover:bg-orange-500/20 text-orange-500 hover:text-orange-400 rounded-lg"
        >
          <ThumbsUp className="w-4 h-4 mr-1" />
          {project.upvotes}
        </Button>
        <button className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition text-sm">
          <MessageCircle className="w-4 h-4" />
          {project.comments}
        </button>
      </div>
    </div>
  )
}
