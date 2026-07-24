"use client";

import { use } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { MentorHeroSidebar } from "@/components/mentor/mentor-profile/mentor-hero-sidebar";
import { AIMatchCard } from "@/components/mentor/mentor-profile/ai-match-card";
import { MentorMetrics } from "@/components/mentor/mentor-profile/mentor-metrics";
import { MentorDetailTabs } from "@/components/mentor/mentor-profile/mentor-detail-tabs";

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  avatar: string;
  rating: number;
  sessions: number;
  bio: string;
  expertise: string[];
  targetAudience: string;
  philosophy: string;
  industry: string;
  availability: string;
  languages: string[];
  aiMatch: string;
  projects: {
    name: string;
    logo: string;
    description: string;
    award: string;
    funding: string;
  }[];
}

const MOCK_MENTOR: Mentor = {
  id: "1",
  name: "Dr. Alex Chen",
  role: "Giám đốc Chiến lược Sản phẩm",
  company: "DNES",
  location: "Đà Nẵng, Việt Nam",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  rating: 4.9,
  sessions: 120,
  bio: "Đam mê giúp đỡ các startup giai đoạn đầu định vị thị trường, đặc biệt trong lĩnh vực AI và SaaS. Tôi có hơn 15 năm kinh nghiệm trong ngành công nghệ và yêu thích làm việc với các nhà sáng lập nhiệt huyết để xây dựng sản phẩm bền vững.",
  expertise: ["#AI", "#SaaS", "#EdTech", "#NQ54"],
  targetAudience: "Dự án giai đoạn Seed có MVP và đội ngũ kỹ thuật in-house.",
  philosophy: "Mentorship không phải là dạy cách làm, mà là đặt đúng câu hỏi để Founder tự nhận ra vấn đề. Tôi đề cao tính minh bạch, kỷ luật và khả năng thực thi nhanh.",
  industry: "AI & Công nghệ",
  availability: "Sẵn sàng cố vấn",
  languages: ["Tiếng Anh", "Tiếng Việt"],
  aiMatch: "Cố vấn có kinh nghiệm sâu rộng về SaaS và AI, rất phù hợp với sản phẩm công nghệ đang trong giai đoạn xây dựng MVP của bạn.",
  projects: [
    {
      name: "AutoMKT (SaaS)",
      logo: "A",
      description: "Hệ thống tự động hóa marketing bằng AI cho doanh nghiệp SMEs.",
      award: "Giải Nhất BK Shark 2023",
      funding: "$250K Seed Round"
    },
    {
      name: "EduNova",
      logo: "E",
      description: "Nền tảng học tập thích ứng cá nhân hóa cho học sinh THPT.[cite: 1]",
      award: "Top 10 Startup Wheel",
      funding: "$100K Pre-Seed"
    }
  ]
};

const FUNDING_DATA = [
  { month: 'T1', amount: 50 }, { month: 'T2', amount: 150 }, { month: 'T3', amount: 200 },
  { month: 'T4', amount: 350 }, { month: 'T5', amount: 500 },
];

const SUCCESS_RATE_DATA = [
  { name: 'Thành công', value: 95, color: '#16452a' },
  { name: 'Khác', value: 5, color: '#e4e4e7' },
];

export function MentorProfileScreen({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const resolvedParams = use(params);
  const mentor: Mentor = MOCK_MENTOR;

  return (
    <div className="bg-kizuna-surface min-h-screen pt-10 pb-16">
      <div className="container mx-auto px-4 max-w-6xl space-y-6">

        {/* Nút quay lại */}
        <div className="mb-4">
          <Link
            href={`/${resolvedParams.locale}/founder-workspace/venture-connect`}
            className="flex items-center text-[11px] font-bold text-kizuna-text-muted hover:text-kizuna-primary uppercase tracking-widest transition-colors w-fit"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại Venture Connect
          </Link>
        </div>

        {/* 
            FIX LỖI TẠI ĐÂY: 
            1. items-start: để các cột không bị kéo dài bằng nhau.
            2. relative: làm mốc cho sticky.
        */}
        <div className="flex flex-col md:flex-row gap-8 items-start relative">

          {/* 
              CỘT TRÁI (SIDEBAR):
              - md:w-[350px]: Đặt cứng độ rộng tối thiểu cho Sidebar (không dùng % nữa cho an toàn).
              - flex-none: QUAN TRỌNG NHẤT - Ngăn Flexbox bóp nghẹt cột này.
              - sticky & top-28: Giữ cố định khi scroll.
          */}
          <aside className="w-full md:w-[350px] flex-none sticky top-28 h-fit self-start z-10">
            <MentorHeroSidebar mentor={mentor} />
          </aside>

          {/* 
              CỘT PHẢI (CONTENT):
              - flex-1: Chiếm toàn bộ phần không gian còn lại.
              - min-w-0: Ngăn biểu đồ (Recharts) làm tràn layout.
          */}
          <main className="flex-1 min-w-0 space-y-8">
            <AIMatchCard matchText={mentor.aiMatch} />
            <MentorMetrics fundingData={FUNDING_DATA} successData={SUCCESS_RATE_DATA} />
            <MentorDetailTabs mentor={mentor} />
          </main>

        </div>
      </div>
    </div>
  );
}