import { motion } from 'framer-motion';
import {
    Sparkles, Users, Coins, Megaphone,
    Handshake, Info, ShieldAlert, Gauge,
    Zap, Banknote, TrendingUp, Cpu
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface Step3Props {
    formData: any;
    handleInputChange: (e: any) => void;
    handleSliderChange: (name: string, value: number) => void;
    handleAIPolish: (field: string) => void;
    showSparkle: string | null;
}

export function Step3Market({ formData, handleInputChange, handleSliderChange, handleAIPolish, showSparkle }: Step3Props) {
    const breakEvenUsers = formData.monthlyCost / formData.pricePerUser;

    // Cấu hình cho bộ Sliders tự đánh giá
    const feasibilityMetrics = [
        { id: 'techFeasibility', label: 'Khả thi về Công nghệ', desc: 'Team tự chủ code hay phải thuê ngoài?', icon: Cpu },
        { id: 'financialFeasibility', label: 'Khả thi về Tài chính', desc: 'Khả năng duy trì server 6 tháng không doanh thu', icon: Banknote },
        { id: 'marketFeasibility', label: 'Khả thi về Thị trường', desc: 'Sức mạnh của đối thủ hiện tại', icon: TrendingUp },
    ];

    return (
        <div className="space-y-8">
            {/* 1. Khách hàng & Tiếp cận thị trường */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                    <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                        <Users className="w-4 h-4 text-kizuna-primary" /> Khách hàng mục tiêu
                    </label>
                    <Textarea
                        name="targetAudience"
                        value={formData.targetAudience}
                        onChange={handleInputChange}
                        placeholder="Ai là người sẽ trả tiền cho bạn?"
                        className="bg-white border border-zinc-300 text-kizuna-text-main min-h-24 p-3 rounded-xl"
                    />
                </div>

                <div className="relative">
                    <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                        <Megaphone className="w-4 h-4 text-kizuna-primary" /> Kế hoạch tiếp cận (GTM)
                    </label>
                    <Textarea
                        name="goToMarket"
                        value={formData.goToMarket}
                        onChange={handleInputChange}
                        placeholder="Làm sao để có 100 khách hàng đầu tiên?"
                        className="bg-white border border-zinc-300 text-kizuna-text-main min-h-24 p-3 rounded-xl"
                    />
                </div>
            </div>

            {/* 2. NEW: TỰ ĐÁNH GIÁ TÍNH KHẢ THI (SLIDERS) */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Gauge className="w-5 h-5 text-kizuna-primary" />
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">Chỉ số Khả thi (Self-Assessment)</h3>
                </div>

                <div className="space-y-6">
                    {feasibilityMetrics.map((item) => (
                        <div key={item.id} className="space-y-2">
                            <div className="flex justify-between items-end">
                                <div>
                                    <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                                        {item.label}
                                    </label>
                                    <p className="text-[10px] text-zinc-500">{item.desc}</p>
                                </div>
                                <span className="text-sm font-black text-kizuna-primary bg-white px-2 py-0.5 rounded border border-zinc-200 shadow-sm">
                                    {formData[item.id] || 5}/10
                                </span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="1"
                                value={formData[item.id] || 5}
                                onChange={(e) => handleSliderChange(item.id, parseInt(e.target.value))}
                                className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-kizuna-primary"
                            />
                            <div className="flex justify-between text-[9px] text-zinc-400 font-bold uppercase">
                                <span>Thấp</span>
                                <span>Trung bình</span>
                                <span>Rất cao</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. NEW: QUẢN TRỊ RỦI RO & AI POLISH */}
            <div className="relative">
                <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                    <ShieldAlert className="w-4 h-4 text-red-500" /> Rủi ro lớn nhất & Kế hoạch dự phòng (Plan B)
                </label>
                <p className="text-xs text-kizuna-text-muted mb-2">Điều gì có thể khiến dự án thất bại và bạn sẽ xử lý thế nào?</p>
                <div className="relative">
                    <Textarea
                        name="riskPlanB"
                        value={formData.riskPlanB}
                        onChange={handleInputChange}
                        placeholder="Ví dụ: Rủi ro về pháp lý chưa rõ ràng. Plan B: Chuyển hướng sang thị trường ngách có sandbox thử nghiệm..."
                        className="bg-white border border-zinc-300 text-kizuna-text-main min-h-28 p-4 rounded-xl focus:border-kizuna-primary"
                    />
                    <div className="absolute bottom-3 right-3 group">
                        <button
                            type="button"
                            onClick={() => handleAIPolish('riskPlanB')}
                            disabled={showSparkle === 'riskPlanB'}
                            className="flex items-center justify-center bg-zinc-100 text-kizuna-primary border border-zinc-200 rounded-md w-8 h-8 disabled:opacity-50 hover:bg-white shadow-sm transition-all"
                        >
                            {showSparkle === 'riskPlanB' ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                                    <Sparkles className="w-4 h-4" />
                                </motion.div>
                            ) : (
                                <Sparkles className="w-4 h-4" />
                            )}
                        </button>
                        <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block rounded bg-zinc-800 px-2 py-1 text-[10px] text-zinc-300 whitespace-nowrap">AI Polish</span>
                    </div>
                </div>
            </div>

            {/* 4. BREAK-EVEN CALCULATOR (Đã tinh chỉnh giải thích) */}
            <div className="bg-[#f0fdf4] border border-emerald-100 rounded-2xl p-6 space-y-6">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-tight">Phân tích Điểm hòa vốn</h3>
                    <div className="group relative cursor-pointer">
                        <Info className="w-3.5 h-3.5 text-emerald-400" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden w-64 p-3 bg-zinc-800 text-[10px] text-white rounded-xl shadow-xl group-hover:block z-20 leading-relaxed">
                            <p className="font-bold mb-1">Cách hoạt động:</p>
                            Hệ thống lấy <b>[Chi phí vận hành]</b> chia cho <b>[Doanh thu/Khách hàng]</b> để tìm ra số lượng User tối thiểu bạn cần phục vụ hàng tháng nhằm đạt mức 0 đồng (không lỗ).
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Chi phí vận hành */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-emerald-800 uppercase tracking-tighter">Chi phí vận hành/tháng</label>
                            <span className="text-sm font-black text-emerald-600">{formData.monthlyCost.toLocaleString()}đ</span>
                        </div>
                        <input type="range" min="1000000" max="50000000" step="500000" value={formData.monthlyCost} onChange={(e) => handleSliderChange('monthlyCost', parseInt(e.target.value))} className="w-full h-2 bg-emerald-200/50 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                        <div className="flex justify-between text-[9px] text-emerald-400 font-bold"><span>1TR</span><span>50TR</span></div>
                    </div>

                    {/* Doanh thu trên mỗi user */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-emerald-800 uppercase tracking-tighter">Giá thu trên mỗi khách hàng</label>
                            <span className="text-sm font-black text-emerald-600">{formData.pricePerUser.toLocaleString()}đ</span>
                        </div>
                        <input type="range" min="10000" max="2000000" step="10000" value={formData.pricePerUser} onChange={(e) => handleSliderChange('pricePerUser', parseInt(e.target.value))} className="w-full h-2 bg-emerald-200/50 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                        <div className="flex justify-between text-[9px] text-emerald-400 font-bold"><span>10K</span><span>2TR</span></div>
                    </div>
                </div>

                <div className="bg-white border border-emerald-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                    <div>
                        <p className="text-[11px] text-emerald-600 font-black uppercase tracking-widest mb-1">Mục tiêu tăng trưởng</p>
                        <p className="text-xs text-zinc-500 leading-tight">Cần phục vụ ít nhất khách hàng bên phải để hòa vốn chi phí.</p>
                    </div>
                    <div className="text-left sm:text-right">
                        <motion.p
                            key={breakEvenUsers}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-emerald-500 font-black text-4xl"
                        >
                            {Math.ceil(breakEvenUsers).toLocaleString()}
                            <span className="text-sm font-bold ml-2 text-emerald-400">User/Tháng</span>
                        </motion.p>
                    </div>
                </div>
            </div>
        </div>
    );
}