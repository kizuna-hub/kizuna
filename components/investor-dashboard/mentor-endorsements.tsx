import { Quote, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const endorsements = [
    {
        id: 1,
        mentorName: 'Dr. Alex Chen',
        mentorRole: 'Chuyên gia Kiến trúc Hệ thống',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TriLe',
        quote: 'Kiến trúc SpacetimeDB của team DUTCareers xử lý realtime cực kỳ ấn tượng. Rất đáng để đầu tư vòng Seed ngay lúc này.',
        projectName: 'DUTCareers',
    },
    {
        id: 2,
        mentorName: 'Nguyễn Tùng',
        mentorRole: 'Senior Engineer @ Sun Asterisk',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TungNguyen',
        quote: 'Mô hình RAG ứng dụng vào FashionTech rất sáng tạo. Lõi công nghệ của các bạn sinh viên này làm cực kỳ sạch.',
        projectName: 'TrendEngine',
    }
];

export const MentorEndorsements = () => {
    return (
        <section className="my-8">
            <div className="flex items-end justify-between mb-6">
                <div>
                    {/* FIX: Đồng bộ text-lg font-black tracking-tighter */}
                    <h2 className="text-lg font-black text-kizuna-text-main uppercase tracking-tighter">
                        Pioneer Mentor Endorsements
                    </h2>
                    <p className="text-kizuna-text-muted text-[11px] font-black uppercase tracking-widest mt-1">
                        Tiền thông minh đi theo người thông minh
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {endorsements.map((item) => (
                    <div key={item.id} className="bg-white border border-kizuna-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
                        <Quote className="absolute top-6 right-6 w-12 h-12 text-zinc-100 rotate-180 pointer-events-none" />

                        <div className="flex items-center gap-4 mb-4">
                            <img src={item.avatar} alt={item.mentorName} className="w-14 h-14 rounded-full border-2 border-zinc-100 bg-zinc-50" />
                            <div>
                                <h4 className="text-sm font-black text-kizuna-text-main uppercase tracking-tight">{item.mentorName}</h4>
                                <p className="text-[10px] font-bold text-kizuna-primary uppercase tracking-widest mt-0.5">{item.mentorRole}</p>
                            </div>
                        </div>

                        <p className="text-sm font-medium text-kizuna-text-main leading-relaxed italic mb-6">
                            "{item.quote}"
                        </p>

                        <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-kizuna-text-muted uppercase tracking-widest">Bảo trợ cho:</span>
                                <span className="text-[10px] font-black text-kizuna-text-main bg-zinc-100 px-2 py-1 rounded border border-zinc-200">
                                    {item.projectName}
                                </span>
                            </div>
                            <Button variant="outline" size="sm" className="text-[10px] font-black uppercase tracking-widest border-kizuna-primary text-kizuna-primary hover:bg-emerald-50 h-8">
                                Đồng đầu tư <ArrowUpRight className="w-3 h-3 ml-1" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};