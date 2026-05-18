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

import { describe, it, expect, vi } from "vitest";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Badge } from ".";
import styles from "./Badge.module.scss";

describe("<Badge />", () => {
  const renderComponent = (props = {}) => {
    return render(<Badge {...props} />);
  };

  describe("Rendering", () => {
    it("renders Badge component", () => {
      renderComponent();
      const badgeElement = screen.getByRole("generic");
      expect(badgeElement).toBeInTheDocument();
    });

    it("renders Badge with correct text", () => {
      renderComponent({ label: "Test Badge" });
      const badgeElement = screen.getByText("Test Badge");
      expect(badgeElement).toBeInTheDocument();
    });

    it("displays label correctly", () => {
      renderComponent({ label: "10" });
      expect(screen.getByText("10")).toBeInTheDocument();
    });

    it("renders with default props", () => {
      renderComponent();
      const badge = screen.getByTestId("badge");
      expect(badge).toHaveAttribute("role", "status");
      expect(badge).toHaveAttribute("aria-atomic", "true");
      expect(badge).toHaveAttribute("aria-live", "polite");
    });

    it("applies base styles correctly", () => {
      renderComponent({ label: "10" });
      const badge = screen.getByTestId("badge");

      expect(badge.classList.contains(styles.badge)).toBeTruthy();
      expect(badge.classList.contains(styles.themed)).toBeTruthy();
    });

    it("applies custom styles correctly", () => {
      const customProps = {
        fontSize: "14px",
        color: "red",
        backgroundColor: "blue",
        borderRadius: "5px",
        padding: "10px",
        maxWidth: "100px",
        height: "30px",
        border: "1px solid black",
        label: "10",
      };

      renderComponent(customProps);
      const badge = screen.getByTestId("badge");

      expect(badge.style.height).toBe("30px");
      expect(badge.style.border).toBe("1px solid black");
      expect(badge.style.borderRadius).toBe("5px");
    });
  });

  describe("Styling", () => {
    it("renders Badge with custom className", () => {
      const customClass = "custom-badge";
      renderComponent({ className: customClass });
      const badgeElement = screen.getByTestId("badge");
      expect(badgeElement.className).toContain(customClass);
    });
  });

  describe("Accessibility", () => {
    it("has correct ARIA attributes when non-interactive", () => {
      renderComponent({ label: "5" });
      const badge = screen.getByTestId("badge");
      expect(badge).toHaveAttribute("role", "status");
      expect(badge).toHaveAttribute("aria-label", "5 ");
      expect(badge).toHaveAttribute("aria-live", "polite");
      expect(badge).toHaveAttribute("aria-atomic", "true");
    });
  });

  describe("Interactions", () => {
    it("handles click events", async () => {
      const onClick = vi.fn();
      renderComponent({ label: "Click", onClick });

      const badge = screen.getByTestId("badge");
      await userEvent.click(badge);
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Display Logic", () => {
    it("does not display when label is 0", () => {
      renderComponent({ label: "0" });
      const badge = screen.getByTestId("badge");
      expect(badge).toHaveAttribute("data-hidden", "true");
    });

    it("displays when label is non-zero", () => {
      renderComponent({ label: "1" });
      const badge = screen.getByTestId("badge");
      expect(badge).not.toHaveAttribute("data-hidden", "true");
    });

    it("applies high priority styling", () => {
      renderComponent({ label: "High", type: "high" });
      const badge = screen.getByTestId("badge");
      expect(badge).toHaveAttribute("data-type", "high");
    });
  });
});
