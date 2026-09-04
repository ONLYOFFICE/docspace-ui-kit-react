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
