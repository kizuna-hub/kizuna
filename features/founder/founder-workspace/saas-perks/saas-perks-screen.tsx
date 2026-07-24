"use client";

import React from "react";
import { CheckCircle2, Gift, LockKeyhole, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DemoToast,
  type DemoToastState,
  WorkspaceCard,
  WorkspacePageHeader,
} from "@/features/founder/founder-workspace/workspace-ui";
import { cn } from "@/lib/utils";

const initialPerks = [
  { id: 1, provider: "AWS Activate", logo: "AWS", category: "Infrastructure", title: "$10,000 cloud credits", description: "Dedicated infrastructure support for MVP hosting.", requirement: "MVP verified", claimed: false },
  { id: 2, provider: "Stripe", logo: "STR", category: "Payments", title: "$50,000 fee-free volume", description: "Payment processing support for early pilots.", requirement: "Business profile", claimed: true },
  { id: 3, provider: "Notion", logo: "NOT", category: "Productivity", title: "6 months Plus", description: "Shared workspace for founder and mentor operations.", requirement: "All teams", claimed: false },
  { id: 4, provider: "OpenAI", logo: "OAI", category: "AI Tools", title: "$2,500 API credits", description: "Prototype AI features without production billing risk.", requirement: "IP Ledger verified", claimed: false },
  { id: 5, provider: "HubSpot", logo: "HUB", category: "Marketing", title: "30% first-year discount", description: "CRM tooling for pilot and investor pipeline tracking.", requirement: "Pilot active", claimed: false },
  { id: 6, provider: "Clerky", logo: "CLK", category: "Legal", title: "Free formation review", description: "Lightweight document review for fundraising readiness.", requirement: "US entity", claimed: false },
];

const filters = ["All", "Infrastructure", "Payments", "Productivity", "AI Tools", "Marketing", "Legal"];

export function SaasPerksScreen() {
  const [activeFilter, setActiveFilter] = React.useState("All");
  const [perks, setPerks] = React.useState(initialPerks);
  const [toast, setToast] = React.useState<DemoToastState>(null);

  const filteredPerks = activeFilter === "All" ? perks : perks.filter((perk) => perk.category === activeFilter);
  const claimedCount = perks.filter((perk) => perk.claimed).length;

  const claim = (id: number) => {
    setPerks((items) => items.map((item) => item.id === id ? { ...item, claimed: true } : item));
    const perk = perks.find((item) => item.id === id);
    setToast({ tone: "success", title: "Perk claimed", description: `${perk?.provider ?? "Perk"} is now marked as claimed for the demo.` });
  };

  return (
    <div>
      <WorkspacePageHeader
        eyebrow="SaaS perks"
        title="Turn ecosystem support into founder runway."
        description="A curated perk marketplace where every claim button updates local demo state."
        actions={
          <div className="rounded-xl border border-hairline bg-surface-1 px-4 py-3">
            <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">Claimed</p>
            <p className="mt-1 font-mono text-2xl font-bold text-ink">{claimedCount}/{perks.length}</p>
          </div>
        }
      />

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <Button key={filter} variant={activeFilter === filter ? "default" : "secondary"} size="sm" onClick={() => setActiveFilter(filter)}>
            {filter}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:col-span-8">
          {filteredPerks.map((perk) => (
            <WorkspaceCard key={perk.id} className="flex flex-col">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl border border-hairline bg-surface-2 font-mono text-caption font-bold text-ink">
                    {perk.logo}
                  </div>
                  <div>
                    <p className="text-body-framer-sm font-bold text-ink">{perk.provider}</p>
                    <p className="mt-1 text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">{perk.category}</p>
                  </div>
                </div>
                {perk.claimed ? <CheckCircle2 className="size-5 text-semantic-success" /> : <Gift className="size-5 text-ink-muted" />}
              </div>
              <h2 className="text-headline text-ink">{perk.title}</h2>
              <p className="mt-3 flex-1 text-body-framer-sm text-ink-muted">{perk.description}</p>
              <div className="mt-5 rounded-xl border border-hairline bg-surface-2 p-3 text-caption text-ink-muted">
                Requirement: <span className="font-bold text-ink">{perk.requirement}</span>
              </div>
              <Button
                className="mt-5 w-full"
                variant={perk.claimed ? "secondary" : "default"}
                onClick={() => claim(perk.id)}
                disabled={perk.claimed}
              >
                {perk.claimed ? "Claimed" : "Claim perk"}
              </Button>
            </WorkspaceCard>
          ))}
        </div>

        <div className="space-y-5 xl:col-span-4">
          <WorkspaceCard title="Eligibility score">
            <div className="flex items-center justify-center py-5">
              <div className="flex size-36 items-center justify-center rounded-full border-[16px] border-ink bg-surface-2">
                <div className="text-center">
                  <p className="font-mono text-4xl font-bold text-ink">74</p>
                  <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">score</p>
                </div>
              </div>
            </div>
            <p className="text-body-framer-sm text-ink-muted">Verify IP Ledger and attach mentor endorsement to unlock higher-value AI and legal perks.</p>
          </WorkspaceCard>

          <WorkspaceCard title="Locked perk path">
            <div className="space-y-3">
              {["IP Ledger verified", "Mentor endorsement", "Data Room ready"].map((item, index) => (
                <div key={item} className={cn("flex items-center gap-3 rounded-xl border border-hairline p-3", index === 0 ? "bg-surface-1" : "bg-surface-2")}>
                  {index === 0 ? <CheckCircle2 className="size-4 text-semantic-success" /> : <LockKeyhole className="size-4 text-ink-muted" />}
                  <span className="text-body-framer-sm text-ink">{item}</span>
                </div>
              ))}
            </div>
            <Button variant="secondary" className="mt-4 w-full" onClick={() => setToast({ title: "Path explained", description: "This checklist shows why some perks remain locked." })}>
              <Sparkles className="size-4" />
              Explain unlock path
            </Button>
          </WorkspaceCard>
        </div>
      </div>

      <DemoToast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
