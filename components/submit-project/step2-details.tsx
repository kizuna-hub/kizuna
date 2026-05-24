"use client";

import React from "react";
import { motion } from "framer-motion";
import { Layers, FileText, Cpu, Link as LinkIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step2DetailsProps {
    formData: any;
    updateFormData: (field: string, value: any) => void;
    handleAIPolish: (field: string) => void;
    showSparkle: string | null;
}

export function Step2Details({ formData, updateFormData, handleAIPolish, showSparkle }: Step2DetailsProps) {

    // Danh sách các lĩnh vực
    const categoriesList = [
        { id: 'AI & DeepTech', icon: '🤖', label: 'AI & DeepTech' },
        { id: 'EdTech', icon: '📚', label: 'EdTech' },
        { id: 'AgriTech', icon: '🌿', label: 'AgriTech' },
        { id: 'FinTech', icon: '💳', label: 'FinTech' },
        { id: 'Social Impact', icon: '🌍', label: 'Social Impact' },
        { id: 'E-commerce', icon: '🛒', label: 'E-commerce' },
    ];

    // Hàm xử lý chọn nhiều Category
    const toggleCategory = (catId: string) => {
        const currentCats = formData.categories || [];
        if (currentCats.includes(catId)) {
            updateFormData('categories', currentCats.filter((id: string) => id !== catId));
        } else {
            updateFormData('categories', [...currentCats, catId]);
        }
    };

    return (
        <div className="space-y-10">

            {/* 1. Lĩnh vực trọng điểm */}
            <div>
                <label className="flex items-center gap-2 text-sm font-bold text-[#081810] mb-1.5">
                    <Layers className="w-4 h-4 text-zinc-400" /> Lĩnh vực của sản phẩm <span className="text-red-500">*</span>
                </label>
                <p className="text-xs font-medium text-zinc-500 mb-4">Chọn tối đa 3 lĩnh vực để hệ thống phân loại dự án của bạn.</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categoriesList.map((cat) => {
                        const isSelected = formData.categories.includes(cat.id);
                        return (
                            <div
                                key={cat.id}
                                onClick={() => toggleCategory(cat.id)}
                                className={cn(
                                    "cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center text-center transition-all duration-200",
                                    isSelected
                                        ? "border-[#16452a] bg-[#16452a]/5 ring-1 ring-[#16452a] shadow-sm"
                                        : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                                )}
                            >
                                <span className="text-2xl mb-2">{cat.icon}</span>
                                <span className={cn(
                                    "text-xs font-bold",
                                    isSelected ? "text-[#16452a]" : "text-zinc-600"
                                )}>
                                    {cat.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <hr className="border-zinc-100" />

            {/* 2. Mô tả dự án (Có AI Polish) */}
            <div className="relative">
                <label className="flex items-center gap-2 text-sm font-bold text-[#081810] mb-1.5">
                    <FileText className="w-4 h-4 text-zinc-400" /> Mô tả ngắn gọn <span className="text-red-500">*</span>
                </label>
                <p className="text-xs font-medium text-zinc-500 mb-3">
                    Sản phẩm của bạn giải quyết vấn đề gì và như thế nào? (Gợi ý: Hãy viết nháp và dùng AI để trau chuốt).
                </p>

                <div className="relative">
                    <textarea
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        placeholder="Ví dụ: Hiện tại sinh viên rất khó tiếp cận các Mentor chất lượng. Sản phẩm của chúng tôi là một nền tảng kết nối..."
                        className="w-full min-h-[140px] bg-white border border-zinc-200 text-slate-900 rounded-xl p-4 text-sm focus:outline-none focus:border-[#16452a] focus:ring-1 focus:ring-[#16452a] transition-all shadow-sm resize-y"
                    />

                    {/* Nút AI Polish */}
                    <div className="absolute bottom-4 right-4 group">
                        <button
                            type="button"
                            onClick={() => handleAIPolish('description')}
                            disabled={showSparkle === 'description' || formData.description.length < 10}
                            className="flex items-center justify-center bg-zinc-100 text-[#16452a] border border-zinc-200 rounded-lg w-9 h-9 disabled:opacity-50 hover:bg-white hover:border-[#16452a]/30 transition-all shadow-sm cursor-pointer"
                        >
                            {showSparkle === 'description' ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                                    <Sparkles className="w-4 h-4" />
                                </motion.div>
                            ) : (
                                <Sparkles className="w-4 h-4" />
                            )}
                        </button>
                        {/* Tooltip */}
                        <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block rounded bg-zinc-800 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg whitespace-nowrap">
                            Làm mượt bằng AI
                        </span>
                    </div>
                </div>
            </div>

            {/* 3. Tech Stack & Link */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Tech Stack */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-[#081810] mb-1.5">
                        <Cpu className="w-4 h-4 text-zinc-400" /> Tech Stack (Tùy chọn)
                    </label>
                    <p className="text-xs font-medium text-zinc-500 mb-3">Công nghệ cốt lõi bạn đang sử dụng.</p>
                    <input
                        type="text"
                        value={formData.techStack}
                        onChange={(e) => updateFormData('techStack', e.target.value)}
                        placeholder="VD: Next.js, PostgreSQL, Prisma..."
                        className="w-full h-11 bg-white border border-zinc-200 text-slate-900 rounded-xl px-4 text-sm focus:outline-none focus:border-[#16452a] focus:ring-1 focus:ring-[#16452a] transition-all shadow-sm"
                    />
                </div>

                {/* Link Demo */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-[#081810] mb-1.5">
                        <LinkIcon className="w-4 h-4 text-zinc-400" /> Link sản phẩm
                    </label>
                    <p className="text-xs font-medium text-zinc-500 mb-3">Website, TestFlight hoặc Figma Demo.</p>
                    <input
                        type="url"
                        value={formData.demoLink}
                        onChange={(e) => updateFormData('demoLink', e.target.value)}
                        placeholder="https://..."
                        className="w-full h-11 bg-white border border-zinc-200 text-slate-900 rounded-xl px-4 text-sm focus:outline-none focus:border-[#16452a] focus:ring-1 focus:ring-[#16452a] transition-all shadow-sm"
                    />
                </div>
            </div>

        </div>
    );
}