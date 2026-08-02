import { ArrowRight, Split } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { AiWorkspaceCopy } from "../../copy/types";

export function TopicDriftSuggestion({
  copy,
  onCreateConversation,
  onContinue,
}: {
  copy: AiWorkspaceCopy["longRun"]["conversation"];
  onCreateConversation: () => void;
  onContinue: () => void;
}) {
  return (
    <aside className="mx-auto mb-3 w-full max-w-3xl rounded-xl border border-workspace-warning/30 bg-workspace-warning-soft p-3">
      <div className="flex items-start gap-2.5">
        <Split className="mt-0.5 size-4 shrink-0 text-workspace-warning" />
        <div className="min-w-0 flex-1">
          <p className="workspace-supporting font-medium text-ink">
            {copy.topicDriftTitle}
          </p>
          <p className="mt-0.5 workspace-meta text-workspace-muted-text">
            {copy.topicDriftDescription}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              onClick={onCreateConversation}
            >
              {copy.splitTopic}
              <ArrowRight className="size-3.5" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onContinue}
            >
              {copy.continueHere}
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
