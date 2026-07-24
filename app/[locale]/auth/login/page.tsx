import type { Metadata } from "next";

import { AuthPage } from "@/features/auth/auth-page";

export const metadata: Metadata = {
  title: "Login | Kizuna Hub",
  description: "Log in to your Kizuna Founder Workspace.",
};

export default function LoginPage() {
  return <AuthPage mode="login" />;
}
