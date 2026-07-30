import type { Metadata } from "next";

import { DemoAuthEntryPage } from "@/features/auth/components/demo-auth-entry-page";

export const metadata: Metadata = {
  title: "Login | Kizuna Hub",
  description: "Log in to your Kizuna Founder Workspace.",
};

export default function LoginPage() {
  return <DemoAuthEntryPage mode="login" />;
}
