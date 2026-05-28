import { Button } from '@/components/ui/button';
import { Sparkles, Users } from 'lucide-react';

export const MatchmakingCard = ({ request, onViewDetails }: { request: any, onViewDetails: () => void }) => (
    <div className="bg-white border border-[#e4e4e7] rounded-3xl p-6 shadow-sm relative group hover:border-[#16452a]/30 transition-all flex flex-col h-full">
        <div className="flex justify-between items-start mb-5">
            <div className="w-12 h-12 bg-[#fafafa] rounded-2xl flex items-center justify-center text-2xl border border-[#e4e4e7] shadow-sm">
                {request.logo}
            </div>
            <div className="flex flex-col items-end text-right">
                <div className="flex items-center gap-1 text-[10px] font-black text-[#16452a] tracking-widest uppercase mb-1">
                    <Sparkles className="w-3 h-3" /> AI Match
                </div>
                <div className="text-3xl font-black text-[#18181b]">{request.matchScore}%</div>
            </div>
        </div>

        <h3 className="text-lg font-black mb-1 tracking-tight text-[#18181b]">{request.projectName}</h3>
        <p className="text-xs text-[#71717a] mb-4 line-clamp-2 font-medium h-8">
            {request.needs}
        </p>

        {/* MỚI: Founder Snippet */}
        <div className="bg-[#fafafa] border border-[#e4e4e7] rounded-xl p-3 mb-5">
            <p className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Users className="w-3 h-3" /> {request.teamInfo}
            </p>
            <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                    {request.founders.map((f: any, i: number) => (
                        <img key={i} src={f.avatar} alt={f.name} className="w-7 h-7 rounded-full border-2 border-white bg-zinc-200" title={f.name} />
                    ))}
                </div>
                <span className="text-xs font-bold text-[#18181b]">{request.founders[0].name} <span className="text-[#71717a] font-medium">+ {request.founders.length - 1}</span></span>
            </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
            {request.tags.map((tag: string) => (
                <span key={tag} className="text-[10px] font-bold bg-[#fafafa] text-[#71717a] border border-[#e4e4e7] px-2.5 py-1 rounded-md uppercase tracking-wide">
                    #{tag}
                </span>
            ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-auto">
            {/* Nút Trigger Drawer */}
            <Button onClick={onViewDetails} className="bg-[#18181b] hover:bg-[#16452a] text-white font-black text-xs h-11 rounded-xl shadow-sm transition-all">
                Xem chi tiết
            </Button>
            <Button variant="outline" className="border-[#e4e4e7] text-[#71717a] hover:bg-[#fafafa] hover:text-[#18181b] font-bold text-xs h-11 rounded-xl transition-all">
                Bỏ qua
            </Button>
        </div>
    </div>
);