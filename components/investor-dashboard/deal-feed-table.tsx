import { TrendingUp, ShieldCheck, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DealFeedTableProps {
    projects: any[];
    onViewProject: (project: any) => void;
}

export const DealFeedTable = ({ projects, onViewProject }: DealFeedTableProps) => (
    <div className="bg-white rounded-xl border border-kizuna-border shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 bg-zinc-50 border-b border-kizuna-border py-3 px-6 text-[10px] font-black text-kizuna-text-muted uppercase tracking-widest">
            <div className="col-span-4">Startup</div>
            <div className="col-span-3">Tăng trưởng (Traction)</div>
            <div className="col-span-2">Mức gọi vốn</div>
            <div className="col-span-2 text-center">Chỉ số</div>
            <div className="col-span-1 text-right">Thao tác</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-kizuna-border">
            {projects.map(project => {
                const isLocked = project.isLocked; // Giả định có trường này trong DB

                return (
                    <div
                        key={project.id}
                        className="grid grid-cols-12 gap-4 items-center p-4 px-6 hover:bg-zinc-50 transition-colors cursor-pointer group"
                        onClick={() => onViewProject(project)}
                    >
                        {/* Startup Column */}
                        <div className="col-span-4 flex items-center gap-3">
                            <div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl border border-kizuna-border shadow-sm shrink-0 ${isLocked ? 'blur-[2px] opacity-70' : ''}`}>
                                {isLocked ? <Lock className="w-5 h-5 text-zinc-400" /> : project.logo}
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-sm font-bold text-kizuna-text-main truncate flex items-center gap-2">
                                    {isLocked ? `Dự án ẩn danh #${project.id.padStart(4, '0')}` : project.name}
                                </h3>
                                <div className="flex items-center gap-1.5 text-[11px] text-kizuna-text-muted mt-0.5 font-medium">
                                    <span className="truncate">{project.industry}</span>
                                    <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                                    <span>{project.stage}</span>
                                </div>
                            </div>
                        </div>

                        {/* Traction Column */}
                        <div className={`col-span-3 flex items-center gap-2 ${isLocked ? 'blur-[3px] opacity-60 select-none' : ''}`}>
                            <TrendingUp className="w-4 h-4 text-kizuna-primary" />
                            <span className="text-sm font-bold text-kizuna-text-main truncate">{isLocked ? 'Đã khóa thông tin' : project.metrics}</span>
                        </div>

                        {/* The Ask Column */}
                        <div className="col-span-2 flex flex-col justify-center">
                            <span className="text-sm font-black text-kizuna-text-main">{project.ask.split(' for ')[0]}</span>
                            <span className="text-[10px] font-bold text-kizuna-text-muted uppercase tracking-tighter">
                                cho {project.ask.split(' for ')[1] || project.ask}
                            </span>
                        </div>

                        {/* Indicators Column */}
                        <div className="col-span-2 flex items-center justify-center gap-2">
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold px-2 py-0.5 whitespace-nowrap text-[10px]">
                                {project.aiMatchScore}% Phù hợp
                            </Badge>
                            {project.ipSecured && (
                                <div className="w-6 h-6 rounded-md bg-zinc-50 flex items-center justify-center border border-kizuna-border" title="Đã bảo mật IP">
                                    <ShieldCheck className="w-3.5 h-3.5 text-kizuna-primary" />
                                </div>
                            )}
                        </div>

                        {/* Action Column */}
                        <div className="col-span-1 flex justify-end">
                            <Button
                                variant={isLocked ? "default" : "outline"}
                                size="sm"
                                className={isLocked
                                    ? "bg-zinc-800 hover:bg-black text-white font-bold h-8 px-3 text-[10px] uppercase tracking-tight shadow-sm"
                                    : "border-kizuna-border text-kizuna-text-main hover:bg-white font-bold h-8 px-3 text-[10px] uppercase tracking-tight"}
                            >
                                {isLocked ? 'Yêu cầu mở' : 'Xem'}
                            </Button>
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
);