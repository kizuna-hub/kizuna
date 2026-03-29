'use client';

import { Badge } from '@/components/ui/badge';

interface ProjectHeroProps {
    slug: string;
}

export function ProjectHero({ slug }: ProjectHeroProps) {
    return (
        <div className="space-y-6 border-b border-zinc-800 pb-12">
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-orange-950 text-orange-300">
                        Series A
                    </Badge>
                    <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                        AI & ML
                    </Badge>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-zinc-50 leading-tight">
                    NovaHub
                </h1>
                <p className="text-xl text-zinc-400 max-w-2xl">
                    An AI-powered startup discovery platform connecting founders with mentors, investors, and resources they need to scale.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1">
                    <p className="text-sm text-zinc-500 mb-2">Founded</p>
                    <p className="text-lg text-zinc-50">2023</p>
                </div>
                <div className="flex-1">
                    <p className="text-sm text-zinc-500 mb-2">Team Size</p>
                    <p className="text-lg text-zinc-50">8 people</p>
                </div>
                <div className="flex-1">
                    <p className="text-sm text-zinc-500 mb-2">Location</p>
                    <p className="text-lg text-zinc-50">San Francisco, CA</p>
                </div>
            </div>
        </div>
    );
}
