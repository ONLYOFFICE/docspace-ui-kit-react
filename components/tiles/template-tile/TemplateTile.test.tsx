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
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { TemplateTile } from ".";
import { TemplateTileProps, SpaceQuotaProps, TemplateItem } from "./TemplateTile.types";

// Mock translations
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock getCommonTranslation
vi.mock("../../../utils/i18n", () => ({
  getCommonTranslation: (key: string) => key,
  useCommonTranslation: () => (key: string) => key,
}));

// Mock styles - return default export for CSS Modules
vi.mock("./TemplateTile.module.scss", () => ({
  default: {
    wrapper: "wrapper",
    field: "field",
    text: "text",
  },
}));

// Mock Link component
vi.mock("../../link", () => ({
  Link: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button type="button" data-testid="link" onClick={onClick}>
      {children}
    </button>
  ),
}));

// Mock Text component
vi.mock("../../text", () => ({
  Text: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="text" className={className}>
      {children}
    </div>
  ),
}));

interface BaseTileProps {
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  className?: string;
  onSelect?: (checked: boolean, item: unknown) => void;
  item?: unknown;
}

// Mock BaseTile component
vi.mock("../base-tile", () => ({
  BaseTile: ({
    topContent,
    bottomContent,
    className,
    onSelect,
    item,
  }: BaseTileProps) => (
    <div data-testid="base-tile" className={className}>
      <div data-testid="top-content">{topContent}</div>
      <div data-testid="bottom-content">{bottomContent}</div>
      <button
        type="button"
        data-testid="select-button"
        onClick={() => onSelect?.(true, item)}
      >
        Select
      </button>
    </div>
  ),
}));

describe("TemplateTile", () => {
  const mockItem = {
    id: "1",
    title: "Test Template",
    createdBy: {
      displayName: "John Doe",
      id: "1",
    },
    security: {
      EditRoom: true,
    },
  };

  const mockContextOptions = [
    { key: "edit", label: "Edit", onClick: vi.fn() },
    { key: "delete", label: "Delete", onClick: vi.fn() },
  ];

  const MockSpaceQuota: React.FC<SpaceQuotaProps> = ({ item, type }) => (
    <div data-testid="space-quota">
      Space Quota: {item.id}, Type: {type}
    </div>
  );

  const TemplateContent = () => (
    <div data-testid="template-content">{mockItem.title}</div>
  );

  const renderTemplateTile = (props: Partial<TemplateTileProps> = {}) => {
    const defaultProps: TemplateTileProps = {
      item: mockItem,
      children: <TemplateContent />,
      columnCount: 3,
      showStorageInfo: false,
      openUser: vi.fn(),
      contextOptions: mockContextOptions,
      onSelect: vi.fn(),
      checked: false,
      isActive: false,
      isBlockingOperation: false,
      inProgress: false,
      isEdit: false,
      showHotkeyBorder: false,
      SpaceQuotaComponent: MockSpaceQuota,
      ...props,
    };

    return render(<TemplateTile {...defaultProps} />);
  };

  it("renders template title correctly", () => {
    renderTemplateTile();
    expect(screen.getByTestId("template-content")).toBeTruthy();
    expect(screen.getByTestId("template-content").textContent).toBe(
      "Test Template",
    );
  });

  it("renders owner information", () => {
    renderTemplateTile();
    const ownerLabel = screen.getByText("Owner");
    const ownerName = screen.getByText("John Doe");

    expect(ownerLabel).toBeTruthy();
    expect(ownerName).toBeTruthy();
  });

  it("calls openUser when owner link is clicked", () => {
    const openUser = vi.fn();
    renderTemplateTile({ openUser });

    const ownerLink = screen.getByTestId("link");
    fireEvent.click(ownerLink);

    expect(openUser).toHaveBeenCalled();
  });

  it("shows storage information when showStorageInfo is true", () => {
    renderTemplateTile({ showStorageInfo: true });

    expect(screen.getByText("Storage")).toBeTruthy();
    expect(screen.getByTestId("space-quota")).toBeTruthy();
  });

  it("does not show storage information when showStorageInfo is false", () => {
    renderTemplateTile({ showStorageInfo: false });

    expect(screen.queryByText("Storage")).toBeNull();
    expect(screen.queryByTestId("space-quota")).toBeNull();
  });

  it("does not show space quota when SpaceQuotaComponent is not provided", () => {
    renderTemplateTile({
      showStorageInfo: true,
      SpaceQuotaComponent: undefined,
    });

    expect(screen.queryByTestId("space-quota")).toBeNull();
  });

  it("renders badges when provided", () => {
    const badges = <div data-testid="test-badge">Badge</div>;
    renderTemplateTile({ badges });
    expect(screen.getByTestId("test-badge")).toBeTruthy();
  });

  it("passes correct props to BaseTile", () => {
    renderTemplateTile();

    const baseTile = screen.getByTestId("base-tile");
    const topContent = screen.getByTestId("top-content");
    const bottomContent = screen.getByTestId("bottom-content");

    expect(baseTile).toBeTruthy();
    expect(topContent).toBeTruthy();
    expect(bottomContent).toBeTruthy();
  });

  it("adjusts layout based on columnCount", () => {
    const columnCount = 4;
    renderTemplateTile({ columnCount });

    // Here we could check for specific layout adjustments based on columnCount
    // This might involve checking specific class names or styles
    expect(screen.getByTestId("base-tile")).toBeTruthy();
  });

  it("calls onSelect when base item is a template item", () => {
    const onSelect = vi.fn();
    renderTemplateTile({ onSelect });

    const selectButton = screen.getByTestId("select-button");
    fireEvent.click(selectButton);

    expect(onSelect).toHaveBeenCalledWith(true, mockItem);
  });

  it("does not call onSelect when base item is not a template item", () => {
    const onSelect = vi.fn();
    const invalidItem = { id: "2" } as unknown as TemplateItem;
    renderTemplateTile({ onSelect, item: invalidItem });

    const selectButton = screen.getByTestId("select-button");
    fireEvent.click(selectButton);

    expect(onSelect).not.toHaveBeenCalled();
  });
});
