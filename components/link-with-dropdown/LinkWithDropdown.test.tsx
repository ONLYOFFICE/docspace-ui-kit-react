import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LinkWithDropdown } from "./LinkWithDropdown";
import styles from "./LinkWithDropdown.module.scss";

const mockData = [
  {
    key: "key1",
    label: "Button 1",
    onClick: vi.fn(),
  },
  {
    key: "key2",
    label: "Button 2",
    onClick: vi.fn(),
  },
  {
    key: "key3",
    isSeparator: true,
  },
  {
    key: "key4",
    label: "Button 3",
    onClick: vi.fn(),
  },
];

describe("LinkWithDropdown", () => {
  it("renders without error", () => {
    render(
      <LinkWithDropdown isBold data={[]}>
        Link with dropdown
      </LinkWithDropdown>,
    );

    const button = screen.getByRole("button", { name: "Link with dropdown" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-haspopup", "listbox");
    expect(button).toHaveAttribute("tabindex", "0");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("renders with dropdown items", () => {
    render(
      <LinkWithDropdown isBold data={mockData} id="test-dropdown">
        Link with dropdown
      </LinkWithDropdown>,
    );

    const trigger = screen.getByRole("button", { name: "Link with dropdown" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    // Open dropdown
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    // Check dropdown container
    const dropdown = screen.getByTestId("dropdown");
    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveAttribute("role", "listbox");

    // Check if dropdown items are rendered
    const items = screen.getAllByTestId((testId) =>
      testId.startsWith("link_with_drop_down_"),
    );
    expect(items).toHaveLength(4); // Including separator

    // Verify menu items text content (excluding separator)
    expect(items[0]).toHaveTextContent("Button 1");
    expect(items[1]).toHaveTextContent("Button 2");
    expect(items[3]).toHaveTextContent("Button 3");

    // Verify menu item structure
    items.forEach((item) => {
      expect(item).toHaveClass(styles.dropDownItem);
    });

    // Verify separator - check that the separator is present in the DOM
    const separator = screen.getByRole("separator");
    expect(separator).toBeInTheDocument();
  });

  it("handles click events on dropdown items", () => {
    render(
      <LinkWithDropdown isBold data={mockData}>
        Link with dropdown
      </LinkWithDropdown>,
    );

    // Open dropdown
    const trigger = screen.getByRole("button", { name: "Link with dropdown" });
    fireEvent.click(trigger);

    // Click first button
    const firstMenuItem = screen.getByText("Button 1");
    fireEvent.click(firstMenuItem);

    // Check that the onClick handler was called
    expect(mockData[0].onClick).toHaveBeenCalled();

    // Check that the dropdown closes after clicking
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("renders with custom styles", () => {
    render(
      <LinkWithDropdown
        isBold
        data={mockData}
        color="red"
        fontSize="16px"
        isSemitransparent
      >
        Link with dropdown
      </LinkWithDropdown>,
    );

    const button = screen.getByRole("button", { name: "Link with dropdown" });
    expect(button.style.color).toBe("red");
  });

  it("handles disabled state", () => {
    render(
      <LinkWithDropdown isBold data={mockData} isDisabled>
        Link with dropdown
      </LinkWithDropdown>,
    );

    const button = screen.getByRole("button", { name: "Link with dropdown" });
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("handles text overflow", () => {
    const title = "Full text of the dropdown";
    render(
      <LinkWithDropdown isBold data={mockData} isTextOverflow title={title}>
        Link with dropdown
      </LinkWithDropdown>,
    );

    const textElement = screen.getByText("Link with dropdown");
    expect(textElement).toHaveClass(styles.textOverflow);
    expect(textElement).toHaveAttribute("title", title);
  });

  it("opens and closes from the keyboard", () => {
    render(
      <LinkWithDropdown data={mockData}>Link with dropdown</LinkWithDropdown>,
    );

    const trigger = screen.getByRole("button", { name: "Link with dropdown" });
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.keyDown(trigger, { key: " " });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  // Inside a ModalDialog, which closes on an Escape keyup on window, Escape
  // has to close the menu and leave the dialog open.
  it("keeps the keys it handles from window and document listeners", () => {
    const onDocumentKeyDown = vi.fn();
    const onWindowKeyUp = vi.fn();
    document.addEventListener("keydown", onDocumentKeyDown);
    window.addEventListener("keyup", onWindowKeyUp);

    render(
      <LinkWithDropdown data={mockData}>Link with dropdown</LinkWithDropdown>,
    );
    const trigger = screen.getByRole("button", { name: "Link with dropdown" });
    fireEvent.keyDown(trigger, { key: "Enter" });
    fireEvent.keyUp(trigger, { key: "Enter" });
    fireEvent.keyDown(trigger, { key: "Escape" });
    fireEvent.keyUp(trigger, { key: "Escape" });

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(onDocumentKeyDown).not.toHaveBeenCalled();
    expect(onWindowKeyUp).not.toHaveBeenCalled();
    document.removeEventListener("keydown", onDocumentKeyDown);
    window.removeEventListener("keyup", onWindowKeyUp);
  });

  it("is out of the tab order and ignores keys while disabled", () => {
    render(
      <LinkWithDropdown data={mockData} isDisabled>
        Link with dropdown
      </LinkWithDropdown>,
    );

    const trigger = screen.getByRole("button", { name: "Link with dropdown" });
    expect(trigger).toHaveAttribute("tabindex", "-1");
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("drops the 200px cap when manualWidth is set", () => {
    const { rerender } = render(
      <LinkWithDropdown data={mockData} isOpen>
        Link with dropdown
      </LinkWithDropdown>,
    );
    expect(screen.getByTestId("dropdown")).toHaveClass(styles.fixedMaxWidth);

    rerender(
      <LinkWithDropdown data={mockData} isOpen manualWidth="300px">
        Link with dropdown
      </LinkWithDropdown>,
    );
    expect(screen.getByTestId("dropdown")).not.toHaveClass(
      styles.fixedMaxWidth,
    );
  });
});
