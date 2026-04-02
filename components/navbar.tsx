'use client'

import { Sparkles, Search, Bell, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link';
import { cn } from '@/lib/utils'

export function Navbar({ className }: { className?: string }) {
  return (
    <nav className={cn("sticky top-0 z-50 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800", className)}>
      <div className="flex items-center justify-between h-16 px-6 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Kizuna Hub</span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Search projects..."
              className="w-full pl-10 pr-12 bg-zinc-800 border-zinc-700 text-zinc-50 placeholder:text-zinc-500 rounded-lg"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 bg-zinc-700 px-2 py-1 rounded">
              Cmd K
            </kbd>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Button
            asChild
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
          >
            <Link href="/submit-project" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Submit Project
            </Link>
          </Button>
          <button className="relative p-2 hover:bg-zinc-800 rounded-lg transition">
            <Bell className="w-5 h-5 text-zinc-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
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
