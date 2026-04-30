import { Lock, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ĐÃ FIX: Đổi toàn bộ sang đơn vị Tỷ VNĐ
const vaultProjects = [
    { id: '8802', keywords: ['AI Predictive Model', 'Break-even in 3 months'], trust: 96, ask: '3.5 Tỷ VNĐ' },
    { id: '9105', keywords: ['Web3 Data Ledger', 'B2B Enterprise', 'Patent Pending'], trust: 98, ask: '7 Tỷ VNĐ' },
    { id: '7742', keywords: ['DeepTech Automation', 'Signed 5 Pilots'], trust: 95, ask: '5 Tỷ VNĐ' },
    { id: '6599', keywords: ['FinTech Lending', 'License Approved'], trust: 97, ask: '12 Tỷ VNĐ' }
];

export const ExclusiveVault = () => {
    return (
        <section className="bg-[#0a0a0a] text-white rounded-3xl p-8 my-8 relative shadow-xl border border-zinc-900">
            {/* Header */}
            <div className="flex items-end justify-between mb-8 relative z-10">
                <div>
                    <h2 className="text-lg font-black tracking-tighter flex items-center gap-2 mb-1">
                        <Lock className="w-5 h-5 text-[#00e599]" /> Exclusive Venture Lock Vault
                    </h2>
                    <p className="text-zinc-500 text-[11px] font-bold tracking-widest">
                        Hidden Gems - Các dự án Top Tier đang trong chế độ ẩn danh
                    </p>
                </div>
                <div className="flex gap-2">
                    <span className="bg-[#00e599]/10 text-[#00e599] text-[10px] font-black px-4 py-2 rounded-full tracking-widest border border-[#00e599]/20">
                        {vaultProjects.length} Deals Khả dụng
                    </span>
                </div>
            </div>

            {/* ĐÃ FIX: Bỏ Framer Motion, dùng CSS Overflow native với Snap Scroll để lướt siêu mượt bằng chuột/trackpad */}
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-800 hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                {vaultProjects.map((project) => (
                    <div key={project.id} className="min-w-[340px] snap-start bg-[#111] border border-white/5 rounded-2xl p-6 relative group flex flex-col justify-between">

                        {/* Project Top */}
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
                                    <h3 className="text-sm font-black text-white tracking-wider blur-[3px] group-hover:blur-[1px] transition-all duration-300 select-none">
                                        Project Stealth #{project.id}
                                    </h3>
                                </div>
                                <ShieldCheck className="w-5 h-5 text-[#00e599]" title="Verified IP on SpacetimeDB" />
                            </div>

                            <div className="space-y-3 mb-8">
                                {project.keywords.map((kw, i) => (
                                    <div key={i} className="text-[10px] font-black text-zinc-400 tracking-widest bg-white/5 px-3 py-2 rounded-md border border-white/5 w-max">
                                        {kw}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Project Bottom */}
                        <div>
                            <div className="flex items-center justify-between border-t border-white/5 pt-5 mb-5">
                                <div className="flex items-center gap-1.5 text-[11px] font-black tracking-widest text-white">
                                    <Zap className="w-4 h-4 text-amber-400" /> Trust: {project.trust}
                                </div>
                                <div className="text-[11px] font-black tracking-widest text-[#00e599]">
                                    Ask: <span className="blur-[4px] group-hover:blur-[2px] transition-all duration-300 select-none">{project.ask}</span>
                                </div>
                            </div>

                            <Button className="w-full bg-[#00e599] hover:bg-[#00c080] text-black font-black tracking-widest text-[11px] h-12 rounded-xl transition-colors">
                                Yêu Cầu Mở Khóa
                            </Button>
                        </div>

                    </div>
                ))}
            </div>
        </section>
    );
};