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
        <div className="space-y-8 border-b border-kizuna-border pb-12">
            <h2 className="text-2xl font-semibold text-kizuna-text-main">Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {team.map((member, index) => (
                    <div
                        key={index}
                        className="bg-white border border-kizuna-border rounded-lg p-6 shadow-sm"
                    >
                        <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} />
                                <AvatarFallback className="bg-kizuna-primary text-white text-sm">
                                    {member.initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h4 className="font-semibold text-kizuna-text-main">{member.name}</h4>
                                <p className="text-sm text-kizuna-primary font-semibold mt-1">{member.role}</p>
                                <p className="text-sm text-kizuna-text-muted mt-2">{member.background}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
