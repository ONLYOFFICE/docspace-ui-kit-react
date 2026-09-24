import React from "react";
import type { TextProps } from "../text";
import type { HeadingLevel, HeadingSize } from "./Heading.enums";

export type HeadingType = "header" | "menu" | "content";

export type HeadingProps = TextProps & {
  /** Which heading element is rendered, `h1` through `h6`. It is the semantics only: the size comes from `size`, so a `h3` can be the largest thing on the page.
   * @default HeadingLevel.h1 */
  level?: HeadingLevel;
  /** One of the five preset sizes, 15px to 27px. Ignored while `type` is set, which brings a size of its own.
   * @default HeadingSize.medium */
  size?: HeadingSize;
  /** Portal-sized preset that replaces `size`: `content` 18px, `menu` 23px, `header` 28px, each with a 50px line height. */
  type?: HeadingType;
} & React.AriaAttributes &
  React.HTMLAttributes<HTMLHeadingElement>;
