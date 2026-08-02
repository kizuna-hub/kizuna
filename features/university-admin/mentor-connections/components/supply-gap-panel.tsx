import { AlertTriangle, UserRoundPlus, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

import type { MentorSupplyGap } from "../model/mentor-connection";

export function SupplyGapPanel({
  gaps,
}: {
  gaps: MentorSupplyGap[];
}) {
  return (
    <div>
      <div className="space-y-2">
        {gaps.map((gap) => {
          const tone =
            gap.severity === "high"
              ? "var(--admin-red)"
              : gap.severity === "medium"
                ? "var(--admin-orange)"
                : "var(--admin-green)";
          return (
            <div
              key={gap.expertise}
              className="rounded-lg border border-[var(--admin-border)] p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-[11px] font-semibold">
                  {gap.severity === "high" ? (
                    <AlertTriangle
                      className="size-3.5"
                      style={{ color: tone }}
                    />
                  ) : (
                    <UsersRound
                      className="size-3.5"
                      style={{ color: tone }}
                    />
                  )}
                  {gap.expertise}
                </span>
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: tone }}
                >
                  {gap.ventureDemand}:{gap.availableMentors}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[9px] text-[var(--admin-muted)]">
                <span>{gap.ventureDemand} venture cần</span>
                <span>{gap.availableMentors} mentor còn nhận</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button
          asChild
          variant="outline"
          className="border-[var(--admin-border)] bg-transparent text-[10px]"
        >
          <Link href="/university-admin/lecturer-mentors">
            Xem mentor phù hợp
          </Link>
        </Button>
        <Button
          type="button"
          disabled
          title="Luồng mời mentor sẽ được bổ sung sau bản demo"
          className="bg-[var(--admin-primary)] text-[10px] text-white hover:bg-[var(--admin-primary-hover)]"
        >
          <UserRoundPlus className="size-3.5" />
          Mời thêm mentor
        </Button>
      </div>
    </div>
  );
}
