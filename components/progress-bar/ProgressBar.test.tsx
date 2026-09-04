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
});
