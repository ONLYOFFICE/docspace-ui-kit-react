import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Selector } from "./Selector";
import type { SelectorProps, TSelectorItem } from "./Selector.types";

const items = [
  { id: "1", label: "First item" },
  { id: "2", label: "Second item" },
] as TSelectorItem[];

const baseProps = {
  items,
  totalItems: items.length,
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
  // jsdom reports zero body height; the SSR branch renders items directly
  isSSR: true,
};

const makeProps = (override: object = {}): SelectorProps =>
  ({ ...baseProps, ...override }) as unknown as SelectorProps;

const renderSelector = (override: object = {}) =>
  render(<Selector {...makeProps(override)} />);

describe("<Selector /> loading modes", () => {
  it("renders the skeleton loader during the initial load", () => {
    renderSelector({ isLoading: true });

    expect(screen.getByTestId("row-loader")).toBeInTheDocument();
    expect(screen.queryByText("First item")).not.toBeInTheDocument();
  });

  it("renders items when settled", () => {
    renderSelector();

    expect(screen.getByText("First item")).toBeInTheDocument();
    expect(screen.getByText("Second item")).toBeInTheDocument();
    expect(document.querySelector(".bodyContentDimmed")).toBeNull();
  });

  it("renders the empty screen when there are no items", () => {
    renderSelector({ items: [], totalItems: 0 });

    expect(screen.getByText("Empty header")).toBeInTheDocument();
  });

  it("keeps previous items visible and dimmed during a content refresh", () => {
    const { rerender } = renderSelector();

    expect(screen.getByText("First item")).toBeInTheDocument();

    // refresh empties items while the request is running; dimming wins
    // over the skeleton even when isLoading is set alongside
    rerender(
      <Selector
        {...makeProps({
          items: [],
          totalItems: 0,
          isLoading: true,
          isContentLoading: true,
        })}
      />,
    );

    expect(screen.getByText("First item")).toBeInTheDocument();
    expect(document.querySelector(".bodyContentDimmed")).not.toBeNull();
    expect(screen.queryByTestId("row-loader")).not.toBeInTheDocument();
  });

  it("keeps the empty screen dimmed when refreshing from empty results", () => {
    const { rerender } = renderSelector({ items: [], totalItems: 0 });

    expect(screen.getByText("Empty header")).toBeInTheDocument();

    rerender(
      <Selector
        {...makeProps({ items: [], totalItems: 0, isContentLoading: true })}
      />,
    );

    expect(screen.getByText("Empty header")).toBeInTheDocument();
    expect(document.querySelector(".dimmedEmptyScreen")).not.toBeNull();
  });

  it("shows fresh items once the refresh completes", () => {
    const { rerender } = renderSelector();

    rerender(
      <Selector
        {...makeProps({
          items: [],
          totalItems: 0,
          isLoading: true,
          isContentLoading: true,
        })}
      />,
    );

    const freshItems = [{ id: "3", label: "Third item" }] as TSelectorItem[];
    rerender(<Selector {...makeProps({ items: freshItems, totalItems: 1 })} />);

    expect(screen.getByText("Third item")).toBeInTheDocument();
    expect(screen.queryByText("First item")).not.toBeInTheDocument();
    expect(document.querySelector(".bodyContentDimmed")).toBeNull();
  });
});
