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
    positionClassName?: string;
  }
> = {
  decision: {
    src: "/images/project-thumbnails/decision.jpg",
  },
  finance: {
    src: "/images/project-thumbnails/finance.jpg",
  },
  learning: {
    src: "/images/project-thumbnails/learning.jpg",
  },
  care: {
    src: "/images/project-thumbnails/care.jpg",
  },
  pipeline: {
    src: "/images/project-thumbnails/pipeline.jpg",
  },
  workspace: {
    src: "/images/project-thumbnails/workspace.jpg",
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
        "relative aspect-[16/9] overflow-hidden rounded-lg border border-workspace-border bg-workspace-elevated shadow-framer-edge",
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
    </div>
  );
}
