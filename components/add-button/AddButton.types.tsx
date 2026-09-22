export type AddButtonProps = {
  /** Tooltip shown on hover, through the kit's own tooltip rather than the browser's. */
  title?: string;
  /** Called with the event when the square or the label is clicked, and on Enter when the wrapper has focus. */
  onClick?: (e: React.MouseEvent) => void;
  /** Whether the button is inert: the icon greys out, the label dims and clicks are dropped. */
  isDisabled?: boolean;
  /** Applied to the wrapper that holds the square and the label. */
  className?: string;
  /** Applied to the square, not to the wrapper. */
  id?: string;
  /** Applied to the square as inline style. */
  style?: React.CSSProperties;
  /** URL of the icon, fetched at runtime. Ignored when `iconNode` is set; without either, a plus is drawn. */
  iconName?: string;
  /** Icon element to draw instead of the plus. */
  iconNode?: React.ReactNode;
  /** Whether the square is tinted with the accent colour instead of grey. It needs a colour scheme from the theme. */
  isAction?: boolean;
  /** Size of the icon inside the square, in pixels. */
  iconSize?: number;
  /** Text drawn after the square. Without it the button is the square alone. */
  label?: string;
  /** Font size of the label, as a CSS length. */
  fontSize?: string;
  /** `title` attribute of the label — the browser's own tooltip, unlike `title`. */
  titleText?: string;
  /** Whether the label cannot be selected with the pointer. */
  noSelect?: boolean;
  /** Writing direction of the label. */
  dir?: "ltr" | "rtl" | "auto";
  /** Line height of the label, as a CSS length. */
  lineHeight?: string;
  /** Whether the label is truncated with an ellipsis instead of wrapping. */
  truncate?: boolean;
  /** Side of the square, as a CSS length. It only takes effect when the theme supplies a colour scheme. */
  size?: string;
  /** `data-testid` of the square. */
  testId?: string;
  /** Whether a spinner replaces the icon and clicks are dropped. */
  isLoading?: boolean;
  /** `tabIndex` of the wrapper. Without it the button cannot be focused, and the Enter handler never runs. */
  tabIndex?: number;
};
