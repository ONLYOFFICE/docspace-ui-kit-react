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
import { render, screen } from "@testing-library/react";

import { DialogModalSkeleton } from "./Dialog.modal";
import { DialogAsideSkeleton } from "./Dialog.aside";
import { DialogInvitePanelSkeleton } from "./Dialog.invite";
import { DialogReassignmentSkeleton } from "./Dialog.reassignment";

describe("Dialog Skeleton Components", () => {
  describe("DialogModalSkeleton", () => {
    it("renders without crashing", () => {
      render(<DialogModalSkeleton isLarge={false} withFooterBorder={false} />);
      const skeleton = screen.getByTestId("dialog-skeleton");
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveAttribute("data-is-large", "false");
      expect(skeleton).toHaveAttribute("data-with-footer-border", "false");
    });

    it("renders with large size and footer border", () => {
      render(<DialogModalSkeleton isLarge withFooterBorder />);
      const skeleton = screen.getByTestId("dialog-skeleton");
      expect(skeleton).toHaveAttribute("data-is-large", "true");
      expect(skeleton).toHaveAttribute("data-with-footer-border", "true");
    });
  });

  describe("DialogAsideSkeleton", () => {
    it("renders without crashing", () => {
      render(
        <DialogAsideSkeleton
          isPanel={false}
          withoutAside={false}
          withFooterBorder={false}
        />,
      );
      const skeleton = screen.getByTestId("dialog-aside-skeleton");
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveAttribute("data-is-panel", "false");
      expect(skeleton).toHaveAttribute("data-with-footer-border", "false");
    });

    it("renders with panel and footer border", () => {
      render(
        <DialogAsideSkeleton isPanel withoutAside={false} withFooterBorder />,
      );
      const skeleton = screen.getByTestId("dialog-aside-skeleton");
      expect(skeleton).toHaveAttribute("data-is-panel", "true");
      expect(skeleton).toHaveAttribute("data-with-footer-border", "true");
    });

    it("renders without aside", () => {
      render(
        <DialogAsideSkeleton
          isPanel={false}
          withoutAside
          withFooterBorder={false}
        />,
      );
      const skeleton = screen.getByTestId("dialog-aside-skeleton");
      expect(skeleton).toBeInTheDocument();
    });

    it("renders invite panel loader when isInvitePanelLoader is true", () => {
      render(
        <DialogAsideSkeleton
          isPanel={false}
          withoutAside={false}
          withFooterBorder={false}
          isInvitePanelLoader
        />,
      );
      const invitePanel = screen.getByTestId("dialog-invite-panel-skeleton");
      expect(invitePanel).toBeInTheDocument();
    });
  });

  describe("DialogInvitePanelSkeleton", () => {
    it("renders without crashing", () => {
      render(<DialogInvitePanelSkeleton />);
      const skeleton = screen.getByTestId("dialog-invite-panel-skeleton");
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe("DialogReassignmentSkeleton", () => {
    it("renders without crashing", () => {
      render(<DialogReassignmentSkeleton />);
      const skeleton = screen.getByTestId("dialog-reassignment-skeleton");
      expect(skeleton).toBeInTheDocument();
    });
  });
});
