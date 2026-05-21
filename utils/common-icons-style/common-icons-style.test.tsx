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

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IconSizeType, isIconSizeType } from "./index";

describe("common-icons-style", () => {
	describe("IconSizeType enum", () => {
		it("should have all expected size types", () => {
			expect(IconSizeType.extraSmall).toBe("extraSmall");
			expect(IconSizeType.small).toBe("small");
			expect(IconSizeType.medium).toBe("medium");
			expect(IconSizeType.big).toBe("big");
			expect(IconSizeType.scale).toBe("scale");
		});

		it("should have 5 size types", () => {
			const sizeTypes = Object.keys(IconSizeType);
			expect(sizeTypes).toHaveLength(5);
		});
	});

	describe("isIconSizeType", () => {
		it("should return true for valid IconSizeType values", () => {
			expect(isIconSizeType("extraSmall")).toBe(true);
			expect(isIconSizeType("small")).toBe(true);
			expect(isIconSizeType("medium")).toBe(true);
			expect(isIconSizeType("big")).toBe(true);
			expect(isIconSizeType("scale")).toBe(true);
		});

		it("should return false for invalid values", () => {
			expect(isIconSizeType("invalid")).toBe(false);
			expect(isIconSizeType("large")).toBe(false);
			expect(isIconSizeType("tiny")).toBe(false);
		});

		it("should return false for non-string values", () => {
			expect(isIconSizeType(16)).toBe(false);
			expect(isIconSizeType(null)).toBe(false);
			expect(isIconSizeType(undefined)).toBe(false);
			expect(isIconSizeType({})).toBe(false);
			expect(isIconSizeType([])).toBe(false);
			expect(isIconSizeType(true)).toBe(false);
		});

		it("should work as a type guard", () => {
			const value: unknown = "small";

			if (isIconSizeType(value)) {
				const sizeType: IconSizeType = value;
				expect(sizeType).toBe("small");
			}
		});
	});

	describe("data-size attribute pattern", () => {
		it("should set data-size attribute for each IconSizeType", () => {
			for (const size of Object.values(IconSizeType)) {
				const { container } = render(<div data-size={size} />);
				const element = container.firstChild as HTMLElement;
				expect(element.getAttribute("data-size")).toBe(size);
			}
		});

		it("should set data-size attribute for custom numeric size", () => {
			const { container } = render(<div data-size={32} />);
			const element = container.firstChild as HTMLElement;
			expect(element.getAttribute("data-size")).toBe("32");
		});
	});
});
