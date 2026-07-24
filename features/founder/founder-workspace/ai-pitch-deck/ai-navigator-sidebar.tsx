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

export function AINavigatorSidebar({ sections, activeSection, content, onNavigate, aiPolishTokens, slideGenerationsLeft, onGenerateSlides, isGenerating }: AINavigatorSidebarProps) {
  return (
    <div className="sticky top-10 flex flex-col gap-5">
      {/* Primary CTA: Generate Slides */}
      <button
        onClick={onGenerateSlides}
        disabled={isGenerating}
        className="w-full py-4 bg-ink text-on-primary text-sm font-black rounded-xl shadow-framer-edge hover:bg-ink/90 transition-all flex justify-center items-center gap-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isGenerating
          ? <span className="flex items-center gap-2 text-xs font-bold">Cấu trúc hóa Slide...</span>
          : <><Play className="w-4 h-4 fill-on-primary" /> Khởi tạo Slide Pitch Deck</>}
      </button>

      {/* Usage quota tracker */}
      <div className="bg-surface-1 border border-hairline rounded-xl p-5 space-y-4 shadow-framer-edge">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-xs font-bold text-ink flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-ink-muted" /> Lượt Trợ lý AI Polish</h3>
            <span className="text-xs font-bold text-ink-muted">{aiPolishTokens}/50</span>
          </div>
          <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full transition-all", aiPolishTokens < 5 ? "bg-red-500" : "bg-ink")} style={{ width: (aiPolishTokens / 50 * 100) + '%' }} />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-xs font-bold text-ink flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-ink-muted" /> Kết xuất Slide tháng</h3>
            <span className="text-xs font-bold text-ink-muted">{slideGenerationsLeft}/3</span>
          </div>
          <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
            <div className="h-full bg-ink-muted rounded-full transition-all" style={{ width: (slideGenerationsLeft / 3 * 100) + '%' }} />
          </div>
        </div>
      </div>

      {/* Section navigator */}
      <div className="bg-surface-1 border border-hairline rounded-xl p-4 shadow-framer-edge">
        <h3 className="text-[10px] font-bold text-ink-muted uppercase tracking-wider mb-3 px-1">Cấu trúc bài thuyết trình</h3>
        <div className="flex flex-col gap-0.5">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => onNavigate(s.id)}
              className={cn(
                "text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2.5",
                activeSection === s.id ? "bg-surface-2 text-ink font-bold" : "text-ink-muted hover:bg-surface-2 hover:text-ink"
              )}
            >
              {content[s.id]?.trim()
                ? <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0" />
                : <div className="w-4 h-4 border-2 border-hairline rounded-full shrink-0" />}
              <span className="truncate">{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contextual AI hint */}
      <div className="bg-surface-2 border border-hairline text-ink rounded-xl p-5 shadow-framer-edge relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-ink/5 rounded-full blur-xl" />
        <h4 className="text-[10px] font-black text-ink-muted uppercase tracking-wider mb-3">AI Context Hint</h4>
        <p className="text-xs font-medium leading-relaxed text-ink-muted">
          {activeSection === "summary" && "Slide tóm tắt cần gói gọn giá trị cốt lõi trong tối đa 3 dòng. Tập trung trả lời: Bạn làm cái gì, cho ai?"}
          {activeSection === "problem" && "Nhà đầu tư tìm kiếm các nỗi đau có thể định lượng. Hãy chuyển mô tả định tính thành dữ liệu thực tế."}
          {activeSection === "advantage" && "Tránh liệt kê tính năng. Tập trung giải thích rào cản công nghệ hoặc lợi thế mạng lưới."}
          {!["summary","problem","advantage"].includes(activeSection) && "Hãy giữ độ dài văn bản vừa phải. AI sẽ dựa vào đây để thiết kế bố cục slide tinh gọn."}
        </p>
      </div>
    </div>
  );
}
