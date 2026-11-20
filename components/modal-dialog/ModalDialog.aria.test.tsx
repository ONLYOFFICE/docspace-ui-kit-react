import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { ModalDialog } from ".";

describe("ModalDialog aria-*", () => {
  it("puts a passed aria-* on the dialog, not on the header", () => {
    render(
      <ModalDialog
        visible
        onClose={vi.fn()}
        aria-label="Delete file"
        aria-describedby="delete-warning"
        aria-roledescription="confirmation"
      >
        <ModalDialog.Header>Delete</ModalDialog.Header>
        <ModalDialog.Body>Body</ModalDialog.Body>
      </ModalDialog>,
    );

    const dialog = screen.getByRole("dialog", { name: "Delete file" });
    expect(dialog).toHaveAttribute("aria-describedby", "delete-warning");
    expect(dialog).toHaveAttribute("aria-roledescription", "confirmation");
    expect(screen.getByTestId("aside-header")).not.toHaveAttribute(
      "aria-roledescription",
    );
  });
});
