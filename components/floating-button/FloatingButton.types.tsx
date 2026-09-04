import type { TColorScheme } from "../../context/ThemeContext";
import { FloatingButtonIcons } from "./FloatingButton.enums";

export type FloatingButtonProps = {
  /** Accepts id */
  id?: string;
  /** Accepts class */
  className?: string;
  /** Accepts CSS style */
  style?: React.CSSProperties;
  /** Sets the icon on the button */
  icon?: keyof typeof FloatingButtonIcons;
   /** Custom icon URL */
  iconUrl?: string;
  /** Displays the alert */
  alert?: boolean;
  /**  Sets a callback function that is triggered when the button is clicked */
  onClick?: (e: React.MouseEvent) => void;
  /** CSS color */
  color?: string;
  clearUploadedFilesHistory?: () => void;
  withoutProgress?: boolean;
  showCancelButton?: boolean;
  showCloseIcon?: boolean;
  completed?: boolean;
  /** Shows the "stopped" status icon: the operation was aborted by the user.
   * Takes precedence over `alert` and `completed`. */
  stopped?: boolean;
  withoutStatus?: boolean;
  /** Loading indicator */
  percent?: number;
};

export type DefaultStylesProps = {
  color?: string;
  displayProgress: boolean;
  $currentColorScheme?: TColorScheme;
};
