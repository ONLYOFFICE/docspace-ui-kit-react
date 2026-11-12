import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { NextButton } from "./NextButton";
import { PrevButton } from "./PrevButton";
import styles from "./Buttons.module.scss";

describe("NextButton", () => {
  const mockNextClick = vi.fn();

  beforeEach(() => {
    mockNextClick.mockClear();
  });

  it("renders correctly", () => {
    render(<NextButton nextClick={mockNextClick} />);
    const button = screen.getByTestId("next-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "Next");
  });

  it("applies correct classes for non-PDF files", () => {
    render(<NextButton nextClick={mockNextClick} isPDFFile={false} />);
    const button = screen.getByTestId("next-button");
    expect(button).toHaveClass(styles.right);
    expect(button).not.toHaveClass(styles.isPDFFile);
  });

  it("applies correct classes for PDF files", () => {
    render(<NextButton nextClick={mockNextClick} isPDFFile />);
    const button = screen.getByTestId("next-button");
    expect(button).toHaveClass(styles.isPDFFile);
  });

  it("calls nextClick when clicked", () => {
    render(<NextButton nextClick={mockNextClick} />);
    const button = screen.getByTestId("next-button");
    fireEvent.click(button);
    expect(mockNextClick).toHaveBeenCalledTimes(1);
  });
});

describe("PrevButton", () => {
  const mockPrevClick = vi.fn();

  beforeEach(() => {
    mockPrevClick.mockClear();
  });

  it("renders correctly", () => {
    render(<PrevButton prevClick={mockPrevClick} />);
    const button = screen.getByTestId("prev-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "Previous");
  });

  it("applies correct classes", () => {
    render(<PrevButton prevClick={mockPrevClick} />);
    const button = screen.getByTestId("prev-button");
    expect(button).toHaveClass(styles.left);
  });

  it("calls prevClick when clicked", () => {
    render(<PrevButton prevClick={mockPrevClick} />);
    const button = screen.getByTestId("prev-button");
    fireEvent.click(button);
    expect(mockPrevClick).toHaveBeenCalledTimes(1);
  });
});
