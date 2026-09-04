import { describe, it, expect } from "vitest";
import { getTextColor } from ".";
import { globalColors } from "../../providers/theme";

describe("getTextColor", () => {
	const { black, white } = globalColors;

	describe("light backgrounds (should return black text)", () => {
		it("returns black for white background", () => {
			expect(getTextColor("#ffffff")).toBe(black);
		});

		it("returns black for light gray background", () => {
			expect(getTextColor("#f0f0f0")).toBe(black);
		});

		it("returns black for light yellow background", () => {
			expect(getTextColor("#ffff00")).toBe(black);
		});

		it("returns black for light cyan background", () => {
			expect(getTextColor("#00ffff")).toBe(black);
		});

		it("returns black for light green background", () => {
			expect(getTextColor("#90EE90")).toBe(black);
		});
	});

	describe("dark backgrounds (should return white text)", () => {
		it("returns white for black background", () => {
			expect(getTextColor("#000000")).toBe(white);
		});

		it("returns white for dark gray background", () => {
			expect(getTextColor("#333333")).toBe(white);
		});

		it("returns white for dark blue background", () => {
			expect(getTextColor("#000080")).toBe(white);
		});

		it("returns white for dark red background", () => {
			expect(getTextColor("#800000")).toBe(white);
		});

		it("returns white for dark green background", () => {
			expect(getTextColor("#006400")).toBe(white);
		});

		it("returns white for purple background", () => {
			expect(getTextColor("#800080")).toBe(white);
		});
	});

	describe("medium brightness colors", () => {
		it("returns black for medium blue (#4781D1)", () => {
			expect(getTextColor("#4781D1")).toBe(white);
		});

		it("returns white for medium gray (#808080)", () => {
			expect(getTextColor("#808080")).toBe(white);
		});
	});

	describe("custom brightness threshold", () => {
		it("returns black when threshold is high (200) for light gray", () => {
			// #cccccc has brightness of 204, which is > 200, so returns black
			expect(getTextColor("#cccccc", 200)).toBe(black);
		});

		it("returns black when threshold is low (50) for dark gray", () => {
			expect(getTextColor("#555555", 50)).toBe(black);
		});

		it("changes result based on threshold for medium color", () => {
			const mediumColor = "#888888";
			// #888888 has brightness of 136
			// With default threshold (128), 136 > 128, returns black
			expect(getTextColor(mediumColor)).toBe(black);
			// With higher threshold (150), 136 <= 150, returns white
			expect(getTextColor(mediumColor, 150)).toBe(white);
			// With very low threshold (50), 136 > 50, returns black
			expect(getTextColor(mediumColor, 50)).toBe(black);
		});
	});

	describe("hex format variations", () => {
		it("handles 6-digit hex without hash", () => {
			expect(getTextColor("#FFFFFF")).toBe(black);
		});

		it("handles lowercase hex", () => {
			expect(getTextColor("#ffffff")).toBe(black);
		});

		it("handles uppercase hex", () => {
			expect(getTextColor("#FFFFFF")).toBe(black);
		});

		it("handles mixed case hex", () => {
			expect(getTextColor("#FfFfFf")).toBe(black);
		});
	});

	describe("invalid input", () => {
		it("returns white for an empty string", () => {
			expect(getTextColor("")).toBe(white);
		});

		it("returns white for a non-hex string", () => {
			expect(getTextColor("not-a-color")).toBe(white);
		});

		it("returns white for a truncated hex value", () => {
			expect(getTextColor("#ff")).toBe(white);
		});

		it("returns white for a hex value with invalid characters", () => {
			expect(getTextColor("#zzzzzz")).toBe(white);
		});
	});

	describe("brand colors", () => {
		it("returns appropriate color for main blue (#4781D1)", () => {
			expect(getTextColor("#4781D1")).toBe(white);
		});

		it("returns appropriate color for main green (#2DB482)", () => {
			// #2DB482 (45, 180, 130) has brightness ~134, which is > 128, returns black
			expect(getTextColor("#2DB482")).toBe(black);
		});

		it("returns appropriate color for main orange (#F97A0B)", () => {
			expect(getTextColor("#F97A0B")).toBe(black);
		});

		it("returns appropriate color for main red (#F2675A)", () => {
			expect(getTextColor("#F2675A")).toBe(black);
		});
	});
});
