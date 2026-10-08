import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { screen, fireEvent, render } from "@testing-library/react";

import ErrorContainer from "./ErrorContainer";

describe("ErrorContainer", () => {
  const mockOnClick = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders without error", () => {
    render(<ErrorContainer id="error-container" />);
    expect(screen.getByTestId("ErrorContainer")).toBeInTheDocument();
  });

  it("renders with header and body text", () => {
    const headerText = "Some error has happened";
    const bodyText = "Try again later";

    render(<ErrorContainer headerText={headerText} bodyText={bodyText} />);

    expect(screen.getByText(headerText)).toBeInTheDocument();
    expect(screen.getByText(bodyText)).toBeInTheDocument();
  });

  it("renders with customized body text", () => {
    const customText = "Custom error message";

    render(<ErrorContainer customizedBodyText={customText} />);

    expect(screen.getByText(customText)).toBeInTheDocument();
  });

  it("renders with button and handles click", () => {
    const buttonText = "Retry";

    render(
      <ErrorContainer buttonText={buttonText} onClickButton={mockOnClick} />,
    );

    const button = screen.getByText(buttonText);
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("renders with primary button style", () => {
    const buttonText = "Primary Button";

    render(
      <ErrorContainer
        buttonText={buttonText}
        onClickButton={mockOnClick}
        isPrimaryButton
      />,
    );

    const button = screen.getByText(buttonText);
    expect(button).toBeInTheDocument();
  });

  it("renders in editor mode", () => {
    render(<ErrorContainer isEditor />);

    const container = screen.getByTestId("ErrorContainer");
    expect(container.className).toContain("isEditor");
  });

  it("renders with additional className", () => {
    const className = "custom-class";

    render(<ErrorContainer className={className} />);

    const container = screen.getByTestId("ErrorContainer");
    expect(container.className).toContain(className);
  });

  // The portal's stylesheets select these ids (PreparationPortalDialog sizes
  // the illustration through #container-inner), so they stay; every other id
  // is gone, which keeps the illustration's own ids from colliding.
  it("keeps only the ids the portal styles, and no others", () => {
    const { container } = render(
      <ErrorContainer
        hideLogo
        headerText="First"
        bodyText="Body"
        customizedBodyText="Extra"
        buttonText="Retry"
        onClickButton={mockOnClick}
      />,
    );

    const ids = Array.from(container.querySelectorAll("[id]"), (e) => e.id);
    expect(ids.sort()).toEqual(
      ["container-inner", "customized-text", "header", "text"].sort(),
    );
    expect(container.querySelector("#container-inner svg")).not.toBeNull();
    expect(container.querySelector("#header")).toHaveTextContent("First");
    expect(container.querySelector("#text")).toHaveTextContent("Body");
    expect(container.querySelector("#customized-text")).toHaveTextContent(
      "Extra",
    );
  });

  it("hides the decorative illustration from assistive technology", () => {
    render(<ErrorContainer hideLogo headerText="Error" />);

    const svgs = screen.getByTestId("ErrorContainer").querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
    svgs.forEach((svg) => {
      expect(svg.closest('[aria-hidden="true"]')).not.toBeNull();
    });
    expect(screen.queryAllByRole("img")).toHaveLength(0);
  });

  it("paints the illustration through theme tokens, not literal fills", () => {
    render(<ErrorContainer hideLogo />);

    const painted = screen
      .getByTestId("ErrorContainer")
      .querySelectorAll("path, rect, circle, ellipse");
    painted.forEach((shape) => {
      const fill = shape.getAttribute("fill");
      expect(fill === null || fill === "none").toBe(true);
    });
  });

  it("renders with children", () => {
    const childText = "Child component";

    render(
      <ErrorContainer>
        <div>{childText}</div>
      </ErrorContainer>,
    );

    expect(screen.getByText(childText)).toBeInTheDocument();
  });
});
