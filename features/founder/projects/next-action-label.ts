import type { NextAction } from "../venture-foundation/types";

export function getCompactNextActionLabel(
  targetPath: string,
  kind?: NextAction["kind"],
) {
  if (kind === "start-cycle") return "Start tasks";
  if (kind === "commit-cycle") return "Commit cycle";
  if (kind === "plan-cycle") return "Explore decision";
  if (
    kind === "run-challenge-scan" ||
    kind === "review-challenge-scan" ||
    kind === "select-critical-decision"
  ) {
    return kind === "select-critical-decision"
      ? "Compare decisions"
      : "Review findings";
  }
  if (kind === "review-context") return "Review context";
  if (kind === "open-cycle") return "Continue cycle";

  const path = targetPath.split(/[?#]/, 1)[0] ?? targetPath;

  if (path.endsWith("/context")) return "Add context";
  if (path.endsWith("/cycle")) return "Continue cycle";
  if (path.endsWith("/evidence")) return "Review evidence";
  if (path.endsWith("/sessions")) return "Prepare session";
  if (
    path.endsWith("/outputs") ||
    path.includes("/ai-pitch-deck") ||
    path.includes("/data-room")
  ) {
    return "View output";
  }
  if (path.endsWith("/timeline")) return "View timeline";
  if (/\/founder\/projects\/[^/]+$/.test(path)) {
    return "Open overview";
  }

  return "Open decision";
}
