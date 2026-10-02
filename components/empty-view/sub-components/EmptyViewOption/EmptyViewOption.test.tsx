import React from "react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import type {
  EmptyViewButtonType,
  EmptyViewItemType,
  EmptyViewLinkType,
  EmptyViewItemProps,
} from "../../EmptyView.types";

import EmptyViewOption from ".";
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
    primary,
    size,
    isHovered,
    disableHover,
    isLoading,
    isClicked,
    minWidth,
    scale,
    ...props
  }: {
    label: string;
    primary?: boolean;
    size?: string;
    isHovered?: boolean;
    disableHover?: boolean;
    isLoading?: boolean;
    isClicked?: boolean;
    minWidth?: string;
    scale?: boolean;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    buttonRenderSpy({
      primary,
      size,
      isHovered,
      disableHover,
      isLoading,
      isClicked,
      minWidth,
      scale,
      ...props,
    });
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
