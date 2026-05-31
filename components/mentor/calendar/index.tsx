'use client';

import React from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Settings, Video, Users, CheckCircle2 } from 'lucide-react';

const upcomingMeetings = [
    { id: 1, title: 'Họp 1:1 Định hướng Chiến lược', entity: 'Kizuna Hub', time: 'Hôm nay, 14:00 - 15:00', type: 'Google Meet', status: 'upcoming' },
    { id: 2, title: 'Duyệt Pitch Deck Gọi Vốn', entity: 'SnapMoney', time: 'Ngày mai, 10:00 - 11:00', type: 'Zoom', status: 'upcoming' },
    { id: 3, title: 'Đánh giá Product-Market Fit', entity: 'Dietfit AI', time: 'Thứ 6, 09:00 - 10:00', type: 'Google Meet', status: 'scheduled' }
];

const availableSlots = [
    { id: 1, day: 'Thứ 2', times: ['14:00 - 15:00', '15:30 - 16:30'] },
    { id: 2, day: 'Thứ 4', times: ['09:00 - 10:00', '10:30 - 11:30'] },
    { id: 3, day: 'Thứ 6', times: ['14:00 - 16:00'] },
];

export default function MentorCalendarView() {
    return (
        <div className="w-full p-6 md:p-8 lg:p-10 font-inter">
            <div className="w-full max-w-[1200px] mx-auto space-y-8">
                {/* Header */}
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="font-outfit font-black text-[#102c1e] text-4xl tracking-tight">Lịch trình & Slot Cố vấn</h1>
                        <p className="font-inter text-slate-600 mt-2 text-base">Quản lý các buổi tư vấn 1:1 và cấu hình thời gian rảnh của bạn.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 bg-white border border-[#102c1e]/10 text-[#102c1e] font-geist font-bold rounded-xl px-5 py-2.5 hover:bg-[#102c1e]/5 transition-colors shadow-sm text-sm">
                            <Settings className="w-4 h-4" />
                            Cấu hình Lịch
                        </button>
                        <button className="flex items-center gap-2 bg-[#102c1e] text-[#fafafa] font-geist font-bold rounded-xl px-5 py-2.5 hover:bg-[#102c1e]/90 transition-colors shadow-sm text-sm">
                            <Plus className="w-4 h-4" />
                            Mở Slot Mới
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left Column (8 cols): Upcoming Meetings */}
                    <div className="md:col-span-8 flex flex-col gap-6">
                        <section className="bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm p-8 flex flex-col">
                            <h2 className="font-outfit font-black text-[#102c1e] text-2xl tracking-tight mb-6">Lịch sắp tới</h2>
                            <div className="flex flex-col gap-4">
                                {upcomingMeetings.map(meeting => (
                                    <div key={meeting.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-[#102c1e]/10 hover:border-[#102c1e]/30 transition-colors bg-[#fafafa]/50">
                                        <div className="flex items-start gap-4 mb-4 md:mb-0">
                                            <div className="mt-1 bg-[#102c1e]/5 p-3 rounded-xl border border-[#102c1e]/10 text-[#102c1e]">
                                                <CalendarIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-outfit font-black text-[#102c1e] text-lg">{meeting.title}</h3>
                                                <div className="flex items-center gap-3 mt-1.5 text-sm font-geist text-slate-500">
                                                    <span className="flex items-center gap-1.5 text-[#102c1e] font-medium bg-[#102c1e]/5 px-2 py-0.5 rounded-md">
                                                        <Users className="w-3.5 h-3.5" /> {meeting.entity}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5" /> {meeting.time}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#102c1e]/10 font-bold font-geist text-sm text-[#102c1e] hover:bg-[#102c1e]/5 transition-colors">
                                                <Video className="w-4 h-4" /> Tham gia
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-6 w-full py-3 rounded-xl border border-dashed border-[#102c1e]/20 text-[#102c1e]/60 font-geist font-bold text-sm hover:bg-[#102c1e]/5 hover:text-[#102c1e] transition-colors">
                                Xem tất cả lịch sử
                            </button>
                        </section>
                    </div>

                    {/* Right Column (4 cols): Slot Management & Availability */}
                    <div className="md:col-span-4 flex flex-col gap-6">
                        <section className="bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm p-6 flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-outfit font-black text-[#102c1e] text-xl tracking-tight">Slot khả dụng định kỳ</h2>
                                <span className="bg-[#a1e2b6]/30 text-[#102c1e] px-2 py-1 rounded-md text-xs font-bold font-geist">Cập nhật</span>
                            </div>

                            <div className="flex flex-col gap-4">
                                {availableSlots.map(slot => (
                                    <div key={slot.id} className="p-4 rounded-xl border border-[#102c1e]/10 bg-[#fafafa]/50 group hover:border-[#102c1e]/30 transition-all">
                                        <h3 className="font-bold font-geist text-[#102c1e] mb-3">{slot.day}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {slot.times.map((time, idx) => (
                                                <span key={idx} className="bg-white border border-[#102c1e]/10 px-3 py-1.5 rounded-lg text-sm font-geist text-slate-600 font-medium group-hover:border-[#102c1e]/20 group-hover:text-[#102c1e] transition-colors">
                                                    {time}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-5 border-t border-[#102c1e]/10">
                                <p className="text-xs text-slate-500 font-inter mb-4">Mặc định mỗi phiên cố vấn kéo dài 45 phút, kèm 15 phút nghỉ ngơi.</p>
                                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#102c1e]/10 bg-white font-bold font-geist text-sm text-[#102c1e] hover:bg-[#102c1e]/5 transition-colors">
                                    <Settings className="w-4 h-4" /> Đồng bộ Google Calendar
                                </button>
                            </div>
                        </section>

                        <section className="bg-[#102c1e] rounded-3xl p-6 flex flex-col shadow-sm text-white">
                            <h2 className="font-outfit font-black text-xl tracking-tight text-[#fafafa] mb-2">Trạng thái Cố vấn</h2>
                            <p className="font-inter text-[#fafafa]/70 text-sm mb-6">Hiện tại bạn đang nhận yêu cầu cố vấn mới từ các Startup tiềm năng.</p>

                            <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-[#a1e2b6]" />
                                    <span className="font-bold font-geist text-[#fafafa]">Nhận dự án mới</span>
                                </div>
                                <div className="w-12 h-6 bg-[#a1e2b6] rounded-full relative cursor-pointer">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-[#102c1e] rounded-full"></div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}