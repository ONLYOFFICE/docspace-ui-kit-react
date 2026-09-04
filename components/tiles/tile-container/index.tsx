import React from "react";
import classNames from "classnames";
import { TileContainerProps, TileItemProps } from "./TileContainer.types";

import styles from "./TileContainer.module.scss";
import { Heading, HeadingSize } from "../../heading";

export const TileContainer = ({
  children,
  useReactWindow,
  id = "tileContainer",
  className,
  infiniteGrid: InfiniteGrid,
  headingFolders,
  headingFiles,
  isDesc,
  style,
  noSelect,
}: TileContainerProps) => {
  const Rooms: React.ReactElement[] = [];
  const Folders: React.ReactElement[] = [];
  const Files: React.ReactElement[] = [];
  const Templates: React.ReactElement[] = [];

  React.Children.map(children, (item) => {
    if (
      !item ||
      !React.isValidElement<TileItemProps>(item) ||
      !item.props?.item
    )
      return null;

    const {
      isFolder,
      isRoom,
      isTemplate,
      fileExst,
      id: itemId,
    } = item.props.item;

    if ((isFolder || itemId === -1) && !fileExst && !isRoom) {
      Folders.push(
        <div
          className={classNames(
            "tile-item",
            styles.tileItemWrapper,
            styles.folder,
            "folder",
          )}
          key={itemId}
        >
          {item}
        </div>,
      );
    } else if (isTemplate) {
      Templates.push(
        <div
          className={classNames(
            "tile-item",
            styles.tileItemWrapper,
            styles.template,
            "template",
          )}
          key={itemId}
        >
          {item}
        </div>,
      );
    } else if (isRoom) {
      Rooms.push(
        <div
          className={classNames(
            "tile-item",
            styles.tileItemWrapper,
            styles.room,
            "room",
          )}
          key={itemId}
        >
          {item}
        </div>,
      );
    } else {
      Files.push(
        <div
          className={classNames(
            "tile-item",
            styles.tileItemWrapper,
            styles.file,
            "file",
          )}
          key={itemId}
        >
          {item}
        </div>,
      );
    }
  });

  const headingClassNames = classNames(styles.header, {
    [styles.isDesc]: isDesc,
  });

  const renderTile = (
    <>
      {Rooms.length > 0 ? (
        useReactWindow ? (
          Rooms
        ) : (
          <div className={classNames(styles.gridWrapper, styles.rooms)}>
            {Rooms}
          </div>
        )
      ) : null}

      {Templates.length > 0 ? (
        useReactWindow ? (
          Templates
        ) : (
          <div className={classNames(styles.gridWrapper, styles.templates)}>
            {Templates}
          </div>
        )
      ) : null}

      {Folders.length > 0 ? (
        <Heading
          size={HeadingSize.xsmall}
          id="folder-tile-heading"
          className={headingClassNames}
          data-type="header"
        >
          {headingFolders}
        </Heading>
      ) : null}
      {Folders.length > 0 ? (
        useReactWindow ? (
          Folders
        ) : (
          <div className={classNames(styles.gridWrapper, styles.folders)}>
            {Folders}
          </div>
        )
      ) : null}

      {Files.length > 0 ? (
        <Heading
          size={HeadingSize.xsmall}
          className={headingClassNames}
          data-type="header"
        >
          {headingFiles}
        </Heading>
      ) : null}
      {Files.length > 0 ? (
        useReactWindow ? (
          Files
        ) : (
          <div className={classNames(styles.gridWrapper, styles.files)}>
            {Files}
          </div>
        )
      ) : null}
    </>
  );

  const isRooms = Rooms.length > 0;
  const isTemplates = Templates.length > 0;

  return (
    <div
      className={classNames(className, styles.tileContainer, {
        [styles.noSelect]: noSelect,
      })}
      id={id}
      style={style}
    >
      {useReactWindow && InfiniteGrid ? (
        <InfiniteGrid isRooms={isRooms} isTemplates={isTemplates}>
          {renderTile}
        </InfiniteGrid>
      ) : (
        renderTile
      )}
    </div>
  );
};
