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
  showText: true,
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
  isRoom: false,
  isCurrentFolderInfo: false,
  showFolderInfo: vi.fn(),
  clearTrash: vi.fn(),
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
});
