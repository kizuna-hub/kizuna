"use client";

import {
  ArrowRight,
  CheckCircle2,
  CircleGauge,
  FlaskConical,
  UsersRound,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { useAiWorkspace } from "../../hooks/use-ai-workspace";
import { MentorRecommendationGrid } from "../../mentor-recommendation/components/mentor-recommendation-grid";
import type { AnalysisTab } from "../../types/workspace-layout.types";

type Workspace = ReturnType<typeof useAiWorkspace>;

const confidenceLabels = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
};

const projectedIncreaseByCriterion: Record<string, string> = {
  problem_and_user_understanding: "+1 đến +3",
  customer_discovery_and_evidence: "+5 đến +8",
  prototype_and_learning: "+4 đến +7",
  market_signal_and_commitment: "+6 đến +10",
  experiment_and_execution_discipline: "+2 đến +4",
  team_capability_and_resource_access: "+2 đến +5",
  communication_and_materials: "+4",
};

export function AnalysisPane({
  workspace,
  showClose = true,
}: {
  workspace: Workspace;
  showClose?: boolean;
}) {
  const assessment = workspace.state.readiness.assessment;
  const selectedTab = workspace.layout.analysisTab;
  const strongest = assessment.criteria.reduce((best, item) =>
    item.score > best.score ? item : best,
  );
  const unlock = assessment.criteria.reduce((weakest, item) =>
    item.score < weakest.score ? item : weakest,
  );

  return (
    <aside
      className="flex h-full min-h-0 flex-col bg-workspace-panel"
      aria-label="Phân tích CampusFlow"
    >
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-workspace-border px-4">
        <div>
          <h2 className="workspace-section-title text-ink">
            Phân tích CampusFlow
          </h2>
          <p className="workspace-meta text-workspace-muted-text">
            Readiness cho bước kiểm chứng tiếp theo
          </p>
        </div>
        {showClose ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={workspace.closeSecondaryPane}
            aria-label="Đóng phân tích"
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </header>

      <Tabs
        value={selectedTab}
        onValueChange={(value) =>
          workspace.setAnalysisTab(value as AnalysisTab)
        }
        className="min-h-0 flex-1 gap-0"
      >
        <TabsList className="grid h-11 w-full shrink-0 grid-cols-3 rounded-none border-b border-workspace-border bg-workspace-panel p-0">
          <TabsTrigger value="overview" className="rounded-none">
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="readiness" className="rounded-none">
            Readiness
          </TabsTrigger>
          <TabsTrigger value="mentor" className="rounded-none">
            Mentor
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="overview"
          className="no-scrollbar m-0 min-h-0 overflow-y-auto p-4"
        >
          <div className="rounded-xl border border-workspace-border bg-workspace-elevated p-4">
            <div className="flex items-center gap-4">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-full border-[7px] border-primary-border">
                <span className="font-tabular text-2xl font-semibold text-ink">
                  {assessment.overallScore}
                </span>
              </div>
              <div>
                <p className="workspace-eyebrow text-workspace-muted-text">
                  Mức độ sẵn sàng · Prototype
                </p>
                <p className="mt-1 workspace-card-title text-ink">
                  Sẵn sàng cho một pilot nhỏ có kiểm soát
                </p>
                <p className="mt-1 workspace-meta text-workspace-muted-text">
                  Điểm này đo độ sẵn sàng cho bước kiểm chứng tiếp
                  theo, không phải chất lượng startup.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 grid gap-3">
            <SummaryRow
              icon={CheckCircle2}
              label="Mạnh nhất"
              title={`${strongest.label} · ${strongest.score}/100`}
              description="Founder đã hiểu vấn đề đủ rõ để tiếp tục kiểm chứng."
            />
            <SummaryRow
              icon={CircleGauge}
              label="Khoảng trống cần mở khóa"
              title={`${unlock.label} · ${unlock.score}/100`}
              description="Tín hiệu quan tâm cần được chuyển thành cam kết pilot quan sát được."
            />
            <SummaryRow
              icon={FlaskConical}
              label="Bước tiếp theo"
              title="Pilot 14 ngày với 1 câu lạc bộ"
              description="Mời 5–8 thành viên mới và đo ít nhất 3/5 người quay lại."
            />
          </div>

          <Button
            type="button"
            className="mt-4 w-full"
            onClick={() =>
              workspace.setAnalysisTab("readiness")
            }
          >
            Xem 7 tiêu chí
            <ArrowRight className="size-4" />
          </Button>
        </TabsContent>

        <TabsContent
          value="readiness"
          className="no-scrollbar m-0 min-h-0 overflow-y-auto p-4"
        >
          <p className="mb-3 workspace-meta text-workspace-muted-text">
            Ở giai đoạn Prototype, CampusFlow chưa cần doanh thu.
            Readiness ưu tiên chất lượng học hỏi và tín hiệu cam kết.
          </p>
          <div className="space-y-2.5">
            {assessment.criteria.map((criterion) => (
              <button
                key={criterion.id}
                type="button"
                onClick={() => {
                  workspace.setSelectedCriterion(criterion.id);
                  workspace.openEvidence("by_criterion");
                }}
                className="w-full rounded-xl border border-workspace-border bg-workspace-elevated p-3 text-left transition-colors hover:border-primary-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/50 motion-reduce:transition-none"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="workspace-card-title text-ink">
                      {criterion.label}
                    </p>
                    <p className="mt-1 workspace-meta text-workspace-muted-text">
                      Trọng số {criterion.weight}% · Độ tin cậy{" "}
                      {confidenceLabels[criterion.confidence]}
                    </p>
                  </div>
                  <span className="font-tabular workspace-card-title text-ink">
                    {criterion.score}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-workspace-panel">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${criterion.score}%` }}
                  />
                </div>
                <p className="mt-2 workspace-meta text-ink">
                  Hiện có:{" "}
                  {criterion.contributions[0]?.interpretation ??
                    criterion.description}
                </p>
                <p className="mt-1 workspace-meta text-workspace-muted-text">
                  Còn thiếu:{" "}
                  {criterion.missingEvidence[0] ??
                    "Chưa có gap trọng yếu."}
                </p>
                <div className="mt-2 flex items-center justify-between gap-2 border-t border-workspace-border pt-2">
                  <p className="workspace-meta text-workspace-muted-text">
                    Mở khóa: {criterion.improvementActions[0]}
                  </p>
                  <span className="shrink-0 font-tabular workspace-meta text-workspace-success">
                    Dự kiến{" "}
                    {projectedIncreaseByCriterion[criterion.id]}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent
          value="mentor"
          className="no-scrollbar m-0 min-h-0 overflow-y-auto p-4"
        >
          {workspace.state.mentorRecommendation ? (
            <MentorRecommendationGrid
              recommendation={
                workspace.state.mentorRecommendation
              }
              connectionBriefs={
                workspace.state.mentorConnectionBriefs
              }
              connectionRequest={
                workspace.state.mentorConnectionRequest
              }
              onOpenDetails={workspace.openMentorFit}
              onOpenConnection={
                workspace.openMentorConnection
              }
              onToggleSave={workspace.toggleSaveMentor}
            />
          ) : (
            <div className="py-12 text-center">
            <UsersRound className="mx-auto size-6 text-primary" />
            <p className="mt-3 workspace-card-title text-ink">
              Mentor phù hợp sẽ xuất hiện sau khi Kizuna phân tích
              nhu cầu.
            </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </aside>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  title,
  description,
}: {
  icon: typeof CheckCircle2;
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-workspace-border bg-workspace-elevated p-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="workspace-eyebrow text-workspace-muted-text">
          {label}
        </p>
        <p className="mt-1 workspace-card-title text-ink">
          {title}
        </p>
        <p className="mt-1 workspace-meta text-workspace-muted-text">
          {description}
        </p>
      </div>
    </div>
  );
}
