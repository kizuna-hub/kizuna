import { PieChart, Cpu, TrendingUp } from 'lucide-react';

export const EcosystemRadar = () => {
    // Dữ liệu mô phỏng xu hướng
    const sectors = [
        { name: 'AI / DeepTech', percent: 45, color: 'bg-[#16452a]' },
        { name: 'EdTech', percent: 30, color: 'bg-[#16452a]/60' },
        { name: 'SaaS', percent: 25, color: 'bg-[#16452a]/20' },
    ];

    const trendingTags = [
        { name: '#NextJS', heat: 'high' },
        { name: '#SpacetimeDB', heat: 'high' },
        { name: '#RAG', heat: 'medium' },
        { name: '#YOLOv8', heat: 'medium' },
        { name: '#Flutter', heat: 'low' },
        { name: '#Web3', heat: 'low' },
    ];

    return (
        <div className="bg-[#ffffff] border border-[#e4e4e7] rounded-3xl p-8 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-lg font-black text-[#18181b] tracking-tighter flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-[#16452a]" /> Kizuna Ecosystem Radar
                    </h2>
                    <p className="text-xs font-bold text-[#71717a] mt-1">Xu hướng khởi nghiệp toàn hệ thống trong 30 ngày qua.</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-[#16452a] bg-[#16452a]/5 px-3 py-1.5 rounded-lg uppercase tracking-widest border border-[#16452a]/10">
                    <TrendingUp className="w-3.5 h-3.5" /> Cập nhật realtime
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 flex-1">
                {/* Cột 1: Startup Sectors (Khẩu vị ngành) */}
                <div>
                    <p className="text-[10px] font-black text-[#71717a] tracking-widest uppercase mb-4">Mật độ lĩnh vực (Sectors)</p>

                    {/* Visual Bar */}
                    <div className="w-full h-3 rounded-full overflow-hidden flex mb-5">
                        {sectors.map((s, i) => (
                            <div key={i} className={`h-full ${s.color}`} style={{ width: `${s.percent}%` }} />
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="space-y-3">
                        {sectors.map((s, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2.5 h-2.5 rounded-sm ${s.color}`} />
                                    <span className="text-xs font-bold text-[#18181b]">{s.name}</span>
                                </div>
                                <span className="text-xs font-black text-[#71717a]">{s.percent}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cột 2: Trending Tech Stack */}
                <div className="border-l border-[#e4e4e7] pl-10">
                    <p className="text-[10px] font-black text-[#71717a] tracking-widest uppercase mb-4 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5" /> Công nghệ được săn đón
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                        {trendingTags.map((tag, i) => (
                            <span
                                key={i}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105 cursor-default
                                    ${tag.heat === 'high' ? 'bg-[#16452a] text-[#ffffff] shadow-md' :
                                        tag.heat === 'medium' ? 'bg-[#fafafa] border border-[#e4e4e7] text-[#18181b]' :
                                            'bg-transparent text-[#71717a]'}`}
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};