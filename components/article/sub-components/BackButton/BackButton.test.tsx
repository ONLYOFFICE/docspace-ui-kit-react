import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { DeviceType } from "../../../../enums";
import { BackButton } from "./index";

vi.mock("../../../../assets/arrow-left.react.svg", () => ({
  __esModule: true,
  default: () => <svg data-testid="desktop-arrow" />,
}));

vi.mock("../../../../assets/arrow-left.long.react.svg", () => ({
  __esModule: true,
  default: () => <svg data-testid="tablet-arrow" />,
}));

vi.mock("../../../../utils", () => ({
  __esModule: true,
  getCommonTranslation: vi.fn((key: string) => key),
}));

const mockLocation = () => {
  const setHref = vi.fn();

  Object.defineProperty(window, "location", {
    configurable: true,
    value: {
      get href() {
        return "http://example.com";
      },
      set href(value: string) {
        setHref(value);
      },
    },
  });

  return { setHref };
};

describe("BackButton", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  it("renders loader when in loading state", () => {
    render(
      <BackButton showText currentDeviceType={DeviceType.desktop} isLoading />,
    );

    expect(screen.getByTestId("article-header-loader")).toBeInTheDocument();
  });

  it("shows text when showText is true", () => {
    render(<BackButton showText currentDeviceType={DeviceType.desktop} />);

    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("hides text when showText is false", () => {
    render(
      <BackButton showText={false} currentDeviceType={DeviceType.desktop} />,
    );

    expect(screen.queryByText("Back")).not.toBeInTheDocument();
  });

  it("uses tablet arrow icon for non-desktop devices", () => {
    render(<BackButton showText currentDeviceType={DeviceType.tablet} />);

    expect(screen.getByTestId("tablet-arrow")).toBeInTheDocument();
  });

  it("calls onLogoClickAction and navigates on click", () => {
    const onLogoClickAction = vi.fn();
    const { setHref } = mockLocation();

    render(
      <BackButton
        showText
        currentDeviceType={DeviceType.desktop}
        onLogoClickAction={onLogoClickAction}
      />,
    );

    fireEvent.click(screen.getByText("Back").closest("div") as Element);

    expect(onLogoClickAction).toHaveBeenCalledTimes(1);
    expect(setHref).toHaveBeenCalledWith("/");
  });

  it("toggles article and navigates on mobile click", () => {
    const toggleArticleOpen = vi.fn();
    const onLogoClickAction = vi.fn();
    const { setHref } = mockLocation();

    render(
      <BackButton
        showText
        currentDeviceType={DeviceType.mobile}
        onLogoClickAction={onLogoClickAction}
        toggleArticleOpen={toggleArticleOpen}
      />,
    );

    fireEvent.click(screen.getByText("Back").closest("div") as Element);

    expect(onLogoClickAction).toHaveBeenCalledTimes(1);
    expect(toggleArticleOpen).toHaveBeenCalledTimes(1);
    expect(setHref).toHaveBeenCalledWith("/");
  });
});
