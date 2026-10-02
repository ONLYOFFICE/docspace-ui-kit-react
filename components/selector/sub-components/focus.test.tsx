import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import InputItem from "./InputItem";
import { VirtualScroll } from "./VirtualScroll";

// Both take focus on mount. A focus that scrolls pulls the page to wherever
// the selector sits -- a Docs page with a dozen stories ended at its bottom.
describe("Selector focus on mount", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("focuses the list without scrolling the page", () => {
    const focus = vi.spyOn(HTMLElement.prototype, "focus");

    render(
      <VirtualScroll>
        <div>row</div>
      </VirtualScroll>,
    );

    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it("focuses the new-name field without scrolling the page", () => {
    const focus = vi.spyOn(HTMLElement.prototype, "focus");

    render(
      <InputItem
        style={{}}
        defaultInputValue="New folder"
        onAcceptInput={() => {}}
        onCancelInput={() => {}}
        setInputItemVisible={() => {}}
        setSavedInputValue={() => {}}
      />,
    );

    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  });
});
