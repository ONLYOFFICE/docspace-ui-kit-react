import { useId } from "react";
import ContentLoader from "react-content-loader";

import { LOADER_STYLE } from "../../constants";
import type { CircleSkeletonProps } from "./Circle.types";

export type { CircleSkeletonProps };

export const CircleSkeleton = ({
  title = LOADER_STYLE.title,
  x = "12",
  y = "12",
  radius = "12",
  width = "100%",
  height = "100%",
  backgroundColor = LOADER_STYLE.backgroundColor,
  foregroundColor = LOADER_STYLE.foregroundColor,
  backgroundOpacity = LOADER_STYLE.backgroundOpacity,
  foregroundOpacity = LOADER_STYLE.foregroundOpacity,
  speed = LOADER_STYLE.speed,
  animate = LOADER_STYLE.animate,
  uniqueKey,
  ...rest
}: CircleSkeletonProps) => {
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
      // Without a title the skeleton is a decorative placeholder: hide it
      // rather than expose an unnamed image. Mark the region aria-busy.
      aria-hidden={title ? undefined : true}
      {...rest}
      data-testid="circle-skeleton"
    >
      <circle cx={x} cy={y} r={radius} />
    </ContentLoader>
  );
};
