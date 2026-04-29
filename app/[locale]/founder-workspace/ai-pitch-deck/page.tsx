"use client";

import React, { useState } from "react";
import { Sparkles, Gavel, FileCheck, ArrowRight, Lock, CheckCircle2, ChevronRight, BookOpen, Fingerprint } from "lucide-react";

export default function AIPolicyNavigatorPage() {
  const [activeTaskIndex, setActiveTaskIndex] = useState<number | null>(null);

  const tasks = [
    {
      title: "Executive Summary",
      description: "Standardize raw ideas",
      progress: 100,
    },
    {
      title: "Problem & Solution Definition",
      description: "Market-fit alignment",
      progress: 100,
    },
    {
      title: "Financial Plan & Budgeting (NQ-54)",
      description: "Specific to local grant laws",
      progress: 60,
    },
    {
      title: "Technical Roadmap & IP Status",
      description: "Technology defensibility",
      progress: 0,
    },
  ];

  const overallProgress = 65;

  // Render Drafting Mode if a task is selected
  if (activeTaskIndex !== null) {
    const task = tasks[activeTaskIndex];
    return (
      <div className="flex flex-col h-full min-h-[calc(100vh-2rem)] mt-10 animation-fade-in animate-in fade-in duration-300">
        {/* Header */}
        <div className="mb-6 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
          <div>
            <button
              onClick={() => setActiveTaskIndex(null)}
              className="text-sm text-kizuna-text-muted hover:text-[#102c1e] mb-2 flex items-center transition-colors font-medium"
            >
              <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Back to Sections
            </button>
            <h1 className="text-2xl font-bold text-[#102c1e] flex items-center gap-2">
              Drafting: {task.title}
            </h1>
            <p className="text-kizuna-text-muted text-sm mt-1">{task.description}</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-kizuna-border shadow-sm">
            <div className="text-right">
              <p className="text-[10px] text-kizuna-text-muted font-bold uppercase tracking-wider">Completion</p>
              <p className="text-lg font-bold text-[#102c1e] leading-none mt-0.5">{task.progress}%</p>
            </div>
            <div className="w-10 h-10 rounded-full border-[3px] border-kizuna-surface flex items-center justify-center relative">
              <svg className="absolute top-[-3px] left-[-3px] w-10 h-10 -rotate-90">
                <circle
                  cx="20"
                  cy="20"
                  r="18.5"
                  fill="transparent"
                  stroke="#102c1e"
                  strokeWidth="3"
                  strokeDasharray={116.2}
                  strokeDashoffset={116.2 - (116.2 * task.progress) / 100}
                  className="transition-all duration-1000 ease-in-out"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-xs font-semibold text-[#102c1e]"><Sparkles className="w-3.5 h-3.5" /></span>
            </div>
          </div>
        </div>

        {/* Split View */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-6 pb-8">
          {/* Left Side: Form Fields */}
          <div className="xl:col-span-2 flex flex-col gap-5">
            <div className="bg-white border border-kizuna-border rounded-xl p-6 flex-1 flex flex-col shadow-sm">
              <label className="block text-sm font-semibold text-[#102c1e] mb-3 flex items-center justify-between">
                <span>Content Draft</span>
                {task.progress === 100 && (
                  <span className="bg-[#102c1e]/10 text-[#102c1e] text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Standardized
                  </span>
                )}
              </label>
              <textarea
                className="w-full flex-1 min-h-[400px] p-5 rounded-lg border border-kizuna-border bg-kizuna-surface focus:outline-none focus:ring-2 focus:ring-[#102c1e]/20 focus:border-[#102c1e] transition-all resize-none text-kizuna-text-main leading-relaxed shadow-inner"
                placeholder="Start typing or use the AI Auto-Fill..."
                defaultValue={task.progress === 100 ? "This section has been fully standardized and complies with all local regulations. The startup demonstrates a clear understanding of the market dynamics and has formulated a scalable solution that aligns with the sustainable development goals outlined in Resolution 54.\n\nKey Highlights:\n- Clear problem definition addressing urban mobility.\n- Innovative approach leveraging AI and IoT.\n- Strong alignment with Da Nang's smart city initiatives." : ""}
              ></textarea>

              <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs font-medium text-kizuna-text-muted flex items-center gap-1.5 bg-kizuna-surface px-3 py-1.5 rounded-md w-fit">
                  <FileCheck className="w-3.5 h-3.5 text-[#102c1e]" /> Auto-saving draft...
                </p>
                <div className="flex flex-wrap gap-3">
                  <button className="px-5 py-2.5 text-sm font-semibold text-[#102c1e] border border-kizuna-border bg-white rounded-lg hover:bg-kizuna-surface transition-all shadow-sm">
                    Save Draft
                  </button>
                  <button className="px-5 py-2.5 text-sm font-semibold text-white bg-[#102c1e] hover:bg-[#16452a] rounded-lg shadow-sm transition-all flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Lock & Sync to Ledger
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: AI Navigator Sidebar */}
          <div className="bg-white border border-kizuna-border rounded-xl p-5 flex flex-col shadow-sm h-fit sticky top-6">
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-kizuna-border">
              <div className="w-10 h-10 rounded-xl bg-[#102c1e]/5 flex items-center justify-center text-[#102c1e] border border-[#102c1e]/10">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#102c1e] text-base">AI Navigator</h3>
                <p className="text-xs font-medium text-kizuna-text-muted">Smart Drafting Assistant</p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <button className="w-full py-3 bg-[#102c1e] hover:bg-[#16452a] text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2 active:scale-[0.98]">
                <Sparkles className="w-4 h-4" /> Auto-Fill Section
              </button>

              <div className="bg-kizuna-surface/50 border border-[#102c1e]/10 rounded-xl p-4">
                <h4 className="text-xs font-bold text-[#102c1e] flex items-center gap-1.5 mb-2.5 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Contextual Suggestion
                </h4>
                <p className="text-sm text-kizuna-text-main leading-relaxed">
                  Based on <strong className="text-[#102c1e]">Resolution 54</strong>, you should emphasize your social impact in this section. Local grants prioritize solutions addressing urban environmental challenges.
                </p>
              </div>

              <div className="bg-white border border-kizuna-border rounded-xl overflow-hidden flex flex-col max-h-[300px]">
                <div className="bg-kizuna-surface border-b border-kizuna-border p-3">
                  <h4 className="text-xs font-bold text-[#102c1e] flex items-center gap-1.5 uppercase tracking-wider">
                    <Gavel className="w-3.5 h-3.5" /> Policy Reference
                  </h4>
                </div>
                <div className="p-4 overflow-y-auto text-sm text-kizuna-text-muted scrollbar-thin bg-white leading-relaxed">
                  <p className="mb-2 text-[#102c1e] font-semibold text-xs uppercase tracking-wide">Article 4.2 - Resolution 54/2021/NQ-HĐND</p>
                  <p>Startups applying for non-refundable grants must clearly demonstrate alignment with the city's socio-economic development goals. The business model should address explicit local challenges, particularly in smart city development or green economy initiatives.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Main Page
  return (
    <div className="max-w-5xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* 1. Page Header & Status */}
      <div className="mb-10">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 bg-white p-8 rounded-2xl border border-kizuna-border shadow-sm">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-[#102c1e] flex items-center gap-3 tracking-tight">
              <Sparkles className="w-8 h-8 text-[#102c1e]" />
              AI Policy Navigator
            </h1>
            <p className="text-kizuna-text-muted mt-3 text-lg leading-relaxed">
              Standardizing your startup profile for investors and government grants (NQ-54 & QĐ-3344 compliant).
            </p>
          </div>

          <div className="bg-kizuna-surface border border-kizuna-border rounded-xl p-5 shadow-inner min-w-[280px]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-[#102c1e] uppercase tracking-wider">Overall Pitch Readiness</span>
              <span className="text-xl font-black text-[#102c1e]">{overallProgress}%</span>
            </div>
            <div className="h-3 w-full bg-white border border-kizuna-border rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-[#102c1e] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p className="text-sm font-medium text-kizuna-text-muted mt-3 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#102c1e]" />
              2 of 4 Sections Completed
            </p>
          </div>
        </div>
      </div>

      {/* 2. Multi-Part Form Builder (The Tasks) */}
      <div className="space-y-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-[#102c1e] flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Funding Profile Sections
          </h2>
          <span className="text-sm font-medium text-kizuna-text-muted bg-white border border-kizuna-border px-3 py-1 rounded-full shadow-sm">
            Step-by-step drafting
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {tasks.map((task, index) => {
            const isCompleted = task.progress === 100;
            return (
              <div
                key={index}
                onClick={() => setActiveTaskIndex(index)}
                className="bg-white border border-kizuna-border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-[#102c1e] hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start md:items-center gap-5 w-full">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isCompleted ? 'bg-[#102c1e] text-white shadow-md' : 'bg-kizuna-surface text-kizuna-text-muted border border-kizuna-border group-hover:border-[#102c1e]/30 group-hover:text-[#102c1e]'}`}>
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-bold text-lg">{index + 1}</span>}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg tracking-tight ${isCompleted ? 'text-[#102c1e]' : 'text-[#102c1e]'}`}>
                      {task.title}
                    </h3>
                    <p className="text-sm font-medium text-kizuna-text-muted mt-0.5">{task.description}</p>

                    <div className="mt-3 flex items-center gap-3 max-w-xs">
                      <div className="flex-1 h-2 bg-kizuna-surface border border-kizuna-border/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${isCompleted ? 'bg-[#102c1e]' : 'bg-[#102c1e]/60'}`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-[#102c1e] w-10">{task.progress}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center md:pl-6 md:border-l border-kizuna-border self-start md:self-stretch w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 mt-2 md:mt-0">
                  <button className={`w-full md:w-auto px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${isCompleted ? 'bg-kizuna-surface text-[#102c1e] hover:bg-gray-100 border border-kizuna-border/50' : 'bg-[#102c1e] text-white hover:bg-[#16452a] shadow-sm group-hover:shadow-md'}`}>
                    {isCompleted ? 'Review Content' : 'Continue with AI Assistant'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Final Action: IP Sync */}
      <div className="mt-12 bg-white border border-kizuna-border rounded-2xl p-10 text-center flex flex-col items-center justify-center shadow-sm relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-kizuna-surface rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-kizuna-surface rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="w-20 h-20 bg-kizuna-surface rounded-full border border-kizuna-border flex items-center justify-center mb-5 shadow-inner relative z-10">
          <Fingerprint className="w-10 h-10 text-[#102c1e]" />
        </div>
        <h2 className="text-2xl font-bold text-[#102c1e] mb-3 relative z-10">Secure & Sync to Ledger</h2>
        <p className="text-kizuna-text-muted font-medium max-w-lg mb-8 relative z-10 leading-relaxed">
          Once your funding profile sections are fully standardized and approved, sync them to the IP Protection Ledger to generate immutable ownership hashes.
        </p>
        <button className="px-8 py-3.5 bg-[#102c1e] hover:bg-[#16452a] text-white text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 active:scale-[0.98] relative z-10">
          <Lock className="w-5 h-5" /> Secure & Sync to IP Ledger
        </button>
      </div>
    </div>
  );
}
