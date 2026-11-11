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

const makeItems = (count: number, from = 1) =>
  Array.from({ length: count }, (_, index) => ({
    id: `Item-${from + index}`,
    label: `Item ${from + index}`,
  })) as TSelectorItem[];

const makeProps = (override: Partial<SelectorProps> = {}) =>
  ({
    items: makeItems(100),
    totalItems: 250,
    hasNextPage: true,
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
const ROW_HEIGHT = 48;

describe("Selector list paging", () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(
      BODY_HEIGHT,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderAtEnd = async (override: Partial<SelectorProps> = {}) => {
    const props = makeProps(override);
    render(<Selector {...props} />);
    // The body reads its height after a short timer.
    await waitFor(() =>
      expect(screen.getAllByRole("option").length).toBeGreaterThan(0),
    );
    const list = screen.getByRole("listbox");
    act(() => list.focus());
    fireEvent.keyDown(list, { key: "End" });
    await waitFor(() => expect(screen.getByText("Item 100")).toBeTruthy());
    return props;
  };

  it("asks for the next page at the end of the list", async () => {
    const props = await renderAtEnd();

    await waitFor(() => expect(props.loadNextPage).toHaveBeenCalledWith(100));
  });

  // The row after the loaded ones is the loader's, and the loader asks for
  // the row after that one: a total of 101 left it nothing to ask for.
  it("asks for a next page of one row", async () => {
    const props = await renderAtEnd({ totalItems: 101 });

    await waitFor(() => expect(props.loadNextPage).toHaveBeenCalledWith(100));
  });

  it("asks for the next page under a total counted short", async () => {
    const props = await renderAtEnd({ totalItems: 90 });

    await waitFor(() => expect(props.loadNextPage).toHaveBeenCalledWith(100));
  });

  it("asks for nothing once there is no next page", async () => {
    const props = await renderAtEnd({ hasNextPage: false, totalItems: 100 });

    expect(props.loadNextPage).not.toHaveBeenCalled();
  });

  // PeopleSelector puts the current user first on whichever page they come
  // with. A list with another first row counted as a new one, and the list
  // with the focus - it takes it as it mounts - went back to its top.
  describe("when the next page moves a row of its own to the top", () => {
    const withNextPage = [
      { id: "me", label: "Me" } as TSelectorItem,
      ...makeItems(100),
      ...makeItems(100, 101),
    ];

    const renderList = async () => {
      const props = makeProps();
      const result = render(<Selector {...props} />);
      await waitFor(() =>
        expect(screen.getAllByRole("option").length).toBeGreaterThan(0),
      );
      return { props, list: screen.getByRole("listbox"), ...result };
    };

    it("keeps the list where the wheel left it", async () => {
      // react-window clamps a scroll to the scroller's size, which jsdom
      // reports as zero.
      vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(
        BODY_HEIGHT,
      );
      vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(
        ROW_HEIGHT * 300,
      );
      const { props, list, rerender } = await renderList();
      expect(list).toHaveFocus();

      // The listbox is the scroller's content; the scroll is the scroller's.
      for (let el: HTMLElement | null = list; el; el = el.parentElement) {
        el.scrollTop = ROW_HEIGHT * 80;
        fireEvent.scroll(el);
      }
      await waitFor(() => expect(screen.getByText("Item 85")).toBeTruthy());

      rerender(<Selector {...props} items={withNextPage} />);

      // The rows are one further down the list, and still on screen.
      await waitFor(() =>
        expect(
          screen.getByText("Item 85").closest('[role="option"]')?.id,
        ).toMatch(/-option-85$/),
      );
      expect(screen.getByTestId("scroller").scrollTop).toBe(ROW_HEIGHT * 80);
      expect(screen.queryByText("Me")).toBeNull();
    });

    it("keeps the keyboard on its row", async () => {
      const { props, list, rerender } = await renderList();
      const activeText = () => {
        const id = list.getAttribute("aria-activedescendant");
        return id ? document.getElementById(id)?.textContent : null;
      };

      fireEvent.keyDown(list, { key: "ArrowDown" });
      await waitFor(() => expect(activeText()).toContain("Item 2"));

      rerender(<Selector {...props} items={withNextPage} />);

      await waitFor(() => expect(screen.getByText("Me")).toBeTruthy());
      await waitFor(() => expect(activeText()).toContain("Item 2"));
    });
  });
});
