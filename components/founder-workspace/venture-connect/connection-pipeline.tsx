import { Lock, ChevronRight } from 'lucide-react';

const activeRequests = [
    {
        id: 1,
        name: 'David Kim',
        role: 'Chuyên gia Tăng trưởng Marketing',
        action: 'Hành động: Cần gửi AI Pitch Deck',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-100',
        initials: 'DK'
    },
    {
        id: 2,
        name: 'Priya Patel',
        role: 'Cố vấn Công nghệ',
        action: 'Đang chờ Mentor phản hồi',
        color: 'text-kizuna-text-muted bg-kizuna-surface border-kizuna-border',
        initials: 'PP'
    },
    {
        id: 3,
        name: 'James Wilson',
        role: 'Chuyên viên Sale Doanh nghiệp',
        action: 'Chờ lên lịch hẹn 1-1',
        color: 'text-kizuna-text-muted bg-kizuna-surface border-kizuna-border',
        initials: 'JW'
    }
];

export const ConnectionPipeline = () => (
    <section className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-medium tracking-tight text-kizuna-text-main">
            Kết nối Đang theo dõi
        </h2>
        <div className="bg-kizuna-canvas rounded-3xl p-6 shadow-sm border border-kizuna-border">
            <div className="space-y-4">
                {activeRequests.map((item) => (
                    <div
                        key={item.id}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 hover:bg-kizuna-surface rounded-2xl transition-colors border border-transparent hover:border-kizuna-border group gap-4"
                    >
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 rounded-full bg-kizuna-surface flex items-center justify-center shrink-0 border border-kizuna-border">
                                <span className="font-semibold text-kizuna-text-muted text-xs">
                                    {item.initials}
                                </span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-kizuna-text-main">
                                    {item.name}
                                </h4>
                                <p className="text-xs text-kizuna-text-muted">
                                    {item.role}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto sm:overflow-visible no-scrollbar pb-2 sm:pb-0">
                            <span className={`text-xs px-3 py-1.5 rounded-full font-medium border shrink-0 ${item.color}`}>
                                {item.action}
                            </span>

                            <button
                                className="p-2 text-kizuna-text-muted hover:text-kizuna-primary hover:bg-kizuna-primary/10 rounded-full transition-colors flex items-center gap-2 group/btn shrink-0"
                                title="Cấp quyền truy cập IP Ledger"
                            >
                                <Lock size={16} />
                                <span className="text-xs hidden group-hover/btn:block font-medium uppercase tracking-tight">
                                    Cấp quyền IP
                                </span>
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
);