import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { AsideHeader } from ".";

describe("AsideHeader aria-*", () => {
  it("puts a passed aria-* on the header", () => {
    render(<AsideHeader header="Settings" aria-describedby="settings-hint" />);

    expect(screen.getByTestId("aside-header")).toHaveAttribute(
      "aria-describedby",
      "settings-hint",
    );
  });
});
