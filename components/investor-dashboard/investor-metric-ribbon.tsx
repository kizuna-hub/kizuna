import { Filter, CircleDollarSign, Sparkles, Key, TrendingUp, Clock, Info } from 'lucide-react';

export const InvestorMetricRibbon = () => {
    const metrics = [
        { label: 'Deals trong phễu', val: '24', trend: '+3 tuần này', icon: Filter, color: 'text-kizuna-text-main', border: 'border-kizuna-border', bg: 'bg-white' },
        { label: 'Tổng quy mô (Ask)', val: '50 Triệu', subtext: 'Trung bình ~15 Triệu/deal', icon: CircleDollarSign, color: 'text-kizuna-text-main', border: 'border-kizuna-border', bg: 'bg-white' },
        { label: 'AI Match > 90%', val: '12', trend: 'Chiếm 50% tổng phễu', icon: Sparkles, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
        { label: 'Yêu cầu mở khóa', val: '3', subtext: 'Đang chờ Founder duyệt', isAlert: true, tooltip: 'Bạn có 3 dự án ẩn danh đang chờ phản hồi', icon: Key, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    ];

    return (
        <div className="grid grid-cols-4 gap-4 mb-6">
            {metrics.map((m, i) => (
                <div key={i} className={`${m.bg} rounded-xl border ${m.border} p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col justify-between min-h-[125px] cursor-default`}>

                    {/* FIX 3: Custom Tooltip xịn xò cho thẻ Yêu cầu mở khóa */}
                    {m.tooltip && (
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-md shadow-xl opacity-0 group-hover:opacity-100 group-hover:top-4 transition-all duration-300 pointer-events-none whitespace-nowrap z-20">
                            {m.tooltip}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900"></div>
                        </div>
                    )}

                    <m.icon className={`absolute -right-2 -bottom-2 w-24 h-24 opacity-[0.04] group-hover:scale-110 transition-transform duration-700 ease-out ${m.color}`} />

                    <div className="flex items-center justify-between mb-2 relative z-10">
                        <div className="flex items-center gap-2">
                            <m.icon className={`w-4 h-4 ${m.color}`} />
                            <span className={`text-[10px] font-black ${m.color} uppercase tracking-widest`}>
                                {m.label}
                            </span>
                        </div>
                    </div>

                    <div className="relative z-10 mt-auto">
                        <div className={`text-3xl font-black ${m.color} leading-none`}>{m.val}</div>

                        <div className="mt-3 flex items-center gap-1.5 opacity-80">
                            {m.trend ? (
                                <>
                                    <TrendingUp className={`w-3.5 h-3.5 ${m.color === 'text-kizuna-text-main' ? 'text-emerald-600' : m.color}`} />
                                    <span className="text-[10px] font-bold text-kizuna-text-muted uppercase tracking-widest">{m.trend}</span>
                                </>
                            ) : (
                                <>
                                    {m.isAlert ? <Clock className="w-3.5 h-3.5 text-amber-600" /> : <Info className="w-3.5 h-3.5 text-zinc-400" />}
                                    <span className="text-[10px] font-bold text-kizuna-text-muted uppercase tracking-widest">{m.subtext}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};