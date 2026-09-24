import type { LinkTarget, LinkType } from "./Link.enums";
import type { TextProps } from "../text";

export type LinkProps = TextProps & {
  /** Used as HTML `href` property */
  href?: string;
  /** Accepts id */
  id?: string;
  /** Renders the label at weight 600.
   * @default false */
  isBold?: boolean;
  /** Paints the link as if the pointer were over it, for a row that highlights
   * its link on hover of the whole row.
   * @default false */
  isHovered?: boolean;
  /** Halves the opacity, the kit's convention for a pending or inactive entity.
   * @default false */
  isSemitransparent?: boolean;
  /** Constrains the link to the width of its container
   * (`display: inline-block; max-width: 100%`). It does **not** add the
   * ellipsis by itself — that comes from `truncate`, inherited from `Text`.
   * Set both to clip a long label.
   * @default false */
  isTextOverflow?: boolean;
  /** Removes the underline the link grows on hover.
   * @default false */
  noHover?: boolean;
  /** Whether the label can be selected with the mouse.
   * @default true */
  enableUserSelect?: boolean;
  /** `page` for navigation, `action` for a link that runs code. An action link
   * carries no `href`, which has consequences for the keyboard — see `role` and
   * `onKeyDown`.
   * @default LinkType.page */
  type?: LinkType;
  /** Sets the target attribute */
  target?: LinkTarget;
  /** Ignored. The component reads its text from `children`; this prop is
   * spread onto the anchor as an unknown attribute and does nothing. */
  label?: string;
  /** Sets the text decoration style */
  textDecoration?:
    | "none"
    | "underline"
    | "line-through"
    | "overline"
    | "underline dotted"
    | "underline dashed";
  /** Value of `aria-label`. When it is absent the component passes `children`
   * instead, which is the visible text for a string child and an object for a
   * node. */
  ariaLabel?: string;
  /** Value of `data-testid` on the anchor.
   * @default "link" */
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
  /** Tooltip text. Consumed by the `withTooltip` wrapper the folder exports, so
   * it becomes the tooltip's content and never reaches the DOM as a `title`
   * attribute. */
  title?: string;
  /** Any CSS colour, or the literal `"accent"`, which resolves to the theme's
   * `--accent-main`. */
  color?: "accent" | (string & {});
};
