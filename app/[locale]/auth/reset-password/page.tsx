import type { Metadata } from "next";

import { AuthPage } from "@/features/auth/auth-page";

export const metadata: Metadata = {
  title: "Reset password | Kizuna Hub",
  description: "Choose a new password for your Kizuna account.",
};

export default function ResetPasswordPage() {
  return <AuthPage mode="reset" />;
}
