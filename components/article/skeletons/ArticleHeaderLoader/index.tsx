import React from "react";
import classNames from "classnames";

import { RectangleSkeleton } from "../../../rectangle";

import styles from "./ArticleHeaderLoader.module.scss";
import { HeaderLoaderProps } from "./HeaderLoader.types";

export const ArticleHeaderLoader = ({
  id,
  className,
  style,
  showText,
  ...rest
}: HeaderLoaderProps) => {
  const {
    title,
    width,
    height,
    borderRadius,
    backgroundColor,
    foregroundColor,
    backgroundOpacity,
    foregroundOpacity,
    speed,
    animate,
  } = rest;
  return (
    <div
      id={id}
      className={classNames(styles.header, className)}
      style={style}
      data-show-text={showText ? "true" : "false"}
      data-testid="article-header-loader"
    >
      <RectangleSkeleton
        title={title}
        width={width}
        height={height}
        borderRadius={borderRadius}
        backgroundColor={backgroundColor}
        foregroundColor={foregroundColor}
        backgroundOpacity={backgroundOpacity}
        foregroundOpacity={foregroundOpacity}
        speed={speed}
        animate={animate}
      />
    </div>
  );
};
