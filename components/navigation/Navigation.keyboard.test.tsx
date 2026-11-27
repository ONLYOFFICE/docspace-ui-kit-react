import React from "react";
import { describe, it, expect, vi } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";

import Navigation from "./Navigation";
import { DeviceType } from "../../enums";

const trail = [
  { id: "1", title: "Documents", isRootRoom: true },
  { id: "2", title: "2026", isRootRoom: false },
  { id: "3", title: "Contracts", isRootRoom: false },
];

const props = {
  title: "Contracts",
  navigationItems: trail,
  isRootFolder: false,
  currentDeviceType: DeviceType.desktop,
  isDesktop: true,
  showTitle: true,
  withLogo: false,
  burgerLogo: "",
  titleIcon: "",
  rootRoomTitle: "",
  showRootFolderTitle: false,
  showNavigationButton: false,
  canCreate: false,
  getContextOptionsPlus: () => [],
  getContextOptionsFolder: () => [],
  onBackToParentFolder: vi.fn(),
  isInfoPanelVisible: false,
  toggleInfoPanel: vi.fn(),
  hideInfoPanel: true,
};

describe("Navigation from the keyboard", () => {
  it("opens the drop box from the title and moves the focus into it", () => {
    render(<Navigation {...props} onClickFolder={vi.fn()} />);

    const title = screen.getByRole("button", { name: "Contracts" });
    expect(title).toHaveAttribute("aria-expanded", "false");
    expect(title).toHaveAttribute("tabindex", "0");

    title.focus();
    fireEvent.keyDown(title, { key: "Enter" });

    const copies = screen.getAllByRole("button", {
      name: "Contracts",
      expanded: true,
    });
    expect(copies).toHaveLength(2);
    expect(document.activeElement).toBe(copies[0]);
    expect(document.activeElement).not.toBe(title);
  });

  it("opens a folder from a drop box row with Enter", () => {
    const onClickFolder = vi.fn();
    render(<Navigation {...props} onClickFolder={onClickFolder} />);

    fireEvent.click(screen.getByRole("button", { name: "Contracts" }));
    const row = screen.getByRole("button", { name: "2026" });
    expect(row).toHaveAttribute("tabindex", "0");

    fireEvent.keyDown(row, { key: "Enter" });

    expect(onClickFolder).toHaveBeenCalledWith("2", false, undefined);
  });

  it("closes on Escape and gives the focus back to the title", () => {
    render(<Navigation {...props} onClickFolder={vi.fn()} />);

    const title = screen.getByRole("button", { name: "Contracts" });
    title.focus();
    fireEvent.keyDown(title, { key: " " });
    expect(document.activeElement).not.toBe(title);

    fireEvent.keyDown(document.activeElement as HTMLElement, {
      key: "Escape",
    });

    expect(
      screen.getByRole("button", { name: "Contracts", expanded: false }),
    ).toBe(title);
    expect(document.activeElement).toBe(title);
  });

  it("keeps Escape pressed in the box from the page", () => {
    render(<Navigation {...props} onClickFolder={vi.fn()} />);
    const onPageKeyDown = vi.fn();
    document.addEventListener("keydown", onPageKeyDown);

    const title = screen.getByRole("button", { name: "Contracts" });
    title.focus();
    fireEvent.keyDown(title, { key: "Enter" });
    fireEvent.keyUp(title, { key: "Enter" });
    fireEvent.keyDown(document.activeElement as HTMLElement, {
      key: "Escape",
    });

    document.removeEventListener("keydown", onPageKeyDown);
    expect(title).toHaveAttribute("aria-expanded", "false");
    expect(onPageKeyDown).not.toHaveBeenCalled();
  });

  it("opens the box once while Enter is held", () => {
    render(<Navigation {...props} onClickFolder={vi.fn()} />);

    const title = screen.getByRole("button", { name: "Contracts" });
    title.focus();
    fireEvent.keyDown(title, { key: "Enter" });
    fireEvent.keyDown(document.activeElement as HTMLElement, {
      key: "Enter",
      repeat: true,
    });

    expect(title).toHaveAttribute("aria-expanded", "true");
  });

  it("leaves the focus alone when the mouse opens and closes the box", () => {
    const onClickFolder = vi.fn();
    render(<Navigation {...props} onClickFolder={onClickFolder} />);

    const title = screen.getByRole("button", { name: "Contracts" });
    fireEvent.pointerDown(title);
    title.focus();
    fireEvent.click(title);
    expect(document.activeElement).toBe(title);

    const row = screen.getByRole("button", { name: "2026" });
    fireEvent.pointerDown(row);
    row.focus();
    fireEvent.click(row);

    expect(onClickFolder).toHaveBeenCalledWith("2", false, undefined);
    expect(document.activeElement).not.toBe(title);
  });

  it("keeps the title of the root folder a plain heading", () => {
    render(<Navigation {...props} isRootFolder onClickFolder={vi.fn()} />);

    expect(
      screen.queryByRole("button", { name: "Contracts" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Contracts" })).toBeVisible();
  });

  it("makes the room title a keyboard button", () => {
    const onClickFolder = vi.fn();
    render(
      <Navigation
        {...props}
        showRootFolderTitle
        rootRoomTitle="Documents"
        onClickFolder={onClickFolder}
      />,
    );

    const roomTitle = screen.getByRole("button", { name: "Documents" });
    expect(roomTitle).not.toHaveAttribute("aria-expanded");

    fireEvent.keyDown(roomTitle, { key: "Enter" });

    expect(onClickFolder).toHaveBeenCalledWith("2", false, false);
  });

  // With rootRoomTitle and a single crumb there is no parent folder to open,
  // so the title is not a Tab stop that does nothing.
  it("leaves the room title plain text when there is no parent to open", () => {
    render(
      <Navigation
        {...props}
        title="Documents"
        navigationItems={[trail[0]]}
        showRootFolderTitle
        rootRoomTitle="Documents"
        onClickFolder={vi.fn()}
      />,
    );

    const roomTitle = document.querySelector('[data-root-folder-title="true"]');
    expect(roomTitle).not.toBeNull();
    expect(roomTitle?.querySelector('[role="button"]')).toBeNull();
  });
});
