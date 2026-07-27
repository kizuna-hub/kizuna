import { Bot, ExternalLink, PinOff } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { AiWorkspaceCopy } from "../../copy/types";
import type { PinnedItemReference } from "../../types/long-run-workspace.types";

export function PinnedItemsPanel({
  items,
  copy,
  onUnpin,
  onAsk,
  onOpenOriginal,
}: {
  items: PinnedItemReference[];
  copy: AiWorkspaceCopy["longRun"];
  onUnpin: (item: PinnedItemReference) => void;
  onAsk: (item: PinnedItemReference) => void;
  onOpenOriginal: (item: PinnedItemReference) => void;
}) {
  if (items.length === 0) {
    return (
      <p className="py-12 text-center workspace-supporting text-workspace-muted-text">
        {copy.saved.empty}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-xl border border-workspace-border bg-workspace-panel p-3"
        >
          <h3 className="workspace-supporting font-medium text-ink">
            {item.title}
          </h3>
          <p className="mt-1 workspace-meta text-workspace-muted-text">
            {item.sourceLabel}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => onOpenOriginal(item)}
            >
              <ExternalLink className="size-3.5" />
              {copy.saved.openOriginal}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => onAsk(item)}
            >
              <Bot className="size-3.5" />
              {copy.common.askKizuna}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => onUnpin(item)}
            >
              <PinOff className="size-3.5" />
              {copy.common.unpin}
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
