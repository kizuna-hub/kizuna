"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import {
  DEMO_AUTH_USERS,
  DEMO_PASSWORD,
  DemoAuthError,
  getRoleLandingPath,
} from "../services/demo-auth-repository";
import { useDemoAuth } from "../state/demo-auth-provider";
import type { DemoUserRole } from "../types/demo-auth.types";

type DemoAuthMode = "login" | "signup";

function safeNextPath(next: string | null, role: DemoUserRole) {
  if (!next?.startsWith("/")) return getRoleLandingPath(role);
  if (role === "founder" && next.startsWith("/founder")) {
    return next;
  }
  if (role === "mentor" && next.startsWith("/mentor")) {
    return next;
  }
  return getRoleLandingPath(role);
}

function DemoAccountButton({
  role,
  selected,
  onSelect,
}: {
  role: DemoUserRole;
  selected: boolean;
  onSelect: () => void;
}) {
  const user = DEMO_AUTH_USERS.find(
    (candidate) => candidate.role === role,
  );
  if (!user) return null;
  const Icon =
    role === "founder" ? BriefcaseBusiness : GraduationCap;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex min-h-20 min-w-0 w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        selected
          ? "border-primary bg-primary/10 text-foreground"
          : "border-border bg-card text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-primary">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-foreground">
          {role === "founder" ? "Founder" : "Mentor"}
        </span>
        <span className="mt-1 block truncate text-xs">
          {user.email}
        </span>
      </span>
    </button>
  );
}

export function DemoAuthEntryPage({
  mode,
}: {
  mode: DemoAuthMode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hydrated, session, login, register } = useDemoAuth();
  const [role, setRole] =
    React.useState<DemoUserRole>("founder");
  const activeUser = DEMO_AUTH_USERS.find(
    (candidate) => candidate.role === role,
  )!;
  const [name, setName] = React.useState(activeUser.name);
  const [email, setEmail] = React.useState(activeUser.email);
  const [password, setPassword] = React.useState(DEMO_PASSWORD);
  const [confirmPassword, setConfirmPassword] =
    React.useState(DEMO_PASSWORD);
  const [showPassword, setShowPassword] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!hydrated || !session) return;
    router.replace(getRoleLandingPath(session.user.role));
  }, [hydrated, router, session]);

  const selectRole = (nextRole: DemoUserRole) => {
    const user = DEMO_AUTH_USERS.find(
      (candidate) => candidate.role === nextRole,
    )!;
    setRole(nextRole);
    setName(user.name);
    setEmail(user.email);
    setPassword(DEMO_PASSWORD);
    setConfirmPassword(DEMO_PASSWORD);
    setError(null);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      if (
        mode === "signup" &&
        password !== confirmPassword
      ) {
        throw new DemoAuthError(
          "Mật khẩu xác nhận chưa trùng khớp.",
        );
      }
      await new Promise((resolve) => window.setTimeout(resolve, 320));
      const nextSession =
        mode === "login"
          ? await login({ email, password, role })
          : await register({ name, email, password, role });
      router.replace(
        safeNextPath(
          searchParams.get("next"),
          nextSession.user.role,
        ),
      );
    } catch (nextError) {
      setError(
        nextError instanceof DemoAuthError
          ? nextError.message
          : "Không thể đăng nhập lúc này. Vui lòng thử lại.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="min-h-dvh bg-background px-4 py-8 text-foreground sm:px-6">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-md items-center">
        <section className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <div className="mb-7">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 font-semibold"
            >
              <span className="flex size-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                K
              </span>
              Kizuna Hub
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              {mode === "login" ? "Đăng nhập demo" : "Đăng ký demo"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              {mode === "login"
                ? "Chào mừng bạn quay lại"
                : "Bắt đầu với Kizuna"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Chọn vai trò để điền nhanh tài khoản demo tương ứng.
            </p>
          </div>

          <div className="mb-5 grid min-w-0 grid-cols-2 gap-3">
            <DemoAccountButton
              role="founder"
              selected={role === "founder"}
              onSelect={() => selectRole("founder")}
            />
            <DemoAccountButton
              role="mentor"
              selected={role === "mentor"}
              onSelect={() => selectRole("mentor")}
            />
          </div>

          <form onSubmit={submit} className="space-y-4" noValidate>
            {mode === "signup" ? (
              <label className="block space-y-2 text-sm font-medium">
                Họ và tên
                <span className="relative block">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    className="h-11 pl-10"
                    disabled={pending}
                  />
                </span>
              </label>
            ) : null}

            <label className="block space-y-2 text-sm font-medium">
              Email
              <span className="relative block">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  className="h-11 pl-10"
                  disabled={pending}
                />
              </span>
            </label>

            <label className="block space-y-2 text-sm font-medium">
              Mật khẩu
              <span className="relative block">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete={
                    mode === "login"
                      ? "current-password"
                      : "new-password"
                  }
                  className="h-11 px-10"
                  disabled={pending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  aria-label={
                    showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </span>
            </label>

            {mode === "signup" ? (
              <label className="block space-y-2 text-sm font-medium">
                Xác nhận mật khẩu
                <span className="relative block">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    autoComplete="new-password"
                    className="h-11 pl-10"
                    disabled={pending}
                  />
                </span>
              </label>
            ) : null}

            {error ? (
              <p
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {error}
              </p>
            ) : null}

            <Button className="h-11 w-full" disabled={pending}>
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              {mode === "login" ? "Đăng nhập" : "Tạo tài khoản demo"}
              <ArrowRight className="size-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login"
              ? "Chưa có tài khoản?"
              : "Đã có tài khoản?"}{" "}
            <Link
              href={
                mode === "login" ? "/auth/signup" : "/auth/login"
              }
              className="font-semibold text-primary hover:underline"
            >
              {mode === "login" ? "Đăng ký" : "Đăng nhập"}
            </Link>
          </p>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Dữ liệu demo chỉ được lưu trong trình duyệt này.
          </p>
        </section>
      </div>
    </main>
  );
}
