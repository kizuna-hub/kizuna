'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import 4 Steps
import { Step1Vision } from '@/components/submit-project/step1-vision';
import { Step2Tech } from '@/components/submit-project/step2-tech';
import { Step3Market } from '@/components/submit-project/step3-market';
import { Step4TeamIP } from '@/components/submit-project/step4-team-ip';
import { useProject } from '@/lib/context/ProjectContext';

export default function SubmitProjectPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [showSparkle, setShowSparkle] = useState<string | null>(null);

    // Đã thêm core_skill vào state mặc định của Team
    const [team, setTeam] = useState([{
        name: '',
        student_id: '', // [Mới] MSSV
        class_name: '', // [Mới] Lớp
        role: '',
        core_skill: '',
        email: '',
        phone: '',
        school_company: '',
        social_link: ''
    }]);

    // Form state tổng
    const [formData, setFormData] = useState({
        // step 1
        projectName: '',
        category: '',
        slogan: '',
        problem: '',
        solution: '',
        uvp: '',
        // step 2
        currentStage: '',
        techStack: '',
        demoLink: '',
        productReadiness: '',
        roadmap: '',
        // step 3
        targetAudience: '',
        revenueModel: '',
        goToMarket: '',
        fundingAsk: '',
        monthlyCost: 5000000,
        pricePerUser: 50000,
        // step 4
        lockDetails: false,
        pitchDeckFile: null, // [Mới] File tài liệu
        isCommitted: false,  // [Mới] Checkbox cam kết
    });

    const steps = [
        { title: 'Tầm nhìn', description: 'Chia sẻ ý tưởng và giải pháp của bạn' },
        { title: 'Công nghệ & MVP', description: 'Độ hoàn thiện sản phẩm và lộ trình' },
        { title: 'Thị trường & Tài chính', description: 'Khách hàng mục tiêu và doanh thu' },
        { title: 'Nhóm & IP', description: 'Đội ngũ và Bảo vệ SHTT' },
    ];

    const progress = ((currentStep + 1) / steps.length) * 100;

    // --- Các hàm xử lý State ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSliderChange = (name: string, value: number) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggle = () => {
        setFormData(prev => ({ ...prev, lockDetails: !prev.lockDetails }));
    };

    const handleTeamChange = (index: number, field: string, value: string) => {
        const newTeam = [...team];
        newTeam[index] = { ...newTeam[index], [field]: value };
        setTeam(newTeam);
    };

    const addTeamMember = () => {
        setTeam([...team, {
            name: '',
            student_id: '', // [Mới] MSSV
            class_name: '', // [Mới] Lớp
            role: '',
            core_skill: '',
            email: '',
            phone: '',
            school_company: '',
            social_link: ''
        }]);
    };

    const removeTeamMember = (index: number) => {
        if (team.length > 1) {
            setTeam(team.filter((_, i) => i !== index));
        }
    };

    const handleAIPolish = (fieldName: string) => {
        setShowSparkle(fieldName);
        setTimeout(() => {
            const improvements: { [key: string]: string } = {
                problem: 'Trong bối cảnh thị trường thời trang đang dần trở nên bão hòa, các thương hiệu không chỉ đơn thuần tìm kiếm ý tưởng mới, mà họ đang khát khao những cú hích mang tính bản lề. Đó là sự giao thoa giữa tư duy đột phá và khả năng nắm bắt nhịp đập thị trường để trình làng những bộ sưu tập không chỉ mới về mẫu mã, mà còn đủ sức tái định nghĩa lại tiêu chuẩn tiêu dùng và thiết lập một vị thế độc tôn.',
                solution: 'Giải pháp là một nền tảng tích hợp kết nối các nhà sáng lập sinh viên với các Mentor trong ngành, nhà đầu tư (investors) và mạng lưới hỗ trợ đồng cấp.',
                uvp: 'Hệ thống tích hợp công nghệ AI Policy Navigator và sổ cái IP Ledger độc quyền, tạo rào cản thâm nhập an toàn và tự động hóa quy trình thẩm định dự án.',
                productReadiness: 'Bản nguyên mẫu MVP tích hợp các tính năng sàn giao dịch (marketplace) cốt lõi và hệ thống xác thực người dùng an toàn.',
                roadmap: 'Q2: Hoàn thiện các tính năng cốt lõi. Q3: Mở rộng tương tác cộng đồng. Q4: Ra mắt hệ thống ghép nối năng lực với nhà đầu tư.',
                targetAudience: 'Sinh viên đại học và giảng viên có đam mê mạnh mẽ với lĩnh vực khởi nghiệp sáng tạo.',
                goToMarket: 'Tiếp cận ban đầu thông qua các vườn ươm đại học, hợp tác Đoàn/Hội để tổ chức các buổi Workshop Khởi nghiệp thực chiến.',
                revenueModel: 'Mô hình Freemium kết hợp các công cụ chuyên sâu dành cho nhà đầu tư (investors) và các gói hỗ trợ đặc quyền.',
            };

            if (improvements[fieldName]) {
                setFormData(prev => ({ ...prev, [fieldName]: improvements[fieldName] }));
            }
            setShowSparkle(null);
        }, 1000);
    };

    // --- Các hàm Điều hướng ---
    const { updateFromWizardStep, project } = useProject();

    const handleNext = () => {
        setIsSaving(true);
        updateFromWizardStep(currentStep, formData);
        setTimeout(() => {
            setIsSaving(false);
            if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
        }, 500);
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = () => {
        if (!formData.isCommitted) {
            alert('Vui lòng xác nhận cam kết ở cuối trang trước khi gửi dự án!');
            return;
        }

        updateFromWizardStep(currentStep, formData);
        setIsSaving(true);
        setTimeout(() => {
            console.log('Project submitted:', { ...formData, team });
            alert('Khởi tạo dự án thành công! Thông tin tài sản trí tuệ (IP) đã được xác thực qua IP Ledger của chúng tôi.');
            setIsSaving(false);
        }, 1000);
    };

    // --- Hàm switch component linh động ---
    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return <Step1Vision formData={formData} handleInputChange={handleInputChange} handleAIPolish={handleAIPolish} showSparkle={showSparkle} />;
            case 1:
                return <Step2Tech formData={formData} handleInputChange={handleInputChange} handleAIPolish={handleAIPolish} showSparkle={showSparkle} />;
            case 2:
                return <Step3Market formData={formData} handleInputChange={handleInputChange} handleSliderChange={handleSliderChange} handleAIPolish={handleAIPolish} showSparkle={showSparkle} />;
            case 3:
                return <Step4TeamIP team={team} formData={formData} handleTeamChange={handleTeamChange} addTeamMember={addTeamMember} removeTeamMember={removeTeamMember} handleToggle={handleToggle} handleInputChange={handleInputChange} />; // Đã truyền handleInputChange
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-kizuna-surface flex flex-col">
            {/* Header */}
            <div className="sticky top-0 z-50 h-16 border-b border-kizuna-border bg-white/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
                <div className="flex-1">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-kizuna-text-muted hover:text-kizuna-text-main transition-colors">
                        <X className="w-4 h-4" /> Thoát
                    </Link>
                </div>

                <div className="flex-[2] flex flex-col items-center justify-center">
                    <h1 className="text-sm font-semibold text-kizuna-text-main mb-1.5 text-center whitespace-nowrap">
                        Bước {currentStep + 1}/{steps.length}: {steps[currentStep].title}
                    </h1>
                    <div className="flex justify-between pt-2 gap-2 w-full max-w-[240px]">
                        {steps.map((_, idx) => (
                            <div key={idx} className={`flex-1 h-1.5 rounded-full transition-colors ${idx <= currentStep ? 'bg-kizuna-primary' : 'bg-zinc-200'}`} />
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex justify-end items-center gap-3">
                    {isSaving && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-zinc-500 flex items-center gap-1.5 shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" /> Đang lưu
                        </motion.div>
                    )}
                    <Button variant="ghost" className="text-kizuna-text-muted hover:text-kizuna-text-main hover:bg-zinc-100 h-8 px-3 text-sm hidden sm:inline-flex">
                        Lưu Draft
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col py-8 px-4 relative overflow-hidden">
                <div className="w-full max-w-2xl mx-auto flex-1 relative z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white border border-kizuna-border shadow-sm rounded-2xl p-8"
                        >
                            {/* Khu vực render Component Con */}
                            {renderStepContent()}

                            {/* Buttons chuyển bước */}
                            <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-zinc-200">
                                <Button
                                    onClick={handleBack}
                                    disabled={currentStep === 0}
                                    variant="outline"
                                    className="gap-2 bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Quay lại
                                </Button>

                                {currentStep === steps.length - 1 ? (
                                    <Button onClick={handleSubmit} disabled={isSaving} className="bg-kizuna-primary text-white gap-2">
                                        {isSaving ? 'Đang gửi...' : 'Gửi dự án'} {!isSaving && <Rocket className="w-4 h-4 ml-1" />}
                                    </Button>
                                ) : (
                                    <Button onClick={handleNext} disabled={isSaving} className="gap-2 bg-kizuna-primary text-white">
                                        Tiếp tục <ChevronRight className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}