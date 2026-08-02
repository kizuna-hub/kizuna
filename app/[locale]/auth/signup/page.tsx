import type { Metadata } from "next";

import { DemoAuthEntryPage } from "@/features/auth/components/demo-auth-entry-page";

export const metadata: Metadata = {
  title: "Sign up | Kizuna Hub",
  description: "Create a Kizuna Founder Workspace account.",
};

export default function SignupPage() {
  return <DemoAuthEntryPage mode="signup" />;
}
