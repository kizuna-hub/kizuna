"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

// --- IMPORT CÁC SUB-COMPONENTS TỪNG ĐƯỢC TÁCH ---
import { ProgressBar } from "./progress-bar";
import { DynamicSidebar } from "./dynamic-sidebar";
import { Step1Basic } from "./step1-basic";
import { Step2Details } from "./step2-details";
import { Step3Finish } from "./step3-finish";

const steps = [
    { id: 1, title: "Thông tin cơ bản", shortDesc: "Bắt đầu với những thứ cơ bản nhất." },
    { id: 2, title: "Chi tiết sản phẩm", shortDesc: "Mô tả giá trị dự án của bạn." },
    { id: 3, title: "Đội ngũ & Hoàn tất", shortDesc: "Xác nhận và sẵn sàng lên sóng." }
];

export function SubmitProjectWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [showSparkle, setShowSparkle] = useState<string | null>(null);

    // MỘT NGUỒN SỰ THẬT DUY NHẤT cho Form
    const [formData, setFormData] = useState({
        // Step 1
        role: 'founder', // 'founder' | 'hunter'
        projectName: '',
        slogan: '',
        logoUrl: '',
        // Step 2
        categories: [],
        description: '', // Gộp Problem & Solution
        techStack: '',
        demoLink: '',
        // Step 3
        team: [{ name: '', role: '' }],
        gallery: [],
        status: '',
        isCommitted: false
    });

    // --- HÀM ĐIỀU HƯỚNG ---
    const handleNext = () => { if (currentStep < 3) setCurrentStep(prev => prev + 1); };
    const handleBack = () => { if (currentStep > 1) setCurrentStep(prev => prev - 1); };
    const handleSubmit = () => {
        if (!formData.isCommitted) return alert('Vui lòng xác nhận lời thề danh dự!');
        setIsSaving(true);
        setTimeout(() => {
            console.log('Dữ liệu chuẩn bị bắn lên API:', formData);
            alert('Đăng dự án thành công!');
            setIsSaving(false);
        }, 1000);
    };

    // --- HÀM XỬ LÝ DỮ LIỆU ---
    const updateFormData = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));
    const updateTeamMember = (index: number, field: string, value: string) => {
        const newTeam = [...formData.team];
        newTeam[index] = { ...newTeam[index], [field]: value };
        updateFormData('team', newTeam);
    };
    const addTeamMember = () => updateFormData('team', [...formData.team, { name: '', role: '' }]);
    const removeTeamMember = (index: number) => {
        if (formData.team.length > 1) updateFormData('team', formData.team.filter((_, i) => i !== index));
    };
    const handleAIPolish = (fieldName: string) => {
        setShowSparkle(fieldName);
        setTimeout(() => {
            updateFormData(fieldName, "Văn phong đã được AI gọt giũa.");
            setShowSparkle(null);
        }, 1500);
    };

    // --- RENDER CONTENT ---
    const renderStepContent = () => {
        switch (currentStep) {
            case 1: return <Step1Basic formData={formData} updateFormData={updateFormData} />;
            case 2: return <Step2Details formData={formData} updateFormData={updateFormData} handleAIPolish={handleAIPolish} showSparkle={showSparkle} />;
            case 3: return <Step3Finish formData={formData} updateFormData={updateFormData} updateTeamMember={updateTeamMember} addTeamMember={addTeamMember} removeTeamMember={removeTeamMember} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 font-sans text-slate-900 selection:bg-[#16452a]/20">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-5xl items-center px-6">
                    <Link href="/" className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-[#081810] transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Quay lại Khám phá
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-6 py-12">
                {/* Title */}
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-[#081810] tracking-tight">Thêm dự án mới</h1>
                    <p className="text-sm font-medium text-slate-500 mt-2">Chia sẻ sản phẩm của bạn với cộng đồng Kizuna Hub.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* CỘT TRÁI (8 Cột) */}
                    <div className="lg:col-span-8 flex flex-col gap-6">

                        {/* Gọi Component Progress Bar đã tách */}
                        <ProgressBar currentStep={currentStep} steps={steps} />

                        {/* Form Card */}
                        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm flex flex-col min-h-[500px]">
                            <div className="flex-1 p-8">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentStep}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {/* Gọi Component Form */}
                                        {renderStepContent()}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Bottom Action Bar */}
                            <div className="border-t border-zinc-100 p-6 bg-zinc-50/50 rounded-b-2xl flex items-center justify-between">
                                {currentStep > 1 ? (
                                    <button onClick={handleBack} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-zinc-500 hover:text-[#081810] hover:bg-zinc-200/50 transition-colors disabled:opacity-50">
                                        <ArrowLeft className="h-4 w-4" /> Quay lại
                                    </button>
                                ) : <div />}

                                <button onClick={currentStep === 3 ? handleSubmit : handleNext} disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#16452a] text-white text-sm font-bold shadow-md hover:bg-[#0a1c13] transition-all active:scale-95 disabled:opacity-70 disabled:cursor-wait">
                                    {isSaving ? "Đang xử lý..." : (currentStep === 3 ? "Gửi dự án" : "Tiếp tục")}
                                    {!isSaving && currentStep !== 3 && <ArrowRight className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI (4 Cột) */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        {/* Gọi Component Sidebar đã tách */}
                        <DynamicSidebar currentStep={currentStep} />
                    </div>
                </div>
            </main>
        </div>
    );
}