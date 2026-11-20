import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { DeviceType } from "../../../enums";
import ArticleHeader from "./Header";

describe("<ArticleHeader />", () => {
  it("names the logo by the product and hides the burger", () => {
    const { container } = render(
      <ArticleHeader
        showText
        currentDeviceType={DeviceType.tablet}
        isBurgerLoading={false}
        withCustomArticleHeader={false}
        showBackButton={false}
        onIconClick={vi.fn()}
      >
        {null}
      </ArticleHeader>,
    );

    expect(screen.getByRole("img", { name: "ONLYOFFICE Apps" })).toBeVisible();
    expect(container.querySelector(".burger-logo")).toHaveAttribute("alt", "");
  });
});
