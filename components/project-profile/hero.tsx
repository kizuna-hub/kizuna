'use client';

import { Badge } from '@/components/ui/badge';

interface ProjectHeroProps {
    slug: string;
}

export function ProjectHero({ slug }: ProjectHeroProps) {
    return (
        <div className="space-y-6 border-b border-kizuna-border pb-12">
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 border border-zinc-200">
                        Series A
                    </Badge>
                    <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 border border-zinc-200">
                        AI & ML
                    </Badge>
                </div>
                <h1 className="text-5xl md:text-6xl font-semibold text-kizuna-text-main leading-tight">
                    NovaHub
                </h1>
                <p className="text-xl text-kizuna-text-muted max-w-2xl">
                    An AI-powered startup discovery platform connecting founders with mentors, investors, and resources they need to scale.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1">
                    <p className="text-sm text-kizuna-text-muted mb-2">Founded</p>
                    <p className="text-lg text-kizuna-text-main font-semibold">2023</p>
                </div>
                <div className="flex-1">
                    <p className="text-sm text-kizuna-text-muted mb-2">Team Size</p>
                    <p className="text-lg text-kizuna-text-main font-semibold">8 people</p>
                </div>
                <div className="flex-1">
                    <p className="text-sm text-kizuna-text-muted mb-2">Location</p>
                    <p className="text-lg text-kizuna-text-main font-semibold">San Francisco, CA</p>
                </div>
            </div>
        </div>
    );
}
