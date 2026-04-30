'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Lock, Calendar, Star, Filter, Phone, ChevronRight, Video, Clock } from 'lucide-react';

const topMatches = [
    {
        id: 1,
        name: 'Elena Rodriguez',
        role: 'Nhà sáng lập SaaS & Nhà đầu tư thiên thần',
        matchScore: '98%',
        tier: 'Chuyên gia/CEO',
        tags: ['#SaaS', '#Định_giá', '#Gọi_vốn'],
        socialProof: 'Đã hỗ trợ 5 dự án sinh viên',
        initials: 'ER'
    },
    {
        id: 2,
        name: 'TS. Trần Minh',
        role: 'Trưởng khoa CNTT',
        matchScore: '95%',
        tier: 'Giảng viên chuyên môn',
        tags: ['#Fintech', '#Hạ_tầng', '#NQ54'],
        socialProof: 'Mentor của 2 dự án giải Nhất',
        initials: 'TM'
    },
    {
        id: 3,
        name: 'Lê Hoàng',
        role: 'Co-founder X-Tech',
        matchScore: '92%',
        tier: 'Pioneer Founder',
        tags: ['#B2B', '#GTM', '#AI_Agent'],
        socialProof: 'Đã xác thực IP Ledger',
        initials: 'LH'
    }
];

const activeRequests = [
    {
        id: 1,
        name: 'David Kim',
        role: 'Chuyên gia Tăng trưởng Marketing',
        action: 'Hành động: Cần gửi AI Pitch Deck',
        color: 'text-kizuna-primary bg-kizuna-primary/10 border-kizuna-primary/20',
        initials: 'DK'
    },
    {
        id: 2,
        name: 'Priya Patel',
        role: 'Cố vấn Công nghệ',
        action: 'Đang chờ Mentor phản hồi',
        color: 'text-kizuna-text-main bg-kizuna-surface border-kizuna-border',
        initials: 'PP'
    },
    {
        id: 3,
        name: 'James Wilson',
        role: 'Chuyên viên Sale Doanh nghiệp',
        action: 'Chờ lên lịch hẹn 1-1',
        color: 'text-kizuna-text-main bg-kizuna-surface border-kizuna-border',
        initials: 'JW'
    }
];

export default function VentureConnectDashboard() {
    return (
        <div className="min-h-screen bg-kizuna-surface text-kizuna-text-main font-sans p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header & Readiness Section */}
                <section className="flex flex-col lg:flex-row justify-between items-start gap-8">
                    <div className="space-y-4 flex-1">
                        <h1 className="text-4xl font-light tracking-tight text-kizuna-text-main">
                            Venture Connect
                        </h1>
                        <p className="text-kizuna-text-muted text-lg">
                            Mở rộng mạng lưới. Chốt deal chiến lược. Khai phá tiềm năng khởi nghiệp.
                        </p>

                        {/* AI Matching Tuner */}
                        <div className="flex items-center gap-3 mt-6 p-2 bg-kizuna-canvas/70 backdrop-blur-md rounded-2xl shadow-sm border border-kizuna-border w-fit">
                            <span className="pl-3 text-kizuna-text-muted"><Filter size={18} /></span>
                            <select className="bg-transparent border-none focus:ring-0 text-sm font-medium text-kizuna-text-main w-full cursor-pointer outline-none py-2 pr-4">
                                <option>Mục tiêu: Cần tìm Co-founder kỹ thuật</option>
                                <option>Mục tiêu: Cần gọi vốn Seed</option>
                                <option>Mục tiêu: Cần Mentor chính sách (NQ54)</option>
                            </select>
                        </div>
                    </div>

                    {/* Readiness Score Widget (Neumorphic) */}
                    <div className="w-full lg:w-96 bg-kizuna-canvas p-6 rounded-3xl shadow-sm border border-kizuna-border flex items-center gap-6">
                        <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <path className="text-kizuna-surface" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className="text-kizuna-primary" strokeWidth="3" strokeDasharray="85, 100" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeLinecap="round" />
                            </svg>
                            <span className="absolute text-sm font-semibold text-kizuna-text-main">85%</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-kizuna-text-main">Độ hoàn thiện Pitch Deck</h3>
                            <p className="text-xs text-kizuna-text-muted mt-1">
                                Sử dụng <span className="text-kizuna-primary font-medium cursor-pointer hover:underline">AI Policy Navigator</span> để đạt 100% trước khi kết nối Mentor cấp cao.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Top AI Matches (Glassmorphism) */}
                <section className="space-y-6">
                    <div className="flex justify-between items-end">
                        <h2 className="text-2xl font-medium tracking-tight text-kizuna-text-main">Gợi ý Mentor Phù hợp nhất</h2>
                        <button className="text-sm font-medium text-kizuna-text-muted hover:text-kizuna-primary transition-colors">Xem tất cả</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {topMatches.map((match) => (
                            <div key={match.id} className="group relative bg-kizuna-canvas/40 backdrop-blur-xl border border-kizuna-border/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-kizuna-primary/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

                                <div className="relative z-10 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-full bg-kizuna-surface flex items-center justify-center border border-kizuna-border shadow-sm shrink-0">
                                                <span className="font-bold text-kizuna-text-muted text-sm">{match.initials}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-kizuna-text-main line-clamp-1">{match.name}</h4>
                                                <Badge variant="secondary" className="bg-kizuna-primary/10 text-kizuna-primary text-[10px] px-2 py-0 border-transparent mt-1 hover:bg-kizuna-primary/20 transition-colors">
                                                    {match.tier}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end shrink-0">
                                            <span className="text-xl font-light text-kizuna-primary">{match.matchScore}</span>
                                            <span className="text-[10px] uppercase tracking-wider text-kizuna-text-muted font-semibold">Phù hợp</span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-kizuna-text-muted line-clamp-1 h-4">{match.role}</p>

                                    <div className="flex flex-wrap gap-2">
                                        {match.tags.map(tag => (
                                            <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-transparent text-kizuna-text-muted border border-kizuna-border cursor-default">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-kizuna-text-muted bg-kizuna-surface p-2 rounded-lg border border-kizuna-border">
                                        <Star size={14} className="text-kizuna-primary fill-kizuna-primary/20 shrink-0" />
                                        <span className="truncate">{match.socialProof}</span>
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <Button asChild variant="outline" className="flex-1 bg-transparent border-kizuna-border text-kizuna-text-main hover:bg-kizuna-surface rounded-xl transition-all">
                                            <Link href={`/mentor-profile/${match.id}`}>Xem Hồ Sơ</Link>
                                        </Button>
                                        <Button className="flex-1 bg-kizuna-primary text-white rounded-xl shadow-md hover:opacity-90 transition-all">
                                            Kết nối ngay
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Connection Pipeline & Upcoming Events */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Action-Oriented CRM Pipeline */}
                    <section className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-medium tracking-tight text-kizuna-text-main">Kết nối Đang theo dõi</h2>
                        <div className="bg-kizuna-canvas rounded-3xl p-6 shadow-sm border border-kizuna-border">
                            <div className="space-y-4">
                                {activeRequests.map((item) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 hover:bg-kizuna-surface rounded-2xl transition-colors border border-transparent hover:border-kizuna-border group gap-4">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-10 h-10 rounded-full bg-kizuna-surface flex items-center justify-center shrink-0 border border-kizuna-border">
                                                <span className="font-semibold text-kizuna-text-muted text-xs">{item.initials}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-kizuna-text-main">{item.name}</h4>
                                                <p className="text-xs text-kizuna-text-muted">{item.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto sm:overflow-visible no-scrollbar pb-2 sm:pb-0">
                                            <span className={`text-xs px-3 py-1.5 rounded-full font-medium border shrink-0 ${item.color}`}>
                                                {item.action}
                                            </span>
                                            <button className="p-2 text-kizuna-text-muted hover:text-kizuna-primary hover:bg-kizuna-primary/10 rounded-full transition-colors flex items-center gap-2 group/btn shrink-0" title="Cấp quyền truy cập IP Ledger">
                                                <Lock size={16} />
                                                <span className="text-xs hidden group-hover/btn:block font-medium">Cấp quyền IP</span>
                                            </button>
                                            <button className="p-2 text-kizuna-text-muted hover:text-kizuna-text-main transition-colors shrink-0">
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Upcoming Events / Meeting Prep */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-medium tracking-tight text-kizuna-text-main">Sự kiện Sắp tới</h2>
                        <div className="bg-kizuna-canvas rounded-3xl p-6 shadow-sm border border-kizuna-border space-y-6">

                            <div className="flex gap-4">
                                <div className="flex flex-col items-center min-w-[3rem]">
                                    <span className="text-xs text-kizuna-text-muted font-semibold uppercase tracking-wider">Th 10</span>
                                    <span className="text-2xl font-light text-kizuna-text-main">24</span>
                                </div>
                                <div className="flex-1 bg-kizuna-surface p-4 rounded-2xl border border-kizuna-border space-y-3">
                                    <div className="flex justify-between items-start gap-4">
                                        <h4 className="font-medium text-sm text-kizuna-text-main leading-tight">1:1 Call với Elena Rodriguez</h4>
                                        <span className="text-xs text-kizuna-text-muted flex items-center gap-1 shrink-0"><Clock size={12} /> 10:00 Sáng</span>
                                    </div>
                                    <div className="bg-kizuna-canvas p-3 rounded-xl border border-kizuna-border shadow-sm">
                                        <p className="text-xs font-semibold text-kizuna-text-muted mb-2">Chuẩn bị trước cuộc họp:</p>
                                        <div className="flex items-center gap-2 text-xs text-kizuna-text-muted hover:text-kizuna-text-main transition-colors cursor-pointer">
                                            <CheckCircle2 size={14} className="text-kizuna-primary shrink-0" />
                                            <span className="underline decoration-kizuna-border underline-offset-2">Tài liệu đính kèm: AI Pitch Deck v2.1</span>
                                        </div>
                                    </div>
                                    <Button className="w-full flex items-center justify-center gap-2 bg-kizuna-primary text-white rounded-xl h-9 text-xs shadow-sm hover:opacity-90 transition-all">
                                        <Video className="w-3.5 h-3.5" />
                                        Tham gia cuộc gọi
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </section>
                </div>

                {/* Pioneer Founders Spotlight */}
                <section className="space-y-6">
                    <div className="flex justify-between items-end">
                        <h2 className="text-2xl font-medium tracking-tight text-kizuna-text-main">Gương mặt Tiên phong (Pioneer Founders)</h2>
                        <span className="text-sm text-kizuna-text-muted hidden md:block">Văn hóa Pay It Forward - Các cuộc gọi 15 phút</span>
                    </div>
                    <div className="flex overflow-x-auto gap-4 pb-6 snap-x no-scrollbar">
                        {[
                            { name: 'Khoa Phạm', status: "Gọi vốn Pre-Seed '25", quote: 'Sẵn sàng review kiến trúc hệ thống AI và chiến lược GTM sớm.', initials: 'KP' },
                            { name: 'Mai Linh', status: 'Founder TechEd', quote: 'Hỗ trợ định hướng ứng dụng AI vào giáo dục.', initials: 'ML' },
                            { name: 'Hoàng Vũ', status: 'Giải Nhất Kizuna 2024', quote: 'Tư vấn kinh nghiệm chuẩn bị hồ sơ gọi vốn Seed.', initials: 'HV' },
                            { name: 'Tuấn Anh', status: 'CTO Finnovate', quote: 'Giải đáp vướng mắc kỹ thuật & tích hợp thanh toán.', initials: 'TA' }
                        ].map((pioneer, i) => (
                            <div key={i} className="snap-start shrink-0 w-72 bg-kizuna-canvas border border-kizuna-border rounded-3xl p-5 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-kizuna-surface flex items-center justify-center text-kizuna-text-main font-bold text-sm shrink-0 border border-kizuna-border shadow-sm transition-transform group-hover:scale-105">
                                        {pioneer.initials}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm text-kizuna-text-main">{pioneer.name}</h4>
                                        <p className="text-xs text-kizuna-text-muted">{pioneer.status}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-kizuna-text-muted line-clamp-2 mb-5 italic min-h-[2rem]">"{pioneer.quote}"</p>
                                <Button variant="secondary" className="w-full text-xs rounded-xl bg-kizuna-primary border border-kizuna-border text-white transition-colors">
                                    Đặt lịch họp 15 phút
                                </Button>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}
