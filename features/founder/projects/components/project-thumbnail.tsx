import Image from "next/image";

import type { Venture } from "@/features/founder/venture-foundation/types";
import { cn } from "@/lib/utils";

type ThumbnailPreset =
  | "decision"
  | "finance"
  | "learning"
  | "care"
  | "pipeline"
  | "workspace";

const thumbnailSources: Record<
  ThumbnailPreset,
  {
    src: string;
    creator: string;
    positionClassName?: string;
  }
> = {
  decision: {
    src: "/images/project-thumbnails/decision.jpg",
    creator: "Jason Leung",
  },
  finance: {
    src: "/images/project-thumbnails/finance.jpg",
    creator: "Kristaps Ungurs",
  },
  learning: {
    src: "/images/project-thumbnails/learning.jpg",
    creator: "Sebastian Schuster",
  },
  care: {
    src: "/images/project-thumbnails/care.jpg",
    creator: "Yogesh Pedamkar",
  },
  pipeline: {
    src: "/images/project-thumbnails/pipeline.jpg",
    creator: "Mitchell Luo",
  },
  workspace: {
    src: "/images/project-thumbnails/workspace.jpg",
    creator: "nic chi",
  },
};

function getThumbnailPreset(venture: Venture): ThumbnailPreset {
  const identity = `${venture.id} ${venture.name}`.toLowerCase();
  if (identity.includes("kizuna")) return "decision";
  if (identity.includes("snapmoney")) return "finance";
  if (identity.includes("edubridge")) return "learning";
  if (identity.includes("caremind")) return "care";
  if (identity.includes("cash")) return "pipeline";
  return "workspace";
}

export function ProjectThumbnail({
  venture,
  className,
}: {
  venture: Venture;
  className?: string;
}) {
  const source = thumbnailSources[getThumbnailPreset(venture)];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative aspect-[16/9] overflow-hidden rounded-xl border border-workspace-border bg-workspace-elevated shadow-framer-edge",
        className,
      )}
    >
      <Image
        src={source.src}
        alt=""
        fill
        sizes="(min-width: 1280px) 360px, (min-width: 768px) 45vw, 100vw"
        className={cn(
          "object-cover transition-transform duration-300 motion-reduce:transition-none group-hover:scale-[1.025]",
          source.positionClassName,
        )}
      />
      <div className="absolute inset-0 bg-canvas/15 transition-colors group-hover:bg-canvas/5" />

      <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-ink/15 bg-canvas/75 px-2.5 py-1 text-ink shadow-framer-edge backdrop-blur-sm">
        <span className="size-1.5 rounded-full bg-primary" />
        <span className="workspace-eyebrow">Mock cover</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 border-t border-ink/10 bg-canvas/80 px-3.5 py-3 backdrop-blur-sm">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="line-clamp-1 workspace-card-title text-ink">
              {venture.name}
            </p>
            <p className="mt-1 line-clamp-1 workspace-meta text-ink-muted">
              {venture.oneLineDescription}
            </p>
          </div>
          <p className="shrink-0 workspace-eyebrow text-ink-muted">
            {source.creator} · Unsplash
          </p>
        </div>
      </div>
    </div>
  );
}
