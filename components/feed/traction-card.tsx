'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, ThumbsUp, DollarSign, Sparkles, Rocket, Handshake, Activity, MessageSquare } from 'lucide-react'

export interface TractionData {
    id: string
    companyName: string
    companyLogo: string
    companyInitials: string
    milestoneTag: string
    achievement: string
    metricValue?: string
    metricLabel?: string
    type: 'launch' | 'partnership' | 'traction'
    timeAgo: string
    claps: number
}

interface TractionCardProps {
    data: TractionData
    index: number
}

export function TractionCard({ data, index }: TractionCardProps) {
    const getTheme = () => {
        switch (data.type) {
            case 'launch':
                return { icon: Rocket, iconColor: 'text-orange-500', iconBg: 'bg-orange-500/20 border-orange-500/40 shadow-[0_0_12px_rgba(249,115,22,0.4)]', glow: 'group-hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]', badgeColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20' };
            case 'partnership':
                return { icon: Handshake, iconColor: 'text-blue-400', iconBg: 'bg-blue-500/20 border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.4)]', glow: 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]', badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
            case 'traction':
                return { icon: Activity, iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/20 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.4)]', glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]', badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
            default:
                return { icon: Sparkles, iconColor: 'text-orange-500', iconBg: 'bg-orange-500/20 border-orange-500/40 shadow-[0_0_12px_rgba(249,115,22,0.4)]', glow: 'group-hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]', badgeColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20' };
        }
    }

    const theme = getTheme();
    const Icon = theme.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
            className="flex gap-4 md:gap-6 group relative"
        >
            <div className="flex-none pt-4 pl-2 relative z-10 w-12 flex justify-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border backdrop-blur-md ${theme.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className={`w-4 h-4 ${theme.iconColor}`} />
                </div>
            </div>

            <Card className={`flex-1 p-5 md:p-6 bg-zinc-900/60 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-2xl transition-all duration-300 ${theme.glow}`}>
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center font-bold text-lg text-white">
                            {data.companyInitials}
                        </div>
                        <div>
                            <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
                                {data.companyName}
                                <span className="text-xs font-normal text-zinc-500">• {data.timeAgo}</span>
                            </h3>
                            <Badge variant="outline" className={`text-xs border px-2 py-0.5 mt-1 ${theme.badgeColor}`}>
                                <Sparkles className="w-3 h-3 mr-1 inline-block" />
                                {data.milestoneTag}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="mb-6 space-y-4">
                    <h2 className={`text-xl md:text-2xl font-bold leading-tight ${data.type === 'traction' ? 'text-zinc-100' : 'text-white'}`}>
                        {data.achievement}
                    </h2>

                    {data.type === 'traction' && data.metricValue && (
                        <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 p-4 relative overflow-hidden">
                            <Activity className="w-24 h-24 text-emerald-500/10 absolute -right-4 -bottom-4" />
                            <div className="relative z-10">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-4xl font-extrabold text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
                                        {data.metricValue}
                                    </span>
                                    <span className="text-emerald-500 font-medium">{data.metricLabel}</span>
                                </div>
                                {/* Mini Sparkline Chart representation */}
                                <div className="flex items-end gap-1 h-6 mt-3 opacity-80">
                                    {[20, 35, 25, 45, 30, 60, 50, 80, 65, 100].map((val, i) => (
                                        <div
                                            key={i}
                                            className="w-full bg-emerald-400 rounded-t-sm blur-[0.5px] transition-all hover:blur-none"
                                            style={{ height: `${val}%` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {data.type === 'partnership' && (
                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4">
                            <p className="text-blue-200/70 text-sm">
                                Example Template: <span className="text-blue-300">Startup A</span> just secured a strategic partnership with <span className="text-blue-300 font-semibold">[Company Name]</span> to expand their reach.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 md:gap-4 w-full">
                        <Button variant="ghost" className="flex items-center gap-2 text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-full px-4 h-9">
                            <span className="text-base">👏</span>
                            <span className="font-medium">{data.claps}</span>
                        </Button>
                        <div className="relative flex-1 max-w-[200px] hidden sm:block">
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-full h-9 px-4 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-orange-500/50 focus:bg-zinc-800 transition-all"
                            />
                        </div>
                        <Button className="ml-auto bg-white hover:bg-zinc-200 text-black font-semibold flex items-center gap-2 rounded-full h-9 px-4 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            <DollarSign className="w-4 h-4" />
                            <span className="hidden sm:inline">Invest Interest</span>
                            <span className="sm:hidden">Invest</span>
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}
