import { CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

interface AIMatchTooltipProps {
    score: number;
    children: React.ReactNode;
}

export const AIMatchTooltip = ({ score, children }: AIMatchTooltipProps) => {
    return (
        <div className="relative group cursor-help">
            {/* Element được bọc (VD: Badge 94% Phù hợp) */}
            {children}

            {/* Tooltip Content - Bị ẩn mặc định, hiện khi Hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white border border-kizuna-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-3 border-b border-zinc-100 pb-2">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">Lý do Đề xuất</span>
                    </div>

                    <ul className="space-y-2 text-xs font-medium text-kizuna-text-main">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Khớp 100% khẩu vị ngành <b>EdTech / AI</b>.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Mức gọi vốn nằm trong ngân sách <b>$100K</b>.</span>
                        </li>
                        <li className="flex items-start gap-2 text-amber-700">
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                            <span><b>Tech Trust Score</b> (60/100) cần thẩm định thêm về khả năng scale.</span>
                        </li>
                    </ul>
                </div>
                {/* Mũi tên tam giác chỉ xuống */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white drop-shadow-sm"></div>
            </div>
        </div>
    );
};