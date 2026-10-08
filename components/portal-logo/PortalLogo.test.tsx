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
