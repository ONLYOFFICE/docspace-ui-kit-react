/**
 * @vitest-environment node
 */

import { describe, expect, it } from "vitest";

import { checkIsSSR, isDesktop } from ".";

describe("device utilities - SSR environment", () => {
  it("checkIsSSR returns true in node environment", () => {
    expect(checkIsSSR()).toBe(true);
  });

  it("isDesktop returns false in SSR environment", () => {
    expect(isDesktop()).toBe(false);
  });
});
