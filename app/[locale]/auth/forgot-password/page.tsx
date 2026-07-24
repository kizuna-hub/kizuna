import type { Metadata } from "next";

import { AuthPage } from "@/features/auth/auth-page";

export const metadata: Metadata = {
  title: "Forgot password | Kizuna Hub",
  description: "Request a secure password reset link for your Kizuna account.",
};

export default function ForgotPasswordPage() {
  return <AuthPage mode="forgot" />;
}
