import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
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

  // ModalDialog closes on an Escape keyup on the window: a selector opened
  // from a dialog closed that dialog along with itself.
  it("keeps the Escape keyup it closed on from the window", () => {
    const onCancel = vi.fn();
    renderSelector({ onCancel });
    const keyup = vi.fn();
    window.addEventListener("keyup", keyup);

    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.keyUp(window, { key: "Escape" });
    window.removeEventListener("keyup", keyup);

    expect(onCancel).toHaveBeenCalledOnce();
    expect(keyup).not.toHaveBeenCalled();
  });

  it("leaves the Escape keyup alone when it has no onCancel", () => {
    renderSelector({ onCancel: undefined });
    const keyup = vi.fn();
    window.addEventListener("keyup", keyup);

    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.keyUp(window, { key: "Escape" });
    window.removeEventListener("keyup", keyup);

    expect(keyup).toHaveBeenCalledOnce();
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

describe("<Selector /> selection limit", () => {
  const multi = {
    isMultiSelect: true,
    maxSelectedItems: 1,
    selectedItems: [{ id: "1", label: "First item" }],
  };

  it("refuses a tick past the limit and reports it", () => {
    const onSelect = vi.fn();
    const onSelectLimitReached = vi.fn();
    renderSelector({ ...multi, onSelect, onSelectLimitReached });

    fireEvent.click(screen.getByText("Second item"));

    expect(onSelectLimitReached).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("still unticks a row at the limit", () => {
    const onSelect = vi.fn();
    const onSelectLimitReached = vi.fn();
    renderSelector({ ...multi, onSelect, onSelectLimitReached });

    fireEvent.click(screen.getByText("First item"));

    expect(onSelectLimitReached).not.toHaveBeenCalled();
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("greys the rows out without the callback", () => {
    const onSelect = vi.fn();
    renderSelector({ ...multi, onSelect });

    fireEvent.click(screen.getByText("Second item"));

    expect(onSelect).not.toHaveBeenCalled();
  });
});

describe("<Selector /> rows ticked by the checkbox only", () => {
  const folders = [
    {
      id: "1",
      label: "First item",
      isFolder: true,
      selectByCheckboxOnly: true,
    },
    {
      id: "2",
      label: "Second item",
      isFolder: true,
      selectByCheckboxOnly: true,
    },
  ] as TSelectorItem[];
  const option = (index: number) =>
    screen.getByTestId(`selector-item-${index}`);
  const box = (index: number) =>
    option(index).querySelector("input[type='checkbox']") as HTMLInputElement;

  it("passes a row click on without ticking the row", () => {
    const onSelect = vi.fn();
    renderSelector({ items: folders, isMultiSelect: true, onSelect });

    fireEvent.click(screen.getByText("First item"));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0][3]).toBeUndefined();
    expect(box(0).checked).toBe(false);
  });

  it("ticks and unticks the row from its checkbox, saying so", () => {
    const onSelect = vi.fn();
    renderSelector({ items: folders, isMultiSelect: true, onSelect });

    fireEvent.click(box(0));
    expect(onSelect.mock.calls[0][3]).toBe(true);
    expect(box(0).checked).toBe(true);

    fireEvent.click(box(0));
    expect(box(0).checked).toBe(false);
  });

  it("disables the box, not the row, of an unticked folder at the limit", () => {
    const onSelect = vi.fn();
    renderSelector({
      items: folders,
      isMultiSelect: true,
      maxSelectedItems: 1,
      onSelect,
    });

    fireEvent.click(box(0));
    expect(box(1).disabled).toBe(true);

    fireEvent.click(screen.getByText("Second item"));
    expect(onSelect).toHaveBeenCalledTimes(2);
  });
});

describe("<Selector /> Enter", () => {
  it("submits the selector", async () => {
    const onSubmit = vi.fn();
    renderSelector({ onSubmit });

    fireEvent.keyUp(window, { key: "Enter" });

    expect(onSubmit).toHaveBeenCalledOnce();
    // Submitting settles the selector's state once onSubmit has returned.
    await act(async () => {});
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

  it("submits once from the focused submit button", async () => {
    const onSubmit = vi.fn();
    renderSelector({ onSubmit });

    fireEvent.click(screen.getByText("First item"));
    const button = screen.getByTestId("selector_submit_button");
    fireEvent.click(button);
    fireEvent.keyUp(button, { key: "Enter" });

    expect(onSubmit).toHaveBeenCalledOnce();
    // Submitting settles the selector's state once onSubmit has returned.
    await act(async () => {});
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

    // Enter also confirms text an input method (Chinese, Japanese, Korean)
    // was composing: that one is the composition's, not the name's.
    it("leaves an Enter that ends an input method composition alone", () => {
      const onAcceptInput = vi.fn();
      withInput(onAcceptInput);

      fireEvent.keyDown(window, { key: "Enter", isComposing: true });

      expect(onAcceptInput).not.toHaveBeenCalled();
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

    // ModalDialog closes on an Escape keyup on the window, and the Selector
    // submits on an Enter one: a key the name row took closed the dialog
    // around the selector, or submitted it, along with the row.
    it.each([
      ["Escape", "cancels"],
      ["Enter", "accepts"],
    ])("keeps the %s keyup it %s on from the window", (key) => {
      const onAcceptInput = vi.fn();
      const onCancelInput = vi.fn();
      withInput(onAcceptInput, onCancelInput);
      const keyup = vi.fn();
      window.addEventListener("keyup", keyup);

      fireEvent.keyDown(screen.getByRole("textbox"), { key });
      fireEvent.keyUp(screen.getByRole("textbox"), { key });
      window.removeEventListener("keyup", keyup);

      expect(
        key === "Escape" ? onCancelInput : onAcceptInput,
      ).toHaveBeenCalledOnce();
      expect(keyup).not.toHaveBeenCalled();
    });
  });
});

describe("<Selector /> item mark", () => {
  const marked = [
    {
      id: "1",
      label: "First item",
      mark: { label: "No key", description: "Cannot be invited yet." },
    },
    { id: "2", label: "Second item" },
  ] as TSelectorItem[];

  it("shows the label after the name of a marked row only", () => {
    renderSelector({ items: marked, totalItems: 2 });

    expect(screen.getByTestId("selector-item-0-mark")).toHaveTextContent(
      "No key",
    );
    expect(screen.queryByTestId("selector-item-1-mark")).toBeNull();
  });

  it("draws the mark as a badge after the label, inside the label block", () => {
    renderSelector({ items: marked, totalItems: 2 });

    const mark = screen.getByTestId("selector-item-0-mark");
    const label = screen.getByText("First item");
    expect(mark.firstElementChild).not.toBeNull();
    expect(mark.parentElement?.contains(label)).toBe(true);
    expect(
      label.compareDocumentPosition(mark) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("hands the mark to a custom row and draws it nowhere else", () => {
    renderSelector({
      items: marked,
      totalItems: 2,
      renderCustomItem: (
        label: string,
        _role?: string,
        _email?: string,
        _isGroup?: boolean,
        _status?: unknown,
        _id?: string | number,
        mark?: React.ReactNode,
      ) => (
        <div data-testid={`custom-${label}`}>
          {label}
          {mark}
        </div>
      ),
    });

    expect(screen.getAllByTestId("selector-item-0-mark")).toHaveLength(1);
    expect(
      screen
        .getByTestId("custom-First item")
        .contains(screen.getByTestId("selector-item-0-mark")),
    ).toBe(true);
    expect(screen.queryByTestId("selector-item-1-mark")).toBeNull();
  });

  it("describes the row with the reason", () => {
    renderSelector({ items: marked, totalItems: 2 });

    expect(screen.getByTestId("selector-item-0")).toHaveAccessibleDescription(
      "Cannot be invited yet.",
    );
    expect(screen.getByTestId("selector-item-1")).not.toHaveAttribute(
      "aria-describedby",
    );
  });

  it("shows the reason on hovering the label", async () => {
    renderSelector({ items: marked, totalItems: 2 });

    fireEvent.mouseEnter(screen.getByTestId("selector-item-0-mark"));

    await waitFor(() =>
      expect(screen.getByRole("tooltip")).toHaveTextContent(
        "Cannot be invited yet.",
      ),
    );
  });

  it("leaves a marked row selectable", () => {
    const onSelect = vi.fn();
    renderSelector({ items: marked, totalItems: 2, onSelect });

    fireEvent.click(screen.getByTestId("selector-item-0"));

    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect.mock.calls[0][0]).toMatchObject({ id: "1" });
  });
});
