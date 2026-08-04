"use client";

import {
  BrainCircuit,
  CheckCircle2,
  CircleHelp,
  ClipboardList,
  ExternalLink,
  Files,
  GitCompareArrows,
  Globe2,
  ListChecks,
  UserRound,
} from "lucide-react";

import type { useAiWorkspace } from "../../hooks/use-ai-workspace";
import {
  mentorSourceProvenanceLabels,
  type MentorConversationSource,
} from "../types/conversation-session.types";

type Workspace = ReturnType<typeof useAiWorkspace>;

const provenanceIcons = {
  kizuna_verified: CheckCircle2,
  public_source: Globe2,
  mentor_self_declared: UserRound,
  kizuna_inference: BrainCircuit,
} as const;

function PanelFrame({
  eyebrow,
  title,
  description,
  icon: Icon,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: typeof ClipboardList;
  children: React.ReactNode;
}) {
  return (
    <aside className="no-scrollbar h-full overflow-y-auto px-5 pb-6 pt-12">
      <div className="flex items-start gap-3 border-b border-workspace-border pb-4">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-workspace-border bg-workspace-elevated text-primary">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="workspace-eyebrow text-primary">{eyebrow}</p>
          <h2 className="mt-1 workspace-section-title text-ink">
            {title}
          </h2>
          <p className="mt-1 workspace-supporting text-workspace-muted-text">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </aside>
  );
}

function SourceRow({ source }: { source?: MentorConversationSource }) {
  if (!source) {
    return (
      <div className="rounded-xl border border-workspace-border bg-workspace-elevated p-3">
        <p className="flex items-center gap-2 workspace-supporting font-medium text-ink">
          <CircleHelp className="size-4 text-workspace-warning" />
          Nguồn này chưa còn khả dụng.
        </p>
      </div>
    );
  }
  const Icon = provenanceIcons[source.provenance];
  return (
    <div className="rounded-xl border border-workspace-border bg-workspace-elevated p-3">
      <div className="flex items-start gap-2.5">
        <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="workspace-supporting font-medium text-ink">
            {source.title}
          </p>
          <p className="mt-0.5 workspace-meta text-primary">
            {mentorSourceProvenanceLabels[source.provenance]}
          </p>
          <p className="mt-1 workspace-meta text-workspace-muted-text">
            {source.description}
          </p>
          {source.href ? (
            <a
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 workspace-meta font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/50"
            >
              Mở nguồn
              <ExternalLink className="size-3" />
            </a>
          ) : source.provenance === "public_source" ? (
            <p className="mt-2 workspace-meta text-workspace-muted-text">
              Nguồn công khai chưa được cấu hình trong bản demo.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MentorSourcesPanel({ workspace }: { workspace: Workspace }) {
  const session = workspace.activeHistorySession;
  const sources = (session?.sourceIds ?? []).map((sourceId) =>
    workspace.longRun.conversationSources.find(
      (source) => source.id === sourceId,
    ),
  );
  return (
    <PanelFrame
      eyebrow="Nguồn mentor"
      title="Hồ sơ và provenance"
      description="Phân biệt dữ liệu đã xác minh, mentor tự khai báo và phân tích của Kizuna."
      icon={Files}
    >
      {sources.map((source, index) => (
        <SourceRow key={source?.id ?? `missing-${index}`} source={source} />
      ))}
    </PanelFrame>
  );
}

function MentorComparisonPanel() {
  return (
    <PanelFrame
      eyebrow="So sánh theo outcome"
      title="Anh Quân và chị Hà"
      description="Mỗi mentor phù hợp với một loại quyết định khác nhau."
      icon={GitCompareArrows}
    >
      <section className="rounded-xl border border-workspace-border bg-workspace-elevated p-3.5">
        <h3 className="workspace-card-title text-ink">Trần Minh Quân</h3>
        <p className="mt-1 workspace-supporting text-workspace-muted-text">
          Thiết kế pilot, chốt phạm vi, success metric và evidence.
        </p>
        <p className="mt-3 workspace-meta font-medium text-primary">
          Outcome · Kế hoạch pilot 14 ngày đủ rõ để bắt đầu
        </p>
      </section>
      <section className="rounded-xl border border-workspace-border bg-workspace-elevated p-3.5">
        <h3 className="workspace-card-title text-ink">Phạm Thu Hà</h3>
        <p className="mt-1 workspace-supporting text-workspace-muted-text">
          Làm rõ user segment, đào sâu prototype feedback và customer discovery.
        </p>
        <p className="mt-3 workspace-meta font-medium text-primary">
          Outcome · User segment ưu tiên và kế hoạch validation
        </p>
      </section>
      <p className="rounded-xl border border-primary-border bg-primary-soft p-3 workspace-supporting text-ink">
        Với blocker hiện tại, Kizuna đề xuất bắt đầu với anh Quân. Đây là
        phân tích theo context, không phải xếp hạng chất lượng mentor.
      </p>
    </PanelFrame>
  );
}

const preparationItems = [
  "Venture Brief hiện tại",
  "Pitch Deck · Trang 6–11",
  "Prototype core flow",
  "Tổng hợp 12 interview và 5 prototype testers",
  "Danh sách hai câu lạc bộ quan tâm",
];

function SessionPreparationPanel() {
  return (
    <PanelFrame
      eyebrow="Chuẩn bị phiên"
      title="Pilot 14 ngày"
      description="Giữ phiên làm việc tập trung vào một outcome có thể bắt đầu ngay."
      icon={ClipboardList}
    >
      <section className="rounded-xl border border-workspace-border bg-workspace-elevated p-3.5">
        <h3 className="workspace-card-title text-ink">Tài liệu cần mang theo</h3>
        <ul className="mt-2 space-y-2">
          {preparationItems.map((item) => (
            <li key={item} className="flex gap-2 workspace-supporting text-workspace-muted-text">
              <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-xl border border-workspace-border bg-workspace-elevated p-3.5">
        <h3 className="workspace-card-title text-ink">Agenda 45 phút</h3>
        <p className="mt-2 whitespace-pre-line workspace-supporting text-workspace-muted-text">
          {"0–5 · Mục tiêu phiên\n5–12 · Context và tín hiệu\n12–25 · Phạm vi pilot\n25–35 · Metric và evidence\n35–42 · Owner và rủi ro\n42–45 · Quyết định tiếp theo"}
        </p>
      </section>
      <p className="rounded-xl border border-primary-border bg-primary-soft p-3 workspace-supporting text-ink">
        Outcome: một câu lạc bộ ưu tiên, phạm vi 14 ngày, một metric chính,
        danh sách evidence và một owner.
      </p>
    </PanelFrame>
  );
}

const questionGroups = [
  ["Phạm vi pilot", "Pilot nhỏ nhất đủ kiểm chứng giá trị là gì?", "Nhóm người dùng nào cần tham gia trực tiếp?"],
  ["Success metric", "Metric nào cho thấy onboarding được cải thiện?", "Vanity metric nào team nên tránh?"],
  ["Evidence", "Evidence nào cần lưu trong suốt pilot?", "Cần bao nhiêu người dùng cho quyết định ban đầu?"],
  ["Thực thi", "Ai nên là owner của pilot?", "Nếu kết quả không tốt, team nên quay lại phần nào?"],
] as const;

function MentorQuestionsPanel() {
  return (
    <PanelFrame
      eyebrow="Checklist phiên"
      title="Câu hỏi cho mentor"
      description="Các câu hỏi được nhóm theo quyết định cần tạo ra."
      icon={ListChecks}
    >
      {questionGroups.map(([title, ...questions]) => (
        <section key={title} className="rounded-xl border border-workspace-border bg-workspace-elevated p-3.5">
          <h3 className="workspace-card-title text-ink">{title}</h3>
          <ul className="mt-2 space-y-2">
            {questions.map((question) => (
              <li key={question} className="flex gap-2 workspace-supporting text-workspace-muted-text">
                <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                {question}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </PanelFrame>
  );
}

export function ConversationHistoryContextPanel({
  workspace,
}: {
  workspace: Workspace;
}) {
  switch (workspace.layout.secondaryPaneMode) {
    case "mentor_sources":
      return <MentorSourcesPanel workspace={workspace} />;
    case "mentor_comparison":
      return <MentorComparisonPanel />;
    case "session_preparation":
      return <SessionPreparationPanel />;
    case "mentor_questions":
      return <MentorQuestionsPanel />;
    default:
      return null;
  }
}
