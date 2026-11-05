import React from "react";
import { describe, expect, it, afterEach, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { Aside } from ".";
import styles from "./Aside.module.scss";

describe("Aside Component", () => {
  const mockOnClose = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders without error when visible", () => {
    render(
      <Aside visible onClose={mockOnClose}>
        test content
      </Aside>,
    );

    expect(screen.getByTestId("aside")).toBeInTheDocument();
    expect(screen.getByText("test content")).toBeInTheDocument();
  });

  it("renders with custom styling props", () => {
    render(
      <Aside
        visible
        onClose={mockOnClose}
        scale
        zIndex={500}
        className="custom-class"
      >
        test content
      </Aside>,
    );

    const aside = screen.getByTestId("aside");
    expect(aside).toHaveClass("custom-class");
    expect(aside).toHaveStyle({ zIndex: 500 });
  });

  it("renders without header when withoutHeader is true", () => {
    render(
      <Aside visible onClose={mockOnClose} withoutHeader>
        test content
      </Aside>,
    );

    expect(screen.queryByTestId("aside-header")).not.toBeInTheDocument();
  });

  it("renders with scrollbar when content overflows", () => {
    const longContent = "a".repeat(1000);
    render(
      <Aside visible onClose={mockOnClose}>
        {longContent}
      </Aside>,
    );

    expect(screen.getByTestId("scrollbar")).toBeInTheDocument();
  });

  // The focus trap keeps Tab in the panel. With nothing in it to tab to, the
  // panel itself must take the focus, or Tab does nothing at all.
  it("takes the focus itself on Tab when it has nothing to tab to", () => {
    render(
      <>
        <button type="button">Behind</button>
        <Aside visible onClose={mockOnClose} withoutHeader withoutBodyScroll>
          plain text
        </Aside>
      </>,
    );

    const behind = screen.getByRole("button", { name: "Behind" });
    behind.focus();
    fireEvent.keyDown(behind, { key: "Tab" });

    expect(screen.getByTestId("aside")).toHaveFocus();
  });

  // A panel opened from the keyboard left the focus on the opener behind the
  // backdrop, and closed it dropped the focus on the page's body: the
  // keyboard's place was lost.
  it("takes the focus when it opens and hands it back when it closes", () => {
    const Host = ({ open }: { open: boolean }) => (
      <>
        <button type="button">Open</button>
        <Aside visible={open} onClose={mockOnClose}>
          <button type="button">Inside</button>
        </Aside>
      </>
    );

    const { rerender } = render(<Host open={false} />);
    const opener = screen.getByRole("button", { name: "Open" });
    opener.focus();

    rerender(<Host open />);
    expect(screen.getByTestId("aside")).toHaveFocus();

    screen.getByRole("button", { name: "Inside" }).focus();
    rerender(<Host open={false} />);
    expect(opener).toHaveFocus();
  });

  it("leaves the focus on a field its content focused itself", () => {
    const Field = () => {
      const ref = React.useRef<HTMLInputElement>(null);
      React.useEffect(() => ref.current?.focus(), []);
      return <input ref={ref} aria-label="Name" />;
    };

    render(
      <Aside visible onClose={mockOnClose}>
        <Field />
      </Aside>,
    );

    expect(screen.getByLabelText("Name")).toHaveFocus();
  });

  it("renders with withoutBodyScroll prop", () => {
    render(
      <Aside visible onClose={mockOnClose} withoutBodyScroll>
        test content
      </Aside>,
    );

    const aside = screen.getByTestId("aside");
    expect(aside).toBeInTheDocument();
  });

  // The panel is a flex column and the scrolling body is the item that takes
  // what the header leaves. Drop either half and the body's last ~53px fall
  // below the bottom edge again, which jsdom cannot measure -- so guard the two
  // class names that carry the layout instead.
  it("lays the panel out as a column with the scrolling body as its flexible item", () => {
    render(
      <Aside visible onClose={mockOnClose}>
        test content
      </Aside>,
    );

    expect(screen.getByTestId("aside")).toHaveClass(styles.aside);
    expect(screen.getByTestId("scrollbar")).toHaveClass(styles.body);
  });

  it("gives header props to the header and aria-* to the panel, not both", () => {
    const onBack = vi.fn();

    render(
      <Aside
        visible
        onClose={mockOnClose}
        zIndex={500}
        header="Details"
        isBackButton
        onBackClick={onBack}
        id="panel-header"
        style={{ color: "red" }}
        aria-label="Room details"
      >
        test content
      </Aside>,
    );

    const aside = screen.getByTestId("aside");
    const header = screen.getByTestId("aside-header");

    // Header props stay off the DOM element.
    expect(aside).not.toHaveAttribute("onbackclick");
    expect(aside).not.toHaveAttribute("isbackbutton");
    expect(aside).not.toHaveAttribute("header");
    // `style` and `id` are the header's; the panel keeps its own z-index.
    expect(aside).toHaveStyle({ zIndex: 500 });
    expect(aside).not.toHaveAttribute("id");
    expect(document.querySelectorAll("#panel-header")).toHaveLength(1);
    // `aria-*` names the landmark, and only the landmark.
    expect(aside).toHaveAttribute("aria-label", "Room details");
    expect(header).not.toHaveAttribute("aria-label", "Room details");
  });
});
