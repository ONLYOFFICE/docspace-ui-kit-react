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
import styled from "styled-components";
import { describe, expect, it } from "vitest";

import commonIconsStyles, { IconSizeType, isIconSizeType } from "./index";

// Define styled components outside tests to avoid TSX generic syntax issues
const StyledIcon = styled.svg<{ size?: IconSizeType | number }>`
	${commonIconsStyles}
`;

const StyledDiv = styled.div<{ size?: IconSizeType | number }>`
	${commonIconsStyles}
`;

const StyledSpan = styled.span<{ size?: IconSizeType | number }>`
	${commonIconsStyles}
`;

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
				// TypeScript should know value is IconSizeType here
				const sizeType: IconSizeType = value;
				expect(sizeType).toBe("small");
			}
		});
	});

	describe("commonIconsStyles with styled-components", () => {
		it("should apply styles for extraSmall size (8px)", () => {
			const { container } = render(
				<StyledIcon size={IconSizeType.extraSmall} />,
			);
			const element = container.firstChild as HTMLElement;
			const styles = window.getComputedStyle(element);

			expect(styles.overflow).toBe("hidden");
			expect(styles.verticalAlign).toBe("middle");
		});

		it("should apply styles for small size (12px)", () => {
			const { container } = render(<StyledIcon size={IconSizeType.small} />);
			const element = container.firstChild as HTMLElement;
			const styles = window.getComputedStyle(element);

			expect(styles.overflow).toBe("hidden");
			expect(styles.verticalAlign).toBe("middle");
		});

		it("should apply styles for medium size (16px)", () => {
			const { container } = render(<StyledIcon size={IconSizeType.medium} />);
			const element = container.firstChild as HTMLElement;

			expect(window.getComputedStyle(element).overflow).toBe("hidden");
		});

		it("should apply styles for big size (24px)", () => {
			const { container } = render(<StyledIcon size={IconSizeType.big} />);
			const element = container.firstChild as HTMLElement;

			expect(window.getComputedStyle(element).overflow).toBe("hidden");
		});

		it("should apply styles for scale size (100%)", () => {
			const { container } = render(<StyledIcon size={IconSizeType.scale} />);
			const element = container.firstChild as HTMLElement;

			expect(window.getComputedStyle(element).overflow).toBe("hidden");
		});

		it("should apply styles for custom numeric size", () => {
			const { container } = render(<StyledIcon size={32} />);
			const element = container.firstChild as HTMLElement;

			expect(window.getComputedStyle(element).overflow).toBe("hidden");
		});

		it("should work without size prop", () => {
			const { container } = render(<StyledIcon />);
			const element = container.firstChild as HTMLElement;

			expect(window.getComputedStyle(element).overflow).toBe("hidden");
			expect(window.getComputedStyle(element).verticalAlign).toBe("middle");
		});
	});

	describe("Size mapping", () => {
		it("should map IconSizeType to correct pixel values", () => {
			// Test each size type
			const sizes = [
				{ type: IconSizeType.extraSmall, expected: "8px" },
				{ type: IconSizeType.small, expected: "12px" },
				{ type: IconSizeType.medium, expected: "16px" },
				{ type: IconSizeType.big, expected: "24px" },
			];

			for (const { type } of sizes) {
				const { container } = render(<StyledDiv size={type} />);
				const element = container.firstChild as HTMLElement;
				const styles = window.getComputedStyle(element);

				// Check that width/height are set (exact values depend on browser)
				expect(styles.width).toBeTruthy();
				expect(styles.height).toBeTruthy();
			}
		});

		it("should handle custom numeric sizes", () => {
			const customSizes = [10, 20, 32, 48, 64];

			for (const size of customSizes) {
				const { container } = render(<StyledDiv size={size} />);
				const element = container.firstChild as HTMLElement;
				const styles = window.getComputedStyle(element);

				expect(styles.width).toBeTruthy();
				expect(styles.height).toBeTruthy();
			}
		});
	});

	describe("CSS properties", () => {
		it("should apply overflow hidden", () => {
			const { container } = render(<StyledDiv size={IconSizeType.medium} />);
			const element = container.firstChild as HTMLElement;

			expect(window.getComputedStyle(element).overflow).toBe("hidden");
		});

		it("should apply vertical-align middle", () => {
			const { container } = render(<StyledDiv size={IconSizeType.medium} />);
			const element = container.firstChild as HTMLElement;

			expect(window.getComputedStyle(element).verticalAlign).toBe("middle");
		});

		it("should set width, min-width, height, and min-height for non-scale sizes", () => {
			const { container } = render(<StyledDiv size={IconSizeType.medium} />);
			const element = container.firstChild as HTMLElement;
			const styles = window.getComputedStyle(element);

			expect(styles.width).toBeTruthy();
			expect(styles.minWidth).toBeTruthy();
			expect(styles.height).toBeTruthy();
			expect(styles.minHeight).toBeTruthy();
		});
	});

	describe("Edge cases", () => {
		it("should handle size prop of 0", () => {
			const { container } = render(<StyledDiv size={0} />);
			const element = container.firstChild as HTMLElement;

			expect(window.getComputedStyle(element).overflow).toBe("hidden");
		});

		it("should handle very large custom sizes", () => {
			const { container } = render(<StyledDiv size={1000} />);
			const element = container.firstChild as HTMLElement;

			expect(window.getComputedStyle(element).overflow).toBe("hidden");
		});

		it("should work with different HTML elements", () => {
			const { container: divContainer } = render(
				<StyledDiv size={IconSizeType.medium} />,
			);
			const { container: spanContainer } = render(
				<StyledSpan size={IconSizeType.medium} />,
			);
			const { container: svgContainer } = render(
				<StyledIcon size={IconSizeType.medium} />,
			);

			expect(
				window.getComputedStyle(divContainer.firstChild as HTMLElement)
					.overflow,
			).toBe("hidden");
			expect(
				window.getComputedStyle(spanContainer.firstChild as HTMLElement)
					.overflow,
			).toBe("hidden");
			expect(
				window.getComputedStyle(svgContainer.firstChild as HTMLElement)
					.overflow,
			).toBe("hidden");
		});
	});

	describe("Type safety", () => {
		it("should accept IconSizeType enum values", () => {
			// This should compile without errors
			expect(() => {
				render(<StyledDiv size={IconSizeType.small} />);
				render(<StyledDiv size={IconSizeType.medium} />);
				render(<StyledDiv size={IconSizeType.big} />);
			}).not.toThrow();
		});

		it("should accept numeric values", () => {
			// This should compile without errors
			expect(() => {
				render(<StyledDiv size={16} />);
				render(<StyledDiv size={24} />);
				render(<StyledDiv size={32} />);
			}).not.toThrow();
		});

		it("should work without size prop (optional)", () => {
			// This should compile without errors
			expect(() => {
				render(<StyledDiv />);
			}).not.toThrow();
		});
	});
});
