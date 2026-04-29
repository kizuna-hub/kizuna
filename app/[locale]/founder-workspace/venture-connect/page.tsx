'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Calendar, MoreHorizontal, Video, Clock, CheckCircle2 } from 'lucide-react';

const topMatches = [
    {
        id: 1,
        name: 'Elena Rodriguez',
        role: 'Nhà sáng lập SaaS & Nhà đầu tư thiên thần',
        matchScore: '98%',
        reason: 'Nền tảng vững chắc về chiến lược định giá và mở rộng SaaS B2B.',
        initials: 'ER'
    },
    {
        id: 2,
        name: 'Marcus Chen',
        role: 'Cựu Giám đốc Sản phẩm Stripe',
        matchScore: '95%',
        reason: 'Chuyên môn sâu rộng về hạ tầng fintech và GTM.',
        initials: 'MC'
    },
    {
        id: 3,
        name: 'Sarah Williams',
        role: 'Đối tác Venture tại XYZ Capital',
        matchScore: '92%',
        reason: 'Đang tích cực tìm kiếm công cụ tối ưu năng suất ứng dụng AI giai đoạn seed.',
        initials: 'SW'
    }
];

const activeRequests = [
    {
        id: 1,
        name: 'David Kim',
        role: 'Chuyên gia Tăng trưởng Marketing',
        dateSent: '12 Tháng 10, 2026',
        status: 'Pending',
        initials: 'DK'
    },
    {
        id: 2,
        name: 'Priya Patel',
        role: 'Co-founder Công nghệ',
        dateSent: '10 Tháng 10, 2026',
        status: 'Connected',
        initials: 'PP'
    },
    {
        id: 3,
        name: 'James Wilson',
        role: 'Chuyên viên Sale Doanh nghiệp',
        dateSent: '08 Tháng 10, 2026',
        status: 'Pending',
        initials: 'JW'
    }
];

const upcomingMeetings = [
    {
        id: 1,
        date: 'Ngày mai, 10:00 Sáng',
        name: 'Elena Rodriguez',
        topic: 'Đánh giá Chiến lược Định giá',
        initials: 'ER'
    },
    {
        id: 2,
        date: '18 Tháng 10, 2:30 Chiều',
        name: 'Priya Patel',
        topic: 'Phản hồi Cấu trúc Hệ thống',
        initials: 'PP'
    }
];

export default function VentureConnectPage() {
    return (
        <div className="px-8 py-8 max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-kizuna-text-main">
                    Kết nối & Mentorship của tôi
                </h1>
                <p className="text-sm text-kizuna-text-muted mt-1">
                    Quản lý danh sách phù hợp do AI đề xuất, các yêu cầu kết nối đang chờ xử lý và các lịch họp sắp tới.
                </p>
            </div>

            {/* Top Section: AI Match Radar */}
            <section>
                <h2 className="text-lg font-semibold text-kizuna-text-main mb-4">
                    Gợi ý AI Phù hợp nhất
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topMatches.map((match) => (
                        <div key={match.id} className="bg-white border border-kizuna-border rounded-2xl shadow-sm p-5 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-kizuna-primary flex items-center justify-center flex-shrink-0">
                                        <span className="font-bold text-white text-sm">
                                            {match.initials}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-kizuna-text-main text-sm">
                                            {match.name}
                                        </p>
                                        <p className="text-xs text-kizuna-text-muted mt-0.5">
                                            {match.role}
                                        </p>
                                    </div>
                                </div>
                                <span className="bg-emerald-50 text-kizuna-primary font-medium text-xs px-2 py-1 rounded">
                                    Độ phù hợp {match.matchScore}
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-kizuna-text-main bg-zinc-50 p-3 rounded-lg border border-kizuna-border/50">
                                    <span className="font-medium block mb-1">Tại sao phù hợp:</span>
                                    {match.reason}
                                </p>
                            </div>
                            <button className="w-full mt-4 border border-kizuna-border text-kizuna-text-main hover:bg-zinc-50 bg-white rounded-lg py-2 font-medium text-sm transition-colors">
                                Yêu cầu Giới thiệu
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Middle Section: Connection Pipeline */}
                <section className="lg:col-span-2">
                    <h2 className="text-lg font-semibold text-kizuna-text-main mb-4">
                        Kết nối Đang theo dõi
                    </h2>
                    <div className="bg-white border border-kizuna-border rounded-2xl shadow-sm overflow-hidden">
                        <div className="min-w-full divide-y divide-kizuna-border">
                            <div className="bg-zinc-50 px-6 py-3 flex items-center text-xs font-medium text-kizuna-text-muted uppercase tracking-wider">
                                <div className="flex-1">Mentor</div>
                                <div className="w-32">Ngày Gửi</div>
                                <div className="w-32">Trạng thái</div>
                                <div className="w-12"></div>
                            </div>
                            <div className="divide-y divide-kizuna-border">
                                {activeRequests.map((req) => (
                                    <div key={req.id} className="px-6 py-4 flex items-center hover:bg-zinc-50/50 transition-colors">
                                        <div className="flex-1 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-kizuna-primary flex items-center justify-center flex-shrink-0">
                                                <span className="font-bold text-white text-xs">
                                                    {req.initials}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-kizuna-text-main text-sm">
                                                    {req.name}
                                                </p>
                                                <p className="text-xs text-kizuna-text-muted mt-0.5">
                                                    {req.role}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-32 text-sm text-kizuna-text-muted">
                                            {req.dateSent}
                                        </div>
                                        <div className="w-32">
                                            {req.status === 'Pending' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100">
                                                    <Clock className="w-3 h-3" />
                                                    Đang chờ
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-kizuna-primary border border-emerald-100">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Đã kết nối
                                                </span>
                                            )}
                                        </div>
                                        <div className="w-12 flex justify-end">
                                            <button className="text-kizuna-text-muted hover:text-kizuna-text-main p-1 rounded-md hover:bg-zinc-100 transition-colors">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Section: Upcoming Sessions */}
                <section>
                    <h2 className="text-lg font-semibold text-kizuna-text-main mb-4">
                        Sự kiện Sắp tới
                    </h2>
                    <div className="space-y-4">
                        {upcomingMeetings.map((meeting) => (
                            <div key={meeting.id} className="bg-white border border-kizuna-border rounded-2xl shadow-sm p-5">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-2.5 bg-emerald-50 rounded-xl text-kizuna-primary shrink-0">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-kizuna-text-main text-sm">
                                            {meeting.topic}
                                        </p>
                                        <p className="text-sm text-kizuna-text-muted mt-1">
                                            với <span className="font-medium text-kizuna-text-main">{meeting.name}</span>
                                        </p>
                                        <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-kizuna-primary bg-zinc-50 w-fit px-2 py-1 rounded-md border border-kizuna-border/50">
                                            <Clock className="w-3.5 h-3.5" />
                                            {meeting.date}
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full flex items-center justify-center gap-2 bg-kizuna-primary text-white rounded-lg px-4 py-2 font-medium text-sm">
                                    <Video className="w-4 h-4" />
                                    Tham gia cuộc gọi
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
