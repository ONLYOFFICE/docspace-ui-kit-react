import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import NavigationLogo from "./LogoBlock";

describe("<NavigationLogo />", () => {
  it("names the logo by the product and hides the burger", () => {
    const { container } = render(
      <NavigationLogo logo="logo.svg" burgerLogo="burger.svg" className="" />,
    );

    expect(
      screen.getByRole("img", { name: "ONLYOFFICE Apps" }),
    ).toHaveAttribute("src", "logo.svg");
    expect(container.querySelector('img[src="burger.svg"]')).toHaveAttribute(
      "alt",
      "",
    );
  });
});
