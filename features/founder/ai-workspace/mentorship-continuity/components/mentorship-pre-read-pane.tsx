"use client";

import React from "react";
import { CheckCircle2, FileText, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MentorshipPreReadContent } from "@/features/demo-domain/types/mentorship-continuity.types";

import type { useAiWorkspace } from "../../hooks/use-ai-workspace";

type Workspace = ReturnType<typeof useAiWorkspace>;
type EditableKey = Exclude<keyof MentorshipPreReadContent, "evidenceIds">;

const fields: Array<{ key: EditableKey; label: string }> = [
  { key: "previousDecision", label: "Quyết định từ phiên trước" },
  { key: "founderCommitment", label: "Founder đã cam kết" },
  { key: "resultSummary", label: "Kết quả hiện tại" },
  { key: "newInsight", label: "Insight mới" },
  { key: "incompleteSummary", label: "Chưa hoàn thành" },
  { key: "mentorReviewQuestion", label: "Cần Mentor phản biện" },
];

function formatReview(value?: string) {
  if (!value) return "Chưa xác định";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(value));
}

export function MentorshipPreReadPane({ workspace }: { workspace: Workspace }) {
  const preRead = workspace.mentorshipPreRead;
  const checkpoint = workspace.selectedMentorshipCheckpoint;
  const request = workspace.acceptedMentorConnection;
  const source = preRead?.status === "sent" && preRead.sentSnapshot
    ? preRead.sentSnapshot
    : preRead;
  const [draft, setDraft] = React.useState<MentorshipPreReadContent | null>(
    source
      ? {
          previousDecision: source.previousDecision,
          founderCommitment: source.founderCommitment,
          resultSummary: source.resultSummary,
          newInsight: source.newInsight,
          incompleteSummary: source.incompleteSummary,
          mentorReviewQuestion: source.mentorReviewQuestion,
          evidenceIds: [...source.evidenceIds],
        }
      : null,
  );
  const [saving, setSaving] = React.useState(false);
  const sendingRef = React.useRef(false);
  const [error, setError] = React.useState<string>();

  if (!preRead || !checkpoint || !request || !draft) {
    return <div role="alert" className="flex h-full items-center justify-center p-6 workspace-supporting text-workspace-muted-text">Chưa thể chuẩn bị pre-read cho checkpoint này.</div>;
  }

  const sent = preRead.status === "sent";
  const update = (key: EditableKey, value: string) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
    setError(undefined);
  };
  const saveDraft = () => {
    if (sent) return preRead;
    setSaving(true);
    try {
      const saved = workspace.saveMentorshipPreRead({ checkpointId: checkpoint.id, ...draft });
      toast.success("Đã lưu bản nháp pre-read.");
      return saved;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Chưa thể lưu bản nháp.");
      return undefined;
    } finally {
      setSaving(false);
    }
  };
  const send = () => {
    if (sendingRef.current || sent) return;
    if (fields.some(({ key }) => !draft[key].trim())) {
      setError("Vui lòng hoàn thành các nội dung pre-read trước khi gửi.");
      return;
    }
    sendingRef.current = true;
    setSaving(true);
    try {
      const saved = workspace.saveMentorshipPreRead({ checkpointId: checkpoint.id, ...draft });
      workspace.sendMentorshipPreRead(saved.id);
      toast.success("Đã ghi nhận trạng thái gửi pre-read trong bản demo.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Chưa thể ghi nhận trạng thái gửi pre-read. Bản nháp của bạn vẫn được lưu.");
    } finally {
      sendingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <aside className="flex h-full min-h-0 flex-col bg-workspace-panel">
      <header className="shrink-0 border-b border-workspace-border px-5 py-4 pr-14">
        <div className="flex gap-3"><FileText className="mt-0.5 size-5 text-primary" /><div><h2 className="workspace-section-title text-ink">Pre-read cho buổi review</h2><p className="mt-1 workspace-meta text-workspace-muted-text">CampusFlow · {request.briefSnapshot.mentor.name} · {formatReview(preRead.reviewAt)}</p></div></div>
        <p className="mt-3 workspace-meta text-workspace-muted-text">Tóm tắt ngắn những gì đã thống nhất, kết quả hiện tại và quyết định cần Mentor phản biện.</p>
      </header>
      <div className="no-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
        {sent ? (
          <div role="status" className="flex gap-3 rounded-xl border border-workspace-success/30 bg-workspace-success-soft p-3 workspace-supporting text-ink"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-workspace-success" /><span>Pre-read đã được ghi nhận là đã gửi trong bản demo.</span></div>
        ) : null}
        {fields.map(({ key, label }) => (
          <div key={key} className="space-y-2">
            <Label className="workspace-supporting font-medium text-ink">{label}</Label>
            <Textarea value={draft[key]} readOnly={sent} onChange={(event) => update(key, event.target.value)} maxLength={1_200} rows={key === "resultSummary" ? 4 : 3} className={sent ? "opacity-80" : undefined} />
          </div>
        ))}
        <p className="workspace-meta text-workspace-muted-text">{draft.evidenceIds.length} evidence được đính kèm.</p>
        {error ? <p role="alert" className="workspace-meta text-workspace-danger">{error}</p> : null}
      </div>
      {!sent ? (
        <footer className="flex shrink-0 gap-2 border-t border-workspace-border p-4">
          <Button type="button" variant="outline" className="flex-1" disabled={saving} onClick={saveDraft}>Lưu bản nháp</Button>
          <Button type="button" className="flex-1" disabled={saving} onClick={send}><Send className="size-4" />{saving ? "Đang ghi nhận…" : "Gửi pre-read"}</Button>
        </footer>
      ) : null}
    </aside>
  );
}
