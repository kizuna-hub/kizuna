import type { Metadata } from "next";

import { AuthPage } from "@/components/auth/auth-page";

export const metadata: Metadata = {
  title: "Login | Kizuna Hub",
  description: "Đăng nhập vào workspace tại Kizuna Hub.",
};

export default function LoginPage() {
  return <AuthPage mode="login" />;
}
