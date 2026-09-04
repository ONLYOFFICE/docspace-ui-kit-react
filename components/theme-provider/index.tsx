"use client";

import { useEffect } from "react";

import { InterfaceDirectionProvider } from "../../context/InterfaceDirectionContext";
import { ThemeContextProvider as CustomThemeProvider } from "../../context/ThemeContext";

import type { ThemeProviderProps } from "./ThemeProvider.types";
import "./ThemeProvider.scss";

export type { ThemeProviderProps };

export const ThemeProviderComponent = ({
	theme,
	currentColorScheme,
	children,
}: ThemeProviderProps) => {
	useEffect(() => {
		const root = document.documentElement;

		const themeStr =
			"isBase" in theme ? (theme.isBase ? "light" : "dark") : "light";
		const dir =
			"interfaceDirection" in theme
				? (theme.interfaceDirection as "ltr" | "rtl")
				: "ltr";

		root.setAttribute("data-theme", themeStr);
		root.setAttribute("data-dir", dir);
		root.style.setProperty("--interface-direction", dir);

		const body = document.body;
		body.classList.remove("light", "dark");
		body.classList.remove("ltr", "rtl");
		body.classList.add(themeStr);
		body.classList.add(dir);
		body.style.setProperty(
			"--font-family",
			"fontFamily" in theme
				? (theme.fontFamily as string)
				: "Open Sans, sans-serif, Arial",
		);
	}, [theme]);

	useEffect(() => {
		const root = document.documentElement;
		const body = document.body;

		if (currentColorScheme?.main) {
			root.style.setProperty(
				"--color-scheme-main-accent",
				currentColorScheme?.main?.accent ?? null,
			);
			root.style.setProperty(
				"--color-scheme-text-accent",
				currentColorScheme.text?.accent ?? null,
			);
			root.style.setProperty(
				"--color-scheme-main-buttons",
				currentColorScheme.main?.buttons ?? null,
			);
			root.style.setProperty(
				"--color-scheme-text-buttons",
				currentColorScheme.text?.buttons ?? null,
			);

			body.style.setProperty(
				"--color-scheme-main-accent",
				currentColorScheme.main?.accent ?? null,
			);
			body.style.setProperty(
				"--color-scheme-text-accent",
				currentColorScheme.text?.accent ?? null,
			);
			body.style.setProperty(
				"--color-scheme-main-buttons",
				currentColorScheme.main?.buttons ?? null,
			);
			body.style.setProperty(
				"--color-scheme-text-buttons",
				currentColorScheme.text?.buttons ?? null,
			);
		}
	}, [currentColorScheme]);

	return (
		<InterfaceDirectionProvider
			interfaceDirection={theme.interfaceDirection as "ltr" | "rtl"}
		>
			<CustomThemeProvider
				theme={theme.isBase ? "Base" : "Dark"}
				currentColorScheme={currentColorScheme}
			>
				{children}
			</CustomThemeProvider>
		</InterfaceDirectionProvider>
	);
};
