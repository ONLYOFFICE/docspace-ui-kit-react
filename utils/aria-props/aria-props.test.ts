import { describe, expect, it } from "vitest";

import { groupRoleWhenNamed, omitAriaProps, pickAriaProps } from ".";

describe("groupRoleWhenNamed", () => {
  it("is a group when a label or a labelledby names the element", () => {
    expect(groupRoleWhenNamed({ "aria-label": "Files" })).toBe("group");
    expect(groupRoleWhenNamed({ "aria-labelledby": "title" })).toBe("group");
  });

  it("gives no role without a name", () => {
    expect(groupRoleWhenNamed({})).toBeUndefined();
    expect(groupRoleWhenNamed({ "aria-label": "" })).toBeUndefined();
    expect(
      groupRoleWhenNamed({ "aria-describedby": "hint", ariaLabel: "Files" }),
    ).toBeUndefined();
  });
});

describe("omitAriaProps", () => {
  it("keeps everything but the aria-* attributes", () => {
    const onClick = () => {};
    expect(
      omitAriaProps({ "aria-label": "Close", ariaLabel: "Close", onClick }),
    ).toEqual({ ariaLabel: "Close", onClick });
  });
});

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
