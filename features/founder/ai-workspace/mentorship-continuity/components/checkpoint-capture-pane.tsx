"use client";

import React from "react";
import { ClipboardPenLine, Info } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { useAiWorkspace } from "../../hooks/use-ai-workspace";

type Workspace = ReturnType<typeof useAiWorkspace>;

const initialValues = {
  decision:
    "Chưa phát triển thêm dashboard cho trường đại học trước khi có đủ insight về buying process, người vận hành, người ảnh hưởng và bên phê duyệt ngân sách.",
  founderCommitment:
    "Phỏng vấn đại diện tại ba trường đại học, mỗi trường gồm một người vận hành và một người có ảnh hưởng tới quyết định.",
  nextReviewQuestion:
    "Stakeholder map và decision flow đã mô tả đúng buying process chưa, và còn bỏ sót bên liên quan nào?",
};

export function CheckpointCapturePane({ workspace }: { workspace: Workspace }) {
  const [values, setValues] = React.useState({
    ...initialValues,
    nextReviewAt: "2026-08-18T14:00",
    privateFounderNote: "",
    expectedEvidenceReferences: "",
  });
  const [error, setError] = React.useState<string>();
  const [saving, setSaving] = React.useState(false);
  const savingRef = React.useRef(false);
  const idempotencyKey = React.useRef(
    `checkpoint-${Date.now().toString(36)}`,
  );

  const update = (field: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setError(undefined);
  };

  const save = () => {
    if (savingRef.current) return;
    const required = [
      values.decision,
      values.founderCommitment,
      values.nextReviewQuestion,
    ].map((value) => value.trim());
    if (required.some((value) => !value)) {
      setError("Vui lòng hoàn thành ba nội dung chính.");
      return;
    }
    if (required.some((value) => value.length > 800)) {
      setError("Mỗi nội dung chính tối đa 800 ký tự.");
      return;
    }
    if (
      values.nextReviewAt &&
      Number.isNaN(new Date(values.nextReviewAt).getTime())
    ) {
      setError("Thời gian review tiếp theo chưa hợp lệ.");
      return;
    }
    savingRef.current = true;
    setSaving(true);
    try {
      workspace.createMentorshipCheckpoint({
        ventureId: workspace.mentorshipJourney?.ventureId ?? "venture-campusflow",
        decision: required[0],
        founderCommitment: required[1],
        nextReviewQuestion: required[2],
        nextReviewAt: values.nextReviewAt
          ? new Date(values.nextReviewAt).toISOString()
          : undefined,
        privateFounderNote: values.privateFounderNote,
        expectedEvidenceReferences: values.expectedEvidenceReferences,
        idempotencyKey: idempotencyKey.current,
      });
      toast.success("Đã lưu checkpoint.");
      workspace.closeSecondaryPane();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Chưa thể lưu checkpoint. Nội dung bạn đã nhập vẫn được giữ lại.",
      );
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <aside className="flex h-full min-h-0 flex-col bg-workspace-panel">
      <header className="shrink-0 border-b border-workspace-border px-5 py-4 pr-14">
        <div className="flex gap-3">
          <ClipboardPenLine className="mt-0.5 size-5 text-primary" />
          <div>
            <h2 className="workspace-section-title text-ink">Ghi nhận buổi gặp</h2>
            <p className="mt-1 workspace-meta text-workspace-muted-text">
              Mất khoảng một phút để ghi nhận. Nội dung này giúp lần review tiếp theo không phải bắt đầu lại từ đầu.
            </p>
          </div>
        </div>
      </header>
      <div className="no-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
        <Field label="Quyết định quan trọng nhất">
          <Textarea value={values.decision} onChange={(event) => update("decision", event.target.value)} maxLength={800} rows={4} placeholder="Hai bên đã thống nhất điều gì?" />
        </Field>
        <Field label="Nhóm sẽ làm gì trước lần gặp tiếp theo?">
          <Textarea value={values.founderCommitment} onChange={(event) => update("founderCommitment", event.target.value)} maxLength={800} rows={4} placeholder="Nhập cam kết chính của nhóm..." />
        </Field>
        <Field label="Buổi sau cần Mentor phản biện điều gì?">
          <Textarea value={values.nextReviewQuestion} onChange={(event) => update("nextReviewQuestion", event.target.value)} maxLength={800} rows={4} placeholder="Nhập quyết định hoặc giả định cần Mentor phản biện..." />
        </Field>
        <Field label="Review tiếp theo (không bắt buộc)">
          <Input type="datetime-local" value={values.nextReviewAt} onChange={(event) => update("nextReviewAt", event.target.value)} />
        </Field>
        <Field label="Ghi chú riêng của Founder (không bắt buộc)">
          <Textarea value={values.privateFounderNote} onChange={(event) => update("privateFounderNote", event.target.value)} maxLength={500} rows={3} />
        </Field>
        <Field label="Bằng chứng dự kiến (không bắt buộc)">
          <Textarea value={values.expectedEvidenceReferences} onChange={(event) => update("expectedEvidenceReferences", event.target.value)} maxLength={500} rows={3} />
        </Field>
        <div className="flex gap-2 rounded-xl border border-workspace-border bg-workspace-elevated p-3 workspace-meta text-workspace-muted-text">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>Nguồn ghi nhận: <strong className="font-medium text-ink">Founder ghi nhận</strong>. Kizuna chỉ hỗ trợ chuẩn hóa nội dung.</span>
        </div>
        {error ? <p role="alert" className="workspace-meta text-workspace-danger">{error}</p> : null}
      </div>
      <footer className="shrink-0 border-t border-workspace-border p-4">
        <Button type="button" className="w-full" disabled={saving} onClick={save}>
          {saving ? "Đang lưu…" : "Lưu checkpoint"}
        </Button>
      </footer>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label className="workspace-supporting font-medium text-ink">{label}</Label>{children}</div>;
}
