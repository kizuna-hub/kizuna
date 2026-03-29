'use client';

import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const tasks = [
    { id: 1, title: 'Financial Plan', code: 'NQ-54', progress: 60 },
    { id: 2, title: 'Market Analysis', code: 'NQ-55', progress: 35 },
    { id: 3, title: 'Team Structure', code: 'NQ-56', progress: 80 },
];

export default function AIFormFillerCard() {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                    <FileText className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-lg font-bold text-zinc-50">AI Form Filler Tasks</h3>
            </div>

            <div className="space-y-4">
                {tasks.map((task) => (
                    <div key={task.id} className="pb-4 border-b border-zinc-800 last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="font-medium text-zinc-50 text-sm">
                                    {task.title}
                                </p>
                                <p className="text-xs text-zinc-400">({task.code})</p>
                            </div>
                            <span className="text-xs font-semibold text-orange-500 bg-orange-500/20 px-2 py-1 rounded">
                                {task.progress}%
                            </span>
                        </div>
                        <Progress value={task.progress} className="h-2 mb-3" />
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-orange-500 hover:bg-orange-500/20 hover:text-orange-400 text-xs gap-1 h-7 px-2"
                        >
                            Continue with AI <ArrowRight className="w-3 h-3" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
