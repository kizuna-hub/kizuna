import { CheckCircle2, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { MentorConnectionOperationState } from "../types/mentor-connection.types";

export function MentorConnectionFooter({
  operation,
  canSend,
  editing,
  onSave,
  onCancel,
  onSend,
}: {
  operation: MentorConnectionOperationState;
  canSend: boolean;
  editing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onSend: () => void;
}) {
  return (
    <footer className="sticky bottom-0 shrink-0 border-t border-workspace-border bg-workspace-panel p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onSave}
          disabled={operation.saveStatus === "working"}
        >
          {operation.saveStatus === "working" ? (
            <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" />
          ) : null}
          Lưu nháp
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Hủy
        </Button>
        <Button
          type="button"
          className="ml-auto"
          aria-describedby={
            canSend ? undefined : "mentor-connection-validation"
          }
          disabled={
            !canSend ||
            editing ||
            operation.sendStatus === "working"
          }
          onClick={onSend}
        >
          {operation.sendStatus === "working" ? (
            <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" />
          ) : (
            <CheckCircle2 className="size-4" />
          )}
          Gửi yêu cầu kết nối
        </Button>
      </div>
      <div aria-live="polite" className="mt-2 min-h-4">
        {operation.saveStatus === "success" ? (
          <p className="workspace-meta text-workspace-success">
            Đã lưu nháp.
          </p>
        ) : null}
        {operation.saveStatus === "error" ? (
          <p className="workspace-meta text-workspace-danger">
            Chưa thể lưu nháp. Nội dung vẫn được giữ lại.
          </p>
        ) : null}
        {operation.sendStatus === "working" ? (
          <p className="workspace-meta text-workspace-muted-text">
            Đang gửi yêu cầu trong môi trường demo...
          </p>
        ) : null}
      </div>
    </footer>
  );
}
