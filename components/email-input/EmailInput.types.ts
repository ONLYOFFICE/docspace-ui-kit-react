import type { TextInputProps } from "../text-input";
import type { EmailSettings } from "../../utils/email";

export type TValidate = {
  /** The value that was checked. */
  value: string;
  /** Whether the address parsed cleanly. */
  isValid: boolean;
  /** Translation keys for what went wrong, not messages ready to show. */
  errors?: string[];
};

export type EmailInputProps = Omit<
  TextInputProps,
  "type" | "onAnimationStart" | "testId"
> & {
  /**
   * Replaces the built-in parser outright. Return the same shape; the component
   * uses `isValid` to decide whether to colour the field.
   */
  customValidate?: (value: string) => TValidate;
  /** Options for the built-in parser: which forms of address to accept. */
  emailSettings?: EmailSettings;
  /**
   * Called after every keystroke with the result of the check, whichever parser
   * ran.
   */
  onValidateInput?: (data: TValidate) => void;
  /**
   * Native `animationstart` on the field. It exists to catch the browser's
   * autofill animation, which fires no change event.
   */
  handleAnimationStart?: (e: React.AnimationEvent<HTMLInputElement>) => void;
  /**
   * `data-testid` of the field.
   * @default "email-input"
   */
  dataTestId?: string;
};
