import { cn } from "@/lib/utils";

export function ReadinessRing({
  score,
  label,
  size = "default",
}: {
  score: number;
  label: string;
  size?: "default" | "compact";
}) {
  const normalizedScore = Math.min(100, Math.max(0, score));
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset =
    circumference - (normalizedScore / 100) * circumference;

  return (
    <div
      className={cn(
        "relative shrink-0",
        size === "compact" ? "size-20" : "size-28",
      )}
      role="img"
      aria-label={`${label}: ${normalizedScore}/100`}
    >
      <svg
        viewBox="0 0 100 100"
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          className="text-workspace-border"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="text-primary transition-[stroke-dashoffset] duration-300 motion-reduce:transition-none"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-heading text-xl font-semibold text-ink">
        {new Intl.NumberFormat("vi-VN").format(normalizedScore)}
      </span>
    </div>
  );
}
