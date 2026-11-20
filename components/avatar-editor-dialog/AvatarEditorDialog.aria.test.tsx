import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import type { TTranslation } from "../../utils";

import { AvatarEditorDialog } from ".";

const t = ((key: string) => key) as TTranslation;

describe("AvatarEditorDialog aria-*", () => {
  it("puts a passed aria-* on the dialog", async () => {
    render(
      <AvatarEditorDialog
        t={t}
        visible
        title="Edit photo"
        image={{ x: 0.5, y: 0.5, zoom: 1 }}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onChangeImage={vi.fn()}
        onChangeFile={vi.fn()}
        aria-label="Profile photo editor"
      />,
    );

    expect(
      await screen.findByRole("dialog", { name: "Profile photo editor" }),
    ).toBeInTheDocument();
  });
});
