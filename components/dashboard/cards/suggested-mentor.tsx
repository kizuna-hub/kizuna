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
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Users className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-lg font-bold text-zinc-50">Suggested Mentors</h3>
            </div>

            <div className="space-y-4">
                {mentors.map((mentor) => (
                    <div key={mentor.id} className="p-4 bg-zinc-800/40 border border-zinc-800/50 rounded-lg">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                                <span className="font-bold text-zinc-50 text-sm">
                                    {mentor.initials}
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-zinc-50 text-sm">
                                    {mentor.name}
                                </p>
                                <p className="text-xs text-zinc-400 mt-1">
                                    {mentor.role}
                                </p>
                            </div>
                        </div>
                        <Button
                            size="sm"
                            className="w-full mt-3 gap-2 bg-orange-500 hover:bg-orange-600 text-zinc-50"
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
