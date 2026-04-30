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

    // Danh sách các lĩnh vực kèm Icon
    const categories = [
        { id: 'AI & DeepTech', icon: '🤖', label: 'AI & DeepTech' },
        { id: 'EdTech', icon: '📚', label: 'EdTech' },
        { id: 'AgriTech', icon: '🌿', label: 'AgriTech' },
        { id: 'FinTech', icon: '💳', label: 'FinTech' },
        { id: 'Social Impact', icon: '🌍', label: 'Social Impact' },
        { id: 'E-commerce', icon: '🛒', label: 'E-commerce' },
    ];

    return (
        <div className="space-y-8">
            {/* Tên dự án */}
            <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                    <Users className="w-4 h-4 text-kizuna-primary" /> Tên dự án
                </label>
                <p className="text-xs text-kizuna-text-muted mb-3">Đặt tên startup của bạn.</p>
                <Input
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Kizuna Hub"
                    className="bg-white border border-zinc-300 text-kizuna-text-main focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary px-4 py-6 text-lg font-medium transition-all shadow-sm"
                />
            </div>

            {/* Slogan / Elevator Pitch */}
            <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                    <Mic className="w-4 h-4 text-kizuna-primary" /> Slogan (Elevator Pitch)
                </label>
                <p className="text-xs text-kizuna-text-muted mb-3">Tóm tắt dự án của bạn trong 1 câu duy nhất (Dưới 80 ký tự).</p>
                <Input
                    name="slogan"
                    value={formData.slogan}
                    onChange={handleInputChange}
                    maxLength={80}
                    placeholder="Ví dụ: Nền tảng ươm tạo số và bảo vệ bản quyền ý tưởng cho sinh viên."
                    className="bg-white border border-zinc-300 text-kizuna-text-main focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary px-3 py-3 shadow-sm transition-all"
                />
            </div>

            {/* Lĩnh vực trọng điểm (Category) - VISUAL CARDS UPGRADE */}
            <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                    <Layers className="w-4 h-4 text-kizuna-primary" /> Lĩnh vực trọng điểm
                </label>
                <p className="text-xs text-kizuna-text-muted mb-4">Giúp AI phân loại Mentor phù hợp.</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categories.map((cat) => {
                        const isSelected = formData.category === cat.id;
                        return (
                            <div
                                key={cat.id}
                                onClick={() => handleInputChange({ target: { name: 'category', value: cat.id } })}
                                className={`cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center text-center transition-all duration-200 ${isSelected
                                        ? 'border-kizuna-primary bg-kizuna-primary/5 ring-1 ring-kizuna-primary shadow-sm'
                                        : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50'
                                    }`}
                            >
                                <span className="text-2xl mb-2">{cat.icon}</span>
                                <span className={`text-xs font-semibold ${isSelected ? 'text-kizuna-primary' : 'text-zinc-600'}`}>
                                    {cat.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Vấn đề (Có AI Polish) */}
            <div className="relative pt-4 border-t border-zinc-100">
                <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                    <Target className="w-4 h-4 text-kizuna-primary" /> Đặt ra vấn đề
                </label>
                <Textarea
                    name="problem"
                    value={formData.problem}
                    onChange={handleInputChange}
                    placeholder="Nêu rõ 'nỗi đau' của thị trường mà bạn đang muốn giải quyết..."
                    className="bg-white border border-zinc-300 text-kizuna-text-main min-h-24 p-4 shadow-sm"
                />
                <div className="absolute bottom-4 right-4 group">
                    <button
                        onClick={() => handleAIPolish('problem')}
                        disabled={showSparkle === 'problem'}
                        className="flex items-center justify-center bg-zinc-100 text-kizuna-primary border border-zinc-200 rounded-md w-8 h-8 disabled:opacity-50 transition-colors shadow-sm hover:bg-white"
                    >
                        {showSparkle === 'problem' ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                                <Sparkles className="w-4 h-4" />
                            </motion.div>
                        ) : (
                            <Sparkles className="w-4 h-4" />
                        )}
                    </button>
                    <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block rounded bg-zinc-800 px-2 py-1 text-[10px] text-zinc-300 shadow-lg">AI Polish</span>
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
                    className="bg-white border border-zinc-300 text-kizuna-text-main min-h-24 p-4 shadow-sm"
                />
                <div className="absolute bottom-4 right-4 group">
                    <button
                        onClick={() => handleAIPolish('solution')}
                        disabled={showSparkle === 'solution'}
                        className="flex items-center justify-center bg-zinc-100 text-kizuna-primary border border-zinc-200 rounded-md w-8 h-8 disabled:opacity-50 transition-colors shadow-sm hover:bg-white"
                    >
                        {showSparkle === 'solution' ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                                <Sparkles className="w-4 h-4" />
                            </motion.div>
                        ) : (
                            <Sparkles className="w-4 h-4" />
                        )}
                    </button>
                    <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block rounded bg-zinc-800 px-2 py-1 text-[10px] text-zinc-300 shadow-lg">AI Polish</span>
                </div>
            </div>

            {/* Lợi thế độc quyền UVP (Có AI Polish) */}
            <div className="relative">
                <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                    <Award className="w-4 h-4 text-kizuna-primary" /> Lợi thế cạnh tranh (UVP)
                </label>
                <p className="text-xs text-kizuna-text-muted mb-3">Điểm khác biệt / Công nghệ lõi giúp bạn vượt qua đối thủ là gì?</p>
                <Textarea
                    name="uvp"
                    value={formData.uvp}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Sử dụng thuật toán AI bản quyền, hoặc đã ký kết được với 30 đối tác B2B..."
                    className="bg-white border border-zinc-300 text-kizuna-text-main min-h-24 p-4 shadow-sm"
                />
                <div className="absolute bottom-4 right-4 group">
                    <button
                        onClick={() => handleAIPolish('uvp')}
                        disabled={showSparkle === 'uvp'}
                        className="flex items-center justify-center bg-zinc-100 text-kizuna-primary border border-zinc-200 rounded-md w-8 h-8 disabled:opacity-50 transition-colors shadow-sm hover:bg-white"
                    >
                        {showSparkle === 'uvp' ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                                <Sparkles className="w-4 h-4" />
                            </motion.div>
                        ) : (
                            <Sparkles className="w-4 h-4" />
                        )}
                    </button>
                    <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block rounded bg-zinc-800 px-2 py-1 text-[10px] text-zinc-300 shadow-lg">AI Polish</span>
                </div>
            </div>
        </div>
    );
}