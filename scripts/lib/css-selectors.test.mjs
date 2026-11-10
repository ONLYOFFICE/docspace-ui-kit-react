import { describe, expect, it } from "vitest";

import { findSlowSelectors, stripComments } from "./css-selectors.mjs";

const lines = (source) => findSlowSelectors(source).map(({ line }) => line);

describe("findSlowSelectors", () => {
  it("finds an attribute selector on class or style, whatever the operator", () => {
    expect(
      lines(
        [
          '.a [class*="buttonsContainer"] {}',
          ".a [class^=icon] {}",
          ".a [ class = 'x' ] {}",
          '.a:has([style*="display: none"]) {}',
          ".a [class~=x] {}",
        ].join("\n"),
      ),
    ).toEqual([1, 2, 3, 4, 5]);
  });

  it("leaves other attributes alone", () => {
    expect(
      lines(
        [
          '.a [data-class*="x"] {}',
          '.a [classname="x"] {}',
          ".a [data-row-focus] {}",
          '.a [aria-expanded="true"] {}',
          ".a.isActive {}",
        ].join("\n"),
      ),
    ).toEqual([]);
  });

  it("ignores comments that name the selector, and keeps line numbers", () => {
    const source = [
      "// never [class*=…]: it restyles every element",
      "/* nor",
      '   [style*="display"] */',
      '.a [class*="x"] {}',
    ].join("\n");

    expect(lines(source)).toEqual([4]);
  });

  it("keeps a URL that looks like a line comment", () => {
    expect(stripComments("a { background: url(https://x/y.svg); }")).toBe(
      "a { background: url(https://x/y.svg); }",
    );
  });
});
