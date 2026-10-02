import React from "react";

import classNames from "classnames";

import { RectangleSkeleton } from "../../../rectangle";
import styles from "./Tiles.module.scss";

import type { TileSkeletonProps } from "./Tiles.types";

export const TileSkeleton = ({
  isFolder,
  isRoom,
  title,
  borderRadius,
  backgroundColor,
  foregroundColor,
  backgroundOpacity,
  foregroundOpacity,
  speed,
  className,
  ...rest
}: TileSkeletonProps) => {
  return isFolder ? (
    <div
      className={classNames(styles.tile, "bottom-content", className)}
      data-testid="tile-skeleton-folder"
      {...rest}
    >
      <RectangleSkeleton
        title={title}
        width="100%"
        height="64px"
        borderRadius={borderRadius || "12px"}
        backgroundColor={backgroundColor}
        foregroundColor={foregroundColor}
        backgroundOpacity={backgroundOpacity}
        foregroundOpacity={foregroundOpacity}
        speed={speed}
        animate
      />
    </div>
  ) : isRoom ? (
    <div
      className={classNames(styles.tile, className)}
      data-testid="tile-skeleton-room"
      {...rest}
    >
      <div className={styles.roomTile} data-testid="room-tile-content">
        <div className={styles.roomTileTopContent}>
          <RectangleSkeleton
            title={title}
            width="32px"
            height="32px"
            borderRadius={borderRadius}
            backgroundColor={backgroundColor}
            foregroundColor={foregroundColor}
            backgroundOpacity={backgroundOpacity}
            foregroundOpacity={foregroundOpacity}
            speed={speed}
            animate
          />
          <RectangleSkeleton
            title={title}
            height="22px"
            borderRadius={borderRadius}
            backgroundColor={backgroundColor}
            foregroundColor={foregroundColor}
            backgroundOpacity={backgroundOpacity}
            foregroundOpacity={foregroundOpacity}
            speed={speed}
            animate
          />
          <RectangleSkeleton
            title={title}
            height="16px"
            width="16px"
            borderRadius={borderRadius}
            backgroundColor={backgroundColor}
            foregroundColor={foregroundColor}
            backgroundOpacity={backgroundOpacity}
            foregroundOpacity={foregroundOpacity}
            speed={speed}
            animate
          />
        </div>
        <div className={styles.roomTileBottomContent}>
          <RectangleSkeleton
            title={title}
            height="24px"
            width="50px"
            borderRadius={borderRadius}
            backgroundColor={backgroundColor}
            foregroundColor={foregroundColor}
            backgroundOpacity={backgroundOpacity}
            foregroundOpacity={foregroundOpacity}
            speed={speed}
            animate
          />
          <RectangleSkeleton
            title={title}
            height="24px"
            width="50px"
            borderRadius={borderRadius}
            backgroundColor={backgroundColor}
            foregroundColor={foregroundColor}
            backgroundOpacity={backgroundOpacity}
            foregroundOpacity={foregroundOpacity}
            speed={speed}
            animate
          />
        </div>
      </div>
    </div>
  ) : (
    <div
      className={classNames(styles.tile, styles.file, className)}
      data-testid="tile-skeleton-file"
      {...rest}
    >
      <RectangleSkeleton
        title={title}
        height="220px"
        borderRadius={borderRadius || "12px"}
        backgroundColor={backgroundColor}
        foregroundColor={foregroundColor}
        backgroundOpacity={backgroundOpacity}
        foregroundOpacity={foregroundOpacity}
        speed={speed}
        animate
      />
    </div>
  );
};
