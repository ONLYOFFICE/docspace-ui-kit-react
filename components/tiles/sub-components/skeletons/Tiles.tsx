import React from "react";
import classNames from "classnames";

import { RectangleSkeleton } from "../../../rectangle";

import { TileSkeleton } from "./Tile";
import type { TilesSkeletonProps } from "./Tiles.types";
import styles from "./Tiles.module.scss";

export const TilesSkeleton = ({
  foldersCount = 2,
  filesCount = 8,
  withTitle = true,
  isRooms = false,
  ...rest
}: TilesSkeletonProps) => {
  const folders = [];
  const files = [];

  for (let i = 0; i < foldersCount; i += 1) {
    folders.push(<TileSkeleton isFolder key={`tile-loader-${i}`} {...rest} />);
  }

  for (let i = 0; i < filesCount; i += 1) {
    files.push(<TileSkeleton key={`files-loader-${i}`} {...rest} />);
  }

  const tilesClassNames = classNames(styles.tilesSkeleton, {
    [styles.tilesSkeletonRooms]: isRooms,
  });

  return (
    <div className={styles.tilesWrapper}>
      {foldersCount > 0 ? (
        <RectangleSkeleton
          height="22px"
          width="78px"
          className="folders"
          animate
          {...rest}
        />
      ) : null}
      <div className={tilesClassNames}>{folders}</div>

      {filesCount > 0
        ? withTitle && (
            <RectangleSkeleton
              height="22px"
              width="103px"
              className="files"
              animate
              {...rest}
            />
          )
        : null}
      <div className={tilesClassNames}>{files}</div>
    </div>
  );
};
