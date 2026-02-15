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

import React from "react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import type {
  EmptyViewButtonType,
  EmptyViewItemType,
  EmptyViewLinkType,
  EmptyViewItemProps,
} from "../../EmptyView.types";

import { EmptyViewOption } from ".";
import type { LinkRouterProps, To } from "../../../../types";

vi.mock("../../EmptyView.module.scss", () => ({
  default: {
    link: "empty-view-link",
    button: "empty-view-button",
  },
}));

const linkRenderSpy = vi.fn();
vi.mock("../../../link", () => ({
  Link: ({ children, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => {
    linkRenderSpy(props);
    return (
      <a data-testid="ui-link" {...props}>
        {children}
      </a>
    );
  },
  LinkType: { action: "action" },
}));

const buttonRenderSpy = vi.fn();
vi.mock("../../../button", () => ({
  Button: ({
    label,
    ...props
  }: { label: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    buttonRenderSpy(props);
    return (
      <button data-testid="ui-button" {...props}>
        {label}
      </button>
    );
  },
  ButtonSize: { small: "small" },
}));

const renderEmptyViewItem = vi.fn((props: EmptyViewItemProps) => (
  <div data-testid="empty-view-item" {...props} />
));
vi.mock("../EmptyViewItem", () => ({
  EmptyViewItem: (props: EmptyViewItemProps) => renderEmptyViewItem(props),
}));

const toHref = (to: To): string => {
  if (typeof to === "string") return to;
  const { pathname = "", search = "", hash = "" } = to;
  return `${pathname}${search}${hash}`;
};

const MockLinkRouter = (props: LinkRouterProps) => {
  const { children, to, ...rest } = props;
  return (
    <a data-testid="mock-link-router" href={toHref(to)} {...rest}>
      {children}
    </a>
  );
};

const MockIcon = () => <svg data-testid="mock-icon" />;

describe("EmptyViewOption", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders fallback Link when option is marked as next regardless of LinkRouter", () => {
    const onClick = vi.fn();
    const option: EmptyViewLinkType = {
      key: "link-1",
      to: "/docs",
      icon: <MockIcon />,
      description: "Learn more",
      isNext: true,
      onClick,
    };

    render(<EmptyViewOption option={option} LinkRouter={MockLinkRouter} />);

    const link = screen.getByTestId("ui-link");

    expect(link).toHaveAttribute("id", "link-1");
    expect(link).toHaveClass("empty-view-link");
    expect(link).toHaveTextContent("Learn more");

    fireEvent.click(link);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("uses LinkRouter for standard link options", () => {
    const option: EmptyViewLinkType = {
      key: "link-2",
      to: "/team",
      state: { from: "empty" },
      icon: <MockIcon />,
      description: "Open team",
    };

    render(<EmptyViewOption option={option} LinkRouter={MockLinkRouter} />);

    expect(screen.queryByTestId("ui-link")).not.toBeInTheDocument();

    const routerLink = screen.getByTestId("mock-link-router");
    expect(routerLink).toHaveAttribute("href", "/team");
    expect(routerLink).toHaveTextContent("Open team");
  });

  it("renders Button when option type is button", () => {
    const onClick = vi.fn();
    const option: EmptyViewButtonType = {
      key: "btn-1",
      title: "Create workspace",
      onClick,
      type: "button",
    };

    render(<EmptyViewOption option={option} />);

    const button = screen.getByTestId("ui-button");
    expect(button).toHaveAttribute("id", "btn-1");
    expect(button).toHaveTextContent("Create workspace");

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("falls back to EmptyViewItem for generic items", () => {
    const option: EmptyViewItemType = {
      key: "item-1",
      title: "Invite",
      description: "Invite teammates",
      icon: <MockIcon />,
    };

    render(<EmptyViewOption option={option} />);

    expect(screen.getByTestId("empty-view-item")).toBeInTheDocument();
    expect(renderEmptyViewItem).toHaveBeenCalledWith(
      expect.objectContaining({ id: "item-1", title: "Invite" }),
    );
  });
});
