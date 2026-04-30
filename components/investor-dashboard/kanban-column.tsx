import { Droppable } from '@hello-pangea/dnd';
import { RichDealCard } from './rich-deal-card';

interface KanbanColumnProps {
    columnId: string;
    title: string;
    projects: any[];
    onViewProject: (project: any) => void;
}

export const KanbanColumn = ({ columnId, title, projects, onViewProject }: KanbanColumnProps) => {
    return (
        <div className="flex-1 min-w-[320px] bg-zinc-50/50 rounded-2xl border border-kizuna-border border-dashed flex flex-col h-full">

            <div className="p-4 border-b border-kizuna-border/50 flex items-center justify-between shrink-0 bg-white/50 rounded-t-2xl">
                <h3 className="text-xs font-black text-kizuna-text-main uppercase tracking-widest flex items-center gap-2">
                    {title}
                </h3>
                <span className="bg-zinc-200 text-kizuna-text-main text-[10px] font-black px-2 py-0.5 rounded-full">
                    {projects.length}
                </span>
            </div>

            <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 p-3 overflow-y-auto space-y-3 transition-colors h-full [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-200 hover:[&::-webkit-scrollbar-thumb]:bg-zinc-300 [&::-webkit-scrollbar-thumb]:rounded-full relative ${snapshot.isDraggingOver ? 'bg-kizuna-primary/5' : ''
                            }`}
                    >
                        {/* FIX 2: Trạng thái Empty State hướng dẫn Kéo-Thả */}
                        {projects.length === 0 && (
                            <div className="h-32 rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-center p-4">
                                <span className="text-2xl mb-2 opacity-20">📥</span>
                                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Kéo dự án vào đây<br />để thêm vào danh mục</p>
                            </div>
                        )}

                        {projects.map((project, index) => (
                            <RichDealCard
                                key={project.id}
                                project={project}
                                index={index}
                                onClick={() => onViewProject(project)}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};