'use client'

import { Sparkles, Search, Bell, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link';
import { cn } from '@/lib/utils'

export function Navbar({ className }: { className?: string }) {
  return (
    <nav className={cn("sticky top-0 z-50 bg-kizuna-surface/90 backdrop-blur-md border-b border-kizuna-border", className)}>
      <div className="flex items-center justify-between h-16 px-6 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-kizuna-primary p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-kizuna-text-main">Kizuna Hub</span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-kizuna-text-muted" />
            <Input
              placeholder="Search projects..."
              className="w-full pl-10 pr-12 bg-kizuna-canvas border border-kizuna-border text-kizuna-text-main placeholder:text-kizuna-text-muted rounded-lg shadow-sm"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold text-kizuna-text-muted bg-kizuna-surface border border-kizuna-border px-1.5 py-0.5 rounded">
              ⌘ K
            </kbd>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Button
            asChild
            className="bg-kizuna-primary text-white rounded-md border-none shadow-none"
          >
            <Link href="/submit-project" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Submit Project
            </Link>
          </Button>
          <button className="relative p-2 hover:bg-kizuna-border/50 rounded-lg">
            <Bell className="w-5 h-5 text-kizuna-text-muted" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-kizuna-primary rounded-full" />
          </button>
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  )
}
