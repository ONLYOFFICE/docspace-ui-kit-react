import React from "react";
import { RectangleSkeleton } from "../../../rectangle";

import styles from "./ArticleButtonLoader.module.scss";
import { ButtonLoaderProps } from "./ArticleButtonLoader.types";

export const ArticleButtonLoader = ({
  id,
  className,
  style,
  ...rest
}: ButtonLoaderProps) => {
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
      className={`${styles.container} ${className || ""}`}
      style={style}
      data-testid="article-button-loader"
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
