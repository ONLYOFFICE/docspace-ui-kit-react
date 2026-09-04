import { ReactNode, CSSProperties } from "react";
import { TTooltipPlace } from "../tooltip";

export type FieldContainerProps = {
  /** Vertical or horizontal alignment */
  isVertical?: boolean;
  /** Remove default margin property */
  removeMargin?: boolean;
  /** CSS class name for custom styling */
  className?: string;
  /** Indicates that the field is required */
  isRequired?: boolean;
  /** Indicates that the field has an error state */
  hasError?: boolean;
  /** Controls visibility of the field label section */
  labelVisible?: boolean;
  /** Field label text or element */
  labelText?: string | ReactNode;
  /** Icon source URL */
  icon?: string;
  /** Renders the help button inline instead of in a separate div */
  inlineHelpButton?: boolean;
  /** Child elements */
  children: ReactNode;
  /** Content to display in the tooltip */
  tooltipContent?: string | ReactNode;
  /** Global position of the tooltip */
  place?: TTooltipPlace;
  /** Tooltip header content (displayed in aside) */
  helpButtonHeaderContent?: string;
  /** Maximum label width in horizontal alignment (e.g., "110px") */
  maxLabelWidth?: string;
  /** Error message to display when hasError is true */
  errorMessage?: string;
  /** Custom color for error text */
  errorColor?: string;
  /** Width of the error message container (e.g., "293px") */
  errorMessageWidth?: string;
  /** HTML id attribute */
  id?: string;
  /** Inline CSS styles */
  style?: CSSProperties;
  /** Right offset in pixels */
  offsetRight?: number;
  /** Maximum width of the tooltip */
  tooltipMaxWidth?: string;
  /** Additional CSS class for tooltip */
  tooltipClass?: string;

  dataTestId?: string;
};
