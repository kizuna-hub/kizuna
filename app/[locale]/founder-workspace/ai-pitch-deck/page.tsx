"use client";

import React, { useState } from "react";
import { DraftingHeader } from "@/components/founder-workspace/ai-pitch-deck/drafting-header";
import { DraftingEditor } from "@/components/founder-workspace/ai-pitch-deck/drafting-editor";
import { AINavigatorSidebar } from "@/components/founder-workspace/ai-pitch-deck/ai-navigator-sidebar";
import { PageHeader } from "@/components/founder-workspace/ai-pitch-deck/page-header";
import { TaskList } from "@/components/founder-workspace/ai-pitch-deck/task-list";
import { IPSyncCard } from "@/components/founder-workspace/ai-pitch-deck/ip-sync-card";

export default function AIPolicyNavigatorPage() {
  const [activeTaskIndex, setActiveTaskIndex] = useState<number | null>(null);

  const tasks = [
    { title: "Tóm tắt Dự án", description: "Chuẩn hóa ý tưởng sơ khai", progress: 100 },
    { title: "Định nghĩa Vấn đề & Giải pháp", description: "Khớp với nhu cầu thị trường", progress: 100 },
    { title: "Kế hoạch Tài chính (NQ-54)", description: "Theo luật hỗ trợ địa phương", progress: 60 },
    { title: "Lộ trình Kỹ thuật & IP", description: "Tính năng bảo vệ công nghệ", progress: 0 },
  ];

  const overallProgress = 65;

  // Render Drafting Mode
  if (activeTaskIndex !== null) {
    return (
      <div className="max-w-7xl mx-auto pt-10 px-4 pb-10 animate-in fade-in duration-300">
        <DraftingHeader task={tasks[activeTaskIndex]} onBack={() => setActiveTaskIndex(null)} />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2">
            <DraftingEditor task={tasks[activeTaskIndex]} />
          </div>
          <div className="xl:col-span-1">
            <AINavigatorSidebar />
          </div>
        </div>
      </div>
    );
  }

  // Render Main Page
  return (
    <div className="max-w-5xl mx-auto pt-10 px-4 pb-16 animate-in fade-in duration-300">
      <PageHeader overallProgress={overallProgress} />
      <TaskList tasks={tasks} onTaskClick={(index) => setActiveTaskIndex(index)} />
      <IPSyncCard />
    </div>
  );
}