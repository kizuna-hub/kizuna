'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface MentorEndorsementsProps {
    slug: string;
}

const endorsements = [
    {
        name: 'Venture Capitalist Name',
        title: 'Partner at Benchmark',
        initials: 'VC',
        quote:
            'NovaHub is reimagining how founders access mentorship. The AI matching is exceptional.',
    },
    {
        name: 'Startup Advisor',
        title: 'Former CTO, Uber',
        initials: 'SA',
        quote:
            'I&apos;ve seen founders transform through proper mentorship. This platform makes it accessible to everyone.',
    },
    {
        name: 'Industry Expert',
        title: 'CEO, Leading SaaS Co.',
        initials: 'IE',
        quote:
            'The most impressive founding team I&apos;ve worked with in 5 years. Highly recommended.',
    },
];

export function MentorEndorsements({ slug }: MentorEndorsementsProps) {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-kizuna-text-main">Mentor & Investor Endorsements</h2>
            <div className="grid grid-cols-1 gap-6">
                {endorsements.map((endorsement, index) => (
                    <Card
                        key={index}
                        className="bg-white border-kizuna-border shadow-sm"
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${endorsement.name}`} />
                                    <AvatarFallback className="bg-kizuna-primary text-white">
                                        {endorsement.initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-semibold text-kizuna-text-main">{endorsement.name}</p>
                                    <p className="text-xs text-kizuna-text-muted">{endorsement.title}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-kizuna-text-muted italic">"{endorsement.quote}"</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
