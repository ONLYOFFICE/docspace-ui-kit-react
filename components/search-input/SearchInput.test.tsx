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

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { InputSize } from "../text-input";
import { SearchInput } from ".";

const baseProps = {
	value: "",
	size: InputSize.base,
};

describe("<SearchInput />", () => {
	it("renders without error", () => {
		render(<SearchInput {...baseProps} />);
		expect(screen.getByTestId("search-input")).toBeInTheDocument();
	});

	it("renders with different sizes", () => {
		const { rerender } = render(
			<SearchInput {...baseProps} size={InputSize.base} />,
		);
		expect(screen.getByTestId("text-input")).toHaveAttribute(
			"data-size",
			InputSize.base,
		);

		rerender(<SearchInput {...baseProps} size={InputSize.middle} />);
		expect(screen.getByTestId("text-input")).toHaveAttribute(
			"data-size",
			InputSize.middle,
		);

		rerender(<SearchInput {...baseProps} size={InputSize.large} />);
		expect(screen.getByTestId("text-input")).toHaveAttribute(
			"data-size",
			InputSize.large,
		);
	});

	it("handles input changes", async () => {
		const onChange = vi.fn();
		render(<SearchInput {...baseProps} onChange={onChange} />);

		const input = screen.getByTestId("text-input");
		await userEvent.type(input, "test");

		expect(input).toHaveValue("test");
	});

	it("handles auto refresh with timeout", async () => {
		const onChange = vi.fn();
		render(
			<SearchInput
				{...baseProps}
				onChange={onChange}
				autoRefresh
				refreshTimeout={500}
			/>,
		);

		const input = screen.getByTestId("text-input");
		await userEvent.type(input, "test");

		await waitFor(
			() => {
				expect(onChange).toHaveBeenCalledWith("test");
			},
			{ timeout: 600 },
		);
	});

	it("handles disabled state", () => {
		render(<SearchInput {...baseProps} isDisabled />);
		expect(screen.getByTestId("text-input")).toBeDisabled();
	});

	it("accepts custom className and id", () => {
		render(
			<SearchInput {...baseProps} className="custom-class" id="custom-id" />,
		);
		const input = screen.getByTestId("search-input");

		expect(input).toHaveClass("custom-class");
		expect(input).toHaveAttribute("id", "custom-id");
	});

	it("handles focus events", async () => {
		const onFocus = vi.fn();
		render(<SearchInput {...baseProps} onFocus={onFocus} />);

		const input = screen.getByTestId("text-input");
		await userEvent.click(input);

		expect(onFocus).toHaveBeenCalled();
	});

	it("shows clear button when input has value", () => {
		render(<SearchInput {...baseProps} value="test" />);
		const { container } = render(<SearchInput {...baseProps} value="test" />);
		const iconButton = container.getElementsByClassName("search-cross")[0];
		expect(iconButton).toBeInTheDocument();
	});

	it("shows clear button when showClearButton is true", () => {
		render(<SearchInput {...baseProps} showClearButton />);
		const { container } = render(
			<SearchInput {...baseProps} showClearButton />,
		);
		const iconButton = container.getElementsByClassName("search-cross")[0];
		expect(iconButton).toBeInTheDocument();
	});

	it("shows search icon by default", () => {
		render(<SearchInput {...baseProps} />);
		const { container } = render(<SearchInput {...baseProps} />);
		const iconButton = container.getElementsByClassName("search-loupe")[0];
		expect(iconButton).toBeInTheDocument();
	});

	it("updates input value when prop value changes", () => {
		const { rerender } = render(<SearchInput {...baseProps} value="initial" />);
		const input = screen.getByTestId("text-input");
		expect(input).toHaveValue("initial");

		rerender(<SearchInput {...baseProps} value="updated" />);
		expect(input).toHaveValue("updated");
	});

	it("renders main button when showMainButton and mainButtonProps are provided", () => {
		render(
			<SearchInput
				{...baseProps}
				showMainButton
				mainButtonProps={{ text: "New room", model: [] }}
			/>,
		);
		expect(screen.getByText("New room")).toBeInTheDocument();
	});

	it("does not render main button when showMainButton is false", () => {
		render(
			<SearchInput
				{...baseProps}
				showMainButton={false}
				mainButtonProps={{ text: "New room", model: [] }}
			/>,
		);
		expect(screen.queryByText("New room")).not.toBeInTheDocument();
	});

	it("does not render main button when mainButtonProps is not provided", () => {
		render(<SearchInput {...baseProps} showMainButton />);
		expect(screen.queryByTestId("main-button")).not.toBeInTheDocument();
	});

	it("clears input and calls onClearSearch when clear button is clicked", async () => {
		const onClearSearch = vi.fn();
		const { container } = render(
			<SearchInput {...baseProps} value="test value" onClearSearch={onClearSearch} />,
		);

		const input = screen.getByTestId("text-input");
		expect(input).toHaveValue("test value");

		const clearButton = container.getElementsByClassName("search-cross")[0];
		await userEvent.click(clearButton);

		expect(input).toHaveValue("");
		expect(onClearSearch).toHaveBeenCalledTimes(1);
	});
});
