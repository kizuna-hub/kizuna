import { CheckCircle2 } from 'lucide-react';

export const PerkCard = ({ perk }: { perk: any }) => (
    <div className="bg-white border border-kizuna-border rounded-xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
        <div className="flex items-start justify-between">
            <div className="w-10 h-10 bg-zinc-50 border border-zinc-100 rounded-lg flex items-center justify-center font-bold text-zinc-400 text-[10px] group-hover:bg-white transition-colors">
                {perk.logo}
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black bg-zinc-50 text-zinc-500 uppercase tracking-widest border border-zinc-200">
                {perk.badge}
            </span>
        </div>

        <div className="flex-1 mt-4">
            <h3 className="text-sm font-bold text-kizuna-text-main leading-tight">
                {perk.provider}
            </h3>
            <p className="text-lg font-black text-kizuna-primary mt-1 tracking-tight">
                {perk.title}
            </p>
            <p className="text-[11px] text-kizuna-text-muted mt-2 mb-5 leading-relaxed line-clamp-2">
                {perk.description}
            </p>
        </div>

        <div>
            {perk.claimed ? (
                <div className="w-full flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-bold bg-emerald-50 text-kizuna-primary border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Đã nhận ưu đãi
                </div>
            ) : (
                <button className="w-full rounded-lg px-3 py-2 text-[11px] font-bold bg-kizuna-primary text-white hover:bg-[#102c1e] transition-colors shadow-sm active:scale-[0.98]">
                    Nhận ưu đãi ngay
                </button>
            )}
        </div>
    </div>
);