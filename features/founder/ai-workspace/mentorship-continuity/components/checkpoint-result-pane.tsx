"use client";

import React from "react";
import { FilePlus2, FileText, FlaskConical, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type {
  MentorshipCheckpointExecutionStatus,
  MentorshipEvidenceReference,
} from "@/features/demo-domain/types/mentorship-continuity.types";

import type { useAiWorkspace } from "../../hooks/use-ai-workspace";

type Workspace = ReturnType<typeof useAiWorkspace>;
type EvidenceDraft = Omit<
  MentorshipEvidenceReference,
  "checkpointId" | "attachedAt"
>;

const evidenceSeed: EvidenceDraft[] = [
  { id: "evidence-interview-school-a", filename: "Interview notes – Trường A.docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", sizeBytes: 184_320, source: "founder_submitted" },
  { id: "evidence-stakeholder-map", filename: "Stakeholder map v1.1.pdf", mimeType: "application/pdf", sizeBytes: 426_000, source: "founder_submitted" },
  { id: "evidence-followup-school-b", filename: "Email follow-up – Trường B.eml", mimeType: "message/rfc822", sizeBytes: 82_000, source: "founder_submitted" },
];

const options: Array<{ value: MentorshipCheckpointExecutionStatus; label: string }> = [
  { value: "in_progress", label: "Đang thực hiện" },
  { value: "result_ready", label: "Đã có kết quả" },
  { value: "not_completed", label: "Chưa hoàn thành" },
  { value: "commitment_changed", label: "Cam kết đã thay đổi" },
];

export function CheckpointResultPane({ workspace }: { workspace: Workspace }) {
  const checkpoint = workspace.selectedMentorshipCheckpoint;
  const [status, setStatus] = React.useState<MentorshipCheckpointExecutionStatus>(checkpoint?.executionStatus ?? "result_ready");
  const [resultSummary, setResultSummary] = React.useState(checkpoint?.resultSummary ?? "Đã phỏng vấn đại diện tại ba trường đại học và xác định bốn luồng mua phổ biến. Quy trình thường đi qua phòng đào tạo trước khi tới bộ phận tài chính.");
  const [changedAssumption, setChangedAssumption] = React.useState(checkpoint?.changedAssumption ?? "Giả định ban đầu là phòng CNTT sẽ quyết định chính. Kết quả cho thấy phòng đào tạo mới là bên khởi đầu và điều phối nhu cầu.");
  const [blocker, setBlocker] = React.useState(checkpoint?.blockerSummary ?? "Team chưa tiếp cận được người phụ trách tài chính tại hai trường và cần phản biện cách tiếp cận tiếp theo.");
  const [evidence, setEvidence] = React.useState<EvidenceDraft[]>(
    workspace.mentorshipEvidence.length > 0
      ? workspace.mentorshipEvidence.map(({ id, filename, mimeType, sizeBytes, source }) => ({ id, filename, mimeType, sizeBytes, source }))
      : [],
  );
  const [error, setError] = React.useState<string>();
  const [saving, setSaving] = React.useState(false);
  const savingRef = React.useRef(false);

  if (!checkpoint) {
    return <div role="alert" className="flex h-full items-center justify-center p-6 workspace-supporting text-workspace-muted-text">Không tìm thấy checkpoint này.</div>;
  }

  const save = () => {
    if (savingRef.current) return;
    if (!resultSummary.trim() || !changedAssumption.trim()) {
      setError("Vui lòng ghi nhận kết quả chính và giả định đã thay đổi.");
      return;
    }
    savingRef.current = true;
    setSaving(true);
    try {
      workspace.updateMentorshipCheckpointResult({
        checkpointId: checkpoint.id,
        executionStatus: status,
        resultSummary,
        changedAssumption,
        blockerSummary: blocker,
        evidence,
      });
      toast.success("Đã lưu cập nhật checkpoint.");
      workspace.closeSecondaryPane();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Chưa thể lưu cập nhật.");
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <aside className="flex h-full min-h-0 flex-col bg-workspace-panel">
      <header className="shrink-0 border-b border-workspace-border px-5 py-4 pr-14">
        <div className="flex gap-3"><FlaskConical className="mt-0.5 size-5 text-primary" /><div><h2 className="workspace-section-title text-ink">Cập nhật kết quả</h2><p className="mt-1 workspace-meta text-workspace-muted-text">Ghi nhận điều team đã học được từ cam kết gần nhất.</p></div></div>
      </header>
      <div className="no-scrollbar min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
        <div className="space-y-2">
          <Label className="workspace-supporting font-medium text-ink">Trạng thái thực hiện</Label>
          <RadioGroup value={status} onValueChange={(value) => setStatus(value as MentorshipCheckpointExecutionStatus)} className="grid grid-cols-2 gap-2">
            {options.map((option) => <Label key={option.value} className="flex cursor-pointer items-center gap-2 rounded-xl border border-workspace-border bg-workspace-elevated p-3 workspace-meta text-ink"><RadioGroupItem value={option.value} />{option.label}</Label>)}
          </RadioGroup>
        </div>
        <TextField label="Kết quả chính" value={resultSummary} onChange={setResultSummary} />
        <TextField label="Điều gì khác với giả định ban đầu?" value={changedAssumption} onChange={setChangedAssumption} />
        <TextField label="Nếu cần Mentor hỗ trợ thêm" value={blocker} onChange={setBlocker} optional />
        <section aria-labelledby="evidence-heading">
          <div className="flex items-center justify-between gap-3"><div><h3 id="evidence-heading" className="workspace-card-title text-ink">Bằng chứng đính kèm</h3><p className="mt-1 workspace-meta text-workspace-muted-text">PDF, DOCX, XLSX, PNG, JPG, EML. Chỉ lưu metadata bản demo, không tải file lên cloud.</p></div>{evidence.length === 0 ? <Button type="button" variant="outline" size="sm" onClick={() => setEvidence(evidenceSeed)}><FilePlus2 className="size-4" />Đính kèm mẫu</Button> : null}</div>
          {evidence.length > 0 ? <div className="mt-3 space-y-2">{evidence.map((item) => <div key={item.id} className="flex items-center gap-3 rounded-xl border border-workspace-border bg-workspace-elevated p-3"><FileText className="size-4 shrink-0 text-primary" /><div className="min-w-0 flex-1"><p className="truncate workspace-meta font-medium text-ink">{item.filename}</p><p className="workspace-meta text-workspace-muted-text">{Math.round(item.sizeBytes / 1024)} KB · metadata demo</p></div><Button type="button" variant="ghost" size="icon-sm" aria-label={`Gỡ ${item.filename}`} onClick={() => setEvidence((current) => current.filter((entry) => entry.id !== item.id))}><Trash2 className="size-4" /></Button></div>)}</div> : null}
        </section>
        {error ? <p role="alert" className="workspace-meta text-workspace-danger">{error}</p> : null}
      </div>
      <footer className="shrink-0 border-t border-workspace-border p-4"><Button type="button" className="w-full" disabled={saving} onClick={save}>{saving ? "Đang lưu…" : "Lưu cập nhật"}</Button></footer>
    </aside>
  );
}

function TextField({ label, value, onChange, optional = false }: { label: string; value: string; onChange: (value: string) => void; optional?: boolean }) {
  return <div className="space-y-2"><Label className="workspace-supporting font-medium text-ink">{label}{optional ? " (không bắt buộc)" : ""}</Label><Textarea value={value} onChange={(event) => onChange(event.target.value)} maxLength={1_200} rows={4} /></div>;
}
