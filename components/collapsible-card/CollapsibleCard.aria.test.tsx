import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { CollapsibleCard } from ".";

describe("CollapsibleCard aria-*", () => {
  it("puts a passed aria-* on the toggle, keeping its own aria-expanded", () => {
    render(
      <CollapsibleCard
        title="Advanced"
        aria-describedby="advanced-hint"
        aria-expanded
      >
        Content
      </CollapsibleCard>,
    );

    const toggle = screen.getByRole("button", { name: /Advanced/ });
    expect(toggle).toHaveAttribute("aria-describedby", "advanced-hint");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
