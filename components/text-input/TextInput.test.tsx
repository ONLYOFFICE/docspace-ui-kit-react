import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TextInput } from ".";
import { InputSize, InputType } from "./TextInput.enums";

describe("<TextInput />", () => {
	const defaultProps = {
		value: "text",
		size: InputSize.base,
		type: InputType.text,
		onChange: vi.fn(),
	};

	it("renders without error", () => {
		render(<TextInput {...defaultProps} />);

		const input = screen.getByTestId("text-input");
		expect(input).toBeInTheDocument();
		expect(input).toHaveValue(defaultProps.value);
	});

	it("applies custom className and id", () => {
		const testProps = {
			...defaultProps,
			className: "custom-class",
			id: "custom-id",
		};

		render(<TextInput {...testProps} />);

		const input = screen.getByTestId("text-input");
		expect(input).toHaveClass("custom-class");
		expect(input).toHaveAttribute("id", "custom-id");
	});

	it("handles disabled state correctly", () => {
		render(<TextInput {...defaultProps} isDisabled />);

		const input = screen.getByTestId("text-input");
		expect(input).toBeDisabled();
	});

	it("handles readonly state correctly", () => {
		render(<TextInput {...defaultProps} isReadOnly />);

		const input = screen.getByTestId("text-input");
		expect(input).toHaveAttribute("readonly");
	});

	it("shows placeholder text", () => {
		const placeholder = "Enter text here";
		render(<TextInput {...defaultProps} placeholder={placeholder} />);

		expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
	});

	it("calls onChange when text is entered", async () => {
		const onChange = vi.fn();
		render(<TextInput {...defaultProps} onChange={onChange} />);

		const input = screen.getByTestId("text-input");
		await userEvent.type(input, "a");

		expect(onChange).toHaveBeenCalled();
	});

	it("calls onFocus when input is focused", () => {
		const onFocus = vi.fn();
		render(<TextInput {...defaultProps} onFocus={onFocus} />);

		const input = screen.getByTestId("text-input");
		fireEvent.focus(input);

		expect(onFocus).toHaveBeenCalled();
	});

	it("calls onBlur when input loses focus", () => {
		const onBlur = vi.fn();
		render(<TextInput {...defaultProps} onBlur={onBlur} />);

		const input = screen.getByTestId("text-input");
		fireEvent.blur(input);

		expect(onBlur).toHaveBeenCalled();
	});

	it("applies error styles when hasError is true", () => {
		render(<TextInput {...defaultProps} hasError />);

		const input = screen.getByTestId("text-input");
		expect(input).toHaveAttribute("data-error", "true");
	});

	it("applies warning styles when hasWarning is true", () => {
		render(<TextInput {...defaultProps} hasWarning />);

		const input = screen.getByTestId("text-input");
		expect(input).toHaveAttribute("data-warning", "true");
	});

	it("handles maxLength correctly", () => {
		const maxLength = 5;
		render(<TextInput {...defaultProps} maxLength={maxLength} />);

		const input = screen.getByTestId("text-input");
		expect(input).toHaveAttribute("maxLength", String(maxLength));
	});

	it("applies correct size class", () => {
		render(<TextInput {...defaultProps} size={InputSize.large} />);

		const input = screen.getByTestId("text-input");
		expect(input).toHaveAttribute("data-size", InputSize.large);
	});

	it("applies correct type attribute", () => {
		render(<TextInput {...defaultProps} type={InputType.password} />);

		const input = screen.getByTestId("text-input");
		expect(input).toHaveAttribute("type", "password");
	});

	it("handles name attribute correctly", () => {
		render(<TextInput {...defaultProps} name="username" />);

		const input = screen.getByTestId("text-input");
		expect(input).toHaveAttribute("name", "username");
	});

	it("handles tabIndex correctly", () => {
		render(<TextInput {...defaultProps} tabIndex={2} />);

		const input = screen.getByTestId("text-input");
		expect(input).toHaveAttribute("tabindex", "2");
	});

	it("handles autoComplete attribute", () => {
		render(<TextInput {...defaultProps} autoComplete="off" />);

		const input = screen.getByTestId("text-input");
		expect(input).toHaveAttribute("autocomplete", "off");
	});

	it("handles custom style prop", () => {
		const customStyle = { color: "red", marginTop: "10px" };
		render(<TextInput {...defaultProps} style={customStyle} />);

		const input = screen.getByTestId("text-input");
		expect(input.style.color).toBe("red");
		expect(input.style.marginTop).toBe("10px");
	});

	it("handles font weight props correctly", () => {
		render(<TextInput {...defaultProps} fontWeight={700} />);

		const input = screen.getByTestId("text-input");
		expect(input.style.fontWeight).toBe("700");
	});

	it("applies bold style when isBold is true", () => {
		render(<TextInput {...defaultProps} isBold />);

		const input = screen.getByTestId("text-input");
		expect(input.style.fontWeight).toBe("600");
	});

	it("handles inputMode correctly", () => {
		render(<TextInput {...defaultProps} inputMode="numeric" />);

		const input = screen.getByTestId("text-input");
		expect(input).toHaveAttribute("inputmode", "numeric");
	});

	it("handles dir attribute", () => {
		render(<TextInput {...defaultProps} dir="rtl" />);

		const input = screen.getByTestId("text-input");
		expect(input).toHaveAttribute("dir", "rtl");
	});

	it("calls onKeyDown when key is pressed", () => {
		const onKeyDown = vi.fn();
		render(<TextInput {...defaultProps} onKeyDown={onKeyDown} />);

		const input = screen.getByTestId("text-input");
		fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

		expect(onKeyDown).toHaveBeenCalled();
	});

	it("calls onClick when clicked", () => {
		const onClick = vi.fn();
		render(<TextInput {...defaultProps} onClick={onClick} />);

		const input = screen.getByTestId("text-input");
		fireEvent.click(input);

		expect(onClick).toHaveBeenCalled();
	});

	it("calls onContextMenu on right click", () => {
		const onContextMenu = vi.fn();
		render(<TextInput {...defaultProps} onContextMenu={onContextMenu} />);

		const input = screen.getByTestId("text-input");
		fireEvent.contextMenu(input);

		expect(onContextMenu).toHaveBeenCalled();
	});

	it("handles scale prop correctly", () => {
		render(<TextInput {...defaultProps} scale />);

		const input = screen.getByTestId("text-input");
		expect(input).toHaveAttribute("data-scale", "true");
	});

	it("handles withBorder prop correctly", () => {
		render(<TextInput {...defaultProps} withBorder={false} />);

		const input = screen.getByTestId("text-input");
		expect(input).toHaveAttribute("data-without-border", "true");
	});

	describe("mask functionality", () => {
		it("handles keepCharPositions prop with mask", () => {
			const mask = [/\d/, /\d/, "-", /\d/, /\d/];
			render(
				<TextInput
					{...defaultProps}
					mask={mask}
					keepCharPositions
					value="1234"
				/>,
			);

			const input = screen.getByTestId("text-input");
			expect(input).toHaveAttribute("data-keep-char-positions", "true");
		});

		it("handles guide prop with mask", () => {
			const mask = [/\d/, /\d/, "-", /\d/, /\d/];
			render(<TextInput {...defaultProps} mask={mask} guide value="12" />);

			const input = screen.getByTestId("text-input");
			expect(input).toHaveAttribute("data-guide", "true");
		});
	});

	describe("memoization", () => {
		it("does not re-render when props are equal", () => {
			const { rerender } = render(<TextInput {...defaultProps} />);

			const input = screen.getByTestId("text-input");
			expect(input).toHaveValue(defaultProps.value);

			rerender(<TextInput {...defaultProps} />);

			expect(screen.getByTestId("text-input")).toHaveValue(defaultProps.value);
		});

		it("re-renders when props change", () => {
			const { rerender } = render(<TextInput {...defaultProps} />);

			expect(screen.getByTestId("text-input")).toHaveValue("text");

			rerender(<TextInput {...defaultProps} value="new text" />);

			expect(screen.getByTestId("text-input")).toHaveValue("new text");
		});
	});
});
