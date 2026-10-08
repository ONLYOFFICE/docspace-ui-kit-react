import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import NavLogoReactSvgUrl from "../../assets/settings.react.svg";

import { DropDownItem } from ".";

const baseProps = {
  isSeparator: false,
  isHeader: false,
  tabIndex: -1,
  label: "test",
  disabled: false,
  icon: NavLogoReactSvgUrl,
  noHover: false,
  onClick: vi.fn(),
};

describe("<DropDownItem />", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders without error", () => {
    render(<DropDownItem {...baseProps} />);
    expect(screen.getByTestId("drop-down-item")).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<DropDownItem {...baseProps} label="Test Item" />);
    expect(screen.getByText("Test Item")).toBeInTheDocument();
  });

  it("handles disabled state", () => {
    render(<DropDownItem {...baseProps} disabled />);
    const item = screen.getByTestId("drop-down-item");

    fireEvent.click(item);
    expect(baseProps.onClick).not.toHaveBeenCalled();
  });

  it("handles click events", () => {
    render(<DropDownItem {...baseProps} />);
    const item = screen.getByTestId("drop-down-item");

    fireEvent.click(item);
    expect(baseProps.onClick).toHaveBeenCalled();
  });

  it("handles selected item click", () => {
    const onClickSelectedItem = vi.fn();
    render(
      <DropDownItem
        {...baseProps}
        isSelected
        onClickSelectedItem={onClickSelectedItem}
      />,
    );
    const item = screen.getByTestId("drop-down-item");

    fireEvent.click(item);
    expect(onClickSelectedItem).toHaveBeenCalled();
  });

  it("renders with toggle button", () => {
    const onChange = vi.fn();
    render(
      <DropDownItem {...baseProps} withToggle checked onClick={onChange} />,
    );
    const toggle = screen.getByRole("checkbox");
    expect(toggle).toBeInTheDocument();
    expect(toggle).toBeChecked();

    fireEvent.click(toggle);
    expect(onChange).toHaveBeenCalled();
  });

  it("renders a description under the label and still fires the item click", () => {
    render(<DropDownItem {...baseProps} description="Role description" />);

    expect(screen.getByText("Role description")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("drop-down-item"));
    expect(baseProps.onClick).toHaveBeenCalled();
  });

  it("renders with beta badge", () => {
    render(<DropDownItem {...baseProps} isBeta />);
    const badge = screen.getByTestId("badge-text");
    expect(badge).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const className = "custom-item";
    render(<DropDownItem {...baseProps} className={className} />);
    const item = screen.getByTestId("drop-down-item");
    expect(item).toHaveClass(className);
  });

  it("applies custom styles", () => {
    const style = { backgroundColor: "red" };
    render(<DropDownItem {...baseProps} style={style} />);
    const item = screen.getByTestId("drop-down-item");
    expect(item.style.backgroundColor).toBe("red");
  });

  it("renders with additional element", () => {
    const additionalElement = <div data-testid="additional">Extra</div>;
    render(
      <DropDownItem {...baseProps} additionalElement={additionalElement} />,
    );
    expect(screen.getByTestId("additional")).toBeInTheDocument();
  });

  describe("external link", () => {
    const externalProps = {
      ...baseProps,
      label: "Help center",
      withExternalLink: true,
      externalLinkPath: "https://example.com/help",
    };

    it("is a focusable link to externalLinkPath with a name", () => {
      render(<DropDownItem {...externalProps} />);
      const link = screen.getByRole("link", { name: /Help center/ });

      expect(link).toHaveAttribute("href", "https://example.com/help");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("uses externalLinkLabel as the accessible name", () => {
      render(<DropDownItem {...externalProps} externalLinkLabel="Open help" />);

      expect(
        screen.getByRole("link", { name: "Open help" }),
      ).toBeInTheDocument();
    });

    it("leaves a plain click to onExternalLinkClick and not to the row", () => {
      const onExternalLinkClick = vi.fn();
      render(
        <DropDownItem
          {...externalProps}
          onExternalLinkClick={onExternalLinkClick}
        />,
      );
      const link = screen.getByRole("link", { name: /Help center/ });
      const notPrevented = fireEvent.click(link);

      expect(onExternalLinkClick).toHaveBeenCalledTimes(1);
      expect(notPrevented).toBe(false);
      expect(baseProps.onClick).not.toHaveBeenCalled();
    });

    it("follows the href when there is no callback", () => {
      render(<DropDownItem {...externalProps} />);
      const link = screen.getByRole("link", { name: /Help center/ });

      expect(fireEvent.click(link)).toBe(true);
      expect(baseProps.onClick).not.toHaveBeenCalled();
    });
  });
});
