import type { TColorScheme } from "../../context/ThemeContext";

export type ThemeProviderProps = {
  /** The theme object. `isBase` picks light or dark, `interfaceDirection` the writing direction, and `fontFamily` the font of every element. Other keys are ignored, and the type checks none of them. */
  theme: Record<string, unknown>;
  /** The accent colours and the text drawn on them. They reach the page only when `main` is present; leaving the scheme out later takes them off. */
  currentColorScheme?: TColorScheme;
  /** The tree that receives the theme and direction context. The theme, direction and colours themselves apply to the whole page, not only to these children. */
  children: React.ReactNode;
};
