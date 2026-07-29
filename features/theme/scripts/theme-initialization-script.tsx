import { createThemeInitializationScript } from "./theme-initialization-source";

export function ThemeInitializationScript() {
  return (
    <script
      id="kizuna-theme-init"
      dangerouslySetInnerHTML={{
        __html: createThemeInitializationScript(),
      }}
    />
  );
}
