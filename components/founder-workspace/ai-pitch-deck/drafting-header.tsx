import { ChevronRight, Sparkles } from "lucide-react";

export const DraftingHeader = ({ task, onBack }: { task: any, onBack: () => void }) => (
    <div className="mb-6 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div>
            <button
                onClick={onBack}
                className="text-[11px] text-kizuna-text-muted hover:text-[#102c1e] mb-1.5 flex items-center transition-colors font-bold uppercase tracking-tight"
            >
                <ChevronRight className="w-3.5 h-3.5 rotate-180 mr-1" /> Quay lại danh sách
            </button>
            <h1 className="text-xl font-bold text-[#102c1e] flex items-center gap-2">
                Soạn thảo: {task.title}
            </h1>
            <p className="text-kizuna-text-muted text-xs mt-0.5">{task.description}</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-kizuna-border shadow-sm">
            <div className="text-right">
                <p className="text-[9px] text-kizuna-text-muted font-bold uppercase tracking-wider">Tiến độ phần</p>
                <p className="text-base font-black text-[#102c1e] leading-none mt-0.5">{task.progress}%</p>
            </div>
            <div className="w-9 h-9 rounded-full border-[2.5px] border-kizuna-surface flex items-center justify-center relative">
                <svg className="absolute top-[-2.5px] left-[-2.5px] w-9 h-9 -rotate-90">
                    <circle
                        cx="18"
                        cy="18"
                        r="16.5"
                        fill="transparent"
                        stroke="#16452a"
                        strokeWidth="2.5"
                        strokeDasharray={103.6}
                        strokeDashoffset={103.6 - (103.6 * task.progress) / 100}
                        className="transition-all duration-1000 ease-in-out"
                        strokeLinecap="round"
                    />
                </svg>
                <Sparkles className="w-3.5 h-3.5 text-[#16452a]" />
            </div>
        </div>
    </div>
);