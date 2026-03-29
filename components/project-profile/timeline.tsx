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
        <div className="space-y-8 border-b border-zinc-800 pb-12">
            <h2 className="text-2xl font-bold text-zinc-50">Milestones</h2>
            <div className="space-y-0">
                {milestones.map((milestone, index) => (
                    <div key={index} className="flex gap-6 pb-8 relative">
                        {/* Timeline line */}
                        {index !== milestones.length - 1 && (
                            <div className="absolute left-[11px] top-12 bottom-0 w-0.5 bg-gradient-to-b from-orange-600 to-orange-600/20" />
                        )}

                        {/* Timeline dot */}
                        <div className="relative z-10 mt-2">
                            <div className="w-6 h-6 rounded-full bg-orange-600 border-4 border-zinc-950 shadow-lg shadow-orange-600/50" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1">
                            <p className="text-sm font-semibold text-orange-500">{milestone.date}</p>
                            <h4 className="text-lg font-bold text-zinc-50 mt-1">{milestone.title}</h4>
                            <p className="text-zinc-400 mt-2">{milestone.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
