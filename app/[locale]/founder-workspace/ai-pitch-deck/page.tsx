"use client";

import React, { useState } from "react";
import { useProject } from "@/lib/context/ProjectContext";
import { DraftingHeader } from "@/components/founder-workspace/ai-pitch-deck/drafting-header";
import { DraftingEditor } from "@/components/founder-workspace/ai-pitch-deck/drafting-editor";
import { AINavigatorSidebar } from "@/components/founder-workspace/ai-pitch-deck/ai-navigator-sidebar";
import { PageHeader } from "@/components/founder-workspace/ai-pitch-deck/page-header";
import { TaskList } from "@/components/founder-workspace/ai-pitch-deck/task-list";
import { IPSyncCard } from "@/components/founder-workspace/ai-pitch-deck/ip-sync-card";

export default function AIPolicyNavigatorPage() {
  const { project } = useProject();
  const [activeTaskIndex, setActiveTaskIndex] = useState<number | null>(null);

  const tasks = [
    { title: "Tóm tắt Dự án", description: "Chuẩn hóa ý tưởng sơ khai", progress: project.completionPercentage >= 25 ? 100 : 90 },
    { title: "Pain Point & Giải pháp", description: "Chạm vào nỗi đau thị trường", progress: project.completionPercentage >= 50 ? 100 : 87 },
    { title: "Lợi thế cạnh tranh", description: "Điểm mạnh của hệ thống", progress: project.completionPercentage >= 75 ? 100 : 67 },
    { title: "Lộ trình phát triển", description: "Tầm nhìn, sứ mệnh của dự án", progress: project.completionPercentage === 100 ? 100 : 48 },
    { title: "Kế hoạch tài chính", description: "Cách dòng tiền chảy", progress: project.completionPercentage === 100 ? 100 : 20 },
    { title: "Đối tác chiến lược", description: "Hợp tác cùng phát triển", progress: project.completionPercentage === 100 ? 100 : 0 },
  ];

  const overallProgress = project.completionPercentage || 0;

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
      <PageHeader overallProgress={overallProgress} projectName={project.name} />
      <TaskList tasks={tasks} onTaskClick={(index) => setActiveTaskIndex(index)} />
      {/* <IPSyncCard /> */}
    </div>
  );
}