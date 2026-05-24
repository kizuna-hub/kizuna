"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, AlertCircle } from "lucide-react";

interface DynamicSidebarProps {
    currentStep: number;
}

export function DynamicSidebar({ currentStep }: DynamicSidebarProps) {
    return (
        <div className="sticky top-24 space-y-4">

            {/* Khối Tips */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="h-5 w-5 text-emerald-600" />
                    <h3 className="text-sm font-bold text-emerald-900">Mẹo cho bước này</h3>
                </div>
                <div className="text-sm font-medium text-emerald-800 leading-relaxed min-h-[80px]">
                    <AnimatePresence mode="wait">
                        <motion.div key={currentStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {currentStep === 1 && "Một cái tên dễ nhớ và một câu Slogan đi thẳng vào vấn đề sẽ giúp dự án của bạn thu hút nhiều lượt Upvote hơn trên Feed."}
                            {currentStep === 2 && "Đừng viết quá dài. Hãy tập trung vào việc bạn đang giải quyết 'nỗi đau' gì của thị trường. Nhớ sử dụng AI Polish để câu văn mượt mà hơn nhé!"}
                            {currentStep === 3 && "Việc minh bạch thông tin về vai trò trong đội ngũ sẽ giúp bạn dễ dàng thu hút các Mentor phù hợp."}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Khối Cảnh báo */}
            <div className="rounded-2xl border border-orange-100 bg-orange-50/30 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    <h3 className="text-sm font-bold text-orange-900">Nên tránh</h3>
                </div>
                <ul className="text-sm font-medium text-orange-800 space-y-2 list-disc pl-4 min-h-[80px]">
                    <AnimatePresence mode="wait">
                        <motion.div key={currentStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {currentStep === 1 && (
                                <>
                                    <li>Slogan vượt quá 80 ký tự.</li>
                                    <li>Sử dụng Logo mờ, sai tỷ lệ (Nên dùng ảnh vuông 1:1).</li>
                                </>
                            )}
                            {currentStep === 2 && (
                                <>
                                    <li>Dùng quá nhiều thuật ngữ chuyên ngành khó hiểu.</li>
                                    <li>Chọn sai lĩnh vực trọng điểm.</li>
                                </>
                            )}
                            {currentStep === 3 && (
                                <>
                                    <li>Khai báo khống số lượng thành viên.</li>
                                    <li>Xác nhận khi dự án chưa phải là tài sản trí tuệ gốc của bạn.</li>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </ul>
            </div>
        </div>
    );
}