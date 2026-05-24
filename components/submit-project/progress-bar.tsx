"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
    currentStep: number;
    steps: { id: number; title: string; shortDesc: string }[];
}

export function ProgressBar({ currentStep, steps }: ProgressBarProps) {
    return (
        <div className="flex items-center gap-2 mb-4">
            {steps.map((step) => (
                <React.Fragment key={step.id}>
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors",
                            currentStep === step.id ? "bg-[#16452a] text-white shadow-md" :
                                currentStep > step.id ? "bg-emerald-100 text-emerald-700" : "bg-zinc-200 text-zinc-500"
                        )}>
                            {currentStep > step.id ? <CheckCircle2 className="h-4 w-4" /> : step.id}
                        </div>
                        <span className={cn(
                            "text-sm font-bold hidden sm:block",
                            currentStep === step.id ? "text-[#081810]" : "text-zinc-400"
                        )}>
                            {step.title}
                        </span>
                    </div>
                    {step.id !== 3 && (
                        <div className="flex-1 mx-2 h-0.5 rounded-full bg-zinc-200 overflow-hidden">
                            <motion.div
                                className="h-full bg-[#16452a]"
                                initial={{ width: "0%" }}
                                animate={{ width: currentStep > step.id ? "100%" : "0%" }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}