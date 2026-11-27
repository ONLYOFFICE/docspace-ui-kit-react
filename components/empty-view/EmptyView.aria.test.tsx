import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { EmptyView } from ".";

describe("EmptyView aria-*", () => {
  it("puts a passed aria-* on the wrapper", () => {
    render(
      <EmptyView
        title="No files"
        description="Upload one"
        icon={<svg />}
        options={null}
        aria-live="polite"
      />,
    );

    expect(screen.getByTestId("empty-view")).toHaveAttribute(
      "aria-live",
      "polite",
    );
  });
});
