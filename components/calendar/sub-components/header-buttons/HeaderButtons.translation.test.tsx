import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { HeaderButtons } from "./HeaderButtons";

vi.mock("../../../../utils/i18n", () => ({
  useCommonTranslation: () => (key: string) => `translated ${key}`,
}));

describe("<HeaderButtons /> translations", () => {
  it("names the arrows in the kit's translations", () => {
    render(
      <HeaderButtons
        onLeftClick={vi.fn()}
        onRightClick={vi.fn()}
        isLeftDisabled={false}
        isRightDisabled={false}
        isMobile={false}
      />,
    );

    expect(
      screen.getByRole("button", { name: "translated Previous" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "translated Next" }),
    ).toBeInTheDocument();
  });
});
