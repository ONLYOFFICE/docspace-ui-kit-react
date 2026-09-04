/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// A render-counting stand-in: tooltipped tiles create a fresh <Tooltip> element
// on every render of the banner, so its call count is the banner's render
// count as far as the tiles are concerned.
vi.mock("../tooltip", () => ({ Tooltip: vi.fn(() => null) }));

import { Tooltip } from "../tooltip";
import { QuickActions } from "./index";
import type { QuickActionItem } from "./QuickActions.types";

const LABELS = { prevLabel: "Previous", nextLabel: "Next" };

const buildItems = (overrides: Partial<QuickActionItem>[] = []) => {
  const base: QuickActionItem[] = [
    { id: "doc", icon: <svg data-testid="icon-doc" />, label: "Document" },
    { id: "xls", icon: <svg data-testid="icon-xls" />, label: "Spreadsheet" },
    { id: "ppt", icon: <svg data-testid="icon-ppt" />, label: "Presentation" },
    { id: "pdf", icon: <svg data-testid="icon-pdf" />, label: "PDF" },
  ];

  return base.map((item, i) => ({ ...item, ...overrides[i] }));
};

// Five tiles — more than fit a narrow strip, so the carousel has somewhere to
// scroll.
const buildFiveItems = (): QuickActionItem[] => [
  { id: "vdr", icon: <svg data-testid="icon-vdr" />, label: "VDR room" },
  { id: "collab", icon: <svg data-testid="icon-collab" />, label: "Collaboration room" },
  { id: "public", icon: <svg data-testid="icon-public" />, label: "Public room" },
  { id: "custom", icon: <svg data-testid="icon-custom" />, label: "Custom room" },
  { id: "template", icon: <svg data-testid="icon-template" />, label: "Room template" },
];

describe("QuickActions", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders one tile per item", () => {
    render(<QuickActions {...LABELS} items={buildItems()} dataTestId="qa" />);

    expect(screen.getByText("Document")).toBeInTheDocument();
    expect(screen.getByText("Spreadsheet")).toBeInTheDocument();
    expect(screen.getByText("Presentation")).toBeInTheDocument();
    expect(screen.getByText("PDF")).toBeInTheDocument();

    // The strip carries a name of its own, so a host (the client's tour) can
    // reach the scroll port without knowing where it sits among the banner's
    // children.
    const track = screen.getByTestId("quick-actions-track");
    expect(track.parentElement).toBe(screen.getByTestId("qa"));
    expect(track.children).toHaveLength(4);
  });

  it("renders the provided icon for each tile", () => {
    render(<QuickActions {...LABELS} items={buildItems()} />);

    expect(screen.getByTestId("icon-doc")).toBeInTheDocument();
    expect(screen.getByTestId("icon-xls")).toBeInTheDocument();
    expect(screen.getByTestId("icon-ppt")).toBeInTheDocument();
    expect(screen.getByTestId("icon-pdf")).toBeInTheDocument();
  });

  it("renders nothing when items array is empty", () => {
    const { container } = render(<QuickActions {...LABELS} items={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("invokes onClick when a tile is clicked", () => {
    const onClick = vi.fn();
    const items: QuickActionItem[] = [
      { id: "action", icon: <svg />, label: "Action", onClick },
    ];

    render(<QuickActions {...LABELS} items={items} />);

    fireEvent.click(screen.getByRole("button", { name: "Action" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders an anchor when href is provided", () => {
    const items: QuickActionItem[] = [
      {
        id: "open",
        icon: <svg />,
        label: "Open",
        href: "https://example.com",
        target: "_blank",
      },
    ];

    render(<QuickActions {...LABELS} items={items} />);

    const link = screen.getByRole("link", { name: "Open" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders a button when no href is provided", () => {
    const items: QuickActionItem[] = [{ id: "run", icon: <svg />, label: "Run" }];

    render(<QuickActions {...LABELS} items={items} />);

    expect(screen.getByRole("button", { name: "Run" })).toBeInTheDocument();
  });

  it("forwards dataTestId to individual tiles", () => {
    const items: QuickActionItem[] = [
      { id: "tile-a", icon: <svg />, label: "Tile A", dataTestId: "tile-a" },
      { id: "tile-b", icon: <svg />, label: "Tile B", dataTestId: "tile-b" },
    ];

    render(<QuickActions {...LABELS} items={items} />);

    expect(screen.getByTestId("tile-a")).toBeInTheDocument();
    expect(screen.getByTestId("tile-b")).toBeInTheDocument();
  });

  describe("carousel", () => {
    const PREV_TESTID = "quick-actions-prev";
    const NEXT_TESTID = "quick-actions-next";

    // The arrows are driven by the track's scroll metrics, which jsdom reports
    // as 0 because it performs no layout. `simulateTrack` fakes a strip of
    // `scrollWidth` inside a `clientWidth` port, parked at `scrollLeft`, so
    // each end of the range can be asserted independently.
    const simulateTrack = ({
      scrollWidth = 1200,
      clientWidth = 600,
      scrollLeft = 0,
    } = {}) => {
      Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
        configurable: true,
        get: () => scrollWidth,
      });
      Object.defineProperty(HTMLElement.prototype, "clientWidth", {
        configurable: true,
        get: () => clientWidth,
      });
      Object.defineProperty(HTMLElement.prototype, "scrollLeft", {
        configurable: true,
        get: () => scrollLeft,
        set: () => {},
      });
    };

    afterEach(() => {
      ["scrollWidth", "clientWidth", "scrollLeft"].forEach((prop) => {
        Object.defineProperty(HTMLElement.prototype, prop, {
          configurable: true,
          value: 0,
          writable: true,
        });
      });
    });

    it("offers only the next arrow at the start of the strip", () => {
      simulateTrack({ scrollLeft: 0 });
      render(<QuickActions {...LABELS} items={buildFiveItems()} dataTestId="qa" />);

      expect(screen.queryByTestId(PREV_TESTID)).not.toBeInTheDocument();
      expect(screen.getByTestId(NEXT_TESTID)).toBeInTheDocument();
    });

    it("offers only the prev arrow at the end of the strip", () => {
      simulateTrack({ scrollLeft: 600 });
      render(<QuickActions {...LABELS} items={buildFiveItems()} dataTestId="qa" />);

      expect(screen.getByTestId(PREV_TESTID)).toBeInTheDocument();
      expect(screen.queryByTestId(NEXT_TESTID)).not.toBeInTheDocument();
    });

    it("offers both arrows midway through the strip", () => {
      simulateTrack({ scrollLeft: 300 });
      render(<QuickActions {...LABELS} items={buildFiveItems()} dataTestId="qa" />);

      expect(screen.getByTestId(PREV_TESTID)).toBeInTheDocument();
      expect(screen.getByTestId(NEXT_TESTID)).toBeInTheDocument();
    });

    it("offers no arrows when every tile already fits", () => {
      simulateTrack({ scrollWidth: 600, clientWidth: 600 });
      render(<QuickActions {...LABELS} items={buildItems()} dataTestId="qa" />);

      expect(screen.queryByTestId(PREV_TESTID)).not.toBeInTheDocument();
      expect(screen.queryByTestId(NEXT_TESTID)).not.toBeInTheDocument();
    });

    // The setter `simulateTrack` installs swallows writes, so a test that cares
    // where the strip was sent has to record them itself.
    const recordScrollWrites = (offset: number) => {
      const writes: number[] = [];

      Object.defineProperty(HTMLElement.prototype, "scrollLeft", {
        configurable: true,
        get: () => offset,
        set: (value: number) => {
          writes.push(value);
        },
      });

      return writes;
    };

    it("rewinds the strip when the section's tiles change", () => {
      // Navigating between sections swaps the tiles without remounting the
      // banner, so the DOM keeps the previous section's offset and the new
      // section opens with its first tile scrolled out of sight.
      simulateTrack({ scrollLeft: 600 });
      const writes = recordScrollWrites(600);

      const { rerender } = render(
        <QuickActions {...LABELS} items={buildFiveItems()} dataTestId="qa" />,
      );
      writes.length = 0;

      rerender(<QuickActions {...LABELS} items={buildItems()} dataTestId="qa" />);

      expect(writes).toContain(0);
    });

    it("leaves the offset alone while the tiles stay the same", () => {
      // The consumer rebuilds `items` on every render, so a rewind keyed on
      // array identity would drag the strip back under the reader mid-scroll.
      simulateTrack({ scrollLeft: 600 });
      const writes = recordScrollWrites(600);

      const { rerender } = render(
        <QuickActions {...LABELS} items={buildFiveItems()} dataTestId="qa" />,
      );
      writes.length = 0;

      rerender(<QuickActions {...LABELS} items={buildFiveItems()} dataTestId="qa" />);

      expect(writes).toHaveLength(0);
    });

    it("measures the real track after the loading placeholder makes way", () => {
      // The placeholder renders a track of its own that carries no ref, so the
      // real one only arrives on a later render. Keying the measurement on a
      // ref object meant it was never taken: the banner kept its arrows off
      // for the whole of a first load, and only got them after being hidden
      // and restored, which remounts it with the tiles already in place.
      simulateTrack({ scrollLeft: 300 });
      const { rerender } = render(
        <QuickActions {...LABELS} items={buildFiveItems()} isLoading dataTestId="qa" />,
      );

      expect(screen.queryByTestId(NEXT_TESTID)).not.toBeInTheDocument();

      rerender(<QuickActions {...LABELS} items={buildFiveItems()} dataTestId="qa" />);

      expect(screen.getByTestId(PREV_TESTID)).toBeInTheDocument();
      expect(screen.getByTestId(NEXT_TESTID)).toBeInTheDocument();
    });

    it("scrolls the track when an arrow is clicked", () => {
      simulateTrack({ scrollLeft: 300 });
      const scrollBy = vi.fn();
      Object.defineProperty(HTMLElement.prototype, "scrollBy", {
        configurable: true,
        value: scrollBy,
      });

      render(<QuickActions {...LABELS} items={buildFiveItems()} dataTestId="qa" />);

      fireEvent.click(screen.getByTestId(NEXT_TESTID));
      expect(scrollBy).toHaveBeenCalledWith(
        expect.objectContaining({ left: expect.any(Number) }),
      );
      expect(scrollBy.mock.calls[0][0].left).toBeGreaterThan(0);

      fireEvent.click(screen.getByTestId(PREV_TESTID));
      expect(scrollBy.mock.calls[1][0].left).toBeLessThan(0);
    });

    it("does not re-render the tiles while a scroll changes nothing", () => {
      // Every scroll event re-measures the strip. Midway through, both arrows
      // stay on, so the measurement must not produce a new state object: that
      // would re-render every tile (and every tooltip) for the whole of a
      // smooth scroll.
      simulateTrack({ scrollLeft: 300 });
      const items = buildFiveItems().map((item) => ({
        ...item,
        tooltipContent: item.label,
      }));
      render(<QuickActions {...LABELS} items={items} dataTestId="qa" />);
      const track = screen.getByTestId("quick-actions-track");

      const rendersBefore = vi.mocked(Tooltip).mock.calls.length;
      fireEvent.scroll(track);
      fireEvent.scroll(track);

      expect(vi.mocked(Tooltip).mock.calls.length).toBe(rendersBefore);

      // Reaching the start does change the state, and that render must still
      // happen, or the prev arrow would never be dropped.
      simulateTrack({ scrollLeft: 0 });
      fireEvent.scroll(track);

      expect(vi.mocked(Tooltip).mock.calls.length).toBeGreaterThan(
        rendersBefore,
      );
      expect(screen.queryByTestId(PREV_TESTID)).not.toBeInTheDocument();
    });
  });

  describe("close control", () => {
    const CLOSE_TESTID = "quick-actions-close";

    it("renders no close control without onClose", () => {
      render(<QuickActions {...LABELS} items={buildItems()} dataTestId="qa" />);

      expect(screen.queryByTestId(CLOSE_TESTID)).not.toBeInTheDocument();
    });

    it("invokes onClose when the close control is clicked", () => {
      const onClose = vi.fn();
      render(
        <QuickActions
          {...LABELS}
          items={buildItems()}
          onClose={onClose}
          closeLabel="Close"
        />,
      );

      fireEvent.click(screen.getByTestId(CLOSE_TESTID));

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("names the close control with the provided label", () => {
      render(
        <QuickActions
          {...LABELS}
          items={buildItems()}
          onClose={vi.fn()}
          closeLabel="Disable Quick Actions on all pages"
        />,
      );

      expect(
        screen.getByRole("button", {
          name: "Disable Quick Actions on all pages",
        }),
      ).toBeInTheDocument();
    });

    it("gives every instance a close anchor of its own that a selector can hit", () => {
      render(
        <>
          <QuickActions
            {...LABELS}
            items={buildItems()}
            onClose={vi.fn()}
            closeLabel="Close"
          />
          <QuickActions
            {...LABELS}
            items={buildFiveItems()}
            onClose={vi.fn()}
            closeLabel="Close"
          />
        </>,
      );

      const ids = screen.getAllByTestId(CLOSE_TESTID).map((button) => button.id);

      expect(ids).toHaveLength(2);
      expect(ids[0]).not.toBe(ids[1]);
      // `useId` values carry colons, which would break the tooltip's `#id`
      // anchor selector unless they are escaped away.
      ids.forEach((id) => {
        expect(document.querySelector(`#${id}`)).not.toBeNull();
      });
    });
  });
});
