import type { LinkTarget, LinkType } from "./Link.enums";
import type { TextProps } from "../text";

export type LinkProps = TextProps & {
  /** Address the link navigates to. Without it the anchor is a link only when
   * it has an `onClick`. */
  href?: string;
  /** `id` of the anchor. */
  id?: string;
  /** Renders the label at weight 700.
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
  /** `page` for navigation, `action` for a link that runs code. With an
   * `onClick` and no `href`, an action link is a keyboard button by itself.
   * `role`, `onKeyDown` or a negative `tabIndex` leave the keyboard to you.
   * @default LinkType.page */
  type?: LinkType;
  /** Where the address opens, such as `_blank` for a new tab. */
  target?: LinkTarget;
  /** Line drawn under the label at rest, over the stylesheet's `none`. */
  textDecoration?:
    | "none"
    | "underline"
    | "line-through"
    | "overline"
    | "underline dotted"
    | "underline dashed";
  /** Value of `aria-label`. Without it a string `children` is used, so the
   * visible text is the name; a node child sets none. */
  ariaLabel?: string;
  /** Value of `data-testid` on the anchor.
   * @default "link" */
  dataTestId?: string;
  /** Called on a click. Without `href` it is also called on Enter, and on Space
   * for an action link. */
  onClick?: (e: React.MouseEvent<Element>) => void;

  /** ARIA role. Without `href`, a link with an `onClick` takes one by itself;
   * a role passed here leaves the keyboard to you. */
  role?: React.AriaRole;
  /** Relation to the target page, such as `noopener noreferrer` for a new tab. */
  rel?: string;
  /** Position in the tab order. `-1` keeps a link with no `href` out of the
   * keyboard's reach. */
  tabIndex?: number;
  /** Tooltip text. Consumed by the `withTooltip` wrapper the folder exports, so
   * it becomes the tooltip's content and never reaches the DOM as a `title`
   * attribute. */
  title?: string;
  /** Any CSS colour, or the literal `"accent"`, which resolves to the theme's
   * `--accent-main`. */
  color?: "accent" | (string & {});
};
