/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
