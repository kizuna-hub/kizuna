import type { ThemePreference } from "../types/theme.types";

export const THEME_PREFERENCE_VERSION = 1 as const;
export const THEME_STORAGE_KEY =
  "kizuna:theme-preference:v1";
export const LEGACY_THEME_STORAGE_KEY = "theme";

export const DEFAULT_THEME_PREFERENCE: ThemePreference = {
  version: THEME_PREFERENCE_VERSION,
  appearance: "dark",
  accent: "kizuna",
};
