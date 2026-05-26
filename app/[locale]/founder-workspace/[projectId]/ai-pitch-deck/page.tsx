"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, FileText, Target, Zap, Rocket, PieChart, Users } from "lucide-react";

// --- IMPORT MODULES ĐÃ ĐƯỢC TÁCH NHỎ ---
import { PitchDeckEditor } from "@/components/founder-workspace/ai-pitch-deck/pitch-deck-editor";
import { AINavigatorSidebar } from "@/components/founder-workspace/ai-pitch-deck/ai-navigator-sidebar";
import { EndorsementManager } from "@/components/founder-workspace/ai-pitch-deck/endorsement-manager";
import { SlidePreviewModal } from "@/components/founder-workspace/ai-pitch-deck/slide-preview-modal";
import { PaywallModal } from "@/components/founder-workspace/ai-pitch-deck/paywall-modal";

const PITCH_DECK_SECTIONS = [
  { id: "summary", title: "Tóm tắt Dự án", icon: FileText, placeholder: "Mô tả ngắn gọn mô hình kinh doanh cốt lõi..." },
  { id: "problem", title: "Pain Point & Giải pháp", icon: Target, placeholder: "Xác định rõ vấn đề thị trường và giải pháp công nghệ..." },
  { id: "advantage", title: "Lợi thế cạnh tranh", icon: Zap, placeholder: "Điểm độc bản khiến đối thủ không thể sao chép..." },
  { id: "roadmap", title: "Lộ trình phát triển", icon: Rocket, placeholder: "Các cột mốc mục tiêu phân kỳ trong tương lai..." },
  { id: "finance", title: "Kế hoạch tài chính", icon: PieChart, placeholder: "Dự phóng doanh thu, chi phí và mô hình kiếm tiền..." },
  { id: "team", title: "Đội ngũ sáng lập", icon: Users, placeholder: "Năng lực, profile kinh nghiệm thực chiến của cấu trúc nhân sự..." },
];

const MOCK_MENTORS = [
  { id: 1, name: "TS. Alex Chen", role: "AI Expert / DUT Advisor", avatar: "https://i.pravatar.cc/150?u=alex" },
  { id: 2, name: "Sarah Johnson", role: "Venture Partner @ Kizuna", avatar: "https://i.pravatar.cc/150?u=sarah" }
];

export default function AIPitchDeckWorkspace() {
  const projectName = "SnapMoney";

  // --- STATES ---
  const [activeSection, setActiveSection] = useState(PITCH_DECK_SECTIONS[0].id);
  const [content, setContent] = useState<Record<string, string>>({});

  // Hạn mức cước (Giả lập theo Tier phân bổ doanh thu)
  const [aiPolishTokens, setAiPolishTokens] = useState(2); // Còn 2 lượt test báo đỏ
  const [slideGenerationsLeft, setSlideGenerationsLeft] = useState(1); // Còn 1 lượt Aha moment cho Free/Basic

  // Loading & Control States
  const [isPolishing, setIsPolishing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Modal Open/Close Controls
  const [paywall, setPaywall] = useState({ isOpen: false, title: "", desc: "" });
  const [showSlidePreview, setShowSlidePreview] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [endorsements, setEndorsements] = useState<any[]>([]);

  // Tự động đồng bộ dữ liệu thô ban đầu (Kế thừa từ submit-project Form)
  useEffect(() => {
    setContent({
      summary: "Hệ thống quản lý chi tiêu cá nhân tự động thông minh.",
      problem: "Người dùng tốn quá nhiều thời gian ghi chép thủ công các giao dịch tài chính hàng ngày."
    });
  }, []);

  // Xử lý scroll để đồng bộ trạng thái thanh Menu biên bên phải
  useEffect(() => {
    const handleScroll = () => {
      const sections = PITCH_DECK_SECTIONS.map(s => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 220;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // --- LOGIC XỬ LÝ AI POLISH (BẮT PAYWALL 50 LƯỢT) ---
  const handleAIPolish = (sectionId: string) => {
    if (aiPolishTokens <= 0) {
      setPaywall({
        isOpen: true,
        title: "Hết lượt Trợ lý AI Polish",
        desc: "Bạn đã sử dụng hết <b>50/50 lượt</b> tối ưu hóa văn phong tháng này của gói Basic. Nâng cấp lên gói <b>Premium (399k)</b> để mở khóa vô hạn quyền năng AI Co-pilot."
      });
      return;
    }

    setIsPolishing(true);
    setTimeout(() => {
      setAiPolishTokens(prev => prev - 1);
      setContent(prev => ({
        ...prev,
        [sectionId]: (prev[sectionId] || "") + "\n\n[AI Optimized]: Cấu trúc lại giải pháp tối ưu theo mô hình tinh gọn, tập trung chuẩn hóa trải nghiệm người dùng cuối để tối đa hóa chỉ số Retention Rate."
      }));
      setIsPolishing(false);
    }, 1200);
  };

  // --- LOGIC KẾT XUẤT SLIDE (BẮT PAYWALL SLIDE GENERATION) ---
  const handleGenerateSlides = () => {
    if (slideGenerationsLeft <= 0) {
      setPaywall({
        isOpen: true,
        title: "Giới hạn Kết xuất Slide",
        desc: "Bạn đã dùng hết số lượt khởi tạo Slide định kỳ của gói cước hiện tại. Nâng cấp lên gói <b>Premium (399k)</b> để mở khóa tính năng sinh Slide tự động không giới hạn."
      });
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      setSlideGenerationsLeft(prev => prev - 1);
      setIsGenerating(false);
      setShowSlidePreview(true); // Kích hoạt Aha Moment Slide View
    }, 1500);
  };

  return (
    <div className="relative min-h-screen pb-20">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#081810] tracking-tight">AI Pitch Deck Workspace</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Hệ thống tự động kế thừa dữ liệu và chuẩn hóa thành slide thuyết trình gọi vốn chuyên nghiệp.</p>
      </div>

      {/* Split View Layout 2 Cột */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cột trái: Form khối Editor + Khối Mentor Endorsement */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <PitchDeckEditor
            sections={PITCH_DECK_SECTIONS}
            activeSection={activeSection}
            content={content}
            onContentChange={(id, val) => setContent({ ...content, [id]: val })}
            onAIPolish={handleAIPolish}
            isPolishing={isPolishing}
          />

          <EndorsementManager
            endorsements={endorsements}
            onOpenRequestModal={() => setShowReviewModal(true)}
            onTriggerPaywall={() => setPaywall({
              isOpen: true,
              title: "Tính năng Ghim VIP (Priority Pass)",
              desc: "Đặc quyền ghim nhận xét của Mentor lên đầu hồ sơ chỉ dành riêng cho gói <b>Premium (399k)</b>, giúp bài gọi vốn của bạn lọt vào mắt xanh Investor nhanh nhất."
            })}
          />
        </div>

        {/* Cột phải: AI Sidebar điều hướng & track token */}
        <div className="lg:col-span-4">
          <AINavigatorSidebar
            sections={PITCH_DECK_SECTIONS}
            activeSection={activeSection}
            content={content}
            onNavigate={scrollToSection}
            aiPolishTokens={aiPolishTokens}
            slideGenerationsLeft={slideGenerationsLeft}
            onGenerateSlides={handleGenerateSlides}
            isGenerating={isGenerating}
          />
        </div>
      </div>

      {/* --- MODAL HIỂN THỊ TRÌNH CHIẾU SLIDE (AHA MOMENT) --- */}
      <SlidePreviewModal
        isOpen={showSlidePreview}
        onClose={() => setShowSlidePreview(false)}
        projectData={{ name: projectName, tagline: content.summary, ...content }}
        sections={PITCH_DECK_SECTIONS}
      />

      {/* --- MODAL CHẶN QUYỀN TRUY CẬP (PAYWALL SYSTEM) --- */}
      <PaywallModal
        isOpen={paywall.isOpen}
        onClose={() => setPaywall({ ...paywall, isOpen: false })}
        title={paywall.title}
        description={paywall.desc}
      />

      {/* --- MODAL CHỌN MENTOR GỬI YÊU CẦU --- */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-base font-bold text-[#081810] mb-2">Chọn Mentor nhận tài liệu</h3>
            <p className="text-xs text-slate-500 mb-4">Hồ sơ bản nháp hiện tại của bạn sẽ được gửi đồng bộ để Mentor đánh giá.</p>
            <div className="space-y-2 mb-6">
              {MOCK_MENTORS.map(m => (
                <button
                  key={m.id}
                  onClick={() => {
                    setEndorsements([{ ...m, content: "Ý tưởng sản phẩm thực tế, giải quyết triệt để bài toán nhức nhối của thị trường. Team có năng lực cốt lõi rất mạnh!" }]);
                    setShowReviewModal(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-zinc-200 hover:border-[#16452a] hover:bg-[#16452a]/5 text-left transition-colors"
                >
                  <img src={m.avatar} className="w-10 h-10 rounded-full border border-zinc-100" alt="avatar" />
                  <div>
                    <p className="text-sm font-bold text-[#081810]">{m.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{m.role}</p>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setShowReviewModal(false)} className="w-full py-2 text-xs font-bold text-zinc-500 hover:text-[#081810] transition-colors">Hủy bỏ</button>
          </div>
        </div>
      )}
    </div>
  );
}