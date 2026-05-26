import { Draggable } from '@hello-pangea/dnd';
import { ShieldCheck, Lock, Users, Zap, CircleDollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RichDealCardProps {
    project: any;
    index: number;
    onClick: () => void;
}

export const RichDealCard = ({ project, index, onClick }: RichDealCardProps) => {
    const isLocked = project.isLocked;

    const askParts = project.ask.split(/ cho | for /i);
    const askAmount = askParts[0];
    const askEquity = askParts[1] ? `ĐỔI LẤY ${askParts[1]}` : '';

    return (
        <Draggable draggableId={project.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={onClick}
                    className={`bg-white border rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-kizuna-primary/50 transition-colors flex flex-col ${snapshot.isDragging ? 'shadow-2xl border-kizuna-primary scale-105 rotate-2 z-50' : 'shadow-sm border-kizuna-border'
                        }`}
                >
                    <div className="flex items-center justify-between mb-3 shrink-0">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-black px-2 py-0.5 text-[10px] tracking-widest">
                            {project.aiMatchScore}% Phù hợp
                        </Badge>

                        {!isLocked && project.ipSecured && (
                            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span className="text-[9px] font-black uppercase tracking-widest">IP Verified</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-start gap-3 mb-3 shrink-0">
                        <div className={`w-12 h-12 bg-zinc-50 rounded-lg flex items-center justify-center text-2xl border border-zinc-100 shrink-0 ${isLocked ? 'blur-[2px] opacity-70' : ''}`}>
                            {isLocked ? <Lock className="w-5 h-5 text-zinc-400" /> : project.logo}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-black text-kizuna-text-main truncate">
                                {isLocked ? `Dự án #${project.id.padStart(4, '0')}` : project.name}
                            </h3>
                            <p className={`text-[11px] text-kizuna-text-muted font-medium mt-0.5 leading-snug line-clamp-2 ${isLocked ? 'blur-[3px] select-none' : ''}`}>
                                {isLocked ? 'Bị ẩn bởi Venture Lock. Yêu cầu mở khóa để xem chi tiết.' : project.slogan || project.description}
                            </p>
                        </div>
                    </div>

                    {/* MỚI: Sector Tags (Chỉ hiện khi chưa bị khóa) */}
                    {!isLocked && (
                        <div className="flex flex-wrap gap-1.5 mb-4 shrink-0">
                            {project.industry.split('/').map((tag: string, i: number) => (
                                <span key={i} className="px-2 py-1 bg-zinc-100 text-zinc-600 text-[9px] font-black uppercase tracking-widest rounded-md border border-zinc-200">
                                    {tag.trim()}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-100 flex flex-col relative overflow-hidden mt-auto shrink-0">
                        {isLocked && (
                            <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                <span className="text-[10px] font-black bg-zinc-900 text-white px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                                    <Lock className="w-3 h-3" /> Locked Deal
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-2.5 mb-3 bg-white p-2 rounded-md border border-zinc-100 shadow-sm">
                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                <CircleDollarSign className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-black text-kizuna-text-main leading-none mb-1">{askAmount}</span>
                                <span className="text-[9px] font-bold text-kizuna-text-muted uppercase tracking-widest leading-none">
                                    {askEquity}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-zinc-200/80 pt-2.5">
                            <div className="flex items-center gap-1 text-[10px] font-bold text-kizuna-text-muted uppercase tracking-widest">
                                <Zap className="w-3.5 h-3.5 text-amber-500" /> Trust: {project.techTrust || 85}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-kizuna-text-muted uppercase tracking-widest">
                                <Users className="w-3.5 h-3.5 text-blue-500" /> B2B/B2C
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};