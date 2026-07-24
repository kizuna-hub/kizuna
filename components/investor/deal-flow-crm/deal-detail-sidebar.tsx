'use client';

import React from 'react';
import { X, Check, Flame, Users, Mail, Phone, Activity, Globe, MapPin } from 'lucide-react';
import { Deal } from '.'; // Import type Deal từ file chính
import { cn } from '@/lib/utils';

interface DealDetailSidebarProps {
    deal: Deal;
    onClose: () => void;
}

export default function DealDetailSidebar({ deal, onClose }: DealDetailSidebarProps) {

    // Hàm format PRIORITY giống bên Main
    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'critical': return 'bg-red-50 text-red-600 border-red-200';
            case 'high': return 'bg-amber-50 text-amber-600 border-amber-200';
            case 'medium': return 'bg-orange-50 text-orange-600 border-orange-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    return (
        <>
            {/* Background Overlay (Làm mờ nền) */}
            <div
                className="fixed inset-0 bg-[#102c1e]/20 backdrop-blur-[2px] z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Sidebar Slide-in Panel */}
            <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">

                {/* ── HEADER ── */}
                <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-8 py-6 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className={cn("px-2.5 py-1 rounded-md border font-sans text-[10px] font-bold uppercase tracking-wide", getPriorityColor(deal.priority))}>
                                {deal.priority} Priority
                            </span>
                            <span className="px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 font-sans text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                Stage: {deal.stage}
                            </span>
                            {deal.matchScore && (
                                <span className="px-2.5 py-1 rounded-md bg-[#a1e2b6]/20 border border-[#a1e2b6]/40 font-sans text-[10px] font-black text-[#102c1e] uppercase tracking-wide">
                                    {deal.matchScore}% Match
                                </span>
                            )}
                        </div>
                        <h2 className="font-heading text-2xl font-black text-[#102c1e]">
                            {deal.startup}
                        </h2>
                        <p className="font-mono text-lg font-medium text-slate-500 mt-1">Ask: {deal.ask}</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-[#102c1e] rounded-full transition-colors border border-slate-200"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* ── BODY CONTENT ── */}
                <div className="p-8 space-y-10 flex-1">

                    {/* Section: Project Overview */}
                    <div>
                        <h4 className="font-sans text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Project Overview</h4>
                        <p className="font-sans text-sm text-[#102c1e] font-bold mb-1">{deal.tagline}</p>
                        <p className="font-sans text-sm text-slate-600 leading-relaxed">
                            {deal.abstract}
                        </p>
                    </div>

                    {/* Section: Traction & Metrics (EVIDENCE) */}
                    <div>
                        <h4 className="font-sans text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                            Traction & Metrics <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px]">4</span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-sans text-xs font-bold text-[#102c1e]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> MRR: {deal.mrr || 'N/A'}
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-sans text-xs font-bold text-[#102c1e]">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Users: {deal.traction || 'N/A'}
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-sans text-xs font-bold text-[#102c1e]">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Vertical: {deal.vertical}
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-sans text-xs font-bold text-[#102c1e]">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Founded: {deal.founded || '2023'}
                            </span>
                        </div>

                        {/* 3 Block đánh giá nhanh giống BorderPilot */}
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="border border-slate-100 bg-slate-50 rounded-xl p-4">
                                <p className="font-sans text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Market Fit</p>
                                <p className="font-heading text-lg font-black text-[#102c1e]">Strong</p>
                            </div>
                            <div className="border border-slate-100 bg-slate-50 rounded-xl p-4">
                                <p className="font-sans text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Burn Rate</p>
                                <p className="font-heading text-lg font-black text-[#102c1e]">~$8K/mo</p>
                            </div>
                            <div className="border border-slate-100 bg-slate-50 rounded-xl p-4">
                                <p className="font-sans text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Competitors</p>
                                <p className="font-heading text-lg font-black text-[#102c1e]">Moderate</p>
                            </div>
                        </div>
                    </div>

                    {/* Section: AI Reasoning Chain */}
                    <div>
                        <h4 className="font-sans text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">AI Sourcing Analysis</h4>
                        <ol className="space-y-2.5 font-sans text-sm text-slate-600">
                            <li className="flex gap-3"><span className="font-mono font-bold text-slate-300">1.</span> Observed high retention rate (Churn &lt; 2%) via Data Room integration.</li>
                            <li className="flex gap-3"><span className="font-mono font-bold text-slate-300">2.</span> Competitor Analysis Agent flagged low CAC in current Go-To-Market strategy.</li>
                            <li className="flex gap-3"><span className="font-mono font-bold text-slate-300">3.</span> Computed risk-adjusted score aligns 94% with your VC thesis.</li>
                            <li className="flex gap-3"><span className="font-mono font-bold text-slate-300">4.</span> Recommended for immediate Screening & Intro Call.</li>
                        </ol>
                    </div>

                    {/* Section: Team & Contact (Mock data động dựa trên deal) */}
                    <div>
                        <h4 className="font-sans text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Team & Contact</h4>
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-[#102c1e]/10 flex items-center justify-center shrink-0">
                                    <span className="font-sans text-lg font-black text-[#102c1e]">
                                        {deal.founder.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <h5 className="font-heading font-bold text-[#102c1e] text-base">{deal.founder}</h5>
                                    <p className="font-sans text-xs text-slate-500 mb-2">{deal.founderTitle} • Team of {deal.teamSize || 5} members</p>
                                    <div className="flex flex-col gap-1">
                                        <p className="flex items-center gap-2 font-mono text-[11px] text-slate-600">
                                            <Mail className="w-3 h-3 text-slate-400" /> founder@{deal.startup.toLowerCase().replace(/\s/g, '')}.co
                                        </p>
                                        <p className="flex items-center gap-2 font-mono text-[11px] text-slate-600">
                                            <Phone className="w-3 h-3 text-slate-400" /> +84 987 654 321
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Investment Thesis / Risk */}
                    <div>
                        <h4 className="font-sans text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Investment Thesis</h4>
                        <p className="font-sans text-sm text-slate-600 leading-relaxed border-l-2 border-[#102c1e]/20 pl-4 py-1">
                            Bỏ qua cơ hội này đồng nghĩa với việc bỏ lỡ một Startup có lực kéo (Traction) cực kỳ vững chắc trong ngách {deal.vertical}. Định giá {deal.stage} hiện tại đang rất thuận lợi để vào tiền.
                        </p>
                    </div>

                </div>

                {/* ── FOOTER ACTIONS ── */}
                <div className="p-6 border-t border-slate-100 bg-white flex items-center gap-3 shrink-0">
                    <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#102c1e] text-white rounded-xl font-sans text-sm font-bold hover:bg-[#0a1c13] transition-colors shadow-md">
                        <Check className="w-4 h-4" /> Approve & Advance
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-[#102c1e] rounded-xl font-sans text-sm font-bold hover:bg-slate-50 transition-colors">
                        Reject
                    </button>
                </div>

            </div>
        </>
    );
}