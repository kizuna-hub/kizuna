import type { VentureId } from "../../../core";
import type { BaselineField } from "../../domain";
import type { VentureWorkspaceState } from "../model/venture-workspace-state";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function getVenture(state: VentureWorkspaceState, ventureId: VentureId) {
  return state.ventures.find((venture) => venture.id === ventureId);
}

export function isAccessibleVenture(
  state: VentureWorkspaceState,
  ventureId: VentureId,
) {
  const venture = getVenture(state, ventureId);
  return Boolean(venture && venture.status !== "archived");
}

export function timestamp(value?: string) {
  return value ?? new Date().toISOString();
}

export function slugify(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "source"
  );
}

export function uniqueId(
  existingIds: string[],
  preferredId: string,
) {
  if (!existingIds.includes(preferredId)) return preferredId;
  let suffix = 2;
  while (existingIds.includes(`${preferredId}-${suffix}`)) {
    suffix += 1;
  }
  return `${preferredId}-${suffix}`;
}

export function nextVersion(version: string) {
  const parsed = Number.parseInt(version, 10);
  return Number.isFinite(parsed) ? String(parsed + 1) : `${version}-next`;
}

export function hasValue(field: BaselineField) {
  return field.value.trim().length > 0;
}

export function markVentureUpdated(
  state: VentureWorkspaceState,
  ventureId: VentureId,
  at: string,
) {
  return {
    ...state,
    ventures: state.ventures.map((venture) =>
      venture.id === ventureId
        ? { ...venture, lastUpdatedAt: at }
        : venture,
    ),
  };
}
