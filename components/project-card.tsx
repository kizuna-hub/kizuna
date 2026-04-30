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
  isBKSharkFinalist?: boolean
}

interface ProjectCardProps {
  project: ProjectData
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="relative flex gap-4 p-4 bg-kizuna-surface border border-kizuna-border rounded-2xl shadow-sm">
      {/* BK SHARK Badge */}
      {project.isBKSharkFinalist && (
        <div className="absolute top-3 right-3">
          <div className="px-3 py-1.5 bg-kizuna-canvas border border-kizuna-border rounded-full text-xs font-semibold text-kizuna-text-main">
            🌟 BK SHARK '26
          </div>
        </div>
      )}

      {/* Logo */}
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg text-white flex-shrink-0 ${project.logoBg}`}>
        {project.logoChar}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-kizuna-text-main text-base leading-tight mb-1">
          {project.name}
        </h3>
        <p className="text-sm text-kizuna-text-muted mb-3 line-clamp-2">
          {project.description}
        </p>
        <div className="flex gap-2 flex-wrap">
          {project.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-kizuna-canvas text-kizuna-text-muted text-xs border border-kizuna-border"
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
          className="text-kizuna-text-main rounded-lg"
        >
          <ThumbsUp className="w-4 h-4 mr-1" />
          {project.upvotes}
        </Button>
        <button className="flex items-center gap-1 text-kizuna-text-muted text-sm">
          <MessageCircle className="w-4 h-4" />
          {project.comments}
        </button>
      </div>
    </div>
  )
}
