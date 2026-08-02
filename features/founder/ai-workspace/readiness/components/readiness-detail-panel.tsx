"use client";

import React from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  Clock3,
  FileText,
  History,
  X,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { hasRubricVersionWarning } from "../services/readiness-calculator";
import type {
  ExplainableReadinessAssessment,
  ReadinessContribution,
  ReadinessCriterionId,
} from "../types/readiness.types";
import { ReadinessRing } from "../../components/shared/readiness-ring";
import { ReadinessCriterionDetail } from "./readiness-criterion-detail";
import { ReadinessSourceViewer } from "./readiness-source-viewer";

const confidenceLabels = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
} as const;

export function ReadinessDetailPanel({
  assessment,
  initialCriterionId,
  onClose,
  onCreateCycle,
  onDisputeContribution,
  onConfirmContribution,
}: {
  assessment: ExplainableReadinessAssessment;
  initialCriterionId?: ReadinessCriterionId;
  onClose: () => void;
  onCreateCycle: () => void;
  onDisputeContribution: (contributionId: string) => void;
  onConfirmContribution: (contributionId: string) => void;
}) {
  const [selectedCriterionId, setSelectedCriterionId] =
    React.useState<ReadinessCriterionId | undefined>(
      initialCriterionId,
    );
  const [sourceContribution, setSourceContribution] =
    React.useState<ReadinessContribution>();
  const [disputeTarget, setDisputeTarget] =
    React.useState<ReadinessContribution>();
  const criteria = assessment.criteria;
  const strongest = [...criteria].sort(
    (left, right) => right.score - left.score,
  )[0];
  const biggestGap = [...criteria].sort(
    (left, right) => left.score - right.score,
  )[0];
  const selectedCriterion = criteria.find(
    (criterion) => criterion.id === selectedCriterionId,
  );

  React.useEffect(() => {
    setSelectedCriterionId(initialCriterionId);
  }, [initialCriterionId]);

  return (
    <aside
      className="flex h-full min-h-0 flex-col bg-workspace-panel"
      aria-label="Chi tiết mức độ sẵn sàng"
    >
      <header className="flex items-start justify-between gap-3 border-b border-workspace-border px-4 py-3.5">
        <div>
          <h2 className="workspace-section-title text-ink">
            Mức độ sẵn sàng
          </h2>
          <p className="mt-1 workspace-meta text-workspace-muted-text">
            {assessment.ventureStage} · {assessment.businessModel}
          </p>
        </div>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={onClose}
          aria-label="Đóng chi tiết mức độ sẵn sàng"
        >
          <X className="size-4" />
        </Button>
      </header>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
        <div className="border-b border-workspace-border p-4">
          <div className="flex items-center gap-4 rounded-xl border border-workspace-border bg-workspace-elevated p-3.5">
            <ReadinessRing
              score={assessment.overallScore}
              label="Mức độ sẵn sàng"
            />
            <div className="min-w-0 flex-1">
              <p className="workspace-card-title text-ink">
                {assessment.label}
              </p>
              <p className="mt-1 font-tabular workspace-meta text-workspace-success">
                +{assessment.delta} trong chu kỳ này
              </p>
              <p className="mt-2 workspace-meta text-workspace-muted-text">
                Giai đoạn {assessment.ventureStage} · Cập nhật 2 giờ
                trước
              </p>
            </div>
          </div>
          <div className="mt-3 rounded-lg border border-primary-border bg-primary-soft p-3">
            <p className="workspace-eyebrow text-workspace-muted-text">
              Khoảng trống có tác động lớn nhất
            </p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <p className="workspace-card-title text-ink">
                {biggestGap?.label}
              </p>
              <span className="font-tabular workspace-card-title text-primary">
                {biggestGap?.score}/100
              </span>
            </div>
            <Button
              type="button"
              size="sm"
              className="mt-3 w-full"
              onClick={() =>
                setSelectedCriterionId(biggestGap?.id)
              }
            >
              Xem tiêu chí ưu tiên
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="criteria" className="gap-0">
          <TabsList className="sticky top-0 z-10 grid h-auto w-full grid-cols-4 rounded-none border-b border-workspace-border bg-workspace-panel p-0">
            {[
              ["overview", "Tổng quan"],
              ["criteria", "Tiêu chí"],
              ["sources", "Nguồn"],
              ["history", "Lịch sử"],
            ].map(([value, label]) => (
              <TabsTrigger
                key={value}
                value={value}
                className="h-10 rounded-none border-0 text-xs data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="m-0 p-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-workspace-border bg-workspace-elevated p-3">
                <p className="workspace-eyebrow text-workspace-muted-text">
                  Mạnh nhất
                </p>
                <p className="mt-1 workspace-supporting font-medium text-ink">
                  {strongest?.label}
                </p>
                <p className="mt-1 font-tabular workspace-meta text-workspace-success">
                  {strongest?.score}/100
                </p>
              </div>
              <div className="rounded-lg border border-workspace-border bg-workspace-elevated p-3">
                <p className="workspace-eyebrow text-workspace-muted-text">
                  Độ tin cậy
                </p>
                <p className="mt-1 workspace-supporting font-medium text-ink">
                  {confidenceLabels[assessment.confidence]}
                </p>
                <p className="mt-1 workspace-meta text-workspace-muted-text">
                  Rubric {assessment.rubricVersion}
                </p>
              </div>
            </div>
            {assessment.canonicalNotice ? (
              <p className="mt-3 flex items-start gap-2 rounded-lg border border-workspace-border bg-workspace-elevated p-3 workspace-meta text-workspace-muted-text">
                <Check className="mt-0.5 size-3.5 shrink-0 text-workspace-success" />
                {assessment.canonicalNotice}
              </p>
            ) : null}
          </TabsContent>

          <TabsContent value="criteria" className="m-0 p-4">
            {selectedCriterion ? (
              <ReadinessCriterionDetail
                criterion={selectedCriterion}
                onBack={() => setSelectedCriterionId(undefined)}
                onOpenSource={setSourceContribution}
                onCreateCycle={onCreateCycle}
              />
            ) : (
              <div>
                <p className="workspace-meta text-workspace-muted-text">
                  7 tiêu chí đánh giá mức độ sẵn sàng
                </p>
                <div className="mt-3 divide-y divide-workspace-border">
                  {criteria.map((criterion) => (
                    <button
                      key={criterion.id}
                      type="button"
                      onClick={() =>
                        setSelectedCriterionId(criterion.id)
                      }
                      className="group flex w-full items-center gap-3 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/50"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate workspace-supporting font-medium text-ink">
                            {criterion.label}
                          </p>
                          <span className="font-tabular workspace-meta text-ink">
                            {criterion.score}/100
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-workspace-elevated">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{
                                width: `${criterion.score}%`,
                              }}
                            />
                          </div>
                          <span
                            className={cn(
                              "font-tabular workspace-meta",
                              criterion.delta > 0
                                ? "text-workspace-success"
                                : "text-workspace-muted-text",
                            )}
                          >
                            {criterion.delta > 0 ? "+" : ""}
                            {criterion.delta}
                          </span>
                        </div>
                        <p className="mt-1 workspace-eyebrow text-workspace-muted-text">
                          Trọng số {criterion.weight}% ·{" "}
                          {confidenceLabels[criterion.confidence]} ·{" "}
                          {criterion.contributions.length} nguồn
                        </p>
                      </div>
                      <ArrowRight className="size-3.5 shrink-0 text-workspace-muted-text transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sources" className="m-0 p-4">
            <div className="space-y-2">
              {criteria
                .flatMap((criterion) => criterion.contributions)
                .map((contribution) => (
                  <button
                    key={contribution.id}
                    type="button"
                    onClick={() =>
                      setSourceContribution(contribution)
                    }
                    className="flex w-full items-start gap-2 rounded-lg border border-workspace-border bg-workspace-elevated p-3 text-left outline-none hover:border-primary-border focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/50"
                  >
                    <FileText className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    <span className="min-w-0">
                      <span className="block truncate workspace-supporting font-medium text-ink">
                        {contribution.source.fileName}
                      </span>
                      <span className="mt-1 block workspace-meta text-workspace-muted-text">
                        {contribution.title}
                      </span>
                    </span>
                  </button>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="m-0 p-4">
            {hasRubricVersionWarning(assessment.history) ? (
              <p className="mb-3 flex items-start gap-2 rounded-lg border border-workspace-warning/25 bg-workspace-warning-soft p-3 workspace-meta text-ink">
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-workspace-warning" />
                Một số mốc dùng phiên bản rubric khác nhau nên không thể
                so sánh trực tiếp.
              </p>
            ) : null}
            <ol className="space-y-2">
              {assessment.history.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-lg border border-workspace-border bg-workspace-elevated p-3"
                >
                  <div className="flex items-center gap-2">
                    {entry.delta > 0 ? (
                      <ArrowUp className="size-3.5 text-workspace-success" />
                    ) : entry.delta < 0 ? (
                      <ArrowDown className="size-3.5 text-workspace-danger" />
                    ) : entry.type === "rubric_version" ? (
                      <History className="size-3.5 text-primary" />
                    ) : (
                      <Clock3 className="size-3.5 text-workspace-muted-text" />
                    )}
                    <span className="font-tabular workspace-supporting font-medium text-ink">
                      {entry.previousScore} → {entry.nextScore}
                    </span>
                    <span className="ml-auto workspace-eyebrow text-workspace-muted-text">
                      {entry.rubricVersion}
                    </span>
                  </div>
                  <p className="mt-2 workspace-meta text-workspace-muted-text">
                    {entry.reason}
                  </p>
                </li>
              ))}
            </ol>
          </TabsContent>
        </Tabs>
      </div>

      <ReadinessSourceViewer
        contribution={sourceContribution}
        open={Boolean(sourceContribution)}
        onOpenChange={(open) => {
          if (!open) setSourceContribution(undefined);
        }}
        onMarkInaccurate={(contributionId) => {
          setDisputeTarget(
            criteria
              .flatMap((criterion) => criterion.contributions)
              .find((item) => item.id === contributionId),
          );
        }}
        onConfirm={(contributionId) => {
          onConfirmContribution(contributionId);
          setSourceContribution(undefined);
        }}
      />

      <AlertDialog
        open={Boolean(disputeTarget)}
        onOpenChange={(open) => {
          if (!open) setDisputeTarget(undefined);
        }}
      >
        <AlertDialogContent className="border-workspace-border bg-workspace-panel">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Loại đóng góp này khỏi readiness?
            </AlertDialogTitle>
            <AlertDialogDescription>
              “{disputeTarget?.title}” sẽ chuyển sang trạng thái đang
              tranh luận, bị loại khỏi điểm canonical và được ghi vào
              lịch sử. Nguồn gốc không bị xóa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Giữ nguyên</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (disputeTarget) {
                  onDisputeContribution(disputeTarget.id);
                }
                setDisputeTarget(undefined);
                setSourceContribution(undefined);
              }}
            >
              Đánh dấu AI hiểu sai
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
}
