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
