'use client';

import React from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Settings, Video, Users, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        <div className="min-h-screen w-full bg-[#fafafa] p-6 md:p-8 lg:p-10 font-sans">
            <div className="mx-auto flex h-full max-w-5xl flex-col space-y-8">
                {/* Header chuẩn Rule 4.1 */}
                <header className="mb-6 flex items-baseline justify-between border-b border-[#102c1e]/10 pb-4 pt-6">
                    <div>
                        <h1 className="font-heading text-3xl font-black tracking-tight text-[#102c1e] md:text-4xl">Lịch trình & Slot Cố vấn</h1>
                        <p className="mt-2 font-sans text-base leading-relaxed text-slate-700">Quản lý các buổi tư vấn 1:1 và cấu hình thời gian rảnh của bạn.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 rounded-xl border border-[#102c1e]/10 bg-white px-5 py-2.5 font-sans text-sm font-bold text-[#102c1e] shadow-sm transition-colors hover:bg-[#102c1e]/5">
                            <Settings className="h-4 w-4" />
                            Cấu hình Lịch
                        </button>
                        <button className="flex items-center gap-2 rounded-xl bg-[#102c1e] px-5 py-2.5 font-sans text-sm font-bold text-[#fafafa] shadow-sm transition-colors hover:bg-[#102c1e]/90">
                            <Plus className="h-4 w-4" />
                            Mở Slot Mới
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                    {/* Left Column (8 cols): Upcoming Meetings */}
                    <div className="flex flex-col gap-6 md:col-span-8">
                        {/* White Bento Card chuẩn Rule 5.1 */}
                        <section className="group flex break-inside-avoid flex-col overflow-hidden rounded-2xl border border-[#102c1e]/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:p-6">
                            <h2 className="mb-6 font-heading text-2xl font-black tracking-tight text-[#102c1e]">Lịch sắp tới</h2>
                            <div className="flex flex-col gap-4">
                                {upcomingMeetings.map(meeting => (
                                    <div key={meeting.id} className="flex flex-col justify-between rounded-xl border border-[#102c1e]/10 bg-[#fafafa]/50 p-5 transition-colors hover:border-[#102c1e]/30 md:flex-row md:items-center">
                                        <div className="mb-4 flex items-start gap-4 md:mb-0">
                                            <div className="mt-1 rounded-xl border border-[#102c1e]/10 bg-[#102c1e]/5 p-3 text-[#102c1e]">
                                                <CalendarIcon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-heading text-lg font-black text-[#102c1e]">{meeting.title}</h3>
                                                <div className="mt-1.5 flex items-center gap-3 font-sans text-sm text-slate-500">
                                                    <span className="flex items-center gap-1.5 rounded-md bg-[#102c1e]/5 px-2 py-0.5 font-medium text-[#102c1e]">
                                                        <Users className="h-3.5 w-3.5" /> {meeting.entity}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="h-3.5 w-3.5" /> {meeting.time}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button className="flex items-center gap-2 rounded-lg border border-[#102c1e]/10 bg-white px-4 py-2 font-sans text-sm font-bold text-[#102c1e] transition-colors hover:bg-[#102c1e]/5">
                                                <Video className="h-4 w-4" /> Tham gia
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Dashed Button chuẩn Rule 5.3 */}
                            <button className="mt-6 flex w-full items-center justify-center gap-1 rounded-xl border border-dashed border-[#102c1e]/30 bg-transparent py-3 font-sans text-sm font-bold text-[#102c1e]/50 transition-colors hover:border-[#102c1e]/50 hover:text-[#102c1e]">
                                Xem tất cả lịch sử
                            </button>
                        </section>
                    </div>

                    {/* Right Column (4 cols): Slot Management & Availability */}
                    <div className="flex flex-col gap-6 md:col-span-4">
                        {/* White Bento Card */}
                        <section className="group flex break-inside-avoid flex-col overflow-hidden rounded-2xl border border-[#102c1e]/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="font-heading text-xl font-black tracking-tight text-[#102c1e]">Slot khả dụng định kỳ</h2>
                                {/* Text Visual Anchor chuẩn Rule 5.3 */}
                                <span className="inline-block rounded-full border border-[#a1e2b6]/50 bg-[#a1e2b6]/20 px-2.5 py-1 font-sans text-[10px] font-black text-[#102c1e]">CẬP NHẬT</span>
                            </div>

                            <div className="flex flex-col gap-4">
                                {availableSlots.map(slot => (
                                    <div key={slot.id} className="group/slot rounded-xl border border-[#102c1e]/10 bg-[#fafafa]/50 p-4 transition-all hover:border-[#102c1e]/30">
                                        <h3 className="mb-3 font-sans font-bold text-[#102c1e]">{slot.day}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {slot.times.map((time, idx) => (
                                                /* Inactive Pill chuẩn Rule 5.3 */
                                                <span key={idx} className="whitespace-nowrap rounded-full border border-[#102c1e]/10 bg-white px-4 py-1.5 font-sans text-xs font-bold text-[#102c1e]/70 shadow-sm transition-colors hover:border-[#102c1e]/30 hover:text-[#102c1e]">
                                                    {time}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 border-t border-[#102c1e]/10 pt-5">
                                <p className="mb-4 font-sans text-xs leading-relaxed text-slate-500">Mặc định mỗi phiên cố vấn kéo dài 45 phút, kèm 15 phút nghỉ ngơi.</p>
                                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#102c1e]/10 bg-white py-2.5 font-sans text-sm font-bold text-[#102c1e] transition-colors hover:bg-[#102c1e]/5">
                                    <Settings className="h-4 w-4" /> Đồng bộ Google Calendar
                                </button>
                            </div>
                        </section>

                        {/* Dark Card - Dùng Core Color #102c1e */}
                        <section className="flex flex-col overflow-hidden rounded-2xl bg-[#102c1e] p-6 text-white shadow-sm">
                            <h2 className="mb-2 font-heading text-xl font-black tracking-tight text-[#fafafa]">Trạng thái Cố vấn</h2>
                            <p className="mb-6 font-sans text-sm text-[#fafafa]/70">Hiện tại bạn đang nhận yêu cầu cố vấn mới từ các Startup tiềm năng.</p>

                            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-[#a1e2b6]" />
                                    <span className="font-sans font-bold text-[#fafafa]">Nhận dự án mới</span>
                                </div>
                                <div className="relative h-6 w-12 cursor-pointer rounded-full bg-[#a1e2b6]">
                                    <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-[#102c1e]"></div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}