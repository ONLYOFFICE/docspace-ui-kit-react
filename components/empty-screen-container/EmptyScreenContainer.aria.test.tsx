import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { EmptyScreenContainer } from ".";

describe("EmptyScreenContainer aria-*", () => {
  it("puts a passed aria-* on the container", () => {
    render(
      <EmptyScreenContainer
        imageSrc="empty.png"
        imageAlt=""
        headerText="No results found"
        aria-live="polite"
      />,
    );

    expect(screen.getByTestId("empty-screen-container")).toHaveAttribute(
      "aria-live",
      "polite",
    );
  });
});
