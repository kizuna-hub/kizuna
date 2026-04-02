'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';

export default function SubmitProjectPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [showSparkle, setShowSparkle] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        // Step 1: The Vision
        idea: '',
        problem: '',
        solution: '',
        // Step 2: Tech & MVP
        productReadiness: '',
        roadmap: '',
        // Step 3: Market & Finance
        targetAudience: '',
        revenueModel: '',
        monthlyCost: 5000,
        pricePerUser: 50,
        // Step 4: IP & Team
        teamMembers: '',
        lockDetails: false,
    });

    const steps = [
        { title: 'The Vision', description: 'Share your idea and solution' },
        { title: 'Tech & MVP', description: 'Product readiness and roadmap' },
        { title: 'Market & Finance', description: 'Target audience and revenue' },
        { title: 'IP & Team', description: 'Team and IP protection' },
    ];

    const progress = ((currentStep + 1) / steps.length) * 100;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSliderChange = (name: string, value: number) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleToggle = () => {
        setFormData(prev => ({
            ...prev,
            lockDetails: !prev.lockDetails,
        }));
    };

    const handleAIPolish = (fieldName: string) => {
        setShowSparkle(fieldName);
        // Simulate AI processing
        setTimeout(() => {
            const improvements: { [key: string]: string } = {
                problem: 'Students lack access to mentorship and funding resources, creating a gap between ideas and execution.',
                solution: 'An integrated platform connecting student entrepreneurs with industry experts, investors, and peer support networks.',
                productReadiness: 'MVP prototype with basic marketplace functionality and user authentication.',
                roadmap: 'Q2: Core features. Q3: Community engagement. Q4: Investor matching system.',
                targetAudience: 'University students and faculty members interested in entrepreneurship.',
                revenueModel: 'Freemium model with premium investor tools and premium support packages.',
            };

            if (improvements[fieldName]) {
                setFormData(prev => ({
                    ...prev,
                    [fieldName]: improvements[fieldName],
                }));
            }
            setShowSparkle(null);
        }, 1000);
    };

    const handleNext = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
            }
        }, 500);
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
        setIsSaving(true);
        // Simulate submission
        setTimeout(() => {
            console.log('Project submitted:', formData);
            alert('Project submitted successfully! IP timestamped via our Ledger.');
            setIsSaving(false);
        }, 1000);
    };

    // Break-even calculation
    const breakEvenUsers = formData.monthlyCost / formData.pricePerUser;

    return (
        <div className="min-h-screen bg-zinc-950 py-12 px-4">
            {/* Sticky Header */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/10 py-4">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between mb-3">
                        <h1 className="text-lg font-semibold text-white">
                            Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
                        </h1>
                        <div className="flex items-center gap-2">
                            {isSaving && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-xs text-orange-400 flex items-center gap-1"
                                >
                                    <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                                    Auto-saving...
                                </motion.div>
                            )}
                        </div>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto mt-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
                    >
                        {/* Step 1: The Vision */}
                        {currentStep === 0 && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Your Idea
                                    </label>
                                    <Input
                                        name="idea"
                                        value={formData.idea}
                                        onChange={handleInputChange}
                                        placeholder="What is your startup idea?"
                                        className="bg-zinc-800/50 border-white/10 text-white placeholder:text-white/40"
                                    />
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Problem Statement
                                    </label>
                                    <Textarea
                                        name="problem"
                                        value={formData.problem}
                                        onChange={handleInputChange}
                                        placeholder="What problem are you solving?"
                                        className="bg-zinc-800/50 border-white/10 text-white placeholder:text-white/40 min-h-32"
                                    />
                                    <button
                                        onClick={() => handleAIPolish('problem')}
                                        disabled={showSparkle === 'problem'}
                                        className="absolute bottom-3 right-3 flex items-center gap-1 text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 rounded-md px-2 py-1 text-xs transition-colors disabled:opacity-50"
                                    >
                                        {showSparkle === 'problem' ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            >
                                                <Sparkles className="w-3 h-3" />
                                            </motion.div>
                                        ) : (
                                            <Sparkles className="w-3 h-3" />
                                        )}
                                        AI Polish
                                    </button>
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Your Solution
                                    </label>
                                    <Textarea
                                        name="solution"
                                        value={formData.solution}
                                        onChange={handleInputChange}
                                        placeholder="How will you solve this problem?"
                                        className="bg-zinc-800/50 border-white/10 text-white placeholder:text-white/40 min-h-32"
                                    />
                                    <button
                                        onClick={() => handleAIPolish('solution')}
                                        disabled={showSparkle === 'solution'}
                                        className="absolute bottom-3 right-3 flex items-center gap-1 text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 rounded-md px-2 py-1 text-xs transition-colors disabled:opacity-50"
                                    >
                                        {showSparkle === 'solution' ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            >
                                                <Sparkles className="w-3 h-3" />
                                            </motion.div>
                                        ) : (
                                            <Sparkles className="w-3 h-3" />
                                        )}
                                        AI Polish
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Tech & MVP */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="relative">
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Product Readiness
                                    </label>
                                    <Textarea
                                        name="productReadiness"
                                        value={formData.productReadiness}
                                        onChange={handleInputChange}
                                        placeholder="Describe your MVP (Minimum Viable Product) status"
                                        className="bg-zinc-800/50 border-white/10 text-white placeholder:text-white/40 min-h-32"
                                    />
                                    <button
                                        onClick={() => handleAIPolish('productReadiness')}
                                        disabled={showSparkle === 'productReadiness'}
                                        className="absolute bottom-3 right-3 flex items-center gap-1 text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 rounded-md px-2 py-1 text-xs transition-colors disabled:opacity-50"
                                    >
                                        {showSparkle === 'productReadiness' ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            >
                                                <Sparkles className="w-3 h-3" />
                                            </motion.div>
                                        ) : (
                                            <Sparkles className="w-3 h-3" />
                                        )}
                                        AI Polish
                                    </button>
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Development Roadmap
                                    </label>
                                    <Textarea
                                        name="roadmap"
                                        value={formData.roadmap}
                                        onChange={handleInputChange}
                                        placeholder="Outline your product development roadmap"
                                        className="bg-zinc-800/50 border-white/10 text-white placeholder:text-white/40 min-h-32"
                                    />
                                    <button
                                        onClick={() => handleAIPolish('roadmap')}
                                        disabled={showSparkle === 'roadmap'}
                                        className="absolute bottom-3 right-3 flex items-center gap-1 text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 rounded-md px-2 py-1 text-xs transition-colors disabled:opacity-50"
                                    >
                                        {showSparkle === 'roadmap' ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            >
                                                <Sparkles className="w-3 h-3" />
                                            </motion.div>
                                        ) : (
                                            <Sparkles className="w-3 h-3" />
                                        )}
                                        AI Polish
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Market & Finance */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="relative">
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Target Audience
                                    </label>
                                    <Textarea
                                        name="targetAudience"
                                        value={formData.targetAudience}
                                        onChange={handleInputChange}
                                        placeholder="Who is your target market? Describe demographics, behaviors, and pain points."
                                        className="bg-zinc-800/50 border-white/10 text-white placeholder:text-white/40 min-h-24"
                                    />
                                    <button
                                        onClick={() => handleAIPolish('targetAudience')}
                                        disabled={showSparkle === 'targetAudience'}
                                        className="absolute bottom-3 right-3 flex items-center gap-1 text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 rounded-md px-2 py-1 text-xs transition-colors disabled:opacity-50"
                                    >
                                        {showSparkle === 'targetAudience' ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            >
                                                <Sparkles className="w-3 h-3" />
                                            </motion.div>
                                        ) : (
                                            <Sparkles className="w-3 h-3" />
                                        )}
                                        AI Polish
                                    </button>
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Revenue Model
                                    </label>
                                    <Textarea
                                        name="revenueModel"
                                        value={formData.revenueModel}
                                        onChange={handleInputChange}
                                        placeholder="Explain your business model and revenue streams"
                                        className="bg-zinc-800/50 border-white/10 text-white placeholder:text-white/40 min-h-24"
                                    />
                                    <button
                                        onClick={() => handleAIPolish('revenueModel')}
                                        disabled={showSparkle === 'revenueModel'}
                                        className="absolute bottom-3 right-3 flex items-center gap-1 text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 rounded-md px-2 py-1 text-xs transition-colors disabled:opacity-50"
                                    >
                                        {showSparkle === 'revenueModel' ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            >
                                                <Sparkles className="w-3 h-3" />
                                            </motion.div>
                                        ) : (
                                            <Sparkles className="w-3 h-3" />
                                        )}
                                        AI Polish
                                    </button>
                                </div>

                                {/* Quick Break-Even Calculator */}
                                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 space-y-4">
                                    <h3 className="text-sm font-semibold text-white">Quick Break-Even Calculator</h3>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-xs font-medium text-white/70">Monthly Operating Cost</label>
                                            <span className="text-sm font-semibold text-orange-400">
                                                ${formData.monthlyCost.toLocaleString()}
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1000"
                                            max="50000"
                                            step="500"
                                            value={formData.monthlyCost}
                                            onChange={(e) => handleSliderChange('monthlyCost', parseInt(e.target.value))}
                                            className="w-full h-2 bg-orange-500/20 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                        />
                                        <div className="text-xs text-white/50 mt-1 flex justify-between">
                                            <span>$1,000</span>
                                            <span>$50,000</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-xs font-medium text-white/70">Price per User/Customer</label>
                                            <span className="text-sm font-semibold text-orange-400">
                                                ${formData.pricePerUser}
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="10"
                                            max="500"
                                            step="10"
                                            value={formData.pricePerUser}
                                            onChange={(e) => handleSliderChange('pricePerUser', parseInt(e.target.value))}
                                            className="w-full h-2 bg-orange-500/20 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                        />
                                        <div className="text-xs text-white/50 mt-1 flex justify-between">
                                            <span>$10</span>
                                            <span>$500</span>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 rounded-md p-3 border border-orange-400/30">
                                        <p className="text-xs text-white/60 mb-1">Break-even point:</p>
                                        <p className="text-lg font-bold text-orange-300">
                                            {Math.ceil(breakEvenUsers).toLocaleString()} users needed
                                        </p>
                                        <p className="text-xs text-white/50 mt-1">
                                            To cover ${formData.monthlyCost.toLocaleString()} monthly costs
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: IP & Team */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Team Members
                                    </label>
                                    <Textarea
                                        name="teamMembers"
                                        value={formData.teamMembers}
                                        onChange={handleInputChange}
                                        placeholder="List your team members and their roles (e.g., John Doe - CEO, Jane Smith - CTO)"
                                        className="bg-zinc-800/50 border-white/10 text-white placeholder:text-white/40 min-h-32"
                                    />
                                </div>

                                {/* IP Trust Badge */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <h3 className="text-sm font-semibold text-white mb-1">
                                                IP Protection Guarantee
                                            </h3>
                                            <p className="text-xs text-white/70 mb-3">
                                                Your intellectual property is secured. By submitting, your idea is timestamped via our IP Ledger and protected with blockchain verification.
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-medium text-white/80">
                                                    Lock details (Only visible to verified investors)
                                                </label>
                                                <Switch
                                                    checked={formData.lockDetails}
                                                    onCheckedChange={handleToggle}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                    <p className="text-xs text-white/60">
                                        <strong>What happens next:</strong> Your project will be reviewed by our team within 48 hours. You&apos;ll receive feedback and gain access to our investor network and mentorship program.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-white/10">
                            <Button
                                onClick={handleBack}
                                disabled={currentStep === 0}
                                variant="outline"
                                className="gap-2 border-white/20 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back
                            </Button>

                            <div className="flex items-center gap-2">
                                {steps.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`h-2 rounded-full transition-all ${index <= currentStep
                                                ? 'w-8 bg-orange-600'
                                                : 'w-2 bg-white/20'
                                            }`}
                                    />
                                ))}
                            </div>

                            {currentStep === steps.length - 1 ? (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSaving}
                                    className="gap-2 bg-orange-600 hover:bg-orange-700 text-white"
                                >
                                    {isSaving ? 'Submitting...' : 'Submit Project'}
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleNext}
                                    disabled={isSaving}
                                    className="gap-2 bg-orange-600 hover:bg-orange-700 text-white"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
