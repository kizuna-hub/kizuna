import {
  ACCENT_THEMES,
  accentTokensToCssVariables,
} from "../config/accent-theme-definitions";
import {
  DEFAULT_THEME_PREFERENCE,
  LEGACY_THEME_STORAGE_KEY,
  THEME_PREFERENCE_VERSION,
  THEME_STORAGE_KEY,
} from "../config/theme-defaults";

export function createThemeInitializationScript() {
  const serializedThemes = JSON.stringify(
    Object.fromEntries(
      ACCENT_THEMES.map((theme) => [
        theme.id,
        {
          light: accentTokensToCssVariables(theme.light),
          dark: accentTokensToCssVariables(theme.dark),
        },
      ]),
    ),
  );

  return `(() => {
    const storageKey = ${JSON.stringify(THEME_STORAGE_KEY)};
    const legacyKey = ${JSON.stringify(LEGACY_THEME_STORAGE_KEY)};
    const version = ${THEME_PREFERENCE_VERSION};
    const fallback = ${JSON.stringify(DEFAULT_THEME_PREFERENCE)};
    const themes = ${serializedThemes};
    const appearances = new Set(["light", "dark", "system"]);
    let preference = fallback;

    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        preference = {
          version,
          appearance:
            parsed && parsed.version === version && appearances.has(parsed.appearance)
              ? parsed.appearance
              : fallback.appearance,
          accent:
            parsed && parsed.version === version && themes[parsed.accent]
              ? parsed.accent
              : fallback.accent,
        };
      } else {
        const legacyAppearance = localStorage.getItem(legacyKey);
        if (appearances.has(legacyAppearance)) {
          preference = { ...fallback, appearance: legacyAppearance };
          try {
            localStorage.setItem(storageKey, JSON.stringify(preference));
          } catch {}
        }
      }
    } catch {}

    const systemPrefersDark =
      typeof matchMedia === "function" &&
      matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved =
      preference.appearance === "system"
        ? systemPrefersDark
          ? "dark"
          : "light"
        : preference.appearance;
    const root = document.documentElement;
    const variables = themes[preference.accent][resolved];

    root.dataset.appearance = resolved;
    root.dataset.appearancePreference = preference.appearance;
    root.dataset.accent = preference.accent;
    root.classList.toggle("dark", resolved === "dark");
    Object.entries(variables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  })();`;
}
