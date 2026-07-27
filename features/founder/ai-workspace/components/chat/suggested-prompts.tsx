import { ArrowUpRight } from "lucide-react";

export function SuggestedPrompts({
  prompts,
  onSelect,
  disabled,
  label,
}: {
  prompts: string[];
  onSelect: (prompt: string) => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 no-scrollbar"
      aria-label={label}
    >
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => onSelect(prompt)}
          disabled={disabled}
          className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-pill border border-workspace-border bg-workspace-panel px-3 workspace-meta font-medium text-workspace-muted-text transition-colors hover:border-primary-border hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/40 disabled:pointer-events-none disabled:opacity-40"
        >
          {prompt}
          <ArrowUpRight className="size-3" />
        </button>
      ))}
    </div>
  );
}
