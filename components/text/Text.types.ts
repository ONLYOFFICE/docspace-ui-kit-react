export type TextProps = {
  /** Attached to the rendered element, whatever `as` made it. Typed for a div whatever that element actually is. */
  ref?: React.RefObject<HTMLDivElement | null>;
  /** Element to render, replacing the component's own default — `p` for `Text` itself. Wins over `tag` when both are set. */
  as?: React.ElementType;
  /** Element to render, used only while `as` is unset. It is a tag name, not an id. */
  tag?: string;
  /** Background colour, as an inline style. Any CSS colour. */
  backgroundColor?: string;
  /** Text colour, as an inline style. `Text` declares none of its own and inherits without it. */
  color?: string;
  /** Ignored. Nothing reads this prop, and it reaches the DOM as an unknown attribute. Use `isInline` or `style`. */
  display?: string;
  /** Font size, as an inline style. Unset, `Text` is 13px through `--text-size`. */
  fontSize?: string;
  /** Font weight, as an inline style. Ignored while `isBold` is set. Unset, `Text` is 400 through `--text-weight`. */
  fontWeight?: number | string;
  /** Sets the weight to 700, overriding `fontWeight`. */
  isBold?: boolean;
  /** Renders the text inline instead of as a block — `inline-block` in `Text`, `inline` in `Heading`. */
  isInline?: boolean;
  /** Renders the text in italics. */
  isItalic?: boolean;
  /** Line height, as an inline style. */
  lineHeight?: string;
  /** Stops the text being selected, on every browser the kit supports. */
  noSelect?: boolean;
  /** Text alignment, as an inline style. */
  textAlign?: "left" | "center" | "right" | "justify";
  /** Tooltip text. On a component the kit wraps in its tooltip HOC it is consumed before the element is built and opens the shared tooltip instead, which needs `RootTooltip` mounted; elsewhere it is the native `title` attribute. */
  title?: string;
  /** Added after the component's own classes. */
  className?: string;
  /** Holds the text on one line and ends it with an ellipsis. It needs a parent of bounded width; on its own the element grows instead. */
  truncate?: boolean;
  /** `id` of the rendered element. */
  id?: string;
  /** Inline style of the element. `Text` merges it over the style props above, so a `fontSize` here wins over the `fontSize` prop. */
  style?: React.CSSProperties;
  /** Writing direction. `"ltr"` and `"rtl"` set the `dir` attribute; `"auto"` instead wraps the children in a span that takes the pointer events off them. */
  dir?: "ltr" | "rtl" | "auto";
  /** Text to render. */
  children?: React.ReactNode;
  /** Called with the event when the element is clicked. */
  onClick?: (e: React.MouseEvent<Element>) => void;
  /** Passed to the element unchanged, for `as="label"`. */
  htmlFor?: string;
  /** Only `"tile"` is recognised, and only together with `dir="auto"`: it clamps the text to two lines. */
  view?: string;
  /** Passed to the element unchanged, for `as="a"`. */
  href?: string;
  /** Passed to the element unchanged, for `as="a"`. */
  rel?: string;
  /** Passed to the element unchanged. The component adds no role, so a focusable text element needs one from you. */
  tabIndex?: number;
  /** Not read here — it reaches the DOM as an unknown attribute. It is read off this element by `RowContent` and `TileContent`, which use it as the width of the slot they put the child in. */
  containerWidth?: string;
  /** Not read here — it reaches the DOM as an unknown attribute. It is read off this element by `RowContent`, which uses it as the minimum width of a side slot. */
  containerMinWidth?: string;
  /** Value of `data-testid` on the element.
   * @default "text" */
  dataTestId?: string;
};
