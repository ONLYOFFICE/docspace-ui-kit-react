import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import type { ContextMenuModel } from "../../../components/context-menu";

import { MessageError } from ".";

describe("MessageError", () => {
  const mockOnMaskClick = vi.fn();
  const mockOnItemClick = vi.fn();

  const defaultProps = {
    errorTitle: "Test Error Message",
    isMobile: false,
    model: [
      {
        key: "download",
        label: "Download",
        icon: "download-icon.svg",
        onClick: mockOnItemClick,
        isSeparator: undefined,
      },
      {
        key: "delete",
        label: "Delete",
        icon: "delete-icon.svg",
        onClick: mockOnItemClick,
        isSeparator: undefined,
      },
    ] as ContextMenuModel[],
    onMaskClick: mockOnMaskClick,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders error message correctly", () => {
    render(<MessageError {...defaultProps} />);

    expect(screen.getByTestId("message-error-container")).toBeInTheDocument();
    expect(screen.getByTestId("message-error-title")).toHaveTextContent(
      "Test Error Message",
    );
  });

  it("renders toolbar items for desktop view", () => {
    render(<MessageError {...defaultProps} />);

    expect(screen.getByTestId("message-error-toolbar")).toBeInTheDocument();
    expect(screen.getByTestId("toolbar-item-download")).toBeInTheDocument();
    expect(screen.getByTestId("toolbar-item-delete")).toBeInTheDocument();
  });

  it("renders only delete and download buttons in mobile view", () => {
    render(<MessageError {...defaultProps} isMobile />);

    const toolbar = screen.getByTestId("message-error-toolbar");
    expect(toolbar).toBeInTheDocument();
    expect(screen.getByTestId("toolbar-item-download")).toBeInTheDocument();
    expect(screen.getByTestId("toolbar-item-delete")).toBeInTheDocument();
  });

  it("handles toolbar item clicks correctly", () => {
    render(<MessageError {...defaultProps} />);

    const downloadButton = screen.getByTestId("toolbar-item-download");
    fireEvent.click(downloadButton);

    expect(mockOnMaskClick).toHaveBeenCalledTimes(1);
    expect(mockOnItemClick).toHaveBeenCalledTimes(1);
  });

  it("filters out disabled items", () => {
    const propsWithDisabledItem = {
      ...defaultProps,
      model: [
        ...defaultProps.model,
        {
          key: "rename",
          label: "Rename",
          icon: "rename-icon.svg",
          onClick: mockOnItemClick,
          disabled: true,
          isSeparator: undefined,
        },
      ] as ContextMenuModel[],
    };

    render(<MessageError {...propsWithDisabledItem} />);

    expect(screen.queryByTestId("toolbar-item-rename")).not.toBeInTheDocument();
  });

  it("handles items without icons", () => {
    const propsWithNoIcon = {
      ...defaultProps,
      model: [
        ...defaultProps.model,
        {
          key: "noIcon",
          label: "No Icon",
          onClick: mockOnItemClick,
          isSeparator: undefined,
        },
      ] as ContextMenuModel[],
    };

    render(<MessageError {...propsWithNoIcon} />);

    expect(screen.queryByTestId("toolbar-item-noIcon")).not.toBeInTheDocument();
  });
});
