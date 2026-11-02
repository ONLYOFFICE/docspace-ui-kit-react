import { createRef } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DataTable } from "./DataTable";
import type {
  DataTableApi,
  DataTableColumn,
  DataTableProps,
} from "./DataTable.types";
import { findScrollParent } from "./hooks/useRowVirtualizer";

type Item = { id: number; name: string };

const ITEMS: Item[] = Array.from({ length: 10_000 }, (_, i) => ({
  id: i,
  name: `File ${i}`,
}));

const COLUMNS: DataTableColumn<Item>[] = [
  { id: "Name", title: "Name", width: { type: "fill" }, cell: (r) => r.name },
];

const VIEW_HEIGHT = 480;

// jsdom lays nothing out: the scroller reports a height and a scroll offset
// it is given, and the body says where it starts on screen.
let scrollTop = 0;
let bodyTop = 0;
const scrollTo = vi.fn((options: ScrollToOptions) => {
  scrollTop = options.top ?? scrollTop;
});

beforeEach(() => {
  scrollTop = 0;
  bodyTop = 0;
  scrollTo.mockClear();

  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(
    function offsetHeight(this: HTMLElement) {
      return this.dataset.testid === "scroller" ? VIEW_HEIGHT : 0;
    },
  );
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(800);
  // The scroller's content: whatever sits above the body, then every row.
  vi.spyOn(Element.prototype, "scrollHeight", "get").mockImplementation(
    function scrollHeight(this: Element) {
      return (this as HTMLElement).dataset?.testid === "scroller"
        ? bodyTop + ITEMS.length * 48
        : 0;
    },
  );
  vi.spyOn(Element.prototype, "clientHeight", "get").mockImplementation(
    function clientHeight(this: Element) {
      return (this as HTMLElement).dataset?.testid === "scroller"
        ? VIEW_HEIGHT
        : 0;
    },
  );
  vi.spyOn(Element.prototype, "scrollTop", "get").mockImplementation(
    function getScrollTop(this: Element) {
      return (this as HTMLElement).dataset?.testid === "scroller"
        ? scrollTop
        : 0;
    },
  );
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
    function rect(this: Element) {
      const top =
        (this as HTMLElement).dataset?.testid === "data-table-body"
          ? bodyTop - scrollTop
          : 0;
      const height =
        (this as HTMLElement).dataset?.testid === "data-table-header" ? 40 : 0;
      return { top, left: 0, width: 800, height } as DOMRect;
    },
  );
  Element.prototype.scrollTo = scrollTo as unknown as Element["scrollTo"];
});

afterEach(() => {
  vi.restoreAllMocks();
});

// These tests jump far in one scroll event, which would otherwise draw
// skeleton rows for a moment; DataTable.load.test.tsx covers that.
const STILL = { skeletonOnFastScroll: false };

const renderInScroller = (props: Partial<DataTableProps<Item>> = {}) =>
  render(
    <div data-testid="scroller" style={{ overflowY: "auto" }}>
      <DataTable<Item>
        columns={COLUMNS}
        rows={ITEMS}
        getRowKey={(r) => r.id}
        virtualize={STILL}
        {...props}
      />
    </div>,
  );

const wrappers = () =>
  Array.from(document.querySelectorAll<HTMLElement>(".window-item"));

const indexes = () => wrappers().map((w) => Number(w.dataset.index));

const scrollBy = (to: number) => {
  scrollTop = to;
  act(() => {
    fireEvent.scroll(screen.getByTestId("scroller"));
  });
};

describe("DataTable virtualisation", () => {
  it("renders only the rows in and near the view", () => {
    renderInScroller();

    // 480 px holds 10 rows of 48; five more below as overscan.
    expect(indexes()).toEqual(Array.from({ length: 15 }, (_, i) => i));
    expect(screen.getAllByTestId("data-table-row")).toHaveLength(15);
  });

  it("keeps the markup the client reads", () => {
    renderInScroller({
      virtualize: { ...STILL, innerClassName: "files-list" },
    });

    const [first, second] = wrappers();
    expect(first).toHaveClass("table-list-item", "window-item");
    expect(first.style.top).toBe("0px");
    expect(second.style.top).toBe("48px");
    expect(second.style.height).toBe("48px");

    const inner = first.parentElement as HTMLElement;
    expect(inner).toHaveClass("files-list");
    expect(inner.style.height).toBe(`${ITEMS.length * 48}px`);
  });

  it("follows the scroll", () => {
    renderInScroller();

    scrollBy(48 * 5000);

    expect(indexes()[0]).toBe(4995);
    expect(indexes()).toContain(5009);
    expect(wrappers()[0].style.top).toBe(`${4995 * 48}px`);
  });

  it("counts every row for assistive technology", () => {
    renderInScroller();
    scrollBy(48 * 100);

    expect(screen.getByTestId("data-table")).toHaveAttribute(
      "aria-rowcount",
      String(ITEMS.length + 1),
    );
    const row = screen.getByText("File 100").closest('[role="row"]');
    expect(row).toHaveAttribute("aria-rowindex", "102");
  });

  it("places rows from the body's own top when content sits above it", () => {
    bodyTop = 200;
    renderInScroller();

    expect(wrappers()[0].style.top).toBe("0px");

    // 200 px of content above, then 100 rows scrolled past.
    scrollBy(200 + 48 * 100);
    expect(indexes()[0]).toBe(95);
    expect(wrappers()[0].style.top).toBe(`${95 * 48}px`);
  });

  it("uses the row height it is given", () => {
    renderInScroller({ rowHeight: 40 });

    expect(
      screen
        .getByTestId("data-table")
        .style.getPropertyValue("--data-table-row-height"),
    ).toBe("40px");
    expect(wrappers()[1].style.top).toBe("40px");
    // 480 px holds 12 rows of 40.
    expect(wrappers()).toHaveLength(17);
  });

  it("scrolls a row to just below the sticky header through apiRef", () => {
    const apiRef = createRef<DataTableApi>();
    bodyTop = 100;
    renderInScroller({ apiRef });

    act(() => apiRef.current?.scrollToIndex(500, { align: "start" }));

    expect(scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ top: 100 + 500 * 48 - 40 }),
    );
  });

  it("follows the window when nothing around the table scrolls", () => {
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(480);
    render(
      <DataTable<Item>
        columns={COLUMNS}
        rows={ITEMS}
        getRowKey={(r) => r.id}
        virtualize={STILL}
      />,
    );

    expect(indexes()).toHaveLength(15);

    vi.spyOn(window, "scrollY", "get").mockReturnValue(48 * 300);
    // The body moves up the screen with the window's scroll.
    scrollTop = 48 * 300;
    act(() => {
      fireEvent.scroll(window);
    });
    expect(indexes()[0]).toBe(295);
  });

  it("renders every row without virtualize", () => {
    render(
      <DataTable<Item>
        columns={COLUMNS}
        rows={ITEMS.slice(0, 40)}
        getRowKey={(r) => r.id}
      />,
    );

    expect(screen.getAllByTestId("data-table-row")).toHaveLength(40);
    expect(wrappers()).toHaveLength(0);
    expect(screen.getByTestId("data-table")).not.toHaveAttribute(
      "aria-rowcount",
    );
  });

  it("scrolls a plain row into view through apiRef", () => {
    const apiRef = createRef<DataTableApi>();
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    render(
      <DataTable<Item>
        columns={COLUMNS}
        rows={ITEMS.slice(0, 40)}
        getRowKey={(r) => r.id}
        apiRef={apiRef}
      />,
    );

    act(() => apiRef.current?.scrollToIndex(30));

    expect(scrollIntoView).toHaveBeenCalledWith({ block: "nearest" });
    expect(scrollIntoView.mock.contexts[0]).toHaveTextContent("File 30");
  });
});

describe("findScrollParent", () => {
  it("finds the nearest ancestor that scrolls", () => {
    render(
      <div data-testid="outer" style={{ overflowY: "scroll" }}>
        <div style={{ overflowY: "visible" }}>
          <div data-testid="inner" />
        </div>
      </div>,
    );

    expect(findScrollParent(screen.getByTestId("inner"))).toBe(
      screen.getByTestId("outer"),
    );
  });

  it("falls back to the window", () => {
    render(<div data-testid="inner" />);
    expect(findScrollParent(screen.getByTestId("inner"))).toBe(window);
  });
});
