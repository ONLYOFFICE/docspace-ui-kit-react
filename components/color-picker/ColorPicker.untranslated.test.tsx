import { describe, it, expect, vi } from "vitest";
import { screen, render } from "@testing-library/react";

import { globalColors } from "../../providers/theme";
import { ColorPicker } from "./ColorPicker";
import { ColorInput } from "../color-input/ColorInput";

// Before the Common bundle has loaded, and with no translations at all, the
// translation of every key is "".
vi.mock("../../utils", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../utils")>()),
  useCommonTranslation: () => () => "",
}));

describe("color controls without translations", () => {
  it("keeps the English names of the picker's buttons", () => {
    render(
      <ColorPicker
        isPickerOnly={false}
        appliedColor={globalColors.lightBlueMain}
      />,
    );

    expect(screen.getByTestId("color-picker-apply")).toHaveTextContent("Apply");
    expect(screen.getByTestId("color-picker-cancel")).toHaveTextContent(
      "Cancel",
    );
  });

  it("keeps the English name of the hex field", () => {
    render(<ColorInput />);

    expect(screen.getByRole("textbox")).toHaveAttribute("aria-label", "Color");
  });
});
