"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Github,
  Loader2,
  LockKeyhole,
  Mail,
  RotateCcw,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Link, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { authCopy, authHighlights, authRoutes, founderProof, trustSignals, type AuthMode } from "./auth-config";

type FormState = "idle" | "loading" | "success";
type FieldErrors = Partial<Record<"email" | "password" | "name" | "confirmPassword" | "otp", string>>;

type AuthPageProps = {
  mode: AuthMode;
};

const DEMO_OTP = "123456";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function withNextIntent(path: string, next?: string | null) {
  if (!next) return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}next=${encodeURIComponent(next)}`;
}

function maskEmail(email: string) {
  const fallback = "founder@company.com";
  const normalized = email || fallback;
  const [name = "founder", domain = "company.com"] = normalized.split("@");
  const visibleName = name.length <= 2 ? `${name[0] ?? "f"}*` : `${name.slice(0, 2)}***`;
  const [domainName = "company", domainSuffix = "com"] = domain.split(".");
  return `${visibleName}@${domainName.slice(0, 2)}***.${domainSuffix}`;
}

function getPasswordScore(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

function getErrorId(name: string) {
  return `${name}-error`;
}

function AuthTextField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  icon: Icon,
  error,
  disabled,
  rightControl,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete?: string;
  icon: React.ElementType;
  error?: string;
  disabled?: boolean;
  rightControl?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-caption font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
        <Input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? getErrorId(id) : undefined}
          className={cn(
            "h-12 rounded-md border-hairline bg-surface-1 pl-10 pr-11 text-body-framer-sm text-ink shadow-framer-edge placeholder:text-ink-muted/70",
            "focus-visible:border-accent-blue focus-visible:ring-accent-blue/20",
            error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
          )}
        />
        {rightControl ? <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightControl}</div> : null}
      </div>
      <p id={getErrorId(id)} role={error ? "alert" : undefined} className="min-h-4 text-micro text-destructive">
        {error ?? ""}
      </p>
    </div>
  );
}

function ProviderButton({
  provider,
  mode,
  onClick,
  disabled,
}: {
  provider: "Google" | "GitHub";
  mode: AuthMode;
  onClick: () => void;
  disabled?: boolean;
}) {
  const Icon = provider === "GitHub" ? Github : Mail;
  const verb = mode === "signup" ? "Continue with" : "Log in with";

  return (
    <Button type="button" variant="secondary" className="w-full" onClick={onClick} disabled={disabled}>
      <Icon className="size-4" />
      {verb} {provider}
    </Button>
  );
}

function AuthShell({ mode, children }: { mode: AuthMode; children: React.ReactNode }) {
  const copy = authCopy[mode];

  return (
    <main className="min-h-screen overflow-x-hidden bg-canvas text-ink">
      <div className="mx-auto grid min-h-screen w-full max-w-[1180px] grid-cols-1 px-5 py-5 lg:grid-cols-[1fr_480px] lg:gap-8 lg:px-8">
        <section className="hidden min-h-[calc(100vh-40px)] flex-col justify-between rounded-xxl border border-hairline bg-surface-1 p-8 shadow-framer-edge lg:flex">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 text-body-framer-sm font-bold text-ink">
              <span className="flex size-9 items-center justify-center rounded-full bg-inverse-canvas text-on-primary">K</span>
              Kizuna
            </Link>

            <div className="mt-16 max-w-xl">
              <p className="text-eyebrow font-semibold uppercase tracking-[0.12em] text-ink-muted">{copy.eyebrow}</p>
              <h1 className="mt-5 max-w-[680px] text-display-lg font-display text-ink">
                Founder work starts before the dashboard.
              </h1>
              <p className="mt-5 max-w-lg text-subhead text-ink-muted">
                A calmer entry point for teams protecting IP, preparing investor material, and moving from signup to workspace without friction.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-xxl spotlight-violet p-7 shadow-framer-edge">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-caption font-bold uppercase tracking-[0.12em] text-ink/70">Workspace readiness</p>
                  <p className="mt-4 max-w-md text-subhead font-medium text-ink">
                    Verify once, then land inside the same founder command center investors will review later.
                  </p>
                </div>
                <ShieldCheck className="size-8 text-ink" />
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {trustSignals.map((item) => (
                  <div key={item.label} className="rounded-xl border border-ink/10 bg-canvas/20 p-3">
                    <item.icon className="size-4 text-ink/80" />
                    <p className="mt-3 font-mono text-xl font-bold text-ink">{item.value}</p>
                    <p className="mt-1 text-micro text-ink/70">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {authHighlights.map((item) => (
                <div key={item.title} className="rounded-xl border border-hairline bg-surface-2 p-4">
                  <item.icon className="size-4 text-ink-muted" />
                  <p className="mt-4 text-body-framer-sm font-bold text-ink">{item.title}</p>
                  <p className="mt-2 text-micro leading-relaxed text-ink-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex min-h-[calc(100vh-40px)] items-center justify-center py-8">
          <div className="w-full max-w-[460px]">
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <Link href="/" className="inline-flex items-center gap-3 text-body-framer-sm font-bold text-ink">
                <span className="flex size-9 items-center justify-center rounded-full bg-inverse-canvas text-on-primary">K</span>
                Kizuna
              </Link>
              <span className="rounded-pill border border-hairline bg-surface-1 px-3 py-2 text-caption text-ink-muted">Founder workspace</span>
            </div>

            <div className="rounded-xxl border border-hairline bg-surface-1 p-5 shadow-framer-edge sm:p-7">
              <div className="mb-7">
                <p className="text-eyebrow font-semibold uppercase tracking-[0.12em] text-ink-muted">{copy.eyebrow}</p>
                <h2 className="mt-3 text-display-md font-display text-ink">{copy.title}</h2>
                <p className="mt-3 text-body-framer text-ink-muted">{copy.subtitle}</p>
              </div>
              {children}
            </div>

            <div className="mt-5 grid gap-2 rounded-xl border border-hairline bg-surface-1 p-4">
              {founderProof.map((item) => (
                <div key={item.label} className="flex items-center gap-3 text-caption text-ink-muted">
                  <CheckCircle2 className={cn("size-4", item.done ? "text-semantic-success" : "text-ink-muted")} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function AuthFooter({ mode }: { mode: AuthMode }) {
  const copy = authCopy[mode];

  return (
    <div className="mt-6 border-t border-hairline pt-5 text-center">
      <p className="text-caption text-ink-muted">
        {copy.footerText}{" "}
        <Link href={copy.footerHref} className="font-bold text-accent-blue hover:underline">
          {copy.footerCta}
        </Link>
      </p>
      <p className="mx-auto mt-4 max-w-sm text-micro leading-relaxed text-ink-muted">
        By continuing, you agree to Kizuna Terms and Privacy. This demo stores no credentials.
      </p>
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextIntent = searchParams.get("next");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  const [status, setStatus] = React.useState<FormState>("idle");
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [banner, setBanner] = React.useState<string | null>(null);

  const validate = () => {
    const nextErrors: FieldErrors = {};
    if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = "Enter a valid work email.";
    if (!password) nextErrors.password = "Enter your password.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBanner(null);
    if (!validate()) return;

    setStatus("loading");
    await wait(650);

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail.includes("unverified")) {
      router.push(
        withNextIntent(
          `${authRoutes.verify}?email=${encodeURIComponent(normalizedEmail)}&intent=login`,
          nextIntent,
        ),
      );
      return;
    }

    if (password.toLowerCase() === "wrongpass" || normalizedEmail.includes("wrong")) {
      setStatus("idle");
      setErrors({ password: "Email or password is incorrect." });
      return;
    }

    setStatus("success");
    setBanner("Authenticated. Redirecting to Founder Workspace...");
    await wait(500);
    router.push(
      withNextIntent(authRoutes.founderWorkspace, nextIntent),
    );
  };

  const handleProvider = async (provider: "Google" | "GitHub") => {
    setStatus("loading");
    setBanner(`${provider} authentication approved. Redirecting...`);
    await wait(600);
    router.push(
      withNextIntent(authRoutes.founderWorkspace, nextIntent),
    );
  };

  return (
    <>
      <div className="grid gap-3">
        <ProviderButton provider="Google" mode="login" onClick={() => handleProvider("Google")} disabled={status === "loading"} />
        <ProviderButton provider="GitHub" mode="login" onClick={() => handleProvider("GitHub")} disabled={status === "loading"} />
      </div>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-hairline" />
        <span className="text-micro text-ink-muted">or use email</span>
        <div className="h-px flex-1 bg-hairline" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-1">
        <AuthTextField
          id="email"
          label="Work email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="founder@company.com"
          autoComplete="email"
          icon={Mail}
          error={errors.email}
          disabled={status === "loading"}
        />
        <AuthTextField
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
          autoComplete="current-password"
          icon={LockKeyhole}
          error={errors.password}
          disabled={status === "loading"}
          rightControl={
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="flex size-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/30"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          }
        />

        <div className="flex items-center justify-between pb-4 pt-1">
          <label className="flex cursor-pointer items-center gap-2 text-caption text-ink-muted">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="size-4 rounded border-hairline bg-surface-1 accent-inverse-canvas"
            />
            Remember this device
          </label>
          <Link href={authRoutes.forgot} className="text-caption font-bold text-accent-blue hover:underline">
            Forgot password?
          </Link>
        </div>

        {banner ? (
          <div role="status" className="mb-4 rounded-xl border border-hairline bg-surface-2 p-3 text-caption text-ink">
            {banner}
          </div>
        ) : null}

        <Button type="submit" className="w-full" disabled={status === "loading" || status === "success"}>
          {status === "loading" ? <Loader2 className="size-4 animate-spin" /> : null}
          {status === "success" ? "Redirecting" : authCopy.login.action}
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <AuthFooter mode="login" />
    </>
  );
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextIntent = searchParams.get("next");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [status, setStatus] = React.useState<FormState>("idle");
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [banner, setBanner] = React.useState<string | null>(null);
  const score = getPasswordScore(password);

  const validate = () => {
    const nextErrors: FieldErrors = {};
    if (name.length > 80) nextErrors.name = "Use 80 characters or fewer.";
    if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = "Enter a valid work email.";
    if (password.length < 8) nextErrors.password = "Use at least 8 characters.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBanner(null);
    if (!validate()) return;

    setStatus("loading");
    setBanner("Creating workspace access...");
    await wait(750);
    setStatus("success");
    router.push(
      withNextIntent(
        `${authRoutes.verify}?email=${encodeURIComponent(email.trim().toLowerCase())}&intent=signup`,
        nextIntent,
      ),
    );
  };

  const handleProvider = async (provider: "Google" | "GitHub") => {
    setStatus("loading");
    setBanner(`${provider} account connected. Email verification is next.`);
    await wait(600);
    router.push(
      withNextIntent(
        `${authRoutes.verify}?email=${encodeURIComponent(`founder.${provider.toLowerCase()}@company.com`)}&intent=signup`,
        nextIntent,
      ),
    );
  };

  return (
    <>
      <div className="grid gap-3">
        <ProviderButton provider="Google" mode="signup" onClick={() => handleProvider("Google")} disabled={status === "loading"} />
        <ProviderButton provider="GitHub" mode="signup" onClick={() => handleProvider("GitHub")} disabled={status === "loading"} />
      </div>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-hairline" />
        <span className="text-micro text-ink-muted">or create with email</span>
        <div className="h-px flex-1 bg-hairline" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-1">
        <AuthTextField
          id="name"
          label="Name optional"
          value={name}
          onChange={setName}
          placeholder="Your name"
          autoComplete="name"
          icon={UserRound}
          error={errors.name}
          disabled={status === "loading"}
        />
        <AuthTextField
          id="email"
          label="Work email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="founder@company.com"
          autoComplete="email"
          icon={Mail}
          error={errors.email}
          disabled={status === "loading"}
        />
        <AuthTextField
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={setPassword}
          placeholder="Create a password"
          autoComplete="new-password"
          icon={LockKeyhole}
          error={errors.password}
          disabled={status === "loading"}
          rightControl={
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="flex size-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/30"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          }
        />

        <div className="pb-4">
          <div className="flex gap-1.5" aria-hidden="true">
            {[0, 1, 2, 3].map((index) => (
              <span
                key={index}
                className={cn("h-1.5 flex-1 rounded-full bg-surface-2", score > index && "bg-inverse-canvas")}
              />
            ))}
          </div>
          <p className="mt-2 text-micro text-ink-muted">Use 8+ characters. Mixed case, numbers, or symbols make it stronger.</p>
        </div>

        {banner ? (
          <div role="status" className="mb-4 rounded-xl border border-hairline bg-surface-2 p-3 text-caption text-ink">
            {banner}
          </div>
        ) : null}

        <Button type="submit" className="w-full" disabled={status === "loading" || status === "success"}>
          {status === "loading" ? <Loader2 className="size-4 animate-spin" /> : null}
          {authCopy.signup.action}
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <AuthFooter mode="signup" />
    </>
  );
}

function VerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";
  const nextIntent = searchParams.get("next");
  const [email, setEmail] = React.useState(initialEmail);
  const [draftEmail, setDraftEmail] = React.useState(initialEmail);
  const [isChangingEmail, setIsChangingEmail] = React.useState(false);
  const [digits, setDigits] = React.useState<string[]>(Array(6).fill(""));
  const [status, setStatus] = React.useState<FormState>("idle");
  const [error, setError] = React.useState("");
  const [attempts, setAttempts] = React.useState(0);
  const [resendIn, setResendIn] = React.useState(24);
  const [expiresIn, setExpiresIn] = React.useState(180);
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);
  const code = digits.join("");
  const locked = attempts >= 3;

  React.useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  React.useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setTimeout(() => setResendIn((value) => Math.max(value - 1, 0)), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  React.useEffect(() => {
    if (expiresIn <= 0 || status === "success") return;
    const timer = window.setTimeout(() => setExpiresIn((value) => Math.max(value - 1, 0)), 1000);
    return () => window.clearTimeout(timer);
  }, [expiresIn, status]);

  const setDigitAt = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((current) => current.map((item, itemIndex) => itemIndex === index ? digit : item));
    setError("");
    if (digit && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length < 2) return;
    event.preventDefault();
    setDigits(Array.from({ length: 6 }, (_, index) => pasted[index] ?? ""));
    setError("");
    inputsRef.current[Math.min(pasted.length, 6) - 1]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (locked) {
      setError("Too many attempts. Request a new code to continue.");
      return;
    }
    if (expiresIn <= 0) {
      setError("This code has expired. Request a new code.");
      return;
    }
    if (code.length !== 6) {
      setError("Enter all 6 digits from your email.");
      return;
    }

    setStatus("loading");
    await wait(650);
    if (code !== DEMO_OTP) {
      setAttempts((value) => value + 1);
      setStatus("idle");
      setError(attempts + 1 >= 3 ? "Too many attempts. Request a new code to continue." : "Invalid or expired code.");
      return;
    }

    setStatus("success");
    setError("");
    await wait(700);
    router.push(
      withNextIntent(authRoutes.founderWorkspace, nextIntent),
    );
  };

  const handleResend = () => {
    if (resendIn > 0) return;
    setDigits(Array(6).fill(""));
    setAttempts(0);
    setError("A new demo code was sent. Use 123456 for this mock flow.");
    setResendIn(30);
    setExpiresIn(180);
    inputsRef.current[0]?.focus();
  };

  const handleChangeEmail = () => {
    if (!EMAIL_PATTERN.test(draftEmail.trim())) {
      setError("Enter a valid email before requesting a new code.");
      return;
    }
    setEmail(draftEmail.trim().toLowerCase());
    setDigits(Array(6).fill(""));
    setAttempts(0);
    setResendIn(30);
    setExpiresIn(180);
    setError("Email updated. A new demo code was sent.");
    setIsChangingEmail(false);
    inputsRef.current[0]?.focus();
  };

  return (
    <>
      <div className="mb-5 rounded-xl border border-hairline bg-surface-2 p-4">
        <p className="text-caption font-bold text-ink">Code sent to {maskEmail(email)}</p>
        <p className="mt-1 text-micro text-ink-muted">Demo code: use 123456. Expires in {Math.floor(expiresIn / 60)}:{String(expiresIn % 60).padStart(2, "0")}.</p>
      </div>

      {isChangingEmail ? (
        <div className="mb-5 rounded-xl border border-hairline bg-surface-2 p-4">
          <AuthTextField
            id="change-email"
            label="New email"
            type="email"
            value={draftEmail}
            onChange={setDraftEmail}
            placeholder="founder@company.com"
            autoComplete="email"
            icon={Mail}
          />
          <div className="flex gap-2">
            <Button type="button" className="flex-1" onClick={handleChangeEmail}>
              Send new code
            </Button>
            <Button type="button" variant="secondary" onClick={() => setIsChangingEmail(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      <form onSubmit={handleVerify} noValidate>
        <fieldset disabled={status === "loading" || status === "success"} className="space-y-5">
          <legend className="sr-only">Email verification code</legend>
          <div className="grid grid-cols-6 gap-2 sm:gap-3">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(node) => {
                  inputsRef.current[index] = node;
                }}
                aria-label={`Digit ${index + 1}`}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(event) => setDigitAt(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                onPaste={handlePaste}
                className={cn(
                  "h-12 rounded-md border border-hairline bg-surface-1 text-center font-mono text-xl font-bold text-ink shadow-framer-edge outline-none transition-all",
                  "focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20",
                  error && "border-destructive",
                )}
              />
            ))}
          </div>
          <p id={getErrorId("otp")} role={error ? "alert" : undefined} className="min-h-5 text-caption text-destructive">
            {error}
          </p>
          <Button type="submit" className="w-full" disabled={status === "loading" || status === "success" || locked}>
            {status === "loading" ? <Loader2 className="size-4 animate-spin" /> : null}
            {status === "success" ? "Verified. Redirecting" : authCopy.verify.action}
            <ArrowRight className="size-4" />
          </Button>
        </fieldset>
      </form>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="secondary" onClick={handleResend} disabled={resendIn > 0}>
          <RotateCcw className="size-4" />
          {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
        </Button>
        <button
          type="button"
          onClick={() => {
            setDraftEmail(email);
            setIsChangingEmail(true);
          }}
          className="text-caption font-bold text-accent-blue hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/30"
        >
          Change email
        </button>
      </div>

      <AuthFooter mode="verify" />
    </>
  );
}

function ForgotPasswordForm() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<FormState>("idle");
  const [error, setError] = React.useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Enter a valid email.");
      return;
    }
    setStatus("loading");
    await wait(650);
    setStatus("success");
  };

  if (status === "success") {
    return (
      <>
        <div role="status" className="rounded-xl border border-hairline bg-surface-2 p-5">
          <CheckCircle2 className="size-5 text-semantic-success" />
          <h3 className="mt-4 text-headline text-ink">Check your inbox</h3>
          <p className="mt-2 text-body-framer-sm text-ink-muted">
            If an account exists for {maskEmail(email)}, a reset link has been sent. For this demo, continue directly to reset.
          </p>
        </div>
        <Button asChild className="mt-5 w-full">
          <Link href={`${authRoutes.reset}?email=${encodeURIComponent(email.trim().toLowerCase())}`}>
            Open demo reset link
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <AuthFooter mode="forgot" />
      </>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="space-y-1">
        <AuthTextField
          id="email"
          label="Account email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="founder@company.com"
          autoComplete="email"
          icon={Mail}
          error={error}
          disabled={status === "loading"}
        />
        <Button type="submit" className="mt-3 w-full" disabled={status === "loading"}>
          {status === "loading" ? <Loader2 className="size-4 animate-spin" /> : null}
          {authCopy.forgot.action}
          <ArrowRight className="size-4" />
        </Button>
      </form>
      <AuthFooter mode="forgot" />
    </>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "founder@company.com";
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [status, setStatus] = React.useState<FormState>("idle");
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const score = getPasswordScore(password);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: FieldErrors = {};
    if (password.length < 8) nextErrors.password = "Use at least 8 characters.";
    if (password !== confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("loading");
    await wait(700);
    setStatus("success");
    await wait(800);
    router.push(`${authRoutes.login}?email=${encodeURIComponent(email)}`);
  };

  return (
    <>
      <div className="mb-5 rounded-xl border border-hairline bg-surface-2 p-4 text-caption text-ink-muted">
        Resetting password for {maskEmail(email)}.
      </div>
      <form onSubmit={handleSubmit} noValidate className="space-y-1">
        <AuthTextField
          id="password"
          label="New password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={setPassword}
          placeholder="Create a new password"
          autoComplete="new-password"
          icon={LockKeyhole}
          error={errors.password}
          disabled={status === "loading" || status === "success"}
          rightControl={
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="flex size-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/30"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          }
        />
        <AuthTextField
          id="confirmPassword"
          label="Confirm password"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Repeat the new password"
          autoComplete="new-password"
          icon={LockKeyhole}
          error={errors.confirmPassword}
          disabled={status === "loading" || status === "success"}
        />
        <div className="pb-4">
          <div className="flex gap-1.5" aria-hidden="true">
            {[0, 1, 2, 3].map((index) => (
              <span key={index} className={cn("h-1.5 flex-1 rounded-full bg-surface-2", score > index && "bg-inverse-canvas")} />
            ))}
          </div>
        </div>
        {status === "success" ? (
          <div role="status" className="mb-4 rounded-xl border border-hairline bg-surface-2 p-3 text-caption text-ink">
            Password updated. Redirecting to login...
          </div>
        ) : null}
        <Button type="submit" className="w-full" disabled={status === "loading" || status === "success"}>
          {status === "loading" ? <Loader2 className="size-4 animate-spin" /> : null}
          {authCopy.reset.action}
          <ArrowRight className="size-4" />
        </Button>
      </form>
      <AuthFooter mode="reset" />
    </>
  );
}

export function AuthPage({ mode }: AuthPageProps) {
  return (
    <AuthShell mode={mode}>
      {mode === "login" ? <LoginForm /> : null}
      {mode === "signup" ? <SignupForm /> : null}
      {mode === "verify" ? <VerificationForm /> : null}
      {mode === "forgot" ? <ForgotPasswordForm /> : null}
      {mode === "reset" ? <ResetPasswordForm /> : null}
    </AuthShell>
  );
}
