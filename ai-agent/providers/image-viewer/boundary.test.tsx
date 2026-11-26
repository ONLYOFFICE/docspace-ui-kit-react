import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { lazy, Suspense } from "react";

import { ImageViewerBoundary } from "./boundary";

describe("ImageViewerBoundary", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("draws the viewer it wraps", () => {
    render(
      <ImageViewerBoundary onClose={() => {}}>
        <div data-testid="viewer" />
      </ImageViewerBoundary>,
    );

    expect(screen.getByTestId("viewer")).toBeInTheDocument();
  });

  // A tab opened before a deployment asks for a chunk that is gone.
  it("closes the viewer and draws nothing when its chunk fails to load", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const onClose = vi.fn();
    const Viewer = lazy(() =>
      Promise.reject(new Error("Failed to fetch dynamically imported module")),
    );

    const { container } = render(
      <div data-testid="app">
        <ImageViewerBoundary onClose={onClose}>
          <Suspense fallback={null}>
            <Viewer />
          </Suspense>
        </ImageViewerBoundary>
      </div>,
    );

    await vi.waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    // The page around the viewer is still there.
    expect(screen.getByTestId("app")).toBeInTheDocument();
    expect(container.querySelector("[data-testid=app]")).toBeEmptyDOMElement();
  });
});
