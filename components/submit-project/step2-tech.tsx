import { motion } from 'framer-motion';
import { Sparkles, Cpu, Link as LinkIcon, Map, MonitorPlay, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Step2Props {
    formData: any;
    handleInputChange: (e: any) => void;
    handleAIPolish: (field: string) => void;
    showSparkle: string | null;
}

export function Step2Tech({ formData, handleInputChange, handleAIPolish, showSparkle }: Step2Props) {
    return (
        <div className="space-y-6">
            {/* Hàng 1: Trạng thái & Link Demo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Trạng thái dự án */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                        <Activity className="w-4 h-4 text-kizuna-primary" /> Giai đoạn hiện tại
                    </label>
                    <p className="text-xs text-kizuna-text-muted mb-2">Đánh giá khách quan tiến độ dự án.</p>
                    <div className="relative">
                        <select
                            name="currentStage"
                            value={formData.currentStage}
                            onChange={handleInputChange}
                            className="w-full bg-white border border-zinc-300 rounded-md text-sm text-kizuna-text-main focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary px-3 py-2 appearance-none h-10"
                        >
                            <option value="" disabled>Chọn giai đoạn...</option>
                            <option value="Idea">Chỉ mới là Ý tưởng (Idea)</option>
                            <option value="Prototype">Đã có thiết kế / Prototype</option>
                            <option value="MVP">Đã có bản chạy thử (MVP)</option>
                            <option value="Production">Đã ra mắt / Đang vận hành</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
                            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Link Demo */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                        <LinkIcon className="w-4 h-4 text-kizuna-primary" /> Link Demo / Pitch Deck
                    </label>
                    <p className="text-xs text-kizuna-text-muted mb-2">URL Figma, Github hoặc trang web thực tế.</p>
                    <Input
                        name="demoLink"
                        type="url"
                        value={formData.demoLink}
                        onChange={handleInputChange}
                        placeholder="https://..."
                        className="bg-white border border-zinc-300 text-kizuna-text-main focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary px-3 py-2"
                    />
                </div>
            </div>

            {/* Tech Stack */}
            <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                    <Cpu className="w-4 h-4 text-kizuna-primary" /> Công nghệ sử dụng (Tech Stack)
                </label>
                <p className="text-xs text-kizuna-text-muted mb-2">Liệt kê các ngôn ngữ, framework hoặc nền tảng lõi.</p>
                <Input
                    name="techStack"
                    value={formData.techStack}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Next.js, NestJS, PostgreSQL, SpacetimeDB, Gemini Pro..."
                    className="bg-white border border-zinc-300 text-kizuna-text-main focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary px-3 py-2"
                />
            </div>

            {/* Mức độ sẵn sàng (Có AI Polish) */}
            <div className="relative">
                <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                    <MonitorPlay className="w-4 h-4 text-kizuna-primary" /> Chi tiết mức độ hoàn thiện
                </label>
                <p className="text-xs text-kizuna-text-muted mb-2">Mô tả cụ thể những gì đã làm được và những gì còn thiếu.</p>
                <Textarea
                    name="productReadiness"
                    value={formData.productReadiness}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Đã hoàn thiện giao diện người dùng, kết nối xong database nhưng phần thanh toán chưa tích hợp..."
                    className="bg-white border border-zinc-300 text-kizuna-text-main placeholder:text-zinc-400 min-h-32 focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all duration-300 p-3"
                />
                <div className="absolute bottom-3 right-3 group">
                    <button
                        onClick={() => handleAIPolish('productReadiness')}
                        disabled={showSparkle === 'productReadiness'}
                        className="flex items-center justify-center bg-zinc-100 text-kizuna-primary border border-zinc-200 rounded-md w-8 h-8 transition-colors disabled:opacity-50"
                    >
                        {showSparkle === 'productReadiness' ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                                <Sparkles className="w-4 h-4" />
                            </motion.div>
                        ) : (
                            <Sparkles className="w-4 h-4" />
                        )}
                    </button>
                    <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block whitespace-nowrap rounded bg-zinc-800 px-2 py-1 text-[10px] text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">AI Polish</span>
                </div>
            </div>

            {/* Lộ trình phát triển (Có AI Polish) */}
            <div className="relative">
                <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                    <Map className="w-4 h-4 text-kizuna-primary" /> Lộ trình phát triển (Roadmap)
                </label>
                <p className="text-xs text-kizuna-text-muted mb-2">Các cột mốc (milestones) quan trọng trong 6-12 tháng tới.</p>
                <Textarea
                    name="roadmap"
                    value={formData.roadmap}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Q3 2026: Ra mắt bản Alpha; Q4 2026: Đạt 1000 user đầu tiên..."
                    className="bg-white border border-zinc-300 text-kizuna-text-main placeholder:text-zinc-400 min-h-32 focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all duration-300 p-3"
                />
                <div className="absolute bottom-3 right-3 group">
                    <button
                        onClick={() => handleAIPolish('roadmap')}
                        disabled={showSparkle === 'roadmap'}
                        className="flex items-center justify-center bg-zinc-100 text-kizuna-primary border border-zinc-200 rounded-md w-8 h-8 transition-colors disabled:opacity-50"
                    >
                        {showSparkle === 'roadmap' ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                                <Sparkles className="w-4 h-4" />
                            </motion.div>
                        ) : (
                            <Sparkles className="w-4 h-4" />
                        )}
                    </button>
                    <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block whitespace-nowrap rounded bg-zinc-800 px-2 py-1 text-[10px] text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">AI Polish</span>
                </div>
            </div>
        </div>
    );
}