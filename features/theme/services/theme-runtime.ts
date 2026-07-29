import {
  accentTokensToCssVariables,
  getAccentAppearanceTokens,
} from "../config/accent-theme-definitions";
import type {
  AccentThemeId,
  AppearanceMode,
  ResolvedAppearance,
  ThemePreference,
  ThemeRootElement,
} from "../types/theme.types";

export function withAppearance(
  preference: ThemePreference,
  appearance: AppearanceMode,
): ThemePreference {
  return { ...preference, appearance };
}

export function withAccent(
  preference: ThemePreference,
  accent: AccentThemeId,
): ThemePreference {
  return { ...preference, accent };
}

export function resolveAppearance(
  appearance: AppearanceMode,
  systemPrefersDark: boolean,
): ResolvedAppearance {
  if (appearance === "system") {
    return systemPrefersDark ? "dark" : "light";
  }

  return appearance;
}

export function applyThemePreferenceToRoot(
  root: ThemeRootElement,
  preference: ThemePreference,
  systemPrefersDark: boolean,
) {
  const resolvedAppearance = resolveAppearance(
    preference.appearance,
    systemPrefersDark,
  );
  const cssVariables = accentTokensToCssVariables(
    getAccentAppearanceTokens(
      preference.accent,
      resolvedAppearance,
    ),
  );

  root.setAttribute("data-appearance", resolvedAppearance);
  root.setAttribute(
    "data-appearance-preference",
    preference.appearance,
  );
  root.setAttribute("data-accent", preference.accent);
  root.classList.toggle("dark", resolvedAppearance === "dark");

  Object.entries(cssVariables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });

  return resolvedAppearance;
}
