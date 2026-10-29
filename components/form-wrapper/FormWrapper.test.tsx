import React from "react";
import { describe, it, expect, vi } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";
import { FormWrapper } from "./index";

describe("FormWrapper", () => {
  it("renders children content correctly", () => {
    const testContent = "Test Content";
    render(
      <FormWrapper>
        <div>{testContent}</div>
      </FormWrapper>,
    );

    expect(screen.getByTestId("form-wrapper")).toBeInTheDocument();
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it("applies custom className and style", () => {
    const customClass = "custom-class";
    const customStyle = { backgroundColor: "red" };

    render(
      <FormWrapper className={customClass} style={customStyle}>
        <div>Content</div>
      </FormWrapper>,
    );

    const wrapper = screen.getByTestId("form-wrapper");
    expect(wrapper).toHaveClass(customClass);
    expect(wrapper.style.backgroundColor).toBe("red");
  });

  it("is a div without onSubmit", () => {
    render(
      <FormWrapper>
        <div>Content</div>
      </FormWrapper>,
    );

    expect(screen.getByTestId("form-wrapper").tagName).toBe("DIV");
  });

  it("is a named form with onSubmit, and submits without navigating", () => {
    const onSubmit = vi.fn();
    render(
      <FormWrapper onSubmit={onSubmit} aria-label="Sign in" className="x">
        <input aria-label="Email" />
        <button type="submit">Sign in</button>
      </FormWrapper>,
    );

    const form = screen.getByRole("form", { name: "Sign in" });
    expect(form).toBe(screen.getByTestId("form-wrapper"));
    expect(form).toHaveClass("x");

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0].defaultPrevented).toBe(true);
  });

  it("applies custom id", () => {
    const customId = "custom-id";

    render(
      <FormWrapper id={customId}>
        <div>Content</div>
      </FormWrapper>,
    );

    expect(screen.getByTestId("form-wrapper")).toHaveAttribute("id", customId);
  });
});
