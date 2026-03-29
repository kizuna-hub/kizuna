'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const stages = [
    { id: 1, label: 'Ideation', completed: true },
    { id: 2, label: 'Team Building', completed: true },
    { id: 3, label: 'MVP', current: true, completed: false },
    { id: 4, label: 'Pitch Readiness', completed: false },
    { id: 5, label: 'Funding', completed: false },
];

export default function IncubationRoadmap() {
    return (
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-zinc-50 mb-8">
                Virtual Incubation Roadmap
            </h2>

            {/* Progress Stepper */}
            <div className="flex items-center justify-between">
                {stages.map((stage, index) => (
                    <div key={stage.id} className="flex flex-col items-center flex-1">
                        {/* Stage Indicator */}
                        <div className="flex items-center gap-4 w-full">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all flex-shrink-0 ${stage.completed
                                        ? 'bg-orange-500 text-zinc-50'
                                        : stage.current
                                            ? 'bg-orange-500 text-zinc-50 ring-2 ring-orange-500 ring-offset-2 ring-offset-zinc-950'
                                            : 'bg-zinc-800 text-zinc-400 border-2 border-zinc-800'
                                    }`}
                            >
                                {stage.completed ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                    stage.id
                                )}
                            </div>

                            {/* Connecting Line */}
                            {index < stages.length - 1 && (
                                <div
                                    className={`flex-1 h-1 mx-2 rounded-full transition-colors ${stage.completed
                                            ? 'bg-orange-500'
                                            : 'bg-zinc-800'
                                        }`}
                                />
                            )}
                        </div>

                        {/* Stage Label */}
                        <p
                            className={`text-sm font-medium mt-3 text-center ${stage.current
                                    ? 'text-orange-500 font-bold'
                                    : stage.completed
                                        ? 'text-zinc-50'
                                        : 'text-zinc-400'
                                }`}
                        >
                            {stage.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* Current Stage Info */}
            <div className="mt-8 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <p className="text-sm text-orange-500">
                    <span className="font-bold">Current Stage:</span> You&apos;re building your MVP. Focus on core features and user validation.
                </p>
            </div>
        </section>
    );
}
