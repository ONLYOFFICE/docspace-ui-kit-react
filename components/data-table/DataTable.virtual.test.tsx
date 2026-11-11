import { createRef } from "react";
import { type Root, hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DataTable } from "./DataTable";
import type {
  DataTableApi,
  DataTableColumn,
  DataTableProps,
} from "./DataTable.types";
import { findScrollParent } from "./hooks/useScrollParent";

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
    expect(
      within(screen.getByTestId("data-table-header")).getByRole("row"),
    ).toHaveAttribute("aria-rowindex", "1");
  });

  it("looks for its scroller once, however many parts follow it", () => {
    const listen = vi.spyOn(document, "addEventListener");
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(480);
    // Nothing round the table scrolls: the window is found, and an element
    // that scrolls first is listened for.
    render(
      <DataTable<Item>
        columns={COLUMNS}
        rows={ITEMS}
        getRowKey={(r) => r.id}
        virtualize={STILL}
      />,
    );

    const capturing = listen.mock.calls.filter(
      ([type, , options]) => type === "scroll" && options === true,
    );
    expect(capturing).toHaveLength(1);
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

  it("places the rows again when only the row height changes", () => {
    const ui = (rowHeight: number) => (
      <div data-testid="scroller" style={{ overflowY: "auto" }}>
        <DataTable<Item>
          columns={COLUMNS}
          rows={ITEMS}
          getRowKey={(r) => r.id}
          virtualize={STILL}
          rowHeight={rowHeight}
        />
      </div>
    );
    const view = render(ui(48));
    expect(wrappers()[1].style.top).toBe("48px");

    view.rerender(ui(40));
    expect(wrappers()[1].style.top).toBe("40px");
    expect(wrappers()).toHaveLength(17);
  });

  it("renders the first rows on a server, then hydrates and virtualises", async () => {
    // Stable across the two renders, as a consumer's would be.
    const getRowKey = (r: Item) => r.id;
    const ui = (
      <div data-testid="scroller" style={{ overflowY: "auto" }}>
        <DataTable<Item>
          columns={COLUMNS}
          rows={ITEMS}
          getRowKey={getRowKey}
          virtualize={STILL}
        />
      </div>
    );
    const container = document.createElement("div");
    container.innerHTML = renderToString(ui);
    document.body.appendChild(container);
    let root: Root | undefined;

    try {
      expect(indexes()).toEqual(Array.from({ length: 50 }, (_, i) => i));
      expect(wrappers()[1].style.top).toBe("48px");
      const inner = wrappers()[0].parentElement as HTMLElement;
      expect(inner.style.height).toBe(`${ITEMS.length * 48}px`);

      const onRecoverableError = vi.fn();
      await act(async () => {
        root = hydrateRoot(container, ui, { onRecoverableError });
      });

      expect(onRecoverableError).not.toHaveBeenCalled();
      expect(indexes()).toEqual(Array.from({ length: 15 }, (_, i) => i));
    } finally {
      act(() => root?.unmount());
      container.remove();
    }
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

  // A custom scrollbar turns its overflow on after its first render, when
  // the table inside it has already looked for its scroller.
  const renderInLateScroller = () =>
    render(
      <div data-testid="scroller" style={{ overflowY: "hidden" }}>
        <DataTable<Item>
          columns={COLUMNS}
          rows={ITEMS}
          getRowKey={(r) => r.id}
          virtualize={STILL}
        />
      </div>,
    );

  const nextFrame = () =>
    act(() => new Promise((resolve) => requestAnimationFrame(resolve)));

  it("finds a scroller that starts scrolling after the table mounts", async () => {
    renderInLateScroller();

    screen.getByTestId("scroller").style.overflowY = "auto";
    await nextFrame();
    await nextFrame();
    scrollBy(48 * 5000);

    expect(indexes()[0]).toBe(4995);
  });

  it("takes the element round it that scrolls first as its scroller", async () => {
    renderInLateScroller();
    await nextFrame();

    // Still `hidden` to getComputedStyle, yet it scrolls.
    scrollBy(48 * 5000);
    scrollBy(48 * 5000 + 1);

    expect(indexes()[0]).toBe(4995);
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
