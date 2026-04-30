'use client';

import React from 'react';
import { Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mentors = [
    {
        id: 1,
        name: 'Sarah Williams',
        role: 'SaaS Founder & Investor',
        initials: 'SW',
    },
    {
        id: 2,
        name: 'Marcus Johnson',
        role: 'Product Strategy Expert',
        initials: 'MJ',
    },
];

export default function SuggestedMentorsCard() {
    return (
        <div className="bg-white border border-kizuna-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-50 rounded-lg">
                    <Users className="w-5 h-5 text-kizuna-primary" />
                </div>
                <h3 className="text-lg font-bold text-kizuna-text-main">Suggested Mentors</h3>
            </div>

            <div className="space-y-4">
                {mentors.map((mentor) => (
                    <div key={mentor.id} className="p-4 bg-kizuna-surface border border-kizuna-border rounded-xl">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-kizuna-primary flex items-center justify-center flex-shrink-0">
                                <span className="font-bold text-white text-sm">
                                    {mentor.initials}
                                </span>
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-col items-start gap-1 mb-1">
                                    <span className="bg-emerald-50 text-kizuna-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-md">
                                        95% Match
                                    </span>
                                    <p className="font-medium text-kizuna-text-main text-sm leading-none">
                                        {mentor.name}
                                    </p>
                                </div>
                                <p className="text-xs text-kizuna-text-muted mt-1">
                                    {mentor.role}
                                </p>
                            </div>
                        </div>
                        <Button
                            size="sm"
                            className="w-full mt-3 gap-2 bg-kizuna-primary text-white hover:bg-kizuna-primary"
                        >
                            <Calendar className="w-4 h-4" />
                            Book Session
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
