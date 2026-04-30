import { motion } from 'framer-motion';
import { Sparkles, Users, Coins, Megaphone, Handshake, Info } from 'lucide-react';
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

    return (
        <div className="space-y-6">
            {/* Khách hàng mục tiêu (Có AI Polish) */}
            <div className="relative">
                <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                    <Users className="w-4 h-4 text-kizuna-primary" /> Khách hàng mục tiêu
                </label>
                <p className="text-xs text-kizuna-text-muted mb-2">Chân dung nhóm người dùng sẵn sàng trả tiền cho bạn.</p>
                <Textarea
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Sinh viên năm nhất khu vực Đà Nẵng gặp khó khăn trong việc tìm trọ..."
                    className="bg-white border border-zinc-300 text-kizuna-text-main placeholder:text-zinc-400 min-h-24 focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all duration-300 p-3"
                />
                {/* AI Button Placeholder (Giống step trước) */}
                <div className="absolute bottom-3 right-3 group">
                    <button onClick={() => handleAIPolish('targetAudience')} disabled={showSparkle === 'targetAudience'} className="flex items-center justify-center bg-zinc-100 text-kizuna-primary border border-zinc-200 rounded-md w-8 h-8 disabled:opacity-50">
                        {showSparkle === 'targetAudience' ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}><Sparkles className="w-4 h-4" /></motion.div> : <Sparkles className="w-4 h-4" />}
                    </button>
                    <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block rounded bg-zinc-800 px-2 py-1 text-[10px] text-zinc-300">AI Polish</span>
                </div>
            </div>

            {/* Go-to-Market Strategy (Mới) */}
            <div className="relative">
                <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                    <Megaphone className="w-4 h-4 text-kizuna-primary" /> Kế hoạch Thu hút User (Go-to-Market)
                </label>
                <p className="text-xs text-kizuna-text-muted mb-2">Bạn định tìm kiếm 100 khách hàng đầu tiên bằng cách nào?</p>
                <Textarea
                    name="goToMarket"
                    value={formData.goToMarket}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Đặt booth giới thiệu tại Job Fair ĐH Bách Khoa, hợp tác với Đoàn trường..."
                    className="bg-white border border-zinc-300 text-kizuna-text-main placeholder:text-zinc-400 min-h-24 focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all duration-300 p-3"
                />
                <div className="absolute bottom-3 right-3 group">
                    <button onClick={() => handleAIPolish('goToMarket')} disabled={showSparkle === 'goToMarket'} className="flex items-center justify-center bg-zinc-100 text-kizuna-primary border border-zinc-200 rounded-md w-8 h-8 disabled:opacity-50">
                        {showSparkle === 'goToMarket' ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}><Sparkles className="w-4 h-4" /></motion.div> : <Sparkles className="w-4 h-4" />}
                    </button>
                    <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block rounded bg-zinc-800 px-2 py-1 text-[10px] text-zinc-300">AI Polish</span>
                </div>
            </div>

            {/* Mô hình doanh thu & Gọi vốn */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                    <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                        <Coins className="w-4 h-4 text-kizuna-primary" /> Mô hình doanh thu
                    </label>
                    <p className="text-xs text-kizuna-text-muted mb-2">Cách dòng tiền chảy vào startup.</p>
                    <Textarea
                        name="revenueModel"
                        value={formData.revenueModel}
                        onChange={handleInputChange}
                        placeholder="Ví dụ: Freemium, thu phí 10% giao dịch..."
                        className="bg-white border border-zinc-300 text-kizuna-text-main placeholder:text-zinc-400 min-h-24 focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all duration-300 p-3"
                    />
                </div>

                <div className="relative">
                    <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                        <Handshake className="w-4 h-4 text-kizuna-primary" /> Nhu cầu Gọi vốn & ROI
                    </label>
                    <p className="text-xs text-kizuna-text-muted mb-2">Mentor/Nhà đầu tư sẽ nhận lại được gì?</p>
                    <Textarea
                        name="fundingAsk"
                        value={formData.fundingAsk}
                        onChange={handleInputChange}
                        placeholder="Ví dụ: Cần 50 triệu và cố vấn Marketing. Đổi lại 5% cổ phần."
                        className="bg-white border border-zinc-300 text-kizuna-text-main placeholder:text-zinc-400 min-h-24 focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all duration-300 p-3"
                    />
                </div>
            </div>

            {/* Quick Break-Even Calculator */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-6">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-kizuna-text-main">Công cụ tính Break-Even (Điểm hòa vốn) nhanh</h3>
                    <div className="group relative cursor-pointer">
                        <Info className="w-4 h-4 text-zinc-400 hover:text-kizuna-primary" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden w-64 p-2 bg-zinc-800 text-xs text-white rounded shadow-lg group-hover:block z-10 text-center">
                            Số lượng khách hàng tối thiểu mỗi tháng để startup không bị lỗ vốn (Chi phí = Doanh thu).
                        </div>
                    </div>
                </div>

                {/* Sliders (Giữ nguyên như thiết kế cũ của bro vì nó quá đẹp rồi) */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-medium text-kizuna-text-muted">Chi phí vận hành hàng tháng</label>
                        <span className="text-sm font-semibold text-kizuna-primary">{formData.monthlyCost.toLocaleString()} VNĐ</span>
                    </div>
                    <input type="range" min="1000000" max="50000000" step="500000" value={formData.monthlyCost} onChange={(e) => handleSliderChange('monthlyCost', parseInt(e.target.value))} className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-kizuna-primary" />
                    <div className="text-xs text-kizuna-text-muted mt-1 flex justify-between"><span>1,000,000 VNĐ</span><span>50,000,000 VNĐ</span></div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-medium text-kizuna-text-muted">Giá trên mỗi Người dùng/Khách hàng</label>
                        <span className="text-sm font-semibold text-kizuna-primary">{formData.pricePerUser.toLocaleString()} VNĐ</span>
                    </div>
                    <input type="range" min="10000" max="2000000" step="10000" value={formData.pricePerUser} onChange={(e) => handleSliderChange('pricePerUser', parseInt(e.target.value))} className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-kizuna-primary" />
                    <div className="text-xs text-kizuna-text-muted mt-1 flex justify-between"><span>10,000 VNĐ</span><span>2,000,000 VNĐ</span></div>
                </div>

                {/* Kết quả */}
                <div className="bg-kizuna-primary/10 border border-kizuna-primary/20 rounded-lg p-4 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <p className="text-sm text-kizuna-text-main font-semibold mb-1">Điểm hòa vốn cần đạt</p>
                        <p className="text-xs text-kizuna-text-muted">
                            Để bù đắp khoản chi phí {formData.monthlyCost.toLocaleString()} VNĐ
                        </p>
                    </div>
                    <div className="text-left sm:text-right">
                        <p className="text-kizuna-primary font-black text-3xl">
                            {Math.ceil(breakEvenUsers).toLocaleString()} <span className="text-sm font-medium text-kizuna-primary/80">user/tháng</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}