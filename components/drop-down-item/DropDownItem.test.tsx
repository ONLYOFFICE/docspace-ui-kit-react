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
});

describe("<DropDownItem /> icon source", () => {
  const ownSvg = "/static/images/icons/16/trash.react.svg";

  it("inlines a .svg on the page's own origin", () => {
    render(<DropDownItem {...baseProps} icon={ownSvg} />);

    expect(screen.getByTestId("mocked-react-svg")).toHaveAttribute(
      "data-src",
      ownSvg,
    );
    expect(screen.queryByAltText("plugin-logo")).not.toBeInTheDocument();
  });

  it("inlines an SVG data URL", () => {
    const dataUrl = "data:image/svg+xml;base64,PHN2Zy8+";

    render(<DropDownItem {...baseProps} icon={dataUrl} />);

    expect(screen.getByTestId("mocked-react-svg")).toHaveAttribute(
      "data-src",
      dataUrl,
    );
  });

  it("draws a cross-origin .svg as an image, without fetching it", () => {
    const foreignSvg = "https://cdn.example.com/icon.svg";

    render(<DropDownItem {...baseProps} icon={foreignSvg} />);

    expect(screen.getByAltText("plugin-logo")).toHaveAttribute(
      "src",
      foreignSvg,
    );
    expect(screen.queryByTestId("mocked-react-svg")).not.toBeInTheDocument();
  });

  it("draws a bitmap as an image, even under images/", () => {
    render(<DropDownItem {...baseProps} icon="/static/images/logo.png" />);

    expect(screen.getByAltText("plugin-logo")).toHaveAttribute(
      "src",
      "/static/images/logo.png",
    );
    expect(screen.queryByTestId("mocked-react-svg")).not.toBeInTheDocument();
  });
});
