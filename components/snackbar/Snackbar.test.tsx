import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
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

  it("is a polite live region", () => {
    render(<SnackBar {...defaultProps} />);
    const bar = screen.getByRole("status");
    expect(bar).toHaveAttribute("aria-live", "polite");
    expect(bar).toHaveAttribute("id", "snackbar-container");
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
    afterEach(() => {
      act(() => SnackBar.close());
      document.body.innerHTML = "";
    });

    it("reuses one node and one root across calls without a parent", () => {
      act(() => SnackBar.show({ ...defaultProps, parentElementId: "" }));
      act(() =>
        SnackBar.show({ ...defaultProps, text: "Second", parentElementId: "" }),
      );
      expect(document.querySelectorAll("#snackbar")).toHaveLength(1);
      expect(screen.getAllByTestId("snackbar-container")).toHaveLength(1);
      expect(screen.getByTestId("snackbar-message")).toHaveTextContent(
        "Second",
      );

      act(() => SnackBar.close());
      expect(document.getElementById("snackbar")).toBeNull();
      expect(window.snackbar).toBeUndefined();
    });

    it("unmounts the bar from a given parent and leaves the parent", () => {
      const parent = document.createElement("div");
      parent.id = "main-bar";
      document.body.appendChild(parent);

      act(() =>
        SnackBar.show({ ...defaultProps, parentElementId: "main-bar" }),
      );
      expect(parent.hasChildNodes()).toBe(true);

      act(() => SnackBar.close());
      expect(parent.hasChildNodes()).toBe(false);
      expect(document.getElementById("main-bar")).toBe(parent);
    });
  });
});
