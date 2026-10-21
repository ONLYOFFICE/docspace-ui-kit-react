import { fireEvent, render, screen } from "@testing-library/react";
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

describe("<Selector /> Escape", () => {
  it("closes the selector", () => {
    const onCancel = vi.fn();
    renderSelector({ onCancel });

    fireEvent.keyDown(window, { key: "Escape" });

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("leaves the selector open under a dialog opened from it", () => {
    const onCancel = vi.fn();
    renderSelector({ onCancel });

    // Portalled after the selector, as ModalDialog is.
    const dialog = document.createElement("div");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    document.body.appendChild(dialog);

    fireEvent.keyDown(window, { key: "Escape" });
    dialog.remove();

    expect(onCancel).not.toHaveBeenCalled();
  });

  it("closes when it sits inside the dialog itself", () => {
    const onCancel = vi.fn();
    const dialog = document.createElement("div");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    document.body.appendChild(dialog);

    render(<Selector {...makeProps({ onCancel })} />, { container: dialog });
    fireEvent.keyDown(window, { key: "Escape" });
    dialog.remove();

    expect(onCancel).toHaveBeenCalledOnce();
  });
  it("closes past a non-modal role=dialog element such as a popover", () => {
    const onCancel = vi.fn();
    renderSelector({ onCancel });

    const popover = document.createElement("div");
    popover.setAttribute("role", "dialog");
    document.body.appendChild(popover);

    fireEvent.keyDown(window, { key: "Escape" });
    popover.remove();

    expect(onCancel).toHaveBeenCalledOnce();
  });
});
