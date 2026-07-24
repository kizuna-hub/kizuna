import type { Metadata } from "next";

import { AuthPage } from "@/features/auth/auth-page";

export const metadata: Metadata = {
  title: "Sign up | Kizuna Hub",
  description: "Create a Kizuna Founder Workspace account.",
};

export default function SignupPage() {
  return <AuthPage mode="signup" />;
}
