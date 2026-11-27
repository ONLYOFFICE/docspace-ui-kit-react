import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { ColumnarInfoBar } from "./ColumnarInfoBar";

describe("ColumnarInfoBar aria-*", () => {
  it("puts a passed aria-* on the bar", () => {
    const { container } = render(
      <ColumnarInfoBar
        columns={[{ label: "Name", value: "John Smith" }]}
        aria-describedby="user-hint"
      />,
    );

    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute(
      "aria-describedby",
      "user-hint",
    );
  });
});
