import type { TColorScheme } from "../../context/ThemeContext";
import { FloatingButtonIcons } from "./FloatingButton.enums";

export type FloatingButtonProps = {
  /** Applied to the circle, not to the wrapper that positions it. */
  id?: string;
  /** Applied to the circle, after the component's own classes. */
  className?: string;
  /** Applied to the circle as inline style. */
  style?: React.CSSProperties;
  /** Which of the built-in icons is drawn in the middle. Ignored when `iconUrl` is set. */
  icon?: keyof typeof FloatingButtonIcons;
  /** URL of an image to draw instead of the built-in icon, at 20px wide. */
  iconUrl?: string;
  /** Whether the badge shows the warning triangle. `stopped` wins over it. */
  alert?: boolean;
  /** Called with the event when the circle is clicked. The cancel cross has its own handler. */
  onClick?: (e: React.MouseEvent) => void;
  /** CSS colour of the circle and of the progress ring. Without it the accent colour is used. */
  color?: string;
  /** Called when the cancel cross is clicked. */
  clearUploadedFilesHistory?: () => void;
  /** Whether the progress ring is left out entirely, leaving the bare circle. */
  withoutProgress?: boolean;
  /** Whether the cancel cross exists at all. It is only visible on hover unless `showCloseIcon` is set. */
  showCancelButton?: boolean;
  /** Whether that cross stays visible without hovering. */
  showCloseIcon?: boolean;
  /** Whether the operation is finished: the ring fades out and the circle pulses once. */
  completed?: boolean;
  /** Shows the "stopped" status icon: the operation was aborted by the user.
   * Takes precedence over `alert` and `completed`. */
  stopped?: boolean;
  /** Whether the status badge is suppressed whatever `stopped`, `alert` and `completed` say. */
  withoutStatus?: boolean;
  /** How much of the ring is filled, 0–100. Without it the ring spins instead. */
  percent?: number;
};

export type DefaultStylesProps = {
  color?: string;
  displayProgress: boolean;
  $currentColorScheme?: TColorScheme;
};
