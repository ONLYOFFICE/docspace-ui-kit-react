import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { AccessRightSelect } from ".";

const accessOptions = [
  { key: "editor", label: "Editor" },
  { key: "viewer", label: "Viewer" },
];

describe("AccessRightSelect", () => {
  it("puts a passed aria-* on the button", () => {
    render(
      <AccessRightSelect
        accessOptions={accessOptions}
        selectedOption={accessOptions[1]}
        onSelect={vi.fn()}
        aria-label="Access of Carol Jones"
        aria-describedby="access-hint"
      />,
    );

    expect(
      screen.getByRole("button", { name: "Access of Carol Jones" }),
    ).toHaveAttribute("aria-describedby", "access-hint");
  });
});
