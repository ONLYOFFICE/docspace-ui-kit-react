import { ReactNode, CSSProperties } from "react";
import { TTooltipPlace } from "../tooltip";

export type FieldContainerProps = {
  /** Stacks the label above the control. Off, the label sits beside it, down to tablet width */
  isVertical?: boolean;
  /** Drops the container's own 16px bottom margin, for a parent that spaces the fields itself */
  removeMargin?: boolean;
  /** Class added to the container */
  className?: string;
  /** Indicates that the field is required: an asterisk after the caption, and `aria-required` on the control in the field body */
  isRequired?: boolean;
  /** Indicates that the field has an error state: `aria-invalid` on the control in the field body, and the error message when `errorMessage` is set */
  hasError?: boolean;
  /** Shows the label block: the caption, the required marker and the help button. Without it `labelText` renders nothing */
  labelVisible?: boolean;
  /** Caption of the field, as text or an element; shown only with `labelVisible` */
  labelText?: string | ReactNode;
  /** `id` of the control this labels, which becomes the label's `for`. Give the control that
   * same `id` and the caption becomes clickable and is announced with the field; without it
   * the label captions nothing. */
  labelFor?: string;
  /** Draws the help button inside the label, after its text, instead of beside it */
  inlineHelpButton?: boolean;
  /** The control the container labels, with anything around it */
  children: ReactNode;
  /** Text or element of the help button's tooltip. Without it there is no help button */
  tooltipContent?: string | ReactNode;
  /** Side of the help button its tooltip prefers */
  place?: TTooltipPlace;
  /** Width of the label column, as a CSS length; only the horizontal arrangement reads it */
  maxLabelWidth?: string;
  /** Message under the control, shown only while `hasError` is set */
  errorMessage?: string;
  /** CSS colour of the error message, over the theme's error colour */
  errorColor?: string;
  /** Width of the box the error message wraps inside, as a CSS length */
  errorMessageWidth?: string;
  /** Id of the container */
  id?: string;
  /** Inline style of the container, applied to the error message as well */
  style?: CSSProperties;
  /** Class added to the help button */
  tooltipClass?: string;

  /** `data-testid` of the container. The help button, when there is one, gets
   * `<dataTestId>_help_button`.
   * @default "field-container" */
  dataTestId?: string;
};
