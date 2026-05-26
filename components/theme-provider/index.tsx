/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
