import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, render, waitFor, fireEvent } from "@testing-library/react";

import { DeviceType } from "../../enums";

import Section from "./index";
import SectionBody from "./sub-components/SectionBody";
import SectionFilter from "./sub-components/SectionFilter";
import SectionFooter from "./sub-components/SectionFooter";
import SectionHeader from "./sub-components/SectionHeader";
import SectionWarning from "./sub-components/SectionWarning";
import SectionSubmenu from "./sub-components/SectionSubmenu";

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}

  unobserve() {}

  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

describe("<Section />", () => {
  const defaultProps = {
    withBodyScroll: true,
    isHeaderVisible: true,
    isInfoPanelAvailable: false,
    settingsStudio: false,
    isEmptyPage: false,
    maintenanceExist: false,
    snackbarExist: false,
    showText: true,
    secondaryActiveOperations: [],
    primaryOperationsArray: [],
    clearSecondaryProgressData: () => {},
    clearPrimaryProgressData: () => {},
  };

  it("renders all section components correctly", () => {
    render(
      <Section {...defaultProps}>
        <SectionHeader className="header-class">Header Content</SectionHeader>
        <SectionFilter>Filter Content</SectionFilter>
        <SectionBody withScroll autoFocus={false} settingsStudio={false}>
          Body Content
        </SectionBody>
        <SectionFooter>Footer Content</SectionFooter>
        <SectionWarning>Warning Content</SectionWarning>
        <SectionSubmenu>Submenu Content</SectionSubmenu>
      </Section>,
    );

    expect(screen.getByText("Header Content")).toBeInTheDocument();
    expect(screen.getByText("Filter Content")).toBeInTheDocument();
    expect(screen.getByText("Body Content")).toBeInTheDocument();
    expect(screen.getByText("Footer Content")).toBeInTheDocument();
    expect(screen.getByText("Warning Content")).toBeInTheDocument();
    expect(screen.getByText("Submenu Content")).toBeInTheDocument();
  });

  describe("the width the floating corner moves clear of", () => {
    const renderWithInfoPanel = (props: Record<string, unknown>) =>
      render(
        <Section
          {...defaultProps}
          currentDeviceType={DeviceType.desktop}
          isInfoPanelAvailable
          canDisplay
          isInfoPanelVisible
          isInfoPanelResizable
          {...props}
        >
          <SectionBody withScroll autoFocus={false} settingsStudio={false}>
            Body Content
          </SectionBody>
        </Section>,
      );

    afterEach(() => {
      vi.restoreAllMocks();
    });

    const progressOffset = () =>
      document
        .getElementById("section")
        ?.style.getPropertyValue("--operations-progress-info-panel-width");

    it("reports the info panel's width on a desktop, narrowed to fit the window", async () => {
      vi.spyOn(
        HTMLElement.prototype,
        "getBoundingClientRect",
      ).mockImplementation(function mock(this: HTMLElement) {
        const width = this.id === "section" ? 300 : 700;
        return { width, height: 800, top: 0, left: 0 } as DOMRect;
      });
      const onShownInfoPanelWidthChange = vi.fn();

      renderWithInfoPanel({ infoPanelWidth: 700, onShownInfoPanelWidthChange });

      await waitFor(() =>
        expect(onShownInfoPanelWidthChange).toHaveBeenLastCalledWith(584),
      );
      expect(progressOffset()).toBe("584px");
    });

    it("reports the host's width at once, not a default before the panel measures", async () => {
      vi.spyOn(
        HTMLElement.prototype,
        "getBoundingClientRect",
      ).mockImplementation(function mock(this: HTMLElement) {
        const width = this.id === "section" ? 1000 : 720;
        return { width, height: 800, top: 0, left: 0 } as DOMRect;
      });
      const onShownInfoPanelWidthChange = vi.fn();

      renderWithInfoPanel({ infoPanelWidth: 720, onShownInfoPanelWidthChange });
      await waitFor(() => expect(progressOffset()).toBe("720px"));

      expect(onShownInfoPanelWidthChange.mock.calls).toEqual([[720]]);
    });

    it("moves the progress button and reports the width during a drag", async () => {
      vi.spyOn(
        HTMLElement.prototype,
        "getBoundingClientRect",
      ).mockImplementation(function mock(this: HTMLElement) {
        const width = this.id === "section" ? 1000 : 400;
        return { width, height: 800, top: 0, left: 0 } as DOMRect;
      });
      const onShownInfoPanelWidthChange = vi.fn();
      renderWithInfoPanel({ infoPanelWidth: 400, onShownInfoPanelWidthChange });
      await waitFor(() => expect(progressOffset()).toBe("400px"));

      fireEvent.pointerDown(screen.getByTestId("info-panel-resizer"), {
        clientX: 800,
        button: 0,
      });
      fireEvent.pointerMove(window, { clientX: 650 });

      expect(progressOffset()).toBe("550px");
      await waitFor(() =>
        expect(onShownInfoPanelWidthChange).toHaveBeenLastCalledWith(550),
      );

      fireEvent.pointerUp(window);
    });

    it("counts the info panel at its default width below a desktop", () => {
      const onShownInfoPanelWidthChange = vi.fn();

      renderWithInfoPanel({
        currentDeviceType: DeviceType.tablet,
        infoPanelWidth: 651,
        onShownInfoPanelWidthChange,
      });

      expect(onShownInfoPanelWidthChange).toHaveBeenLastCalledWith(400);
    });

    it("reports 0 once the section goes away", () => {
      const onShownInfoPanelWidthChange = vi.fn();
      const { unmount } = renderWithInfoPanel({
        infoPanelWidth: 600,
        onShownInfoPanelWidthChange,
      });

      unmount();

      expect(onShownInfoPanelWidthChange).toHaveBeenLastCalledWith(0);
    });
  });
});
