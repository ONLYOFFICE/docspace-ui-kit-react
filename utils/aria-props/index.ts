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
