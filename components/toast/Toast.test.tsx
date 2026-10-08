import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { screen, act, render, fireEvent } from "@testing-library/react";
import { InterfaceDirectionProvider } from "../../context/InterfaceDirectionContext";
import { Toast } from ".";
import { toastr } from "./sub-components/Toastr";

vi.useFakeTimers();

describe("<Toast />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear any existing toasts and reset timers
    toastr.clear();
    vi.clearAllTimers();
  });

  afterEach(() => {
    // Cleanup after each test
    act(() => {
      toastr.clear();
      vi.runAllTimers();
    });
  });

  it("shows success toast", () => {
    render(<Toast />);

    act(() => {
      toastr.success("Success message", "Success");
    });

    expect(screen.getByText("Success message")).toBeInTheDocument();
    expect(screen.getByText("Success")).toBeInTheDocument();
  });

  it("shows error toast", () => {
    render(<Toast />);

    act(() => {
      toastr.error("Error message", "Error");
    });

    expect(screen.getByText("Error message")).toBeInTheDocument();
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("shows warning toast", () => {
    render(<Toast />);

    act(() => {
      toastr.warning("Warning message", "Warning");
    });

    expect(screen.getByText("Warning message")).toBeInTheDocument();
    expect(screen.getByText("Warning")).toBeInTheDocument();
  });

  it("shows info toast", () => {
    render(<Toast />);

    act(() => {
      toastr.info("Info message", "Info");
    });

    expect(screen.getByText("Info message")).toBeInTheDocument();
    expect(screen.getByText("Info")).toBeInTheDocument();
  });

  it("shows toast with close button when withCross is true", () => {
    render(<Toast />);

    act(() => {
      toastr.success("With close button", "Title", 5000, true);
    });

    expect(screen.getByText("With close button")).toBeInTheDocument();
    expect(document.querySelector(".closeButton")).toBeInTheDocument();
  });

  it("handles error object with response data", () => {
    render(<Toast />);

    const errorObj = {
      response: {
        data: {
          error: {
            message: "API Error",
          },
        },
      },
    };

    act(() => {
      toastr.error(errorObj);
    });

    expect(screen.getByText("API Error")).toBeInTheDocument();
  });

  it("accepts custom React elements as content", () => {
    render(<Toast />);

    act(() => {
      toastr.success(<div data-testid="custom-content">Custom Element</div>);
    });

    expect(screen.getByTestId("custom-content")).toBeInTheDocument();
  });

  it("stays open when timeout is 0", () => {
    render(<Toast />);

    act(() => {
      toastr.success("Persistent message", "Title", 0);
    });

    expect(screen.getByText("Persistent message")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(screen.getByText("Persistent message")).toBeInTheDocument();
  });

  it("handles multiple toasts simultaneously", () => {
    render(<Toast />);

    act(() => {
      toastr.success("Success message", "Success");
      toastr.error("Error message", "Error");
      toastr.warning("Warning message", "Warning");
    });

    expect(screen.getByText("Success message")).toBeInTheDocument();
    expect(screen.getByText("Error message")).toBeInTheDocument();
    expect(screen.getByText("Warning message")).toBeInTheDocument();
  });

  it("checks toast active status", () => {
    render(<Toast />);

    let toastId: string | number;

    act(() => {
      toastId = toastr.success("Active toast") as string | number;

      expect(toastr.isActive(toastId)).toBe(true);
    });

    act(() => {
      toastr.clear();

      expect(toastr.isActive(toastId)).toBe(false);
    });
  });

  it("handles empty array as toast content", () => {
    render(<Toast />);

    act(() => {
      toastr.success([]);
    });

    // Toast should still be created but with empty content
    expect(document.querySelector(".Toastify__toast")).toBeInTheDocument();
  });

  it("handles server-side rendering", () => {
    render(<Toast isSSR />);

    // Component should not render on server
    expect(
      document.querySelector("[data-testid='toast']"),
    ).not.toBeInTheDocument();
  });
  it("renders one container however many <Toast /> are mounted", () => {
    // A Storybook docs page mounts one per story, and a plugin inside the
    // portal can mount its own next to the portal's. react-toastify keys its
    // registry by containerId, so the later one used to take the earlier's
    // place, and a toast still showing in the earlier threw on its next render.
    const Pair = ({ first }: { first: string }) => (
      <>
        <Toast key={first} />
        <Toast />
      </>
    );
    const { rerender } = render(<Pair first="a" />);

    act(() => {
      toastr.success("Only once", "Two mounted");
    });

    expect(screen.getAllByText("Only once")).toHaveLength(1);
    expect(document.querySelectorAll(".Toastify")).toHaveLength(1);

    rerender(<Pair first="b" />);

    act(() => {
      toastr.info("After a remount", "Two mounted");
    });

    const toast = screen
      .getByText("After a remount")
      .closest(".Toastify__toast");
    expect(() =>
      act(() => {
        toast?.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
        toast?.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
        vi.advanceTimersByTime(100);
      }),
    ).not.toThrow();
    expect(screen.getAllByText("After a remount")).toHaveLength(1);
  });

  it("gives every toast a named close button, also without withCross", () => {
    render(<Toast />);

    act(() => {
      toastr.success("No cross", "Title", 0);
    });

    // The button is there for the keyboard even when the toast closes on click.
    const close = screen.getByRole("button", { name: "Close" });
    expect(close).toHaveAttribute("type", "button");

    const toast = close.closest(".Toastify__toast");
    expect(toast).toHaveAttribute("data-in", "true");

    act(() => {
      fireEvent.click(close);
    });

    // The toast starts its exit transition.
    expect(toast).toHaveAttribute("data-in", "false");
  });

  it("takes the close button's name from closeButtonLabel", () => {
    render(<Toast closeButtonLabel="Dismiss" />);

    act(() => {
      toastr.info("Named", "Title", 0, true);
    });

    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
  });

  it("follows the interface direction instead of always being rtl", () => {
    const { unmount } = render(<Toast />);

    act(() => {
      toastr.info("Direction", "Title", 0);
    });

    expect(
      document.querySelector(".Toastify__toast-container--rtl"),
    ).toBeNull();
    act(() => {
      toastr.clear();
      vi.runAllTimers();
    });
    unmount();

    render(
      <InterfaceDirectionProvider interfaceDirection="rtl">
        <Toast />
      </InterfaceDirectionProvider>,
    );

    act(() => {
      toastr.info("Direction", "Title", 0);
    });

    expect(
      document.querySelector(".Toastify__toast-container--rtl"),
    ).not.toBeNull();
  });

  it("shows a number as text", () => {
    render(<Toast />);

    act(() => {
      toastr.error(404 as unknown as string);
    });

    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("falls back to the English default title without translations", () => {
    render(<Toast />);

    act(() => {
      toastr.success("Saved");
      toastr.warning("Careful");
    });

    expect(screen.getByText("Done")).toBeInTheDocument();
    expect(screen.getByText("Alert")).toBeInTheDocument();
  });
});
