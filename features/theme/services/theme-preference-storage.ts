import { ACCENT_THEMES } from "../config/accent-theme-definitions";
import {
  DEFAULT_THEME_PREFERENCE,
  LEGACY_THEME_STORAGE_KEY,
  THEME_PREFERENCE_VERSION,
  THEME_STORAGE_KEY,
} from "../config/theme-defaults";
import type {
  AccentThemeId,
  AppearanceMode,
  ThemePreference,
} from "../types/theme.types";

export interface ThemeStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

const appearanceModes = new Set<AppearanceMode>([
  "light",
  "dark",
  "system",
]);
const accentThemeIds = new Set<AccentThemeId>(
  ACCENT_THEMES.map((theme) => theme.id),
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function validateThemePreference(
  value: unknown,
): ThemePreference {
  if (
    !isRecord(value) ||
    value.version !== THEME_PREFERENCE_VERSION
  ) {
    return { ...DEFAULT_THEME_PREFERENCE };
  }

  const appearance = appearanceModes.has(
    value.appearance as AppearanceMode,
  )
    ? (value.appearance as AppearanceMode)
    : DEFAULT_THEME_PREFERENCE.appearance;
  const accent = accentThemeIds.has(value.accent as AccentThemeId)
    ? (value.accent as AccentThemeId)
    : DEFAULT_THEME_PREFERENCE.accent;

  return {
    version: THEME_PREFERENCE_VERSION,
    appearance,
    accent,
  };
}

export function parseThemePreference(
  serialized: string | null,
): ThemePreference {
  if (!serialized) {
    return { ...DEFAULT_THEME_PREFERENCE };
  }

  try {
    return validateThemePreference(JSON.parse(serialized));
  } catch {
    return { ...DEFAULT_THEME_PREFERENCE };
  }
}

export function getBrowserThemeStorage(): ThemeStorage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadThemePreference(
  storage: ThemeStorage | null = getBrowserThemeStorage(),
): ThemePreference {
  if (!storage) {
    return { ...DEFAULT_THEME_PREFERENCE };
  }

  try {
    const currentValue = storage.getItem(THEME_STORAGE_KEY);
    if (currentValue) {
      return parseThemePreference(currentValue);
    }

    const legacyAppearance = storage.getItem(
      LEGACY_THEME_STORAGE_KEY,
    );
    if (
      legacyAppearance &&
      appearanceModes.has(legacyAppearance as AppearanceMode)
    ) {
      const migratedPreference: ThemePreference = {
        ...DEFAULT_THEME_PREFERENCE,
        appearance: legacyAppearance as AppearanceMode,
      };
      try {
        storage.setItem(
          THEME_STORAGE_KEY,
          JSON.stringify(migratedPreference),
        );
      } catch {
        // The preference is still usable for this session.
      }
      return migratedPreference;
    }
  } catch {
    return { ...DEFAULT_THEME_PREFERENCE };
  }

  return { ...DEFAULT_THEME_PREFERENCE };
}

export function saveThemePreference(
  preference: ThemePreference,
  storage: ThemeStorage | null = getBrowserThemeStorage(),
) {
  if (!storage) {
    return false;
  }

  try {
    storage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify(validateThemePreference(preference)),
    );
    return true;
  } catch {
    return false;
  }
}

export function parseThemeStorageEvent(
  key: string | null,
  newValue: string | null,
) {
  if (key !== THEME_STORAGE_KEY) {
    return null;
  }

  return parseThemePreference(newValue);
}
