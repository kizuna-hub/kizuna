'use client'

import { Navbar } from '@/components/navbar'
import { LeftSidebar } from '@/components/left-sidebar'
import { MainFeed } from '@/components/main-feed'
import { RightSidebar } from '@/components/right-sidebar'

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Navbar />
      <div className="flex">
        <LeftSidebar />
        <MainFeed />
        <RightSidebar />
      </div>
    </div>
  )
}
