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
        <div className="bg-white border border-kizuna-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-50 rounded-lg">
                    <FileText className="w-5 h-5 text-kizuna-primary" />
                </div>
                <h3 className="text-lg font-bold text-kizuna-text-main">AI Form Filler Tasks</h3>
            </div>

            <div className="space-y-4">
                {tasks.map((task) => (
                    <div key={task.id} className="pb-4 border-b border-kizuna-border last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="font-semibold text-kizuna-text-main text-sm">
                                    {task.title}
                                </p>
                                <p className="text-xs text-kizuna-text-muted">({task.code})</p>
                            </div>
                            <span className="text-xs font-semibold text-kizuna-primary bg-emerald-50 px-2 py-1 rounded">
                                {task.progress}%
                            </span>
                        </div>
                        <Progress value={task.progress} className="h-2 mb-3 [&>div]:bg-kizuna-primary bg-zinc-100" />
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-kizuna-primary font-medium hover:bg-zinc-50 hover:underline text-xs gap-1 h-7 px-2"
                        >
                            Continue with AI <ArrowRight className="w-3 h-3" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
