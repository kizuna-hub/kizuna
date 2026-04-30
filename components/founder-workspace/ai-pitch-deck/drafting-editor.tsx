import { CheckCircle2, FileCheck, Lock } from "lucide-react";

export const DraftingEditor = ({ task }: { task: any }) => {
    const isCompleted = task.progress === 100;

    return (
        <div className="bg-white border border-kizuna-border rounded-xl p-5 flex flex-col shadow-sm h-full">
            <label className="block text-xs font-bold text-[#102c1e] mb-3 flex items-center justify-between">
                <span className="uppercase tracking-wide">Bản nháp Nội dung</span>
                {isCompleted && (
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md border border-emerald-100 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Đã chuẩn hóa
                    </span>
                )}
            </label>

            <textarea
                className="w-full flex-1 min-h-[450px] p-4 rounded-lg border border-kizuna-border bg-kizuna-surface focus:outline-none focus:ring-2 focus:ring-[#16452a]/10 focus:border-[#16452a] transition-all resize-none text-sm text-kizuna-text-main leading-relaxed shadow-inner"
                placeholder="Bắt đầu nhập nội dung hoặc sử dụng Trợ lý AI..."
                defaultValue={isCompleted ? "Phần này đã được chuẩn hóa dựa trên các quy định hỗ trợ startup của Nghị quyết 54. Startup đã chứng minh được tính khả thi về mặt kỹ thuật và mô hình kinh doanh có tác động xã hội tích cực tại địa phương." : ""}
            />

            <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-kizuna-border/50">
                <p className="text-[11px] font-medium text-kizuna-text-muted flex items-center gap-1.5 bg-kizuna-surface px-2.5 py-1.5 rounded-md">
                    <FileCheck className="w-3.5 h-3.5 text-[#16452a]" /> Đang tự động lưu nháp...
                </p>
                <div className="flex flex-wrap gap-2">
                    <button className="px-4 py-2 text-[11px] font-bold text-[#102c1e] border border-kizuna-border bg-white rounded-lg hover:bg-kizuna-surface transition-all">
                        Lưu Bản nháp
                    </button>
                    <button className="px-4 py-2 text-[11px] font-bold text-white bg-[#16452a] hover:bg-[#102c1e] rounded-lg shadow-sm transition-all flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" /> Khóa & Đồng bộ Ledger
                    </button>
                </div>
            </div>
        </div>
    );
};