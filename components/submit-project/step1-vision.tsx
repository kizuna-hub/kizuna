import { motion } from 'framer-motion';
import { Sparkles, Users, Target, Rocket, Layers, Mic, Award } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Step1Props {
    formData: any;
    handleInputChange: (e: any) => void;
    handleAIPolish: (field: string) => void;
    showSparkle: string | null;
}

export function Step1Vision({ formData, handleInputChange, handleAIPolish, showSparkle }: Step1Props) {
    return (
        <div className="space-y-6">
            {/* Hàng 1: Tên dự án & Lĩnh vực */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tên dự án */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                        <Users className="w-4 h-4 text-kizuna-primary" /> Tên dự án
                    </label>
                    <p className="text-xs text-kizuna-text-muted mb-2">Đặt tên startup của bạn.</p>
                    <Input
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleInputChange}
                        placeholder="Ví dụ: Kizuna Hub"
                        className="bg-white border border-zinc-300 text-kizuna-text-main focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary px-3 py-2"
                    />
                </div>

                {/* Lĩnh vực trọng điểm (Category) */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                        <Layers className="w-4 h-4 text-kizuna-primary" /> Lĩnh vực trọng điểm
                    </label>
                    <p className="text-xs text-kizuna-text-muted mb-2">Giúp AI phân loại Mentor phù hợp.</p>
                    <div className="relative">
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full bg-white border border-zinc-300 rounded-md text-sm text-kizuna-text-main focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary px-3 py-2 appearance-none h-10"
                        >
                            <option value="" disabled>Chọn lĩnh vực...</option>
                            <option value="AI & DeepTech">AI & DeepTech</option>
                            <option value="EdTech">Giáo dục (EdTech)</option>
                            <option value="AgriTech">Nông nghiệp (AgriTech)</option>
                            <option value="FinTech">Tài chính (FinTech)</option>
                            <option value="Social Impact">Tác động Xã hội</option>
                            <option value="E-commerce">Thương mại điện tử</option>
                            <option value="Other">Khác</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
                            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slogan / Elevator Pitch */}
            <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                    <Mic className="w-4 h-4 text-kizuna-primary" /> Slogan (Elevator Pitch)
                </label>
                <p className="text-xs text-kizuna-text-muted mb-2">Tóm tắt dự án của bạn trong 1 câu duy nhất (Dưới 80 ký tự).</p>
                <Input
                    name="slogan"
                    value={formData.slogan}
                    onChange={handleInputChange}
                    maxLength={80}
                    placeholder="Ví dụ: Nền tảng ươm tạo số và bảo vệ bản quyền ý tưởng cho sinh viên."
                    className="bg-white border border-zinc-300 text-kizuna-text-main focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary px-3 py-2"
                />
            </div>

            {/* Vấn đề (Có AI Polish) */}
            <div className="relative">
                <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                    <Target className="w-4 h-4 text-kizuna-primary" /> Đặt ra vấn đề
                </label>
                <Textarea
                    name="problem"
                    value={formData.problem}
                    onChange={handleInputChange}
                    placeholder="Nêu rõ 'nỗi đau' của thị trường mà bạn đang muốn giải quyết..."
                    className="bg-white border border-zinc-300 text-kizuna-text-main min-h-24 p-3"
                />
                <div className="absolute bottom-3 right-3 group">
                    <button
                        onClick={() => handleAIPolish('problem')}
                        disabled={showSparkle === 'problem'}
                        className="flex items-center justify-center bg-zinc-100 text-kizuna-primary border border-zinc-200 rounded-md w-8 h-8 disabled:opacity-50 transition-colors"
                    >
                        {showSparkle === 'problem' ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                                <Sparkles className="w-4 h-4" />
                            </motion.div>
                        ) : (
                            <Sparkles className="w-4 h-4" />
                        )}
                    </button>
                    <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block rounded bg-zinc-800 px-2 py-1 text-[10px] text-zinc-300">AI Polish</span>
                </div>
            </div>

            {/* Giải pháp (Có AI Polish) */}
            <div className="relative">
                <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                    <Rocket className="w-4 h-4 text-kizuna-primary" /> Giải pháp
                </label>
                <Textarea
                    name="solution"
                    value={formData.solution}
                    onChange={handleInputChange}
                    placeholder="Sản phẩm của bạn tháo gỡ điểm nghẽn ấy như thế nào?"
                    className="bg-white border border-zinc-300 text-kizuna-text-main min-h-24 p-3"
                />
                <div className="absolute bottom-3 right-3 group">
                    <button
                        onClick={() => handleAIPolish('solution')}
                        disabled={showSparkle === 'solution'}
                        className="flex items-center justify-center bg-zinc-100 text-kizuna-primary border border-zinc-200 rounded-md w-8 h-8 disabled:opacity-50 transition-colors"
                    >
                        {showSparkle === 'solution' ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                                <Sparkles className="w-4 h-4" />
                            </motion.div>
                        ) : (
                            <Sparkles className="w-4 h-4" />
                        )}
                    </button>
                    <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block rounded bg-zinc-800 px-2 py-1 text-[10px] text-zinc-300">AI Polish</span>
                </div>
            </div>

            {/* Lợi thế độc quyền UVP (Có AI Polish) */}
            <div className="relative">
                <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                    <Award className="w-4 h-4 text-kizuna-primary" /> Lợi thế cạnh tranh (UVP)
                </label>
                <p className="text-xs text-kizuna-text-muted mb-2">Điểm khác biệt / Công nghệ lõi giúp bạn vượt qua đối thủ là gì?</p>
                <Textarea
                    name="uvp"
                    value={formData.uvp}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Sử dụng thuật toán AI bản quyền, hoặc đã ký kết được với 30 đối tác B2B..."
                    className="bg-white border border-zinc-300 text-kizuna-text-main min-h-24 p-3"
                />
                <div className="absolute bottom-3 right-3 group">
                    <button
                        onClick={() => handleAIPolish('uvp')}
                        disabled={showSparkle === 'uvp'}
                        className="flex items-center justify-center bg-zinc-100 text-kizuna-primary border border-zinc-200 rounded-md w-8 h-8 disabled:opacity-50 transition-colors"
                    >
                        {showSparkle === 'uvp' ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                                <Sparkles className="w-4 h-4" />
                            </motion.div>
                        ) : (
                            <Sparkles className="w-4 h-4" />
                        )}
                    </button>
                    <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block rounded bg-zinc-800 px-2 py-1 text-[10px] text-zinc-300">AI Polish</span>
                </div>
            </div>
        </div>
    );
}