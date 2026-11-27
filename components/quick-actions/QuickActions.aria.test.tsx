import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("../tooltip", () => ({ Tooltip: vi.fn(() => null) }));

import { QuickActions } from "./index";

describe("QuickActions aria-*", () => {
  it("puts a passed aria-* on the toolbar", () => {
    render(
      <QuickActions
        prevLabel="Previous"
        nextLabel="Next"
        items={[{ id: "doc", icon: <svg />, label: "Document" }]}
        aria-label="Create"
      />,
    );

    expect(screen.getByRole("toolbar", { name: "Create" })).toHaveAttribute(
      "aria-orientation",
      "horizontal",
    );
  });
});
