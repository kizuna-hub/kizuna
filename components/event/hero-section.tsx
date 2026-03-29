'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface HeroSectionProps {
    eventSlug: string
}

export function HeroSection({ eventSlug }: HeroSectionProps) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    })

    useEffect(() => {
        const calculateTimeLeft = () => {
            // Set deadline to 30 days from now
            const deadline = new Date()
            deadline.setDate(deadline.getDate() + 30)

            const difference = deadline.getTime() - new Date().getTime()

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                })
            }
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)
        return () => clearInterval(timer)
    }, [])

    return (
        <section className="relative overflow-hidden px-4 py-20 md:py-32">
            {/* Background grid pattern with orange glow */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,107,53,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,107,53,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                {/* Status Badge */}
                <div className="mb-6 flex justify-center">
                    <Badge className="bg-green-900/50 text-green-300 border border-green-700/50 px-4 py-1.5 text-sm font-medium">
                        🟢 Applications Open
                    </Badge>
                </div>

                {/* Main Title */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-zinc-50 tracking-tight">
                    BK SHARK 2026
                    <span className="block text-3xl md:text-5xl lg:text-6xl mt-2 bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
                        The Ultimate Engineering Pitch
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Turn your university project into a funded startup. Compete for <span className="text-orange-400 font-semibold">500M VND</span> and direct entry to SURF Da Nang.
                </p>

                {/* Countdown Timer */}
                <div className="grid grid-cols-4 gap-2 md:gap-4 mb-12 max-w-md mx-auto">
                    {[
                        { label: 'Days', value: timeLeft.days },
                        { label: 'Hours', value: timeLeft.hours },
                        { label: 'Minutes', value: timeLeft.minutes },
                        { label: 'Seconds', value: timeLeft.seconds },
                    ].map((item) => (
                        <div key={item.label} className="bg-zinc-900/50 border border-orange-500/30 rounded-lg p-3 md:p-4 backdrop-blur">
                            <div className="text-3xl md:text-4xl font-bold text-orange-400 font-mono">
                                {String(item.value).padStart(2, '0')}
                            </div>
                            <div className="text-xs md:text-sm text-zinc-400 mt-1 font-medium">{item.label}</div>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="mb-8">
                    <button className="relative group">
                        <div className="absolute inset-0 rounded-lg bg-orange-600 blur opacity-100 group-hover:opacity-75 transition duration-300 animate-pulse" />
                        <div className="relative px-8 md:px-12 py-4 bg-orange-500 text-zinc-950 rounded-lg font-bold text-lg md:text-xl flex items-center justify-center gap-2 group-hover:bg-orange-400 transition">
                            Start Application ✨
                        </div>
                    </button>
                    <p className="text-sm text-zinc-500 mt-3 font-medium">
                        Auto-loads BK SHARK & NQ-54 Templates
                    </p>
                </div>

                {/* Live Stat */}
                <p className="text-zinc-400 text-sm md:text-base">
                    🔥 <span className="text-orange-300 font-semibold">42 Teams</span> have already started their AI-assisted applications.
                </p>
            </div>
        </section>
    )
}
