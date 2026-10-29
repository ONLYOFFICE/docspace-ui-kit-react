import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";

import { DeviceType } from "../../../enums";

import InfoPanel from "./InfoPanel";

const layout = { section: 1000, panel: 400 };

const mockLayout = (sectionWidth = 1000, panelWidth = 400) => {
  layout.section = sectionWidth;
  layout.panel = panelWidth;
  return vi
    .spyOn(HTMLElement.prototype, "getBoundingClientRect")
    .mockImplementation(function mock(this: HTMLElement) {
      const width = this.id === "section" ? layout.section : layout.panel;
      return { width, height: 800, top: 0, left: 0 } as DOMRect;
    });
};

const panel = (props: Record<string, unknown> = {}) => (
  <>
    <div id="section" />
    <InfoPanel
      isVisible
      canDisplay
      currentDeviceType={DeviceType.desktop}
      isResizable
      width={400}
      {...props}
    >
      Info
    </InfoPanel>
  </>
);

const resizer = () => screen.getByTestId("info-panel-resizer");

const panelWidth = () =>
  resizer().parentElement?.style.getPropertyValue("--info-panel-width");

const drag = (fromX: number, toX: number) => {
  fireEvent.pointerDown(resizer(), { clientX: fromX, button: 0 });
  fireEvent.pointerMove(window, { clientX: toX });
  fireEvent.pointerUp(window);
};

describe("InfoPanel resizer", () => {
  beforeEach(() => {
    mockLayout();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("applies the width the host owns", () => {
    render(panel({ width: 520 }));

    expect(panelWidth()).toBe("520px");
  });

  it("widens the panel as the pointer moves toward the section", () => {
    const onResize = vi.fn();
    render(panel({ onResize }));

    fireEvent.pointerDown(resizer(), { clientX: 800, button: 0 });
    fireEvent.pointerMove(window, { clientX: 700 });

    expect(panelWidth()).toBe("500px");
    expect(onResize).not.toHaveBeenCalled();

    fireEvent.pointerUp(window);
    expect(onResize).toHaveBeenCalledWith(500);
  });

  it("follows a finger and ignores a second one that lands meanwhile", () => {
    const onResize = vi.fn();
    render(panel({ onResize }));
    const touch = { pointerType: "touch", pointerId: 1 };

    fireEvent.pointerDown(resizer(), { ...touch, clientX: 800, button: 0 });
    fireEvent.pointerMove(window, { ...touch, clientX: 650 });
    expect(panelWidth()).toBe("550px");

    fireEvent.pointerDown(resizer(), { pointerType: "touch", pointerId: 2 });
    fireEvent.pointerMove(window, { pointerId: 2, clientX: 100 });
    fireEvent.pointerUp(window, { pointerId: 2 });
    expect(panelWidth()).toBe("550px");
    expect(onResize).not.toHaveBeenCalled();

    fireEvent.pointerUp(window, touch);
    expect(onResize).toHaveBeenCalledWith(550);
  });

  it("stays between the default width and its own cap", () => {
    const onResize = vi.fn();
    render(panel({ onResize }));

    drag(800, 1600);
    expect(panelWidth()).toBe("400px");
    expect(onResize).not.toHaveBeenCalled();

    drag(800, -1600);
    expect(onResize).toHaveBeenLastCalledWith(800);
  });

  it("saves nothing for a click on the edge", () => {
    const onResize = vi.fn();
    render(panel({ width: 520, onResize }));

    fireEvent.pointerDown(resizer(), { clientX: 800, button: 0 });
    fireEvent.pointerUp(window);
    fireEvent.pointerDown(resizer(), { clientX: 800, button: 0 });
    fireEvent.pointerUp(window);
    fireEvent.doubleClick(resizer());

    expect(onResize).toHaveBeenCalledTimes(1);
    expect(onResize).toHaveBeenCalledWith(400);
  });

  it("measures its own width without the border", () => {
    vi.restoreAllMocks();
    mockLayout(1000, 401);
    vi.spyOn(window, "getComputedStyle").mockReturnValue({
      direction: "ltr",
      boxSizing: "content-box",
      borderLeftWidth: "1px",
      borderRightWidth: "0px",
      paddingLeft: "0px",
      paddingRight: "0px",
    } as CSSStyleDeclaration);
    const onResize = vi.fn();
    render(panel({ onResize }));

    drag(800, 700);

    expect(onResize).toHaveBeenCalledWith(500);
  });

  it("reports the width of a drag as it goes", () => {
    const onLiveResize = vi.fn();
    render(panel({ onLiveResize }));

    fireEvent.pointerDown(resizer(), { clientX: 800, button: 0 });
    fireEvent.pointerMove(window, { clientX: 750 });
    fireEvent.pointerMove(window, { clientX: 700 });
    fireEvent.pointerUp(window);

    expect(onLiveResize.mock.calls).toEqual([[450], [500]]);
  });

  it("grows only into the slack the section can give up", () => {
    vi.restoreAllMocks();
    mockLayout(600, 400);
    const onResize = vi.fn();
    render(panel({ onResize }));

    drag(800, -1600);

    expect(onResize).toHaveBeenCalledWith(584);
  });

  it("restores the default width on a double click", () => {
    const onResize = vi.fn();
    render(panel({ width: 650, onResize }));

    fireEvent.doubleClick(resizer());

    expect(onResize).toHaveBeenCalledWith(400);
    expect(panelWidth()).toBe("400px");
  });

  it("narrows to fit the window without saving it, and widens back", async () => {
    vi.restoreAllMocks();
    mockLayout(300, 700);
    const onResize = vi.fn();
    const onShownWidthChange = vi.fn();
    render(panel({ width: 700, onResize, onShownWidthChange }));

    await vi.waitFor(() => expect(panelWidth()).toBe("584px"));
    expect(onShownWidthChange).toHaveBeenLastCalledWith(584);

    vi.restoreAllMocks();
    mockLayout(100, 584);
    fireEvent(window, new Event("resize"));
    await vi.waitFor(() => expect(panelWidth()).toBe("400px"));

    vi.restoreAllMocks();
    mockLayout(1000, 400);
    fireEvent(window, new Event("resize"));
    await vi.waitFor(() => expect(panelWidth()).toBe("700px"));

    expect(onShownWidthChange).toHaveBeenLastCalledWith(700);
    expect(onResize).not.toHaveBeenCalled();
  });

  it("starts watching the row once a hidden panel is shown", async () => {
    vi.restoreAllMocks();
    mockLayout(300, 700);
    const onShownWidthChange = vi.fn();
    const { rerender } = render(
      panel({ isVisible: false, width: 700, onShownWidthChange }),
    );
    expect(onShownWidthChange).toHaveBeenLastCalledWith(undefined);

    rerender(panel({ width: 700, onShownWidthChange }));

    await vi.waitFor(() =>
      expect(onShownWidthChange).toHaveBeenLastCalledWith(584),
    );
  });

  it("gives back a shared row's deficit once when two panels sit in it", async () => {
    vi.restoreAllMocks();
    const row = 1350;
    const ownWidth = (el: HTMLElement) =>
      parseFloat(el.style.getPropertyValue("--info-panel-width")) || 0;
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function mock(this: HTMLElement) {
        const panels = screen
          .getAllByTestId("info-panel-resizer")
          .map((handle) => handle.parentElement as HTMLElement);
        const width =
          this.id === "section"
            ? row - panels.reduce((sum, p) => sum + ownWidth(p), 0)
            : ownWidth(this);
        return { width, height: 800, top: 0, left: 0 } as DOMRect;
      },
    );
    const first = vi.fn();
    const second = vi.fn();

    render(
      <>
        <div id="section" />
        <InfoPanel
          isVisible
          canDisplay
          currentDeviceType={DeviceType.desktop}
          isResizable
          width={500}
          onResize={first}
        >
          First
        </InfoPanel>
        <InfoPanel
          isVisible
          canDisplay
          currentDeviceType={DeviceType.desktop}
          isResizable
          width={500}
          onResize={second}
        >
          Second
        </InfoPanel>
      </>,
    );

    const [firstPanel, secondPanel] = screen
      .getAllByTestId("info-panel-resizer")
      .map((handle) => handle.parentElement as HTMLElement);
    const width = (el: HTMLElement) =>
      el.style.getPropertyValue("--info-panel-width");

    await vi.waitFor(() => expect(width(firstPanel)).toBe("434px"));
    expect(width(secondPanel)).toBe("500px");
    expect(first).not.toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled();
  });

  it("is not rendered on mobile or when the host disables it", () => {
    const { rerender } = render(
      panel({ currentDeviceType: DeviceType.mobile }),
    );
    expect(screen.queryByTestId("info-panel-resizer")).toBeNull();

    rerender(panel({ isResizable: false }));
    expect(screen.queryByTestId("info-panel-resizer")).toBeNull();
  });
});
