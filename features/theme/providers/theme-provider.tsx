"use client";

import * as React from "react";

import {
  DEFAULT_THEME_PREFERENCE,
  THEME_STORAGE_KEY,
} from "../config/theme-defaults";
import {
  getBrowserThemeStorage,
  loadThemePreference,
  parseThemeStorageEvent,
  saveThemePreference,
} from "../services/theme-preference-storage";
import {
  applyThemePreferenceToRoot,
  withAccent,
  withAppearance,
} from "../services/theme-runtime";
import type {
  AccentThemeId,
  AppearanceMode,
  ThemePreference,
  ThemeRuntimeState,
} from "../types/theme.types";

interface ThemeContextValue extends ThemeRuntimeState {
  setAppearance: (appearance: AppearanceMode) => void;
  setAccent: (accent: AccentThemeId) => void;
}

const initialRuntimeState: ThemeRuntimeState = {
  ...DEFAULT_THEME_PREFERENCE,
  resolvedAppearance: "dark",
  hydrated: false,
};

const ThemeContext = React.createContext<ThemeContextValue | null>(
  null,
);

function getSystemPrefersDark() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [runtime, setRuntime] =
    React.useState<ThemeRuntimeState>(initialRuntimeState);
  const preferenceRef = React.useRef<ThemePreference>(
    DEFAULT_THEME_PREFERENCE,
  );
  const transitionTimeoutRef =
    React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyPreference = React.useCallback(
    (
      preference: ThemePreference,
      options: { persist?: boolean; animate?: boolean } = {},
    ) => {
      preferenceRef.current = preference;
      const root = document.documentElement;

      if (options.animate) {
        root.classList.add("theme-transitioning");
        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current);
        }
        transitionTimeoutRef.current = setTimeout(() => {
          root.classList.remove("theme-transitioning");
        }, 180);
      }

      const resolvedAppearance = applyThemePreferenceToRoot(
        root,
        preference,
        getSystemPrefersDark(),
      );
      setRuntime({
        ...preference,
        resolvedAppearance,
        hydrated: true,
      });

      if (options.persist) {
        saveThemePreference(preference);
      }
    },
    [],
  );

  React.useEffect(() => {
    const storage = getBrowserThemeStorage();
    applyPreference(loadThemePreference(storage));

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );
    const handleSystemChange = (event: MediaQueryListEvent) => {
      const preference = preferenceRef.current;
      if (preference.appearance !== "system") {
        return;
      }

      const resolvedAppearance = applyThemePreferenceToRoot(
        document.documentElement,
        preference,
        event.matches,
      );
      setRuntime((current) => ({
        ...current,
        resolvedAppearance,
      }));
    };
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) {
        return;
      }

      const preference = parseThemeStorageEvent(
        event.key,
        event.newValue,
      );
      if (!preference) {
        return;
      }

      applyPreference(preference, {
        animate: true,
      });
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemChange);
      window.removeEventListener("storage", handleStorageChange);
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [applyPreference]);

  const setAppearance = React.useCallback(
    (appearance: AppearanceMode) => {
      applyPreference(
        withAppearance(preferenceRef.current, appearance),
        { animate: true, persist: true },
      );
    },
    [applyPreference],
  );

  const setAccent = React.useCallback(
    (accent: AccentThemeId) => {
      applyPreference(
        withAccent(preferenceRef.current, accent),
        { animate: true, persist: true },
      );
    },
    [applyPreference],
  );

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      ...runtime,
      setAppearance,
      setAccent,
    }),
    [runtime, setAccent, setAppearance],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useKizunaTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useKizunaTheme must be used within ThemeProvider",
    );
  }

  return context;
}
