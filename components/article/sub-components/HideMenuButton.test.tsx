import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import HideArticleMenuButton from "./HideMenuButton";

describe("<HideArticleMenuButton />", () => {
  it("collapses the panel from the keyboard", () => {
    const toggleShowText = vi.fn();
    render(
      <HideArticleMenuButton
        showText
        hideProfileBlock={false}
        withCustomSlot={false}
        toggleShowText={toggleShowText}
      />,
    );

    const handle = screen.getByRole("button", { name: "Hide menu" });
    expect(handle).toHaveAttribute("tabindex", "0");

    fireEvent.keyDown(handle, { key: "Enter" });
    fireEvent.keyDown(handle, { key: " " });

    expect(toggleShowText).toHaveBeenCalledTimes(2);
  });

  it("is named when collapsed to its icon", () => {
    render(
      <HideArticleMenuButton
        showText={false}
        hideProfileBlock={false}
        withCustomSlot={false}
        toggleShowText={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Show menu" })).toBeVisible();
  });
});
