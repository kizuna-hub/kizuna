'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface StickyBottomBarProps {
    eventSlug: string
}

export function StickyBottomBar({ eventSlug }: StickyBottomBarProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            // Show the sticky bar after scrolling 300px
            setIsVisible(window.scrollY > 300)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    if (!isVisible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-md border-t border-orange-500/30 px-4 py-3 md:py-4 animate-in slide-in-from-bottom-4 duration-300">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm md:text-base font-bold text-zinc-50">
                        BK SHARK 2026
                    </h3>
                    <p className="text-xs text-zinc-400">
                        Competition Event • Applications Open
                    </p>
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold whitespace-nowrap">
                    Apply Now
                </Button>
            </div>
        </div>
    )
}
