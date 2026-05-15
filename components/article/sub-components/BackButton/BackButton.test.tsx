import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
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
  useCommonTranslation: () => (key: string) => key,
}));

describe("BackButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loader when in loading state", () => {
    render(
      <BackButton
        showText
        currentDeviceType={DeviceType.desktop}
        isLoading
        navigate={vi.fn()}
      />,
    );

    expect(screen.getByTestId("article-header-loader")).toBeInTheDocument();
  });

  it("shows text when showText is true", () => {
    render(
      <BackButton
        showText
        currentDeviceType={DeviceType.desktop}
        navigate={vi.fn()}
      />,
    );

    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("hides text when showText is false", () => {
    render(
      <BackButton
        showText={false}
        currentDeviceType={DeviceType.desktop}
        navigate={vi.fn()}
      />,
    );

    expect(screen.queryByText("Back")).not.toBeInTheDocument();
  });

  it("renders an icon button for non-desktop devices", () => {
    render(
      <BackButton
        showText
        currentDeviceType={DeviceType.tablet}
        navigate={vi.fn()}
      />,
    );

    // All SVGs are aliased to the same mock in the test environment, so we
    // verify that the icon button is rendered rather than checking the specific SVG.
    expect(screen.getByTestId("icon-button")).toBeInTheDocument();
  });

  it("uses tablet arrow icon for non-desktop devices", () => {
    const { container } = render(
      <BackButton
        showText
        currentDeviceType={DeviceType.tablet}
        navigate={vi.fn()}
      />,
    );

    const backButton = container.querySelector("[data-arrow-type='tablet']");

    expect(backButton).toBeInTheDocument();
  });

  it("calls onLogoClickAction and navigates on click", () => {
    const onLogoClickAction = vi.fn();
    const navigate = vi.fn();

    render(
      <BackButton
        showText
        currentDeviceType={DeviceType.desktop}
        onLogoClickAction={onLogoClickAction}
        navigate={navigate}
      />,
    );

    fireEvent.click(screen.getByText("Back").closest("div") as Element);

    expect(onLogoClickAction).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith("/");
  });

  it("toggles article and navigates on mobile click", () => {
    const toggleArticleOpen = vi.fn();
    const onLogoClickAction = vi.fn();
    const navigate = vi.fn();

    render(
      <BackButton
        showText
        currentDeviceType={DeviceType.mobile}
        onLogoClickAction={onLogoClickAction}
        toggleArticleOpen={toggleArticleOpen}
        navigate={navigate}
      />,
    );

    fireEvent.click(screen.getByText("Back").closest("div") as Element);

    expect(onLogoClickAction).toHaveBeenCalledTimes(1);
    expect(toggleArticleOpen).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith("/");
  });
});

