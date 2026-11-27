import type React from "react";
import { InputSize } from "../text-input";

export type ColorInputProps = React.AriaAttributes & {
  /** Applied to the outermost element. */
  className?: string;
  /** Applied to the outermost element. */
  id?: string;
  /**
   * Colour the field starts on, as a hex string; the kit's blue when left out.
   * It is read once, on mount: a starting point, not a controlled value.
   */
  defaultColor?: string;
  /**
   * Called with the new hex colour each time the field holds a complete 3- or
   * 6-digit code, and on every move inside the picker. There is no confirm step
   * and no `onApply`.
   */
  handleChange?: (color: string) => void;
  /** Width, font size and padding of the field; the height does not change. */
  size?: InputSize;
  /** Whether the field stretches to fill its container. */
  scale?: boolean;
  /** Whether the field is disabled. The swatch stops opening the picker too. */
  isDisabled?: boolean;
  /** Whether the field is drawn in its error colours. */
  hasError?: boolean;
  /** Whether the field is drawn in its warning colours. */
  hasWarning?: boolean;
  /**
   * `data-testid` of the outermost element.
   * @default "color-input"
   */
  dataTestId?: string;
  /**
   * Accessible name of the hex field. Left out, the kit's own translation of
   * "Color" (`Common:Color`) is used. A passed `aria-label` wins over it.
   */
  inputLabel?: string;
  /** Accessible name of the swatch button that opens the picker. It is not translated for you. */
  pickerButtonLabel?: string;
};
