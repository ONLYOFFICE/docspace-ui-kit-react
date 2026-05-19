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
import { describe, it, expect } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";

import { MCPIcon } from "./MCPIcon";
import styles from "./MCPIcon.module.scss";

describe("<MCPIcon />", () => {
  const renderComponent = (props = {}) => {
    return render(<MCPIcon title="Test" {...props} />);
  };

  it("renders MCPIcon component without errors", () => {
    renderComponent();
    const iconElement = screen.getByTestId("mcp-icon");
    expect(iconElement).toBeInTheDocument();
  });

  it("renders with default size", () => {
    renderComponent();
    const iconElement = screen.getByTestId("mcp-icon");
    expect(iconElement.classList.contains(styles.large)).toBeTruthy();
  });

  it("renders with custom className", () => {
    const customClass = "custom-icon";
    renderComponent({ className: customClass });
    const iconElement = screen.getByTestId("mcp-icon");
    expect(iconElement.className).toContain(customClass);
  });

  it("renders with custom dataTestId", () => {
    renderComponent({ dataTestId: "custom-test-id" });
    const iconElement = screen.getByTestId("custom-test-id");
    expect(iconElement).toBeInTheDocument();
  });

  it("displays first character of title in uppercase", () => {
    renderComponent({ title: "hugging face" });
    expect(screen.getByText("H")).toBeInTheDocument();
  });

  it("renders image when imgSrc is provided", () => {
    renderComponent({
      title: "Test",
      imgSrc: "https://example.com/icon.svg",
    });
    const imgElement = screen.getByRole("img");
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute("src", "https://example.com/icon.svg");
  });

  it("falls back to title when image fails to load", async () => {
    renderComponent({ title: "Fallback", imgSrc: "invalid-url.jpg" });

    const imgElement = screen.getByRole("img");

    act(() => {
      imgElement.dispatchEvent(new Event("error"));
    });

    await waitFor(() => {
      expect(screen.getByText("F")).toBeInTheDocument();
    });
  });

  it("resets error state when imgSrc changes", async () => {
    const { rerender } = renderComponent({
      title: "Test",
      imgSrc: "invalid-url.jpg",
    });

    const imgElement = screen.getByRole("img");

    act(() => {
      imgElement.dispatchEvent(new Event("error"));
    });

    await waitFor(() => {
      expect(screen.getByText("T")).toBeInTheDocument();
    });

    rerender(
      <MCPIcon title="Test" imgSrc="https://example.com/new-icon.svg" />,
    );

    await waitFor(() => {
      const newImgElement = screen.getByRole("img");
      expect(newImgElement).toHaveAttribute(
        "src",
        "https://example.com/new-icon.svg",
      );
    });
  });
});
