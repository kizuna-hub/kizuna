'use client';

import React, { useState } from 'react';
import { Target, CheckCircle2, FileX, ArrowRight, UserCheck, Briefcase, Zap, X } from 'lucide-react';
import { cn } from '@/lib/utils'; // Giả sử you have this

// --- MOCK DATA ---
const requests = [
    {
        id: 1,
        startup: 'EcoDeliver',
        ecosystem: 'Logistics',
        founder: 'Nguyễn Văn Minh',
        matchScore: 94,
        ask: 'Chiến lược Go-to-Market',
        equityOffer: '0.5%',
        timeCommitment: '2h/tháng',
        status: 'pending',
        pitchAbstract: 'EcoDeliver là nền tảng giao hàng chặng cuối sử dụng 100% xe điện. Chúng tôi đã có lãi ở 2 thành phố và cần cố vấn để mở rộng toàn quốc.',
        date: '2 giờ trước',
    },
    {
        id: 2,
        startup: 'Nexus AI',
        ecosystem: 'AI SaaS',
        founder: 'Lê Hoàng',
        matchScore: 82,
        ask: 'Gọi vốn Series A',
        equityOffer: '1.0%',
        timeCommitment: '4h/tháng',
        status: 'pending',
        pitchAbstract: 'Nexus tự động hóa quy trình CSKH bằng AI. Đang chuẩn bị gọi Series A 2 triệu USD, cần Mentor có mạng lưới quỹ đầu tư mạnh.',
        date: 'Hôm qua',
    },
    {
        id: 3,
        startup: 'VRSync',
        ecosystem: 'PropTech',
        founder: 'Trần Bảo',
        matchScore: 65,
        ask: 'Cố vấn Kỹ thuật (CTO)',
        equityOffer: '0.2%',
        timeCommitment: '1h/tháng',
        status: 'pending',
        pitchAbstract: 'Cung cấp tour thực tế ảo cho bất động sản. Cần cố vấn về tối ưu hóa WebGL và hạ tầng cloud rendering.',
        date: '2 ngày trước',
    }
];

export default function MentorRequests() {
    const [selectedReq, setSelectedReq] = useState(requests[0]);

    return (
        <div className="min-h-screen w-full bg-[#fafafa] p-6 md:p-8 lg:p-10 font-inter">
            <div className="mx-auto flex h-full max-w-5xl flex-col space-y-8">

                {/* Header */}
                <header className="mb-6 flex items-baseline justify-between border-b border-[#102c1e]/10 pb-4 pt-6">
                    <div>
                        <h1 className="font-outfit font-black text-[#102c1e] text-4xl tracking-tight">Lời mời Cố vấn (Inbox)</h1>
                        <p className="font-inter text-slate-600 mt-2 text-base">Hàng chờ các yêu cầu kết nối từ Startup. Ưu tiên theo mức độ phù hợp hồ sơ.</p>
                    </div>
                </header>

                {/* 12-Column Asymmetrical Grid cho Inbox */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)] min-h-[600px]">

                    {/* CỘT TRÁI: Danh sách Lời mời (Col-span 4) */}
                    <div className="col-span-1 lg:col-span-4 bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-5 border-b border-[#102c1e]/5 bg-[#fafafa]">
                            <h2 className="font-geist font-bold text-[#102c1e] flex items-center gap-2">
                                <Target className="w-4 h-4 text-[#a1e2b6]" /> Yêu cầu chờ duyệt ({requests.length})
                            </h2>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {requests.map((req) => (
                                <button
                                    key={req.id}
                                    onClick={() => setSelectedReq(req)}
                                    className={cn(
                                        "w-full text-left p-4 rounded-2xl transition-all duration-200 border",
                                        selectedReq.id === req.id
                                            ? "bg-[#fafafa] border-[#102c1e]/20 shadow-sm pointer-events-none"
                                            : "bg-white border-transparent hover:bg-[#102c1e]/5 hover:border-[#102c1e]/10"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-outfit font-black text-[#102c1e] text-lg leading-none">{req.startup}</span>
                                        <span className="font-geist text-[10px] font-bold text-[#102c1e] bg-[#a1e2b6]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <Zap className="w-3 h-3 text-[#102c1e]" /> {req.matchScore}% Phù hợp
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="font-geist text-[10px] uppercase tracking-widest font-bold text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded">
                                            {req.ecosystem}
                                        </span>
                                    </div>
                                    <p className="font-inter text-slate-500 text-xs line-clamp-2 leading-relaxed">
                                        Yêu cầu: <span className="font-semibold text-[#102c1e]">{req.ask}</span>
                                    </p>
                                    <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
                                        <span className="font-geist text-xs text-slate-400">{req.date}</span>
                                        <ArrowRight className={cn("w-4 h-4", selectedReq.id === req.id ? "text-[#102c1e]" : "text-transparent")} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CỘT PHẢI: Khung Chi tiết (Col-span 8) */}
                    <div className="col-span-1 lg:col-span-8 bg-white rounded-3xl border border-[#102c1e]/10 shadow-sm relative overflow-hidden flex flex-col">
                        {selectedReq ? (
                            <>
                                <div className="p-8 border-b border-[#102c1e]/5 flex justify-between items-start bg-[#fafafa]">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-12 h-12 rounded-xl bg-[#102c1e] text-[#fafafa] flex items-center justify-center font-outfit font-black text-2xl">
                                                {selectedReq.startup.charAt(0)}
                                            </div>
                                            <div>
                                                <h2 className="font-outfit font-black text-[#102c1e] text-3xl tracking-tight">{selectedReq.startup}</h2>
                                                <p className="font-inter text-slate-500 text-sm">Bởi Founder: {selectedReq.founder}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="bg-white border border-[#102c1e]/10 text-slate-400 hover:text-red-600 hover:bg-red-50 font-geist font-bold rounded-xl px-4 py-2.5 transition-colors flex items-center gap-2 text-sm shadow-sm">
                                            <X className="w-4 h-4" /> Từ chối
                                        </button>
                                        <button className="bg-[#102c1e] text-[#fafafa] font-geist font-bold rounded-xl px-5 py-2.5 hover:bg-[#102c1e]/90 transition-colors shadow-sm flex items-center gap-2 text-sm">
                                            <CheckCircle2 className="w-4 h-4 text-[#a1e2b6]" /> Chấp nhận & Bắt đầu FAST
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-8 space-y-8 pb-32">

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-[#fafafa] rounded-2xl p-4 border border-[#102c1e]/5">
                                            <span className="font-geist text-[10px] font-bold text-[#102c1e]/50 uppercase tracking-widest">Đề xuất Cổ phần</span>
                                            <p className="font-mono font-bold text-[#102c1e] text-2xl mt-1 text-[#a1e2b6]-shadow">{selectedReq.equityOffer}</p>
                                        </div>
                                        <div className="bg-[#fafafa] rounded-2xl p-4 border border-[#102c1e]/5">
                                            <span className="font-geist text-[10px] font-bold text-[#102c1e]/50 uppercase tracking-widest">Thời gian cam kết</span>
                                            <p className="font-mono font-bold text-[#102c1e] text-2xl mt-1">{selectedReq.timeCommitment}</p>
                                        </div>
                                        <div className="bg-[#fafafa] rounded-2xl p-4 border border-[#102c1e]/5">
                                            <span className="font-geist text-[10px] font-bold text-[#102c1e]/50 uppercase tracking-widest">Hỗ trợ chính</span>
                                            <p className="font-geist font-bold text-[#102c1e] text-lg mt-2 leading-tight">{selectedReq.ask}</p>
                                        </div>
                                    </div>

                                    {/* Abstract & Pitch */}
                                    <div>
                                        <h3 className="font-outfit font-black text-[#102c1e] text-xl mb-3">Tóm tắt Dự án (Abstract)</h3>
                                        <div className="prose font-inter text-slate-600 leading-relaxed max-w-none">
                                            <p>{selectedReq.pitchAbstract}</p>
                                        </div>
                                    </div>

                                    {/* Giả lập Embedded Data Room (Bento inside Bento) */}
                                    <div>
                                        <h3 className="font-outfit font-black text-[#102c1e] text-xl mb-3 flex items-center gap-2">
                                            <Briefcase className="w-5 h-5 text-[#a1e2b6]" /> Đính kèm Data Room
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-4 p-4 rounded-xl border border-[#102c1e]/10 hover:border-[#102c1e]/30 cursor-pointer transition-colors group">
                                                <div className="bg-[#102c1e]/5 p-3 rounded-lg group-hover:bg-[#102c1e]/10 transition-colors">
                                                    <Target className="w-6 h-6 text-[#102c1e]" />
                                                </div>
                                                <div>
                                                    <p className="font-geist font-bold text-[#102c1e] text-sm">Pitch Deck v2.0</p>
                                                    <p className="font-inter text-slate-400 text-xs">PDF • Đọc qua nền tảng</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 p-4 rounded-xl border border-[#102c1e]/10 hover:border-[#102c1e]/30 cursor-pointer transition-colors group">
                                                <div className="bg-[#102c1e]/5 p-3 rounded-lg group-hover:bg-[#102c1e]/10 transition-colors">
                                                    <UserCheck className="w-6 h-6 text-[#102c1e]" />
                                                </div>
                                                <div>
                                                    <p className="font-geist font-bold text-[#102c1e] text-sm">Cấu trúc Nhóm (Cap Table)</p>
                                                    <p className="font-inter text-slate-400 text-xs">SpacetimeDB Sync</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Footer Gradient Fade */}
                                <div className="absolute w-full h-16 bottom-0 left-0 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center font-geist text-slate-400">
                                Chọn một yêu cầu bên trái để xem chi tiết
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}