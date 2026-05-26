"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Play, Download } from "lucide-react";

interface SlidePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectData: any;
    sections: any[];
}

export function SlidePreviewModal({ isOpen, onClose, projectData, sections }: SlidePreviewModalProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    if (!isOpen) return null;

    // Tổng hợp danh sách slide: Slide mở đầu + các slide nội dung
    const slides = [
        { type: "intro", title: projectData.name, content: projectData.tagline || "Ý tưởng đột phá từ Kizuna Hub" },
        ...sections.map(s => ({ type: "content", title: s.title, content: projectData[s.id] || "Chưa cấu hình nội dung cho phần này..." }))
    ];

    const nextSlide = () => { if (currentSlide < slides.length - 1) setCurrentSlide(prev => prev + 1); };
    const prevSlide = () => { if (currentSlide > 0) setCurrentSlide(prev => prev - 0); };

    return (
        <div className="fixed inset-0 z-[90] flex flex-col bg-zinc-950 text-white animate-in fade-in duration-200">
            {/* Top Control Bar */}
            <header className="h-16 border-b border-zinc-800 px-6 flex items-center justify-between bg-zinc-900">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-emerald-400 bg-emerald-950 border border-emerald-900 px-3 py-1 rounded-full uppercase tracking-wider">
                        AI Pitch Deck Generated
                    </span>
                    <h3 className="text-sm font-bold text-zinc-300 truncate max-w-[300px]">{projectData.name} - Pitch Deck Presentation</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 h-9 bg-zinc-800 hover:bg-zinc-700 px-4 rounded-lg text-xs font-bold transition-all">
                        <Download className="w-3.5 h-3.5" /> Xuất tệp PDF
                    </button>
                    <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Slide Presentation Workspace */}
            <div className="flex-1 flex items-center justify-center p-8 bg-zinc-900/50">
                <div className="w-full max-w-4xl aspect-video bg-[#F3F0DF] rounded-2xl shadow-2xl p-12 flex flex-col justify-between text-slate-900 relative border border-white/10 overflow-hidden">
                    {/* Hào quang nền */}
                    <div className="absolute -right-24 -top-24 w-72 h-72 bg-[#16452a]/5 rounded-full blur-3xl pointer-events-none" />

                    {/* Slide Header */}
                    <div className="flex items-center justify-between relative z-10">
                        <span className="text-xs font-black uppercase tracking-widest text-[#16452a]">Kizuna Presentation Style</span>
                        <span className="font-mono text-xs font-bold text-slate-400">{currentSlide + 1} / {slides.length}</span>
                    </div>

                    {/* Slide Core Content */}
                    <div className="my-auto max-w-2xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {slides[currentSlide].type === "intro" ? (
                            <div className="space-y-4">
                                <h1 className="text-5xl font-black text-[#081810] tracking-tight leading-none">{slides[currentSlide].title}</h1>
                                <div className="h-1.5 w-24 bg-[#16452a] rounded-full" />
                                <p className="text-xl font-medium text-slate-600 leading-relaxed">{slides[currentSlide].content}</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h2 className="text-3xl font-black text-[#16452a] tracking-tight">{slides[currentSlide].title}</h2>
                                <p className="text-base text-slate-700 font-medium leading-relaxed bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-zinc-200/50 shadow-inner whitespace-pre-line">
                                    {slides[currentSlide].content}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Slide Footer */}
                    <div className="flex items-center justify-between border-t border-slate-200/60 pt-4 relative z-10">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{projectData.name} © 2026</p>
                        <p className="text-[10px] font-bold text-[#16452a] uppercase tracking-wider">Confidential & Proprietary</p>
                    </div>
                </div>
            </div>

            {/* Bottom Navigator Controls */}
            <footer className="h-20 bg-zinc-900 border-t border-zinc-800 px-6 flex items-center justify-center gap-6">
                <button
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white disabled:opacity-30 disabled:hover:bg-zinc-800 rounded-full transition-all active:scale-95"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="h-1.5 w-48 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }} />
                </div>
                <button
                    onClick={nextSlide}
                    disabled={currentSlide === slides.length - 1}
                    className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white disabled:opacity-30 disabled:hover:bg-zinc-800 rounded-full transition-all active:scale-95"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </footer>
        </div>
    );
}