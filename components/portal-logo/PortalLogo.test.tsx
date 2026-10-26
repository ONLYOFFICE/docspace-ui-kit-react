import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  screen,
  fireEvent,
  act,
  waitFor,
  render,
} from "@testing-library/react";

import PortalLogo from "./PortalLogo";

vi.mock("react-device-detect", () => ({
  isMobileOnly: false,
}));

describe("PortalLogo", () => {
  const mockResizeEvent = (width: number) => {
    window.innerWidth = width;
    act(() => {
      fireEvent(window, new Event("resize"));
    });
  };

  beforeEach(() => {
    // Reset window size before each test
    window.innerWidth = 1024;
  });

  it("renders without crashing", () => {
    render(<PortalLogo />);
    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute(
      "src",
      "/logo.ashx?logotype=2&dark=false&default=false",
    );
  });

  it("applies custom className when provided", () => {
    render(<PortalLogo className="custom-class" />);
    const img = screen.getByRole("img");
    expect(img).toHaveClass("custom-class");
  });

  it("adds wrapper class by default", () => {
    render(<PortalLogo />);
    const wrapper = screen.getByRole("img").parentElement;
    expect(wrapper?.className).toContain("wrapper");
  });

  it("shows mobile styles when screen is mobile and resizable", async () => {
    render(<PortalLogo isResizable />);
    mockResizeEvent(767); // Mobile breakpoint

    await waitFor(() => {
      const wrapper = screen.getByRole("img").parentElement;
      const className = wrapper?.className || "";
      expect(className).toContain("mobile");
      expect(className).toContain("resizable");
    });
  });

  it("hides logo on mobile when not resizable", async () => {
    render(<PortalLogo isResizable={false} />);
    mockResizeEvent(767); // Mobile breakpoint

    await waitFor(() => {
      const wrapper = screen.getByRole("img").parentElement;
      const className = wrapper?.className || "";
      expect(className).not.toContain("resizable");
    });
  });

  it("removes resize event listener on unmount", () => {
    const { unmount } = render(<PortalLogo isResizable />);
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
  });

  it("names the image with the alt prop, defaulting to the old string", () => {
    const { unmount } = render(<PortalLogo />);
    expect(screen.getByRole("img", { name: "portal logo" })).toBeVisible();
    unmount();

    render(<PortalLogo alt="Acme portal" />);
    expect(screen.getByRole("img", { name: "Acme portal" })).toHaveAttribute(
      "alt",
      "Acme portal",
    );
  });

  it("gives the fallback mark the same accessible name", () => {
    render(<PortalLogo alt="Acme portal" />);
    fireEvent.error(screen.getByRole("img"));

    const fallback = screen.getByRole("img", { name: "Acme portal" });
    expect(fallback.tagName.toLowerCase()).toBe("svg");
  });

  // A server-rendered logo that failed before hydration never reaches onError;
  // it stayed a broken image (the SDK's public-room password page).
  describe("an image that settled before it mounted", () => {
    const settle = (decode: () => Promise<void>, complete = true) => {
      const completeSpy = vi
        .spyOn(HTMLImageElement.prototype, "complete", "get")
        .mockReturnValue(complete);
      // jsdom has no decode(); the component calls it only when present.
      const decodeMock = vi.fn(decode);
      Object.defineProperty(HTMLImageElement.prototype, "decode", {
        configurable: true,
        value: decodeMock,
      });
      return {
        decodeMock,
        restore: () => {
          completeSpy.mockRestore();
          Reflect.deleteProperty(HTMLImageElement.prototype, "decode");
        },
      };
    };

    it("shows the fallback when the image failed", async () => {
      const { restore } = settle(() => Promise.reject(new Error("broken")));
      try {
        render(<PortalLogo alt="Acme portal" />);

        await waitFor(() =>
          expect(
            screen
              .getByRole("img", { name: "Acme portal" })
              .tagName.toLowerCase(),
          ).toBe("svg"),
        );
      } finally {
        restore();
      }
    });

    it("keeps the image when it decoded", async () => {
      const { decodeMock, restore } = settle(() => Promise.resolve());
      try {
        render(<PortalLogo alt="Acme portal" />);
        await waitFor(() => expect(decodeMock).toHaveBeenCalled());
        await act(async () => {});

        expect(screen.getByRole("img", { name: "Acme portal" }).tagName).toBe(
          "IMG",
        );
      } finally {
        restore();
      }
    });

    it("leaves an image still loading to onError", async () => {
      const { decodeMock, restore } = settle(
        () => Promise.reject(new Error("broken")),
        false,
      );
      try {
        render(<PortalLogo alt="Acme portal" />);
        await act(async () => {});

        expect(decodeMock).not.toHaveBeenCalled();
        expect(screen.getByRole("img", { name: "Acme portal" }).tagName).toBe(
          "IMG",
        );
      } finally {
        restore();
      }
    });
  });

  it("hides the fallback mark from assistive technology when alt is empty", () => {
    render(<PortalLogo alt="" />);
    fireEvent.error(screen.getByRole("presentation", { hidden: true }));

    expect(screen.getByTestId("svg-mock")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("does not add resize listener when isResizable is false", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    render(<PortalLogo isResizable={false} />);
    expect(addEventListenerSpy).not.toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
  });
});
