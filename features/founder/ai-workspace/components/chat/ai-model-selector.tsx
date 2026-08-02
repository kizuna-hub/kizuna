"use client";

import {
  Brain,
  Check,
  ChevronDown,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import type { AiModelId } from "../../types/ai-workspace.types";

const models: Array<{
  id: AiModelId;
  label: string;
  description: string;
  icon: typeof Zap;
}> = [
  {
    id: "kizuna-lite",
    label: "Kizuna Lite",
    description: "Phản hồi nhanh cho ý tưởng và trao đổi hàng ngày.",
    icon: Zap,
  },
  {
    id: "kizuna-max",
    label: "Kizuna Max",
    description: "Suy luận sâu cho quyết định và công việc quan trọng.",
    icon: Brain,
  },
  {
    id: "kizuna-wild",
    label: "Kizuna Wild",
    description: "Góc nhìn sáng tạo để thách thức lối nghĩ quen thuộc.",
    icon: WandSparkles,
  },
];

export function AiModelSelector({
  value,
  disabled,
  onValueChange,
}: {
  value: AiModelId;
  disabled: boolean;
  onValueChange: (value: AiModelId) => void;
}) {
  const selected =
    models.find((model) => model.id === value) ?? models[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled}
        className="mb-0.5 flex h-8 shrink-0 items-center gap-1 rounded-md px-2 workspace-meta font-medium text-workspace-muted-text outline-none transition-colors hover:bg-workspace-elevated hover:text-ink focus-visible:ring-2 focus-visible:ring-workspace-focus-ring/50 disabled:pointer-events-none disabled:opacity-50"
        aria-label={`Mô hình AI: ${selected.label}`}
      >
        <Sparkles className="size-3.5 text-primary" />
        <span className="hidden max-w-24 truncate sm:inline">
          {selected.label.replace("Kizuna ", "")}
        </span>
        <ChevronDown className="size-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="end"
        sideOffset={10}
        className="w-[min(320px,calc(100vw-1rem))] rounded-xl border-workspace-border bg-workspace-panel p-1.5 shadow-xl"
      >
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(nextValue) =>
            onValueChange(nextValue as AiModelId)
          }
        >
          {models.map((model) => {
            const Icon = model.icon;
            const active = model.id === value;
            return (
              <DropdownMenuRadioItem
                key={model.id}
                value={model.id}
                className={cn(
                  "items-start rounded-lg py-3 pl-3 pr-3 focus:bg-workspace-elevated",
                  "[&>span:first-child]:hidden",
                  active &&
                    "border border-workspace-border bg-workspace-elevated",
                )}
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
                  <Icon className="size-3.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 workspace-supporting font-medium text-ink">
                    {model.label}
                    {active ? (
                      <Check className="ml-auto size-3.5 text-primary" />
                    ) : null}
                  </span>
                  <span className="mt-1 block whitespace-normal workspace-meta leading-4 text-workspace-muted-text">
                    {model.description}
                  </span>
                </span>
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
        <div className="mx-1 mt-1 border-t border-workspace-border px-2 py-2 workspace-meta text-workspace-muted-text">
          Lựa chọn được lưu riêng cho venture này.
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
