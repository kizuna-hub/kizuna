'use client';

import { ProjectCard } from './project-card';

interface KanbanColumn {
    title: string;
    items: Array<{
        id: string;
        title: string;
        stage: string;
        aiSummary: string;
        timeSlots?: string[];
    }>;
    status: 'pending' | 'upcoming' | 'completed';
}

interface KanbanBoardProps {
    columns: KanbanColumn[];
}

export function KanbanBoard({ columns }: KanbanBoardProps) {
    return (
        <div className="grid grid-cols-3 gap-6 p-8">
            {columns.map((column) => (
                <div key={column.status} className="flex flex-col">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-foreground">
                            {column.title}
                        </h2>
                        <p className="text-xs text-muted-foreground mt-1">
                            {column.items.length} {column.items.length === 1 ? 'item' : 'items'}
                        </p>
                    </div>

                    <div className="space-y-3 flex-1">
                        {column.items.map((item) => (
                            <ProjectCard
                                key={item.id}
                                title={item.title}
                                stage={item.stage}
                                aiSummary={item.aiSummary}
                                timeSlots={item.timeSlots}
                                status={column.status}
                            />
                        ))}
                        {column.items.length === 0 && (
                            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                                <p className="text-sm text-muted-foreground">
                                    No items yet
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
