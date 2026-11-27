import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Card } from ".";

describe("Card aria-*", () => {
  it("puts a passed aria-* on the section, which a name makes a region", () => {
    render(
      <Card title="Storage" aria-label="Storage usage">
        Content
      </Card>,
    );

    expect(
      screen.getByRole("region", { name: "Storage usage" }),
    ).toBeInTheDocument();
  });
});
