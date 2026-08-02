"use client";

import { ArrowRight, CalendarDays, Telescope } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { FounderShell } from "@/features/founder/shell/founder-shell";
import { useDemoWorkspace } from "@/features/founder/venture-foundation/demo-workspace-provider";
import { Link } from "@/i18n/routing";

export function OpportunityEntryScreen() {
  const searchParams = useSearchParams();
  const { state } = useDemoWorkspace();
  const opportunityId = searchParams.get("opportunity");
  const opportunity = state.opportunities.find(
    (item) => item.id === opportunityId,
  );

  if (!opportunity) {
    return (
      <FounderShell contentWidth="focused">
        <section className="rounded-xl border border-workspace-border bg-workspace-panel p-5">
          <h1 className="workspace-page-title text-ink">
            Cơ hội này không còn khả dụng
          </h1>
          <p className="mt-2 workspace-supporting text-workspace-muted-text">
            Nội dung bạn mở không còn tồn tại hoặc đã được di chuyển.
          </p>
          <Button asChild className="mt-4">
            <Link href="/founder/home">Mở Kizuna Home</Link>
          </Button>
        </section>
      </FounderShell>
    );
  }

  const venture = state.ventures.find(
    (item) => item.id === opportunity.ventureId,
  );

  return (
    <FounderShell contentWidth="focused">
      <div className="space-y-5">
        <header className="border-b border-workspace-border pb-4">
          <p className="workspace-eyebrow text-primary">
            Opportunity
          </p>
          <h1 className="mt-1.5 workspace-page-title text-ink">
            {opportunity.name}
          </h1>
          <p className="mt-1.5 workspace-body text-workspace-muted-text">
            {opportunity.relevance}
          </p>
        </header>

        <section className="rounded-xl border border-workspace-border bg-workspace-panel p-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-primary-border bg-primary-soft text-primary">
              <Telescope className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="workspace-card-title text-ink">
                {venture?.name ?? "Founder workspace"}
              </p>
              <p className="mt-1 workspace-supporting text-workspace-muted-text">
                Trạng thái: {opportunity.status} · Loại:{" "}
                {opportunity.type}
              </p>
              {opportunity.deadlineAt ? (
                <p className="mt-3 inline-flex items-center gap-2 workspace-meta text-workspace-muted-text">
                  <CalendarDays className="size-4" />
                  Hạn:{" "}
                  {new Intl.DateTimeFormat("vi", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    timeZone: "UTC",
                  }).format(new Date(opportunity.deadlineAt))}
                </p>
              ) : null}
            </div>
          </div>

          {venture ? (
            <Button asChild className="mt-5 h-11 workspace-control-text">
              <Link
                href={`/founder/projects/${venture.id}/workspace?conversation=conversation-opportunity`}
              >
                Mở trong venture workspace
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          ) : null}
        </section>

        <p className="workspace-meta text-workspace-muted-text">
          Đây là dữ liệu demo. Matching và enrollment backend chưa
          được triển khai.
        </p>
      </div>
    </FounderShell>
  );
}

