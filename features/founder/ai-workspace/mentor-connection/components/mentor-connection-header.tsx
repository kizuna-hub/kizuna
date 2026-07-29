import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

export function MentorConnectionHeader({
  showClose,
  onClose,
}: {
  showClose: boolean;
  onClose: () => void;
}) {
  return (
    <header className="flex shrink-0 items-start justify-between gap-3 border-b border-workspace-border px-4 py-3">
      <div>
        <p className="workspace-eyebrow text-primary">
          Yêu cầu kết nối mentor
        </p>
        <h1 className="mt-1 workspace-section-title text-ink">
          Connection Brief
        </h1>
        <p className="mt-0.5 workspace-meta text-workspace-muted-text">
          AI đã chuẩn bị · Founder kiểm tra trước khi gửi
        </p>
      </div>
      {showClose ? (
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={onClose}
          aria-label="Đóng Connection Brief"
        >
          <X className="size-4" />
        </Button>
      ) : null}
    </header>
  );
}
