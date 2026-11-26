import type React from "react";

/**
 * The `aria-*` attributes among `props`, and nothing else. A component spreads
 * them onto the element that carries its role, so a passed name or
 * description reaches that element without the rest of the props reaching the
 * DOM.
 */
export const pickAriaProps = (props: object): React.AriaAttributes => {
  const aria: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith("aria-")) aria[key] = value;
  }
  return aria as React.AriaAttributes;
};

/**
 * `"group"` when `props` name the element (`aria-label` or `aria-labelledby`),
 * otherwise `undefined`. For an element with no role of its own: a screen
 * reader ignores a name on a plain `div`, and reads it on a group.
 */
export const groupRoleWhenNamed = (props: object): "group" | undefined => {
  const aria = props as React.AriaAttributes;
  return aria["aria-label"] || aria["aria-labelledby"] ? "group" : undefined;
};

/**
 * Everything in `props` but the `aria-*` attributes, for the parts of a
 * component that must not repeat the name or state its role element carries.
 */
export const omitAriaProps = <T extends object>(
  props: T,
): Omit<T, keyof React.AriaAttributes> => {
  const others: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (!key.startsWith("aria-")) others[key] = value;
  }
  return others as Omit<T, keyof React.AriaAttributes>;
};
