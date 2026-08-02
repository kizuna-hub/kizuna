"use client";

import React from "react";
import {
  ArrowLeft,
  FileText,
  FolderSearch2,
  Quote,
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
import { readinessSourceDocuments } from "../../readiness/demo/readiness-demo-data";
import { ReadinessSourceViewer } from "../../readiness/components/readiness-source-viewer";
import type {
  ReadinessContribution,
  ReadinessCriterion,
} from "../../readiness/types/readiness.types";
import type { EvidenceView } from "../../types/workspace-layout.types";

type Workspace = ReturnType<typeof useAiWorkspace>;

export function EvidencePane({
  workspace,
  showClose = true,
}: {
  workspace: Workspace;
  showClose?: boolean;
}) {
  const assessment = workspace.state.readiness.assessment;
  const [sourceContribution, setSourceContribution] =
    React.useState<ReadinessContribution>();
  const selectedDocument =
    readinessSourceDocuments.find(
      (document) =>
        document.id === workspace.layout.selectedDocumentId,
    ) ?? readinessSourceDocuments[0];
  const selectedCriterion = assessment.criteria.find(
    (criterion) =>
      criterion.id === workspace.layout.selectedCriterionId,
  );

  return (
    <aside
      className="flex h-full min-h-0 flex-col bg-workspace-panel"
      aria-label="Bằng chứng CampusFlow"
    >
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-workspace-border px-4">
        <div>
          <h2 className="workspace-section-title text-ink">
            Bằng chứng và nguồn
          </h2>
          <p className="workspace-meta text-workspace-muted-text">
            2 tài liệu canonical của CampusFlow
          </p>
        </div>
        {showClose ? (
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={workspace.closeSecondaryPane}
            aria-label="Đóng bằng chứng"
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </header>

      <div
        className="grid shrink-0 grid-cols-2 gap-1 border-b border-workspace-border p-2"
        aria-label="Chọn tài liệu"
      >
        {readinessSourceDocuments.map((document, index) => {
          const active = selectedDocument?.id === document.id;
          return (
            <Button
              key={document.id}
              type="button"
              size="sm"
              variant={active ? "secondary" : "ghost"}
              aria-pressed={active}
              onClick={() => {
                workspace.setSelectedDocument(document.id);
                workspace.setEvidenceView("by_document");
              }}
              className="min-w-0 justify-start"
            >
              <FileText className="size-3.5 shrink-0" />
              <span className="truncate">
                {index === 0 ? "Pitch Deck" : "Business Plan"}
              </span>
            </Button>
          );
        })}
      </div>

      <Tabs
        value={workspace.layout.evidenceView}
        onValueChange={(value) =>
          workspace.setEvidenceView(value as EvidenceView)
        }
        className="min-h-0 flex-1 gap-0"
      >
        <TabsList className="grid h-11 w-full shrink-0 grid-cols-2 rounded-none border-b border-workspace-border bg-workspace-panel p-0">
          <TabsTrigger value="by_document" className="rounded-none">
            Theo tài liệu
          </TabsTrigger>
          <TabsTrigger value="by_criterion" className="rounded-none">
            Theo tiêu chí
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="by_document"
          className="no-scrollbar m-0 min-h-0 overflow-y-auto p-4"
        >
          {selectedDocument ? (
            <DocumentDetail
              document={selectedDocument}
              assessment={assessment.criteria}
              onOpenSource={setSourceContribution}
              onDispute={workspace.disputeReadinessContribution}
            />
          ) : null}
        </TabsContent>

        <TabsContent
          value="by_criterion"
          className="no-scrollbar m-0 min-h-0 overflow-y-auto p-4"
        >
          {selectedCriterion ? (
            <CriterionEvidence
              criterion={selectedCriterion}
              onBack={() => workspace.setSelectedCriterion()}
              onOpenSource={setSourceContribution}
              onDispute={workspace.disputeReadinessContribution}
            />
          ) : (
            <div className="space-y-2">
              {assessment.criteria.map((criterion) => (
                <button
                  key={criterion.id}
                  type="button"
                  onClick={() =>
                    workspace.setSelectedCriterion(criterion.id)
                  }
                  className="flex w-full items-center gap-3 rounded-xl border border-workspace-border bg-workspace-elevated p-3 text-left hover:border-primary-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/50"
                >
                  <FolderSearch2 className="size-4 shrink-0 text-primary" />
                  <span className="min-w-0 flex-1">
                    <span className="block workspace-card-title text-ink">
                      {criterion.label}
                    </span>
                    <span className="mt-1 block workspace-meta text-workspace-muted-text">
                      {
                        criterion.contributions.filter(
                          (item) => !item.excluded,
                        ).length
                      }{" "}
                      nguồn dùng · {criterion.score}/100
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ReadinessSourceViewer
        contribution={sourceContribution}
        open={Boolean(sourceContribution)}
        onOpenChange={(open) => {
          if (!open) setSourceContribution(undefined);
        }}
        onMarkInaccurate={(contributionId) => {
          workspace.disputeReadinessContribution(
            contributionId,
          );
          setSourceContribution(undefined);
        }}
        onConfirm={(contributionId) => {
          workspace.confirmReadinessContribution(
            contributionId,
          );
          setSourceContribution(undefined);
        }}
      />
    </aside>
  );
}

function DocumentDetail({
  document,
  assessment,
  onOpenSource,
  onDispute,
}: {
  document: (typeof readinessSourceDocuments)[number];
  assessment: ReadinessCriterion[];
  onOpenSource: (contribution: ReadinessContribution) => void;
  onDispute: (contributionId: string) => void;
}) {
  const contributions = assessment
    .flatMap((criterion) => criterion.contributions)
    .filter(
      (contribution) =>
        contribution.source.fileName === document.fileName,
    );
  return (
    <div>
      <h3 className="workspace-section-title text-ink">
        {document.fileName}
      </h3>
      <p className="mt-1 workspace-meta text-workspace-muted-text">
        Chỉ các trang được dùng trong assessment hiện tại.
      </p>
      <div className="mt-4 space-y-3">
        {contributions.map((contribution) => (
          <EvidenceQuote
            key={contribution.id}
            contribution={contribution}
            criterionLabel={
              assessment.find(
                (criterion) =>
                  criterion.id === contribution.criterionId,
              )?.label
            }
            onOpen={() => onOpenSource(contribution)}
            onDispute={() => onDispute(contribution.id)}
          />
        ))}
      </div>
    </div>
  );
}

function CriterionEvidence({
  criterion,
  onBack,
  onOpenSource,
  onDispute,
}: {
  criterion: ReadinessCriterion;
  onBack: () => void;
  onOpenSource: (contribution: ReadinessContribution) => void;
  onDispute: (contributionId: string) => void;
}) {
  return (
    <div>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="-ml-2"
        onClick={onBack}
      >
        <ArrowLeft className="size-4" />
        Tất cả tiêu chí
      </Button>
      <div className="mt-2 flex items-start justify-between gap-3">
        <div>
          <h3 className="workspace-section-title text-ink">
            {criterion.label}
          </h3>
          <p className="mt-1 workspace-meta text-workspace-muted-text">
            Trọng số {criterion.weight}% · {criterion.confidence}
          </p>
        </div>
        <span className="font-tabular text-xl font-semibold text-ink">
          {criterion.score}
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {criterion.contributions.map((contribution) => (
          <EvidenceQuote
            key={contribution.id}
            contribution={contribution}
            criterionLabel={criterion.label}
            onOpen={() => onOpenSource(contribution)}
            onDispute={() => onDispute(contribution.id)}
          />
        ))}
      </div>
    </div>
  );
}

function EvidenceQuote({
  contribution,
  criterionLabel,
  onOpen,
  onDispute,
}: {
  contribution: ReadinessContribution;
  criterionLabel?: string;
  onOpen: () => void;
  onDispute: () => void;
}) {
  const statusLabel = {
    verified: "Đã xác minh",
    inferred: "AI suy luận",
    assumed: "Giả định",
    disputed: "Đang tranh luận",
    outdated: "Đã cũ",
    missing: "Còn thiếu",
    superseded: "Đã thay thế",
  }[contribution.status];

  return (
    <article className="rounded-xl border border-workspace-border bg-workspace-elevated p-3">
      <div className="flex items-start gap-2">
        <Quote className="mt-0.5 size-4 shrink-0 text-primary" />
        <div>
          <h4 className="workspace-card-title text-ink">
            {contribution.title}
          </h4>
          {contribution.source.quote ? (
            <blockquote className="mt-2 workspace-supporting text-ink">
              “{contribution.source.quote}”
            </blockquote>
          ) : null}
          <p className="mt-2 workspace-meta text-workspace-muted-text">
            {contribution.source.fileName}
            {contribution.source.page
              ? ` · Trang ${contribution.source.page}`
              : ""}
            {contribution.source.section
              ? ` · ${contribution.source.section}`
              : ""}
          </p>
          <p className="mt-1 workspace-meta text-workspace-muted-text">
            {criterionLabel ?? contribution.criterionId} ·{" "}
            {contribution.contributionPoints >= 0 ? "+" : ""}
            {contribution.contributionPoints} điểm · {statusLabel}
          </p>
          <p className="mt-2 workspace-meta text-workspace-muted-text">
            {contribution.interpretation}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onOpen}
            >
              Xem trong PDF
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={contribution.status === "disputed"}
              onClick={onDispute}
            >
              AI hiểu sai
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
