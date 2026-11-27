import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { MobileSubMenu } from "./MobileSubMenu";

describe("<MobileSubMenu />", () => {
  it("treats an item's image icon as decorative", () => {
    const { container } = render(
      <MobileSubMenu
        root
        resetMenu={false}
        onLeafClick={vi.fn()}
        mobileSubMenuItems={[
          {
            key: "plugin",
            label: "Plugin action",
            icon: "https://cdn.example.com/icon.png",
          },
        ]}
      />,
    );

    expect(container.querySelector("img")).toHaveAttribute("alt", "");
  });

  it("shows a badge label without isPaidBadge", () => {
    render(
      <MobileSubMenu
        root
        resetMenu={false}
        onLeafClick={vi.fn()}
        mobileSubMenuItems={[
          { key: "share", label: "Share", badgeLabel: "New" },
        ]}
      />,
    );

    expect(screen.getByText("Share")).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
  });
});
