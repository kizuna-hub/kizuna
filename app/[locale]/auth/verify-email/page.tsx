import type { Metadata } from "next";

import { AuthPage } from "@/features/auth/auth-page";

export const metadata: Metadata = {
  title: "Verify email | Kizuna Hub",
  description: "Verify your email to continue into Kizuna Founder Workspace.",
};

export default function VerifyEmailPage() {
  return <AuthPage mode="verify" />;
}
