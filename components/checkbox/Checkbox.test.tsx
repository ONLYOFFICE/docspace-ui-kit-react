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
