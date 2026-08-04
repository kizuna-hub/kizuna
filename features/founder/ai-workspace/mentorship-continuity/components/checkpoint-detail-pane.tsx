"use client";

import { CalendarClock, FileText, History, MessageCircleQuestion, Target } from "lucide-react";

import type { useAiWorkspace } from "../../hooks/use-ai-workspace";

type Workspace = ReturnType<typeof useAiWorkspace>;

const sourceLabels = {
  founder_reported: "Founder ghi nhận",
  mentor_confirmed: "Mentor đã xác nhận",
  program_recorded: "Cán bộ chương trình ghi nhận",
} as const;

const statusLabels = {
  recorded: "Đã ghi nhận",
  in_progress: "Đang thực hiện",
  result_ready: "Đã có kết quả",
  not_completed: "Chưa hoàn thành",
  commitment_changed: "Cam kết đã thay đổi",
  pre_read_ready: "Pre-read sẵn sàng",
  pre_read_sent: "Pre-read đã gửi trong demo",
  reviewed: "Đã review",
} as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(value));
}

export function CheckpointDetailPane({ workspace }: { workspace: Workspace }) {
  const checkpoint = workspace.selectedMentorshipCheckpoint;
  const request = workspace.acceptedMentorConnection;
  if (!checkpoint || !request) {
    return <div role="alert" className="flex h-full items-center justify-center p-6 workspace-supporting text-workspace-muted-text">Checkpoint không còn tồn tại. Hãy đóng panel để trở về Đồng hành.</div>;
  }
  return (
    <aside className="flex h-full min-h-0 flex-col bg-workspace-panel">
      <header className="shrink-0 border-b border-workspace-border px-5 py-4 pr-14">
        <div className="flex gap-3"><History className="mt-0.5 size-5 text-primary" /><div><h2 className="workspace-section-title text-ink">{checkpoint.title}</h2><p className="mt-1 workspace-meta text-workspace-muted-text">{formatDate(checkpoint.sessionDate)} · {request.briefSnapshot.mentor.name}</p></div></div>
        <div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-primary-soft px-2 py-1 workspace-meta text-primary">{sourceLabels[checkpoint.source]}</span><span className="rounded-full border border-workspace-border px-2 py-1 workspace-meta text-workspace-muted-text">{statusLabels[checkpoint.status]}</span></div>
      </header>
      <div className="no-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto p-5">
        <Detail icon={Target} label="Quyết định">{checkpoint.decision}</Detail>
        <Detail icon={CalendarClock} label="Cam kết của Founder">{checkpoint.founderCommitment}</Detail>
        <Detail icon={MessageCircleQuestion} label="Cần Mentor phản biện">{checkpoint.nextReviewQuestion}</Detail>
        {checkpoint.resultSummary ? <Detail icon={FileText} label="Kết quả chính">{checkpoint.resultSummary}</Detail> : null}
        {checkpoint.changedAssumption ? <Detail icon={History} label="Giả định đã thay đổi">{checkpoint.changedAssumption}</Detail> : null}
        {checkpoint.blockerSummary ? <Detail icon={MessageCircleQuestion} label="Cần hỗ trợ thêm">{checkpoint.blockerSummary}</Detail> : null}
        <section className="rounded-xl border border-workspace-border bg-workspace-elevated p-4">
          <h3 className="workspace-card-title text-ink">Bằng chứng</h3>
          {workspace.mentorshipEvidence.length > 0 ? <ul className="mt-2 space-y-2">{workspace.mentorshipEvidence.map((item) => <li key={item.id} className="flex items-center gap-2 workspace-meta text-workspace-muted-text"><FileText className="size-4 text-primary" /><span className="truncate">{item.filename}</span></li>)}</ul> : <p className="mt-1 workspace-meta text-workspace-muted-text">Chưa có bằng chứng đính kèm.</p>}
        </section>
        <p className="workspace-meta text-workspace-muted-text">Tạo lúc {formatDate(checkpoint.createdAt)} · cập nhật {formatDate(checkpoint.updatedAt)}</p>
      </div>
    </aside>
  );
}

function Detail({ icon: Icon, label, children }: { icon: typeof Target; label: string; children: string }) {
  return <section className="rounded-xl border border-workspace-border bg-workspace-elevated p-4"><div className="flex items-center gap-2"><Icon className="size-4 text-primary" /><h3 className="workspace-card-title text-ink">{label}</h3></div><p className="mt-2 whitespace-pre-line workspace-supporting text-workspace-muted-text">{children}</p></section>;
}
