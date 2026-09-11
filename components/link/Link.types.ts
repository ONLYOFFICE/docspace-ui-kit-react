import type { LinkTarget, LinkType } from "./Link.enums";
import type { TextProps } from "../text";

export type LinkProps = TextProps & {
  /** Used as HTML `href` property */
  href?: string;
  /** Accepts id */
  id?: string;
  /** Sets font weight */
  isBold?: boolean;
  /** Sets hovered state and link effects */
  isHovered?: boolean;
  /** Sets the 'opacity' css-property to 0.5. Usually applied for the users with "pending" status */
  isSemitransparent?: boolean;
  /** Activates or deactivates _text-overflow_ CSS property with ellipsis (' ... ') value */
  isTextOverflow?: boolean;
  /** Disables hover effect */
  noHover?: boolean;
  /** Enables user selection */
  enableUserSelect?: boolean;
  /** Sets the link type */
  type?: LinkType;
  /** Sets the target attribute */
  target?: LinkTarget;
  /** Label */
  label?: string;
  /** Sets the text decoration style */
  textDecoration?:
    | "none"
    | "underline"
    | "line-through"
    | "overline"
    | "underline dotted"
    | "underline dashed";
  /** Accessibility label for the link */
  ariaLabel?: string;
  /** Data attribute for testing */
  dataTestId?: string;
  /** Sets a callback function that is triggered when the link is clicked. Only for 'action' type of link */
  onClick?: (e: React.MouseEvent<Element>) => void;
  /** Sets a callback function that is triggered on a key press. An action link
   * carries no href, so it is not activated by Enter on its own - a link that
   * has to work from the keyboard handles the key here and takes a tabIndex. */
  onKeyDown?: (e: React.KeyboardEvent<Element>) => void;
  /** ARIA role. An anchor with no href has no implicit role at all, so an
   * action link is invisible to assistive technology until it is named one -
   * "button", since it acts rather than navigates. */
  role?: React.AriaRole;
  /** Used as HTML `rel` property */
  rel?: string;
  /** Used as HTML `tabindex` property */
  tabIndex?: number;
  /** Used as HTML `title` property */
  title?: string;
  /** CSS color or accent theme color */
  color?: "accent" | (string & {});
};
