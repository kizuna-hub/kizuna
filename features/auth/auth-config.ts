import { BarChart3, FileText, LockKeyhole, ShieldCheck, Sparkles, Users } from "lucide-react";

export type AuthMode = "login" | "signup" | "verify" | "forgot" | "reset";

export const authRoutes = {
  login: "/auth/login",
  signup: "/auth/signup",
  verify: "/auth/verify-email",
  forgot: "/auth/forgot-password",
  reset: "/auth/reset-password",
  founderWorkspace: "/founder/founder-workspace/p1",
};

export const authCopy = {
  login: {
    eyebrow: "Founder access",
    title: "Welcome back to Kizuna.",
    subtitle: "Sign in to continue building your pitch, data room, IP ledger, and investor workflow.",
    action: "Log in",
    footerText: "Do not have an account?",
    footerCta: "Create one",
    footerHref: authRoutes.signup,
  },
  signup: {
    eyebrow: "Start your workspace",
    title: "Create your founder account.",
    subtitle: "Keep signup short. Verify the email next, then move straight into the Founder Workspace.",
    action: "Create account",
    footerText: "Already have an account?",
    footerCta: "Log in",
    footerHref: authRoutes.login,
  },
  verify: {
    eyebrow: "Email verification",
    title: "Check your email.",
    subtitle: "Enter the 6-digit code we sent to your inbox. Codes expire quickly and can only be used once.",
    action: "Verify email",
    footerText: "Wrong account?",
    footerCta: "Use a different email",
    footerHref: authRoutes.signup,
  },
  forgot: {
    eyebrow: "Account recovery",
    title: "Reset your password.",
    subtitle: "Enter your account email and we will send a secure reset link if the account exists.",
    action: "Send reset link",
    footerText: "Remembered it?",
    footerCta: "Back to login",
    footerHref: authRoutes.login,
  },
  reset: {
    eyebrow: "New password",
    title: "Choose a safer password.",
    subtitle: "Use at least 8 characters. A short hint is enough here so the flow stays fast.",
    action: "Update password",
    footerText: "Need to sign in?",
    footerCta: "Go to login",
    footerHref: authRoutes.login,
  },
} satisfies Record<AuthMode, Record<string, string>>;

export const trustSignals = [
  { label: "Pitch completeness", value: "82%", icon: FileText },
  { label: "Data room sessions", value: "18", icon: BarChart3 },
  { label: "IP proofs sealed", value: "7", icon: ShieldCheck },
];

export const founderProof = [
  { label: "Verify identity", done: true },
  { label: "Draft investor-ready deck", done: true },
  { label: "Share secure data room", done: false },
];

export const authHighlights = [
  { icon: Sparkles, title: "Founder-first flow", body: "Short signup, then verification, then the workspace." },
  { icon: LockKeyhole, title: "Security where it matters", body: "Re-verify sensitive account actions instead of slowing every login." },
  { icon: Users, title: "Demo-ready handoff", body: "Mentors, investors, and workspace actions stay connected after auth." },
];
