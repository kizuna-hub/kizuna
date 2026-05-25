"use client";

import React from 'react';

const pioneers = [
    { name: 'David Vu', status: 'Founder TechCorp (Series A)', quote: 'Sẵn sàng review cấu trúc hệ thống AI và chiến lược GTM sớm.', initials: 'DV' },
    { name: 'Mai Linh', status: 'CEO EdTech Hub', quote: 'Hỗ trợ định hướng scale-up từ 0 lên 10,000 users.', initials: 'ML' },
    { name: 'Hoàng Vũ', status: 'Kizuna Top Startups 2025', quote: 'Tư vấn kinh nghiệm chuẩn bị hồ sơ gọi vốn Seed hiệu quả.', initials: 'HV' },
    { name: 'Tuấn Anh', status: 'CTO Finnovate', quote: 'Giải đáp vướng mắc kỹ thuật & hạ tầng đám mây.', initials: 'TA' }
];

export function PioneerSpotlight() {
    return (
        <section className="space-y-6 pt-6 border-t border-zinc-200 mt-10">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-[#081810]">Gương mặt Tiên phong (Pioneer Founders)</h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">Giao lưu 1:1 với các Founder đã gọi vốn và exit thành công.</p>
                </div>
            </div>

            <div className="flex overflow-x-auto gap-4 pb-6 snap-x scrollbar-hide">
                {pioneers.map((pioneer, i) => (
                    <div key={i} className="snap-start shrink-0 w-[300px] bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center text-[#16452a] font-bold text-sm shrink-0 border border-zinc-200 shadow-sm transition-transform group-hover:scale-105">
                                {pioneer.initials}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-[#081810]">{pioneer.name}</h4>
                                <p className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 inline-block px-2 py-0.5 rounded border border-emerald-100 mt-1">{pioneer.status}</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-5 italic min-h-[2rem] flex-1">"{pioneer.quote}"</p>
                        <button className="w-full text-xs font-bold rounded-xl bg-[#16452a] hover:bg-[#0a1c13] border border-zinc-200 text-white py-2.5 transition-colors mt-auto">
                            Đặt lịch họp 15 phút
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}