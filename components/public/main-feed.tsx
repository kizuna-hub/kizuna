"use client";

import React from "react";
import { Search, Flame, Award, ChevronRight, Sparkles, MessageCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { featuredProjects, timelineProjects } from "./data";

export function MainFeed() {
  return (
    // Nền zinc-50 quý phái
    <div className="min-h-screen mx-auto max-w-5xl px-6 w-full bg-zinc-50 pb-20 font-sans selection:bg-[#16452a]/20">

      {/* =======================================
                NAVIGATION BAR (TRẢ LẠI NGUYÊN TRẠNG UNIKORN)
                ======================================= */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6 lg:px-8">

          {/* Left: Logo & Menu */}
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#081810]">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#081810]">Kizuna Hub</span>
            </div>
            <nav className="hidden items-center gap-6 md:flex">
              <button className="text-sm font-semibold text-slate-900">Categories</button>
              <button className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Talks</button>
              <button className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Explore</button>
            </nav>
          </div>

          {/* Right: Search & Actions */}
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:flex items-center w-64">
              <Search className="absolute left-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-full rounded-full border border-slate-200 bg-slate-50 pl-9 pr-12 text-sm text-slate-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#16452a]/20"
              />
              <kbd className="absolute right-3 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400">⌘K</kbd>
            </div>
            <button className="flex h-9 items-center gap-2 rounded-full bg-[#16452a] px-4 text-sm font-bold text-white transition-all hover:bg-[#0a1c13]">
              Submit project
            </button>
            <div className="h-8 w-8 overflow-hidden rounded-full border border-slate-200 bg-slate-100 cursor-pointer">
              <img src="https://github.com/shadcn.png" alt="Avatar" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      {/* =======================================
                MAIN CONTENT (LAYOUT 2 CỘT)
                ======================================= */}
      <main className="mx-auto mt-10 w-full max-w-7xl px-6 lg:px-8">

        {/* 1. FEATURED BANNER (Chuẩn Unikorn) */}
        <div className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#081810]">Featured last week</h2>
            <div className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-slate-800" />
              <div className="h-2 w-2 rounded-full bg-slate-300" />
              <div className="h-2 w-2 rounded-full bg-slate-300" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {featuredProjects.map((item) => (
              <div key={item.id} className="group relative flex cursor-pointer items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-zinc-300">
                {item.tag && (
                  <span className="absolute -top-3 left-4 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-800 border border-amber-200">
                    {item.tag}
                  </span>
                )}
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-1 text-xs font-bold text-slate-500">
                    <Award className="h-3.5 w-3.5 text-amber-500" />
                    {item.points} pts
                  </div>
                  <h3 className="font-bold text-slate-900">{item.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs font-medium text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
                <div className={cn("flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-2xl font-bold shadow-inner", item.color)}>
                  {item.logo}
                </div>
              </div>
            ))}
            {/* Placeholder Quảng Cáo */}
            <div className="flex items-center gap-4 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4">
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">Your Project Here</h3>
                <p className="mt-1 text-xs font-medium text-slate-500">Reach thousands of users every day.</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-zinc-200 text-xs font-bold text-slate-400">
                AD
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">

          {/* =======================================
                        2. CỘT TRÁI: EDITORIAL TIMELINE 
                        (Sự kết hợp hoàn hảo)
                        ======================================= */}
          <div>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#081810]">Traction Log</h2>
              <button className="text-sm font-semibold text-slate-500 hover:text-slate-900 underline underline-offset-4">
                View all
              </button>
            </div>

            {/* Container Dòng thời gian */}
            <div className="relative">
              {/* Đường kẻ mờ */}
              <div className="absolute left-[88px] top-4 bottom-4 w-px bg-zinc-200 hidden sm:block" />

              <div className="flex flex-col gap-10">
                {timelineProjects.map((project) => (
                  <div key={project.id} className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-12 group cursor-pointer">

                    {/* Meta: Thời gian */}
                    <div className="w-auto sm:w-24 shrink-0 pt-3">
                      <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-[#16452a] transition-colors">
                        {project.date}
                      </span>
                    </div>

                    {/* Dấu chấm Timeline */}
                    <div className="hidden sm:flex absolute left-[84px] top-4 h-2.5 w-2.5 rounded-full bg-zinc-300 ring-4 ring-zinc-50 transition-colors group-hover:bg-[#16452a]" />

                    {/* Khối Nội Dung (Background trắng như Unikorn nhưng layout mở) */}
                    <div className="flex-1 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-zinc-300">
                      <div className="flex items-start justify-between gap-4">

                        {/* Text Info */}
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white shadow-inner", project.color)}>
                              {project.logo}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">{project.name}</h3>
                          </div>
                          <p className="text-sm font-medium leading-relaxed text-slate-500">
                            {project.milestone}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                              <span key={tag} className="rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Stats Unikorn Style */}
                        <div className="flex flex-col items-center gap-3 shrink-0">
                          <button className="group/btn flex w-12 flex-col items-center gap-1 rounded-xl border border-zinc-200 bg-zinc-50 py-2 transition-colors hover:border-[#16452a] hover:bg-[#16452a]/5">
                            <Flame className="h-4 w-4 text-zinc-400 group-hover/btn:text-[#16452a]" />
                            <span className="text-xs font-bold text-slate-700">{project.claps}</span>
                          </button>
                          <div className="flex items-center gap-1 text-xs font-bold text-zinc-400">
                            <MessageCircle className="h-3.5 w-3.5" />
                            {project.comments}
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* =======================================
                        3. CỘT PHẢI: WIDGETS (Chuẩn Unikorn)
                        ======================================= */}
          <div className="flex flex-col gap-8">

            {/* Activity Streak Widget */}
            <div>
              <h2 className="mb-4 text-sm font-bold text-[#081810]">Activity streak</h2>
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    <Flame className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      <span className="text-orange-600">1</span> consecutive days
                    </h3>
                    <p className="mt-0.5 text-xs font-medium text-slate-500">6 more days to reach the next milestone!</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between text-[10px] font-bold text-zinc-400">
                  <span className="text-orange-600">7</span>
                  <span>30</span>
                  <span>60</span>
                  <span>90</span>
                  <span>100</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                  <div className="h-full w-[15%] rounded-full bg-orange-500" />
                </div>
                <button className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900">
                  All achievements <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Reviews Widget */}
            <div>
              <h2 className="mb-4 text-sm font-bold text-[#081810]">Kizuna Reviews</h2>
              <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="flex gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-lg bg-blue-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-snug">Giải pháp tối ưu hóa trải nghiệm IOS</p>
                    <div className="mt-1 flex items-center gap-2 text-xs font-medium text-slate-500">
                      <span className="text-slate-700">LuvTK</span>
                      <Star className="h-3 w-3 text-zinc-300" /> 2
                      <MessageCircle className="h-3 w-3 text-zinc-300" /> 267
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-lg bg-emerald-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-snug">Đánh giá chi tiết nền tảng AI Roleplay</p>
                    <div className="mt-1 flex items-center gap-2 text-xs font-medium text-slate-500">
                      <span className="text-slate-700">Ngoc</span>
                      <Star className="h-3 w-3 text-zinc-300" /> 5
                      <MessageCircle className="h-3 w-3 text-zinc-300" /> 120
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}