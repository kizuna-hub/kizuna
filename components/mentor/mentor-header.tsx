'use client';

import { useState } from 'react';
import { Calendar, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MentorHeader() {
    const [isAvailable, setIsAvailable] = useState(true);

    return (
        <header className="border-b border-border bg-card px-8 py-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Welcome back, Alex
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Here&apos;s what&apos;s happening with your mentees this week
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Impact Stats */}
                    <div className="flex gap-6">
                        <div className="text-right">
                            <div className="text-2xl font-bold text-primary">12</div>
                            <p className="text-xs text-muted-foreground">Active Mentees</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-primary">8</div>
                            <p className="text-xs text-muted-foreground">This Week</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-primary">4.8</div>
                            <p className="text-xs text-muted-foreground">Avg Rating</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 border-l border-border pl-6">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 hover:bg-muted"
                            onClick={() => { }}
                        >
                            <Calendar className="h-4 w-4" />
                            Sync Calendar
                        </Button>
                        <Button
                            onClick={() => setIsAvailable(!isAvailable)}
                            size="sm"
                            className={`gap-2 transition-colors ${isAvailable
                                ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                                : 'bg-muted hover:bg-muted text-muted-foreground'
                                }`}
                        >
                            {isAvailable ? (
                                <>
                                    <Check className="h-4 w-4" />
                                    Available
                                </>
                            ) : (
                                <>
                                    <X className="h-4 w-4" />
                                    Unavailable
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
