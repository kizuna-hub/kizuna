import { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { KanbanColumn } from './kanban-column';

interface KanbanBoardProps {
    projects: any[];
    onViewProject: (project: any) => void;
}

export const KanbanBoard = ({ projects, onViewProject }: KanbanBoardProps) => {
    const [isMounted, setIsMounted] = useState(false);

    // Khởi tạo State các cột
    const [columns, setColumns] = useState({
        scouting: {
            id: 'scouting',
            title: '✨ AI Đề xuất (Scouting)',
            items: projects.filter(p => !p.isLocked)
        },
        diligence: {
            id: 'diligence',
            title: '🔍 Đang Thẩm định',
            items: projects.filter(p => p.isLocked)
        },
        portfolio: {
            id: 'portfolio',
            title: '🤝 Chốt Deal / Portfolio',
            items: []
        }
    });

    // 🚀 BẢN VÁ LỖI TẠI ĐÂY: 
    // Lắng nghe mỗi khi sếp bấm bộ lọc (prop 'projects' thay đổi) -> Cập nhật lại các cột
    useEffect(() => {
        setColumns(prev => ({
            scouting: {
                ...prev.scouting,
                items: projects.filter(p => !p.isLocked)
            },
            diligence: {
                ...prev.diligence,
                items: projects.filter(p => p.isLocked)
            },
            portfolio: {
                ...prev.portfolio,
                items: prev.portfolio.items // Tạm giữ nguyên cột này nếu có data kéo sang
            }
        }));
    }, [projects]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const sourceCol = columns[source.droppableId as keyof typeof columns];
        const destCol = columns[destination.droppableId as keyof typeof columns];

        const sourceItems = [...sourceCol.items];
        const destItems = sourceCol.id === destCol.id ? sourceItems : [...destCol.items];

        const [movedItem] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, movedItem);

        setColumns({
            ...columns,
            [sourceCol.id]: { ...sourceCol, items: sourceItems },
            [destCol.id]: { ...destCol, items: destItems }
        });
    };

    if (!isMounted) return null;

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 h-[calc(100vh-280px)] overflow-x-auto pb-4">
                {Object.values(columns).map(col => (
                    <KanbanColumn
                        key={col.id}
                        columnId={col.id}
                        title={col.title}
                        projects={col.items}
                        onViewProject={onViewProject}
                    />
                ))}
            </div>
        </DragDropContext>
    );
};