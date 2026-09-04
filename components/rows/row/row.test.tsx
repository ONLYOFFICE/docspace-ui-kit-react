import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Row } from ".";
import styles from "./Row.module.scss";

const baseProps = {
  checked: false,
  element: <span>1</span>,
  contextOptions: [{ key: "1", label: "test" }],
  children: <span>Some text</span>,
  onChangeIndex: () => () => {},
};

describe("<Row />", () => {
  it("renders without error", () => {
    render(
      <Row {...baseProps} isIndexEditingMode={false} onRowClick={() => {}} />,
    );

    expect(screen.getByTestId("row")).toBeInTheDocument();
  });

  it("renders checkbox with correct styling", () => {
    render(
      <Row
        {...baseProps}
        isIndexEditingMode={false}
        onRowClick={() => {}}
        mode="modern"
      />,
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox.parentElement).toHaveClass("checkbox");
  });

  it("handles checkbox state changes", () => {
    const onSelect = vi.fn();
    render(
      <Row
        {...baseProps}
        onSelect={onSelect}
        isIndexEditingMode={false}
        onRowClick={() => {}}
      />,
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(onSelect).toHaveBeenCalled();
  });

  it("shows checkbox when row is checked", () => {
    render(
      <Row
        {...baseProps}
        checked
        isIndexEditingMode={false}
        onRowClick={() => {}}
      />,
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeVisible();
    expect(checkbox).toBeChecked();
  });

  it("applies modern styling class", () => {
    render(
      <Row
        {...baseProps}
        isIndexEditingMode={false}
        onRowClick={() => {}}
        mode="modern"
      />,
    );

    const row = screen.getByTestId("row");
    expect(row).toHaveClass(styles.modern);
  });

  it("handles indeterminate checkbox state", () => {
    render(
      <Row
        {...baseProps}
        indeterminate
        isIndexEditingMode={false}
        onRowClick={() => {}}
      />,
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveProperty("indeterminate", true);
  });

  it("renders children content", () => {
    render(
      <Row {...baseProps} isIndexEditingMode={false} onRowClick={() => {}} />,
    );

    expect(screen.getByText("Some text")).toBeInTheDocument();
  });

  it("handles row click events", () => {
    const onRowClick = vi.fn();
    render(
      <Row {...baseProps} isIndexEditingMode={false} onRowClick={onRowClick} />,
    );

    const content = screen.getByText("Some text").closest(".row_content");
    expect(content).not.toBeNull();
    if (content) {
      fireEvent.click(content);
      expect(onRowClick).toHaveBeenCalled();
    }
  });
});
