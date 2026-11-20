import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import type { TTranslation } from "../../utils";

import { RoomLogoCover, RoomLogoCoverDialog } from ".";

const t = ((key: string) => key) as TTranslation;

const dialogHeight = () =>
  document
    .getElementById("modal-onMouseDown-close")
    ?.style.getPropertyValue("--dialog-height");

describe("RoomLogoCoverDialog", () => {
  it("puts a passed aria-* on the dialog", async () => {
    render(
      <RoomLogoCoverDialog
        t={t}
        visible
        covers={[]}
        onClose={() => {}}
        onApply={() => {}}
        aria-label="Room cover picker"
      />,
    );

    expect(
      await screen.findByRole("dialog", { name: "Room cover picker" }),
    ).toBeInTheDocument();
  });

  it("measures its height on the first opening", async () => {
    render(
      <RoomLogoCoverDialog
        t={t}
        visible
        covers={[]}
        onClose={() => {}}
        onApply={() => {}}
      />,
    );

    // The Portal mounts the content after the first render. The height has
    // to be measured against it then, not left at the 648px desktop preset:
    // jsdom's 768px window leaves room for 768 - 84.
    await screen.findByTestId("room_logo_cover_dialog");
    expect(dialogHeight()).toBe(`${window.innerHeight - 84}px`);
  });
});

describe("RoomLogoCover", () => {
  const renderPicker = (onChange = vi.fn()) =>
    render(
      <RoomLogoCover
        t={t}
        covers={[{ id: "1", data: "<svg></svg>" }]}
        openColorPicker={false}
        setOpenColorPicker={() => {}}
        onChange={onChange}
      />,
    );

  it("names the custom colour button", () => {
    renderPicker();

    expect(
      screen.getByRole("button", { name: "Common:Color" }),
    ).toBeInTheDocument();
  });

  it("asks for the without-icon label in Common", () => {
    renderPicker();
    expect(
      screen.getByTestId("room_logo_cover_without_icon"),
    ).toHaveTextContent("Common:WithoutIcon");
  });

  // The first click used to turn it off, and nothing could turn it back on.
  it("keeps without icon chosen while no glyph is", () => {
    const onChange = vi.fn();
    renderPicker(onChange);
    const withoutIcon = screen.getByTestId("room_logo_cover_without_icon");

    fireEvent.click(withoutIcon);

    expect(withoutIcon.className).toMatch(/isSelected/);
    expect(onChange).not.toHaveBeenCalled();
  });
});
