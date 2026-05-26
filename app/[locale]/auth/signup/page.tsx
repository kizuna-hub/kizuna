import type { Metadata } from "next";

import { AuthPage } from "@/components/auth/auth-page";

export const metadata: Metadata = {
  title: "Sign up | Kizuna Hub",
  description: "Tạo workspace tại Kizuna Hub.",
};

export default function SignupPage() {
  return <AuthPage mode="signup" />;
}
