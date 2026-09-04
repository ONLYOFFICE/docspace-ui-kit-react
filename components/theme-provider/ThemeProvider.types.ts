import type { TColorScheme } from "../../context/ThemeContext";

export type ThemeProviderProps = {
	/** Applies a theme to all children components */
	theme: Record<string, unknown>;
	/** Applies a currentColorScheme to all children components */
	currentColorScheme?: TColorScheme;
	/** Child elements */
	children: React.ReactNode;
};
