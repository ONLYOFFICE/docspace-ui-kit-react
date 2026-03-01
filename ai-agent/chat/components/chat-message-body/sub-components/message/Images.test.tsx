import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Images from "./Images";
import { ContentType } from "../../../../../../enums";
import type { TContent } from "../../../../../../types/ai";
import { downloadImageAsBase64 } from "../../../../utils";

vi.mock("../../../../utils", () => ({
  downloadImageAsBase64: vi.fn().mockResolvedValue("data:image/png;base64,mock"),
}));

vi.mock("../../../../../../components/loader", () => ({
  Loader: () => <div data-testid="loader" />,
  LoaderTypes: { track: "track" },
}));

describe("Images component", () => {
  const images: TContent[] = [
    {
      type: ContentType.Images,
      id: 1,
      url: "https://example.com/image1.jpg",
      fileType: 1,
    } as TContent,
    {
      type: ContentType.Images,
      id: 2,
      url: "https://example.com/image2.jpg",
      fileType: 1,
    } as TContent,
  ];

  const setAiPlaylistImages = vi.fn();
  const setMediaViewerVisible = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loader initially and then images", async () => {
    render(
      <Images
        images={images}
        setAiPlaylistImages={setAiPlaylistImages}
        setMediaViewerVisible={setMediaViewerVisible}
      />
    );

    // Initial state: loaders
    expect(screen.getAllByTestId("loader")).toHaveLength(2);

    // Wait for downloadImageAsBase64
    await waitFor(() => {
      const renderedImages = screen.getAllByTestId("message-image");
      expect(renderedImages).toHaveLength(2);
      expect(renderedImages[0]).toHaveAttribute("src", "data:image/png;base64,mock");
    });
  });

  it("calls onClick handlers when image is clicked", async () => {
    render(
      <Images
        images={images}
        setAiPlaylistImages={setAiPlaylistImages}
        setMediaViewerVisible={setMediaViewerVisible}
      />
    );

    await waitFor(() => {
        expect(screen.getAllByTestId("message-image")).toHaveLength(2);
    });

    fireEvent.click(screen.getAllByTestId("message-image")[0]);

    expect(setMediaViewerVisible).toHaveBeenCalledWith(true);
    expect(setAiPlaylistImages).toHaveBeenCalledWith([{
        title: "Test.jpg",
        fileId: 1,
        src: "https://example.com/image1.jpg"
    }]);
  });

  it("returns null when images list is empty", () => {
    const { container } = render(
      <Images
        images={[]}
        setAiPlaylistImages={setAiPlaylistImages}
        setMediaViewerVisible={setMediaViewerVisible}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("does not call handlers when not provided", async () => {
    render(<Images images={images} />);

    await waitFor(() => {
        expect(screen.getAllByTestId("message-image")).toHaveLength(2);
    });

    fireEvent.click(screen.getAllByTestId("message-image")[0]);

    expect(setMediaViewerVisible).not.toHaveBeenCalled();
    expect(setAiPlaylistImages).not.toHaveBeenCalled();
  });
});
