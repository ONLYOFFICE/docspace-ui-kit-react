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
  it("closes past a closed modal dialog left mounted after it", () => {
    const onCancel = vi.fn();
    renderSelector({ onCancel });

    const closedModal = document.createElement("div");
    closedModal.setAttribute("inert", "");
    closedModal.setAttribute("aria-hidden", "true");
    const dialog = document.createElement("div");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    closedModal.appendChild(dialog);
    document.body.appendChild(closedModal);

    fireEvent.keyDown(window, { key: "Escape" });
    closedModal.remove();

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

describe("<Selector /> Enter", () => {
  it("submits the selector", () => {
    const onSubmit = vi.fn();
    renderSelector({ onSubmit });

    fireEvent.keyUp(window, { key: "Enter" });

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("does not submit while the submit button is disabled", () => {
    const onSubmit = vi.fn();
    renderSelector({ onSubmit, disableSubmitButton: true });

    fireEvent.keyUp(window, { key: "Enter" });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("does not submit from the search input", () => {
    const onSubmit = vi.fn();
    renderSelector({
      onSubmit,
      withSearch: true,
      searchPlaceholder: "Search",
      searchValue: "First",
      onSearch: vi.fn(),
      onClearSearch: vi.fn(),
    });

    const input = document.querySelector(".selector-search-input input");
    expect(input).not.toBeNull();

    fireEvent.keyUp(input!, { key: "Enter" });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits once from the focused submit button", () => {
    const onSubmit = vi.fn();
    renderSelector({ onSubmit });

    fireEvent.click(screen.getByText("First item"));
    const button = screen.getByTestId("selector_submit_button");
    fireEvent.click(button);
    fireEvent.keyUp(button, { key: "Enter" });

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("does not submit under a dialog opened from it", () => {
    const onSubmit = vi.fn();
    renderSelector({ onSubmit });

    const dialog = document.createElement("div");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    document.body.appendChild(dialog);

    fireEvent.keyUp(window, { key: "Enter" });
    dialog.remove();

    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe("<Selector /> keyboard", () => {
  const breadCrumbs = [
    { id: "apps", label: "Apps", isRoom: false },
    { id: "rooms", label: "Rooms", isRoom: false },
  ];
  const withCrumbs = (override: object = {}) => ({
    withBreadCrumbs: true,
    isBreadCrumbsLoading: false,
    breadCrumbs,
    breadCrumbsLoader: <div />,
    ...override,
  });

  it("makes a crumb before the last a link that Enter follows", () => {
    const onSelectBreadCrumb = vi.fn();
    renderSelector(withCrumbs({ onSelectBreadCrumb }));

    const apps = screen.getByRole("link", { name: "Apps" });
    expect(apps).toHaveAttribute("tabindex", "0");
    expect(screen.getByText("Rooms")).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("link", { name: "Rooms" })).toBeNull();

    fireEvent.keyDown(apps, { key: "Enter" });

    expect(onSelectBreadCrumb).toHaveBeenCalledWith(
      expect.objectContaining({ id: "apps" }),
    );
  });

  it("makes the empty screen's Back a button that Enter and Space press", () => {
    const onSelectBreadCrumb = vi.fn();
    renderSelector(
      withCrumbs({ items: [], totalItems: 0, onSelectBreadCrumb }),
    );

    const back = screen.getByRole("button", { name: "Back" });
    expect(back).toHaveAttribute("tabindex", "0");

    fireEvent.keyDown(back, { key: "Enter" });
    fireEvent.keyDown(back, { key: " " });

    expect(onSelectBreadCrumb).toHaveBeenCalledTimes(2);
    expect(onSelectBreadCrumb).toHaveBeenCalledWith(
      expect.objectContaining({ id: "apps" }),
    );
  });

  describe("the new-name row", () => {
    const withInput = (onAcceptInput = vi.fn(), onCancelInput = vi.fn()) =>
      renderSelector({
        items: [
          { id: "new", label: "New folder", isCreateNewItem: true },
          {
            id: "input",
            label: "",
            isInputItem: true,
            defaultInputValue: "New folder",
            onAcceptInput,
            onCancelInput,
          },
          ...items,
        ],
        totalItems: items.length + 2,
      });

    it("makes accept and cancel buttons that the keyboard presses", () => {
      const onAcceptInput = vi.fn();
      const onCancelInput = vi.fn();
      withInput(onAcceptInput, onCancelInput);

      const accept = screen.getByRole("button", { name: "Done" });
      const cancel = screen.getByRole("button", { name: "Cancel" });
      expect(accept).toHaveAttribute("tabindex", "0");
      expect(cancel).toHaveAttribute("tabindex", "0");

      fireEvent.keyDown(accept, { key: " " });
      expect(onAcceptInput).toHaveBeenCalledOnce();
    });

    // The field accepts on any Enter on the page; one pressed on cancel is
    // cancel's own.
    it("cancels, not accepts, on Enter pressed on cancel", () => {
      const onAcceptInput = vi.fn();
      const onCancelInput = vi.fn();
      withInput(onAcceptInput, onCancelInput);

      fireEvent.keyDown(screen.getByRole("button", { name: "Cancel" }), {
        key: "Enter",
      });

      expect(onCancelInput).toHaveBeenCalledOnce();
      expect(onAcceptInput).not.toHaveBeenCalled();
    });
  });
});
