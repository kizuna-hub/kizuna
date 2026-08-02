import { Loader2 } from "lucide-react";

export default function UniversityAdminLoading() {
  return (
    <div
      role="status"
      className="flex min-h-[60vh] items-center justify-center gap-2 text-sm text-[var(--admin-muted)]"
    >
      <Loader2 className="size-4 animate-spin" />
      Đang tải dữ liệu chương trình…
    </div>
  );
}
