import { Zap, Coins, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ActiveMenteeCard = ({ team }: { team: any }) => (
    <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm hover:border-[#004D40]/30 hover:shadow-lg transition-all group">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-8 gap-6">
            <div className="flex items-start gap-5">
                <div className="w-16 h-16 bg-[#F8F9FA] rounded-2xl flex items-center justify-center text-4xl border border-zinc-200 shadow-inner group-hover:scale-105 transition-transform">
                    {team.logo}
                </div>
                <div>
                    <h3 className="text-xl font-black text-[#1A1A1A] tracking-tight mb-1">{team.projectName}</h3>
                    <p className="text-xs font-bold text-zinc-500">Sáng lập: {team.founder}</p>

                    {/* Hành động khẩn cấp (Call to Action) */}
                    {team.alerts > 0 && (
                        <div className="mt-3 flex items-center gap-1.5 text-[10px] font-black text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-100 w-fit">
                            <Zap className="w-3.5 h-3.5" /> {team.alerts} TÀI LIỆU CHỜ DUYỆT
                        </div>
                    )}
                </div>
            </div>

            {/* Các nút hành động + Cầu nối Investor */}
            <div className="flex items-center gap-3">
                {team.isHotDeal && (
                    <Button className="bg-[#FFC107]/10 hover:bg-[#FFC107]/20 text-[#D4A000] border border-[#FFC107]/50 font-black text-xs px-4 h-11 rounded-xl transition-all flex items-center gap-2">
                        <Coins className="w-4 h-4" /> Đầu tư ngay
                    </Button>
                )}
                <Button className="bg-[#1A1A1A] hover:bg-[#004D40] text-white font-black text-xs px-6 h-11 rounded-xl shadow-md transition-colors">
                    Vào Workspace
                </Button>
            </div>
        </div>

        {/* Nâng cấp Roadmap: Gắn Text sát vào Node */}
        <div className="bg-[#F8F9FA] rounded-2xl p-6 border border-zinc-100">
            <div className="flex items-center justify-between mb-6">
                <p className="text-[10px] font-black text-zinc-400 tracking-widest uppercase">Tiến độ chiến lược</p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                    <MessageSquare className="w-3.5 h-3.5" /> Họp gần nhất: <span className="text-[#004D40]">{team.lastMeeting}</span>
                </div>
            </div>

            <div className="relative px-4">
                <div className="absolute top-2.5 left-4 right-4 h-1 bg-zinc-200 rounded-full z-0"></div>

                <div className="relative z-10 flex justify-between">
                    {team.milestones.map((ms: any, i: number) => (
                        <div key={i} className="flex flex-col items-center w-1/4 group cursor-pointer">
                            <div className={`w-6 h-6 rounded-full border-4 transition-all duration-300 z-10 flex items-center justify-center
                                ${ms.status === 'done' ? 'bg-[#00BFA5] border-[#00BFA5]/20' :
                                    ms.status === 'active' ? 'bg-white border-[#004D40] scale-125 shadow-md' :
                                        'bg-white border-zinc-200'}`}
                            >
                                {ms.status === 'done' && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </div>

                            {/* Text gắn liền với Node */}
                            <div className="mt-4 text-center">
                                <span className={`block text-[11px] font-black uppercase mb-0.5 ${ms.status === 'active' ? 'text-[#004D40]' : 'text-zinc-400'}`}>
                                    {ms.label}
                                </span>
                                <span className={`block text-[10px] font-bold leading-tight px-2 ${ms.status === 'active' ? 'text-[#1A1A1A]' : 'text-zinc-400'}`}>
                                    {ms.desc}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);