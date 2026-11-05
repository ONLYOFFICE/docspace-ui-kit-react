import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import NewItemDropDown from "./NewItemDropDown";

const renderMenu = (onCloseDropDown = vi.fn()) => {
  const onPick = vi.fn();
  render(
    <NewItemDropDown
      dropDownItems={[
        <div
          key="a"
          role="option"
          aria-selected={false}
          tabIndex={-1}
          onClick={onPick}
        >
          First
        </div>,
        <div key="b" role="option" aria-selected={false} tabIndex={-1}>
          Second
        </div>,
      ]}
      onCloseDropDown={onCloseDropDown}
      listHeight={600}
    />,
  );
  return { onCloseDropDown, onPick };
};

// What a ModalDialog around the Selector, or the Selector itself, listens to.
const listenOnWindow = (type: "keyup" | "keydown") => {
  const listener = vi.fn();
  window.addEventListener(type, listener);
  return {
    listener,
    remove: () => window.removeEventListener(type, listener),
  };
};

const press = (key: string) => {
  const target = document.activeElement ?? document.body;
  fireEvent.keyDown(target, { key });
  fireEvent.keyUp(target, { key });
};

describe("NewItemDropDown keyboard", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("focuses the first entry and walks the entries with the arrows", () => {
    renderMenu();
    expect(screen.getByText("First")).toHaveFocus();

    press("ArrowDown");
    expect(screen.getByText("Second")).toHaveFocus();
    press("ArrowDown");
    expect(screen.getByText("First")).toHaveFocus();
  });

  // ModalDialog closes on an Escape keyup on the window: a menu inside a
  // dialog closed the dialog along with itself.
  it("closes on Escape without letting its keyup reach the window", () => {
    const keyup = listenOnWindow("keyup");
    const { onCloseDropDown } = renderMenu();

    press("Escape");

    expect(onCloseDropDown).toHaveBeenCalled();
    expect(keyup.listener).not.toHaveBeenCalled();
    keyup.remove();
  });

  // The Selector submits on an Enter keyup on the window: picking an entry
  // must not submit the selector too.
  it("picks the entry on Enter without letting its keyup reach the window", () => {
    const keyup = listenOnWindow("keyup");
    const { onCloseDropDown, onPick } = renderMenu();

    press("Enter");

    expect(onPick).toHaveBeenCalledTimes(1);
    expect(onCloseDropDown).toHaveBeenCalled();
    expect(keyup.listener).not.toHaveBeenCalled();
    keyup.remove();
  });

  // A menu that closes on the pick, as the Selector's does.
  const Host = ({ onPick }: { onPick: () => void }) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <button type="button" onClick={() => setOpen(true)}>
          New
        </button>
        <input aria-label="Name" />
        {open ? (
          <NewItemDropDown
            dropDownItems={[
              <div
                key="a"
                role="option"
                aria-selected={false}
                tabIndex={-1}
                onClick={onPick}
              >
                Entry
              </div>,
            ]}
            onCloseDropDown={() => setOpen(false)}
            listHeight={600}
          />
        ) : null}
      </>
    );
  };

  const openAndPick = async (onPick: () => void) => {
    render(<Host onPick={onPick} />);
    const opener = screen.getByText("New");
    opener.focus();
    fireEvent.click(opener);
    expect(screen.getByText("Entry")).toHaveFocus();
    press("Enter");
    await new Promise((resolve) => requestAnimationFrame(resolve));
  };

  it("gives the focus back when the picked entry moves it nowhere", async () => {
    await openAndPick(() => {});

    expect(screen.getByText("New")).toHaveFocus();
  });

  it("leaves the focus where the picked entry moved it", async () => {
    await openAndPick(() => screen.getByLabelText("Name").focus());

    expect(screen.getByLabelText("Name")).toHaveFocus();
  });
});
