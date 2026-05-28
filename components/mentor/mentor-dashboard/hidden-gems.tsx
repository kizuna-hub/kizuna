import { Diamond, Lock, ArrowRight, TrendingUp, Flame, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HiddenGems = () => {
    // Bơm thêm Data để tạo độ "FOMO" cực mạnh
    const gems = [
        {
            id: 1,
            fakeName: 'Dự án Stealth #1042',
            sector: 'EdTech / Deep AI',
            problem: 'Giải quyết bài toán cá nhân hóa học tập bằng RAG.',
            traction: '+2,500 Active Users trong 3 ngày đầu ra mắt Beta.',
            signals: [
                { icon: Flame, text: 'Đang cháy (Hot Deal)' },
                { icon: Users, text: '3 Quỹ đang theo dõi' }
            ],
            urgency: 'Sắp chốt vòng Seed'
        },
        {
            id: 2,
            fakeName: 'Dự án Stealth #0899',
            sector: 'Web3 / SaaS B2B',
            problem: 'Nền tảng ký kết SmartContract tự động cho SME.',
            traction: 'Đã ký 5 hợp đồng B2B, đạt điểm Break-Even ngay tháng đầu.',
            signals: [
                { icon: TrendingUp, text: 'Doanh thu tăng vọt' },
                { icon: Clock, text: 'Chỉ còn 15% Equity' }
            ],
            urgency: 'Đang mở gọi vốn'
        },
    ];

    return (
        <div className="bg-[#16452a] rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden group">
            {/* Background Effects - Tạo cảm giác "Vũ trụ bí ẩn" */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#00BFA5]/20 to-transparent rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-[#FFC107]/10 to-transparent rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 relative z-10 gap-6 border-b border-[#ffffff]/10 pb-6">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-[#FFC107]/20 rounded-xl flex items-center justify-center border border-[#FFC107]/30 shadow-[0_0_15px_rgba(255,193,7,0.2)]">
                            <Diamond className="w-5 h-5 text-[#FFC107]" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-[#ffffff] tracking-tighter">
                            The Hidden Gems Vault
                        </h2>
                    </div>
                    <p className="text-sm font-medium text-[#ffffff]/70 mt-3 leading-relaxed">
                        Khu vực đặc quyền chứa các dự án sinh viên đang bật chế độ Ẩn danh (Venture Lock).
                        Đây là những <strong className="text-[#00BFA5]">Top 1% dự án</strong> có chỉ số tăng trưởng (Traction) bùng nổ nhất hệ thống tuần qua.
                    </p>
                </div>

                {/* Nút Call to Action "Gắt" */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                    <p className="text-[10px] font-bold text-[#FFC107] uppercase tracking-widest animate-pulse">
                        Giới hạn quyền truy cập
                    </p>
                    <Button className="bg-[#FFC107] hover:bg-[#FFB300] text-[#1A1A1A] font-black text-sm px-6 h-12 rounded-xl shadow-[0_0_20px_rgba(255,193,7,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2 border-none">
                        Kích hoạt chế độ Investor <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Cards Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {gems.map((gem) => (
                    <div key={gem.id} className="bg-[#0f2e1c]/80 backdrop-blur-md border border-[#ffffff]/10 rounded-2xl p-0 relative group/card overflow-hidden transition-all hover:border-[#FFC107]/40 hover:shadow-[0_0_30px_rgba(255,193,7,0.1)]">

                        {/* THE LOCK OVERLAY (Giao diện khi hover: Đòi quyền Investor) */}
                        <div className="absolute inset-0 bg-[#0f2e1c]/90 backdrop-blur-[4px] opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex flex-col items-center justify-center z-20 cursor-pointer">
                            <div className="w-16 h-16 bg-[#FFC107]/20 rounded-full flex items-center justify-center mb-3 border border-[#FFC107]/50 shadow-[0_0_15px_rgba(255,193,7,0.4)]">
                                <Lock className="w-8 h-8 text-[#FFC107]" />
                            </div>
                            <p className="text-sm font-black text-[#ffffff] tracking-widest uppercase mb-1">Dự án Đã Khóa</p>
                            <p className="text-xs text-[#ffffff]/60 font-medium">Bấm để nâng cấp tài khoản và xem toàn bộ Pitch Deck</p>
                        </div>

                        {/* INNER CONTENT (Làm mờ nhẹ khi hover) */}
                        <div className="p-6 relative z-10 group-hover/card:blur-sm transition-all duration-300 select-none flex flex-col h-full">

                            {/* Tags & Urgency */}
                            <div className="flex items-start justify-between mb-5">
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs font-black text-[#ffffff] bg-[#ffffff]/10 px-3 py-1.5 rounded-lg border border-[#ffffff]/20 w-fit backdrop-blur-sm">
                                        {gem.fakeName}
                                    </span>
                                    <span className="text-[10px] font-bold text-[#00BFA5] uppercase tracking-widest">
                                        {gem.sector}
                                    </span>
                                </div>
                                <span className="text-[9px] font-black text-[#FFC107] bg-[#FFC107]/10 border border-[#FFC107]/20 px-2.5 py-1 rounded-md uppercase tracking-wider">
                                    {gem.urgency}
                                </span>
                            </div>

                            {/* Vấn đề giải quyết (Làm mờ text để tạo tò mò) */}
                            <div className="mb-5">
                                <p className="text-[10px] font-bold text-[#ffffff]/50 uppercase tracking-widest mb-1.5">Mô hình kinh doanh</p>
                                <p className="text-sm text-[#ffffff]/90 font-medium leading-relaxed">
                                    {gem.problem}
                                </p>
                            </div>

                            {/* Tín hiệu đầu tư (Signals) */}
                            <div className="flex gap-3 mb-5 border-t border-[#ffffff]/10 pt-4">
                                {gem.signals.map((sig, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-[10px] font-bold text-[#ffffff]/70 bg-[#ffffff]/5 px-2.5 py-1.5 rounded-lg border border-[#ffffff]/5">
                                        <sig.icon className="w-3.5 h-3.5 text-[#00BFA5]" /> {sig.text}
                                    </div>
                                ))}
                            </div>

                            {/* Kicker: Traction (Lý do phải xem ngay) */}
                            <div className="mt-auto bg-gradient-to-r from-[#00BFA5]/10 to-transparent p-4 rounded-xl border-l-2 border-[#00BFA5]">
                                <div className="flex items-center gap-2 text-[#00BFA5] mb-1">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Traction Alert</span>
                                </div>
                                <span className="text-sm font-bold text-[#ffffff] leading-tight block">{gem.traction}</span>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};