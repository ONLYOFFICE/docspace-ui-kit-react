import React, { useEffect, useState } from "react";
import { describe, it, expect } from "vitest";
import { screen, render, waitFor } from "@testing-library/react";

import { FieldContainer } from "./FieldContainer";
import { InputSize, InputType, TextInput } from "../text-input";
import { RadioButtonGroup } from "../radio-button-group";

describe("<FieldContainer />", () => {
  const defaultProps = {
    labelText: "Test Label:",
    labelVisible: true,
    isRequired: false,
    children: (
      <TextInput
        value=""
        onChange={() => {}}
        type={InputType.text}
        size={InputSize.base}
      />
    ),
  };

  it("renders without error", () => {
    render(<FieldContainer {...defaultProps} />);
    expect(screen.getByTestId("field-container")).toBeInTheDocument();
  });

  it("renders with correct label", () => {
    render(<FieldContainer {...defaultProps} />);
    expect(screen.getByText("Test Label:")).toBeInTheDocument();
  });

  it("marks the control, not the label, as required and invalid", () => {
    const { rerender } = render(
      <FieldContainer
        {...defaultProps}
        labelFor="field"
        isRequired
        hasError
        errorMessage="Fill this in"
      >
        <input id="field" />
      </FieldContainer>,
    );
    const label = screen.getByText("Test Label:");
    const input = screen.getByRole("textbox");
    expect(label).not.toHaveAttribute("aria-required");
    expect(input).toHaveAttribute("aria-required", "true");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Fill this in");

    rerender(
      <FieldContainer {...defaultProps} labelFor="field">
        <input id="field" />
      </FieldContainer>,
    );
    expect(input).not.toHaveAttribute("aria-required");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("leaves a state the control already sets alone", () => {
    render(
      <FieldContainer {...defaultProps} isRequired hasError>
        <input aria-invalid="false" required />
      </FieldContainer>,
    );
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(input).toHaveAttribute("aria-required", "true");
  });

  it("applies custom className", () => {
    const className = "custom-class";
    render(<FieldContainer {...defaultProps} className={className} />);
    expect(screen.getByTestId("field-container")).toHaveClass(className);
  });

  it("renders with custom id", () => {
    const id = "custom-id";
    render(<FieldContainer {...defaultProps} id={id} />);
    expect(screen.getByTestId("field-container")).toHaveAttribute("id", id);
  });

  it("renders tooltip when tooltipContent is provided", () => {
    const tooltipContent = "Help text";
    render(
      <FieldContainer tooltipContent={tooltipContent} {...defaultProps} />,
    );
    expect(screen.getByTestId("help-button")).toBeInTheDocument();
  });

  it("renders error message when hasError is true", () => {
    const errorMessage = "This field is required";
    render(
      <FieldContainer hasError errorMessage={errorMessage} {...defaultProps} />,
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("applies vertical layout when isVertical is true", () => {
    render(<FieldContainer isVertical {...defaultProps} />);
    expect(screen.getByTestId("field-container")).toHaveAttribute(
      "data-vertical",
      "true",
    );
  });

  it("hides label when labelVisible is false", () => {
    render(<FieldContainer {...defaultProps} labelVisible={false} />);
    expect(screen.queryByText("Test Label:")).not.toBeInTheDocument();
  });

  it("renders with custom maxLabelWidth", () => {
    const maxLabelWidth = "150px";
    render(<FieldContainer {...defaultProps} maxLabelWidth={maxLabelWidth} />);
    expect(screen.getByTestId("field-container")).toHaveAttribute(
      "data-label-width",
      maxLabelWidth,
    );
  });

  it("states a radio group's state on the group, not its first option", () => {
    render(
      <FieldContainer labelText="Plan:" isRequired>
        <div role="radiogroup" data-testid="group">
          <input type="radio" name="plan" data-testid="first" />
          <input type="radio" name="plan" />
        </div>
      </FieldContainer>,
    );

    expect(screen.getByTestId("group")).toHaveAttribute(
      "aria-required",
      "true",
    );
    expect(screen.getByTestId("first")).not.toHaveAttribute("aria-required");
  });

  it("does not take off an attribute the control has since set itself", () => {
    const { rerender } = render(
      <FieldContainer labelText="Name:" hasError>
        <input data-testid="field" />
      </FieldContainer>,
    );
    const field = screen.getByTestId("field");
    expect(field).toHaveAttribute("aria-invalid", "true");

    // The control now says it is invalid for a reason of its own.
    field.setAttribute("aria-invalid", "grammar");
    rerender(
      <FieldContainer labelText="Name:" hasError={false}>
        <input data-testid="field" />
      </FieldContainer>,
    );
    expect(field).toHaveAttribute("aria-invalid", "grammar");
  });

  it("marks a control that mounts after the container as required", async () => {
    const LateInput = () => {
      const [ready, setReady] = useState(false);
      useEffect(() => {
        setReady(true);
      }, []);
      return ready ? <input id="late-field" data-testid="late-input" /> : null;
    };

    render(
      <FieldContainer labelText="Late:" labelFor="late-field" isRequired>
        <LateInput />
      </FieldContainer>,
    );

    const input = await screen.findByTestId("late-input");
    await waitFor(() => {
      expect(input).toHaveAttribute("aria-required", "true");
    });
  });

  it("appends the error id again when the control rewrites its own description", async () => {
    const DescribedInput = ({ hint }: { hint: string }) => (
      <>
        <span id={hint}>Hint</span>
        <input aria-describedby={hint} />
      </>
    );

    const { rerender } = render(
      <FieldContainer labelText="Name:" hasError errorMessage="Required">
        <DescribedInput hint="hint-a" />
      </FieldContainer>,
    );
    const input = screen.getByRole("textbox");
    const errorId = screen.getByText("Required").id;
    expect(input.getAttribute("aria-describedby")).toBe(`hint-a ${errorId}`);

    // React writes the control's own value over the one the container
    // extended; the observer puts the error id back, once.
    rerender(
      <FieldContainer labelText="Name:" hasError errorMessage="Required">
        <DescribedInput hint="hint-b" />
      </FieldContainer>,
    );
    await waitFor(() => {
      expect(input.getAttribute("aria-describedby")).toBe(`hint-b ${errorId}`);
    });

    // Turning the error off still takes only its own id away.
    rerender(
      <FieldContainer labelText="Name:">
        <DescribedInput hint="hint-b" />
      </FieldContainer>,
    );
    expect(input).toHaveAttribute("aria-describedby", "hint-b");
  });
  // Known defect (review of spike/vitest-addon, round 2): findControl only accepts a [role="radiogroup"] ancestor, which RadioButtonGroup does not render, so its state lands on nothing. Flip to it() once fixed.
  it.fails(
    "describes the kit's own RadioButtonGroup as invalid and required",
    () => {
      render(
        <FieldContainer
          labelText="Fruit:"
          hasError
          isRequired
          errorMessage="Pick one"
        >
          <RadioButtonGroup
            name="fruit"
            selected=""
            onClick={() => {}}
            options={[
              { value: "apple", label: "Apple" },
              { value: "pear", label: "Pear" },
            ]}
          />
        </FieldContainer>,
      );

      const radios = screen.getAllByRole("radio");
      const errorId = screen.getByText("Pick one").id;
      const group = screen
        .getByTestId("field-container")
        .querySelector<HTMLElement>('[aria-invalid="true"]');

      expect(group).not.toBeNull();
      radios.forEach((radio) => {
        expect(group).toContainElement(radio);
      });
      expect(group?.getAttribute("aria-describedby")?.split(" ")).toContain(
        errorId,
      );
    },
  );
});
