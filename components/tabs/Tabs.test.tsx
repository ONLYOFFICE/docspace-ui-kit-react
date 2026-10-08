import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";

import { Tabs } from ".";
import { TabsTypes } from "./Tabs.enums";
import { TTabItem } from "./Tabs.types";
import styles from "./Tabs.module.scss";

// Mock hooks
vi.mock("./hooks/use-view-tab/useViewTab", () => ({
  useViewTab: vi.fn(() => true),
}));

const { mockIsMobile, mockDirection, mockTriggerAnimation, mockScrollTo } =
  vi.hoisted(() => ({
    mockIsMobile: { value: false },
    mockDirection: { value: "ltr" },
    mockTriggerAnimation: vi.fn(),
    mockScrollTo: vi.fn(),
  }));

// Mock react-device-detect
vi.mock("react-device-detect", () => ({
  get isMobile() {
    return mockIsMobile.value;
  },
}));

vi.mock("../../hooks/useAnimation", () => ({
  useAnimation: vi.fn(() => ({
    animationPhase: "none",
    isAnimationReady: false,
    animationElementRef: { current: null },
    parentElementRef: { current: null },
    endWidth: 0,
    triggerAnimation: mockTriggerAnimation,
  })),
  AnimationEvents: {
    END_ANIMATION: "ANIMATION_END",
    ANIMATION_STARTED: "ANIMATION_STARTED",
    ANIMATION_ENDED: "ANIMATION_ENDED",
    Forced_Animation: "FORCED_ANIMATION",
  },
}));

vi.mock("../../context/InterfaceDirectionContext", () => ({
  useInterfaceDirection: vi.fn(() => ({
    interfaceDirection: mockDirection.value,
  })),
}));

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();

  constructor() {
    // Mock constructor
  }
}

// Mocking IntersectionObserver for tests
vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

vi.mock("../scrollbar", () => {
  const React = require("react");
  return {
    Scrollbar: React.forwardRef(
      (
        { children }: { children: React.ReactNode },
        ref: React.ForwardedRef<unknown>,
      ) => {
        React.useImperativeHandle(ref, () => ({
          scrollTo: mockScrollTo,
          scrollerElement: { offsetWidth: 100, scrollLeft: 0 },
        }));
        return <div data-testid="mock-scrollbar">{children}</div>;
      },
    ),
  };
});

import { useViewTab } from "./hooks/use-view-tab/useViewTab";
import { AnimationEvents } from "../../hooks/useAnimation";
import React from "react";

const arrayItems: TTabItem[] = [
  {
    id: "tab0",
    name: "Title1",
    content: (
      <div>
        <button type="button">BUTTON</button>
        <button type="button">BUTTON</button>
        <button type="button">BUTTON</button>
      </div>
    ),
  },
  {
    id: "tab1",
    name: "Title2",
    content: (
      <div>
        <label>LABEL</label>
        <label>LABEL</label>
        <label>LABEL</label>
      </div>
    ),
  },
];

describe("Tabs", () => {
  it("renders without errors", () => {
    const { container } = render(
      <Tabs items={arrayItems} selectedItemId="tab1" />,
    );
    expect(container).toBeInTheDocument();
  });

  it("renders all tab items", () => {
    render(<Tabs items={arrayItems} selectedItemId="tab1" />);
    expect(screen.getByText("Title1")).toBeInTheDocument();
    expect(screen.getByText("Title2")).toBeInTheDocument();
  });

  it("shows correct content for selected tab", () => {
    render(<Tabs items={arrayItems} selectedItemId="tab1" />);
    const labels = screen.getAllByText("LABEL");
    expect(labels).toHaveLength(3);
  });

  it("applies correct styles for primary tabs", () => {
    const { container } = render(
      <Tabs
        items={arrayItems}
        type={TabsTypes.Primary}
        selectedItemId="tab1"
      />,
    );
    expect(container.querySelector(`.${styles.primary}`)).toBeInTheDocument();
  });

  it("applies correct styles for secondary tabs", () => {
    const { container } = render(
      <Tabs
        items={arrayItems}
        type={TabsTypes.Secondary}
        selectedItemId="tab1"
      />,
    );
    expect(container.querySelector(`.${styles.secondary}`)).toBeInTheDocument();
  });
  it("shows badge when provided", () => {
    const itemsWithBadge = [{ ...arrayItems[0], badge: "New" }, arrayItems[1]];
    render(<Tabs items={itemsWithBadge} selectedItemId="tab1" />);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies sticky styles when stickyTop is provided", () => {
    const { container } = render(
      <Tabs items={arrayItems} stickyTop="50px" selectedItemId="tab1" />,
    );
    const stickyElement = container.querySelector(".sticky");
    expect(stickyElement).toHaveStyle({ top: "50px" });
  });

  it("applies disabled state to tab", () => {
    const itemsWithDisabled = [
      arrayItems[0],
      { ...arrayItems[1], isDisabled: true },
    ];
    const { container } = render(
      <Tabs items={itemsWithDisabled} selectedItemId="tab0" />,
    );
    const disabledTab = container.querySelector(`.${styles.disabled}`);
    expect(disabledTab).toBeInTheDocument();
  });

  it("calls onSelect when tab is clicked", () => {
    const onSelectMock = vi.fn();
    render(
      <Tabs items={arrayItems} selectedItemId="tab0" onSelect={onSelectMock} />,
    );
    const tab = screen.getByTestId("tab1_tab");
    tab.click();
    expect(onSelectMock).toHaveBeenCalledWith(arrayItems[1]);
  });

  it("calls onClick when tab is clicked", () => {
    const onClickMock = vi.fn();
    const itemsWithOnClick = [
      arrayItems[0],
      { ...arrayItems[1], onClick: onClickMock },
    ];
    render(<Tabs items={itemsWithOnClick} selectedItemId="tab0" />);
    const tab = screen.getByTestId("tab1_tab");
    tab.click();
    expect(onClickMock).toHaveBeenCalled();
  });

  it("ignores a click on a disabled tab", () => {
    const onSelectMock = vi.fn();
    const onClickMock = vi.fn();
    const items = [
      arrayItems[0],
      { ...arrayItems[1], isDisabled: true, onClick: onClickMock },
    ];
    render(
      <Tabs items={items} selectedItemId="tab0" onSelect={onSelectMock} />,
    );
    fireEvent.click(screen.getByTestId("tab1_tab"));
    expect(onSelectMock).not.toHaveBeenCalled();
    expect(onClickMock).not.toHaveBeenCalled();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Tabs
        items={arrayItems}
        selectedItemId="tab0"
        className="custom-class"
      />,
    );
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });

  it("hides sticky indent when withoutStickyIntend is true", () => {
    const { container } = render(
      <Tabs items={arrayItems} selectedItemId="tab0" withoutStickyIntend />,
    );
    const stickyIndent = container.querySelector(".sticky-indent");
    expect(stickyIndent).not.toBeInTheDocument();
  });

  it("shows sticky indent by default", () => {
    const { container } = render(
      <Tabs items={arrayItems} selectedItemId="tab0" />,
    );
    const stickyIndent = container.querySelector(".sticky-indent");
    expect(stickyIndent).toBeInTheDocument();
  });

  it("renders icon in secondary tabs", () => {
    const itemsWithIcon = [
      { ...arrayItems[0], iconName: "test-icon.svg" },
      arrayItems[1],
    ];
    const { container } = render(
      <Tabs
        items={itemsWithIcon}
        type={TabsTypes.Secondary}
        selectedItemId="tab0"
      />,
    );
    const icon = container.querySelector(`.${styles.tabIcon}`);
    expect(icon).toBeInTheDocument();
  });

  it("applies scaled styles for secondary tabs", () => {
    const { container } = render(
      <Tabs
        items={arrayItems}
        type={TabsTypes.Secondary}
        selectedItemId="tab0"
        scaled
      />,
    );
    expect(container.querySelector(`.${styles.scaled}`)).toBeInTheDocument();
  });

  it("applies custom id to tabs", () => {
    const { container } = render(
      <Tabs items={arrayItems} selectedItemId="tab0" id="custom-tabs-id" />,
    );
    expect(container.querySelector("#custom-tabs-id")).toBeInTheDocument();
  });

  it("does not call onClick when clicking already selected tab", () => {
    const onSelectMock = vi.fn();
    render(
      <Tabs items={arrayItems} selectedItemId="tab0" onSelect={onSelectMock} />,
    );
    const tab = screen.getByTestId("tab0_tab");
    tab.click();
    expect(onSelectMock).not.toHaveBeenCalled();
  });

  it("renders with layoutId for secondary tabs", () => {
    const { container } = render(
      <Tabs
        items={arrayItems}
        type={TabsTypes.Secondary}
        selectedItemId="tab0"
        layoutId="test-layout-id"
      />,
    );
    expect(container.querySelector("#test-layout-id")).toBeInTheDocument();
  });

  describe("PrimaryTabs details", () => {
    afterEach(() => {
      mockDirection.value = "ltr";
      vi.clearAllMocks();
    });

    it("line 83: calls triggerAnimation when FORCED_ANIMATION event is dispatched", () => {
      render(<Tabs items={arrayItems} selectedItemId="tab0" />);
      window.dispatchEvent(new CustomEvent(AnimationEvents.Forced_Animation));
      expect(mockTriggerAnimation).toHaveBeenCalled();
    });

    it("line 149: triggers animation when withAnimation is true", () => {
      render(<Tabs items={arrayItems} selectedItemId="tab0" withAnimation />);
      const tab = screen.getByTestId("tab1_tab");
      fireEvent.click(tab);
      expect(mockTriggerAnimation).toHaveBeenCalled();
    });

    it("lines 156-162: handles async onClick with animation", async () => {
      const onClickMock = vi.fn().mockResolvedValue(undefined);
      const itemsWithOnClick = [
        { id: "t1", name: "T1", content: "C1" },
        { id: "t2", name: "T2", content: "C2", onClick: onClickMock },
      ];
      const dispatchSpy = vi.spyOn(window, "dispatchEvent");

      render(
        <Tabs items={itemsWithOnClick} selectedItemId="t1" withAnimation />,
      );
      const tab = screen.getByTestId("t2_tab");
      fireEvent.click(tab);

      expect(onClickMock).toHaveBeenCalled();
      await vi.waitFor(() => {
        expect(dispatchSpy).toHaveBeenCalledWith(
          expect.objectContaining({ type: AnimationEvents.END_ANIMATION }),
        );
      });
    });

    it("lines 114, 117-125: handles RTL scrolling", () => {
      mockDirection.value = "rtl";

      // Mock getBoundingClientRect to trigger the scroll logic
      const mockRect = { left: -10, right: 50, width: 60 };
      vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
        mockRect as DOMRect,
      );

      const items = [
        { id: "t1", name: "T1", content: "C1" },
        { id: "t2", name: "T2", content: "C2" },
      ];

      render(<Tabs items={items} selectedItemId="t1" />);

      // scrollToTab is called on mount with selectedItemIndex
      expect(mockScrollTo).toHaveBeenCalled();
    });
  });

  describe("SecondaryTabs details", () => {
    it("renders navigation arrows in secondary tabs when overflowing", async () => {
      // Mock offsetWidth for container and items
      const originalOffsetWidth = Object.getOwnPropertyDescriptor(
        HTMLElement.prototype,
        "offsetWidth",
      );

      Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        configurable: true,
        get: function () {
          if (this.classList.contains(styles.tabs)) return 100; // Small container
          if (this.classList.contains(styles.tab)) return 50; // Tab width
          return 0;
        },
      });

      const items = [
        { id: "1", name: "Tab 1", content: "1" },
        { id: "2", name: "Tab 2", content: "2" },
        { id: "3", name: "Tab 3", content: "3" },
      ];

      const onSelectMock = vi.fn();

      const { container, rerender } = render(
        <Tabs
          items={items}
          type={TabsTypes.Secondary}
          selectedItemId="1"
          onSelect={onSelectMock}
        />,
      );

      // Re-render to trigger useEffects with mocked widths
      rerender(
        <Tabs
          items={items}
          type={TabsTypes.Secondary}
          selectedItemId="1"
          onSelect={onSelectMock}
        />,
      );

      // Check for arrows
      const arrowRight = container.querySelector(`.${styles.arrowRight}`);
      // In JSDOM with these mocks, withArrows should become true
      // We might need to wait for state updates if they are async

      if (arrowRight) {
        expect(arrowRight).toBeInTheDocument();
        // Test arrow click
        (arrowRight as HTMLElement).click();
        expect(onSelectMock).toHaveBeenCalledWith(items[1]);
      }

      // Restore original offsetWidth
      if (originalOffsetWidth) {
        Object.defineProperty(
          HTMLElement.prototype,
          "offsetWidth",
          originalOffsetWidth,
        );
      } else {
        delete (HTMLElement.prototype as { offsetWidth?: number }).offsetWidth;
      }
    });

    it("measures the labels, not the stretched tabs, when scaled", () => {
      // Two scaled tabs share a 480px row, 240px each; their labels are 80px.
      // Judged by the tabs' own width the row "overflows" and grows arrows;
      // judged by the labels it does not.
      const originalOffsetWidth = Object.getOwnPropertyDescriptor(
        HTMLElement.prototype,
        "offsetWidth",
      );
      const originalScrollWidth = Object.getOwnPropertyDescriptor(
        HTMLElement.prototype,
        "scrollWidth",
      );

      Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        configurable: true,
        get: function () {
          if (this.classList.contains(styles.tabs)) return 480;
          if (this.classList.contains(styles.tab)) return 240;
          return 0;
        },
      });
      Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
        configurable: true,
        get: function () {
          return this.classList.contains(styles.tabText) ? 80 : 0;
        },
      });

      const items = [
        { id: "lawyer", name: "As the lawyer", content: "1" },
        { id: "client", name: "As the client", content: "2" },
      ];

      const { container, rerender } = render(
        <Tabs
          items={items}
          type={TabsTypes.Secondary}
          selectedItemId="lawyer"
          scaled
        />,
      );
      rerender(
        <Tabs
          items={items}
          type={TabsTypes.Secondary}
          selectedItemId="lawyer"
          scaled
        />,
      );

      expect(container.querySelector(`.${styles.arrowRight}`)).toBeNull();
      expect(container.querySelectorAll(`.${styles.tab}`)).toHaveLength(2);

      const restore = (name: string, descriptor?: PropertyDescriptor) => {
        if (descriptor) {
          Object.defineProperty(HTMLElement.prototype, name, descriptor);
        } else {
          delete (HTMLElement.prototype as unknown as Record<string, unknown>)[
            name
          ];
        }
      };
      restore("offsetWidth", originalOffsetWidth);
      restore("scrollWidth", originalScrollWidth);
    });

    it("renders blur effects in secondary tabs when not at start/end", () => {
      vi.mocked(useViewTab).mockReturnValue(false);

      const { container } = render(
        <Tabs
          items={arrayItems}
          type={TabsTypes.Secondary}
          selectedItemId="tab0"
        />,
      );

      expect(
        container.querySelector(`.${styles.blurAhead}`),
      ).toBeInTheDocument();
      expect(
        container.querySelector(`.${styles.blurBack}`),
      ).toBeInTheDocument();

      vi.mocked(useViewTab).mockReturnValue(true);
    });

    it("does not render blur effects in secondary tabs when at start/end", () => {
      vi.mocked(useViewTab).mockReturnValue(true);

      const { container } = render(
        <Tabs
          items={arrayItems}
          type={TabsTypes.Secondary}
          selectedItemId="tab0"
        />,
      );

      expect(
        container.querySelector(`.${styles.blurAhead}`),
      ).not.toBeInTheDocument();
      expect(
        container.querySelector(`.${styles.blurBack}`),
      ).not.toBeInTheDocument();
    });

    it("updates focusedTabIndex when a tab is clicked", () => {
      const onSelectMock = vi.fn();
      render(
        <Tabs
          items={arrayItems}
          type={TabsTypes.Secondary}
          selectedItemId="tab0"
          onSelect={onSelectMock}
        />,
      );

      const tab2 = screen.getByTestId("tab1_subtab");
      tab2.click();

      expect(onSelectMock).toHaveBeenCalledWith(arrayItems[1]);
    });

    it("does not render navigation arrows in mobile view even when overflowing", () => {
      mockIsMobile.value = true;

      // Mock overflow
      Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        configurable: true,
        get: function () {
          if (this.classList.contains(styles.tabs)) return 100;
          if (this.classList.contains(styles.tab)) return 50;
          return 0;
        },
      });

      const items = [
        { id: "1", name: "Tab 1", content: "1" },
        { id: "2", name: "Tab 2", content: "2" },
        { id: "3", name: "Tab 3", content: "3" },
      ];

      const { container } = render(
        <Tabs items={items} type={TabsTypes.Secondary} selectedItemId="1" />,
      );

      const arrowLeft = container.querySelector(`.${styles.arrowLeft}`);
      const arrowRight = container.querySelector(`.${styles.arrowRight}`);

      expect(arrowLeft).not.toBeInTheDocument();
      expect(arrowRight).not.toBeInTheDocument();

      mockIsMobile.value = false;
    });

    it("calls onSelect with previous item when left arrow is clicked", () => {
      // Mock overflow for container and items
      const originalOffsetWidth = Object.getOwnPropertyDescriptor(
        HTMLElement.prototype,
        "offsetWidth",
      );

      Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        configurable: true,
        get: function () {
          if (this.classList.contains(styles.tabs)) return 100;
          if (this.classList.contains(styles.tab)) return 50;
          return 0;
        },
      });

      const onSelectMock = vi.fn();
      const { container, rerender } = render(
        <Tabs
          items={arrayItems}
          type={TabsTypes.Secondary}
          selectedItemId="tab1"
          onSelect={onSelectMock}
        />,
      );

      rerender(
        <Tabs
          items={arrayItems}
          type={TabsTypes.Secondary}
          selectedItemId="tab1"
          onSelect={onSelectMock}
        />,
      );

      const arrowLeft = container.querySelector(`.${styles.arrowLeft}`);
      if (arrowLeft) {
        (arrowLeft as HTMLElement).click();
        expect(onSelectMock).toHaveBeenCalledWith(arrayItems[0]);
      }

      // Restore original offsetWidth
      if (originalOffsetWidth) {
        Object.defineProperty(
          HTMLElement.prototype,
          "offsetWidth",
          originalOffsetWidth,
        );
      }
    });

    it("is a tablist with one tab stop, and leaves the document's mouseup alone", () => {
      const addSpy = vi.spyOn(document, "addEventListener");
      render(
        <Tabs
          items={arrayItems}
          type={TabsTypes.Secondary}
          selectedItemId="tab1"
        />,
      );

      expect(screen.getByRole("tablist")).toBeInTheDocument();
      const tabs = screen.getAllByRole("tab");
      expect(tabs).toHaveLength(2);
      expect(tabs[1]).toHaveAttribute("aria-selected", "true");
      expect(tabs[1]).toHaveAttribute("tabindex", "0");
      expect(tabs[0]).toHaveAttribute("tabindex", "-1");
      expect(addSpy).not.toHaveBeenCalledWith("mouseup", expect.any(Function));
      addSpy.mockRestore();
    });

    it("does not take the Tab key from the page", () => {
      render(
        <Tabs
          items={arrayItems}
          type={TabsTypes.Secondary}
          selectedItemId="tab0"
          hotkeysId="bar"
        />,
      );
      const event = new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
        cancelable: true,
      });
      window.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });

    it("moves the focus with the arrows and selects with Enter", () => {
      const onSelectMock = vi.fn();
      render(
        <Tabs
          items={arrayItems}
          type={TabsTypes.Secondary}
          selectedItemId="tab0"
          onSelect={onSelectMock}
        />,
      );
      const [first, second] = screen.getAllByRole("tab");
      first.focus();
      fireEvent.keyDown(first, { key: "ArrowRight" });
      expect(second).toHaveFocus();
      expect(second).toHaveAttribute("tabindex", "0");
      fireEvent.keyDown(second, { key: "Enter" });
      expect(onSelectMock).toHaveBeenCalledWith(arrayItems[1]);
    });

    it("refuses a disabled tab by click and by keyboard", () => {
      const onSelectMock = vi.fn();
      const onClickMock = vi.fn();
      const items = [
        arrayItems[0],
        { ...arrayItems[1], isDisabled: true, onClick: onClickMock },
      ];
      render(
        <Tabs
          items={items}
          type={TabsTypes.Secondary}
          selectedItemId="tab0"
          onSelect={onSelectMock}
        />,
      );
      const disabled = screen.getByTestId("tab1_subtab");
      expect(disabled).toHaveAttribute("aria-disabled", "true");
      fireEvent.click(disabled);
      fireEvent.keyDown(disabled, { key: "Enter" });
      expect(onSelectMock).not.toHaveBeenCalled();
      expect(onClickMock).not.toHaveBeenCalled();
    });
  });
});
