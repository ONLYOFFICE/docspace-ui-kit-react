import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";
import { ColorPicker } from "./ColorPicker";
import { globalColors } from "../../providers/theme";

describe("ColorPicker component", () => {
	const defaultProps = {
		isPickerOnly: false,
		appliedColor: globalColors.lightBlueMain,
	};

	const mockHandleChange = vi.fn();
	const mockOnApply = vi.fn();
	const mockOnClose = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders without error", () => {
		render(<ColorPicker {...defaultProps} />);
		expect(screen.getByTestId("color-picker")).toBeInTheDocument();
		expect(screen.getByTestId("color-picker-hex-input")).toBeInTheDocument();
		expect(screen.getByTestId("color-picker-hex-label")).toBeInTheDocument();
	});

	it("renders with custom props", () => {
		render(
			<ColorPicker
				{...defaultProps}
				className="custom-class"
				id="custom-id"
				applyButtonLabel="Custom Apply"
				cancelButtonLabel="Custom Cancel"
				hexCodeLabel="Custom Hex"
			/>,
		);

		expect(screen.getByTestId("color-picker-apply")).toHaveTextContent(
			"Custom Apply",
		);
		expect(screen.getByTestId("color-picker-cancel")).toHaveTextContent(
			"Custom Cancel",
		);
		expect(screen.getByTestId("color-picker-hex-label")).toHaveTextContent(
			"Custom Hex:",
		);
	});

	it("renders in picker-only mode", () => {
		render(<ColorPicker {...defaultProps} isPickerOnly />);

		expect(
			screen.queryByTestId("color-picker-buttons"),
		).not.toBeInTheDocument();
		expect(
			screen.queryByTestId("color-picker-hex-container"),
		).not.toBeInTheDocument();
		expect(screen.getByTestId("color-picker-close")).toBeInTheDocument();
		expect(screen.getByTestId("color-picker-title")).toBeInTheDocument();
	});

	it("calls handleChange when color is changed", () => {
		render(<ColorPicker {...defaultProps} handleChange={mockHandleChange} />);

		const hexInput = screen.getByTestId("color-picker-hex-input");
		fireEvent.change(hexInput, { target: { value: "#ff0000" } });

		expect(mockHandleChange).toHaveBeenCalledWith("#ff0000");
	});

	it("calls onApply with current color when Apply button is clicked", () => {
		render(
			<ColorPicker
				{...defaultProps}
				onApply={mockOnApply}
				appliedColor="#ff0000"
			/>,
		);

		const applyButton = screen.getByTestId("color-picker-apply");
		fireEvent.click(applyButton);

		expect(mockOnApply).toHaveBeenCalledWith("#ff0000");
	});

	it("calls onClose when Cancel button is clicked", () => {
		render(<ColorPicker {...defaultProps} onClose={mockOnClose} />);

		const cancelButton = screen.getByTestId("color-picker-cancel");
		fireEvent.click(cancelButton);

		expect(mockOnClose).toHaveBeenCalled();
	});

	it("calls onClose when close icon is clicked", () => {
		render(
			<ColorPicker {...defaultProps} onClose={mockOnClose} isPickerOnly />,
		);

		const closeButton = screen.getByTestId("color-picker-close");
		fireEvent.click(closeButton);
		expect(mockOnClose).toHaveBeenCalled();
	});

	it("displays the applied color in hex input", () => {
		const testColor = "#ff0000";
		render(<ColorPicker {...defaultProps} appliedColor={testColor} />);

		const hexInput = screen.getByTestId("color-picker-hex-input");
		expect(hexInput).toHaveValue(testColor);
	});

	it("has correct ARIA attributes", () => {
		render(<ColorPicker {...defaultProps} />);

		const colorPicker = screen.getByTestId("color-picker");
		expect(colorPicker).toHaveAttribute("role", "dialog");
		expect(colorPicker).toHaveAttribute("aria-label", "Color picker");

		const hexInput = screen.getByTestId("color-picker-hex-input");
		expect(hexInput).toHaveAttribute("aria-label", "Hex color value");

		const applyButton = screen.getByTestId("color-picker-apply");
		expect(applyButton).toHaveAttribute("aria-label", "Apply");

		const cancelButton = screen.getByTestId("color-picker-cancel");
		expect(cancelButton).toHaveAttribute("aria-label", "Cancel");
	});
});
