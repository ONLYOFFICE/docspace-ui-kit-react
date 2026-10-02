import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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

  it("renders close button when btnText is not provided", () => {
    render(<SnackBar {...defaultProps} btnText={undefined} />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("action");
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
});
