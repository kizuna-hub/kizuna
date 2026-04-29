'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShieldCheck, ChevronLeft, ChevronRight, X, Lightbulb, Target, Rocket, Users, Trash2, Plus, Info, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';

export default function SubmitProjectPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [showSparkle, setShowSparkle] = useState<string | null>(null);
    const [team, setTeam] = useState([{ name: '', role: '', email: '', phone: '', school_company: '', social_link: '' }]);

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

    const handleTeamChange = (index: number, field: string, value: string) => {
        const newTeam = [...team];
        newTeam[index] = { ...newTeam[index], [field]: value };
        setTeam(newTeam);
    };

    const addTeamMember = () => {
        setTeam([...team, { name: '', role: '', email: '', phone: '', school_company: '', social_link: '' }]);
    };

    const removeTeamMember = (index: number) => {
        if (team.length > 1) {
            const newTeam = team.filter((_, i) => i !== index);
            setTeam(newTeam);
        }
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
        <div className="min-h-screen bg-kizuna-surface flex flex-col">
            {/* Dedicated Wizard Header */}
            <div className="sticky top-0 z-50 h-16 border-b border-kizuna-border bg-white/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
                {/* Left: Exit/Cancel */}
                <div className="flex-1">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-kizuna-text-muted hover:text-kizuna-text-main transition-colors"
                    >
                        <X className="w-4 h-4" />
                        Exit
                    </Link>
                </div>

                {/* Center: Progress */}
                <div className="flex-[2] flex flex-col items-center justify-center">
                    <h1 className="text-sm font-semibold text-kizuna-text-main mb-1.5 text-center whitespace-nowrap">
                        Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
                    </h1>
                    <div className="flex justify-between pt-2 gap-2 w-full max-w-[240px]">
                        {steps.map((_, idx) => (
                            <div
                                key={idx}
                                className={`flex-1 h-1.5 rounded-full transition-colors ${idx <= currentStep ? 'bg-kizuna-primary' : 'bg-zinc-200'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Right: Save Draft */}
                <div className="flex-1 flex justify-end items-center gap-3">
                    {isSaving && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-xs text-zinc-500 flex items-center gap-1.5 shrink-0"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
                            Auto-saving
                        </motion.div>
                    )}
                    <Button variant="ghost" className="text-kizuna-text-muted hover:text-kizuna-text-main hover:bg-zinc-100 h-8 px-3 text-sm hidden sm:inline-flex">
                        Save Draft
                    </Button>
                </div>
            </div>

            {/* Main Content */}
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
                            {/* Step 1: The Vision */}
                            {currentStep === 0 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                                            <Lightbulb className="w-4 h-4 text-kizuna-primary" />
                                            Your Idea
                                        </label>
                                        <p className="text-xs text-kizuna-text-muted mb-2">Summarize your startup idea in a single sentence.</p>
                                        <Input
                                            name="idea"
                                            value={formData.idea}
                                            onChange={handleInputChange}
                                            placeholder="What is your startup idea?"
                                            className="bg-white border border-zinc-300 text-kizuna-text-main placeholder:text-zinc-400 focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all duration-300 px-3 py-2"
                                        />
                                    </div>

                                    <div className="relative">
                                        <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                                            <Target className="w-4 h-4 text-kizuna-primary" />
                                            Problem Statement
                                        </label>
                                        <p className="text-xs text-kizuna-text-muted mb-2">Be specific about the pain point you are trying to solve.</p>
                                        <Textarea
                                            name="problem"
                                            value={formData.problem}
                                            onChange={handleInputChange}
                                            placeholder="What problem are you solving?"
                                            className="bg-white border border-zinc-300 text-kizuna-text-main placeholder:text-zinc-400 min-h-32 focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all duration-300 p-3"
                                        />
                                        <div className="absolute bottom-3 right-3 group">
                                            <button
                                                onClick={() => handleAIPolish('problem')}
                                                disabled={showSparkle === 'problem'}
                                                className="flex items-center justify-center bg-zinc-100 text-kizuna-primary border border-zinc-200 rounded-md w-8 h-8 transition-colors disabled:opacity-50"
                                            >
                                                {showSparkle === 'problem' ? (
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity }}
                                                    >
                                                        <Sparkles className="w-4 h-4" />
                                                    </motion.div>
                                                ) : (
                                                    <Sparkles className="w-4 h-4" />
                                                )}
                                            </button>
                                            <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block whitespace-nowrap rounded bg-zinc-800 px-2 py-1 text-[10px] text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">AI Polish</span>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                                            <Rocket className="w-4 h-4 text-kizuna-primary" />
                                            Your Solution
                                        </label>
                                        <p className="text-xs text-kizuna-text-muted mb-2">How does your product solve the problem?</p>
                                        <Textarea
                                            name="solution"
                                            value={formData.solution}
                                            onChange={handleInputChange}
                                            placeholder="How will you solve this problem?"
                                            className="bg-white border border-zinc-300 text-kizuna-text-main placeholder:text-zinc-400 min-h-32 focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all duration-300 p-3"
                                        />
                                        <div className="absolute bottom-3 right-3 group">
                                            <button
                                                onClick={() => handleAIPolish('solution')}
                                                disabled={showSparkle === 'solution'}
                                                className="flex items-center justify-center bg-zinc-100 text-kizuna-primary border border-zinc-200 rounded-md w-8 h-8 transition-colors disabled:opacity-50"
                                            >
                                                {showSparkle === 'solution' ? (
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity }}
                                                    >
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
                            )}

                            {/* Step 2: Tech & MVP */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div className="relative">
                                        <label className="block text-sm font-semibold text-kizuna-text-main mb-1">
                                            Product Readiness
                                        </label>
                                        <p className="text-xs text-kizuna-text-muted mb-2">What is the current state of your product?</p>
                                        <Textarea
                                            name="productReadiness"
                                            value={formData.productReadiness}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Figma prototype completed, backend architecture designed, core features 50% coded..."
                                            className="bg-white border border-zinc-300 text-kizuna-text-main placeholder:text-zinc-400 min-h-32 focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all duration-300 p-3"
                                        />
                                        <div className="absolute bottom-3 right-3 group">
                                            <button
                                                onClick={() => handleAIPolish('productReadiness')}
                                                disabled={showSparkle === 'productReadiness'}
                                                className="flex items-center justify-center bg-zinc-100 text-kizuna-primary border border-zinc-200 rounded-md w-8 h-8 transition-colors disabled:opacity-50"
                                            >
                                                {showSparkle === 'productReadiness' ? (
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity }}
                                                    >
                                                        <Sparkles className="w-4 h-4" />
                                                    </motion.div>
                                                ) : (
                                                    <Sparkles className="w-4 h-4" />
                                                )}
                                            </button>
                                            <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block whitespace-nowrap rounded bg-zinc-800 px-2 py-1 text-[10px] text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">AI Polish</span>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-semibold text-kizuna-text-main mb-1">
                                            Development Roadmap
                                        </label>
                                        <p className="text-xs text-kizuna-text-muted mb-2">What are your key milestones for the next 12 months?</p>
                                        <Textarea
                                            name="roadmap"
                                            value={formData.roadmap}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Q1: Launch Beta, Q2: Integrate AI features, Q3: Expand to iOS..."
                                            className="bg-white border border-zinc-300 text-kizuna-text-main placeholder:text-zinc-400 min-h-32 focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all duration-300 p-3"
                                        />
                                        <div className="absolute bottom-3 right-3 group">
                                            <button
                                                onClick={() => handleAIPolish('roadmap')}
                                                disabled={showSparkle === 'roadmap'}
                                                className="flex items-center justify-center bg-zinc-100 text-kizuna-primary border border-zinc-200 rounded-md w-8 h-8 transition-colors disabled:opacity-50"
                                            >
                                                {showSparkle === 'roadmap' ? (
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity }}
                                                    >
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
                            )}

                            {/* Step 3: Market & Finance */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div className="relative">
                                        <label className="block text-sm font-semibold text-kizuna-text-main mb-1">
                                            Target Audience
                                        </label>
                                        <p className="text-xs text-kizuna-text-muted mb-2">Who are your primary users, and what are their demographics?</p>
                                        <Textarea
                                            name="targetAudience"
                                            value={formData.targetAudience}
                                            onChange={handleInputChange}
                                            placeholder="e.g., College students aged 18-24 struggling with time management..."
                                            className="bg-white border border-zinc-300 text-kizuna-text-main placeholder:text-zinc-400 min-h-24 focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all duration-300 p-3"
                                        />
                                        <div className="absolute bottom-3 right-3 group">
                                            <button
                                                onClick={() => handleAIPolish('targetAudience')}
                                                disabled={showSparkle === 'targetAudience'}
                                                className="flex items-center justify-center bg-zinc-100 text-kizuna-primary border border-zinc-200 rounded-md w-8 h-8 transition-colors disabled:opacity-50"
                                            >
                                                {showSparkle === 'targetAudience' ? (
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity }}
                                                    >
                                                        <Sparkles className="w-4 h-4" />
                                                    </motion.div>
                                                ) : (
                                                    <Sparkles className="w-4 h-4" />
                                                )}
                                            </button>
                                            <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block whitespace-nowrap rounded bg-zinc-800 px-2 py-1 text-[10px] text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">AI Polish</span>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-semibold text-kizuna-text-main mb-1">
                                            Revenue Model
                                        </label>
                                        <p className="text-xs text-kizuna-text-muted mb-2">How does or will your business make money?</p>
                                        <Textarea
                                            name="revenueModel"
                                            value={formData.revenueModel}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Freemium tier + $4.99/month Pro subscription plan..."
                                            className="bg-white border border-zinc-300 text-kizuna-text-main placeholder:text-zinc-400 min-h-24 focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all duration-300 p-3"
                                        />
                                        <div className="absolute bottom-3 right-3 group">
                                            <button
                                                onClick={() => handleAIPolish('revenueModel')}
                                                disabled={showSparkle === 'revenueModel'}
                                                className="flex items-center justify-center bg-zinc-100 text-kizuna-primary border border-zinc-200 rounded-md w-8 h-8 transition-colors disabled:opacity-50"
                                            >
                                                {showSparkle === 'revenueModel' ? (
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity }}
                                                    >
                                                        <Sparkles className="w-4 h-4" />
                                                    </motion.div>
                                                ) : (
                                                    <Sparkles className="w-4 h-4" />
                                                )}
                                            </button>
                                            <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block whitespace-nowrap rounded bg-zinc-800 px-2 py-1 text-[10px] text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">AI Polish</span>
                                        </div>
                                    </div>

                                    {/* Quick Break-Even Calculator */}
                                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-6">
                                        <h3 className="text-sm font-semibold text-kizuna-text-main">Quick Break-Even Calculator</h3>

                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-xs font-medium text-kizuna-text-muted">Monthly Operating Cost</label>
                                                <span className="text-sm font-semibold text-kizuna-primary">
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
                                                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-kizuna-primary"
                                            />
                                            <div className="text-xs text-kizuna-text-muted mt-1 flex justify-between">
                                                <span>$1,000</span>
                                                <span>$50,000</span>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-xs font-medium text-kizuna-text-muted">Price per User/Customer</label>
                                                <span className="text-sm font-semibold text-kizuna-primary">
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
                                                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-kizuna-primary"
                                            />
                                            <div className="text-xs text-kizuna-text-muted mt-1 flex justify-between">
                                                <span>$10</span>
                                                <span>$500</span>
                                            </div>
                                        </div>

                                        <div className="bg-kizuna-primary/10 border border-kizuna-primary/20 rounded-lg p-4 mt-6 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-kizuna-text-main font-semibold mb-1">Break-even point needed</p>
                                                <p className="text-xs text-kizuna-text-muted">
                                                    To cover ${formData.monthlyCost.toLocaleString()} monthly costs
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-kizuna-primary font-extrabold text-2xl">
                                                    {Math.ceil(breakEvenUsers).toLocaleString()} <span className="text-sm font-medium text-kizuna-primary/80">users</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: IP & Team */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-kizuna-text-main mb-1">
                                            <Users className="w-4 h-4 text-kizuna-primary" />
                                            Team Members
                                        </label>
                                        <p className="text-xs text-kizuna-text-muted mb-2">Tip: Include LinkedIn profile URLs to increase your project&apos;s credibility.</p>

                                        <div className="space-y-3 mt-4">
                                            {team.map((member, index) => (
                                                <div key={index} className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 relative group">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h4 className="text-sm font-semibold text-kizuna-text-main">Team Member</h4>
                                                        {team.length > 1 && (
                                                            <button
                                                                onClick={() => removeTeamMember(index)}
                                                                className="text-zinc-400 hover:text-red-500 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {/* Field 1: Full Name */}
                                                        <div>
                                                            <label className="block text-xs font-medium text-kizuna-text-muted mb-1.5">Full Name</label>
                                                            <input
                                                                value={member.name}
                                                                onChange={(e) => handleTeamChange(index, 'name', e.target.value)}
                                                                placeholder="e.g., Jane Doe"
                                                                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-kizuna-text-main focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all"
                                                            />
                                                        </div>
                                                        {/* Field 2: Role */}
                                                        <div>
                                                            <label className="block text-xs font-medium text-kizuna-text-muted mb-1.5">Role</label>
                                                            <input
                                                                value={member.role}
                                                                onChange={(e) => handleTeamChange(index, 'role', e.target.value)}
                                                                placeholder="e.g., CEO, Lead Dev"
                                                                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-kizuna-text-main focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all"
                                                            />
                                                        </div>
                                                        {/* Field 3: Email */}
                                                        <div>
                                                            <label className="block text-xs font-medium text-kizuna-text-muted mb-1.5">Email</label>
                                                            <input
                                                                value={member.email}
                                                                onChange={(e) => handleTeamChange(index, 'email', e.target.value)}
                                                                placeholder="jane@example.com"
                                                                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-kizuna-text-main focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all"
                                                            />
                                                        </div>
                                                        {/* Field 4: Phone Number */}
                                                        <div>
                                                            <label className="block text-xs font-medium text-kizuna-text-muted mb-1.5">Phone Number</label>
                                                            <input
                                                                value={member.phone}
                                                                onChange={(e) => handleTeamChange(index, 'phone', e.target.value)}
                                                                placeholder="e.g., +84 123 456 789"
                                                                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-kizuna-text-main focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all"
                                                            />
                                                        </div>
                                                        {/* Field 5: School / Company */}
                                                        <div>
                                                            <label className="block text-xs font-medium text-kizuna-text-muted mb-1.5">School / Company</label>
                                                            <input
                                                                value={member.school_company}
                                                                onChange={(e) => handleTeamChange(index, 'school_company', e.target.value)}
                                                                placeholder="e.g., Danang University"
                                                                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-kizuna-text-main focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all"
                                                            />
                                                        </div>
                                                        {/* Field 6: Social Link */}
                                                        <div>
                                                            <label className="block text-xs font-medium text-kizuna-text-muted mb-1.5">Social Link</label>
                                                            <input
                                                                value={member.social_link}
                                                                onChange={(e) => handleTeamChange(index, 'social_link', e.target.value)}
                                                                placeholder="LinkedIn or Portfolio URL"
                                                                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-kizuna-text-main focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={addTeamMember}
                                            className="w-full mt-3 border-dashed border-zinc-300 text-zinc-600 hover:text-kizuna-primary hover:border-kizuna-primary hover:bg-zinc-50"
                                        >
                                            <Plus className="w-4 h-4 mr-2" /> Add Team Member
                                        </Button>
                                    </div>

                                    {/* IP Trust Badge */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mt-8"
                                    >
                                        <div className="flex items-start gap-3">
                                            <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <h3 className="text-sm font-semibold text-emerald-900 mb-1">
                                                    IP Protection Guarantee
                                                </h3>
                                                <p className="text-xs text-emerald-800 mb-4">
                                                    Your intellectual property is secured. By submitting, your idea is timestamped via our <strong className="text-emerald-700">IP Ledger</strong> and protected with <strong className="text-emerald-700">blockchain verification</strong>.
                                                </p>
                                                <div className="flex items-center justify-between pt-3 border-t border-emerald-200">
                                                    <label className="text-xs font-medium text-emerald-900">
                                                        Lock details (Only visible to verified investors)
                                                    </label>
                                                    <Switch
                                                        checked={formData.lockDetails}
                                                        onCheckedChange={handleToggle}
                                                        className="data-[state=checked]:bg-emerald-600"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 items-start mt-6">
                                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-blue-900 font-semibold text-sm mb-1">What happens next</h4>
                                            <p className="text-blue-800 text-sm">
                                                Your project will be reviewed by our team within 48 hours. You&apos;ll receive feedback and gain access to our investor network and mentorship program.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-zinc-200">
                                <Button
                                    onClick={handleBack}
                                    disabled={currentStep === 0}
                                    variant="outline"
                                    className="gap-2 bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Back
                                </Button>

                                {currentStep === steps.length - 1 ? (
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSaving}
                                        className="bg-kizuna-primary text-white gap-2"
                                    >
                                        {isSaving ? 'Submitting...' : 'Submit & Secure Project'}
                                        {!isSaving && <Rocket className="w-4 h-4 ml-1" />}
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleNext}
                                        disabled={isSaving}
                                        className="gap-2 bg-kizuna-primary text-white"
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
        </div>
    );
}
