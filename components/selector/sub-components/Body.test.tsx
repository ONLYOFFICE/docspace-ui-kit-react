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

  it("tells assistive technology a multi-select list takes several rows", async () => {
    await renderList({ isMultiSelect: true });

    expect(getList()).toHaveAttribute("aria-multiselectable", "true");
  });

  it("leaves a single-select list without the mark", async () => {
    await renderList({ isMultiSelect: false });

    expect(getList()).not.toHaveAttribute("aria-multiselectable");
  });

  // An id naming no element is announced as nothing: the list points at the
  // keyboard's row only while react-window draws it, and again once it does.
  it("points at the keyboard's row only while it is drawn", async () => {
    await renderList();
    const list = getList();
    act(() => list.focus());

    fireEvent.keyDown(list, { key: "End" });
    await waitFor(() => expect(activeOptionText()).toContain("Item 60"));

    for (let el: HTMLElement | null = list; el; el = el.parentElement) {
      el.scrollTop = 0;
      fireEvent.scroll(el);
    }
    await waitFor(() =>
      expect(list).not.toHaveAttribute("aria-activedescendant"),
    );

    // End again: the active row stays the same, only its row is drawn.
    fireEvent.keyDown(list, { key: "End" });
    await waitFor(() => expect(activeOptionText()).toContain("Item 60"));
  });

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

    // The keyup too: the list swallows it, and one left waiting would eat the
    // next test's.
    fireEvent.keyDown(list, { key: "Enter" });
    fireEvent.keyUp(list, { key: "Enter" });

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

  // The list takes the focus as it mounts, and the keyboard's row with it. A
  // row picked with the pointer then left Enter to that other row: it was
  // picked in place of the user's, and the choice never submitted.
  describe("after a pointer pick", () => {
    const pickWithPointer = (label: string) => {
      const row = screen
        .getByText(label)
        .closest<HTMLElement>('[role="option"]')!;
      fireEvent.pointerDown(row);
      fireEvent.click(row);
    };
    const pressEnter = () =>
      act(async () => {
        fireEvent.keyDown(getList(), { key: "Enter" });
        fireEvent.keyUp(getList(), { key: "Enter" });
      });
    const pickedIds = (onSelect: SelectorProps["onSelect"]) =>
      vi.mocked(onSelect!).mock.calls.map(([item]) => item.id);

    it("submits the row picked in single select on Enter", async () => {
      const { props } = await renderList();
      expect(document.activeElement).toBe(getList());

      pickWithPointer("Item 3");
      await pressEnter();

      expect(pickedIds(props.onSelect)).toEqual(["Item-3"]);
      expect(props.onSubmit).toHaveBeenCalledOnce();
    });

    it("submits the rows ticked in multi select on Enter", async () => {
      const { props } = await renderList({ isMultiSelect: true });

      pickWithPointer("Item 3");
      await pressEnter();

      expect(pickedIds(props.onSelect)).toEqual(["Item-3"]);
      expect(props.onSubmit).toHaveBeenCalledOnce();
    });

    // The click focuses a list that did not have the focus: that focus is
    // the pointer's, not the keyboard's.
    it("leaves the keyboard off a list the pointer focused", async () => {
      const { props } = await renderList();
      act(() => getList().blur());
      expect(activeOptionText()).toBeNull();

      const row = screen
        .getByText("Item 3")
        .closest<HTMLElement>('[role="option"]')!;
      fireEvent.pointerDown(row);
      act(() => getList().focus());
      fireEvent.click(row);

      expect(activeOptionText()).toBeNull();
      await pressEnter();
      expect(pickedIds(props.onSelect)).toEqual(["Item-3"]);
      expect(props.onSubmit).toHaveBeenCalledOnce();
    });

    // The keyboard's row from the mount was the first: ArrowUp stayed on it.
    it("lets the arrows go on from the row picked", async () => {
      await renderList();

      pickWithPointer("Item 2");
      fireEvent.keyDown(getList(), { key: "ArrowUp" });
      fireEvent.keyUp(getList(), { key: "ArrowUp" });

      await waitFor(() => expect(activeOptionText()).toContain("Item 2"));
    });
  });

  // A refresh dims the list and the pointer cannot reach it, but the keyboard
  // could: Enter picked a row of the list that was on its way out.
  it("keeps Enter and Space off a dimmed list, and the arrows on it", async () => {
    const { props, rerender } = await renderList();
    const list = getList();
    act(() => list.focus());
    fireEvent.keyDown(list, { key: "ArrowDown" });
    await waitFor(() => expect(activeOptionText()).toContain("Item 2"));

    rerender(<Selector {...props} isContentLoading />);
    for (const key of ["Enter", " ", "ArrowDown"]) {
      fireEvent.keyDown(getList(), { key });
      fireEvent.keyUp(getList(), { key });
    }

    await waitFor(() => expect(activeOptionText()).toContain("Item 3"));
    expect(props.onSelect).not.toHaveBeenCalled();
  });
});
