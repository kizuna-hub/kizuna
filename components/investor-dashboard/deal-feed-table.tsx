import { TrendingUp, ShieldCheck, Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DealFeedTableProps {
    projects: any[];
    onViewProject: (project: any) => void;
}

export const DealFeedTable = ({ projects, onViewProject }: DealFeedTableProps) => (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/20 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 bg-zinc-50/50 border-b border-black/5 py-4 px-6 text-[10px] font-black text-zinc-500 tracking-widest">
            <div className="col-span-3">Startup & Lĩnh vực</div>
            <div className="col-span-3">Độ tăng trưởng</div>
            <div className="col-span-2">Đang gọi vốn</div>
            <div className="col-span-2">Cổ phần đàm phán</div>
            <div className="col-span-1 text-center">Độ khớp</div>
            <div className="col-span-1 text-right">Thao tác</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-black/5">
            {projects.map(project => {
                const isLocked = project.isLocked;
                const askParts = project.ask.split(/ cho | for /i);
                const askAmount = askParts[0];
                const askEquity = askParts[1] ? `${askParts[1]}` : '--';

                return (
                    <div
                        key={project.id}
                        className="grid grid-cols-12 gap-4 items-center p-4 px-6 hover:bg-white/80 transition-all cursor-pointer group"
                        onClick={() => onViewProject(project)}
                    >
                        {/* Startup & Sector */}
                        <div className="col-span-3 flex items-center gap-3">
                            <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl border border-zinc-100 shadow-sm shrink-0 ${isLocked ? 'blur-[2px] opacity-70' : ''}`}>
                                {isLocked ? <Lock className="w-5 h-5 text-zinc-400" /> : project.logo}
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-sm font-black text-[#102c1e] truncate flex items-center gap-2">
                                    {isLocked ? `Deal đã khóa #${project.id.padStart(4, '0')}` : project.name}
                                    {project.ipSecured && !isLocked && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" title="Ledger Verified" />}
                                </h3>
                                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 tracking-widest mt-1 font-bold">
                                    <span className="truncate">{project.industry.split(/[\/\-]/)[0].trim()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Traction Column */}
                        <div className={`col-span-3 flex items-center gap-2 ${isLocked ? 'blur-[3px] opacity-60 select-none' : ''}`}>
                            <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="text-xs font-bold text-zinc-700 line-clamp-2">{isLocked ? 'Đã bị ẩn bởi founder' : project.metrics}</span>
                        </div>

                        {/* Capital Seeking */}
                        <div className="col-span-2 flex flex-col justify-center">
                            <span className="text-sm font-black text-[#102c1e]">{askAmount}</span>
                        </div>

                        {/* Equity Offered */}
                        <div className="col-span-2 flex flex-col justify-center">
                            <span className="text-xs font-black text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-md">{askEquity}</span>
                        </div>

                        {/* AI Score */}
                        <div className="col-span-1 flex items-center justify-center">
                            <div className="flex items-center gap-1 text-xs font-black text-[#102c1e] bg-zinc-100 px-2 py-1 rounded-lg">
                                <Zap className="w-3 h-3 text-yellow-500" />
                                {(project.aiMatchScore / 20).toFixed(1)}
                            </div>
                        </div>

                        {/* Action */}
                        <div className="col-span-1 flex justify-end">
                            <Button
                                variant={isLocked ? "default" : "outline"}
                                size="sm"
                                className={isLocked
                                    ? "bg-[#102c1e] hover:bg-black text-white font-bold h-8 px-4 text-[10px] tracking-widest rounded-lg shadow-sm"
                                    : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-[#102c1e] font-bold h-8 px-4 text-[10px] tracking-widest rounded-lg"}
                            >
                                {isLocked ? 'Mở khóa' : 'Xem'}
                            </Button>
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
);