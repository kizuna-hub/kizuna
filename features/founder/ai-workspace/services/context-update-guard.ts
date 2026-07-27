export type ContextUpdateVersionCheck =
  | {
      status: "current";
      expectedVersion: number;
      currentVersion: number;
    }
  | {
      status: "conflict";
      expectedVersion: number;
      currentVersion: number;
    };

export function compareContextUpdateVersions(
  expectedVersion: number,
  currentVersion: number,
): ContextUpdateVersionCheck {
  return {
    status:
      expectedVersion === currentVersion
        ? "current"
        : "conflict",
    expectedVersion,
    currentVersion,
  };
}
