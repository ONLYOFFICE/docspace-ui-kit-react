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

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { Label } from ".";

const baseProps = {
	text: "First name:",
	title: "first name",
	htmlFor: "firstNameField",
	display: "block",
};

describe("Label Component", () => {
	it("renders without error", () => {
		render(<Label {...baseProps}>Test label</Label>);
		expect(screen.getByTestId("label")).toBeInTheDocument();
	});

	it("renders with required indicator when isRequired is true", () => {
		render(<Label {...baseProps} isRequired />);
		const label = screen.getByTestId("label");
		expect(label).toHaveTextContent("*");
	});

	it("applies error styles when error prop is true", () => {
		render(<Label {...baseProps} error />);
		const label = screen.getByTestId("label");
		// Component applies color as a CSS variable for external customization
		expect(label.style.color).toMatch(/var\(--label-error-color/);
	});

	it("renders with custom className", () => {
		const className = "custom-label";
		render(<Label {...baseProps} className={className} />);
		expect(screen.getByTestId("label")).toHaveClass(className);
	});

	it("renders with custom style", () => {
		const customStyle = { marginBottom: "10px" };
		render(<Label {...baseProps} style={customStyle} />);
		expect(screen.getByTestId("label")).toHaveStyle(customStyle);
	});

	it("renders children correctly", () => {
		const childText = "Child content";
		render(<Label {...baseProps}>{childText}</Label>);
		expect(screen.getByTestId("label")).toHaveTextContent(childText);
	});

	it("renders with correct htmlFor attribute", () => {
		render(<Label {...baseProps} />);
		expect(screen.getByTestId("label")).toHaveAttribute(
			"for",
			baseProps.htmlFor,
		);
	});

	it("renders with correct text content", () => {
		render(<Label {...baseProps} />);
		expect(screen.getByTestId("label")).toHaveTextContent(baseProps.text);
	});

	it("renders with title attribute", () => {
		render(<Label {...baseProps} />);
		expect(screen.getByTestId("label")).toHaveAttribute(
			"title",
			baseProps.title,
		);
	});

	it("renders with truncate prop", () => {
		render(<Label {...baseProps} truncate />);
		expect(screen.getByTestId("label")).toHaveAttribute(
			"data-truncate",
			"true",
		);
	});
});
