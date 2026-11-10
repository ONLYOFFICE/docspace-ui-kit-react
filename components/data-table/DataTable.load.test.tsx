import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DataTable } from "./DataTable";
import type {
  DataTableColumn,
  DataTableLoadMore,
  DataTableProps,
} from "./DataTable.types";

type Item = { id: number; name: string };

const makeItems = (count: number): Item[] =>
  Array.from({ length: count }, (_, i) => ({ id: i, name: `File ${i}` }));

const COLUMNS: DataTableColumn<Item>[] = [
  { id: "Name", title: "Name", width: { type: "fill" }, cell: (r) => r.name },
  {
    id: "Menu",
    title: "",
    width: { type: "fixed", size: 24 },
    cell: () => "...",
  },
];

const VIEW_HEIGHT = 480;
let scrollTop = 0;

beforeEach(() => {
  scrollTop = 0;
  const isScroller = (el: Element) =>
    (el as HTMLElement).dataset?.testid === "scroller";

  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(
    function offsetHeight(this: HTMLElement) {
      return isScroller(this) ? VIEW_HEIGHT : 0;
    },
  );
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(800);
  vi.spyOn(Element.prototype, "scrollTop", "get").mockImplementation(
    function getScrollTop(this: Element) {
      return isScroller(this) ? scrollTop : 0;
    },
  );
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
    function rect(this: Element) {
      const top =
        (this as HTMLElement).dataset?.testid === "data-table-body"
          ? -scrollTop
          : 0;
      return { top, left: 0, width: 800, height: 0 } as DOMRect;
    },
  );
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const renderTable = (
  rows: Item[],
  props: Partial<DataTableProps<Item>> = {},
) => {
  const ui = (r: Item[], p: Partial<DataTableProps<Item>>) => (
    <div data-testid="scroller" style={{ overflowY: "auto" }}>
      <DataTable<Item>
        columns={COLUMNS}
        rows={r}
        getRowKey={(row) => row.id}
        virtualize
        {...p}
      />
    </div>
  );
  const result = render(ui(rows, props));
  return {
    ...result,
    rerenderWith: (r: Item[], p: Partial<DataTableProps<Item>> = props) =>
      result.rerender(ui(r, p)),
  };
};

const scrollTo = (to: number) => {
  scrollTop = to;
  act(() => {
    fireEvent.scroll(screen.getByTestId("scroller"));
  });
};

const skeletons = () => screen.queryAllByTestId("data-table-skeleton-row");
const realRows = () => screen.queryAllByTestId("data-table-row");

/** A load that settles when the test says so. */
const deferred = () => {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe("DataTable loading more rows", () => {
  it("draws skeleton rows after the loaded ones while there are more", () => {
    renderTable(makeItems(5), {
      loadMore: { hasMore: true, onLoadMore: () => new Promise(() => {}) },
    });

    expect(realRows()).toHaveLength(5);
    expect(skeletons()).toHaveLength(2);

    const wrapper = skeletons()[0].parentElement as HTMLElement;
    expect(wrapper.dataset.index).toBe("5");
    expect(wrapper).not.toHaveClass("window-item");
    expect(skeletons()[0]).toHaveAttribute("aria-hidden", "true");
    expect(skeletons()[0]).toHaveClass("table-container_body-loader");
  });

  it("draws none when there is nothing more", () => {
    const onLoadMore = vi.fn();
    renderTable(makeItems(5), { loadMore: { hasMore: false, onLoadMore } });

    expect(skeletons()).toHaveLength(0);
    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it("puts a bar in the flexible cells and leaves fixed ones empty", () => {
    renderTable(makeItems(1), {
      loadMore: {
        hasMore: true,
        skeletonRows: 1,
        onLoadMore: () => new Promise(() => {}),
      },
    });

    const cells = skeletons()[0].querySelectorAll('[role="cell"]');
    expect(cells).toHaveLength(2);
    expect(
      cells[0].querySelector('[data-testid="rectangle-skeleton"]'),
    ).not.toBeNull();
    expect(cells[1]).toBeEmptyDOMElement();
  });

  it("renders a column's own skeleton", () => {
    renderTable(makeItems(1), {
      columns: [
        { ...COLUMNS[0], skeleton: () => <span>loading name</span> },
        COLUMNS[1],
      ],
      loadMore: {
        hasMore: true,
        skeletonRows: 1,
        onLoadMore: () => new Promise(() => {}),
      },
    });

    expect(screen.getByText("loading name")).toBeInTheDocument();
  });

  it("asks once for the next page, and waits for it", async () => {
    const page = deferred();
    const onLoadMore = vi.fn(() => page.promise);
    const { rerenderWith } = renderTable(makeItems(5), {
      loadMore: { hasMore: true, onLoadMore },
    });

    expect(onLoadMore).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("data-table-body")).toHaveAttribute(
      "aria-busy",
      "true",
    );

    scrollTo(10);
    expect(onLoadMore).toHaveBeenCalledTimes(1);

    // The page arrives; the view is still near the end, so the next one is
    // asked for.
    const next = deferred();
    onLoadMore.mockImplementation(() => next.promise);
    rerenderWith(makeItems(10));
    await act(async () => page.resolve());

    expect(onLoadMore).toHaveBeenCalledTimes(2);
  });

  it("does not ask again for a page that brought nothing", async () => {
    const onLoadMore = vi.fn(() => Promise.resolve());
    renderTable(makeItems(5), { loadMore: { hasMore: true, onLoadMore } });

    await act(async () => {});
    scrollTo(20);
    await act(async () => {});

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("asks again at the same count once the list was replaced", async () => {
    const onLoadMore = vi.fn(() => Promise.resolve());
    const { rerenderWith } = renderTable(makeItems(5), {
      loadMore: { hasMore: true, onLoadMore },
    });
    await act(async () => {});
    expect(onLoadMore).toHaveBeenCalledTimes(1);

    // The last page arrives, then a new sort brings a first page as long as
    // the list the call was made at.
    rerenderWith(makeItems(10), { loadMore: { hasMore: false, onLoadMore } });
    await act(async () => {});
    expect(onLoadMore).toHaveBeenCalledTimes(1);

    rerenderWith(
      makeItems(5).map((item) => ({ ...item, id: item.id + 100 })),
      { loadMore: { hasMore: true, onLoadMore } },
    );
    await act(async () => {});

    expect(onLoadMore).toHaveBeenCalledTimes(2);
  });

  it("tries again on the next scroll after a failed page", async () => {
    const page = deferred();
    const onLoadMore = vi.fn(() => page.promise);
    // Rows 0-14 rendered, within 15 of the last loaded one (24).
    renderTable(makeItems(25), { loadMore: { hasMore: true, onLoadMore } });

    await act(async () => page.reject(new Error("offline")));
    // Not straight away: a failing server is not asked in a loop.
    expect(onLoadMore).toHaveBeenCalledTimes(1);

    onLoadMore.mockImplementation(() => new Promise(() => {}));
    scrollTo(48 * 3);

    expect(onLoadMore).toHaveBeenCalledTimes(2);
  });

  it("waits until the view nears the last loaded row", () => {
    const onLoadMore = vi.fn(() => new Promise<void>(() => {}));
    renderTable(makeItems(200), {
      loadMore: { hasMore: true, onLoadMore, threshold: 15 },
    });

    expect(onLoadMore).not.toHaveBeenCalled();

    // Rows 150-159 in view, 164 the last rendered: not yet within 15 of 199.
    scrollTo(150 * 48);
    expect(onLoadMore).not.toHaveBeenCalled();

    // Rows 180-189 in view: 194 is within 15 of 199.
    scrollTo(180 * 48);
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("works with a callback that returns nothing", () => {
    const loadMore: DataTableLoadMore = { hasMore: true, onLoadMore: vi.fn() };
    renderTable(makeItems(5), { loadMore });

    scrollTo(10);
    expect(loadMore.onLoadMore).toHaveBeenCalledTimes(1);
  });
});

describe("DataTable skeleton on a fast scroll", () => {
  it("swaps the rows for skeletons after a long jump, then back", () => {
    vi.useFakeTimers();
    renderTable(makeItems(1000));

    scrollTo(48 * 300);
    expect(realRows()).toHaveLength(0);
    expect(skeletons().length).toBeGreaterThan(10);

    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(skeletons()).toHaveLength(0);
    expect(screen.getByText("File 300")).toBeInTheDocument();
  });

  it("keeps the rows on an ordinary scroll", () => {
    renderTable(makeItems(1000));

    scrollTo(400);
    scrollTo(800);
    expect(skeletons()).toHaveLength(0);
  });

  it("keeps the rows when skeletonOnFastScroll is off", () => {
    renderTable(makeItems(1000), {
      virtualize: { skeletonOnFastScroll: false },
    });

    scrollTo(48 * 300);
    expect(skeletons()).toHaveLength(0);
    expect(screen.getByText("File 300")).toBeInTheDocument();
  });
});

describe("DataTable loading more without virtualize", () => {
  let observed: ((entries: { isIntersecting: boolean }[]) => void) | null;

  beforeEach(() => {
    observed = null;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb: (entries: { isIntersecting: boolean }[]) => void) {
          observed = cb;
        }
        observe() {}
        disconnect() {}
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("asks for the next page when the skeleton rows come into view", () => {
    const onLoadMore = vi.fn(() => new Promise<void>(() => {}));
    render(
      <DataTable<Item>
        columns={COLUMNS}
        rows={makeItems(30)}
        getRowKey={(row) => row.id}
        loadMore={{ hasMore: true, onLoadMore }}
      />,
    );

    expect(realRows()).toHaveLength(30);
    expect(skeletons()).toHaveLength(2);
    expect(onLoadMore).not.toHaveBeenCalled();

    act(() => observed?.([{ isIntersecting: true }]));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });
});
