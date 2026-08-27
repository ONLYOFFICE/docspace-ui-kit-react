import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";

import { DeviceType } from "../../../enums";

import ChatPanel from "./ChatPanel";

// jsdom has no layout, so the resizer's measurements have to be stubbed: the
// panel starts at 400px and the section has 1000px, i.e. 584px of slack above
// its 416px minimum.
// Mutable so a test can change the layout mid-scenario (a window resize while a
// drag is in flight).
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

const nextFrames = () =>
  new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve(null)));
  });

const renderPanel = (props: Record<string, unknown> = {}) =>
  render(
    <>
      <div id="section" />
      <ChatPanel
        isVisible
        currentDeviceType={DeviceType.desktop}
        isResizable
        width={400}
        {...props}
      >
        Chat
      </ChatPanel>
    </>,
  );

describe("ChatPanel resizer", () => {
  beforeEach(() => {
    mockLayout();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("applies the width the host owns", () => {
    renderPanel({ width: 520 });

    expect(document.getElementById("ChatPanelWrapper")?.style.getPropertyValue("--chat-panel-width")).toBe("520px");
  });

  it("widens the panel as the pointer moves toward the section", () => {
    const onResize = vi.fn();
    renderPanel({ onResize });

    fireEvent.mouseDown(screen.getByTestId("chat-panel-resizer"), {
      clientX: 800,
      button: 0,
    });
    fireEvent.mouseMove(window, { clientX: 700 });

    // Applied straight to the DOM while dragging, committed once on mouse up.
    const panel = document.getElementById("ChatPanelWrapper");
    expect(panel?.style.getPropertyValue("--chat-panel-width")).toBe("500px");
    expect(onResize).not.toHaveBeenCalled();

    fireEvent.mouseUp(window);
    expect(onResize).toHaveBeenCalledWith(500);
  });

  it("clamps to the minimum width and to the slack the section can give up", () => {
    const onResize = vi.fn();
    renderPanel({ onResize });
    const resizer = screen.getByTestId("chat-panel-resizer");

    fireEvent.mouseDown(resizer, { clientX: 800, button: 0 });
    fireEvent.mouseMove(window, { clientX: 1600 });
    fireEvent.mouseUp(window);
    expect(onResize).toHaveBeenLastCalledWith(360);

    fireEvent.mouseDown(resizer, { clientX: 800, button: 0 });
    fireEvent.mouseMove(window, { clientX: -1600 });
    fireEvent.mouseUp(window);
    expect(onResize).toHaveBeenLastCalledWith(984);
  });

  it("hands width back when the row shrinks below the section minimum", async () => {
    // The section is 300px — 116px short of its 416px minimum — so a panel the
    // user had dragged out to 900px has to give that much back.
    vi.restoreAllMocks();
    mockLayout(300, 900);
    const onResize = vi.fn();
    renderPanel({ width: 900, onResize });

    await vi.waitFor(() => expect(onResize).toHaveBeenCalledWith(784));
  });

  it("never gives back more than the panel's own minimum", async () => {
    vi.restoreAllMocks();
    mockLayout(0, 400);
    const onResize = vi.fn();
    renderPanel({ width: 400, onResize });

    await vi.waitFor(() => expect(onResize).toHaveBeenCalledWith(360));
  });

  it("leaves an in-flight drag alone when the row reflows under it", async () => {
    // Regression: the clamp used to fire mid-drag off the last committed width,
    // so dragging past the maximum snapped the panel back to a narrow size
    // instead of just stopping at the bound.
    const onResize = vi.fn();
    renderPanel({ width: 400, onResize });
    await nextFrames();
    onResize.mockClear();

    fireEvent.mouseDown(screen.getByTestId("chat-panel-resizer"), {
      clientX: 800,
      button: 0,
    });
    // The drag consumed the section's slack; a reflow now reports it as short.
    layout.section = 300;
    fireEvent(window, new Event("resize"));
    await nextFrames();

    expect(onResize).not.toHaveBeenCalled();

    fireEvent.mouseUp(window);
  });

  it("is not rendered on mobile or when the host disables it", () => {
    const { rerender } = renderPanel({ currentDeviceType: DeviceType.mobile });
    expect(screen.queryByTestId("chat-panel-resizer")).toBeNull();

    rerender(
      <>
        <div id="section" />
        <ChatPanel
          isVisible
          currentDeviceType={DeviceType.desktop}
          isResizable={false}
          width={400}
        >
          Chat
        </ChatPanel>
      </>,
    );
    expect(screen.queryByTestId("chat-panel-resizer")).toBeNull();
    expect(
      document.getElementById("ChatPanelWrapper")?.style.getPropertyValue("--chat-panel-width"),
    ).toBe("");
  });
});
