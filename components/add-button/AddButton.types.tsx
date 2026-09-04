export type AddButtonProps = {
  /** Title text */
  title?: string;
  /** Sets a callback function that is triggered when the button is clicked */
  onClick?: (e: React.MouseEvent) => void;
  /** Sets the button to present a disabled state */
  isDisabled?: boolean;
  /** Attribute className  */
  className?: string;
  /** Accepts id */
  id?: string;
  /** Accepts css style */
  style?: React.CSSProperties;
  /** Specifies the icon name */
  iconName?: string;
  /** Specifies a custom icon node */
  iconNode?: React.ReactNode;
  /** Change colors to accent */
  isAction?: boolean;
  /** Specifies the icon size */
  iconSize?: number;
  /** Label attribute for text */
  label?: string;
  /** Font size property */
  fontSize?: string;
  /** Title attribute for text */
  titleText?: string;
  /** Disables text selection */
  noSelect?: boolean;
  /** Text direction */
  dir?: "ltr" | "rtl" | "auto";
  /** Sets the line height */
  lineHeight?: string;
  /** Disables word wrapping */
  truncate?: boolean;
  /** Size  the icon container */
  size?: string;
  /** Test id */
  testId?: string;
  /** Shows loading state with spinner */
  isLoading?: boolean;
  /** Tab index for keyboard navigation */
  tabIndex?: number;
};
