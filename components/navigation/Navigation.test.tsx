import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";
import Navigation from "./Navigation";
import { DeviceType } from "../../enums";

// The real tooltip renders nothing until it opens; this one shows its id.
vi.mock("../tooltip", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../tooltip")>()),
  Tooltip: ({ id }: { id?: string }) => (
    <div data-testid="title-icon-tooltip" id={id} />
  ),
}));

describe("Navigation Component", () => {
  const defaultProps = {
    tReady: true,
    isRootFolder: false,
    title: "My Documents",
    canCreate: true,
    isTabletView: false,
    navigationItems: [
      { id: "1", title: "Documents", isRootRoom: false },
      { id: "2", title: "Shared with me", isRootRoom: false },
      { id: "3", title: "Project files", isRootRoom: true },
    ],
    onClickFolder: vi.fn(),
    onBackToParentFolder: vi.fn(),
    getContextOptionsFolder: vi.fn(() => [
      { key: "rename", label: "Rename" },
      { key: "delete", label: "Delete" },
    ]),
    getContextOptionsPlus: vi.fn(() => [
      { key: "upload", label: "Upload file" },
      { key: "create", label: "Create folder" },
    ]),
    isTrashFolder: false,
    toggleInfoPanel: vi.fn(),
    isInfoPanelVisible: false,
    titles: {
      infoPanel: "Info Panel",
      actions: "Actions",
      contextMenu: "Context Menu",
      warningText: "Warning",
    },
    withMenu: true,
    onPlusClick: vi.fn(),
    isDesktop: true,
    isFrame: false,
    hideInfoPanel: true,
    withLogo: false,
    burgerLogo: "test-logo.svg",
    showRootFolderTitle: true,
    isPublicRoom: false,
    titleIcon: "folder",
    currentDeviceType: DeviceType.desktop,
    rootRoomTitle: "Root Room",
    showTitle: true,
    navigationButtonLabel: "Navigation",
    onNavigationButtonClick: vi.fn(),
    tariffBar: <div data-testid="tariff-bar">Tariff information</div>,
    showNavigationButton: true,
    titleIconTooltip: "Folder tooltip",
    onContextOptionsClick: vi.fn(),
    onLogoClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("hands its ref the header row", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Navigation {...defaultProps} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveTextContent("My Documents");
  });

  it("names the back arrow and the plus and folder buttons", () => {
    render(
      <Navigation
        {...defaultProps}
        isPlusButtonVisible
        isContextButtonVisible
        titles={{
          ...defaultProps.titles,
          actions: "New room",
          contextMenu: "Show folder actions",
        }}
      />,
    );

    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "New room" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Show folder actions" }),
    ).toBeInTheDocument();
  });

  it("puts a passed aria-* on the header container", () => {
    const { container } = render(
      <Navigation {...defaultProps} aria-describedby="folder-hint" />,
    );

    expect(
      container.querySelector('[data-is-drop-box-component="false"]'),
    ).toHaveAttribute("aria-describedby", "folder-hint");
  });

  it("renders navigation component with title", () => {
    render(<Navigation {...defaultProps} />);
    expect(screen.getByText("My Documents")).toBeInTheDocument();
  });

  it("draws the host's title content in place of the heading", () => {
    render(
      <Navigation
        {...defaultProps}
        titleContent={<button type="button">Switch agent</button>}
      />,
    );
    expect(screen.getByTestId("navigation-title-content")).toBeTruthy();
    expect(screen.getByText("Switch agent")).toBeTruthy();
    expect(screen.queryByText(defaultProps.title)).toBeNull();
  });

  describe("host controls before the context button", () => {
    const toolbar = (
      <div data-testid="chat-toolbar">
        <button type="button">Chat history</button>
        <button type="button">New chat</button>
      </div>
    );

    const controlRow = () =>
      document.getElementById("control-buttons-container") as HTMLElement;

    it("draws them, the context button and the navigation button in that order", () => {
      render(
        <Navigation
          {...defaultProps}
          isContextButtonVisible
          beforeContextButton={toolbar}
        />,
      );
      const group = screen.getByTestId("navigation-leading-controls");
      const children = Array.from(group.children);
      expect(children).toHaveLength(3);
      expect(children[0]).toBe(screen.getByTestId("chat-toolbar"));
      expect(children[1].classList.contains("option-button")).toBe(true);
      expect(children[2]).toBe(screen.getByTestId("navigation_button"));
      // Neither button is drawn a second time outside the group.
      expect(controlRow().querySelectorAll(".option-button")).toHaveLength(1);
      expect(screen.getAllByTestId("navigation_button")).toHaveLength(1);
      expect(
        controlRow().parentElement?.getAttribute("data-with-leading-controls"),
      ).toBe("true");
    });

    it("comes right after the title on the desktop: before the tariff notice", () => {
      render(
        <Navigation
          {...defaultProps}
          isContextButtonVisible
          beforeContextButton={toolbar}
        />,
      );
      const children = Array.from(controlRow().children);
      const group = screen.getByTestId("navigation-leading-controls");
      const tariff = screen.getByTestId("tariff-bar").parentElement;
      expect(children.indexOf(group)).toBeLessThan(
        children.indexOf(tariff as Element),
      );
    });

    it("is the last child below the desktop, where the row runs right to left", () => {
      render(
        <Navigation
          {...defaultProps}
          currentDeviceType={DeviceType.tablet}
          isContextButtonVisible
          beforeContextButton={toolbar}
        />,
      );
      expect(controlRow().lastElementChild).toBe(
        screen.getByTestId("navigation-leading-controls"),
      );
    });

    it("leaves the row as it was without them", () => {
      render(<Navigation {...defaultProps} isContextButtonVisible />);
      expect(screen.queryByTestId("navigation-leading-controls")).toBeNull();
      expect(
        controlRow().querySelector(":scope > .option-button"),
      ).toBeTruthy();
      expect(
        controlRow().parentElement?.getAttribute("data-with-leading-controls"),
      ).toBe("false");
    });
  });

  it("renders tariff bar when provided", () => {
    render(<Navigation {...defaultProps} />);
    expect(screen.getByTestId("tariff-bar")).toBeInTheDocument();
  });

  it("adapts to tablet view", () => {
    render(<Navigation {...defaultProps} />);
    // Add assertions for tablet-specific UI elements
    expect(screen.getByText("My Documents")).toBeInTheDocument();
  });

  it("opens nothing from the room title with a single crumb", () => {
    render(
      <Navigation
        {...defaultProps}
        navigationItems={[{ id: "1", title: "Documents", isRootRoom: true }]}
      />,
    );

    // React reports a handler's error on the window rather than throwing it.
    const errors: unknown[] = [];
    const onError = (event: ErrorEvent) => {
      event.preventDefault();
      errors.push(event.error);
    };
    window.addEventListener("error", onError);
    fireEvent.click(screen.getByText("Root Room"));
    window.removeEventListener("error", onError);

    expect(errors).toEqual([]);
    expect(defaultProps.onClickFolder).not.toHaveBeenCalled();
  });

  it("gives each header its own title icon tooltip", () => {
    const { container } = render(
      <>
        <Navigation {...defaultProps} />
        <Navigation {...defaultProps} />
      </>,
    );

    const ids = Array.from(
      container.querySelectorAll('[data-testid="title-icon-tooltip"]'),
      (node) => node.id,
    );
    expect(ids).toHaveLength(2);
    expect(ids[0]).not.toBe(ids[1]);
  });

  it("draws no empty image for withLogo={true}", () => {
    const { container } = render(<Navigation {...defaultProps} withLogo />);

    const images = Array.from(container.querySelectorAll("img"));
    expect(images.some((image) => !image.getAttribute("src"))).toBe(false);
  });

  it.each([
    [DeviceType.desktop, ["navigation_button", "analyze"]],
    [DeviceType.tablet, ["analyze", "navigation_button"]],
  ])("places the extra button by currentDeviceType (%s)", (type, order) => {
    window.innerWidth = type === DeviceType.desktop ? 800 : 1200;

    render(
      <Navigation
        {...defaultProps}
        currentDeviceType={type}
        analyzeResponsesButton={<span data-testid="analyze" />}
      />,
    );

    const found = Array.from(
      document.querySelectorAll(
        '[data-testid="navigation_button"], [data-testid="analyze"]',
      ),
      (node) => node.getAttribute("data-testid"),
    );
    expect(found).toEqual(order);
    window.innerWidth = 1024;
  });

  it("shows public room specific UI when isPublicRoom is true", () => {
    render(<Navigation {...defaultProps} isPublicRoom />);
    // Add assertions for public room specific UI elements
    expect(screen.getByText("My Documents")).toBeInTheDocument();
  });
});
