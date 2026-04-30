import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Cpu, Link as LinkIcon, Map,
    MonitorPlay, Activity, ShieldCheck,
    Lock, FileCheck, Cloud, ShieldAlert,
    Plus, Trash2, Calendar, Flag
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface Step2Props {
    formData: any;
    handleInputChange: (e: any) => void;
    handleAIPolish: (field: string) => void;
    showSparkle: string | null;
}

export function Step2Tech({ formData, handleInputChange, handleAIPolish, showSparkle }: Step2Props) {
    const milestones = formData.roadmap || [];
    const [newMilestone, setNewMilestone] = useState({ time: '', task: '' });

    const securityOptions = [
        { id: 'sec_encryption', label: 'Mã hóa dữ liệu người dùng (End-to-End)', icon: Lock },
        { id: 'sec_compliance', label: 'Tuân thủ Nghị định 13/2023/NĐ-CP', icon: FileCheck },
        { id: 'sec_rbac', label: 'Phân quyền chặt chẽ (RBAC)', icon: ShieldAlert },
        { id: 'sec_backup', label: 'Sao lưu đám mây (Cloud Backup)', icon: Cloud },
    ];

    const securityCount = securityOptions.filter(opt => formData[opt.id]).length;
    const trustScore = (securityCount / securityOptions.length) * 100;

    const addMilestone = () => {
        if (newMilestone.time && newMilestone.task) {
            const updatedRoadmap = [...milestones, newMilestone];
            handleInputChange({ target: { name: 'roadmap', value: updatedRoadmap } });
            setNewMilestone({ time: '', task: '' });
        }
    };

    const removeMilestone = (index: number) => {
        const updatedRoadmap = milestones.filter((_: any, i: number) => i !== index);
        handleInputChange({ target: { name: 'roadmap', value: updatedRoadmap } });
    };

    return (
        <div className="space-y-8">
            {/* 1. Trạng thái & Demo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                        <Activity className="w-4 h-4 text-kizuna-primary" /> Giai đoạn hiện tại
                    </label>
                    <p className="text-xs text-kizuna-text-muted mb-2">Đánh giá khách quan tiến độ dự án.</p>
                    <select
                        name="currentStage"
                        value={formData.currentStage}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-zinc-300 rounded-lg text-sm text-kizuna-text-main focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary px-3 py-2.5 appearance-none"
                    >
                        <option value="" disabled>Chọn giai đoạn...</option>
                        <option value="Idea">Chỉ mới là Ý tưởng (Idea)</option>
                        <option value="Prototype">Đã có thiết kế / Prototype</option>
                        <option value="MVP">Đã có bản chạy thử (MVP)</option>
                        <option value="Production">Đã ra mắt / Đang vận hành</option>
                    </select>
                </div>

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
                        className="bg-white border border-zinc-300 text-kizuna-text-main focus:border-kizuna-primary px-3 py-2.5"
                    />
                </div>
            </div>

            {/* 2. Tech Stack */}
            <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                    <Cpu className="w-4 h-4 text-kizuna-primary" /> Công nghệ sử dụng (Tech Stack)
                </label>
                <p className="text-xs text-kizuna-text-muted mb-3">Liệt kê framework hoặc nền tảng lõi (Next.js, SpacetimeDB...)</p>
                <Input
                    name="techStack"
                    value={formData.techStack}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Next.js, PostgreSQL, SpacetimeDB, Gemini Pro..."
                    className="bg-white border border-zinc-300 text-kizuna-text-main focus:border-kizuna-primary px-3 py-2.5"
                />
            </div>

            {/* 3. SECTION BẢO MẬT: ĐÃ UPDATE BỘ MÀU KIZUNA */}
            <div className="bg-kizuna-surface border border-kizuna-border rounded-2xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-bold text-kizuna-text-main flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-kizuna-primary" /> Bảo mật & Dữ liệu
                        </h3>
                        <p className="text-[11px] text-kizuna-text-muted mt-0.5 uppercase font-black tracking-tight">Data Privacy Standards</p>
                    </div>

                    <div className="flex flex-col items-end min-w-[120px]">
                        <span className="text-[10px] font-black text-kizuna-primary uppercase mb-1">
                            Trust Score: {trustScore}%
                        </span>
                        <div className="w-32 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ width: `${trustScore}%` }}
                                className="h-full bg-kizuna-primary transition-all duration-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {securityOptions.map((opt) => (
                        <label
                            key={opt.id}
                            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none
                                ${formData[opt.id]
                                    ? 'bg-kizuna-primary/5 border-kizuna-primary/30 shadow-sm'
                                    : 'bg-white border-zinc-200 hover:border-kizuna-primary/20'
                                }`}
                        >
                            <input
                                type="checkbox"
                                name={opt.id}
                                checked={formData[opt.id] || false}
                                onChange={(e) => handleInputChange({ target: { name: opt.id, value: e.target.checked } })}
                                className="w-4 h-4 rounded border-zinc-300 text-kizuna-primary focus:ring-kizuna-primary"
                            />
                            <div className="flex items-center gap-2">
                                <opt.icon className={`w-4 h-4 ${formData[opt.id] ? 'text-kizuna-primary' : 'text-zinc-400'}`} />
                                <span className={`text-xs font-bold ${formData[opt.id] ? 'text-kizuna-text-main' : 'text-kizuna-text-muted'}`}>
                                    {opt.label}
                                </span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* 4. ROADMAP BUILDER: ĐÃ UPDATE BỘ MÀU KIZUNA */}
            <div className="space-y-6">
                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                        <Map className="w-4 h-4 text-kizuna-primary" /> Lộ trình phát triển (Roadmap)
                    </label>
                    <p className="text-xs text-kizuna-text-muted mb-4">Xây dựng các cột mốc chiến lược để nhà đầu tư thấy được tầm nhìn dài hạn.</p>
                </div>

                <div className="bg-white border border-kizuna-border rounded-2xl p-4 shadow-sm space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-4 relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                            <Input
                                placeholder="Ví dụ: Q1/2026"
                                value={newMilestone.time}
                                onChange={(e) => setNewMilestone({ ...newMilestone, time: e.target.value })}
                                className="pl-9 border-zinc-200 focus:border-kizuna-primary text-sm h-11"
                            />
                        </div>
                        <div className="sm:col-span-6 relative">
                            <Flag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                            <Input
                                placeholder="Mục tiêu cốt lõi..."
                                value={newMilestone.task}
                                onChange={(e) => setNewMilestone({ ...newMilestone, task: e.target.value })}
                                className="pl-9 border-zinc-200 focus:border-kizuna-primary text-sm h-11"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <Button
                                type="button"
                                onClick={addMilestone}
                                disabled={!newMilestone.time || !newMilestone.task}
                                className="w-full bg-kizuna-primary hover:opacity-90 text-white h-11 rounded-xl transition-all active:scale-95"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="relative pl-8 pr-4 py-4 min-h-[100px]">
                    {/* Timeline Line gradient Kizuna */}
                    <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-kizuna-primary/60 via-kizuna-primary/20 to-transparent rounded-full" />

                    <div className="space-y-6">
                        <AnimatePresence>
                            {milestones.length === 0 ? (
                                <div className="text-center py-10 border-2 border-dashed border-kizuna-border rounded-3xl">
                                    <p className="text-[10px] text-zinc-400 uppercase font-black italic">Chưa xác định lộ trình</p>
                                </div>
                            ) : (
                                milestones.map((item: any, index: number) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="relative group"
                                    >
                                        <div className="absolute -left-[23px] top-1.5 w-4 h-4 rounded-full border-2 border-white bg-kizuna-primary shadow-sm z-10" />

                                        <div className="bg-white border border-kizuna-border p-4 rounded-2xl shadow-sm group-hover:border-kizuna-primary/40 transition-colors flex justify-between items-start">
                                            <div>
                                                <span className="text-[10px] font-black text-kizuna-primary uppercase tracking-tighter bg-kizuna-primary/5 px-2 py-0.5 rounded">
                                                    {item.time}
                                                </span>
                                                <h4 className="text-sm font-bold text-kizuna-text-main mt-1.5">{item.task}</h4>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeMilestone(index)}
                                                className="text-zinc-300 hover:text-red-500 transition-colors p-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="button"
                            onClick={() => handleAIPolish('roadmap')}
                            disabled={showSparkle === 'roadmap'}
                            className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-full text-[11px] font-bold uppercase hover:bg-black transition-all shadow-xl disabled:opacity-50"
                        >
                            {showSparkle === 'roadmap' ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                                    <Sparkles className="w-3.5 h-3.5" />
                                </motion.div>
                            ) : (
                                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                            )}
                            Gợi ý Roadmap bằng AI
                        </button>
                    </div>
                </div>
            </div>

            {/* 5. Chi tiết mức độ hoàn thiện */}
            <div className="relative pt-4 border-t border-kizuna-border">
                <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                    <MonitorPlay className="w-4 h-4 text-kizuna-primary" /> Mức độ hoàn thiện MVP
                </label>
                <p className="text-xs text-kizuna-text-muted mb-2">Mô tả cụ thể những tính năng đã chạy được.</p>
                <div className="relative">
                    <Textarea
                        name="productReadiness"
                        value={formData.productReadiness}
                        onChange={handleInputChange}
                        placeholder="Ví dụ: Đã xong prototype, kết nối database..."
                        className="bg-white border border-zinc-300 text-kizuna-text-main min-h-32 p-4 rounded-2xl focus:border-kizuna-primary"
                    />
                    <div className="absolute bottom-4 right-4 group">
                        <button
                            type="button"
                            onClick={() => handleAIPolish('productReadiness')}
                            disabled={showSparkle === 'productReadiness'}
                            className="flex items-center justify-center bg-zinc-100 text-kizuna-primary border border-zinc-200 rounded-md w-8 h-8 disabled:opacity-50 hover:bg-white transition-all shadow-sm"
                        >
                            {showSparkle === 'productReadiness' ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                                    <Sparkles className="w-4 h-4" />
                                </motion.div>
                            ) : (
                                <Sparkles className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}