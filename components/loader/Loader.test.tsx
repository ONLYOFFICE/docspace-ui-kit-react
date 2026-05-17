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
import { screen, render } from "@testing-library/react";

import { LoaderTypes } from "./Loader.enums";

import { Loader } from ".";

const baseProps = {
	type: LoaderTypes.base,
	color: "black",
	size: "18px",
	label: "Loading",
};

describe("<Loader />", () => {
	it("renders without error", () => {
		render(<Loader {...baseProps} />);
		expect(screen.getByTestId("loader")).toBeInTheDocument();
	});

	it("renders base type with text", () => {
		render(<Loader {...baseProps} />);
		expect(screen.getByText("Loading")).toBeInTheDocument();
	});

	it("renders oval type", () => {
		render(<Loader {...baseProps} type={LoaderTypes.oval} />);
		expect(screen.getByTestId("loader")).toBeInTheDocument();
		expect(screen.getByTestId("oval-loader")).toBeInTheDocument();
	});

	it("renders dual-ring type", () => {
		render(<Loader {...baseProps} type={LoaderTypes.dualRing} />);
		expect(screen.getByTestId("loader")).toBeInTheDocument();
		expect(screen.getByTestId("dual-ring-loader")).toBeInTheDocument();
	});

	it("renders rombs type", () => {
		render(<Loader {...baseProps} type={LoaderTypes.rombs} />);
		expect(screen.getByTestId("loader")).toBeInTheDocument();
		expect(screen.getByTestId("rombs-loader")).toBeInTheDocument();
	});

	it("renders track type", () => {
		render(<Loader {...baseProps} type={LoaderTypes.track} />);
		expect(screen.getByTestId("loader")).toBeInTheDocument();
		expect(screen.getByTestId("track-loader")).toBeInTheDocument();
	});

	it("accepts custom className", () => {
		render(<Loader {...baseProps} className="custom-loader" />);
		expect(screen.getByTestId("loader")).toHaveClass("custom-loader");
	});

	it("accepts custom style", () => {
		const customStyle = { marginTop: "20px" };
		render(<Loader {...baseProps} style={customStyle} />);
		expect(screen.getByTestId("loader")).toHaveStyle(customStyle);
	});

	it("accepts custom id", () => {
		render(<Loader {...baseProps} id="custom-loader" />);
		expect(screen.getByTestId("loader")).toHaveAttribute("id", "custom-loader");
	});
});
