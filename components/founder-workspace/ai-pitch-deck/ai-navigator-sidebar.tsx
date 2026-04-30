import { Sparkles, Gavel } from "lucide-react";

export const AINavigatorSidebar = () => (
    <div className="bg-white border border-kizuna-border rounded-xl p-4 flex flex-col shadow-sm h-fit sticky top-10">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-kizuna-border">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-[#16452a] border border-emerald-100">
                <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
                <h3 className="font-bold text-[#102c1e] text-sm">AI Navigator</h3>
                <p className="text-[10px] font-medium text-kizuna-text-muted">Trợ lý Soạn thảo Thông minh</p>
            </div>
        </div>

        <div className="flex flex-col gap-4">
            <button className="w-full py-2.5 bg-[#16452a] hover:bg-[#102c1e] text-white text-[11px] font-bold rounded-lg shadow-sm hover:shadow-md transition-all flex justify-center items-center gap-2 active:scale-[0.98]">
                <Sparkles className="w-3.5 h-3.5" /> Tự động Điền Nội dung
            </button>

            {/* Suggestion Card với màu Pastel nhẹ */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3.5">
                <h4 className="text-[10px] font-bold text-blue-700 flex items-center gap-1.5 mb-2 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> Gợi ý theo Ngữ cảnh
                </h4>
                <p className="text-xs text-blue-900/80 leading-relaxed">
                    Dựa trên <strong className="text-blue-900">Nghị quyết 54</strong>, bạn nên nhấn mạnh vào khả năng giải quyết các bài toán giao thông đô thị của thành phố Đà Nẵng để tăng điểm thẩm định.
                </p>
            </div>

            {/* Policy Reference Section */}
            <div className="bg-white border border-kizuna-border rounded-xl overflow-hidden flex flex-col">
                <div className="bg-kizuna-surface border-b border-kizuna-border p-2.5">
                    <h4 className="text-[10px] font-bold text-[#102c1e] flex items-center gap-1.5 uppercase tracking-wider">
                        <Gavel className="w-3 h-3" /> Tham khảo Chính sách
                    </h4>
                </div>
                <div className="p-3.5 text-xs text-kizuna-text-muted bg-white leading-relaxed max-h-[200px] overflow-y-auto scrollbar-thin">
                    <p className="mb-2 text-[#16452a] font-bold text-[10px] uppercase tracking-wide">Điều 4.2 - Nghị quyết 54/2021</p>
                    <p>
                        Các Startup nộp hồ sơ phải chứng minh sự phù hợp với các định hướng phát triển kinh tế bền vững và Thành phố thông minh.
                    </p>
                </div>
            </div>
        </div>
    </div>
);