import { describe, expect, it } from "vitest";

import { pickAriaProps } from ".";

describe("pickAriaProps", () => {
  it("keeps the aria-* attributes and nothing else", () => {
    expect(
      pickAriaProps({
        "aria-label": "Close",
        "aria-describedby": "hint",
        ariaLabel: "camel case is a prop, not an attribute",
        role: "button",
        id: "close",
        onClick: () => {},
      }),
    ).toEqual({ "aria-label": "Close", "aria-describedby": "hint" });
  });

  it("keeps an attribute passed as undefined or false", () => {
    expect(
      pickAriaProps({ "aria-hidden": false, "aria-label": undefined }),
    ).toEqual({ "aria-hidden": false, "aria-label": undefined });
  });
});
