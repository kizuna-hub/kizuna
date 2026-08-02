"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { getRoleLandingPath } from "../services/demo-auth-repository";
import { useDemoAuth } from "../state/demo-auth-provider";
import type { DemoUserRole } from "../types/demo-auth.types";
import { usePathname, useRouter } from "@/i18n/routing";

export function DemoRoleGuard({
  role,
  children,
}: {
  role: DemoUserRole;
  children: React.ReactNode;
}) {
  const { hydrated, session } = useDemoAuth();
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    if (!hydrated) return;
    if (!session) {
      router.replace(
        `/auth/login?next=${encodeURIComponent(pathname)}`,
      );
      return;
    }
    if (session.user.role !== role) {
      router.replace(getRoleLandingPath(session.user.role));
    }
  }, [hydrated, pathname, role, router, session]);

  if (!hydrated || !session || session.user.role !== role) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background text-foreground">
        <div
          role="status"
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Loader2 className="size-4 animate-spin" />
          Đang xác thực phiên demo…
        </div>
      </main>
    );
  }

  return children;
}
