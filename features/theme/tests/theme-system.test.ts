import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

import {
  ACCENT_BASE_COLORS,
  ACCENT_THEMES,
  accentTokensToCssVariables,
  getAccentAppearanceTokens,
} from "../config/accent-theme-definitions";
import {
  DEFAULT_THEME_PREFERENCE,
  THEME_STORAGE_KEY,
} from "../config/theme-defaults";
import { createThemeInitializationScript } from "../scripts/theme-initialization-source";
import {
  loadThemePreference,
  parseThemePreference,
  parseThemeStorageEvent,
  saveThemePreference,
  validateThemePreference,
  type ThemeStorage,
} from "../services/theme-preference-storage";
import {
  applyThemePreferenceToRoot,
  resolveAppearance,
  withAccent,
  withAppearance,
} from "../services/theme-runtime";
import type {
  AccentThemeId,
  ThemeRootElement,
} from "../types/theme.types";

function createRoot() {
  const attributes = new Map<string, string>();
  const properties = new Map<string, string>();
  const classes = new Set<string>();
  const root: ThemeRootElement = {
    classList: {
      toggle(token, force) {
        if (force) {
          classes.add(token);
        } else {
          classes.delete(token);
        }
        return classes.has(token);
      },
    },
    style: {
      setProperty(property, value) {
        properties.set(property, value);
      },
    },
    setAttribute(name, value) {
      attributes.set(name, value);
    },
  };

  return { root, attributes, properties, classes };
}

function relativeLuminance(hex: string) {
  const channels = [1, 3, 5].map((offset) => {
    const value =
      Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  });

  return (
    0.2126 * channels[0] +
    0.7152 * channels[1] +
    0.0722 * channels[2]
  );
}

function contrastRatio(first: string, second: string) {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  return (
    (Math.max(firstLuminance, secondLuminance) + 0.05) /
    (Math.min(firstLuminance, secondLuminance) + 0.05)
  );
}

test("theme defaults preserve the current dark Kizuna experience", () => {
  assert.deepEqual(DEFAULT_THEME_PREFERENCE, {
    version: 1,
    appearance: "dark",
    accent: "kizuna",
  });
  assert.equal(ACCENT_BASE_COLORS.kizuna, "#CC785C");
});

test("preference validation repairs invalid fields without crashing", () => {
  assert.deepEqual(
    validateThemePreference({
      version: 1,
      appearance: "neon",
      accent: "ocean",
    }),
    {
      version: 1,
      appearance: "dark",
      accent: "ocean",
    },
  );
  assert.deepEqual(
    parseThemePreference("{not-json"),
    DEFAULT_THEME_PREFERENCE,
  );
  assert.deepEqual(
    validateThemePreference({
      version: 0,
      appearance: "light",
      accent: "rose",
    }),
    DEFAULT_THEME_PREFERENCE,
  );
});

test("storage supports current, legacy, unavailable, and write-failure paths", () => {
  const values = new Map<string, string>([
    ["theme", "system"],
  ]);
  const storage: ThemeStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };

  assert.equal(loadThemePreference(storage).appearance, "system");
  assert.equal(
    saveThemePreference(
      { version: 1, appearance: "light", accent: "violet" },
      storage,
    ),
    true,
  );
  assert.equal(
    parseThemePreference(values.get(THEME_STORAGE_KEY) ?? null)
      .accent,
    "violet",
  );
  assert.deepEqual(loadThemePreference(storage), {
    version: 1,
    appearance: "light",
    accent: "violet",
  });

  const unavailableStorage: ThemeStorage = {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("blocked");
    },
  };
  assert.deepEqual(
    loadThemePreference(unavailableStorage),
    DEFAULT_THEME_PREFERENCE,
  );
  assert.equal(
    saveThemePreference(DEFAULT_THEME_PREFERENCE, unavailableStorage),
    false,
  );
});

test("appearance and accent transitions preserve the independent preference axis", () => {
  const current = {
    version: 1 as const,
    appearance: "dark" as const,
    accent: "ocean" as const,
  };

  assert.deepEqual(withAppearance(current, "system"), {
    version: 1,
    appearance: "system",
    accent: "ocean",
  });
  assert.deepEqual(withAccent(current, "rose"), {
    version: 1,
    appearance: "dark",
    accent: "rose",
  });
});

test("cross-tab events accept only the canonical storage key", () => {
  const serialized = JSON.stringify({
    version: 1,
    appearance: "light",
    accent: "amber",
  });

  assert.equal(
    parseThemeStorageEvent("unrelated", serialized),
    null,
  );
  assert.deepEqual(
    parseThemeStorageEvent(THEME_STORAGE_KEY, serialized),
    {
      version: 1,
      appearance: "light",
      accent: "amber",
    },
  );
  assert.deepEqual(
    parseThemeStorageEvent(THEME_STORAGE_KEY, null),
    DEFAULT_THEME_PREFERENCE,
  );
});

test("all 14 direct appearance/accent combinations update root state", () => {
  for (const appearance of ["light", "dark"] as const) {
    for (const theme of ACCENT_THEMES) {
      const { root, attributes, properties, classes } =
        createRoot();
      const resolved = applyThemePreferenceToRoot(
        root,
        { version: 1, appearance, accent: theme.id },
        false,
      );
      const expectedVariables = accentTokensToCssVariables(
        getAccentAppearanceTokens(theme.id, appearance),
      );

      assert.equal(resolved, appearance);
      assert.equal(
        attributes.get("data-appearance"),
        appearance,
      );
      assert.equal(attributes.get("data-accent"), theme.id);
      assert.equal(classes.has("dark"), appearance === "dark");
      assert.equal(
        properties.get("--color-primary"),
        expectedVariables["--color-primary"],
      );
      assert.equal(
        properties.get("--selection"),
        expectedVariables["--selection"],
      );
    }
  }
});

test("system appearance follows operating-system changes", () => {
  assert.equal(resolveAppearance("system", false), "light");
  assert.equal(resolveAppearance("system", true), "dark");

  const { root, attributes, classes } = createRoot();
  const preference = {
    version: 1 as const,
    appearance: "system" as const,
    accent: "graphite" as AccentThemeId,
  };
  applyThemePreferenceToRoot(root, preference, false);
  assert.equal(attributes.get("data-appearance"), "light");
  assert.equal(
    attributes.get("data-appearance-preference"),
    "system",
  );
  applyThemePreferenceToRoot(root, preference, true);
  assert.equal(attributes.get("data-appearance"), "dark");
  assert.equal(classes.has("dark"), true);
});

test("primary actions meet WCAG AA contrast in every palette", () => {
  for (const theme of ACCENT_THEMES) {
    for (const appearance of ["light", "dark"] as const) {
      const tokens = theme[appearance];
      assert.ok(
        contrastRatio(
          tokens.primaryAction,
          tokens.primaryActionForeground,
        ) >= 4.5,
        `${theme.id}/${appearance} action contrast is below 4.5:1`,
      );
    }
  }
});

test("theme registry has seven unique definitions and a true monochrome mode", () => {
  assert.equal(ACCENT_THEMES.length, 7);
  assert.equal(
    new Set(ACCENT_THEMES.map((theme) => theme.id)).size,
    7,
  );
  assert.equal(
    new Set(ACCENT_THEMES.map((theme) => theme.baseColor)).size,
    7,
  );

  const monochrome = ACCENT_THEMES.find(
    (theme) => theme.id === "monochrome",
  );
  assert.ok(monochrome);
  assert.equal(monochrome.baseColor, "#30302E");
  assert.equal(monochrome.dark.primary, "#D6D6D2");
});

test("initialization script is generated from the canonical registry", () => {
  const source = createThemeInitializationScript();

  assert.match(source, /kizuna:theme-preference:v1/);
  assert.match(source, /data-accent|dataset\.accent/);
  assert.match(source, /prefers-color-scheme: dark/);
  for (const theme of ACCENT_THEMES) {
    assert.match(source, new RegExp(`"${theme.id}"`));
  }
});

test("theme menu keeps the required desktop and mobile interaction contract", () => {
  const source = readFileSync(
    resolve("features/theme/components/theme-menu.tsx"),
    "utf8",
  );

  assert.match(source, /<Popover/);
  assert.match(source, /<Sheet/);
  assert.match(source, /Sáng/);
  assert.match(source, /Tối/);
  assert.match(source, /Hệ thống/);
  assert.match(source, /ACCENT_THEMES\.map/);
  assert.match(source, /previewLabel/);
  assert.match(source, /<Check/);
  assert.doesNotMatch(source, />\s*(?:Save|Lưu)\s*</);
});
