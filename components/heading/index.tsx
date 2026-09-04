import React from "react";
import classNames from "classnames";

import styles from "./Heading.module.scss";
import { HeadingProps } from "./Heading.types";
import { HeadingLevel, HeadingSize } from "./Heading.enums";
import { withTooltip } from "../tooltip";

export const HeadingPure = ({
  id,
  level = HeadingLevel.h1,
  color,
  title,
  truncate = false,
  isInline = false,
  className = "",
  size = HeadingSize.medium,
  type,
  children,
  style,
  as,
  fontSize,
  fontWeight,
  lineHeight,
  ...rest
}: HeadingProps) => {
  const Element = (as || `h${level}`) as React.ElementType;

  const classes = classNames(className, styles.heading, {
    [styles.small]: size === HeadingSize.small,
    [styles.medium]: size === HeadingSize.medium,
    [styles.large]: size === HeadingSize.large,
    [styles.xlarge]: size === HeadingSize.xlarge,
    [styles.xsmall]: size === HeadingSize.xsmall,
    [styles.truncate]: truncate,
    [styles.inline]: isInline,
    [styles.header]: type === "header",
    [styles.menu]: type === "menu",
    [styles.content]: type === "content",
    [styles["not-selectable"]]: true,
  });

  return (
    <Element
      id={id}
      title={title}
      className={classes}
      style={{
        ...style,
        color: color || undefined,
        fontSize: fontSize || undefined,
        fontWeight: fontWeight || undefined,
        lineHeight: lineHeight || undefined,
      }}
      data-testid="heading"
      {...rest}
    >
      {children}
    </Element>
  );
};

const Heading = React.memo(HeadingPure);

const HeadingWithTooltip = withTooltip(Heading);

export { Heading, HeadingSize, HeadingLevel, HeadingWithTooltip };
