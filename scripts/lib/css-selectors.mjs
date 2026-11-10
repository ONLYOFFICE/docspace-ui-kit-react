/**
 * Finds the selectors that make the browser restyle far more than they style:
 * an attribute selector on `class` or `style`. `.claude/rules/css-selectors.md`
 * says why; scripts/check-css-selectors.mjs runs this over the repository.
 */

/**
 * `[class*="x"]`, `[class^=x]`, `[class="x"]`, `[style*="display: none"]` -- any
 * operator, any quoting, any space. `[data-class*=…]` and `[classname=…]` are
 * other attributes and do not match.
 */
export const SLOW_SELECTOR = /\[\s*(?:class|style)\s*[~|^$*]?=/;

/**
 * The source with its comments blanked, keeping every newline, so that a line
 * number still points at the same line. A comment may name the selector it
 * warns against, as the rule asks it to. `//` after a colon is a URL
 * (`url(https://…)`), not a comment.
 */
export const stripComments = (source) =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/.*$/gm, "$1");

/** Each line holding a slow selector, 1-based, with its text trimmed. */
export const findSlowSelectors = (source) =>
  stripComments(source)
    .split("\n")
    .map((text, index) => ({ line: index + 1, text: text.trim() }))
    .filter(({ text }) => SLOW_SELECTOR.test(text));
