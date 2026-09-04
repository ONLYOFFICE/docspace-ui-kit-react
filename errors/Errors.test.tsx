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
  ErrorDeactivatedText: "This workspace is deactivated",
  ProductName: "DocSpace",
  AccessDenied: "Access denied",
  PortalRestriction: "Access to this workspace is restricted",
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

    it("displays header text", () => {
      render(<ErrorUnavailable />);
      expect(
        screen.getByText("This workspace is deactivated"),
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

    it("displays header and body text", () => {
      render(<AccessRestricted />);
      expect(screen.getByText("Access denied")).toBeInTheDocument();
      expect(
        screen.getByText("Access to this workspace is restricted"),
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
