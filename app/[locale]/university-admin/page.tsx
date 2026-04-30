"use client";

import React from "react";
import { AdminHeader } from "@/components/university-admin/admin-header";
import { StrategicMetrics } from "@/components/university-admin/strategic-metrics";
import { StartupTrends } from "@/components/university-admin/startup-trends";
import { EcosystemStats } from "@/components/university-admin/ecosystem-stats";
import { FundROIHeatmap } from "@/components/university-admin/fund-roi-heatmap";
import { TalentLiquidity } from "@/components/university-admin/talent-liquidity";
import { SkillGapAnalysis } from "@/components/university-admin/skill-gap-analysis";

export default function UniversityAdminDashboard() {
  return (
    <div className="space-y-8">
      <AdminHeader />
      <StrategicMetrics />
      {/* Bản đồ giải ngân ROI full-width để show thành tích */}
      <FundROIHeatmap />

      {/* Biểu đồ xu hướng và Phễu sinh tồn */}
      <StartupTrends />

      {/* Grid 2 cột: Lỗ hổng năng lực (Trái) & Thanh khoản nhân tài (Phải) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SkillGapAnalysis />
        <TalentLiquidity />
      </div>
      {/* <StartupTrends /> */}
      <EcosystemStats />
    </div>
  );
}