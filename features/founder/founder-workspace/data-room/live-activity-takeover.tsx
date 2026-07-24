"use client";

import React from "react";
import { CheckCircle2, Clock, Radio } from "lucide-react";

export default function LiveActivityTakeover() {
  const [takeoverId, setTakeoverId] = React.useState<string | null>(null);
  const activities = [
    { id: "1", timestamp: "Just now", investor: "Takeru Hishinuma", event: "Viewing technical architecture notes", isLive: true },
    { id: "2", timestamp: "2m ago", investor: "Kizuna Ventures", event: "Downloaded Financial Snapshot PDF", isLive: false },
    { id: "3", timestamp: "15m ago", investor: "Maya Watanabe", event: "Finished reviewing Pitch Deck", isLive: false },
    { id: "4", timestamp: "1h ago", investor: "An Hoang Le", event: "Opened Secure Link #42A9", isLive: false },
  ];

  return (
    <div className="flex h-full min-h-[300px] flex-col rounded-xl border border-hairline bg-surface-1 p-6 shadow-framer-edge">
      <div className="mb-8 flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold text-ink">Live Stream</h3>
        <div className="flex items-center gap-1.5 rounded-md border border-hairline bg-surface-2 px-2 py-0.5">
          <Clock className="h-3 w-3 text-ink-muted" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink">Active</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="relative ml-1 space-y-7 before:absolute before:inset-0 before:left-[11px] before:h-full before:w-px before:bg-hairline">
          {activities.map((activity) => (
            <div key={activity.id} className="group relative flex items-start gap-4">
              <div className="absolute left-0 mt-1.5 -translate-x-[2px] bg-surface-1 py-1">
                {activity.isLive ? (
                  <span className="relative ml-[5px] flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-semantic-success opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-semantic-success ring-2 ring-surface-1" />
                  </span>
                ) : (
                  <div className="ml-[7px] h-1.5 w-1.5 rounded-full bg-hairline ring-[4px] ring-surface-1" />
                )}
              </div>
              <div className="w-full pl-7">
                <div className="mb-0.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-body text-[13px] font-bold text-ink">{activity.investor}</span>
                    <span className="text-[10px] font-medium text-ink-muted">{activity.timestamp}</span>
                  </div>
                  {activity.isLive ? (
                    <button
                      onClick={() => setTakeoverId(activity.id)}
                      className="flex items-center gap-1.5 rounded-md bg-ink px-2.5 py-1 text-[10px] font-bold text-on-primary shadow-sm transition-colors hover:bg-surface-2 hover:text-ink"
                    >
                      {takeoverId === activity.id ? <CheckCircle2 className="h-3 w-3" /> : <Radio className="h-3 w-3" />}
                      {takeoverId === activity.id ? "Watching" : "Takeover Live"}
                    </button>
                  ) : null}
                </div>
                <p className="pr-24 text-[12px] leading-relaxed text-ink-muted">{activity.event}</p>
                {takeoverId === activity.id ? (
                  <p className="mt-2 rounded-lg border border-hairline bg-surface-2 px-3 py-2 text-[11px] font-bold text-ink">
                    Founder view is following this live session in demo mode.
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
