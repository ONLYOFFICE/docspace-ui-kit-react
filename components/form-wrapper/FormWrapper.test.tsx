import React from "react";
import { describe, it, expect } from "vitest";
import { screen, render } from "@testing-library/react";
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
