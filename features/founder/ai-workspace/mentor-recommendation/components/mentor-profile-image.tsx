"use client";

import Image from "next/image";
import React from "react";
import { UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

import { getMentorInitials } from "../state/mentor-recommendation-selectors";

export function MentorProfileImage({
  name,
  src,
  className,
  priority = false,
}: {
  name: string;
  src?: string;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = React.useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-workspace-elevated",
        className,
      )}
    >
      {src && !failed ? (
        <Image
          src={src}
          alt={`Ảnh chân dung mentor ${name}`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 88vw, (max-width: 1280px) 40vw, 280px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center bg-primary-soft text-primary"
          role="img"
          aria-label={`Ảnh đại diện của ${name}`}
        >
          <span className="font-tabular text-2xl font-semibold">
            {getMentorInitials(name)}
          </span>
          <UserRound
            className="sr-only"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
