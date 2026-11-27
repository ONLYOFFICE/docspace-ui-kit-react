import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { LinkWithDropdown } from "./LinkWithDropdown";

describe("LinkWithDropdown aria-*", () => {
  it("keeps a passed aria-* on the link and off its list", () => {
    render(
      <LinkWithDropdown
        data={[{ key: "a", label: "Alpha", onClick: vi.fn() }]}
        aria-describedby="link-hint"
      >
        Sort
      </LinkWithDropdown>,
    );

    const link = screen.getByRole("button", { name: "Sort" });
    expect(link).toHaveAttribute("aria-describedby", "link-hint");

    fireEvent.click(link);
    expect(screen.getByRole("listbox")).not.toHaveAttribute("aria-describedby");
  });
});
