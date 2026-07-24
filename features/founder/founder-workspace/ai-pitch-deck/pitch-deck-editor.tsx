"use client";
import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Section { id: string; title: string; placeholder: string; icon: React.ElementType; }

// Mock polished responses per section to demonstrate AI Polish works
const mockPolished: Record<string, string> = {
  summary: "Kizuna Hub là hệ sinh thái ươm tạo số dành cho startup trường đại học. Chúng tôi chuẩn hóa dữ liệu gọi vốn, kết nối nhà sáng lập với nhà đầu tư phù hợp, và bảo vệ tài sản trí tuệ — tất cả trong một workspace duy nhất. Thị trường mục tiêu: 4.2 triệu sinh viên đại học tại Đông Nam Á.",
  problem: "80% startup sinh viên thất bại do thiếu cơ sở hạ tầng hỗ trợ: không có pitch deck chuẩn, không có quy trình kết nối nhà đầu tư, và không có hệ thống bảo vệ IP. Chi phí ẩn của sự thiếu tổ chức này ước tính 12 tháng lãng phí và 60% cơ hội đầu tư bị mất.",
  advantage: "Rào cản cạnh tranh của chúng tôi gồm 3 lớp: (1) Dữ liệu độc quyền từ 40+ trường đại học đối tác, (2) AI Matchmaker được huấn luyện trên 10.000+ deal flow thực tế, (3) Hiệu ứng mạng lưới — mỗi nhà sáng lập gia nhập làm tăng chất lượng matching cho toàn hệ thống.",
};

interface PitchDeckEditorProps {
  sections: Section[];
  activeSection: string;
  content: Record<string, string>;
  onContentChange: (id: string, value: string) => void;
  onAIPolish: (id: string) => void;
  isPolishing: boolean;
}

export function PitchDeckEditor({ sections, activeSection, content, onContentChange, onAIPolish, isPolishing }: PitchDeckEditorProps) {
  const [polishingId, setPolishingId] = useState<string | null>(null);

  const handlePolish = async (id: string) => {
    setPolishingId(id);
    onAIPolish(id); // notify parent (decrements counter)
    // 1.5s loading then inject polished mock
    await new Promise(r => setTimeout(r, 1500));
    const polished = mockPolished[id] || (content[id] + " [AI đã tinh chỉnh: ngôn ngữ súc tích, số liệu cụ thể, loại bỏ vague phrasing.]");
    onContentChange(id, polished);
    setPolishingId(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {sections.map((section) => {
        const active = activeSection === section.id;
        const polishingThis = polishingId === section.id;
        return (
          <div
            key={section.id}
            id={section.id}
            className={cn(
              "rounded-xl border p-6 transition-all duration-300",
              active
                ? "bg-surface-1 border-ink shadow-framer-edge"
                : "bg-surface-1 border-hairline"
            )}
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className={cn("p-2 rounded-xl transition-colors", active ? "bg-surface-2 text-ink" : "bg-surface-2 text-ink-muted")}>
                <section.icon className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-ink">{section.title}</h2>
            </div>

            <textarea
              value={content[section.id] || ""}
              onChange={(e) => onContentChange(section.id, e.target.value)}
              placeholder={section.placeholder}
              className="w-full min-h-[160px] p-4 rounded-xl border border-hairline bg-surface-2 text-sm text-ink placeholder:text-ink-muted outline-none focus:border-ink focus:shadow-framer-focus resize-none transition-all leading-relaxed"
            />

            <div className="mt-4 flex items-center justify-end border-t border-hairline pt-3.5">
              <button
                onClick={() => handlePolish(section.id)}
                disabled={polishingThis || (isPolishing && polishingId !== section.id)}
                className="group relative flex items-center gap-1.5 px-4 h-9 rounded-pill bg-ink text-on-primary text-xs font-bold shadow-framer-edge hover:bg-ink/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                  {polishingThis
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <Sparkles className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />}
                </div>
                <span>{polishingThis ? 'Đang gọt giũa...' : 'AI Polish'}</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}