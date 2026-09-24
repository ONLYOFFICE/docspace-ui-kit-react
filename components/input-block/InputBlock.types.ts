import React from "react";
import type { TextInputProps } from "../text-input";

type CommonProps = {
  /** Applied to the `<input>`, not to the group around it. */
  id?: string;
  /**
   * Rendered before the input, inside the same bordered group — a currency
   * sign, a country code, a fixed prefix.
   */
  children?: React.ReactNode;
  /** Applied to the group. */
  className?: string;
  /** Applied to the group. */
  style?: React.CSSProperties;
  /**
   * `data-testid` of the group.
   * @default "input-block"
   */
  dataTestId?: string;
  /** `data-testid` of the inner `<input>`, passed through to `TextInput`. */
  testId?: string;

  /** Ref to the `<input>` element itself. */
  forwardedRef?: React.Ref<HTMLInputElement>;
};

type InputProps = Omit<TextInputProps, keyof CommonProps>;

type IconProps = {
  /** URL of the icon at the end of the field. */
  iconName?: string;
  /** Colour of that icon. */
  iconColor?: string;
  /** Colour of that icon on hover. */
  hoverColor?: string;
  /** Size of that icon in pixels. It falls back to `size`. */
  iconSize?: number;
  /**
   * Whether the icon's paths are recoloured to `iconColor`. Leave it off for a
   * multi-coloured icon.
   * @default false
   */
  isIconFill?: boolean;
  /** The icon as an element, instead of `iconName`. */
  iconNode?: React.ReactNode;
  /**
   * Called when the icon is clicked. Without it the icon is rendered in the
   * disabled style and does not respond — it is what makes the icon a button.
   */
  onIconClick?: (e: React.MouseEvent) => void;
  /** Applied to the box around the icon. */
  iconButtonClassName?: string;
  /**
   * Whether the icon box is left out entirely. Without it an empty box is still
   * rendered and still takes its padding.
   * @default false
   */
  noIcon?: boolean;
};

export type InputBlockProps = InputProps & IconProps & CommonProps;
