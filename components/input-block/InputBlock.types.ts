import React from "react";
import type { TextInputProps } from "../text-input";

type CommonProps = {
  /** Used as HTML `id` property */
  id?: string;
  /** Children elements */
  children?: React.ReactNode;
  /** Component class name */
  className?: string;
  /** Component style */
  style?: React.CSSProperties;
  /** Data test id for testing */
  dataTestId?: string;
  /** Test id for testing */
  testId?: string;

  /** Forwarded ref */
  forwardedRef?: React.Ref<HTMLInputElement>;
};

type InputProps = Omit<TextInputProps, keyof CommonProps>;

type IconProps = {
  /** Path to icon */
  iconName?: string;
  /** Specifies the icon color */
  iconColor?: string;
  /** Icon color on hover action */
  hoverColor?: string;
  /** Size icon */
  iconSize?: number;
  /** Determines if icon fill is needed */
  isIconFill?: boolean;
  /** Icon node */
  iconNode?: React.ReactNode;
  /** The callback function that is triggered when the icon is clicked */
  onIconClick?: (e: React.MouseEvent) => void;
  /** Icon button class name */
  iconButtonClassName?: string;
  noIcon?: boolean;
};

export type InputBlockProps = InputProps & IconProps & CommonProps;
