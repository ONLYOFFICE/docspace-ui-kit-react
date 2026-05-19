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

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { CheckboxProps } from "./Checkbox.types";
import { Checkbox } from ".";

const defaultProps: CheckboxProps = {
	name: "checkbox",
	isIndeterminate: false,
};

describe("<Checkbox />", () => {
	it("renders without error", () => {
		render(<Checkbox {...defaultProps} />);
		expect(screen.getByTestId("checkbox")).toBeInTheDocument();
	});

	it("renders with label", () => {
		const label = "Test Label";
		render(<Checkbox {...defaultProps} label={label} />);
		expect(screen.getByText(label)).toBeInTheDocument();
	});

	it("applies custom className and style", () => {
		const className = "custom-class";
		const style = { margin: "10px" };
		render(<Checkbox {...defaultProps} className={className} style={style} />);
		const checkbox = screen.getByTestId("checkbox");
		expect(checkbox).toHaveClass(className);
		expect(checkbox).toHaveStyle(style);
	});

	it("handles checked state correctly", async () => {
		const handleChange = vi.fn();
		render(<Checkbox {...defaultProps} onChange={handleChange} />);

		const checkbox = screen.getByRole("checkbox");
		await userEvent.click(checkbox);

		expect(handleChange).toHaveBeenCalled();
		expect(checkbox).toBeChecked();
	});

	it("handles disabled state correctly", async () => {
		const handleChange = vi.fn();
		render(<Checkbox {...defaultProps} isDisabled onChange={handleChange} />);

		const checkbox = screen.getByRole("checkbox");
		await userEvent.click(checkbox);

		expect(handleChange).not.toHaveBeenCalled();
		expect(checkbox).toBeDisabled();
	});

	it("handles indeterminate state correctly", () => {
		render(<Checkbox {...defaultProps} isIndeterminate />);
		const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
		expect(checkbox.indeterminate).toBe(true);
	});

	it("updates checked state when isChecked prop changes", () => {
		const { rerender } = render(
			<Checkbox {...defaultProps} isChecked={false} />,
		);
		const checkbox = screen.getByRole("checkbox");
		expect(checkbox).not.toBeChecked();

		rerender(<Checkbox {...defaultProps} isChecked />);
		expect(checkbox).toBeChecked();
	});

	it("displays help button when provided", () => {
		const helpButton = <button type="button">Help</button>;
		render(<Checkbox {...defaultProps} helpButton={helpButton} />);
		expect(screen.getByRole("button", { name: "Help" })).toBeInTheDocument();
	});

	it("maintains accessibility attributes", () => {
		const title = "Checkbox Title";
		render(<Checkbox {...defaultProps} title={title} />);
		const checkbox = screen.getByTestId("checkbox");
		expect(checkbox).toHaveAttribute("title", title);
	});

	it("prevents checkbox state change on help button click", async () => {
		const handleChange = vi.fn();
		const helpButton = <button type="button">Help</button>;

		render(
			<Checkbox
				{...defaultProps}
				onChange={handleChange}
				isChecked={false}
				helpButton={helpButton}
			/>,
		);

		const helpButtonWrapper = screen.getByTestId("checkbox-help-button");
		const checkbox = screen.getByRole("checkbox");

		await userEvent.click(helpButtonWrapper);

		expect(handleChange).not.toHaveBeenCalled();
		expect(checkbox).not.toBeChecked();
	});
});
