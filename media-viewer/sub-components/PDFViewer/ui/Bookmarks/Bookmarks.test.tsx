import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "@testing-library/react";

import { Bookmarks } from ".";

// Mock the Scrollbar component
vi.mock("../../../../../components/scrollbar", () => ({
  Scrollbar: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scrollbar">{children}</div>
  ),
}));

describe("Bookmarks component", () => {
  const mockBookmarks = [
    { page: 1, description: "Chapter 1", level: 1, y: 100 },
    { page: 5, description: "Chapter 2", level: 1, y: 200 },
    { page: 10, description: "Chapter 3", level: 1, y: 300 },
  ];

  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders bookmarks list with correct accessibility attributes", () => {
    const { getByRole } = render(
      <Bookmarks bookmarks={mockBookmarks} navigate={mockNavigate} />,
    );

    const list = getByRole("list");
    expect(list).toBeInTheDocument();
    expect(list).toHaveAttribute("aria-label", "PDF bookmarks");
  });

  it("renders empty list when no bookmarks provided", () => {
    const { getByTestId } = render(
      <Bookmarks bookmarks={[]} navigate={mockNavigate} />,
    );

    const list = getByTestId("bookmarks-list");
    expect(list).toBeInTheDocument();
    expect(list.children).toHaveLength(0);
  });

  it("renders inside Scrollbar", () => {
    const { getByTestId } = render(
      <Bookmarks bookmarks={mockBookmarks} navigate={mockNavigate} />,
    );

    expect(getByTestId("scrollbar")).toBeInTheDocument();
  });

  it("renders bookmark items with correct data-testid attributes", () => {
    const { getByTestId } = render(
      <Bookmarks bookmarks={mockBookmarks} navigate={mockNavigate} />,
    );

    mockBookmarks.forEach((_, index) => {
      expect(getByTestId(`bookmark-item-${index}`)).toBeInTheDocument();
      expect(getByTestId(`bookmark-button-${index}`)).toBeInTheDocument();
    });
  });
});
