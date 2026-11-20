import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { DeviceType } from "../../../enums";
import ArticleHeader from "./Header";

const renderHeader = (
  currentDeviceType: DeviceType,
  onLogoClickAction = vi.fn(),
) =>
  render(
    <ArticleHeader
      showText
      currentDeviceType={currentDeviceType}
      isBurgerLoading={false}
      withCustomArticleHeader={false}
      showBackButton={false}
      onIconClick={vi.fn()}
      onLogoClickAction={onLogoClickAction}
      navigate={vi.fn()}
    >
      {null}
    </ArticleHeader>,
  );

describe("<ArticleHeader />", () => {
  it("names both tablet logo links by the product", () => {
    const { container } = renderHeader(DeviceType.tablet);

    const links = screen.getAllByRole("link", { name: "ONLYOFFICE Apps" });
    expect(links).toHaveLength(2);
    expect(container.querySelector(".burger-logo")).toBe(links[0]);
    expect(container.querySelector(".burger-logo")).toHaveAttribute("alt", "");
  });

  it("follows the logo link with Enter, not Space", () => {
    const onLogoClickAction = vi.fn();
    renderHeader(DeviceType.desktop, onLogoClickAction);

    const logo = screen.getByRole("link", { name: "ONLYOFFICE Apps" });
    expect(logo).toHaveAttribute("tabindex", "0");

    fireEvent.keyDown(logo, { key: " " });
    expect(onLogoClickAction).not.toHaveBeenCalled();

    fireEvent.keyDown(logo, { key: "Enter" });
    expect(onLogoClickAction).toHaveBeenCalledTimes(1);
  });
});
