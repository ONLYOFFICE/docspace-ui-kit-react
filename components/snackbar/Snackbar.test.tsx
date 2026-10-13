import { describe, it, expect, vi, afterEach } from "vitest";
import { useLayoutEffect } from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { SnackBar } from "./Snackbar";

describe("SnackBar", () => {
  const defaultProps = {
    text: "Test message",
    headerText: "Test header",
    btnText: "Action",
    countDownTime: 5000,
    sectionWidth: 400,
  };

  it("renders with required props", () => {
    render(<SnackBar {...defaultProps} />);
    expect(screen.getByTestId("snackbar-message")).toHaveTextContent(
      "Test message",
    );
    expect(screen.getByTestId("snackbar-header")).toHaveTextContent(
      "Test header",
    );
  });

  it("renders HTML content when provided", () => {
    const htmlContent = "<p>HTML content</p>";
    render(
      <SnackBar {...defaultProps} htmlContent={htmlContent} text={undefined} />,
    );
    expect(screen.getByTestId("snackbar-html-content")).toBeInTheDocument();
    expect(screen.getByTestId("snackbar-html-content")).toContainHTML(
      htmlContent,
    );
  });

  it("shows icon when showIcon is true", () => {
    render(<SnackBar {...defaultProps} showIcon />);
    expect(screen.getByTestId("snackbar-icon")).toBeInTheDocument();
  });

  it("renders a named, non-submitting close button when btnText is not provided", () => {
    const onSubmit = vi.fn((e: { preventDefault: () => void }) =>
      e.preventDefault(),
    );
    const onAction = vi.fn();
    render(
      <form onSubmit={onSubmit}>
        <SnackBar {...defaultProps} btnText={undefined} onAction={onAction} />
      </form>,
    );
    const button = screen.getByRole("button", { name: "Close" });
    expect(button.className).toContain("action");
    expect(button).toHaveAttribute("type", "button");
    fireEvent.click(button);
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("takes the close button's name from closeButtonLabel", () => {
    render(
      <SnackBar
        {...defaultProps}
        btnText={undefined}
        closeButtonLabel="Dismiss"
      />,
    );
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
  });

  it("renders the action as a button", () => {
    render(<SnackBar {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: defaultProps.btnText }),
    ).toHaveAttribute("type", "button");
  });

  it("announces through a hidden status region, not the visible bar", async () => {
    render(<SnackBar {...defaultProps} />);
    const bar = screen.getByTestId("snackbar-container");
    expect(bar).not.toHaveAttribute("role");
    expect(bar).not.toHaveAttribute("aria-live");
    expect(bar).toHaveAttribute("id", "snackbar-container");

    const status = screen.getByRole("status");
    expect(status).toBe(screen.getByTestId("snackbar-announcement"));
    await waitFor(() =>
      expect(status).toHaveTextContent("Test header Test message"),
    );
    expect(status).not.toHaveTextContent(defaultProps.btnText);
  });

  // The first render is all the server renders: the region is in it, empty,
  // while the visible bar already has its text.
  it("mounts the status region empty and fills it after mount", () => {
    const host = document.createElement("div");
    host.innerHTML = renderToStaticMarkup(<SnackBar {...defaultProps} />);
    expect(
      host.querySelector('[data-testid="snackbar-message"]'),
    ).toHaveTextContent("Test message");
    const region = host.querySelector('[role="status"]');
    expect(region).not.toBeNull();
    expect(region).toBeEmptyDOMElement();
  });

  it("announces injected HTML as its text", async () => {
    render(
      <SnackBar
        {...defaultProps}
        htmlContent="<p>Tom &amp; Jerry <a href='/x'>more</a></p>"
        text={undefined}
      />,
    );
    const status = screen.getByRole("status");
    await waitFor(() => expect(status).toHaveTextContent("Tom & Jerry more"));
    expect(status.querySelector("a")).toBeNull();
  });

  it("announces a message with a link as text, without copying the link", async () => {
    render(
      <SnackBar
        {...defaultProps}
        text={
          <>
            Confirm your email.{" "}
            <a href="/resend" data-testid="link">
              Resend
            </a>
          </>
        }
      />,
    );
    const status = screen.getByRole("status");
    await waitFor(() =>
      expect(status).toHaveTextContent(
        "Test header Confirm your email. Resend",
      ),
    );
    expect(status.querySelector("a")).toBeNull();
    expect(screen.getAllByTestId("link")).toHaveLength(1);
  });

  it("takes its DOM id from the id prop", () => {
    render(<SnackBar {...defaultProps} id="quota-bar" />);
    expect(screen.getByTestId("snackbar-container")).toHaveAttribute(
      "id",
      "quota-bar",
    );
  });

  it("keeps the ignored props off the DOM", () => {
    render(<SnackBar {...defaultProps} isMaintenance skipBlur />);
    const bar = screen.getByTestId("snackbar-container");
    expect(bar).not.toHaveAttribute("ismaintenance");
    expect(bar).not.toHaveAttribute("skipblur");
  });

  it("renders the campaign cross as a named button", () => {
    const onAction = vi.fn();
    render(
      <SnackBar
        {...defaultProps}
        isCampaigns
        htmlContent="https://example.com"
        onAction={onAction}
      />,
    );
    fireEvent.load(screen.getByTestId("snackbar-iframe"));
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("handles click events", () => {
    const onAction = vi.fn();
    render(<SnackBar {...defaultProps} onAction={onAction} />);

    const button = screen.getByText(defaultProps.btnText);
    fireEvent.click(button);

    expect(onAction).toHaveBeenCalled();
  });

  it("renders campaigns iframe when isCampaigns is true", () => {
    const htmlContent = "https://example.com";
    render(
      <SnackBar {...defaultProps} isCampaigns htmlContent={htmlContent} />,
    );

    const iframe = screen.getByTestId("snackbar-iframe");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", htmlContent);
  });

  it("applies correct styles based on props", () => {
    const textAlign = "center";

    render(<SnackBar {...defaultProps} textAlign={textAlign} />);

    const container = screen.getByTestId("snackbar-container");
    const textContainer = container.querySelector("[class*='textContainer']");
    if (textContainer) {
      expect(textContainer).toHaveStyle({
        "--text-align": textAlign,
      });
    }
  });

  describe("static show / close", () => {
    // close() unmounts on a microtask, so it is awaited.
    const close = () =>
      act(async () => {
        SnackBar.close();
      });

    afterEach(async () => {
      await close();
      document.body.innerHTML = "";
    });

    it("reuses one node and one root across calls without a parent", async () => {
      act(() => SnackBar.show({ ...defaultProps, parentElementId: "" }));
      act(() =>
        SnackBar.show({ ...defaultProps, text: "Second", parentElementId: "" }),
      );
      expect(document.querySelectorAll("#snackbar")).toHaveLength(1);
      expect(screen.getAllByTestId("snackbar-container")).toHaveLength(1);
      expect(screen.getByTestId("snackbar-message")).toHaveTextContent(
        "Second",
      );

      await close();
      expect(document.getElementById("snackbar")).toBeNull();
      expect(window.snackbar).toBeUndefined();
    });

    it("unmounts the bar from a given parent and leaves the parent", async () => {
      const parent = document.createElement("div");
      parent.id = "main-bar";
      document.body.appendChild(parent);

      act(() =>
        SnackBar.show({ ...defaultProps, parentElementId: "main-bar" }),
      );
      expect(parent.hasChildNodes()).toBe(true);

      await close();
      expect(parent.hasChildNodes()).toBe(false);
      expect(document.getElementById("main-bar")).toBe(parent);
    });
  });

  describe("static close during a commit", () => {
    afterEach(async () => {
      await act(async () => {
        SnackBar.close();
      });
      document.body.innerHTML = "";
      vi.restoreAllMocks();
    });

    // react-countdown calls onComplete while React commits; onAction then
    // usually closes the bar.
    it("does not unmount the root synchronously", async () => {
      const error = vi.spyOn(console, "error").mockImplementation(() => {});
      act(() => SnackBar.show({ ...defaultProps, parentElementId: "" }));

      const Closer = () => {
        useLayoutEffect(() => {
          SnackBar.close();
        }, []);
        return null;
      };

      await act(async () => {
        render(<Closer />);
      });

      expect(document.getElementById("snackbar")).toBeNull();
      expect(window.snackbar).toBeUndefined();
      expect(
        error.mock.calls.some((call) =>
          String(call[0]).includes("synchronously unmount"),
        ),
      ).toBe(false);
    });

    it("shows a new bar in a fresh root right after close", async () => {
      const parent = document.createElement("div");
      parent.id = "main-bar";
      document.body.appendChild(parent);
      const error = vi.spyOn(console, "error").mockImplementation(() => {});

      act(() =>
        SnackBar.show({ ...defaultProps, parentElementId: "main-bar" }),
      );
      await act(async () => {
        SnackBar.close();
        SnackBar.show({
          ...defaultProps,
          text: "Second",
          parentElementId: "main-bar",
        });
      });

      expect(
        parent.querySelectorAll('[data-testid="snackbar-container"]'),
      ).toHaveLength(1);
      expect(screen.getByTestId("snackbar-message")).toHaveTextContent(
        "Second",
      );
      expect(error).not.toHaveBeenCalled();
    });
  });

  it("keeps the per-second countdown out of the live region", () => {
    render(<SnackBar {...defaultProps} countDownTime={65000} />);
    const countdown = screen.getByText(/^\d{2}:\d{2}$/);
    const liveRegion = screen.getByRole("status");

    const announced =
      liveRegion.contains(countdown) &&
      !countdown.closest('[aria-hidden="true"]');
    expect(announced).toBe(false);
  });
});
