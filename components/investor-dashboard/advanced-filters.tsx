import { Filter, ShieldCheck, Target, TrendingUp, Cpu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface FiltersState {
    industries: string[];
    stage: string;
    ipVerifiedOnly: boolean;
    valMin: number;
    valMax: number;
    capitalMin: number;
    capitalMax: number;
    aiScoreMin: number;
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

    const INDUSTRIES = ['AI / ML', 'Web3 / Crypto', 'EdTech', 'FinTech', 'SaaS', 'HealthTech', 'FashionTech'];

    return (
        <div className="w-64 flex-shrink-0 space-y-6">
            <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-kizuna-text-main mb-6 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#102c1e]" /> Bộ lọc nâng cao
                </h3>

                <div className="space-y-7">
                    {/* Industries Pill UI */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-kizuna-text-muted tracking-widest flex items-center gap-1.5"><Target className="w-3 h-3" /> Lĩnh vực</label>
                        <div className="flex flex-wrap gap-2">
                            {INDUSTRIES.map(i => {
                                const isSelected = filters.industries.includes(i);
                                return (
                                    <button
                                        key={i}
                                        onClick={() => toggleIndustry(i)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${isSelected ? 'bg-[#102c1e] text-white border-[#102c1e] shadow-md' : 'bg-white/50 text-kizuna-text-muted border-white/20 hover:bg-white hover:border-[#102c1e]/20'} backdrop-blur-sm`}
                                    >
                                        {i}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Capital Seeking (Slider) */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <label className="text-[10px] font-black text-kizuna-text-muted tracking-widest flex items-center gap-1.5"><TrendingUp className="w-3 h-3" /> Mức gọi vốn (Min)</label>
                            <span className="text-xs font-bold text-[#102c1e]">
                                &gt; {filters.capitalMin}M
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="5000"
                            step="100"
                            value={filters.capitalMin}
                            onChange={(e) => setFilters(prev => ({ ...prev, capitalMin: Number(e.target.value) }))}
                            className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#102c1e]"
                        />
                    </div>

                    {/* Valuation Limit (Slider) */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <label className="text-[10px] font-black text-kizuna-text-muted tracking-widest">Định giá tối đa</label>
                            <span className="text-xs font-bold text-[#102c1e]">
                                &lt; {filters.valMax >= 1000 ? `${filters.valMax / 1000}B` : `${filters.valMax}M`}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1000"
                            max="50000"
                            step="1000"
                            value={filters.valMax}
                            onChange={(e) => setFilters(prev => ({ ...prev, valMax: Number(e.target.value) }))}
                            className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#102c1e]"
                        />
                    </div>

                    {/* AI Trust Score (Slider) */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <label className="text-[10px] font-black text-kizuna-text-muted tracking-widest flex items-center gap-1.5"><Cpu className="w-3 h-3" /> Điểm AI Trust (Min)</label>
                            <span className="text-xs font-bold text-[#102c1e]">
                                {(filters.aiScoreMin / 20).toFixed(1)} / 5.0
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            value={filters.aiScoreMin}
                            onChange={(e) => setFilters(prev => ({ ...prev, aiScoreMin: Number(e.target.value) }))}
                            className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#102c1e]"
                        />
                    </div>

                    {/* Stage Dropdown */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-kizuna-text-muted tracking-widest">Giai đoạn</label>
                        <select
                            value={filters.stage}
                            onChange={(e) => setFilters(prev => ({ ...prev, stage: e.target.value }))}
                            className="w-full bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-2.5 text-sm font-bold shadow-sm cursor-pointer outline-none focus:border-[#102c1e]/50"
                        >
                            <option value="all">Tất cả giai đoạn</option>
                            <option value="Ý tưởng (Idea)">Ý tưởng (Idea)</option>
                            <option value="Bản mẫu (MVP)">Bản mẫu (MVP)</option>
                            <option value="Có doanh thu (Traction)">Có doanh thu (Traction)</option>
                        </select>
                    </div>

                    {/* IP Verified */}
                    <div className="pt-4 border-t border-black/5">
                        <label className="flex items-center gap-3 cursor-pointer group p-2 -ml-2 rounded-xl hover:bg-black/5 border border-transparent transition-colors">
                            <input
                                type="checkbox"
                                checked={filters.ipVerifiedOnly}
                                onChange={(e) => setFilters(prev => ({ ...prev, ipVerifiedOnly: e.target.checked }))}
                                className="w-4 h-4 rounded border-zinc-300 text-[#102c1e] focus:ring-[#102c1e] bg-transparent"
                            />
                            <ShieldCheck className={`w-4 h-4 ${filters.ipVerifiedOnly ? 'text-[#102c1e]' : 'text-zinc-400'}`} />
                            <span className={`text-sm font-bold ${filters.ipVerifiedOnly ? 'text-[#102c1e]' : 'text-zinc-500'}`}>Chỉ Ledger Verified</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};