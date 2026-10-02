import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import styles from "../../EmptyView.module.scss";
import type { EmptyViewItemProps } from "../../EmptyView.types";
import type { ContextMenuModel } from "../../../context-menu";
import { EmptyViewItem } from "./index";

const MockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg data-testid="item-icon" {...props} />
);

const contextMenuShowMock = vi.fn();

vi.mock("../../../context-menu", () => {
  return {
    ContextMenu: React.forwardRef((_props, ref) => {
      React.useImperativeHandle(ref, () => ({
        show: contextMenuShowMock,
        hide: vi.fn(),
        toggle: vi.fn(),
        menuRef: { current: null },
      }));
      return <div data-testid="context-menu-mock" />;
    }),
  };
});

describe("EmptyViewItem", () => {
  const defaultProps = {
    id: "item-1",
    title: "Example title",
    description: "Example description",
    icon: <MockIcon />,
  };

  const renderComponent = (props?: Partial<EmptyViewItemProps>) =>
    render(<EmptyViewItem {...defaultProps} {...props} />);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a button-like wrapper with icon, text and arrow", () => {
    renderComponent();

    const wrapper = screen.getByRole("button", { name: defaultProps.title });

    expect(wrapper).toHaveAttribute("id", defaultProps.id);
    expect(wrapper).toHaveAttribute("tabindex", "0");
    expect(wrapper).toHaveClass(styles.itemWrapper);

    expect(screen.getByText(defaultProps.title)).toHaveClass(styles.itemHeader);
    expect(screen.getByText(defaultProps.description)).toHaveClass(
      styles.itemSubheading,
    );

    expect(screen.getByTestId("item-icon")).toHaveClass(styles.itemIcon);
    expect(screen.getByTestId("svg-mock")).toBeInTheDocument();
  });

  it("does not render when disabled", () => {
    const { container } = renderComponent({ disabled: true });

    expect(container.firstChild).toBeNull();
  });

  it("calls onClick when clicked without context menu model", () => {
    const onClick = vi.fn();
    renderComponent({ onClick });

    fireEvent.click(screen.getByRole("button", { name: defaultProps.title }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(contextMenuShowMock).not.toHaveBeenCalled();
  });

  it("shows context menu when model is provided", () => {
    const model = [{ key: "copy", label: "Copy" }] as ContextMenuModel[];
    const onClick = vi.fn();

    renderComponent({ model, onClick });

    fireEvent.click(screen.getByRole("button", { name: defaultProps.title }));

    expect(contextMenuShowMock).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });
});
