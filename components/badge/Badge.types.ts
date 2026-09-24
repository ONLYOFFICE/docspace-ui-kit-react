import type React from "react";

import type { TextProps } from "../text";

export type BadgeProps = TextProps & {
  /** Attached to the outer element of the badge. */
  ref?: React.RefObject<HTMLDivElement>;
  /** What the badge says. `0`, `"0"` and an empty string hide the badge entirely — the element stays in the DOM with `display: none`.
   * @default 0 */
  label?: string | number;
  /** Corner radius of both the outer element and the pill inside it. The pill ignores it while `type` is `"high"`. */
  borderRadius?: string;
  /** Padding of the pill inside the badge. Ignored while `type` is `"high"`. */
  padding?: string;
  /** Widest the pill may be. Longer text is clipped without an ellipsis. Not applied at all while `isPaidBadge` is set. */
  maxWidth?: string;
  /** Called with the event when the pointer leaves the badge. */
  onMouseLeave?: (e: React.MouseEvent) => void;
  /** Called with the event when the pointer enters the badge or moves within it. */
  onMouseOver?: (e: React.MouseEvent) => void;
  /** Drops the pointer cursor and the hover and active background shifts, for a badge that is only a marker. */
  noHover?: boolean;
  /** Switches to the emphasised preset: a 6px radius, roomier padding and 13px text at weight 400. */
  type?: "high";
  /** CSS `border` shorthand for the outer element. The badge draws none of its own. */
  border?: string;
  /** Height of the outer element. Without it the badge is as tall as its text. */
  height?: string;
  /** Lets the badge grow to its content width at tablet widths and below, where it is otherwise held to the pill's width. */
  isVersionBadge?: boolean;
  /** Paints the badge grey, overriding `backgroundColor`, for something inactive. */
  isMutedBadge?: boolean;
  /** Forces white text, overriding `color`, and removes `maxWidth` so the label is never clipped. */
  isPaidBadge?: boolean;
  /** Draws the hover background without a pointer being there, for a badge inside a row that is itself hovered. */
  isHovered?: boolean;
  /** Value of `data-testid` on the outer element.
   * @default "badge" */
  dataTestId?: string;
};
