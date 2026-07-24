'use client';

import React, { useState } from 'react';
import { Mic, Search, PlayCircle, PauseCircle, Clock, CheckCircle2, ChevronRight, FileText, MessageSquare } from 'lucide-react';

const asyncFeedbacks = [
    { id: 1, startup: 'Kizuna Hub', document: 'Pitch Deck Tháng 10', duration: '2:15', status: 'delivered', timeInfo: 'Đã gửi 2 giờ trước', isRead: true },
    { id: 2, startup: 'SnapMoney', document: 'Báo cáo Tài chính Q3', duration: '5:30', status: 'draft', timeInfo: 'Bản nháp', isRead: false },
    { id: 3, startup: 'Dietfit AI', document: 'Roadmap Sản phẩm', duration: '1:45', status: 'delivered', timeInfo: 'Đã gửi 1 ngày trước', isRead: true },
];

export default function AsyncFeedbackView() {
    const [isPlaying, setIsPlaying] = useState<number | null>(null);

    return (
        <div className="min-h-screen w-full bg-[#fafafa] p-6 md:p-8 lg:p-10 font-sans">
            <div className="mx-auto flex h-full max-w-5xl flex-col space-y-8">
                {/* Header */}
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="flex items-center gap-3 font-heading font-black text-[#102c1e] text-4xl tracking-tight">
                            Phòng Phản Biện Bất Đồng Bộ <span className="bg-[#a1e2b6]/30 text-[#102c1e] text-sm px-3 py-1 rounded-full border border-[#a1e2b6]/50">Async</span>
                        </h1>
                        <p className="font-sans text-slate-600 mt-2 text-base">Ghi âm & đánh dấu trực tiếp lên tài liệu của Founder. Không cần setup họp rườm rà.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left Column 8 Col - The Workspace History */}
                    <div className="md:col-span-8 flex flex-col gap-6">
                        <section className="bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm p-8 flex flex-col min-h-[500px]">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-heading font-black text-[#102c1e] text-2xl tracking-tight">Kho Audio Note</h2>
                                <div className="relative">
                                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Tìm theo startup..."
                                        className="pl-9 pr-4 py-2 bg-[#fafafa] border border-[#102c1e]/10 rounded-xl text-sm font-sans focus:outline-none focus:border-[#102c1e]/30 transition-colors w-64"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                {asyncFeedbacks.map(fb => (
                                    <div key={fb.id} className="group p-5 rounded-2xl border border-[#102c1e]/10 bg-[#fafafa]/50 hover:border-[#102c1e]/30 hover:bg-white transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <button
                                                onClick={() => setIsPlaying(isPlaying === fb.id ? null : fb.id)}
                                                className="mt-1 w-12 h-12 rounded-full bg-[#102c1e] text-white flex items-center justify-center hover:scale-105 transition-transform"
                                            >
                                                {isPlaying === fb.id ? <PauseCircle className="w-6 h-6 text-[#a1e2b6]" /> : <PlayCircle className="w-6 h-6 ml-1 text-[#a1e2b6]" />}
                                            </button>

                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-heading font-black text-[#102c1e] text-lg">{fb.startup}</h3>
                                                    {fb.isRead && <span className="bg-[#a1e2b6]/20 text-[#102c1e] text-[10px] font-bold px-2 py-0.5 rounded-md font-sans border border-[#a1e2b6]">Đã xem</span>}
                                                </div>
                                                <p className="font-sans text-sm text-slate-600 flex items-center gap-1">
                                                    <FileText className="w-3.5 h-3.5" /> Gắn với: {fb.document}
                                                </p>
                                                <div className="flex items-center gap-3 mt-1.5 text-xs font-sans text-slate-400">
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {fb.duration}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                    <span>{fb.timeInfo}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <button className="flex items-center gap-1 text-sm font-bold font-sans text-[#102c1e]/60 group-hover:text-[#102c1e] transition-colors bg-white px-4 py-2 border border-[#102c1e]/10 rounded-lg group-hover:border-[#102c1e]/30">
                                                Tới File <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column 4 Col - Instructions/Recorder Trigger */}
                    <div className="md:col-span-4 flex flex-col gap-6">
                        <section className="bg-[#102c1e] rounded-3xl border border-[#102c1e]/10 shadow-sm p-8 flex flex-col text-center items-center justify-center min-h-[300px] relative overflow-hidden">
                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#a1e2b6]/10 rounded-full blur-2xl"></div>

                            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 relative z-10 border border-white/20">
                                <Mic className="w-8 h-8 text-[#a1e2b6]" />
                            </div>

                            <h2 className="font-heading font-black text-[#fafafa] text-2xl tracking-tight mb-3 relative z-10">
                                Bắt đầu Recording
                            </h2>
                            <p className="font-sans text-sm text-white/70 mb-8 relative z-10">
                                Mở bất kỳ tài liệu nào của Startup trong Dashboard, trình ghi âm sẽ tự động tích hợp.
                            </p>

                            <button className="w-full py-3.5 rounded-xl bg-white text-[#102c1e] font-sans font-bold text-sm hover:bg-[#fafafa] hover:scale-[1.02] transition-all shadow-lg relative z-10">
                                Tới Kho Tài Liệu
                            </button>
                        </section>

                        <section className="bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm p-6">
                            <h3 className="font-heading font-black text-[#102c1e] text-lg mb-4">Cách thức hoạt động</h3>
                            <ul className="space-y-4 font-sans text-sm text-slate-600">
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-[#102c1e]/5 text-[#102c1e] flex items-center justify-center shrink-0 font-sans font-bold text-xs">1</div>
                                    <span>Bạn mở file PDF / Báo cáo định kỳ của Founder.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-[#102c1e]/5 text-[#102c1e] flex items-center justify-center shrink-0 font-sans font-bold text-xs">2</div>
                                    <span>Bấm Mic, vừa cuộn trang vừa nói. Dùng chuột vẽ lên điểm bất hợp lý.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-[#102c1e]/5 text-[#102c1e] flex items-center justify-center shrink-0 font-sans font-bold text-xs">3</div>
                                    <span>Founder nhận được 1 video/audio nhẹ <MessageSquare className="w-3 h-3 inline text-[#102c1e]" /> ghép với đúng context màn hình bạn đang xem.</span>
                                </li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}