import type { TextInputProps } from "../text-input";
import type { EmailSettings } from "../../utils/email";

export type TValidate = {
  value: string;
  isValid: boolean;
  errors?: string[];
};

export type EmailInputProps = Omit<
  TextInputProps,
  "type" | "onAnimationStart" | "testId"
> & {
  /** Email validation specific props */
  customValidate?: (value: string) => TValidate;
  emailSettings?: EmailSettings;
  /** Validation callback */
  onValidateInput?: (data: TValidate) => void;
  /** Animation handler */
  handleAnimationStart?: (e: React.AnimationEvent<HTMLInputElement>) => void;
  /** Test id */
  dataTestId?: string;
};
