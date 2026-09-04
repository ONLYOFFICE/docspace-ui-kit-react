import React from "react";
import type { TextProps } from "../text";
import type { HeadingLevel, HeadingSize } from "./Heading.enums";

export type HeadingType = "header" | "menu" | "content";

export type HeadingProps = TextProps & {
  /** The heading level. It corresponds to the number after the 'H' for the DOM tag. Sets the level for semantic accuracy and accessibility. */
  level?: HeadingLevel;
  /** Sets the size of headline */
  size?: HeadingSize;
  /** Sets the type of headline */
  type?: HeadingType;
} & React.AriaAttributes &
  React.HTMLAttributes<HTMLHeadingElement>;
