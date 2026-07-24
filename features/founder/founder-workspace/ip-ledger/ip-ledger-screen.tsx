"use client";

import React from "react";
import { CheckCircle2, Copy, FileCheck2, FileUp, Fingerprint, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DemoToast,
  type DemoToastState,
  WorkspaceCard,
  WorkspacePageHeader,
} from "@/features/founder/founder-workspace/workspace-ui";
import { cn } from "@/lib/utils";

const history = [
  { asset: "matching-algorithm.md", hash: "0x4b2c...9f1a", status: "Registered", date: "2026-04-18" },
  { asset: "pilot-data-schema.csv", hash: "0x81af...72cc", status: "Verified", date: "2026-04-21" },
  { asset: "pitch-deck-v3.pdf", hash: "0x18e2...ab40", status: "Registered", date: "2026-05-02" },
];

export function IpLedgerScreen() {
  const [activeTab, setActiveTab] = React.useState<"register" | "verify">("register");
  const [registered, setRegistered] = React.useState(false);
  const [verified, setVerified] = React.useState(false);
  const [toast, setToast] = React.useState<DemoToastState>(null);

  const copyHash = async (hash: string) => {
    await navigator.clipboard.writeText(hash);
    setToast({ tone: "success", title: "Hash copied", description: hash });
  };

  return (
    <div>
      <WorkspacePageHeader
        eyebrow="IP Ledger"
        title="Prove what the team created and when."
        description="A demo-safe registration and verification flow for founder assets. No real chain transaction is submitted."
        actions={
          <div className="rounded-xl border border-hairline bg-surface-1 px-4 py-3">
            <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">Ledger trust</p>
            <p className="mt-1 font-mono text-2xl font-bold text-ink">91%</p>
          </div>
        }
      />

      <div className="mb-6 flex rounded-xl border border-hairline bg-surface-1 p-1">
        <button
          onClick={() => setActiveTab("register")}
          className={cn("flex-1 rounded-lg px-4 py-2 text-body-framer-sm font-bold", activeTab === "register" ? "bg-ink text-on-primary" : "text-ink-muted")}
        >
          Register asset
        </button>
        <button
          onClick={() => setActiveTab("verify")}
          className={cn("flex-1 rounded-lg px-4 py-2 text-body-framer-sm font-bold", activeTab === "verify" ? "bg-ink text-on-primary" : "text-ink-muted")}
        >
          Verify document
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <WorkspaceCard className="xl:col-span-7" title={activeTab === "register" ? "Register new asset" : "Verify existing document"}>
          {activeTab === "register" ? (
            <div className="rounded-xl border border-dashed border-hairline bg-surface-2 p-8 text-center">
              <FileUp className="mx-auto mb-4 size-10 text-ink-muted" />
              <p className="mx-auto max-w-md text-body-framer-sm text-ink-muted">
                Attach a file in the real product. In this demo, the button creates a deterministic registration receipt.
              </p>
              <Button className="mt-6" onClick={() => {
                setRegistered(true);
                setToast({ tone: "success", title: "Asset registered", description: "matching-algorithm.md received a demo hash." });
              }}>
                <Fingerprint className="size-4" />
                Generate proof hash
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-hairline bg-surface-2 p-8 text-center">
              <FileCheck2 className="mx-auto mb-4 size-10 text-ink-muted" />
              <p className="mx-auto max-w-md text-body-framer-sm text-ink-muted">
                Verification compares the uploaded file fingerprint with the registered proof. This demo resolves locally.
              </p>
              <Button className="mt-6" onClick={() => {
                setVerified(true);
                setToast({ tone: "success", title: "Document verified", description: "The file matches the registered proof." });
              }}>
                <ShieldCheck className="size-4" />
                Run verification
              </Button>
            </div>
          )}

          {(registered || verified) ? (
            <div className="mt-5 rounded-xl border border-hairline bg-surface-2 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-semantic-success" />
                <div className="min-w-0 flex-1">
                  <p className="text-body-framer-sm font-bold text-ink">{registered ? "Proof generated" : "Verification passed"}</p>
                  <p className="truncate font-mono text-caption text-ink-muted">0x4b2c9d8f21aa394f9f1a</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => copyHash("0x4b2c9d8f21aa394f9f1a")}>
                  <Copy className="size-3.5" />
                  Copy
                </Button>
              </div>
            </div>
          ) : null}
        </WorkspaceCard>

        <WorkspaceCard className="xl:col-span-5" title="Ledger history">
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.hash} className="rounded-xl border border-hairline bg-surface-2 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-body-framer-sm font-bold text-ink">{item.asset}</p>
                    <p className="mt-1 font-mono text-caption text-ink-muted">{item.hash}</p>
                  </div>
                  <Button variant="ghost" size="icon-sm" onClick={() => copyHash(item.hash)} aria-label={`Copy ${item.asset} hash`}>
                    <Copy className="size-4" />
                  </Button>
                </div>
                <div className="mt-3 flex items-center justify-between text-caption text-ink-muted">
                  <span>{item.status}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </WorkspaceCard>
      </div>

      <DemoToast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
