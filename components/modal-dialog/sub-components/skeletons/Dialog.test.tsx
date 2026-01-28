/*
 * (c) Copyright Ascensio System SIA 2009-2026
 *
 * This program is a free software product.
 * You can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
 * Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
 * to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
 * any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
 * the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions of the Program must
 * display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product logo when
 * distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
 * trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
 * content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
 * International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
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
