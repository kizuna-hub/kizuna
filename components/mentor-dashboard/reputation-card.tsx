import { TrendingUp, Award } from 'lucide-react';

export const ReputationCard = ({ stats }: { stats: any }) => (
    <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between">
        <div className="flex gap-12 items-center">
            <div>
                <p className="text-[10px] font-black text-zinc-400 tracking-widest mb-1 uppercase">Impact Score</p>
                <div className="text-6xl font-black text-emerald-700 tracking-tighter leading-none">{stats.reputationScore}</div>
                {/* Thẻ tag xanh nhạt chữ xanh đậm chuẩn SaaS */}
                <div className="flex items-center gap-1.5 mt-3 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-md border border-emerald-100 w-fit">
                    <TrendingUp className="w-3.5 h-3.5" /> Top 5% Mentor tháng này
                </div>
            </div>

            <div className="h-16 w-px bg-zinc-200 hidden md:block"></div>

            <div className="flex gap-10">
                {[
                    { label: 'Giờ cố vấn', val: `${stats.totalHours}h` },
                    { label: 'Dự án', val: stats.totalProjects },
                    { label: 'Đã rót vốn', val: stats.successDeals }
                ].map(item => (
                    <div key={item.label}>
                        <p className="text-[10px] font-black text-zinc-400 tracking-widest mb-2 uppercase">{item.label}</p>
                        <div className="text-3xl font-black text-zinc-900">{item.val}</div>
                    </div>
                ))}
            </div>
        </div>

        {/* Đổi Badges sang nền xám nhạt, chữ đậm (Giống tag FASHIONTECH bên kia) */}
        <div className="flex gap-2 flex-wrap justify-end mt-6 md:mt-0">
            {stats.badges.map((badge: string) => (
                <div key={badge} className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[10px] font-bold text-zinc-700 tracking-wide flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    {badge}
                </div>
            ))}
        </div>
    </div>
);