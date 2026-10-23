import { describe, it, expect, afterEach, vi } from "vitest";

import { isInlinedSvgUrl, isSvgDataUrl } from "./iconSource";

describe("iconSource", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("tells an SVG data URL apart from any other source", () => {
    expect(isSvgDataUrl("data:image/svg+xml;base64,PHN2Zy8+")).toBe(true);
    expect(isSvgDataUrl("data:image/png;base64,iVBORw0KGgo=")).toBe(false);
    expect(isInlinedSvgUrl("data:image/svg+xml;base64,PHN2Zy8+")).toBe(false);
  });

  it("inlines a .svg on the page's own origin, relative or absolute", () => {
    expect(isInlinedSvgUrl("/static/images/icons/16/trash.react.svg")).toBe(
      true,
    );
    expect(
      isInlinedSvgUrl(`${window.location.origin}/icons/trash.svg?v=2`),
    ).toBe(true);
  });

  it("draws a .svg on any other origin as an image", () => {
    expect(isInlinedSvgUrl("https://cdn.example.com/icon.svg")).toBe(false);
    expect(isInlinedSvgUrl("//cdn.example.com/icon.svg")).toBe(false);
    expect(isInlinedSvgUrl("/\\cdn.example.com/icon.svg")).toBe(false);
    expect(
      isInlinedSvgUrl(`https://${window.location.host}@cdn.example.com/a.svg`),
    ).toBe(false);
  });

  it("draws anything that is not a .svg as an image, wherever it lives", () => {
    expect(isInlinedSvgUrl("/static/images/logo.png")).toBe(false);
    expect(isInlinedSvgUrl("/static/images/icon.svg.png")).toBe(false);
  });

  it("keeps a web plugin's own asset as an image", () => {
    expect(isInlinedSvgUrl("/static/webplugins/sample/assets/icon.svg")).toBe(
      false,
    );
  });

  it("counts a relative URL as same-origin where there is no window", () => {
    vi.stubGlobal("window", undefined);

    expect(isInlinedSvgUrl("/static/images/icon.svg")).toBe(true);
    expect(isInlinedSvgUrl("https://cdn.example.com/icon.svg")).toBe(false);
    expect(isInlinedSvgUrl("//cdn.example.com/icon.svg")).toBe(false);
    expect(isInlinedSvgUrl("/\\cdn.example.com/icon.svg")).toBe(false);
  });
});
