import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ContextMenu } from "../../../components/context-menu";
import { ToolbarActionType } from "../../MediaViewer.enums";
import { ViewerToolbar } from "./index";
import type { ToolbarItemType } from "./ViewerToolbar.props";

const DotsIcon = () => <div data-testid="dots-icon">Dots</div>;

// Mock useClickOutside hook
vi.mock("../../../utils/use-click-outside", () => ({
  useClickOutside: (ref: HTMLElement, callback: () => void) => {
    // Mock implementation that just stores the callback

    // biome-ignore lint/suspicious/noExplicitAny: TODO fix
    (window as any).clickOutsideCallback = callback;
  },
}));

// Mock classnames
vi.mock("classnames", () => ({
  __esModule: true,
  default: (...args: string[]) => args.filter(Boolean).join(" "),
}));

describe("ViewerToolbar", () => {
  const mockToolbarEvent = vi.fn();
  const mockGenerateContextMenu = vi.fn();
  const mockSetIsOpenContextMenu = vi.fn();

  const defaultToolbarItems: ToolbarItemType[] = [
    {
      key: "zoom-in",
      percent: false,
      actionType: 1,
      render: <div />,
      noHover: undefined,
      disabled: undefined,
      onClick: undefined,
    },
    {
      key: "zoom-out",
      percent: false,
      actionType: 1,
      render: <div />,
      noHover: undefined,
      disabled: undefined,
      onClick: undefined,
    },
  ];

  const defaultProps = {
    toolbar: defaultToolbarItems,
    percentValue: 1,
    toolbarEvent: mockToolbarEvent,
    generateContextMenu: mockGenerateContextMenu,
    setIsOpenContextMenu: mockSetIsOpenContextMenu,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders toolbar with all items", () => {
    render(<ViewerToolbar {...defaultProps} />);

    defaultToolbarItems.forEach((item) => {
      const toolbarItem = screen.getByTestId(`toolbar-item-${item.key}`);
      expect(toolbarItem).toBeInTheDocument();
    });
  });

  it("handles toolbar item clicks", () => {
    render(<ViewerToolbar {...defaultProps} />);

    const zoomInButton = screen.getByTestId("toolbar-item-zoom-in");
    fireEvent.click(zoomInButton);

    expect(mockToolbarEvent).toHaveBeenCalledWith(defaultToolbarItems[0]);
  });

  it("handles context menu toggle", () => {
    const contextMenu = <div data-testid="context-menu">Context Menu</div>;
    mockGenerateContextMenu.mockReturnValue(contextMenu);
    const contextMenuModel = [
      {
        key: "item1",
        label: "Item 1",
        onClick: () => console.log("Item 1 clicked"),
      },
      {
        key: "item2",
        label: "Item 2",
        onClick: () => console.log("Item 2 clicked"),
      },
    ];
    const toolbarWithContextMenu = [
      ...defaultToolbarItems,
      {
        key: "context-menu",
        title: "More Options",
        icon: <DotsIcon />,
        actionType: ToolbarActionType.Panel,
        render: <ContextMenu model={contextMenuModel} />,
        onClick: () => console.log("Context menu clicked"),
        disabled: false,
      },
    ];

    render(
      <ViewerToolbar {...defaultProps} toolbar={toolbarWithContextMenu} />,
    );

    const contextMenuButton = screen.getByTestId("toolbar-item-context-menu");
    fireEvent.click(contextMenuButton);

    expect(mockSetIsOpenContextMenu).toHaveBeenCalled();
    expect(screen.getByTestId("context-menu")).toBeInTheDocument();
  });

  it("applies custom className when provided", () => {
    const customClass = "custom-toolbar";
    render(<ViewerToolbar {...defaultProps} className={customClass} />);

    const toolbar = screen.getByTestId("viewer-toolbar");
    expect(toolbar).toHaveClass(customClass);
  });

  it("handles disabled items", () => {
    const toolbarWithDisabledItem = [
      ...defaultToolbarItems,
      {
        key: "disabled-item",
        title: "Disabled Item",
        icon: <div>Disabled</div>,
        actionType: ToolbarActionType.Download,
        render: <div>Disabled</div>,
        disabled: true,
        onClick: () => {},
      },
    ];

    render(
      <ViewerToolbar {...defaultProps} toolbar={toolbarWithDisabledItem} />,
    );

    expect(
      screen.queryByTestId("toolbar-item-disabled-item"),
    ).not.toBeInTheDocument();
  });

  it("renders custom content when render prop is provided", () => {
    const customContent = (
      <div data-testid="custom-content">Custom Content</div>
    );
    const toolbarWithCustomContent = [
      ...defaultToolbarItems,
      {
        key: "custom",
        title: "Custom Item",
        icon: <div>Icon</div>,
        render: customContent,
        actionType: ToolbarActionType.Download,
        onClick: () => console.log("Custom item clicked"),
        disabled: false,
      },
    ];

    render(
      <ViewerToolbar {...defaultProps} toolbar={toolbarWithCustomContent} />,
    );

    expect(screen.getByTestId("custom-content")).toBeInTheDocument();
  });
});
