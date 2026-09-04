import React from "react";
import { describe, it, expect } from "vitest";
import { screen, render } from "@testing-library/react";

import { Heading } from ".";
import { HeadingLevel, HeadingSize } from "./Heading.enums";
import styles from "./Heading.module.scss";

describe("<Heading />", () => {
  it("renders without error", () => {
    render(
      <Heading
        level={HeadingLevel.h4}
        size={HeadingSize.medium}
        title="Some title"
      >
        Some text
      </Heading>,
    );

    expect(screen.getByTestId("heading")).toBeInTheDocument();
  });

  it("renders with inherited text props", () => {
    render(
      <Heading
        level={HeadingLevel.h1}
        color="red"
        fontSize="24px"
        fontWeight={700}
        truncate
        isInline
      >
        Styled heading
      </Heading>,
    );

    const heading = screen.getByTestId("heading");
    expect(heading.style.color).toBe("red");
    expect(heading.style.fontSize).toBe("24px");
    expect(heading.style.fontWeight).toBe("700");
  });

  it("renders with different heading levels", () => {
    const { rerender } = render(
      <Heading level={HeadingLevel.h1}>H1 Heading</Heading>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();

    rerender(<Heading level={HeadingLevel.h2}>H2 Heading</Heading>);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("renders with different sizes", () => {
    const { rerender } = render(
      <Heading level={HeadingLevel.h1} size={HeadingSize.large}>
        Large heading
      </Heading>,
    );
    const heading = screen.getByTestId("heading");
    expect(heading.classList.contains(styles.large)).toBe(true);

    rerender(
      <Heading level={HeadingLevel.h1} size={HeadingSize.small}>
        Small heading
      </Heading>,
    );
    const smallHeading = screen.getByTestId("heading");
    expect(smallHeading.classList.contains(styles.small)).toBe(true);
  });

  it("renders with different types", () => {
    const { rerender } = render(
      <Heading level={HeadingLevel.h1} type="menu">
        Menu heading
      </Heading>,
    );
    const heading = screen.getByTestId("heading");
    expect(heading.classList.contains(styles.menu)).toBe(true);

    rerender(
      <Heading level={HeadingLevel.h1} type="content">
        Content heading
      </Heading>,
    );
    const contentHeading = screen.getByTestId("heading");
    expect(contentHeading.classList.contains(styles.content)).toBe(true);
  });

  it("renders with custom data-testid", () => {
    render(
      <Heading level={HeadingLevel.h1} data-testid="custom-heading">
        Custom test id heading
      </Heading>,
    );
    expect(screen.getByTestId("custom-heading")).toBeInTheDocument();
  });

  it("renders with aria-label", () => {
    render(
      <Heading level={HeadingLevel.h1} aria-label="Descriptive label">
        Aria labeled heading
      </Heading>,
    );
    const heading = screen.getByTestId("heading");
    expect(heading).toHaveAttribute("aria-label", "Descriptive label");
  });
});
