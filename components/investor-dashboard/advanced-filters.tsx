import { Filter, ShieldCheck } from 'lucide-react';

export interface FiltersState {
    industries: string[];
    stage: string;
    ipVerifiedOnly: boolean;
    need: 'all' | 'funding' | 'mentor';
    fundingLimit: number; // Mức gọi vốn tối đa (Triệu VNĐ)
}

interface AdvancedFiltersProps {
    filters: FiltersState;
    setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
}

export const AdvancedFilters = ({ filters, setFilters }: AdvancedFiltersProps) => {

    const toggleIndustry = (industry: string) => {
        setFilters(prev => ({
            ...prev,
            industries: prev.industries.includes(industry)
                ? prev.industries.filter(i => i !== industry)
                : [...prev.industries, industry]
        }));
    };

    return (
        <div className="w-64 flex-shrink-0 space-y-6">
            <div className="bg-white border border-kizuna-border rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-kizuna-text-main mb-5 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#16452a]" /> Bộ lọc nâng cao
                </h3>

                <div className="space-y-6">
                    {/* Nhu cầu hỗ trợ - Đã cắm State */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-kizuna-text-muted uppercase tracking-widest">Nhu cầu hỗ trợ</label>
                        <div className="flex gap-2">
                            <label className="flex-1 text-center cursor-pointer">
                                <input type="radio" name="need" className="peer sr-only" checked={filters.need === 'all'} onChange={() => setFilters(prev => ({ ...prev, need: 'all' }))} />
                                <div className={`py-2 px-3 rounded-lg border border-kizuna-border text-xs font-bold transition-all ${filters.need === 'all' ? 'bg-[#16452a] text-white' : 'text-kizuna-text-muted hover:bg-zinc-50'}`}>Tất cả</div>
                            </label>
                            <label className="flex-1 text-center cursor-pointer">
                                <input type="radio" name="need" className="peer sr-only" checked={filters.need === 'funding'} onChange={() => setFilters(prev => ({ ...prev, need: 'funding' }))} />
                                <div className={`py-2 px-3 rounded-lg border border-kizuna-border text-xs font-bold transition-all ${filters.need === 'funding' ? 'bg-[#16452a] text-white' : 'text-kizuna-text-muted hover:bg-zinc-50'}`}>Gọi vốn</div>
                            </label>
                            <label className="flex-1 text-center cursor-pointer">
                                <input type="radio" name="need" className="peer sr-only" checked={filters.need === 'mentor'} onChange={() => setFilters(prev => ({ ...prev, need: 'mentor' }))} />
                                <div className={`py-2 px-3 rounded-lg border border-kizuna-border text-xs font-bold transition-all ${filters.need === 'mentor' ? 'bg-[#16452a] text-white' : 'text-kizuna-text-muted hover:bg-zinc-50'}`}>Mentor</div>
                            </label>
                        </div>
                    </div>

                    {/* Lĩnh vực */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-kizuna-text-muted uppercase tracking-widest">Lĩnh vực</label>
                        <div className="space-y-2">
                            {['AI / ML', 'Web3 / Crypto', 'EdTech', 'FinTech', 'SaaS', 'HealthTech'].map(i => (
                                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={filters.industries.includes(i)}
                                        onChange={() => toggleIndustry(i)}
                                        className="w-4 h-4 rounded border-kizuna-border text-[#16452a] focus:ring-[#16452a] transition-colors cursor-pointer"
                                    />
                                    <span className="text-sm text-kizuna-text-main group-hover:text-[#16452a] transition-colors font-medium">{i}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Mức gọi vốn (Slider) - Đổi đơn vị sang Tiền Việt & Cắm State */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-kizuna-text-muted uppercase tracking-widest">Mức gọi vốn</label>
                            <span className="text-xs font-bold text-[#16452a]">
                                &lt; {filters.fundingLimit >= 1000 ? `${filters.fundingLimit / 1000} Tỷ` : `${filters.fundingLimit} Tr`}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="100"
                            max="5000"
                            step="100"
                            value={filters.fundingLimit}
                            onChange={(e) => setFilters(prev => ({ ...prev, fundingLimit: Number(e.target.value) }))}
                            className="w-full accent-[#16452a] cursor-pointer"
                        />
                    </div>

                    {/* Giai đoạn - Đã Việt Hóa */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-kizuna-text-muted uppercase tracking-widest">Trạng thái dự án</label>
                        <select
                            value={filters.stage}
                            onChange={(e) => setFilters(prev => ({ ...prev, stage: e.target.value }))}
                            className="w-full bg-white border border-kizuna-border rounded-lg px-3 py-2 text-sm font-bold shadow-sm cursor-pointer"
                        >
                            <option>Tất cả trạng thái</option>
                            <option>Ý tưởng (Idea)</option>
                            <option>Bản mẫu (MVP)</option>
                            <option>Có doanh thu (Traction)</option>
                        </select>
                    </div>

                    {/* IP Verified */}
                    <div className="pt-4 border-t border-kizuna-border">
                        <label className="flex items-center gap-3 cursor-pointer group p-2 -ml-2 rounded-lg hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition-colors">
                            <input
                                type="checkbox"
                                checked={filters.ipVerifiedOnly}
                                onChange={(e) => setFilters(prev => ({ ...prev, ipVerifiedOnly: e.target.checked }))}
                                className="w-4 h-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-600"
                            />
                            <ShieldCheck className={`w-4 h-4 ${filters.ipVerifiedOnly ? 'text-emerald-600' : 'text-zinc-400'}`} />
                            <span className={`text-sm font-bold ${filters.ipVerifiedOnly ? 'text-emerald-800' : 'text-zinc-500'}`}>Chỉ hiển thị IP Verified</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};