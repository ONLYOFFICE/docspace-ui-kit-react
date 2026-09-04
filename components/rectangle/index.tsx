import { useId } from "react";
import ContentLoader from "react-content-loader";

import { LOADER_STYLE } from "../../constants";
import type { RectangleSkeletonProps } from "./Rectangle.types";

export type { RectangleSkeletonProps };

const RectangleSkeleton = ({
  title = LOADER_STYLE.title,
  x = "0",
  y = "0",
  width = "100%",
  height = "32px",
  borderRadius = LOADER_STYLE.borderRadius,
  backgroundColor = LOADER_STYLE.backgroundColor,
  foregroundColor = LOADER_STYLE.foregroundColor,
  backgroundOpacity = LOADER_STYLE.backgroundOpacity,
  foregroundOpacity = LOADER_STYLE.foregroundOpacity,
  speed = LOADER_STYLE.speed,
  animate = LOADER_STYLE.animate,
  uniqueKey,
  ...rest
}: RectangleSkeletonProps) => {
  // react-content-loader otherwise picks a random uniqueKey per render, which
  // produces SSR/client SVG-id mismatches and triggers React hydration errors.
  const stableKey = useId();
  return (
    <ContentLoader
      title={title}
      width={width}
      height={height}
      backgroundColor={backgroundColor}
      foregroundColor={foregroundColor}
      backgroundOpacity={backgroundOpacity}
      foregroundOpacity={foregroundOpacity}
      speed={speed}
      animate={animate}
      uniqueKey={uniqueKey ?? stableKey}
      {...rest}
      data-testid="rectangle-skeleton"
    >
      <rect
        x={x}
        y={y}
        rx={borderRadius}
        ry={borderRadius}
        width={width}
        height={height}
      />
    </ContentLoader>
  );
};

export { RectangleSkeleton };
