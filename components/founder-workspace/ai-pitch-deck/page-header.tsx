import { Sparkles, FileCheck } from "lucide-react";

export const PageHeader = ({ overallProgress }: { overallProgress: number }) => (
    <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 bg-white p-6 rounded-2xl border border-kizuna-border shadow-sm">
            <div className="max-w-2xl">
                <h1 className="text-2xl font-bold text-[#102c1e] flex items-center gap-2 tracking-tight">
                    <Sparkles className="w-6 h-6 text-[#102c1e]" />
                    AI Policy Navigator
                </h1>
                <p className="text-kizuna-text-muted mt-2 text-base leading-relaxed">
                    Chuẩn hóa hồ sơ startup của bạn cho nhà đầu tư và các khoản hỗ trợ từ chính quyền (tuân thủ NQ-54 & QĐ-3344).
                </p>
            </div>

            <div className="bg-kizuna-surface border border-kizuna-border rounded-xl p-4 shadow-inner min-w-[260px]">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-[#102c1e] uppercase tracking-wider">Hoàn thiện Hồ sơ</span>
                    <span className="text-lg font-black text-[#102c1e]">{overallProgress}%</span>
                </div>
                <div className="h-2.5 w-full bg-white border border-kizuna-border rounded-full overflow-hidden shadow-inner">
                    <div
                        className="h-full bg-[#102c1e] rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${overallProgress}%` }}
                    />
                </div>
                <p className="text-xs font-medium text-kizuna-text-muted mt-2.5 flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-[#102c1e]" />
                    Hoàn thành 2 trên 4 Phần
                </p>
            </div>
        </div>
    </div>
);