import React, { useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { getTabStops, useFocusTrap } from ".";

const Trap = ({
  active = true,
  label,
  children,
}: {
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, active);
  return (
    <div ref={ref} aria-label={label} role="dialog" tabIndex={-1}>
      {children}
    </div>
  );
};

const tab = (shift = false) =>
  fireEvent.keyDown(document.activeElement ?? document.body, {
    key: "Tab",
    shiftKey: shift,
  });

describe("useFocusTrap", () => {
  // jsdom lays nothing out, so every element would count as not rendered.
  beforeEach(() => {
    vi.spyOn(Element.prototype, "getClientRects").mockImplementation(function (
      this: Element,
    ) {
      const rects = this.closest("[data-unrendered]")
        ? []
        : [new DOMRect(0, 0, 10, 10)];
      return Object.assign(rects, { item: (i: number) => rects[i] ?? null });
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("wraps Tab from the last stop to the first and Shift+Tab back", () => {
    render(
      <Trap label="Dialog">
        <button type="button">First</button>
        <button type="button">Last</button>
      </Trap>,
    );

    screen.getByText("Last").focus();
    tab();
    expect(screen.getByText("First")).toHaveFocus();

    tab(true);
    expect(screen.getByText("Last")).toHaveFocus();
  });

  it("moves through the stops in document order", () => {
    render(
      <Trap label="Dialog">
        <input aria-label="Name" />
        <button type="button">Create</button>
      </Trap>,
    );

    screen.getByLabelText("Name").focus();
    tab();
    expect(screen.getByText("Create")).toHaveFocus();
  });

  it("brings the focus in from the page behind", () => {
    render(
      <>
        <button type="button">Behind</button>
        <Trap label="Panel">
          <button type="button">First</button>
          <button type="button">Last</button>
        </Trap>
      </>,
    );

    screen.getByText("Behind").focus();
    tab();
    expect(screen.getByText("First")).toHaveFocus();

    screen.getByText("Behind").focus();
    tab(true);
    expect(screen.getByText("Last")).toHaveFocus();
  });

  it("skips what is disabled, unrendered, inert or out of the Tab order", () => {
    render(
      <Trap label="Dialog">
        <button type="button">First</button>
        <button type="button" disabled>
          Disabled
        </button>
        <div data-unrendered>
          <button type="button">Unrendered</button>
        </div>
        <div inert>
          <button type="button">Inert</button>
        </div>
        <button type="button" tabIndex={-1}>
          Script only
        </button>
        <button type="button">Last</button>
      </Trap>,
    );

    expect(
      getTabStops(screen.getByRole("dialog")).map((el) => el.textContent),
    ).toEqual(["First", "Last"]);
  });

  it("counts a radio group as one stop", () => {
    render(
      <Trap label="Dialog">
        <input type="radio" name="g" aria-label="A" />
        <input type="radio" name="g" aria-label="B" defaultChecked />
        <button type="button">Next</button>
      </Trap>,
    );

    expect(
      getTabStops(screen.getByRole("dialog")).map(
        (el) => el.getAttribute("aria-label") ?? el.textContent,
      ),
    ).toEqual(["B", "Next"]);
  });

  it("keeps the focus in a dialog with nothing to tab to", () => {
    render(
      <Trap label="Notice">
        <p>Nothing to do here</p>
      </Trap>,
    );
    const dialog = screen.getByRole("dialog");
    dialog.focus();

    const allowed = tab();

    expect(allowed).toBe(false);
    expect(dialog).toHaveFocus();
  });

  it("with nothing to tab to, brings the focus in from the page behind", () => {
    render(
      <>
        <button type="button">Behind</button>
        <Trap label="Viewer">
          <p>An image</p>
        </Trap>
      </>,
    );

    screen.getByText("Behind").focus();
    tab();

    expect(screen.getByRole("dialog")).toHaveFocus();
  });

  it("follows stops added while it is open", () => {
    const { rerender } = render(
      <Trap label="Dialog">
        <button type="button">First</button>
      </Trap>,
    );
    rerender(
      <Trap label="Dialog">
        <button type="button">First</button>
        <button type="button">Added</button>
      </Trap>,
    );

    screen.getByText("First").focus();
    tab();
    expect(screen.getByText("Added")).toHaveFocus();
  });

  it("lets only the top trap act, and the one below once it closes", () => {
    const Two = ({ innerOpen }: { innerOpen: boolean }) => (
      <>
        <Trap label="Outer">
          <button type="button">Outer first</button>
          <button type="button">Outer last</button>
        </Trap>
        <Trap label="Inner" active={innerOpen}>
          <button type="button">Inner first</button>
          <button type="button">Inner last</button>
        </Trap>
      </>
    );
    const { rerender } = render(<Two innerOpen={false} />);
    rerender(<Two innerOpen />);

    screen.getByText("Inner last").focus();
    tab();
    expect(screen.getByText("Inner first")).toHaveFocus();

    rerender(<Two innerOpen={false} />);
    screen.getByText("Outer last").focus();
    tab();
    expect(screen.getByText("Outer first")).toHaveFocus();
  });

  it("lets a trap nested in another one's DOM act, whatever opened first", () => {
    render(
      <Trap label="Outer">
        <button type="button">Outer</button>
        <Trap label="Inner">
          <button type="button">Inner first</button>
          <button type="button">Inner last</button>
        </Trap>
      </Trap>,
    );

    screen.getByText("Inner last").focus();
    tab();
    expect(screen.getByText("Inner first")).toHaveFocus();
  });

  it("leaves Tab alone when it is not active or a control handled it", () => {
    const { rerender } = render(
      <Trap label="Dialog" active={false}>
        <button type="button">Only</button>
      </Trap>,
    );
    screen.getByText("Only").focus();
    expect(tab()).toBe(true);

    rerender(
      <Trap label="Dialog">
        <button
          type="button"
          onKeyDown={(e) => {
            if (e.key === "Tab") e.preventDefault();
          }}
        >
          Only
        </button>
      </Trap>,
    );
    screen.getByText("Only").focus();
    tab();
    expect(screen.getByText("Only")).toHaveFocus();
  });
});
