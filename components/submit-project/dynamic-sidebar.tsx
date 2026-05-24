"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, FileText, Image, Tags, Video, AlertCircle, XCircle } from "lucide-react";

interface DynamicSidebarProps {
    currentStep: number;
}

export function DynamicSidebar({ currentStep }: DynamicSidebarProps) {
    return (
        // Sử dụng sticky top-24 để bám dính khi scroll. Không background, không border.
        <div className="sticky top-24 space-y-8 pr-2">

            {/* Box Alert Xanh lá nhạt (Bám sát thiết kế Unikorn) */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-slate-700 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-slate-800 leading-relaxed">
                        Sản phẩm phải được sáng lập bởi một người Việt Nam hoặc một đội ngũ có thành viên là người Việt.
                    </p>
                </div>
            </div>

            {/* TIPS SECTION */}
            <div>
                <h3 className="text-lg font-black text-[#081810] mb-5">Product submission tips</h3>

                <div className="space-y-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {/* TIPS CHO BƯỚC 1: CƠ BẢN */}
                            {currentStep === 1 && (
                                <>
                                    <div className="flex items-start gap-3">
                                        <FileText className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-bold text-[#081810] mb-1">Clear product name</h4>
                                            <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                                Use a short, memorable name that accurately reflects your product.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Image className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-bold text-[#081810] mb-1">Quality images</h4>
                                            <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                                Upload a clear thumbnail and demo images that show the UI and key features.
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* TIPS CHO BƯỚC 2: CHI TIẾT */}
                            {currentStep === 2 && (
                                <>
                                    <div className="flex items-start gap-3">
                                        <Tags className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-bold text-[#081810] mb-1">Relevant tags</h4>
                                            <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                                Choose accurate tags so your product is easily discovered by interested users.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Video className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-bold text-[#081810] mb-1">Demo video (if available)</h4>
                                            <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                                A short 1-2 minute video helps viewers quickly understand how to use it.
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* TIPS CHO BƯỚC 3: HOÀN TẤT */}
                            {currentStep === 3 && (
                                <>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-bold text-[#081810] mb-1">Fill in all details</h4>
                                            <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                                Increases the chance of quick approval and a professional appearance.
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* AVOID SECTION */}
            <div className="pt-2">
                <h3 className="text-lg font-black text-[#081810] mb-5">Avoid</h3>

                <div className="space-y-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {currentStep === 1 && (
                                <>
                                    <div className="flex items-start gap-3">
                                        <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                        <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                            Spam, misleading ads, or copyright violations.
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                        <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                            Blurry, irrelevant, or text-heavy images.
                                        </p>
                                    </div>
                                </>
                            )}

                            {currentStep === 2 && (
                                <>
                                    <div className="flex items-start gap-3">
                                        <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                        <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                            Generic descriptions, copying from other sites, or AI-generated content without quality control.
                                        </p>
                                    </div>
                                </>
                            )}

                            {currentStep === 3 && (
                                <>
                                    <div className="flex items-start gap-3">
                                        <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                        <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                            Broken links, pages under maintenance, or unfinished products.
                                        </p>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Bottom text */}
            <div className="pt-8 pb-4 text-center">
                <p className="text-xs font-medium text-zinc-400">
                    Alongside products built by Vietnamese creators
                </p>
            </div>
        </div>
    );
}