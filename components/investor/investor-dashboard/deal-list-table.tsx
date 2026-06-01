"use client";

import { ChevronDown, Lock, ShieldCheck, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { dealFlowProjects } from './data';

// 1. Khai báo Interface bắt buộc phải có để nhận prop từ page.tsx
interface DealListTableProps {
    onViewProject?: (project: any) => void;
}

// 2. Phải có dấu ngoặc nhọn { onViewProject } ở đây
export const DealListTable = ({ onViewProject }: DealListTableProps) => {
    return (
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-zinc-900">Danh sách dự án</h3>
                <button className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-600 hover:bg-zinc-100 transition-colors">
                    Mới nhất <ChevronDown className="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            <th className="pb-4 font-black whitespace-nowrap">Project</th>
                            <th className="pb-4 font-black whitespace-nowrap">Traction</th>
                            <th className="pb-4 font-black whitespace-nowrap">The Ask</th>
                            <th className="pb-4 font-black whitespace-nowrap">Status</th>
                            <th className="pb-4 text-right font-black whitespace-nowrap">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {dealFlowProjects.map((project) => (
                            <tr key={project.id} className="group hover:bg-zinc-50/50 transition-colors">
                                <td className="py-4 pr-4">
                                    <div className="flex items-center gap-4">
                                        <div className={cn("w-12 h-12 bg-white border border-zinc-100 rounded-xl flex items-center justify-center text-2xl shadow-sm shrink-0", project.isLocked && "blur-[2px] opacity-60")}>
                                            {project.isLocked ? <Lock className="w-5 h-5 text-zinc-400" /> : project.logo}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-zinc-900 flex items-center gap-1.5">
                                                {project.isLocked ? `Locked Deal #${project.id}` : project.name}
                                                {!project.isLocked && project.ipSecured && <ShieldCheck className="w-3.5 h-3.5 text-[#a1e2b6]" />}
                                            </h4>
                                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{project.industry}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 pr-4">
                                    <div className={cn("text-xs font-bold text-zinc-700 flex items-center gap-1.5 whitespace-nowrap", project.isLocked && "blur-[3px] select-none opacity-50")}>
                                        <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
                                        {project.isLocked ? "Đã ẩn" : project.metrics}
                                    </div>
                                </td>
                                <td className="py-4 pr-4">
                                    <div className={cn("whitespace-nowrap", project.isLocked && "blur-[3px] select-none opacity-50")}>
                                        <div className="text-sm font-black text-[#102c1e]">{project.ask}</div>
                                        <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Cổ phần: {project.equity}</div>
                                    </div>
                                </td>
                                <td className="py-4 pr-4">
                                    <div className="flex flex-col items-start gap-1.5 whitespace-nowrap">
                                        <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border border-[#102c1e]/10", project.statusColor)}>
                                            {project.status}
                                        </span>
                                        <span className="flex items-center gap-1 text-[10px] font-black text-[#102c1e] bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                                            <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {project.aiMatchScore}% Match
                                        </span>
                                    </div>
                                </td>
                                <td className="py-4 pl-4 text-right">
                                    <Button
                                        size="sm"
                                        // 3. Thêm dấu ? ở đây để code an toàn, không bao giờ bị crash
                                        onClick={() => onViewProject?.(project)}
                                        className={cn(
                                            "h-8 rounded-lg text-xs font-bold transition-all",
                                            project.isLocked
                                                ? "bg-[#102c1e] hover:bg-black text-white shadow-sm"
                                                : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                                        )}
                                    >
                                        {project.isLocked ? 'Yêu cầu mở khóa' : 'Chi tiết'}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};