import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";

import type { TTranslation } from "../../utils";

import { RoomLogoCover, RoomLogoCoverDialog } from ".";

const t = ((key: string) => key) as TTranslation;

const dialogHeight = () =>
  document
    .getElementById("modal-onMouseDown-close")
    ?.style.getPropertyValue("--dialog-height");

describe("RoomLogoCoverDialog", () => {
  it("is named by its heading", async () => {
    render(
      <RoomLogoCoverDialog
        t={t}
        visible
        covers={[]}
        onClose={() => {}}
        onApply={() => {}}
      />,
    );

    expect(
      await screen.findByRole("dialog", { name: "Common:RoomCover" }),
    ).toBeInTheDocument();
  });

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

  it("picks a colour from the keyboard and says which is chosen", () => {
    const onChange = vi.fn();
    renderPicker(onChange);

    const swatches = within(
      screen.getByRole("group", { name: "Common:Color" }),
    ).getAllByRole("button", { name: /^#/ });
    expect(swatches.filter((s) => s.ariaPressed === "true")).toHaveLength(1);

    const other = swatches.find((s) => s.ariaPressed === "false");
    const color = other?.getAttribute("aria-label");
    expect(other).toHaveAttribute("tabindex", "0");

    fireEvent.keyDown(other as HTMLElement, { key: "Enter" });

    expect(onChange).toHaveBeenLastCalledWith(color, null);
    expect(
      screen.getByRole("button", { name: color as string }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("picks a glyph and without icon from the keyboard", () => {
    renderPicker();

    const glyph = screen.getByRole("button", {
      name: "CreateEditRoomDialog:Icon 1",
    });
    const withoutIcon = screen.getByRole("button", {
      name: "Common:WithoutIcon",
    });
    expect(glyph).toHaveAttribute("aria-pressed", "false");
    expect(withoutIcon).toHaveAttribute("aria-pressed", "true");

    fireEvent.keyDown(glyph, { key: " " });

    expect(glyph).toHaveAttribute("aria-pressed", "true");
    expect(withoutIcon).toHaveAttribute("aria-pressed", "false");

    fireEvent.keyDown(withoutIcon, { key: "Enter" });

    expect(glyph).toHaveAttribute("aria-pressed", "false");
    expect(withoutIcon).toHaveAttribute("aria-pressed", "true");
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
