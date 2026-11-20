import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";

import { Tag } from ".";
import { TagProps } from "./Tag.types";

vi.mock("../../assets/icons/12/cross.react.svg", () => ({
  default: () => <svg data-testid="cross-icon" />,
}));

vi.mock("react-svg", () => ({
  ReactSVG: ({ src, className }: { src: string; className?: string }) => (
    <div data-testid="react-svg" data-src={src} className={className} />
  ),
}));

vi.mock("../tooltip", () => ({
  TooltipContainer: ({
    children,
    onClick,
    className,
    id,
    "data-testid": testId,
    onMouseEnter,
    onMouseLeave,
    role,
    tabIndex,
    onKeyDown,
    ...rest
  }: {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler;
    className?: string;
    id?: string;
    "data-testid"?: string;
    onMouseEnter?: React.MouseEventHandler;
    onMouseLeave?: React.MouseEventHandler;
    role?: string;
    tabIndex?: number;
    onKeyDown?: React.KeyboardEventHandler;
  } & React.AriaAttributes) => (
    <div
      {...Object.fromEntries(
        Object.entries(rest).filter(([key]) => key.startsWith("aria-")),
      )}
      className={className}
      onClick={onClick}
      data-testid={testId || "tag_item"}
      id={id}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role={role}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  ),
  withTooltip: (Component: React.ComponentType) => Component,
}));

vi.mock("../icon-button", () => ({
  IconButton: ({
    onClick,
    dataTestId,
    ariaLabel,
  }: {
    onClick: Function;
    dataTestId?: string;
    ariaLabel?: string;
  }) => (
    <button
      aria-label={ariaLabel}
      onClick={(e) => onClick(e)}
      data-testid={dataTestId || "icon-button"}
      type="button"
    >
      Delete
    </button>
  ),
}));

const baseProps: TagProps = {
  tag: "script",
  label: "Script",
  isNewTag: false,
  isDisabled: false,
  onDelete: vi.fn(),
  onClick: vi.fn(),
  tagMaxWidth: "160px",
};

describe("<Tag />", () => {
  it("is a keyboard button when clickable", () => {
    const onClick = vi.fn();
    const { rerender } = render(<Tag {...baseProps} onClick={onClick} />);

    const tag = screen.getByRole("button", { name: "Script" });
    expect(tag).toHaveAttribute("tabindex", "0");
    fireEvent.keyDown(tag, { key: "Enter" });
    fireEvent.keyDown(tag, { key: " " });
    expect(onClick).toHaveBeenCalledTimes(2);

    rerender(<Tag {...baseProps} onClick={onClick} isDisabled />);
    expect(screen.getByTestId("tag_item")).not.toHaveAttribute("role");
  });

  it("names the delete cross", () => {
    render(<Tag {...baseProps} isNewTag />);

    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
  });

  it("renders without error", () => {
    render(<Tag {...baseProps} />);
    expect(screen.getByTestId("tag_item")).toBeInTheDocument();
  });

  it("keeps a passed aria-*, its aria-label over label", () => {
    const { rerender } = render(
      <Tag
        {...baseProps}
        aria-label="Filter by Script"
        aria-describedby="tag-hint"
        aria-disabled
      />,
    );
    const tag = screen.getByTestId("tag_item");
    expect(tag).toHaveAttribute("aria-label", "Filter by Script");
    expect(tag).toHaveAttribute("aria-describedby", "tag-hint");
    expect(tag).toHaveAttribute("aria-disabled", "true");

    rerender(<Tag {...baseProps} isDisabled aria-disabled={false} />);
    expect(tag).toHaveAttribute("aria-disabled", "true");
  });

  it("accepts id", () => {
    render(<Tag {...baseProps} id="testId" />);
    expect(screen.getByTestId("tag_item")).toHaveAttribute("id", "testId");
  });

  it("accepts className", () => {
    render(<Tag {...baseProps} className="test" />);
    expect(screen.getByTestId("tag_item")).toHaveClass("test");
  });

  it("calls onDelete when cross icon is clicked", () => {
    const onDelete = vi.fn();
    render(<Tag {...baseProps} isNewTag onDelete={onDelete} />);
    const deleteButton = screen.getByRole("button", { name: "Remove" });
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledWith("script");
  });

  it("calls onClick when tag is clicked", () => {
    const onClick = vi.fn();
    render(<Tag {...baseProps} onClick={onClick} />);
    const tag = screen.getByTestId("tag_item");
    fireEvent.click(tag);
    expect(onClick).toHaveBeenCalled();
  });

  it("does not call onDelete if target is tag container", () => {
    const onDelete = vi.fn();
    render(<Tag {...baseProps} isNewTag onDelete={onDelete} />);
    const tag = screen.getByTestId("tag_item");
    const deleteButton = screen.getByRole("button", { name: "Remove" });

    // Case 1: Target is NOT the container -> should call onDelete
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledWith("script");

    onDelete.mockClear();

    // Case 2: Target IS the container (simulated via ref matching) -> should NOT call onDelete
    // In Tag.tsx: e.target !== tagRef.current
    fireEvent.click(tag, { target: tag });
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("renders third party icon", () => {
    const iconUrl = "test-icon.svg";
    render(<Tag {...baseProps} icon={iconUrl} />);

    const icon = screen.getByTestId("react-svg");
    expect(icon).toHaveAttribute("data-src", iconUrl);
  });

  it("does not call onClick if disabled or deleted", () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <Tag {...baseProps} isDisabled onClick={onClick} />,
    );
    fireEvent.click(screen.getByTestId("tag_item"));
    expect(onClick).not.toHaveBeenCalled();

    rerender(<Tag {...baseProps} isDeleted onClick={onClick} />);
    fireEvent.click(screen.getByTestId("tag_item"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("calls onMouseEnter and onMouseLeave", () => {
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();
    render(
      <Tag
        {...baseProps}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />,
    );

    const tag = screen.getByTestId("tag_item");
    fireEvent.mouseEnter(tag);
    expect(onMouseEnter).toHaveBeenCalled();

    fireEvent.mouseLeave(tag);
    expect(onMouseLeave).toHaveBeenCalled();
  });
});
