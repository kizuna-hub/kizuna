"use client";

import { CircleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function UniversityAdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <CircleAlert className="size-9 text-[var(--admin-red)]" />
      <h1 className="mt-3 text-lg font-semibold">
        Không thể tải dữ liệu quản trị
      </h1>
      <p className="mt-1 text-sm text-[var(--admin-muted)]">
        Đã có lỗi khi đọc dữ liệu chương trình. Bạn có thể thử lại.
      </p>
      <Button
        type="button"
        onClick={reset}
        className="mt-4 bg-[var(--admin-primary)] text-white"
      >
        Thử lại
      </Button>
    </div>
  );
}
