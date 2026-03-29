'use client';

import { useState } from 'react';
import { Clock, MessageSquare, Video, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProjectCardProps {
    title: string;
    stage: string;
    aiSummary: string;
    timeSlots?: string[];
    status?: 'pending' | 'upcoming' | 'completed';
}

export function ProjectCard({
    title,
    stage,
    aiSummary,
    timeSlots = [],
    status = 'pending',
}: ProjectCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-sm">{title}</h3>
                    <Badge variant="secondary" className="mt-2 text-xs">
                        {stage}
                    </Badge>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                >
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                </Button>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                {aiSummary}
            </p>

            {timeSlots.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <Clock className="h-3 w-3" />
                    <span>{timeSlots.join(', ')}</span>
                </div>
            )}

            <div className="flex gap-2">
                {status === 'pending' && (
                    <>
                        <Button
                            size="sm"
                            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8 transition-all"
                            onClick={() => console.log('[v0] Respond clicked:', title)}
                        >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Respond
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs h-8 hover:bg-muted transition-colors"
                            onClick={() => console.log('[v0] Decline clicked:', title)}
                        >
                            Decline
                        </Button>
                    </>
                )}
                {status === 'upcoming' && (
                    <Button
                        size="sm"
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8 gap-2 transition-all"
                        onClick={() => console.log('[v0] Join meeting clicked:', title)}
                    >
                        <Video className="h-3 w-3" />
                        Join Meeting
                    </Button>
                )}
                {status === 'completed' && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs h-8 hover:bg-muted transition-colors"
                        onClick={() => console.log('[v0] View summary clicked:', title)}
                    >
                        View Summary
                    </Button>
                )}
            </div>
        </div>
    );
}
