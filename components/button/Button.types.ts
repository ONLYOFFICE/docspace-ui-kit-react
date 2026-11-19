import type { PropsWithChildren } from "react";
import type { ButtonSize } from "./Button.enums";

type BaseButtonProps = PropsWithChildren<{
  /** Rendered in place of `label` when `label` is empty or unset. A non-empty
   * `label` wins and the children are dropped. */
  children?: React.ReactNode;
  /** Ref to the rendered `<button>` element. */
  ref?: React.Ref<HTMLElement>;
  /** Text of the button and its accessible name. When empty, the children are
   * shown instead. */
  label?: string;
  /** Tooltip text shown on hover by the `withTooltip` wrapper. It becomes a
   * native `title` attribute only under `NODE_ENV=test`. */
  title?: string;
  /** Draws the button in the accent colour, for the main action of a view. */
  primary?: boolean;
  /** Draws the button on a neutral grey surface with no border and paints its
   * icon in one colour, the label's hover colour, for toolbar actions. */
  filled?: boolean;
  /** With `filled`, outlines the icon's shapes instead of filling them, for
   * outline-style icons. Does nothing on its own. */
  filledStroke?: boolean;
  /** Draws the button on a light tint of the accent colour, with the text and
   * icon in the accent colour. */
  accent?: boolean;
  /** Height of the button: 24px for `extraSmall`, 32px for `small`, 40px for
   * `normal`, 44px for `medium`. */
  size?: ButtonSize;
  /** Stretches the button to the full width of its container. */
  scale?: boolean;
  /** Shown before the label. Any node, such as an SVG component from your own
   * bundler. */
  icon?: React.ReactNode;
  /** Position of the button in the keyboard tab order. */
  tabIndex?: number;
  /** Class applied to the button after the component's own. */
  className?: string;
  /** HTML id of the button. It also names the `tooltipText` tooltip. */
  id?: string;
  /** Inline styles of the button. `minWidth` is applied over them. */
  style?: React.CSSProperties;
  /** Draws the hover look without a pointer over the button. */
  isHovered?: boolean;
  /** Draws the pressed look without anything pressing the button. */
  isClicked?: boolean;
  /** Greys the button out, takes it out of the tab order and blocks clicks. */
  isDisabled?: boolean;
  /** Covers the content with a spinner, keeping the button's width, and
   * disables the button. */
  isLoading?: boolean;
  /** Smallest width of the button as a CSS length, such as `120px`. */
  minWidth?: string;
  /** Called with the mouse event on a click, Enter or Space. Never called while
   * the button is disabled or loading. */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  /** `submit` submits the surrounding form. Any other value, `reset` included,
   * renders a plain `button`. */
  type?: HTMLButtonElement["type"];
  /** Value of the button's `data-testid` attribute. */
  testId?: string;
}>;

/** Props for the Button component */
export type ButtonProps = BaseButtonProps &
  Omit<React.AriaAttributes, "aria-label" | "aria-disabled" | "aria-busy"> & {
    /** Accessible name of the button, in place of `label`. Names an icon-only
     * button. */
    "aria-label"?: string;
    /** Marks the button disabled to assistive technology while it stays
     * focusable and clickable. `isDisabled` sets it to `true` over this value. */
    "aria-disabled"?: React.AriaAttributes["aria-disabled"];
    /** Marks the button busy to assistive technology. `isLoading` sets it to
     * `true` over this value. */
    "aria-busy"?: React.AriaAttributes["aria-busy"];
    /** Text of a tooltip shown below the button on hover. The button renders it
     * itself, apart from the `title` tooltip. */
    tooltipText?: string;
  };
