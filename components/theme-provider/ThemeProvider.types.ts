import type { TColorScheme } from "../../context/ThemeContext";

export type ThemeProviderProps = {
  /** The theme object. Only three of its keys are read: `isBase` chooses light or dark, `interfaceDirection` sets the writing direction, and `fontFamily` becomes `--font-family` on the body. The type accepts any object, so a missing key is not a compile error. */
  theme: Record<string, unknown>;
  /** The portal's accent colours. When its `main` is present, eight custom properties are written onto both the document root and the body; otherwise nothing is written and nothing is cleared. */
  currentColorScheme?: TColorScheme;
  /** The tree the React context applies to. The classes and attributes this component sets are global and apply to the whole document, not only to these children. */
  children: React.ReactNode;
};
