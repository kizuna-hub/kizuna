import { Button } from '@/components/ui/button';

const pioneers = [
    { name: 'Khoa Phạm', status: "Gọi vốn Pre-Seed '25", quote: 'Sẵn sàng review kiến trúc hệ thống AI và chiến lược GTM sớm.', initials: 'KP' },
    { name: 'Mai Linh', status: 'Founder TechEd', quote: 'Hỗ trợ định hướng ứng dụng AI vào giáo dục.', initials: 'ML' },
    { name: 'Hoàng Vũ', status: 'Giải Nhất Kizuna 2024', quote: 'Tư vấn kinh nghiệm chuẩn bị hồ sơ gọi vốn Seed.', initials: 'HV' },
    { name: 'Tuấn Anh', status: 'CTO Finnovate', quote: 'Giải đáp vướng mắc kỹ thuật & tích hợp thanh toán.', initials: 'TA' }
];

export const PioneerSpotlight = () => (
    <section className="space-y-6">
        <div className="flex justify-between items-end">
            <h2 className="text-2xl font-medium tracking-tight text-kizuna-text-main">Gương mặt Tiên phong (Pioneer Founders)</h2>
            <span className="text-sm text-kizuna-text-muted hidden md:block italic">Văn hóa Pay It Forward - Các cuộc gọi 15 phút</span>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-6 snap-x no-scrollbar">
            {pioneers.map((pioneer, i) => (
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
);