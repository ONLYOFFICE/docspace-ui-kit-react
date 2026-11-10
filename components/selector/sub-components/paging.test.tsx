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

const makeItems = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: `Item-${index + 1}`,
    label: `Item ${index + 1}`,
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
});
