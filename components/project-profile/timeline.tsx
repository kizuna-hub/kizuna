'use client';

interface TimelineProps {
    slug: string;
}

const milestones = [
    {
        date: 'Q3 2023',
        title: 'Founded',
        description: 'NovaHub officially launches with initial beta testers',
    },
    {
        date: 'Q1 2024',
        title: 'Seed Funding',
        description: 'Raised $1.2M seed round from top-tier VCs',
    },
    {
        date: 'Q3 2024',
        title: 'Series A',
        description: 'Closed $5M Series A to scale team and platform',
    },
    {
        date: 'Q1 2025',
        title: 'Partner Integration',
        description: '500+ mentors and 200+ investors on platform',
    },
];

export function Timeline({ slug }: TimelineProps) {
    return (
        <div className="space-y-8 border-b border-kizuna-border pb-12">
            <h2 className="text-2xl font-semibold text-kizuna-text-main">Milestones</h2>
            <div className="space-y-0">
                {milestones.map((milestone, index) => (
                    <div key={index} className="flex gap-6 pb-8 relative">
                        {/* Timeline line */}
                        {index !== milestones.length - 1 && (
                            <div className="absolute left-[11px] top-12 bottom-0 w-0.5 bg-zinc-300" />
                        )}

                        {/* Timeline dot */}
                        <div className="relative z-10 mt-2">
                            <div className="w-6 h-6 rounded-full bg-kizuna-primary border-4 border-kizuna-canvas" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1">
                            <p className="text-sm font-semibold text-kizuna-primary">{milestone.date}</p>
                            <h4 className="text-lg font-semibold text-kizuna-text-main mt-1">{milestone.title}</h4>
                            <p className="text-kizuna-text-muted mt-2">{milestone.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
