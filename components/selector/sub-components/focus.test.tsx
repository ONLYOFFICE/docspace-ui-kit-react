import { render, waitFor } from "@testing-library/react";
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

// Once the new-name field goes - its name entered or the row cancelled - the
// focus goes back to the list, not the page's body.
describe("InputItem gives the focus back to the list", () => {
  const renderInBody = () => {
    const body = document.createElement("div");
    body.className = "selector_body";
    const slot = document.createElement("div");
    body.appendChild(slot);
    document.body.appendChild(body);

    const result = render(
      <InputItem
        style={{}}
        defaultInputValue="New folder"
        onAcceptInput={() => {}}
        onCancelInput={() => {}}
        setInputItemVisible={() => {}}
        setSavedInputValue={() => {}}
      />,
      { container: slot },
    );
    return { body, ...result };
  };

  const addList = (body: HTMLElement) => {
    const list = document.createElement("div");
    list.setAttribute("role", "listbox");
    list.tabIndex = 0;
    body.appendChild(list);
    return list;
  };

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("focuses the list around it as it goes", () => {
    const { body, unmount } = renderInBody();
    const list = addList(body);

    unmount();

    expect(list).toHaveFocus();
  });

  // In an empty folder the field stood alone: the list is drawn after it,
  // and may take a few frames.
  it("waits a few frames for a list drawn after it", async () => {
    const { body, unmount } = renderInBody();

    unmount();
    expect(document.body).toHaveFocus();

    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const list = addList(body);

    await waitFor(() => expect(list).toHaveFocus());
  });

  it("leaves a focus that went somewhere else", async () => {
    const { body, unmount } = renderInBody();
    const elsewhere = document.createElement("button");
    document.body.appendChild(elsewhere);
    const list = addList(body);

    elsewhere.focus();
    unmount();

    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(elsewhere).toHaveFocus();
    expect(list).not.toHaveFocus();
  });
});
