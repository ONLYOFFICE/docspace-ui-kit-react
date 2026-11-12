import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { Sidebar } from ".";
import { BookMarkType } from "../../PDFViewer.props";

// Mock classnames
vi.mock("classnames", () => {
  const dummyClassnames = (...args: string[]) => {
    const [className, conditionalClasses] = args;
    if (typeof conditionalClasses === "object") {
      return Object.entries(conditionalClasses)
        .filter(([, condition]) => condition)
        .map(([innerClassName]) => innerClassName)
        .concat(className)
        .join(" ");
    }
    return args.filter(Boolean).join(" ");
  };
  return { default: dummyClassnames };
});

// Mock Bookmarks component
vi.mock("../Bookmarks", () => ({
  Bookmarks: ({
    bookmarks,
    navigate,
  }: {
    bookmarks: BookMarkType[];
    navigate: (page: number) => void;
  }) => (
    <div data-testid="bookmarks-component">
      {bookmarks.map((bookmark: BookMarkType) => (
        <div key={bookmark.page} onClick={() => navigate(bookmark.page)}>
          {bookmark.description}
        </div>
      ))}
    </div>
  ),
}));

describe("Sidebar", () => {
  const mockBookmarks: BookMarkType[] = [
    { page: 1, description: "Bookmark 1", level: 1, y: 100 },
    { page: 2, description: "Bookmark 2", level: 1, y: 200 },
  ];

  const defaultProps = {
    bookmarks: mockBookmarks,
    isPanelOpen: false,
    setIsPDFSidebarOpen: vi.fn(),
    navigate: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("applies correct classes when panel is open", () => {
    render(<Sidebar {...defaultProps} isPanelOpen />);

    const sidebar = screen.getByTestId("pdf-sidebar");
    expect(sidebar.className).toContain("sidebarContainer");
    expect(sidebar.className).toContain("isPanelOpen");
  });

  it("closes sidebar when close button is clicked", () => {
    const setIsPDFSidebarOpen = vi.fn();
    render(
      <Sidebar {...defaultProps} setIsPDFSidebarOpen={setIsPDFSidebarOpen} />,
    );

    fireEvent.click(screen.getByTestId("close-sidebar-button"));
    expect(setIsPDFSidebarOpen).toHaveBeenCalledWith(false);
  });

  it("does not show toggle button when there are no bookmarks", () => {
    render(<Sidebar {...defaultProps} bookmarks={[]} />);

    expect(screen.queryByTestId("view-toggle-button")).not.toBeInTheDocument();
  });
});
