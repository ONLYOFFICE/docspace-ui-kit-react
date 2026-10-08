import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";

import type { TViewAs } from "../../types";

import { SelectionArea } from ".";

const mockOnMove = vi.fn();

const defaultProps = {
  containerClass: "container-class",
  selectableClass: "selectable-class",
  scrollClass: "scroll-class",
  viewAs: "tile" as TViewAs,
  itemsContainerClass: "items-container",
  isRooms: false,
  folderHeaderHeight: 40,
  countTilesInRow: 4,
  defaultHeaderHeight: 48,
  arrayTypes: [
    {
      type: "folders",
      rowGap: 16,
      itemHeight: 40,
      countOfMissingTiles: 0,
      rowCount: 2,
    },
    {
      type: "files",
      rowGap: 16,
      itemHeight: 40,
      countOfMissingTiles: 0,
      rowCount: 2,
    },
  ],
  itemClass: "item-class",
  onMove: mockOnMove,
};

const renderComponent = (props = {}) => {
  return render(<SelectionArea {...defaultProps} {...props} />);
};

// A one-column row listing: three rows of 40px from the top of the page, in a
// region carrying `regionClass`. Nothing carries `scrollClass`, so the page's
// own scroller is used.
const mountRows = (regionAttrs: { id?: string; className?: string }) => {
  const region = document.createElement("div");
  if (regionAttrs.id) region.id = regionAttrs.id;
  if (regionAttrs.className) region.className = regionAttrs.className;

  const list = document.createElement("div");
  list.className = "items-container";
  list.getBoundingClientRect = () =>
    ({ top: 0, left: 0, width: 200, height: 120 }) as DOMRect;

  for (let i = 0; i < 3; i += 1) {
    const row = document.createElement("div");
    row.className = "selectable-class";
    row.textContent = `Row ${i + 1}`;
    row.getBoundingClientRect = () =>
      ({ top: i * 40, left: 0, width: 200, height: 40 }) as DOMRect;

    const value = document.createElement("span");
    value.className = "item-class";
    value.setAttribute("value", `row_${i}`);
    row.appendChild(value);
    list.appendChild(row);
  }

  region.appendChild(list);
  document.body.appendChild(region);
  return list.firstElementChild as HTMLElement;
};

const dragDown = (from: HTMLElement, toY: number) => {
  fireEvent.mouseDown(from, { button: 0, clientX: 10, clientY: 5 });
  fireEvent.mouseMove(document, { clientX: 10, clientY: toY });
};

describe("SelectionArea", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    fireEvent.mouseUp(document);
    document.body.innerHTML = "";
  });

  it("renders without crashing", () => {
    renderComponent();
    expect(screen.getByTestId("selection-area")).toBeInTheDocument();
  });

  it("reports clear once a drag passes the threshold", () => {
    const first = mountRows({ id: "sectionScroll" });
    renderComponent({ viewAs: "row" });

    fireEvent.mouseDown(first, { button: 0, clientX: 10, clientY: 5 });
    fireEvent.mouseMove(document, { clientX: 12, clientY: 8 });
    expect(mockOnMove).not.toHaveBeenCalled();

    fireEvent.mouseMove(document, { clientX: 10, clientY: 60 });
    expect(mockOnMove).toHaveBeenNthCalledWith(1, {
      added: [],
      removed: [],
      clear: true,
    });
  });

  it("ignores a mouse-down outside #sectionScroll by default", () => {
    const first = mountRows({ className: "my-region" });
    renderComponent({ viewAs: "row" });

    dragDown(first, 60);
    expect(mockOnMove).not.toHaveBeenCalled();
  });

  it("starts in the region named by startAreaSelector", async () => {
    const first = mountRows({ className: "my-region" });
    renderComponent({ viewAs: "row", startAreaSelector: ".my-region" });

    dragDown(first, 60);
    expect(mockOnMove).toHaveBeenCalledWith(
      expect.objectContaining({ clear: true }),
    );

    // Without an element carrying `scrollClass` the page's scroller is used,
    // and the rows the rectangle covers are still worked out.
    await waitFor(() =>
      expect(mockOnMove).toHaveBeenCalledWith(
        expect.objectContaining({
          added: expect.arrayContaining([first]),
        }),
      ),
    );
  });
});
