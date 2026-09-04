import { isDesktop } from "../../../utils";

import {
  type RectangleSkeletonProps,
  RectangleSkeleton,
} from "../../rectangle";

import styles from "./Skeleton.module.scss";

export type ContextMenuSkeletonProps = {
  id?: string;
  style?: React.CSSProperties;
  isRectangle?: boolean;
};

const ContextMenuSkeleton = ({
  id,
  className,
  style,
  ...rest
}: ContextMenuSkeletonProps & RectangleSkeletonProps) => {
  const {
    title,

    backgroundColor,
    foregroundColor,
    backgroundOpacity,
    foregroundOpacity,
    speed,
    animate,
  } = rest;

  const isDesktopView = isDesktop();

  return (
    <div
      id={id}
      className={`${styles.container} ${className || ""}`}
      style={style}
    >
      <RectangleSkeleton
        className="rectangle-content"
        title={title}
        width="16px"
        height="16px"
        borderRadius="3px"
        backgroundColor={backgroundColor}
        foregroundColor={foregroundColor}
        backgroundOpacity={backgroundOpacity}
        foregroundOpacity={foregroundOpacity}
        speed={speed}
        animate={animate}
      />
      <RectangleSkeleton
        className={styles.rectangle}
        title={title}
        width={isDesktopView ? "97px" : "102px"}
        height={isDesktopView ? "16px" : "20px"}
        borderRadius="3px"
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

export { ContextMenuSkeleton };
