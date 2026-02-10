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
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import styles from "../../EmptyView.module.scss";
import type { EmptyViewItemProps } from "../../EmptyView.types";
import type { ContextMenuModel } from "../../../context-menu";
import { EmptyViewItem } from "./index";

const MockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg data-testid="item-icon" {...props} />
);

vi.mock("../../../../assets/right.arrow.react.svg", () => ({
  default: () => <svg data-testid="arrow-icon" />,
}));

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
    expect(screen.getByTestId("arrow-icon")).toBeInTheDocument();
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
