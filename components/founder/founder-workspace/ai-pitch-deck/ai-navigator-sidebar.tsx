"use client";

import React from "react";
import { Sparkles, Zap, CheckCircle2, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface AINavigatorSidebarProps {
    sections: any[];
    activeSection: string;
    content: Record<string, string>;
    onNavigate: (id: string) => void;
    aiPolishTokens: number;
    slideGenerationsLeft: number;
    onGenerateSlides: () => void;
    isGenerating: boolean;
}

export function AINavigatorSidebar({
    sections,
    activeSection,
    content,
    onNavigate,
    aiPolishTokens,
    slideGenerationsLeft,
    onGenerateSlides,
    isGenerating
}: AINavigatorSidebarProps) {
    return (
        <div className="sticky top-10 flex flex-col gap-5">
            {/* Core Action: Generate Slides Button (Aha Moment Trigger) */}
            <button
                onClick={onGenerateSlides}
                disabled={isGenerating}
                className="w-full py-4 bg-[#16452a] hover:bg-[#0a1c13] text-white text-sm font-black rounded-xl shadow-md hover:shadow-xl transition-all flex justify-center items-center gap-2 active:scale-[0.98] border border-[#16452a]"
            >
                {isGenerating ? (
                    <span className="flex items-center gap-2 text-xs font-bold">Cấu trúc hóa Slide...</span>
                ) : (
                    <>
                        <Play className="w-4 h-4 fill-white" /> Khởi tạo Slide Pitch Deck
                    </>
                )}
            </button>

            {/* Subscription Limits Status Tracker */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4">
                {/* AI Polish Token */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#16452a]" /> Lượt Trợ lý AI Polish</h3>
                        <span className="text-xs font-bold text-slate-500">{aiPolishTokens}/50</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all", aiPolishTokens < 5 ? "bg-red-500" : "bg-[#16452a]")} style={{ width: `${(aiPolishTokens / 50) * 100}%` }} />
                    </div>
                </div>

                {/* Slide Gen Token */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-500" /> Kết xuất Slide tháng</h3>
                        <span className="text-xs font-bold text-slate-500">{slideGenerationsLeft}/3</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${(slideGenerationsLeft / 3) * 100}%` }} />
                    </div>
                </div>
            </div>

            {/* Structural Form Sections List */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 px-1">Cấu trúc bài thuyết trình</h3>
                <div className="flex flex-col gap-1">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => onNavigate(section.id)}
                            className={cn(
                                "text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2.5",
                                activeSection === section.id ? "bg-[#16452a]/5 text-[#16452a]" : "text-slate-600 hover:bg-zinc-50"
                            )}
                        >
                            {content[section.id]?.trim() ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : (
                                <div className="w-4 h-4 border-2 border-zinc-300 rounded-full shrink-0" />
                            )}
                            <span className="truncate">{section.title}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Dynamic Contextual AI Helper Hints */}
            <div className="bg-[#16452a] text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-xl" />
                <h4 className="text-[10px] font-black text-[#16452a] bg-white inline-block px-2 py-0.5 rounded uppercase tracking-wider mb-3">AI Context Hint</h4>
                <p className="text-xs font-medium leading-relaxed text-white/90 animate-in fade-in duration-300">
                    {activeSection === "summary" && "Slide tóm tắt cần gói gọn giá trị cốt lõi trong tối đa 3 dòng. Tập trung trả lời câu hỏi: Bạn làm cái gì, cho ai?"}
                    {activeSection === "problem" && "Nhà đầu tư tìm kiếm các nỗi đau có thể định lượng bằng con số. Hãy chuyển các mô tả định tính thành dữ liệu thực tế."}
                    {activeSection === "advantage" && "Tránh liệt kê tính năng. Hãy tập trung giải thích rào cản công nghệ hoặc lợi thế mạng lưới khiến đối thủ không thể copy bạn."}
                    {activeSection !== "summary" && activeSection !== "problem" && activeSection !== "advantage" && "Hãy giữ độ dài văn bản vừa phải. AI sẽ dựa vào đây để thiết kế bố cục slide tinh gọn, thoáng đãng."}
                </p>
            </div>
        </div>
    );
}