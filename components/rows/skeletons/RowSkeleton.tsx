import React from "react";

import { RectangleSkeleton, RectangleSkeletonProps } from "../../rectangle";
import { CircleSkeleton } from "../../circle";
import styles from "./RowsSkeleton.module.scss";

export const RowSkeleton = ({
  id,
  className,
  style,
  isRectangle = true,
  ...rest
}: {
  id?: string;
  key?: string;
  className?: string;
  style?: React.CSSProperties;
  isRectangle?: boolean;
} & RectangleSkeletonProps) => {
  const {
    title,
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
      className={`${className || ""} ${styles.row}`}
      style={style}
      data-testid="row-skeleton"
    >
      {isRectangle ? (
        <RectangleSkeleton
          className="rectangle-content"
          title={title}
          width="32px"
          height="32px"
          borderRadius={borderRadius}
          backgroundColor={backgroundColor}
          foregroundColor={foregroundColor}
          backgroundOpacity={backgroundOpacity}
          foregroundOpacity={foregroundOpacity}
          speed={speed}
          animate={animate}
        />
      ) : (
        <CircleSkeleton
          title={title}
          x="16"
          y="16"
          width="32"
          height="32"
          radius="16"
          backgroundColor={backgroundColor}
          foregroundColor={foregroundColor}
          backgroundOpacity={backgroundOpacity}
          foregroundOpacity={foregroundOpacity}
          speed={speed}
          animate={animate}
        />
      )}

      <div className={`${styles.box} row-content`}>
        <RectangleSkeleton
          className="first-row-content__mobile"
          title={title}
          borderRadius={borderRadius}
          backgroundColor={backgroundColor}
          foregroundColor={foregroundColor}
          backgroundOpacity={backgroundOpacity}
          foregroundOpacity={foregroundOpacity}
          speed={speed}
          animate={animate}
        />
        <RectangleSkeleton
          className="second-row-content__mobile"
          title={title}
          height="16px"
          borderRadius={borderRadius}
          backgroundColor={backgroundColor}
          foregroundColor={foregroundColor}
          backgroundOpacity={backgroundOpacity}
          foregroundOpacity={foregroundOpacity}
          speed={speed}
          animate={animate}
        />
      </div>

      <RectangleSkeleton
        title={title}
        width="16"
        height="16"
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
