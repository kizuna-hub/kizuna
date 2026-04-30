'use client'

import { useState } from 'react'
import { ProjectCard, ProjectData } from '@/components/project-card'
import { TractionCard, TractionData } from '@/components/feed/traction-card'

const mockTractionData: TractionData[] = [
  {
    id: 't1',
    companyName: 'TrendEngine',
    companyLogo: 'T',
    companyInitials: 'TE',
    milestoneTag: 'Đạt được Traction',
    achievement: 'TrendEngine ghi nhận mức tăng trưởng chỉ số khổng lồ trong cuối tuần qua.',
    metricValue: '+5,000',
    metricLabel: 'Lượt quét (scans)!',
    type: 'traction',
    timeAgo: '2h trước',
    claps: 124,
  },
  {
    id: 't2',
    companyName: 'DUTCareers',
    companyLogo: 'D',
    companyInitials: 'DC',
    milestoneTag: 'Cột mốc hợp tác',
    achievement: 'DUTCareers đã ký kết thành công thỏa thuận đối tác',
    type: 'partnership',
    timeAgo: '5h trước',
    claps: 89,
  },
  {
    id: 't3',
    companyName: 'Unburden',
    companyLogo: 'U',
    companyInitials: 'UB',
    milestoneTag: 'Ra mắt sản phẩm',
    achievement: 'Unburden (Mental Health AI) vừa chính thức ra mắt phiên bản Beta MVP trên Kizuna Hub. ✨',
    type: 'launch',
    timeAgo: '1 ngày trước',
    claps: 256,
  },
]

const mockProjects: ProjectData[] = [
  {
    id: '1',
    name: 'MarketOS',
    description: 'Công cụ tự động hóa Marketing tích hợp AI dành cho startup sinh viên. Tùy chỉnh chiến dịch, phân tích dữ liệu và cung cấp customer insights trên cùng một nền tảng duy nhất.',
    logo: 'M',
    logoChar: 'M',
    logoBg: 'bg-blue-600',
    upvotes: 245,
    comments: 12,
    tags: ['MVP', 'AI', 'Marketing'],
    isBKSharkFinalist: true,
  },
  {
    id: '2',
    name: 'StudySync',
    description: 'Nền tảng học tập cộng tác kết nối sinh viên toàn cầu. Tích hợp tính năng chia sẻ tài liệu theo thời gian thực (real-time), nhóm học tập và peer-mentorship.',
    logo: 'S',
    logoChar: 'S',
    logoBg: 'bg-purple-600',
    upvotes: 189,
    comments: 24,
    tags: ['EdTech', 'Social', 'MVP'],
    isBKSharkFinalist: true,
  },
  {
    id: '3',
    name: 'CropGuard',
    description: 'Giải pháp ứng dụng IoT + AI trong nông nghiệp thông minh. Giám sát cây trồng theo thời gian thực, phát hiện mầm bệnh và dự báo sản lượng mùa màng.',
    logo: 'C',
    logoChar: 'C',
    logoBg: 'bg-green-600',
    upvotes: 156,
    comments: 8,
    tags: ['AgriTech', 'IoT', 'AI'],
  },
  {
    id: '4',
    name: 'ImpactMap',
    description: 'Nền tảng kết nối doanh nghiệp cung cấp giải pháp xã hội với các nhà đầu tư impact investors. Theo dõi chỉ số, quản lý vòng gọi vốn và nhân rộng mô hình.',
    logo: 'I',
    logoChar: 'I',
    logoBg: 'bg-red-600',
    upvotes: 128,
    comments: 16,
    tags: ['SocialImpact', 'B2B', 'Funding'],
  },
  {
    id: '5',
    name: 'VoiceCode',
    description: 'IDE lập trình bằng giọng nói (Voice-to-code) dành cho lập trình viên. Hỗ trợ tạo toàn bộ ứng dụng chỉ bằng câu lệnh thoại. Hoàn hảo cho trợ năng (accessibility).',
    logo: 'V',
    logoChar: 'V',
    logoBg: 'bg-indigo-600',
    upvotes: 312,
    comments: 31,
    tags: ['DevTools', 'AI', 'Accessibility'],
  },
]

export function MainFeed() {
  const [activeTab, setActiveTab] = useState<'discover' | 'live'>('discover')

  return (
    <div className="pt-6 pb-12">
      <div className="w-full">
        {/* Hero Banner */}
        <div className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-kizuna-primary to-[#06110a] border border-white/10 p-10 shadow-[0_20px_40px_-15px_rgba(16,44,30,0.4)]">
          {/* 1. Main Glow: Ánh sáng trắng mờ hắt từ góc trên phải */}
          <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-white/5 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>

          {/* 2. Sub Glow: Ánh sáng xanh ngọc nhẹ hắt từ dưới lên tạo chiều sâu */}
          <div className="absolute bottom-0 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mb-20 pointer-events-none"></div>

          <div className="relative z-10">
            <h2 className="text-4xl font-serif font-medium text-white mb-4 tracking-tight">
              Khám phá Top 10 Dự án Chung kết BK SHARK 2026 🦈
            </h2>
            <p className="text-lg text-zinc-300 mb-8 font-light max-w-2xl leading-relaxed">
              Những startup sinh viên sáng giá nhất đã sẵn sàng gọi vốn vòng hạt giống. Deal flow độc quyền dành cho các nhà đầu tư đã xác thực.
            </p>

            {/* Nút bấm (Inverted CTA): Nền trắng, chữ xanh, không hover theo rule, chỉ có hiệu ứng click nhẹ */}
            <button className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-kizuna-primary font-semibold rounded-xl border-none shadow-sm active:scale-95 transition-transform duration-200">
              Xem Pitch Deck
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Header & Main Tabs */}
        <div className="mb-8">
          <div className="flex items-center gap-6 border-b border-kizuna-border">
            <button
              onClick={() => setActiveTab('discover')}
              className={`pb-4 text-2xl font-bold ${activeTab === 'discover'
                ? 'text-kizuna-text-main border-b-2 border-kizuna-primary'
                : 'text-kizuna-text-muted hover:text-kizuna-text-main'
                }`}
            >
              Khám phá
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`pb-4 text-2xl font-bold flex items-center gap-2 ${activeTab === 'live'
                ? 'text-kizuna-text-main border-b-2 border-kizuna-primary'
                : 'text-kizuna-text-muted hover:text-kizuna-text-main'
                }`}
            >
              Cập nhật trực tiếp
              <span className="relative flex h-3 w-3 ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"></span>
              </span>
            </button>
          </div>
          <p className="text-lg text-kizuna-text-muted mt-4">
            {activeTab === 'discover'
              ? 'Khám phá những dự án đột phá tiếp theo từ sinh viên đại học.'
              : 'Dòng thời gian cập nhật liên tục về traction, cột mốc và gọi vốn từ các startup trên mạng lưới.'}
          </p>
        </div>

        {activeTab === 'discover' ? (
          <div>
            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-kizuna-border pb-4 mb-4">
              <button className="px-4 py-2 rounded-lg bg-kizuna-primary/10 text-kizuna-primary border border-kizuna-primary/20 text-sm font-medium hover:bg-kizuna-primary/20 transition-colors">
                Hôm nay
              </button>
              <button className="px-4 py-2 rounded-lg text-kizuna-text-muted hover:text-kizuna-text-main hover:bg-kizuna-surface border border-transparent text-sm font-medium transition-colors">
                Tuần này
              </button>
              <button className="px-4 py-2 rounded-lg text-kizuna-text-muted hover:text-kizuna-text-main hover:bg-kizuna-surface border border-transparent text-sm font-medium transition-colors">
                Tháng này
              </button>
              <button className="px-4 py-2 rounded-lg text-kizuna-text-muted hover:text-kizuna-text-main hover:bg-kizuna-surface border border-transparent text-sm font-medium transition-colors">
                Mọi thời điểm
              </button>
            </div>

            {/* Projects List */}
            <div className="space-y-4">
              {mockProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        ) : (
          <div className="relative py-4">
            {/* Central Glowing Line */}
            <div className="absolute top-0 bottom-0 left-[27px] md:left-8 w-[2px] bg-gradient-to-b from-kizuna-primary/0 via-kizuna-primary/50 to-kizuna-primary/0 shadow-[0_0_8px_rgba(16,44,30,0.2)]"></div>

            <div className="space-y-6 relative">
              {mockTractionData.map((traction, i) => (
                <TractionCard key={traction.id} data={traction} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
