import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Files from "./Files";
import { ContentType } from "../../../../../../enums";
import type { TContent } from "../../../../../../types/ai";
import { openFile } from "../../../../utils";

vi.mock("../../../../utils", () => ({
  openFile: vi.fn(),
}));

vi.mock("../../../../../../components/text", () => ({
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

vi.mock("react-svg", () => ({
  ReactSVG: ({ src }: { src: string }) => <div data-testid="file-icon" data-src={src} />,
}));

describe("Files component", () => {
  const mockGetIcon = vi.fn((size, ext) => `icon-${size}-${ext}`);
  const defaultProps = {
    files: [
      {
        type: ContentType.Files,
        id: 1,
        title: "document.docx",
        extension: ".docx",
      },
      {
        type: ContentType.Files,
        id: 2,
        title: "image.png",
        extension: ".png",
      },
    ] as TContent[],
    getIcon: mockGetIcon,
    allowExternalNavigation: true,
  };

  it("renders list of files with correct information", () => {
    render(<Files {...defaultProps} />);

    const fileItems = screen.getAllByTestId("file-item");
    expect(fileItems).toHaveLength(2);

    expect(screen.getByText("document")).toBeInTheDocument();
    expect(screen.getByText(".docx")).toBeInTheDocument();
    expect(screen.getByText("image")).toBeInTheDocument();
    expect(screen.getByText(".png")).toBeInTheDocument();
  });

  it("calls openFile when a file item is clicked", () => {
    render(<Files {...defaultProps} />);

    const fileItems = screen.getAllByTestId("file-item");
    fireEvent.click(fileItems[0]);

    expect(openFile).toHaveBeenCalledWith("1", true);
  });

  it("returns null when files list is empty", () => {
    const { container } = render(<Files {...defaultProps} files={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("applies reverse class when reverse prop is true", () => {
    // We can check classes if we mock styles, but here we can just verify it renders
    const { container } = render(<Files {...defaultProps} reverse={true} />);
    expect(container.firstChild).toHaveClass(/reverse/);
  });

  it("handles non-file content types by not rendering them", () => {
    const mixedFiles = [
      ...defaultProps.files,
      { type: ContentType.Text, text: "should not render" } as TContent,
    ];
    render(<Files {...defaultProps} files={mixedFiles} />);
    
    expect(screen.getAllByTestId("file-item")).toHaveLength(2);
  });
});
