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
import { render, screen } from "@testing-library/react";

import { Error401 } from "./Error401";
import { Error403 } from "./Error403";
import Error404 from "./Error404";
import { ErrorOfflineContainer } from "./ErrorOffline";
import { ErrorInvalidLink } from "./ErrorInvalidLink";
import ErrorUnavailable from "./ErrorUnavailable";
import { AccessRestricted } from "./AccessRestricted";

const mockTranslations: Record<string, string> = {
  Error401Text: "Unauthorized",
  Error403Text: "Forbidden",
  Error404Text: "Page not found",
  ErrorOfflineText: "You are offline",
  InvalidLink: "Invalid link",
  LinkDoesNotExist: "This link does not exist",
  ErrorDeactivatedText: "Portal {{productName}} deactivated",
  ProductName: "DocSpace",
  AccessDenied: "Access denied",
  PortalRestriction: "Access to {{productName}} is restricted",
};

const setupI18n = (data: Record<string, string> = {}) => {
  (
    window as unknown as { i18n: { loaded: Record<string, { data: Record<string, string> }> } }
  ).i18n = {
    loaded: {
      "en/Common.json": { data },
    },
  };
  document.cookie = "asc_language=en";
};

const clearI18n = () => {
  (window as unknown as { i18n: undefined }).i18n = undefined;
};

describe("Error Pages", () => {
  beforeEach(() => {
    setupI18n(mockTranslations);
  });

  describe("Error401", () => {
    it("renders without error", () => {
      render(<Error401 />);
      expect(screen.getByTestId("ErrorContainer")).toBeInTheDocument();
    });

    it("displays translated header text", () => {
      render(<Error401 />);
      expect(screen.getByText("Unauthorized")).toBeInTheDocument();
    });
  });

  describe("Error403", () => {
    it("renders without error", () => {
      render(<Error403 />);
      expect(screen.getByTestId("ErrorContainer")).toBeInTheDocument();
    });

    it("displays translated header text", () => {
      render(<Error403 />);
      expect(screen.getByText("Forbidden")).toBeInTheDocument();
    });
  });

  describe("Error404", () => {
    it("renders when translations are ready", () => {
      render(<Error404 />);
      expect(screen.getByTestId("ErrorContainer")).toBeInTheDocument();
    });

    it("displays translated header text", () => {
      render(<Error404 />);
      expect(screen.getByText("Page not found")).toBeInTheDocument();
    });

    it("renders nothing when translations are not ready", () => {
      clearI18n();

      const { container } = render(<Error404 />);
      expect(container.innerHTML).toBe("");
    });
  });

  describe("ErrorOfflineContainer", () => {
    it("renders without error", () => {
      render(<ErrorOfflineContainer />);
      expect(screen.getByTestId("ErrorContainer")).toBeInTheDocument();
    });

    it("displays translated header text", () => {
      render(<ErrorOfflineContainer />);
      expect(screen.getByText("You are offline")).toBeInTheDocument();
    });
  });

  describe("ErrorInvalidLink", () => {
    it("renders when translations are ready", () => {
      render(<ErrorInvalidLink />);
      expect(screen.getByTestId("ErrorContainer")).toBeInTheDocument();
    });

    it("displays header and body text", () => {
      render(<ErrorInvalidLink />);
      expect(screen.getByText("Invalid link")).toBeInTheDocument();
      expect(
        screen.getByText("This link does not exist"),
      ).toBeInTheDocument();
    });

    it("renders nothing when translations are not ready", () => {
      clearI18n();

      const { container } = render(<ErrorInvalidLink />);
      expect(container.innerHTML).toBe("");
    });
  });

  describe("ErrorUnavailable", () => {
    it("renders when translations are ready", () => {
      render(<ErrorUnavailable />);
      expect(screen.getByTestId("ErrorContainer")).toBeInTheDocument();
    });

    it("displays interpolated header text", () => {
      render(<ErrorUnavailable />);
      expect(
        screen.getByText("Portal DocSpace deactivated"),
      ).toBeInTheDocument();
    });

    it("wraps content in errorUnavailableWrapper", () => {
      const { container } = render(<ErrorUnavailable />);
      expect(
        container.querySelector(".errorUnavailableWrapper"),
      ).toBeInTheDocument();
    });
  });

  describe("AccessRestricted", () => {
    it("renders when translations are ready", () => {
      render(<AccessRestricted />);
      expect(screen.getByTestId("ErrorContainer")).toBeInTheDocument();
    });

    it("displays header and interpolated body text", () => {
      render(<AccessRestricted />);
      expect(screen.getByText("Access denied")).toBeInTheDocument();
      expect(
        screen.getByText("Access to DocSpace is restricted"),
      ).toBeInTheDocument();
    });

    it("wraps content in accessRestrictedWrapper", () => {
      const { container } = render(<AccessRestricted />);
      expect(
        container.querySelector(".accessRestrictedWrapper"),
      ).toBeInTheDocument();
    });

    it("calls window.history.replaceState on mount", () => {
      const replaceStateSpy = vi.spyOn(window.history, "replaceState");

      render(<AccessRestricted />);
      expect(replaceStateSpy).toHaveBeenCalledWith(null, "");

      replaceStateSpy.mockRestore();
    });
  });
});
