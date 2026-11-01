import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Selector } from "../Selector";
import type { SelectorProps, TSelectorItem } from "../Selector.types";

const makeItems = (count: number, prefix = "Item") =>
  Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index + 1}`,
    label: `${prefix} ${index + 1}`,
  })) as TSelectorItem[];

const makeProps = (override: Partial<SelectorProps> = {}) =>
  ({
    items: makeItems(60),
    totalItems: 60,
    hasNextPage: false,
    isNextPageLoading: false,
    isLoading: false,
    loadNextPage: vi.fn(async () => {}),
    disableFirstFetch: true,
    onSelect: vi.fn(),
    onSubmit: vi.fn(),
    submitButtonLabel: "Select",
    emptyScreenImage: <div />,
    emptyScreenHeader: "Empty header",
    emptyScreenDescription: "Empty description",
    searchEmptyScreenImage: <div />,
    searchEmptyScreenHeader: "Search empty header",
    searchEmptyScreenDescription: "Search empty description",
    rowLoader: <div data-testid="row-loader" />,
    ...override,
  }) as unknown as SelectorProps;

// The virtualized list: react-window draws only the rows near the viewport,
// so the body needs a height of its own - jsdom lays nothing out.
const BODY_HEIGHT = 480;

const getList = () => screen.getByRole("listbox");
const activeOptionText = () => {
  const id = getList().getAttribute("aria-activedescendant");
  return id ? (document.getElementById(id)?.textContent ?? null) : null;
};

describe("Selector list from the keyboard", () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(
      BODY_HEIGHT,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderList = async (override: Partial<SelectorProps> = {}) => {
    const props = makeProps(override);
    const result = render(<Selector {...props} />);
    // The body reads its height after a short timer.
    await waitFor(() =>
      expect(screen.getAllByRole("option").length).toBeGreaterThan(0),
    );
    return { props, ...result };
  };

  // The wheel can take the keyboard's row off screen after the keys put it
  // there, and react-window draws it out: Enter used to do nothing.
  it("presses the keyboard's row even after the wheel took it off screen", async () => {
    const { props } = await renderList();
    const list = getList();
    act(() => list.focus());

    fireEvent.keyDown(list, { key: "End" });
    await waitFor(() => expect(activeOptionText()).toContain("Item 60"));
    const optionId = list.getAttribute("aria-activedescendant")!;

    // The wheel turned up: the scroller is back at the top. The listbox is
    // the scroller's content; the scroll event is the scroller's own.
    for (let el: HTMLElement | null = list; el; el = el.parentElement) {
      el.scrollTop = 0;
      fireEvent.scroll(el);
    }
    await waitFor(() => expect(document.getElementById(optionId)).toBeNull());

    fireEvent.keyDown(list, { key: "Enter" });

    await waitFor(() => expect(props.onSelect).toHaveBeenCalledTimes(1));
    expect(vi.mocked(props.onSelect!).mock.calls[0][0]).toMatchObject({
      id: "Item-60",
    });
  });

  // A folder that loads through an empty list: that list used to count as
  // the same list, and the keyboard stayed on the row index it had before.
  it("starts a list that came through an empty one on its first row it can pick", async () => {
    const { props, rerender } = await renderList();
    const list = getList();
    act(() => list.focus());

    fireEvent.keyDown(list, { key: "ArrowDown" });
    fireEvent.keyDown(list, { key: "ArrowDown" });
    fireEvent.keyDown(list, { key: "ArrowDown" });
    await waitFor(() => expect(activeOptionText()).toContain("Item 4"));

    // The folder's rows go, and its content comes: a new list, while the
    // list keeps the focus. Its first row cannot be picked, so the keyboard
    // must land on the second - not keep the index the empty list left.
    rerender(
      <Selector {...props} items={[]} totalItems={0} isContentLoading />,
    );
    const next = makeItems(10, "Next").map((item, index) =>
      index === 0 ? { ...item, isDisabled: true } : item,
    );
    rerender(<Selector {...props} items={next} totalItems={next.length} />);

    await waitFor(() => expect(activeOptionText()).toContain("Next 2"));
  });
});
