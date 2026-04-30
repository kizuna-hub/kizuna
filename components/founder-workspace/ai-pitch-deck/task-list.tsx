import { BookOpen, CheckCircle2, ArrowRight } from "lucide-react";

export const TaskList = ({ tasks, onTaskClick }: { tasks: any[], onTaskClick: (index: number) => void }) => (
    <div className="space-y-4">
        <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-bold text-[#102c1e] flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Các phần của Hồ sơ Gọi vốn
            </h2>
            <span className="text-[11px] font-medium text-kizuna-text-muted bg-white border border-kizuna-border px-2.5 py-0.5 rounded-full shadow-sm">
                Soạn thảo từng bước
            </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
            {tasks.map((task, index) => {
                const isCompleted = task.progress === 100;
                return (
                    <div
                        key={index}
                        onClick={() => onTaskClick(index)}
                        className="bg-white border border-kizuna-border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#102c1e] hover:shadow-md transition-all duration-200 cursor-pointer group"
                    >
                        <div className="flex items-center gap-4 w-full">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${isCompleted ? 'bg-[#102c1e] text-white shadow-md' : 'bg-kizuna-surface text-kizuna-text-muted border border-kizuna-border group-hover:border-[#102c1e]/30 group-hover:text-[#102c1e]'}`}>
                                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="font-bold text-base">{index + 1}</span>}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-base tracking-tight text-[#102c1e]">
                                    {task.title}
                                </h3>
                                <p className="text-xs font-medium text-kizuna-text-muted mt-0.5">{task.description}</p>
                                <div className="mt-2 flex items-center gap-2 max-w-xs">
                                    <div className="flex-1 h-1.5 bg-kizuna-surface border border-kizuna-border/50 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ${isCompleted ? 'bg-[#102c1e]' : 'bg-[#102c1e]/60'}`}
                                            style={{ width: `${task.progress}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-bold text-[#102c1e] w-8">{task.progress}%</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center md:pl-4 md:border-l border-kizuna-border self-start md:self-stretch w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 mt-1 md:mt-0">
                            <button className={`w-full md:w-auto px-4 py-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${isCompleted ? 'bg-kizuna-surface text-[#102c1e] hover:bg-gray-100 border border-kizuna-border/50' : 'bg-[#102c1e] text-white hover:bg-[#16452a] shadow-sm group-hover:shadow-md'}`}>
                                {isCompleted ? 'Xem lại' : 'Tiếp tục'}
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);