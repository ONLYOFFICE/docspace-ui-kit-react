// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import React, { createRef } from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { NavMenu } from "./NavMenu";
import { NavMenuGroup } from "./NavMenu.types";

const groups: NavMenuGroup[] = [
  {
    id: "enabled",
    label: "Enabled Apps",
    items: [
      {
        id: "ai-files",
        label: "AI Files",
        children: [
          { id: "shared", label: "Shared with me" },
          { id: "favorites", label: "Favorites" },
        ],
      },
      {
        id: "ai-rooms",
        label: "AI Rooms",
        children: [
          { id: "rooms-recent", label: "Recent" },
        ],
      },
    ],
  },
  {
    id: "available",
    label: "Available Apps",
    items: [
      { id: "ai-agents", label: "AI Agents" },
    ],
  },
];

describe("<NavMenu />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders a navigation element", () => {
      render(<NavMenu groups={groups} />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("renders all group labels", () => {
      render(<NavMenu groups={groups} />);
      expect(screen.getByText("Enabled Apps")).toBeInTheDocument();
      expect(screen.getByText("Available Apps")).toBeInTheDocument();
    });

    it("renders all top-level item labels", () => {
      render(<NavMenu groups={groups} />);
      expect(screen.getByRole("button", { name: "AI Files" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "AI Rooms" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "AI Agents" })).toBeInTheDocument();
    });

    it("renders sub-items expanded when defaultExpandedId is set", () => {
      render(<NavMenu groups={groups} defaultExpandedId="ai-files" />);
      expect(screen.getByRole("button", { name: "Shared with me" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Favorites" })).toBeInTheDocument();
    });

    it("does not render group label element when label is omitted", () => {
      const groupsNoLabel: NavMenuGroup[] = [
        {
          id: "g1",
          items: [{ id: "item-1", label: "Item One" }],
        },
      ];
      render(<NavMenu groups={groupsNoLabel} />);
      expect(screen.queryByText("Enabled Apps")).not.toBeInTheDocument();
    });

    it("applies custom className to the root element", () => {
      render(<NavMenu groups={groups} className="custom-nav" />);
      expect(screen.getByRole("navigation")).toHaveClass("custom-nav");
    });

    it("forwards ref to the nav element", () => {
      const ref = createRef<HTMLElement>();
      render(<NavMenu groups={groups} ref={ref} />);
      expect(ref.current).toBe(screen.getByRole("navigation"));
    });
  });

  describe("expand / collapse", () => {
    it("expands item children on click", async () => {
      render(<NavMenu groups={groups} />);
      const button = screen.getByRole("button", { name: "AI Files" });

      expect(button).toHaveAttribute("aria-expanded", "false");

      await userEvent.click(button);

      expect(button).toHaveAttribute("aria-expanded", "true");
      expect(screen.getByRole("button", { name: "Shared with me" })).toBeInTheDocument();
    });

    it("collapses already-expanded item on second click when it is active", async () => {
      render(
        <NavMenu
          groups={groups}
          defaultExpandedId="ai-files"
          activeItemId="ai-files"
        />,
      );
      const button = screen.getByRole("button", { name: "AI Files" });

      expect(button).toHaveAttribute("aria-expanded", "true");

      await userEvent.click(button);

      expect(button).toHaveAttribute("aria-expanded", "false");
    });

    it("keeps expanded item open on second click when it is not active", async () => {
      render(
        <NavMenu
          groups={groups}
          defaultExpandedId="ai-files"
          activeItemId="shared"
        />,
      );
      const button = screen.getByRole("button", { name: "AI Files" });

      expect(button).toHaveAttribute("aria-expanded", "true");

      await userEvent.click(button);

      expect(button).toHaveAttribute("aria-expanded", "true");
    });

    it("collapses previous item when a different item is expanded", async () => {
      render(<NavMenu groups={groups} defaultExpandedId="ai-files" />);

      const filesButton = screen.getByRole("button", { name: "AI Files" });
      const roomsButton = screen.getByRole("button", { name: "AI Rooms" });

      expect(filesButton).toHaveAttribute("aria-expanded", "true");
      expect(roomsButton).toHaveAttribute("aria-expanded", "false");

      await userEvent.click(roomsButton);

      expect(filesButton).toHaveAttribute("aria-expanded", "false");
      expect(roomsButton).toHaveAttribute("aria-expanded", "true");
    });

    it("does not add aria-expanded to items without children", () => {
      render(<NavMenu groups={groups} />);
      const button = screen.getByRole("button", { name: "AI Agents" });
      expect(button).not.toHaveAttribute("aria-expanded");
    });
  });

  describe("click handlers", () => {
    it("calls item onClick with the item data", async () => {
      const onClick = vi.fn();
      const groupsWithHandler: NavMenuGroup[] = [
        {
          id: "g1",
          label: "Group",
          items: [{ id: "item-1", label: "Item One", onClick }],
        },
      ];

      render(<NavMenu groups={groupsWithHandler} />);
      await userEvent.click(screen.getByRole("button", { name: "Item One" }));

      expect(onClick).toHaveBeenCalledOnce();
      expect(onClick).toHaveBeenCalledWith(
        expect.objectContaining({ id: "item-1", label: "Item One" }),
      );
    });

    it("calls sub-item onClick with the sub-item data", async () => {
      const onSubClick = vi.fn();
      const groupsWithHandler: NavMenuGroup[] = [
        {
          id: "g1",
          label: "Group",
          items: [
            {
              id: "parent",
              label: "Parent",
              children: [
                { id: "child-1", label: "Child One", onClick: onSubClick },
              ],
            },
          ],
        },
      ];

      render(<NavMenu groups={groupsWithHandler} defaultExpandedId="parent" />);
      await userEvent.click(screen.getByRole("button", { name: "Child One" }));

      expect(onSubClick).toHaveBeenCalledOnce();
      expect(onSubClick).toHaveBeenCalledWith(
        expect.objectContaining({ id: "child-1", label: "Child One" }),
      );
    });

    it("does not call onClick of other items when one item is clicked", async () => {
      const onClickFirst = vi.fn();
      const onClickSecond = vi.fn();
      const groupsWithHandlers: NavMenuGroup[] = [
        {
          id: "g1",
          label: "Group",
          items: [
            { id: "first", label: "First", onClick: onClickFirst },
            { id: "second", label: "Second", onClick: onClickSecond },
          ],
        },
      ];

      render(<NavMenu groups={groupsWithHandlers} />);
      await userEvent.click(screen.getByRole("button", { name: "First" }));

      expect(onClickFirst).toHaveBeenCalledOnce();
      expect(onClickSecond).not.toHaveBeenCalled();
    });
  });

  describe("active state", () => {
    it("marks the active item with active class", () => {
      render(<NavMenu groups={groups} activeItemId="ai-files" />);
      const activeButton = screen.getByRole("button", { name: "AI Files" });
      expect(activeButton.className).toMatch(/active/);
    });

    it("does not mark non-active items as active", () => {
      render(<NavMenu groups={groups} activeItemId="ai-files" />);
      const inactiveButton = screen.getByRole("button", { name: "AI Rooms" });
      expect(inactiveButton.className).not.toMatch(/active/);
    });

    it("marks the active sub-item with active class", () => {
      render(
        <NavMenu
          groups={groups}
          activeItemId="shared"
          defaultExpandedId="ai-files"
        />,
      );
      const activeSubButton = screen.getByRole("button", { name: "Shared with me" });
      expect(activeSubButton.className).toMatch(/active/);
    });
  });

  describe("badge", () => {
    it("renders numeric badge when showBadge=true with labelBadge", () => {
      const badgeGroups: NavMenuGroup[] = [
        {
          id: "g",
          label: "Group",
          items: [{ id: "item-1", label: "Item", showBadge: true, labelBadge: 5 }],
        },
      ];
      render(<NavMenu groups={badgeGroups} />);
      expect(screen.getByTestId("badge")).toBeInTheDocument();
    });

    it("does not render badge when showBadge is false", () => {
      const badgeGroups: NavMenuGroup[] = [
        {
          id: "g",
          label: "Group",
          items: [{ id: "item-1", label: "Item", showBadge: false, labelBadge: 5 }],
        },
      ];
      render(<NavMenu groups={badgeGroups} />);
      expect(screen.queryByTestId("badge")).not.toBeInTheDocument();
    });

    it("does not render badge when showBadge is omitted", () => {
      const badgeGroups: NavMenuGroup[] = [
        {
          id: "g",
          label: "Group",
          items: [{ id: "item-1", label: "Item", labelBadge: 5 }],
        },
      ];
      render(<NavMenu groups={badgeGroups} />);
      expect(screen.queryByTestId("badge")).not.toBeInTheDocument();
    });

    it("renders custom badgeComponent instead of Badge when provided", () => {
      const badgeGroups: NavMenuGroup[] = [
        {
          id: "g",
          label: "Group",
          items: [
            {
              id: "item-1",
              label: "Item",
              showBadge: true,
              badgeComponent: <span data-testid="custom-badge">new</span>,
            },
          ],
        },
      ];
      render(<NavMenu groups={badgeGroups} />);
      expect(screen.getByTestId("custom-badge")).toBeInTheDocument();
      expect(screen.queryByTestId("badge")).not.toBeInTheDocument();
    });

    it("calls onClickBadge with item id when badge is clicked", async () => {
      const onClickBadge = vi.fn();
      const badgeGroups: NavMenuGroup[] = [
        {
          id: "g",
          label: "Group",
          items: [
            { id: "item-1", label: "Item", showBadge: true, labelBadge: 3, onClickBadge },
          ],
        },
      ];
      render(<NavMenu groups={badgeGroups} />);
      await userEvent.click(screen.getByTestId("badge"));
      expect(onClickBadge).toHaveBeenCalledOnce();
      expect(onClickBadge).toHaveBeenCalledWith("item-1");
    });

    it("does not trigger item onClick when badge is clicked", async () => {
      const onClick = vi.fn();
      const badgeGroups: NavMenuGroup[] = [
        {
          id: "g",
          label: "Group",
          items: [
            { id: "item-1", label: "Item", showBadge: true, labelBadge: 3, onClick },
          ],
        },
      ];
      render(<NavMenu groups={badgeGroups} />);
      await userEvent.click(screen.getByTestId("badge"));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("iconOnly", () => {
    it("applies iconOnly class to the root element", () => {
      render(<NavMenu groups={groups} iconOnly />);
      const nav = screen.getByRole("navigation");
      expect(nav.className).toMatch(/iconOnly/);
    });

    it("does not set aria-expanded on items with children when iconOnly", () => {
      render(<NavMenu groups={groups} iconOnly />);
      const button = screen.getByRole("button", { name: "AI Files" });
      expect(button).not.toHaveAttribute("aria-expanded");
    });

    it("sets title attribute on items when iconOnly", () => {
      render(<NavMenu groups={groups} iconOnly />);
      expect(screen.getByRole("button", { name: "AI Files" })).toHaveAttribute(
        "title",
        "AI Files",
      );
    });

    it("flattens sub-items of the active parent into the top-level list when iconOnly", () => {
      render(<NavMenu groups={groups} iconOnly activeItemId="ai-files" />);
      // Active parent and its children render as siblings, without an expand step.
      expect(
        screen.getByRole("button", { name: "AI Files" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Shared with me" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Favorites" }),
      ).toBeInTheDocument();
      // Non-active parent's children are not flattened.
      expect(
        screen.queryByRole("button", { name: "Recent" }),
      ).not.toBeInTheDocument();
    });

    it("flattens sub-items when active item is a child (sibling active)", () => {
      render(<NavMenu groups={groups} iconOnly activeItemId="shared" />);
      // Parent whose child is active gets its children flattened.
      expect(
        screen.getByRole("button", { name: "AI Files" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Shared with me" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Favorites" }),
      ).toBeInTheDocument();
      // Other parent's children are not shown.
      expect(
        screen.queryByRole("button", { name: "Recent" }),
      ).not.toBeInTheDocument();
    });

    it("invokes sub-item onClick directly when iconOnly (no expand step)", async () => {
      const subOnClick = vi.fn();
      const groupsFlat: NavMenuGroup[] = [
        {
          id: "g1",
          items: [
            {
              id: "parent",
              label: "Parent",
              children: [
                { id: "child", label: "Child", onClick: subOnClick },
              ],
            },
          ],
        },
      ];
      render(<NavMenu groups={groupsFlat} iconOnly activeItemId="parent" />);
      await userEvent.click(screen.getByRole("button", { name: "Child" }));
      expect(subOnClick).toHaveBeenCalledOnce();
    });

    it("still calls item onClick when iconOnly", async () => {
      const onClick = vi.fn();
      const groupsWithHandler: NavMenuGroup[] = [
        {
          id: "g1",
          items: [{ id: "item-1", label: "Item One", onClick }],
        },
      ];
      render(<NavMenu groups={groupsWithHandler} iconOnly />);
      await userEvent.click(screen.getByRole("button", { name: "Item One" }));
      expect(onClick).toHaveBeenCalledOnce();
    });
  });

  describe("withAnimation", () => {
    it("does not dispatch ANIMATION_STARTED on item click when withAnimation is false", async () => {
      const spy = vi.spyOn(window, "dispatchEvent");

      render(<NavMenu groups={groups} />);
      await userEvent.click(screen.getByRole("button", { name: "AI Files" }));

      const dispatched = spy.mock.calls.map(([e]) => (e as CustomEvent).type);
      expect(dispatched).not.toContain("ANIMATION_STARTED");
    });

    it("dispatches ANIMATION_STARTED on item click when withAnimation is true", async () => {
      const spy = vi.spyOn(window, "dispatchEvent");

      render(<NavMenu groups={groups} withAnimation />);
      await userEvent.click(screen.getByRole("button", { name: "AI Files" }));

      const dispatched = spy.mock.calls.map(([e]) => (e as CustomEvent).type);
      expect(dispatched).toContain("ANIMATION_STARTED");
    });

    it("dispatches ANIMATION_STARTED on sub-item click when withAnimation is true", async () => {
      const spy = vi.spyOn(window, "dispatchEvent");

      render(
        <NavMenu groups={groups} withAnimation defaultExpandedId="ai-files" />,
      );
      await userEvent.click(
        screen.getByRole("button", { name: "Shared with me" }),
      );

      const dispatched = spy.mock.calls.map(([e]) => (e as CustomEvent).type);
      expect(dispatched).toContain("ANIMATION_STARTED");
    });

    it("applies animatedProgress class to active item sibling on click", async () => {
      render(<NavMenu groups={groups} activeItemId="ai-files" withAnimation />);

      const activeButton = screen.getByRole("button", { name: "AI Files" });
      await userEvent.click(activeButton);

      const sibling = activeButton.parentElement!.firstElementChild!;
      expect(sibling.className).toMatch(/animatedProgress/);
    });

    it("applies animatedProgress class to active sub-item sibling on click", async () => {
      render(
        <NavMenu
          groups={groups}
          activeItemId="shared"
          withAnimation
          defaultExpandedId="ai-files"
        />,
      );

      const activeSubButton = screen.getByRole("button", {
        name: "Shared with me",
      });
      await userEvent.click(activeSubButton);

      const sibling = activeSubButton.parentElement!.firstElementChild!;
      expect(sibling.className).toMatch(/animatedProgress/);
    });
  });
});
