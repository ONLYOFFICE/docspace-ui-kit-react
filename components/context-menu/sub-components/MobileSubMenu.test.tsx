import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { MobileSubMenu } from "./MobileSubMenu";

describe("<MobileSubMenu />", () => {
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
