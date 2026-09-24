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
  /** Ignored. The component never reads this prop; pass an icon through `tooltipContent`
   * or render it yourself inside `children`. */
  icon?: string;
  /** Renders the help button inline instead of in a separate div */
  inlineHelpButton?: boolean;
  /** Child elements */
  children: ReactNode;
  /** Content to display in the tooltip */
  tooltipContent?: string | ReactNode;
  /** Global position of the tooltip */
  place?: TTooltipPlace;
  /** Ignored. The component never reads this prop and never passes a header to the help
   * button. */
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
  /** Ignored. The component never reads this prop; the inline help button's own offset is
   * hard-coded to 0. */
  offsetRight?: number;
  /** Maximum width of the tooltip */
  tooltipMaxWidth?: string;
  /** Additional CSS class for tooltip */
  tooltipClass?: string;

  /** `data-testid` of the container. The help button, when there is one, gets
   * `<dataTestId>_help_button`.
   * @default "field-container" */
  dataTestId?: string;
};
