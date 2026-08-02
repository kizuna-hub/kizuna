export type AppearanceMode = "light" | "dark" | "system";

export type ResolvedAppearance = "light" | "dark";

export type AccentThemeId =
  | "kizuna"
  | "ocean"
  | "violet"
  | "amber"
  | "rose"
  | "graphite"
  | "monochrome";

export interface ThemePreference {
  version: 1;
  appearance: AppearanceMode;
  accent: AccentThemeId;
}

export interface ThemeRuntimeState extends ThemePreference {
  resolvedAppearance: ResolvedAppearance;
  hydrated: boolean;
}

export interface AccentAppearanceTokens {
  primary: string;
  primaryHover: string;
  primaryActive: string;
  primaryForeground: string;
  primaryAction: string;
  primaryActionHover: string;
  primaryActionActive: string;
  primaryActionForeground: string;
  primaryMuted: string;
  primaryMutedHover: string;
  primaryMutedForeground: string;
  primaryBorder: string;
  primaryText: string;
  ring: string;
  selection: string;
}

export interface AccentThemeDefinition {
  id: AccentThemeId;
  label: string;
  previewLabel: string;
  baseColor: string;
  light: AccentAppearanceTokens;
  dark: AccentAppearanceTokens;
}

export interface ThemeRootElement {
  classList: {
    toggle: (
      token: string,
      force?: boolean,
    ) => boolean | void;
  };
  style: {
    setProperty: (property: string, value: string) => void;
  };
  setAttribute: (name: string, value: string) => void;
}
