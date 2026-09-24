export type TextAlignValue =
  "start" | "end" | "left" | "right" | "center" | "justify";

/**
 * Snackbar properties.
 *
 * @typedef {Object} SnackbarProps
 */
export type SnackbarProps = {
  /**
   * Message of the bar, rendered under the header. Ignored when `htmlContent` is set.
   */
  text?: string | React.ReactNode;
  /**
   * Bold line above the message. Without it the heading element is still rendered, hidden with `display: none`.
   */
  headerText?: string;
  /**
   * Label of the inline action, drawn as underlined text after the message. Setting it removes the close cross.
   */
  btnText?: string;
  /**
   * CSS `background-image` value of the bar — a whole shorthand such as `url(/banner.png)`, not a bare path.
   */
  backgroundImg?: string;
  /**
   * Whether the warning icon is drawn before the header.
   */
  showIcon?: boolean;
  /**
   * Called by the action text, by the close cross, when the countdown reaches zero and when a click lands in an iframe. The event is only passed on a real click.
   */
  onAction?: (e?: React.MouseEvent) => void;
  /**
   * Font size of the countdown, as a CSS length. It does not reach the message, whose size is fixed by `--snackbar-text-size`.
   */
  fontSize?: string;
  /**
   * Font weight of the countdown. It does not reach the message either.
   */
  fontWeight?: number;
  /**
   * Text alignment of the header and the message.
   */
  textAlign?: TextAlignValue | "match-parent";
  /**
   * HTML injected instead of `text`, sanitized with `xss`. Under `isCampaigns` it is read as the `src` of an iframe instead.
   */
  htmlContent?: string;
  /**
   * Applied to the outermost element as inline style. It is merged after the opacity and background variables, so it can override them.
   */
  style?: React.CSSProperties;
  /**
   * Milliseconds until the countdown fires `onAction`. Pass `-1` for no countdown at all: `0` fires it on the first frame.
   */
  countDownTime: number;
  /**
   * Minimum width of the iframe on a tablet or wider, in pixels. It does nothing without `htmlContent`.
   */
  sectionWidth: number;
  /**
   * Whether the bar is a campaign banner: `htmlContent` becomes an iframe URL and the only thing drawn over it is a close cross.
   */
  isCampaigns?: boolean;
  /**
   * Called once the bar is mounted. Under `isCampaigns` the iframe's own load is what reveals the cross.
   */
  onLoad?: () => void;
  /**
   * Ignored. Nothing reads this prop, and it reaches the DOM as an unknown attribute.
   */
  isMaintenance?: boolean;
  /**
   * Opacity of the bar. Without it the bar renders fully transparent — the stylesheet falls back to `0`.
   */
  opacity?: number;
  /**
   * Ignored. Nothing reads this prop; the close cross calls `onAction`.
   */
  onClose?: () => void;
  /**
   * Whether the window `blur` listener is skipped. It is on by default and turns a click inside an iframe into an `onAction` half a second later.
   */
  skipBlur?: boolean;
  /**
   * Smaller line drawn next to the header.
   */
  additionalHeaderText?: string;
};

/**
 * Bar configuration.
 *
 * @typedef {Object} BarConfig
 */
export type BarConfig = SnackbarProps & {
  /**
   * `id` of the element the static `SnackBar.show` renders into. When it matches nothing, a `<div id="snackbar">` is appended to `document.body` instead.
   */
  parentElementId: string;
};
