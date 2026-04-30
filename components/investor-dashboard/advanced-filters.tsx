import { Filter } from 'lucide-react';

export const AdvancedFilters = () => (
    <div className="w-64 flex-shrink-0 space-y-6">
        <div className="bg-white border border-kizuna-border rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-kizuna-text-main mb-5 flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#16452a]" /> Bộ lọc nâng cao
            </h3>

            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-kizuna-text-muted uppercase tracking-widest">Lĩnh vực</label>
                    <div className="space-y-2">
                        {['AI & ML', 'Web3 / Crypto', 'EdTech', 'FinTech', 'SaaS'].map(i => (
                            <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-kizuna-border text-[#16452a] focus:ring-[#16452a]" />
                                <span className="text-sm text-kizuna-text-main group-hover:text-[#16452a] transition-colors font-medium">{i}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-kizuna-text-muted uppercase tracking-widest">Giai đoạn</label>
                    <select className="w-full bg-white border border-kizuna-border rounded-lg px-3 py-2 text-sm font-bold">
                        <option>Tất cả giai đoạn</option>
                        <option>Pre-seed</option>
                        <option>Seed</option>
                        <option>Series A</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
);