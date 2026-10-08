import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { ProgressBar, PreparationPortalProgress } from ".";
import styles from "./ProgressBar.module.scss";

describe("<ProgressBar />", () => {
  const defaultProps = {
    percent: 50,
  };

  it("renders without error", () => {
    render(<ProgressBar {...defaultProps} />);
    expect(screen.getByTestId("progress-bar")).toBeInTheDocument();
  });

  describe("Label", () => {
    it("renders label when provided", () => {
      const label = "Uploading files...";
      render(<ProgressBar {...defaultProps} label={label} />);
      expect(screen.getByText(label)).toBeInTheDocument();
      expect(screen.getByText(label)).toHaveClass(styles.fullText);
    });

    it("sets label as title attribute", () => {
      const label = "Uploading files...";
      render(<ProgressBar {...defaultProps} label={label} />);
      expect(screen.getByText(label)).toHaveAttribute("title", label);
    });
  });

  describe("Progress behavior", () => {
    it("caps progress at 100% when exceeding", () => {
      render(<ProgressBar {...defaultProps} percent={150} />);
      const progressBar = screen.getByTestId("progress-bar");
      expect(progressBar).toHaveAttribute("data-progress", "100");
    });

    it("clamps a negative or non-numeric percent to 0", () => {
      const { rerender } = render(<ProgressBar percent={-20} />);
      const bar = screen.getByRole("progressbar");
      expect(bar).toHaveAttribute("aria-valuenow", "0");
      expect(screen.getByTestId("progress-bar-percent").style.width).toBe("0%");
      rerender(<ProgressBar percent={Number.NaN} />);
      expect(bar).toHaveAttribute("aria-valuenow", "0");
    });

    it("reports no value while infinite", () => {
      render(<ProgressBar {...defaultProps} isInfiniteProgress />);
      const bar = screen.getByRole("progressbar");
      expect(bar).not.toHaveAttribute("aria-valuenow");
      expect(bar).toHaveAttribute("aria-busy", "true");
    });

    it("shows infinite progress animation when enabled", () => {
      render(<ProgressBar {...defaultProps} isInfiniteProgress />);
      expect(screen.getByTestId("progress-bar-animation")).toBeInTheDocument();
    });

    it("shows regular progress bar when not infinite", () => {
      render(<ProgressBar {...defaultProps} />);
      expect(screen.getByTestId("progress-bar-percent")).toBeInTheDocument();
    });
  });

  describe("Status and error states", () => {
    it("displays status message", () => {
      const status = "Processing...";
      render(<ProgressBar {...defaultProps} status={status} />);
      const statusElement = screen.getByText(status);
      expect(statusElement.className).toContain("statusText");
      expect(statusElement).toHaveAttribute("title", status);
    });

    it("displays error message with error styling", () => {
      const error = "Upload failed";
      render(<ProgressBar {...defaultProps} error={error} />);
      const errorElement = screen.getByText(error);
      expect(errorElement.className).toContain("statusError");
      expect(errorElement).toHaveAttribute("title", error);
    });
  });

  it("keeps the status live region mounted and announces a later status", () => {
    const { rerender } = render(<ProgressBar {...defaultProps} />);
    const region = screen.getByRole("status");
    expect(region).toBeEmptyDOMElement();
    rerender(<ProgressBar {...defaultProps} status="Done" />);
    expect(screen.getByRole("status")).toBe(region);
    expect(region).toHaveTextContent("Done");
  });

  it("renders the error as an alert in place of the status", () => {
    render(<ProgressBar {...defaultProps} status="Uploading" error="Failed" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Failed");
    expect(screen.queryByText("Uploading")).toBeNull();
  });

  it("applies custom className when provided", () => {
    const customClass = "custom-progress";
    render(<ProgressBar {...defaultProps} className={customClass} />);
    expect(screen.getByTestId("progress-bar").className).toContain(customClass);
  });
});

describe("<PreparationPortalProgress />", () => {
  it("renders without error", () => {
    render(
      <PreparationPortalProgress percent={42} text="Preparation portal..." />,
    );

    expect(
      screen.getByTestId("preparation-portal-progress"),
    ).toBeInTheDocument();
  });

  it("renders with given percent", () => {
    render(
      <PreparationPortalProgress percent={42} text="Preparation portal..." />,
    );

    expect(screen.getByText("42 %")).toBeInTheDocument();
  });

  it("renders with given text", () => {
    render(
      <PreparationPortalProgress percent={42} text="Preparation portal..." />,
    );

    expect(screen.getByText("Preparation portal...")).toBeInTheDocument();
  });

  it("is a progressbar named by its text, with a clamped value", () => {
    render(<PreparationPortalProgress percent={150} text="Preparing" />);
    const bar = screen.getByRole("progressbar", { name: "Preparing" });
    expect(bar).toHaveAttribute("aria-valuenow", "100");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(screen.getByText("100 %")).toBeInTheDocument();
  });

  it("clamps a negative percent to 0", () => {
    render(<PreparationPortalProgress percent={-5} text="Preparing" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
    expect(screen.getByText("0 %")).toBeInTheDocument();
  });

  it("lets the aria props override the defaults", () => {
    render(
      <PreparationPortalProgress
        percent={10}
        text="Preparing"
        aria-label="Setup"
      />,
    );
    expect(
      screen.getByRole("progressbar", { name: "Setup" }),
    ).toBeInTheDocument();
  });
});
