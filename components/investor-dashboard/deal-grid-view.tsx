import { Zap, ShieldCheck, Lock, TrendingUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DealGridViewProps {
    projects: any[];
    onViewProject: (project: any) => void;
}

export const DealGridView = ({ projects, onViewProject }: DealGridViewProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => {
                const isLocked = project.isLocked;
                const askParts = project.ask.split(/ cho | for /i);
                const askAmount = askParts[0];
                const askEquity = askParts[1] ? `${askParts[1]} Equity` : '';

                return (
                    <div
                        key={project.id}
                        onClick={() => onViewProject(project)}
                        className="group relative bg-white/70 backdrop-blur-md rounded-2xl border border-white/20 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full hover:-translate-y-1"
                    >
                        {isLocked && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center">
                                <Lock className="w-8 h-8 text-zinc-400 mb-3" />
                                <h3 className="text-lg font-black text-[#102c1e] mb-2 tracking-tighter">Deal đã khóa</h3>
                                <p className="text-xs font-medium text-zinc-500 mb-4 tracking-wide">Yêu cầu quyền truy cập từ founder để xem chi tiết.</p>
                                <Button className="bg-[#102c1e] text-white hover:bg-black rounded-xl font-bold tracking-widest text-[10px] w-full">Yêu cầu truy cập</Button>
                            </div>
                        )}

                        <div className="p-6 flex-1 flex flex-col">
                            {/* Header: Score & Badge */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex bg-[#102c1e] text-white rounded-lg px-2.5 py-1 text-xs font-black tracking-widest items-center gap-1.5 shadow-sm">
                                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                                    Độ khớp: {(project.aiMatchScore).toFixed(1)}
                                </div>
                                {project.ipSecured && (
                                    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg">
                                        {/* <ShieldCheck className="w-3.5 h-3.5" /> */}
                                        {/* <span className="text-[9px] font-black tracking-widest">Ledger Verified</span> */}
                                    </div>
                                )}
                            </div>

                            {/* Core Info */}
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-14 h-14 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-center text-3xl shadow-sm shrink-0">
                                    {project.logo}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-[#102c1e] leading-none mb-1.5 truncate pr-2">{project.name}</h3>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 tracking-widest leading-none">
                                        <span>{project.industry.split(/[\/\-]/)[0].trim()}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm font-medium text-zinc-600 line-clamp-2 mb-6 min-h-[40px]">
                                {project.slogan || project.description}
                            </p>

                            {/* Traction */}
                            <div className="bg-zinc-50/80 rounded-xl p-3 border border-zinc-100 mb-6 flex-1">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                                    <span className="text-xs font-bold text-zinc-500 tracking-widest">Độ tăng trưởng hiện tại</span>
                                </div>
                                <div className="text-sm font-black text-[#102c1e]">{project.metrics}</div>
                            </div>

                            {/* Ask */}
                            <div className="flex items-end justify-between pt-5 border-t border-black/5 mt-auto">
                                <div>
                                    <div className="text-[10px] font-black text-zinc-400 tracking-widest mb-1">Đang gọi vốn</div>
                                    <div className="text-lg font-black text-[#102c1e] leading-none">{askAmount}</div>
                                </div>
                                {askEquity && (
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-zinc-400 tracking-widest mb-1">Cổ phần đàm phán</div>
                                        <div className="text-sm font-black text-emerald-600 leading-none">{askEquity}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};