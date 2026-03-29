'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface TeamSectionProps {
    slug: string;
}

const team = [
    {
        name: 'Sarah Chen',
        role: 'CEO & Co-founder',
        background: 'Ex-Google, Stanford MBA',
        initials: 'SC',
    },
    {
        name: 'Marcus Johnson',
        role: 'CTO & Co-founder',
        background: 'Ex-OpenAI, ML Engineer',
        initials: 'MJ',
    },
    {
        name: 'Priya Patel',
        role: 'Head of Growth',
        background: 'Ex-Stripe, Growth Lead',
        initials: 'PP',
    },
    {
        name: 'Alex Kim',
        role: 'Product Manager',
        background: 'Ex-Figma, Product Designer',
        initials: 'AK',
    },
];

export function TeamSection({ slug }: TeamSectionProps) {
    return (
        <div className="space-y-8 border-b border-zinc-800 pb-12">
            <h2 className="text-2xl font-bold text-zinc-50">Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {team.map((member, index) => (
                    <div
                        key={index}
                        className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-orange-600/50 hover:bg-zinc-900/80 transition-all duration-300"
                    >
                        <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} />
                                <AvatarFallback className="bg-orange-600 text-white text-sm">
                                    {member.initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h4 className="font-bold text-zinc-50">{member.name}</h4>
                                <p className="text-sm text-orange-500 font-semibold mt-1">{member.role}</p>
                                <p className="text-sm text-zinc-400 mt-2">{member.background}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
